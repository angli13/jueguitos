/*
 * src/main.js — Arranque, racha diaria, cableado de botones y bucle de juego.
 *
 * Ciclo (5–9): el juego dicta -> el niño escribe -> evaluamos -> feedback positivo ->
 * recompensa -> la isla crece -> siguiente palabra.
 */
(function () {
  window.Isla = window.Isla || {};
  var ui = window.Isla.ui;

  var SESSION_GOAL = 8;        // palabras por tanda antes de ofrecer el resumen
  var MAX_TRIES = 2;          // tras 2 intentos fallidos, seguimos (sin castigar)

  var currentWord = null, currentMode = 'guia', wordStart = 0, tries = 0;
  var sessionWords = 0;
  var locked = false;         // evita doble "listo" durante animaciones

  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function yesterdayStr() { var d = new Date(Date.now() - 86400000); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

  function updateStreak() {
    var st = window.Isla.storage.get();
    var hoy = today();
    if (st.streak.ultimaFecha === hoy) return;
    if (st.streak.ultimaFecha === yesterdayStr()) st.streak.dias = (st.streak.dias || 0) + 1;
    else st.streak.dias = 1;
    st.streak.ultimaFecha = hoy;
    // nueva sesión del día
    st.session = { fecha: hoy, palabras: 0, tiempoMs: 0 };
    window.Isla.storage.save();
  }

  function nextWord() {
    locked = false;
    tries = 0;
    ui.clearFeedback();
    currentWord = window.Isla.scheduler.next();
    currentMode = window.Isla.LEVEL_MODE[currentWord.level] || 'guia';
    window.Isla.canvas.newWord(currentWord, currentMode);
    var modoTxt = { guia: 'Traza la palabra', desvanecido: 'Escribe sobre la guía', libre: 'Escribe tú la palabra' };
    ui.setMision('✏️ ' + (modoTxt[currentMode] || 'Escribe la palabra'));
    wordStart = Date.now();
    // pequeño respiro antes de dictar para que el niño mire la pantalla
    setTimeout(function () { window.Isla.audio.dictate(currentWord); }, 350);
  }

  function finishWordSuccess() {
    var elapsed = Date.now() - wordStart;
    window.Isla.scheduler.record(currentWord, true, elapsed);
    accumulateTime(elapsed);

    var piece = window.Isla.world.unlockNext();
    window.Isla.rewards.celebrate(piece);

    sessionWords++;
    var st = window.Isla.storage.get();
    st.session.palabras = (st.session.palabras || 0) + 1;
    window.Isla.storage.save();

    locked = true;
    setTimeout(function () {
      if (sessionWords >= SESSION_GOAL) showResumen();
      else nextWord();
    }, 1500);
  }

  function finishWordFail(record) {
    var elapsed = Date.now() - wordStart;
    if (record) {
      window.Isla.scheduler.record(currentWord, false, elapsed);
      accumulateTime(elapsed);
      locked = true;
      setTimeout(nextWord, 1600);
    }
  }

  function accumulateTime(ms) {
    var st = window.Isla.storage.get();
    var capped = Math.min(ms, 60000); // evita inflar el tiempo si dejó la app abierta
    st.totals.tiempoMs += capped;
    st.session.tiempoMs = (st.session.tiempoMs || 0) + capped;
    window.Isla.storage.save();
  }

  function onListo() {
    if (locked || !currentWord) return;
    var metrics = window.Isla.canvas.analyze();
    var res = window.Isla.evaluator.evaluate(currentMode, metrics);
    var msg = window.Isla.feedback.message(res.tipo);

    if (res.success) {
      ui.setFeedback(msg, true);
      finishWordSuccess();
    } else {
      tries++;
      if (tries >= MAX_TRIES) {
        ui.setFeedback('¡Buen intento! Vamos con otra. 🌱', false);
        finishWordFail(true);
      } else {
        ui.setFeedback(msg, false);
        // dale otra oportunidad: limpia y vuelve a dictar
        window.Isla.canvas.clear();
        window.Isla.audio.speakWord(currentWord.text);
      }
    }
  }

  function startSession() {
    updateStreak();
    sessionWords = 0;
    ui.showScreen('pantalla-juego');
    nextWord();
  }

  function showResumen() {
    ui.renderResumen(sessionWords);
    ui.showScreen('pantalla-resumen');
  }

  // ---- panel de padres con verja ----
  var gate = null;
  function openPadres() {
    gate = window.Isla.dashboard.makeGate();
    ui.$('verja-pregunta').textContent = gate.pregunta;
    ui.$('verja-respuesta').value = '';
    ui.$('verja').classList.remove('oculto');
    ui.$('padres-contenido').classList.add('oculto');
    ui.showScreen('pantalla-padres');
  }
  function checkGate() {
    var val = parseInt(ui.$('verja-respuesta').value, 10);
    if (val === gate.respuesta) {
      ui.$('verja').classList.add('oculto');
      ui.$('padres-contenido').classList.remove('oculto');
      ui.renderPadres();
    } else {
      ui.$('verja-pregunta').textContent = 'Mmm, intenta otra vez: ' + gate.pregunta;
      ui.$('verja-respuesta').value = '';
    }
  }

  function bind() {
    ui.$('btn-jugar').addEventListener('click', startSession);
    ui.$('btn-listo').addEventListener('click', onListo);
    ui.$('btn-borrar').addEventListener('click', function () { window.Isla.canvas.clear(); ui.clearFeedback(); });
    ui.$('btn-repetir').addEventListener('click', function () { if (currentWord) window.Isla.audio.dictate(currentWord); });
    ui.$('btn-salir').addEventListener('click', function () { ui.renderInicio(); ui.showScreen('pantalla-inicio'); });

    ui.$('btn-seguir').addEventListener('click', startSession);
    ui.$('btn-terminar').addEventListener('click', function () { ui.renderInicio(); ui.showScreen('pantalla-inicio'); });
    ui.$('btn-ver-isla').addEventListener('click', function () { ui.renderMundo(); ui.showScreen('pantalla-mundo'); });
    ui.$('btn-mundo-volver').addEventListener('click', function () { ui.renderInicio(); ui.showScreen('pantalla-inicio'); });

    ui.$('btn-padres').addEventListener('click', openPadres);
    ui.$('verja-ok').addEventListener('click', checkGate);
    ui.$('verja-respuesta').addEventListener('keydown', function (e) { if (e.key === 'Enter') checkGate(); });
    ui.$('btn-padres-volver').addEventListener('click', function () { ui.renderInicio(); ui.showScreen('pantalla-inicio'); });
    ui.$('btn-reiniciar').addEventListener('click', function () {
      if (window.confirm('¿Borrar todo el progreso del niño? Esta acción no se puede deshacer.')) {
        window.Isla.storage.reset();
        window.Isla.world.render();
        ui.renderPadres();
      }
    });
  }

  // Recalcula el canvas cuando el dispositivo rota o la ventana cambia de tamaño.
  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { window.Isla.canvas.resize(); }, 120);
  }

  function init() {
    window.Isla.canvas.init(ui.$('area-escritura'));
    window.Isla.world.init(ui.$('isla-svg'));
    bind();
    window.addEventListener('resize', onResize);
    screen.orientation && screen.orientation.addEventListener('change', onResize);
    ui.renderInicio();
    ui.showScreen('pantalla-inicio');
    if (!window.Isla.audio.available()) {
      ui.setMision('🔇 Activa el sonido de tu dispositivo para escuchar las palabras.');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
