/*
 * src/audio.js — Capa de voz aislada.
 *
 * Usa Web Speech API (SpeechSynthesis) para dictar palabras y oraciones en español.
 * Está deliberadamente aislada: en el futuro se puede sustituir por audio pregrabado
 * sin tocar el resto del juego, manteniendo la misma API (speakWord/speakSentence).
 */
(function () {
  window.Isla = window.Isla || {};

  var preferred = null; // voz española elegida

  function pickVoice() {
    if (!('speechSynthesis' in window)) return null;
    var voices = window.speechSynthesis.getVoices() || [];
    var settings = window.Isla.storage.get().settings;
    // 1) voz guardada por el padre, 2) cualquier es-*, 3) primera disponible
    var byName = settings.vozNombre && voices.find(function (v) { return v.name === settings.vozNombre; });
    var spanish = voices.find(function (v) { return /^es/i.test(v.lang); });
    preferred = byName || spanish || voices[0] || null;
    return preferred;
  }

  // Las voces pueden cargar de forma asíncrona.
  if ('speechSynthesis' in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  function speak(text, rateMult) {
    if (!('speechSynthesis' in window)) return false;
    try {
      window.speechSynthesis.cancel(); // corta lo anterior
      var u = new SpeechSynthesisUtterance(text);
      var settings = window.Isla.storage.get().settings;
      var voice = preferred || pickVoice();
      if (voice) u.voice = voice;
      u.lang = (voice && voice.lang) || settings.vozLang || 'es-ES';
      u.rate = (settings.vozRate || 0.85) * (rateMult || 1);
      u.pitch = 1.05;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) {
      return false;
    }
  }

  window.Isla.audio = {
    available: function () { return 'speechSynthesis' in window; },
    voices: function () { return ('speechSynthesis' in window) ? (window.speechSynthesis.getVoices() || []) : []; },
    speakWord: function (text) { return speak(text, 0.85); },          // un poco más lento, claro
    speakSentence: function (sentence) { return speak(sentence, 1); },
    // Dicta la palabra y, tras una pausa, la oración de ejemplo.
    dictate: function (word) {
      this.speakWord(word.text);
      if (word.sentence) {
        var self = this;
        setTimeout(function () { self.speakSentence(word.sentence); }, Math.max(900, word.text.length * 220));
      }
    }
  };
})();
