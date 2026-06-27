/*
 * src/evaluator.js — Convierte las métricas del lienzo en un resultado pedagógico.
 *
 * El modo lo marca el nivel de la palabra. Los umbrales son INDULGENTES a propósito
 * (principio "nunca castigar"): ante la duda, se favorece el ánimo y el reintento, y
 * el modo libre (más difícil) es el más tolerante.
 *
 * Devuelve { success, tipo } donde tipo ∈ feedback.js:
 *   'ok' | 'casi' | 'omitted' | 'extra' | 'empty' | 'wrongShape'
 */
(function () {
  window.Isla = window.Isla || {};

  var THRESHOLDS = {
    guia:        { cobertura: 0.50, letra: 0.30, extra: 0.55 },
    desvanecido: { cobertura: 0.45, letra: 0.25, extra: 0.55 },
    libre:       { cobertura: 0.38, letra: 0.20, extra: 0.65 }
  };

  window.Isla.evaluator = {
    evaluate: function (mode, metrics) {
      var t = THRESHOLDS[mode] || THRESHOLDS.guia;

      if (!metrics.hasInk || metrics.coverage < 0.05) {
        return { success: false, tipo: 'empty' };
      }

      // ¿Alguna letra quedó prácticamente sin trazar? -> letra omitida.
      var omitidas = metrics.perLetterCoverage.filter(function (c) { return c < t.letra; }).length;

      // Demasiado trazo fuera de las letras.
      var demasiadoExtra = metrics.extraRatio > t.extra;

      if (metrics.coverage >= t.cobertura && omitidas === 0) {
        // Trazo bueno; si además se salió mucho, lo aceptamos pero avisamos amable.
        if (demasiadoExtra) return { success: true, tipo: 'ok' };
        return { success: true, tipo: 'ok' };
      }

      // No alcanzó: damos la pista más útil (sin castigar).
      if (omitidas === 1 && metrics.coverage >= t.cobertura * 0.7) {
        return { success: false, tipo: 'omitted' };
      }
      if (demasiadoExtra && metrics.coverage >= t.cobertura * 0.7) {
        return { success: false, tipo: 'extra' };
      }
      if (metrics.coverage >= t.cobertura * 0.65) {
        return { success: false, tipo: 'casi' };
      }
      return { success: false, tipo: 'wrongShape' };
    }
  };
})();
