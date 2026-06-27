/*
 * src/storage.js — Persistencia local.
 *
 * Envuelve localStorage con try/catch y un fallback en memoria, porque algunos navegadores
 * limitan el almacenamiento cuando se abre el archivo directamente con file://.
 * Todo el estado vive bajo una sola clave: "isla_v1".
 */
(function () {
  window.Isla = window.Isla || {};
  var KEY = 'isla_v1';
  var memory = null; // fallback si localStorage no está disponible

  function defaultState() {
    return {
      version: 1,
      words: {},            // id -> { aciertos, errores, ultimoIntento, tiempoPromedioMs, dominio, dueAt }
      world: { unlocked: [], xp: 0 },
      streak: { dias: 0, ultimaFecha: null },
      totals: { tiempoMs: 0, palabrasOk: 0, intentos: 0 },
      session: { fecha: null, palabras: 0, tiempoMs: 0 },
      unlocks: { personajes: [], mascotas: [], decoraciones: [] },
      settings: { vozRate: 0.85, vozLang: 'es-ES', vozNombre: null }
    };
  }

  function read() {
    if (memory) return memory;
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* localStorage no disponible */ }
    return defaultState();
  }

  function write(state) {
    memory = state; // siempre mantenemos copia en memoria
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) { /* ignoramos: seguimos con la copia en memoria */ }
  }

  // Estado vivo en memoria; se persiste con save().
  var state = read();
  // Garantiza forma completa aunque venga de una versión anterior.
  state = Object.assign(defaultState(), state);

  window.Isla.storage = {
    get: function () { return state; },
    save: function () { write(state); },
    reset: function () { state = defaultState(); write(state); return state; },
    defaultState: defaultState
  };
})();
