/*
 * src/feedback.js — Mensajes de retroalimentación SIEMPRE positivos.
 *
 * Nunca se muestra "Incorrecto" a secas. Cada tipo de resultado tiene varios mensajes
 * alentadores; se elige uno al azar para que no se sienta repetitivo.
 */
(function () {
  window.Isla = window.Isla || {};

  var MESSAGES = {
    ok: [
      '¡Muy bien! 🌟',
      '¡Lo lograste! 🎉',
      '¡Excelente trazo! ✨',
      '¡Perfecto! 👏',
      '¡Eres un campeón! 🏆'
    ],
    casi: [
      '¡Casi lo logras! Inténtalo otra vez. 💪',
      'Vas muy bien, ¡un poquito más! 🙂',
      '¡Buen esfuerzo! Repasa el trazo. ✏️'
    ],
    omitted: [
      'Solo falta una letra. ¡Escúchala otra vez! 👂',
      'Te faltó una letra, ¡tú puedes! 💪',
      'Casi completa, revisa el final. 🔤'
    ],
    extra: [
      'Cuidado, sobró un poco de trazo. ✏️',
      'Hazlo con calma, ¡vas bien! 🙂'
    ],
    empty: [
      '¡Anímate a escribir la palabra! ✏️',
      'Escucha y traza con tu dedo. 👆'
    ],
    wrongShape: [
      'Escucha de nuevo el sonido y vuelve a intentar. 👂',
      '¡Casi! Mira bien la forma de las letras. 🔤'
    ]
  };

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  window.Isla.feedback = {
    // tipo: 'ok' | 'casi' | 'omitted' | 'extra' | 'empty' | 'wrongShape'
    message: function (tipo) {
      var list = MESSAGES[tipo] || MESSAGES.casi;
      return pick(list);
    },
    isSuccess: function (tipo) { return tipo === 'ok'; }
  };
})();
