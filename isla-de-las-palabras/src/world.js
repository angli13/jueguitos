/*
 * src/world.js — La Isla de las Palabras (mundo que se construye).
 *
 * Una escena SVG con una lista fija de "piezas". Cada acierto desbloquea la siguiente
 * pieza, que aparece con una pequeña animación. El estado es permanente (se guarda en
 * storage.world.unlocked). Sin monedas, sin compras: el progreso ES la recompensa.
 */
(function () {
  window.Isla = window.Isla || {};
  var SVG = 'http://www.w3.org/2000/svg';

  // Orden de construcción de la isla. emoji + posición en el viewBox 800x400.
  var PIECES = [
    { id: 'lago',     emoji: '🟦', x: 150, y: 250, size: 60, label: 'un lago' },
    { id: 'camino',   emoji: '🟫', x: 400, y: 320, size: 50, label: 'un camino' },
    { id: 'arbol1',   emoji: '🌳', x: 250, y: 180, size: 54, label: 'un árbol' },
    { id: 'flor1',    emoji: '🌷', x: 330, y: 250, size: 38, label: 'una flor' },
    { id: 'casa1',    emoji: '🏠', x: 500, y: 200, size: 56, label: 'una casa' },
    { id: 'arbol2',   emoji: '🌲', x: 600, y: 160, size: 54, label: 'un pino' },
    { id: 'flor2',    emoji: '🌻', x: 430, y: 270, size: 38, label: 'un girasol' },
    { id: 'puente',   emoji: '🌉', x: 200, y: 300, size: 56, label: 'un puente' },
    { id: 'molino',   emoji: '🌬️', x: 680, y: 230, size: 48, label: 'un molino' },
    { id: 'pato',     emoji: '🦆', x: 170, y: 270, size: 36, label: 'un pato' },
    { id: 'conejo',   emoji: '🐰', x: 360, y: 200, size: 36, label: 'un conejo' },
    { id: 'casa2',    emoji: '🏡', x: 560, y: 250, size: 52, label: 'otra casa' },
    { id: 'arbol3',   emoji: '🌴', x: 720, y: 290, size: 54, label: 'una palmera' },
    { id: 'mariposa', emoji: '🦋', x: 300, y: 130, size: 34, label: 'una mariposa' },
    { id: 'arcoiris', emoji: '🌈', x: 470, y: 110, size: 60, label: 'un arcoíris' },
    { id: 'sol',      emoji: '☀️', x: 700, y: 90,  size: 56, label: 'el sol' }
  ];

  var svgEl;

  function unlocked() { return window.Isla.storage.get().world.unlocked; }

  function drawBase() {
    svgEl.innerHTML = '';
    // cielo
    var sky = document.createElementNS(SVG, 'rect');
    sky.setAttribute('x', 0); sky.setAttribute('y', 0);
    sky.setAttribute('width', 800); sky.setAttribute('height', 400);
    sky.setAttribute('fill', '#bfe9ff');
    svgEl.appendChild(sky);
    // agua
    var sea = document.createElementNS(SVG, 'rect');
    sea.setAttribute('x', 0); sea.setAttribute('y', 300);
    sea.setAttribute('width', 800); sea.setAttribute('height', 100);
    sea.setAttribute('fill', '#7ec8e3');
    svgEl.appendChild(sea);
    // isla
    var island = document.createElementNS(SVG, 'ellipse');
    island.setAttribute('cx', 400); island.setAttribute('cy', 320);
    island.setAttribute('rx', 360); island.setAttribute('ry', 110);
    island.setAttribute('fill', '#8fd17a');
    svgEl.appendChild(island);
  }

  function addPiece(piece, animate) {
    var t = document.createElementNS(SVG, 'text');
    t.setAttribute('x', piece.x);
    t.setAttribute('y', piece.y);
    t.setAttribute('font-size', piece.size);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('dominant-baseline', 'central');
    t.textContent = piece.emoji;
    if (animate) t.setAttribute('class', 'pieza-pop');
    svgEl.appendChild(t);
  }

  window.Isla.world = {
    init: function (el) { svgEl = el; this.render(); },

    render: function () {
      if (!svgEl) return;
      drawBase();
      var set = unlocked();
      PIECES.forEach(function (p) { if (set.indexOf(p.id) >= 0) addPiece(p, false); });
    },

    // Desbloquea la siguiente pieza. Devuelve la pieza o null si la isla está completa.
    unlockNext: function () {
      var state = window.Isla.storage.get();
      state.world.xp += 10;
      var set = state.world.unlocked;
      var next = PIECES.find(function (p) { return set.indexOf(p.id) < 0; });
      if (next) {
        set.push(next.id);
        window.Isla.storage.save();
        if (svgEl) addPiece(next, true);
        return next;
      }
      // Isla completa: se reinicia el ciclo de construcción para seguir creciendo.
      window.Isla.storage.save();
      return null;
    },

    progress: function () {
      return { hechas: unlocked().length, total: PIECES.length };
    }
  };
})();
