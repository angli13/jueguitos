/*
 * src/canvas.js — Lienzo de escritura manual.
 *
 * Dos capas apiladas:
 *   - guideCanvas: las letras "fantasma" que sirven de guía (según el modo).
 *   - inkCanvas:   el trazo del niño (dedo / stylus / lápiz vía Pointer Events).
 *
 * Para evaluar, dividimos el área en una rejilla de celdas. Al renderizar la palabra
 * objetivo marcamos qué celdas pertenecen a cada letra ("máscara"). Mientras el niño
 * dibuja, marcamos las celdas que va cubriendo. La comparación de ambos conjuntos da
 * la cobertura por letra (ver evaluator.js).
 *
 * Modos:
 *   - 'guia':         guía bien visible, siempre presente.
 *   - 'desvanecido':  guía tenue que se desvanece tras el primer trazo.
 *   - 'libre':        sin guía; solo puntos que indican cuántas letras hay (ortografía).
 */
(function () {
  window.Isla = window.Isla || {};

  var CELL = 12;            // tamaño de celda en px lógicos
  var BRUSH_CELLS = 2;      // radio del "pincel" en celdas para marcar cobertura
  var TOL_CELLS = 2;        // tolerancia (dilatación de la máscara objetivo)

  var guideCanvas, inkCanvas, gctx, ictx, container;
  var W = 0, H = 0, gw = 0, gh = 0;
  var targetGrid, letterGrid, coveredGrid, dilatedGrid;
  var letterCount = 0;
  var strokes = [], current = null, drawing = false, hasInk = false;
  var mode = 'guia';
  var faded = false;

  function font(size) {
    return 'bold ' + size + 'px "Comic Sans MS", "Trebuchet MS", "Segoe UI", system-ui, sans-serif';
  }

  function sizeCanvases() {
    var rect = container.getBoundingClientRect();
    W = Math.max(200, Math.floor(rect.width));
    H = Math.max(160, Math.floor(rect.height));
    [guideCanvas, inkCanvas].forEach(function (c) { c.width = W; c.height = H; });
    gw = Math.ceil(W / CELL);
    gh = Math.ceil(H / CELL);
  }

  // Calcula el tamaño de fuente para que la palabra quepa cómodamente.
  function fitFontSize(text) {
    var size = Math.floor(H * 0.55);
    gctx.font = font(size);
    var w = gctx.measureText(text).width;
    var maxW = W * 0.9;
    if (w > maxW) size = Math.max(28, Math.floor(size * maxW / w));
    return size;
  }

  function buildMask(text, size) {
    targetGrid = new Uint8Array(gw * gh);
    letterGrid = new Int8Array(gw * gh).fill(-1);
    coveredGrid = new Uint8Array(gw * gh);
    dilatedGrid = new Uint8Array(gw * gh);

    // Render offscreen para leer píxeles de la palabra.
    var off = document.createElement('canvas');
    off.width = W; off.height = H;
    var octx = off.getContext('2d');
    octx.font = font(size);
    octx.textBaseline = 'middle';
    octx.textAlign = 'left';
    var totalW = octx.measureText(text).width;
    var startX = (W - totalW) / 2;
    var midY = H / 2;

    // Límites x de cada letra (para asignar celdas a su letra).
    var bounds = [];
    var cum = 0;
    for (var i = 0; i < text.length; i++) {
      var prev = cum;
      cum = octx.measureText(text.slice(0, i + 1)).width;
      bounds.push({ x0: startX + prev, x1: startX + cum });
    }
    letterCount = text.length;

    octx.fillStyle = '#000';
    octx.fillText(text, startX, midY);
    var data = octx.getImageData(0, 0, W, H).data;

    // Marca celdas objetivo y su letra.
    for (var cy = 0; cy < gh; cy++) {
      for (var cx = 0; cx < gw; cx++) {
        var found = false;
        // muestrea unos pocos píxeles de la celda
        for (var py = cy * CELL; py < (cy + 1) * CELL && py < H && !found; py += 4) {
          for (var px = cx * CELL; px < (cx + 1) * CELL && px < W; px += 4) {
            if (data[(py * W + px) * 4 + 3] > 40) { found = true; break; }
          }
        }
        if (found) {
          var idx = cy * gw + cx;
          targetGrid[idx] = 1;
          var centerX = (cx + 0.5) * CELL;
          var li = bounds.findIndex(function (b) { return centerX >= b.x0 && centerX <= b.x1; });
          letterGrid[idx] = li < 0 ? 0 : li;
        }
      }
    }
    // Dilata la máscara para tolerancia.
    for (var c = 0; c < targetGrid.length; c++) {
      if (!targetGrid[c]) continue;
      var ox = c % gw, oy = Math.floor(c / gw);
      for (var dy = -TOL_CELLS; dy <= TOL_CELLS; dy++) {
        for (var dx = -TOL_CELLS; dx <= TOL_CELLS; dx++) {
          var nx = ox + dx, ny = oy + dy;
          if (nx >= 0 && nx < gw && ny >= 0 && ny < gh) dilatedGrid[ny * gw + nx] = 1;
        }
      }
    }
    return bounds;
  }

  function drawGuide(text, size, bounds) {
    gctx.clearRect(0, 0, W, H);
    guideCanvas.style.transition = 'opacity 0.5s ease';
    guideCanvas.style.opacity = '1';
    faded = false;

    if (mode === 'libre') {
      // Sin letras: solo un punto bajo cada letra para indicar cuántas hay.
      gctx.fillStyle = 'rgba(80,120,200,0.45)';
      for (var i = 0; i < bounds.length; i++) {
        var cx = (bounds[i].x0 + bounds[i].x1) / 2;
        gctx.beginPath();
        gctx.arc(cx, H * 0.8, 6, 0, Math.PI * 2);
        gctx.fill();
      }
      return;
    }

    gctx.font = font(size);
    gctx.textBaseline = 'middle';
    gctx.textAlign = 'center';
    if (mode === 'desvanecido') {
      gctx.fillStyle = 'rgba(70,90,140,0.18)';
      gctx.strokeStyle = 'rgba(70,90,140,0.30)';
    } else { // guia
      gctx.fillStyle = 'rgba(70,90,140,0.22)';
      gctx.strokeStyle = 'rgba(70,90,140,0.55)';
    }
    gctx.lineWidth = 2;
    gctx.fillText(text, W / 2, H / 2);
    gctx.strokeText(text, W / 2, H / 2);
  }

  // ---- dibujo del niño ----
  function pointFromEvent(e) {
    var rect = inkCanvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (W / rect.width),
      y: (e.clientY - rect.top) * (H / rect.height)
    };
  }

  function markCovered(p) {
    var cx = Math.floor(p.x / CELL), cy = Math.floor(p.y / CELL);
    for (var dy = -BRUSH_CELLS; dy <= BRUSH_CELLS; dy++) {
      for (var dx = -BRUSH_CELLS; dx <= BRUSH_CELLS; dx++) {
        var nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < gw && ny >= 0 && ny < gh) coveredGrid[ny * gw + nx] = 1;
      }
    }
  }

  function start(e) {
    e.preventDefault();
    drawing = true;
    current = [];
    strokes.push(current);
    var p = pointFromEvent(e);
    current.push(p);
    markCovered(p);
    ictx.beginPath();
    ictx.moveTo(p.x, p.y);
    if (mode === 'desvanecido' && !faded) {
      faded = true;
      guideCanvas.style.opacity = '0'; // se desvanece al empezar a escribir
    }
  }

  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    var p = pointFromEvent(e);
    current.push(p);
    markCovered(p);
    hasInk = true;
    // trazo suave
    ictx.lineTo(p.x, p.y);
    ictx.stroke();
  }

  function end(e) {
    if (!drawing) return;
    drawing = false;
  }

  function setupInk() {
    ictx.lineWidth = 14;
    ictx.lineCap = 'round';
    ictx.lineJoin = 'round';
    ictx.strokeStyle = '#ff5a3c';
    inkCanvas.addEventListener('pointerdown', start);
    inkCanvas.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    inkCanvas.addEventListener('pointercancel', end);
  }

  window.Isla.canvas = {
    init: function (containerEl) {
      container = containerEl;
      guideCanvas = document.createElement('canvas');
      inkCanvas = document.createElement('canvas');
      guideCanvas.className = 'capa-guia';
      inkCanvas.className = 'capa-tinta';
      container.appendChild(guideCanvas);
      container.appendChild(inkCanvas);
      gctx = guideCanvas.getContext('2d');
      ictx = inkCanvas.getContext('2d');
      setupInk();
    },

    newWord: function (word, wordMode) {
      mode = wordMode || 'guia';
      sizeCanvases();
      setupInk(); // re-aplica estilos tras cambiar tamaño
      var size = fitFontSize(word.text);
      var bounds = buildMask(word.text, size);
      drawGuide(word.text, size, bounds);
      this.clear();
    },

    clear: function () {
      strokes = []; current = null; drawing = false; hasInk = false;
      if (coveredGrid) coveredGrid.fill(0);
      ictx.clearRect(0, 0, W, H);
      // si la guía se había desvanecido, vuelve a mostrarla
      if (mode !== 'libre' && faded) { guideCanvas.style.opacity = '1'; faded = false; }
    },

    // Devuelve métricas de cobertura para evaluator.js
    analyze: function () {
      var perLetter = new Array(letterCount).fill(0);
      var perLetterTotal = new Array(letterCount).fill(0);
      var targetCovered = 0, targetTotal = 0;
      var coveredTotal = 0, coveredOutside = 0;
      for (var i = 0; i < targetGrid.length; i++) {
        if (targetGrid[i]) {
          targetTotal++;
          var li = letterGrid[i];
          if (li >= 0) perLetterTotal[li]++;
          if (coveredGrid[i]) {
            targetCovered++;
            if (li >= 0) perLetter[li]++;
          }
        }
        if (coveredGrid[i]) {
          coveredTotal++;
          if (!dilatedGrid[i]) coveredOutside++;
        }
      }
      var perLetterCov = perLetter.map(function (v, idx) {
        return perLetterTotal[idx] ? v / perLetterTotal[idx] : 0;
      });
      return {
        hasInk: hasInk,
        coverage: targetTotal ? targetCovered / targetTotal : 0,
        perLetterCoverage: perLetterCov,
        extraRatio: coveredTotal ? coveredOutside / coveredTotal : 0,
        letterCount: letterCount
      };
    }
  };
})();
