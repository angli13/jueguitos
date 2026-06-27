/*
 * src/scheduler.js — Sistema adaptativo + repetición espaciada.
 *
 * - Cada palabra guarda estadísticas y un nivel de dominio (0..5).
 * - Tras un acierto, la palabra "vence" más tarde según la escala:
 *      10 min, 1 día, 3 días, 7 días, 15 días, 30 días.
 * - Un error reduce bruscamente el dominio (vuelve a aparecer pronto).
 * - La selección prioriza palabras vencidas y difíciles, e introduce palabras nuevas
 *   del nivel adecuado solo cuando hay suficiente dominio en el nivel actual.
 */
(function () {
  window.Isla = window.Isla || {};

  var MIN = 60 * 1000, DAY = 24 * 60 * MIN;
  // Índice = dominio (0..5). Tras acierto el dominio sube y se usa este intervalo.
  var INTERVALS = [10 * MIN, 1 * DAY, 3 * DAY, 7 * DAY, 15 * DAY, 30 * DAY];

  function now() { return Date.now(); }

  function ensureStat(state, id) {
    if (!state.words[id]) {
      state.words[id] = { aciertos: 0, errores: 0, ultimoIntento: 0, tiempoPromedioMs: 0, dominio: 0, dueAt: 0 };
    }
    return state.words[id];
  }

  // Registra el resultado de un intento y reprograma la palabra.
  function record(word, success, elapsedMs) {
    var state = window.Isla.storage.get();
    var s = ensureStat(state, word.id);
    s.ultimoIntento = now();
    s.tiempoPromedioMs = s.tiempoPromedioMs
      ? Math.round(s.tiempoPromedioMs * 0.7 + elapsedMs * 0.3)
      : elapsedMs;

    state.totals.intentos++;
    if (success) {
      s.aciertos++;
      state.totals.palabrasOk++;
      s.dominio = Math.min(5, s.dominio + 1);
    } else {
      s.errores++;
      s.dominio = Math.max(0, s.dominio - 2); // baja fuerte: reaparece pronto
    }
    s.dueAt = now() + INTERVALS[s.dominio];
    window.Isla.storage.save();
    return s;
  }

  // ¿Está la palabra "aprendida" (dominio alto)?
  function isMastered(state, id) {
    var s = state.words[id];
    return s && s.dominio >= 4;
  }

  // Devuelve el nivel máximo que el niño debería ver ahora (desbloqueo gradual).
  function unlockedLevel(state) {
    var byLevel = { 1: 0, 2: 0, 3: 0 };
    window.Isla.WORDS.forEach(function (w) {
      if (isMastered(state, w.id)) byLevel[w.level] = (byLevel[w.level] || 0) + 1;
    });
    var level = 1;
    if (byLevel[1] >= 8) level = 2;   // domina 8 del nivel 1 -> abre nivel 2
    if (byLevel[2] >= 8) level = 3;   // domina 8 del nivel 2 -> abre nivel 3
    return level;
  }

  // Elige la siguiente palabra a presentar.
  function next() {
    var state = window.Isla.storage.get();
    var t = now();
    var maxLevel = unlockedLevel(state);
    var pool = window.Isla.WORDS.filter(function (w) { return w.level <= maxLevel; });

    // 1) Palabras vencidas (ya vistas y cuyo dueAt pasó), ordenadas por urgencia y dificultad.
    var due = pool.filter(function (w) {
      var s = state.words[w.id];
      return s && s.dueAt <= t;
    }).sort(function (a, b) {
      var sa = state.words[a.id], sb = state.words[b.id];
      // más errores y vencimiento más antiguo primero
      return (sb.errores - sa.errores) || (sa.dueAt - sb.dueAt);
    });
    if (due.length) {
      // No repetir exactamente la última si hay alternativas.
      var first = due[0];
      if (last && first.id === last && due.length > 1) first = due[1];
      return first;
    }

    // 2) Palabras nuevas (nunca vistas) del nivel adecuado, de menor a mayor nivel.
    var nueva = pool.filter(function (w) { return !state.words[w.id]; })
      .sort(function (a, b) { return a.level - b.level; })[0];
    if (nueva) return nueva;

    // 3) Si todas vistas pero ninguna vencida: la de menor dominio (refuerzo).
    var refuerzo = pool.slice().sort(function (a, b) {
      return (state.words[a.id].dominio) - (state.words[b.id].dominio);
    })[0];
    return refuerzo || pool[0];
  }

  var last = null; // id de la última palabra mostrada

  window.Isla.scheduler = {
    record: record,
    next: function () { var w = next(); last = w && w.id; return w; },
    unlockedLevel: function () { return unlockedLevel(window.Isla.storage.get()); },
    isMastered: function (id) { return isMastered(window.Isla.storage.get(), id); },
    masteredCount: function () {
      var state = window.Isla.storage.get();
      return window.Isla.WORDS.filter(function (w) { return isMastered(state, w.id); }).length;
    }
  };
})();
