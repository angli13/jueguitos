/*
 * src/dashboard.js — Panel para padres (extremadamente sencillo).
 *
 * Muestra solo: tiempo jugado, días consecutivos, palabras aprendidas, palabras difíciles,
 * precisión y progreso general. Sin estadísticas complejas.
 *
 * Tiene una "verja" simple anti-niño: una pequeña suma que un adulto resuelve para entrar.
 */
(function () {
  window.Isla = window.Isla || {};

  function fmtTime(ms) {
    var min = Math.round(ms / 60000);
    if (min < 60) return min + ' min';
    var h = Math.floor(min / 60);
    return h + ' h ' + (min % 60) + ' min';
  }

  function stats() {
    var state = window.Isla.storage.get();
    var ok = state.totals.palabrasOk, intentos = state.totals.intentos;
    var precision = intentos ? Math.round((ok / intentos) * 100) : 0;

    // Palabras difíciles: vistas, con más errores que aciertos o dominio bajo.
    var dificiles = window.Isla.WORDS.filter(function (w) {
      var s = state.words[w.id];
      return s && (s.errores >= 2 && s.dominio < 3);
    }).map(function (w) { return w.text; });

    var mastered = window.Isla.scheduler.masteredCount();
    var prog = window.Isla.world.progress();

    return {
      tiempo: fmtTime(state.totals.tiempoMs),
      racha: state.streak.dias,
      aprendidas: mastered,
      totalPalabras: window.Isla.WORDS.length,
      dificiles: dificiles,
      precision: precision,
      progresoIsla: Math.round((prog.hechas / prog.total) * 100)
    };
  }

  // Verja: genera una suma y valida la respuesta.
  function makeGate() {
    var a = 3 + Math.floor(Math.random() * 6);
    var b = 2 + Math.floor(Math.random() * 6);
    return { pregunta: '¿Cuánto es ' + a + ' + ' + b + '?', respuesta: a + b };
  }

  window.Isla.dashboard = {
    stats: stats,
    makeGate: makeGate
  };
})();
