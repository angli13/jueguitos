/*
 * src/ui.js — Cambios de pantalla y render de paneles (inicio, resumen, mundo, padres).
 * El cableado de botones y el bucle de juego viven en main.js.
 */
(function () {
  window.Isla = window.Isla || {};

  function $(id) { return document.getElementById(id); }

  function showScreen(id) {
    var screens = document.querySelectorAll('.pantalla');
    screens.forEach(function (s) { s.classList.toggle('activa', s.id === id); });
  }

  function renderInicio() {
    var st = window.Isla.storage.get();
    var racha = st.streak.dias || 0;
    var el = $('inicio-racha');
    if (el) {
      el.textContent = racha > 0
        ? '🔥 ' + racha + (racha === 1 ? ' día seguido' : ' días seguidos')
        : '¡Empieza tu aventura!';
    }
  }

  function renderResumen(palabrasHoy) {
    var prog = window.Isla.world.progress();
    $('resumen-palabras').textContent = palabrasHoy;
    $('resumen-isla').textContent = prog.hechas + ' / ' + prog.total;
    var st = window.Isla.storage.get();
    $('resumen-racha').textContent = (st.streak.dias || 1);
  }

  function renderMundo() {
    window.Isla.world.render();
    var prog = window.Isla.world.progress();
    var el = $('mundo-progreso');
    if (el) el.textContent = 'Isla: ' + prog.hechas + ' / ' + prog.total + ' construcciones';
  }

  function renderPadres() {
    var s = window.Isla.dashboard.stats();
    $('stat-tiempo').textContent = s.tiempo;
    $('stat-racha').textContent = s.racha + (s.racha === 1 ? ' día' : ' días');
    $('stat-aprendidas').textContent = s.aprendidas + ' / ' + s.totalPalabras;
    $('stat-precision').textContent = s.precision + '%';
    $('stat-progreso').textContent = s.progresoIsla + '%';
    var dif = $('stat-dificiles');
    dif.innerHTML = '';
    if (!s.dificiles.length) {
      dif.textContent = '¡Ninguna por ahora! 🎉';
    } else {
      s.dificiles.slice(0, 12).forEach(function (w) {
        var chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = w;
        dif.appendChild(chip);
      });
    }
  }

  function setMision(text) { var e = $('mision'); if (e) e.textContent = text; }

  function setFeedback(text, success) {
    var e = $('feedback');
    if (!e) return;
    e.textContent = text;
    e.classList.remove('oculto');
    e.classList.toggle('feliz', !!success);
    e.classList.toggle('animo', !success);
  }
  function clearFeedback() { var e = $('feedback'); if (e) e.classList.add('oculto'); }

  window.Isla.ui = {
    $: $,
    showScreen: showScreen,
    renderInicio: renderInicio,
    renderResumen: renderResumen,
    renderMundo: renderMundo,
    renderPadres: renderPadres,
    setMision: setMision,
    setFeedback: setFeedback,
    clearFeedback: clearFeedback
  };
})();
