/*
 * src/rewards.js — Animaciones de recompensa.
 *
 * Confetti minimalista propio (sin librerías) + un cartel de "¡pieza nueva!".
 * Se dispara tras cada acierto.
 */
(function () {
  window.Isla = window.Isla || {};
  var EMOJIS = ['🎉', '⭐', '✨', '🌟', '🎈', '💫', '🏆'];

  function confetti() {
    var layer = document.getElementById('capa-confeti');
    if (!layer) return;
    for (var i = 0; i < 18; i++) {
      var p = document.createElement('span');
      p.className = 'confeti';
      p.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      p.style.left = (10 + Math.random() * 80) + '%';
      p.style.fontSize = (16 + Math.random() * 22) + 'px';
      p.style.animationDelay = (Math.random() * 0.25) + 's';
      p.style.animationDuration = (0.9 + Math.random() * 0.8) + 's';
      layer.appendChild(p);
      (function (node) { setTimeout(function () { node.remove(); }, 1900); })(p);
    }
  }

  window.Isla.rewards = {
    celebrate: function (piece) {
      confetti();
      if (window.Isla.audio.available) { /* sonido opcional futuro */ }
      if (piece) {
        var banner = document.getElementById('cartel-pieza');
        if (banner) {
          banner.textContent = '¡Construiste ' + piece.label + '! ' + piece.emoji;
          banner.classList.remove('oculto');
          banner.classList.add('aparece');
          setTimeout(function () { banner.classList.add('oculto'); banner.classList.remove('aparece'); }, 1800);
        }
      }
    }
  };
})();
