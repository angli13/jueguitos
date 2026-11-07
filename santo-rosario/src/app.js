/* app.js — Sanctum Rosarium
 * App de una sola página, sin dependencias. Guarda ajustes y progreso en localStorage.
 */
(function () {
  'use strict';

  const { P, LITANIA, LITANIA_RESP, MISTERIOS, DIAS, ORDINALES, RUBRICAS } = window.ROSARIO;
  const SET_ORDER = ['gozosos', 'dolorosos', 'gloriosos'];
  const STORE_KEY = 'sanctum-rosarium.v1';
  const RESUME_MAX_MS = 12 * 60 * 60 * 1000; // ofrecer "continuar" durante 12 h

  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ───────────────────────── Estado y almacenamiento ─────────────────────────
  const store = {
    load() {
      try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (_) { return {}; }
    },
    save() {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify({
          lang: state.lang, theme: state.theme, font: state.font, session: state.session,
        }));
      } catch (_) { /* almacenamiento no disponible: la app sigue funcionando */ }
    },
  };

  const saved = store.load();
  const state = {
    lang: ['es', 'la', 'bi'].includes(saved.lang) ? saved.lang : 'es',
    theme: ['auto', 'light', 'dark'].includes(saved.theme) ? saved.theme : 'auto',
    font: typeof saved.font === 'number' ? saved.font : 1,
    session: saved.session || null, // { set, step, intention, ts, done }
    selectedSet: null,
    steps: [],
  };

  // ───────────────────────── Utilidades de idioma ─────────────────────────
  /** Texto de un objeto {la, es} según el idioma actual (para títulos cortos). */
  function tx(o) {
    if (!o) return '';
    if (state.lang === 'la') return o.la || o.es;
    if (state.lang === 'es') return o.es || o.la;
    return o.la && o.es && o.la !== o.es ? `${o.la} · ${o.es}` : (o.la || o.es);
  }

  /** Versión corta para espacios estrechos: en modo bilingüe, solo el latín. */
  function txTop(o) {
    return state.lang === 'es' ? (o.es || o.la) : (o.la || o.es);
  }

  /** Título con el latín grande y el castellano debajo en modo bilingüe. */
  function titleHTML(o, tag = 'h2', cls = 'card-title') {
    if (state.lang === 'bi' && o.la && o.es && o.la !== o.es) {
      return `<${tag} class="${cls}">${esc(o.la)}<span class="title-alt">${esc(o.es)}</span></${tag}>`;
    }
    const text = state.lang === 'la' ? (o.la || o.es) : (o.es || o.la);
    return `<${tag} class="${cls}">${esc(text)}</${tag}>`;
  }

  function suggestedSet(date = new Date()) {
    const d = date.getDay();
    return SET_ORDER.find((id) => MISTERIOS[id].dias.includes(d));
  }

  // ───────────────────────── Construcción de los pasos ─────────────────────────
  function sectionsFor(setId) {
    const M = MISTERIOS[setId];
    const secs = {
      inicio: { la: 'Initium', es: 'Oraciones iniciales' },
      finales: { la: 'Post mysteria', es: 'Después de los misterios' },
      letania: { la: 'Litaniæ Lauretanæ', es: 'Letanía Lauretana' },
      antifonas: { la: 'Antiphonæ et oratio', es: 'Antífonas y oración' },
      pontifice: { la: 'Pro Pontifice', es: 'Por el Papa' },
      cierre: { la: 'Conclusio', es: 'Conclusión' },
    };
    M.list.forEach((m, i) => { secs['m' + i] = { la: `${i + 1}. ${m.short.la}`, es: `${i + 1}. ${m.short.es}` }; });
    return secs;
  }

  function buildSteps(setId) {
    const M = MISTERIOS[setId];
    const S = [];
    const add = (o) => S.push(o);

    add({ sec: 'inicio', prayer: 'signum', rubric: RUBRICAS.presencia });
    add({ sec: 'inicio', prayer: 'invocatio' });
    add({ sec: 'inicio', prayer: 'dignare' });
    add({ sec: 'inicio', prayer: 'contritio' });
    add({ sec: 'inicio', prayer: 'oblatio' });

    M.list.forEach((_, i) => {
      const sec = 'm' + i;
      add({ sec, type: 'mystery', decade: i, bead: 'announce', rubric: i === 0 ? RUBRICAS.misterio : null });
      add({ sec, prayer: 'pater', decade: i, bead: 'pater' });
      for (let k = 0; k < 10; k++) add({ sec, prayer: 'ave', decade: i, bead: k });
      add({ sec, prayer: 'gloria', decade: i, bead: 'gloria' });
      add({ sec, prayer: 'iaculatoriae', decade: i, bead: 'gloria' });
    });

    add({ sec: 'finales', prayer: 'pater', rubric: RUBRICAS.finales });
    ['aveFilia', 'aveMater', 'aveSponsa', 'aveTemplum'].forEach((k) => add({ sec: 'finales', prayer: k }));

    add({ sec: 'letania', prayer: 'kyrie', rubric: RUBRICAS.letania });
    LITANIA.forEach((_, g) => add({ sec: 'letania', type: 'litany', group: g }));
    add({ sec: 'letania', prayer: 'agnus' });

    add({ sec: 'antifonas', prayer: 'antiphona1', rubric: RUBRICAS.antifonas });
    add({ sec: 'antifonas', prayer: 'antiphona2' });
    add({ sec: 'antifonas', prayer: 'oremus' });

    add({ sec: 'pontifice', prayer: 'pontifex', rubric: RUBRICAS.pontifice });
    add({ sec: 'pontifice', prayer: 'pater' });
    add({ sec: 'pontifice', prayer: 'ave' });
    add({ sec: 'pontifice', prayer: 'gloria' });

    add({ sec: 'cierre', prayer: 'defuncti' });
    add({ sec: 'cierre', prayer: 'preces' });
    add({ sec: 'cierre', prayer: 'memorare' });
    add({ sec: 'cierre', type: 'end' });
    return S;
  }

  // ───────────────────────── Renderizado de oraciones ─────────────────────────
  const MARK = { v: 'V.', r: 'R.' };

  function lineText(text, k, dropcap, intention) {
    let h = esc(text);
    if (h.includes('{INTENCION}')) {
      const it = intention && intention.trim();
      h = h.replace('{INTENCION}', it
        ? `<span class="intent">${esc(it)}</span>`
        : '<span class="intent">… (intención particular)</span>');
    }
    if (dropcap) h = h.replace(/^(\S)/, '<span class="dc">$1</span>');
    return (MARK[k] ? `<span class="mk">${MARK[k]}</span> ` : '') + h;
  }

  function linesHTML(lines, intention) {
    const lang = state.lang;
    let out = `<div class="lines lang-${lang}">`;
    lines.forEach((ln, i) => {
      const dc = i === 0 && ln.k === 'p';
      const hasLa = !!ln.la;
      if (lang === 'bi' && hasLa) {
        out += `<div class="ln k-${ln.k} two">` +
          `<p class="col la">${lineText(ln.la, ln.k, dc, intention)}</p>` +
          `<p class="col es">${lineText(ln.es, ln.k, dc, intention)}</p></div>`;
      } else {
        const useLa = lang === 'la' && hasLa;
        const fallback = lang === 'la' && !hasLa;
        out += `<div class="ln k-${ln.k}">` +
          `<p class="col ${useLa ? 'la' : 'es'}">${lineText(useLa ? ln.la : ln.es, ln.k, dc, intention)}</p>` +
          (fallback ? '<p class="note">(Esta oración figura solo en castellano.)</p>' : '') +
          '</div>';
      }
    });
    return out + '</div>';
  }

  function litanyHTML(group) {
    const lang = state.lang;
    const resp = (l) => ` <em class="resp">${esc(LITANIA_RESP[l])}</em>`;
    let out = `<div class="lines litany lang-${lang}">`;
    group.items.forEach(([la, es]) => {
      if (lang === 'bi') {
        out += `<div class="ln two"><p class="col la">${esc(la)}${resp('la')}</p>` +
               `<p class="col es">${esc(es)}${resp('es')}</p></div>`;
      } else {
        const l = lang === 'la' ? 'la' : 'es';
        out += `<div class="ln"><p class="col ${l}">${esc(l === 'la' ? la : es)}${resp(l)}</p></div>`;
      }
    });
    return out + '</div>';
  }

  function ordinalLabel(i, set) {
    const M = MISTERIOS[set];
    return {
      la: `${ORDINALES.la[i]} mystérium ${M.adj.la}`,
      es: `${ORDINALES.es[i]} misterio ${M.adj.es}`,
    };
  }

  function stepCardHTML(step, idx) {
    const sess = state.session;
    const set = MISTERIOS[sess.set];
    let h = '';
    if (step.rubric) h += `<p class="rubric">${esc(step.rubric)}</p>`;

    if (step.type === 'mystery') {
      const m = set.list[step.decade];
      h += `<div class="myst">` +
        titleHTML(ordinalLabel(step.decade, sess.set), 'p', 'myst-ord') +
        titleHTML(m.short, 'h2', 'card-title myst-title') +
        `<div class="ornament small" aria-hidden="true"></div>` +
        linesHTML([{ k: 'p', la: m.la, es: m.es }]) +
        `<p class="fruit"><span class="fruit-label">${state.lang === 'la' ? 'Fructus' : 'Fruto'}:</span> ${esc(tx(m.fruit))}</p>` +
        `</div>`;
    } else if (step.type === 'litany') {
      const g = LITANIA[step.group];
      h += titleHTML(g.title, 'h2', 'card-title small');
      h += litanyHTML(g);
    } else if (step.type === 'end') {
      h += `<div class="end">` +
        `<p class="rubric">Et sic Rosarium terminatur.</p>` +
        `<div class="ornament" aria-hidden="true"></div>` +
        `<p class="fraktur deo">Deo gratias</p>` +
        `<p class="end-sub">Así termina el Santo Rosario.</p>` +
        `<button class="btn btn-primary" type="button" data-action="home">Volver al inicio</button>` +
        `</div>`;
    } else {
      const pr = P[step.prayer];
      const isAve = step.prayer === 'ave' && typeof step.bead === 'number';
      let title = pr.title;
      if (isAve) title = { la: `${pr.title.la} ${step.bead + 1}`, es: `${pr.title.es} ${step.bead + 1}` };
      h += titleHTML(title);
      h += linesHTML(pr.lines, sess.intention);
      if (isAve) h += `<p class="tap-hint">Toca el texto para pasar a la siguiente</p>`;
    }
    return h;
  }

  // ───────────────────────── Cuentas del rosario ─────────────────────────
  function beadsHTML(step) {
    if (typeof step.decade !== 'number') {
      return '<div class="ornament" aria-hidden="true"></div>';
    }
    const d = step.decade;
    const b = step.bead;
    // posición dentro de la decena: announce=-1, pater=0, aves=1..10, gloria=11
    const pos = b === 'announce' ? -1 : b === 'pater' ? 0 : b === 'gloria' ? 11 : b + 1;
    const cls = (p) => (p < pos ? 'done' : p === pos ? 'cur' : '');
    let decs = '<div class="decades">';
    for (let i = 0; i < 5; i++) decs += `<span class="dec ${i < d ? 'done' : i === d ? 'cur' : ''}">${i + 1}</span>`;
    decs += '</div>';
    let strand = '<div class="strand">';
    strand += `<span class="bead big ${cls(0)}"></span>`;
    for (let i = 1; i <= 10; i++) strand += `<span class="bead ${cls(i)}"></span>`;
    strand += `<span class="bead gl ${cls(11)}">✠</span>`;
    strand += '</div>';
    return decs + strand;
  }

  // ───────────────────────── Navegación ─────────────────────────
  let lastIdx = -1;

  function go(idx, opts = {}) {
    const S = state.steps;
    idx = Math.max(0, Math.min(S.length - 1, idx));
    const step = S[idx];
    const dir = idx > lastIdx ? 'fwd' : idx < lastIdx ? 'back' : '';
    lastIdx = idx;

    state.session.step = idx;
    state.session.ts = Date.now();
    if (step.type === 'end') state.session.done = true;
    store.save();

    const secs = sectionsFor(state.session.set);
    $('#sec-title').textContent = txTop(MISTERIOS[state.session.set].name);
    $('#sec-sub').textContent = txTop(secs[step.sec]);
    $('#progress-bar').style.width = `${(idx / (S.length - 1)) * 100}%`;
    $('#beads').innerHTML = beadsHTML(step);

    const card = $('#card');
    card.innerHTML = stepCardHTML(step, idx);
    card.dataset.kind = step.prayer === 'ave' && typeof step.bead === 'number' ? 'ave' : (step.type || 'prayer');
    if (dir && !opts.instant) {
      card.classList.remove('enter-fwd', 'enter-back');
      void card.offsetWidth; // reinicia la animación
      card.classList.add('enter-' + dir);
    }
    $('#stage').scrollTop = 0;

    // Contador y botones
    const counter = $('#counter');
    if (typeof step.bead === 'number' && step.prayer === 'ave') counter.textContent = `${step.bead + 1} / 10`;
    else counter.textContent = `${idx + 1} / ${S.length}`;
    $('#btn-prev').disabled = idx === 0;
    const next = $('#btn-next');
    const isLast = idx === S.length - 1;
    next.hidden = isLast;
    next.textContent = idx === S.length - 2 ? 'Terminar ›' : 'Siguiente ›';

    renderToc();
  }

  const next = () => { if (state.session && state.session.step < state.steps.length - 1) go(state.session.step + 1); };
  const prev = () => { if (state.session && state.session.step > 0) go(state.session.step - 1); };

  // ───────────────────────── Índice (drawer) ─────────────────────────
  function renderToc() {
    const toc = $('#toc');
    if (!state.session) { toc.innerHTML = ''; return; }
    const secs = sectionsFor(state.session.set);
    const cur = state.steps[state.session.step].sec;
    const firsts = [];
    state.steps.forEach((s, i) => { if (!firsts.find((f) => f.sec === s.sec)) firsts.push({ sec: s.sec, i }); });
    toc.innerHTML = firsts.map((f) =>
      `<li><button type="button" data-go="${f.i}" class="${f.sec === cur ? 'cur' : ''}">${esc(txTop(secs[f.sec]))}` +
      (state.lang === 'bi' ? `<span class="toc-alt">${esc(secs[f.sec].es.replace(/^\d+\.\s*/, ''))}</span>` : '') +
      `</button></li>`
    ).join('');
  }

  function openDrawer(open) {
    $('#drawer').hidden = !open;
    $('#scrim').hidden = !open;
    $('#btn-menu').setAttribute('aria-expanded', String(open));
    if (open) $('#btn-close').focus();
  }

  // ───────────────────────── Controles de ajustes ─────────────────────────
  const LANG_LABELS = {
    wide: { es: 'Español', la: 'Latín', bi: 'Ambos' },
    small: { es: 'ES', la: 'LA', bi: 'LA·ES' },
  };

  function renderLangControls() {
    document.querySelectorAll('[data-lang-control]').forEach((el) => {
      const labels = el.classList.contains('seg-small') ? LANG_LABELS.small : LANG_LABELS.wide;
      el.innerHTML = ['es', 'la', 'bi'].map((l) =>
        `<button type="button" role="radio" data-lang="${l}" aria-checked="${state.lang === l}" ` +
        `title="${LANG_LABELS.wide[l]}">${labels[l]}</button>`).join('');
    });
  }

  function setLang(l) {
    state.lang = l;
    document.documentElement.dataset.lang = l;
    store.save();
    renderLangControls();
    renderHome();
    if (!$('#pray').hidden) go(state.session.step, { instant: true });
  }

  function renderThemeControl() {
    const labels = { auto: 'Auto', light: 'Claro', dark: 'Oscuro' };
    $('#theme-control').innerHTML = Object.keys(labels).map((t) =>
      `<button type="button" role="radio" data-theme="${t}" aria-checked="${state.theme === t}">${labels[t]}</button>`).join('');
  }

  function applyTheme() {
    const root = document.documentElement;
    if (state.theme === 'auto') delete root.dataset.theme; else root.dataset.theme = state.theme;
    renderThemeControl();
  }

  function applyFont() {
    state.font = Math.max(0.8, Math.min(1.6, Math.round(state.font * 10) / 10));
    document.documentElement.style.setProperty('--fs', state.font);
  }

  // ───────────────────────── Pantalla de inicio ─────────────────────────
  function renderHome() {
    const now = new Date();
    const d = now.getDay();
    const sug = suggestedSet(now);
    if (!state.selectedSet) state.selectedSet = sug;

    let fecha = DIAS.es[d];
    try {
      fecha = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
    } catch (_) { /* Intl no disponible */ }
    fecha = fecha.charAt(0).toUpperCase() + fecha.slice(1);
    $('#today-date').innerHTML = `${esc(fecha)} <span class="la-day">· ${esc(DIAS.la[d])}</span>`;
    $('#today-sugg').innerHTML = `Hoy corresponden los <strong>${esc(MISTERIOS[sug].name.es)}</strong>` +
      `<span class="la-line">${esc(MISTERIOS[sug].name.la)}, ${esc(MISTERIOS[sug].when.la)}</span>`;

    $('#sets').innerHTML = SET_ORDER.map((id) => {
      const M = MISTERIOS[id];
      const sel = state.selectedSet === id;
      return `<button type="button" role="radio" class="set ${sel ? 'sel' : ''}" data-set="${id}" aria-checked="${sel}">` +
        (id === sug ? '<span class="badge">Hoy</span>' : '') +
        `<span class="set-name">${esc(M.name.es.replace('Misterios ', ''))}</span>` +
        `<span class="set-la">${esc(M.name.la)}</span>` +
        `<span class="set-days">${esc(M.when.es)}</span>` +
        `</button>`;
    }).join('');

    const M = MISTERIOS[state.selectedSet];
    $('#myst-preview').innerHTML = M.list.map((m) =>
      `<li><span class="mp-title">${esc(tx(m.short))}</span><span class="mp-fruit">${esc(tx(m.fruit))}</span></li>`).join('');

    // Continuar un rosario empezado
    const s = state.session;
    const box = $('#resume-box');
    if (s && !s.done && MISTERIOS[s.set] && Date.now() - (s.ts || 0) < RESUME_MAX_MS) {
      const steps = buildSteps(s.set);
      const step = steps[Math.min(s.step, steps.length - 1)];
      const secs = sectionsFor(s.set);
      $('#btn-resume').innerHTML = `Continuar el rosario<span class="resume-sub">${esc(MISTERIOS[s.set].name.es)} · ${esc(secs[step.sec].es)}</span>`;
      box.hidden = false;
    } else {
      box.hidden = true;
    }
  }

  // ───────────────────────── Cambio de pantalla ─────────────────────────
  let wakeLock = null;
  async function keepAwake(on) {
    try {
      if (on && 'wakeLock' in navigator && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen');
      } else if (!on && wakeLock) {
        await wakeLock.release();
        wakeLock = null;
      }
    } catch (_) { /* no soportado o denegado */ }
  }

  function showHome() {
    openDrawer(false);
    $('#pray').hidden = true;
    $('#home').hidden = false;
    keepAwake(false);
    renderHome();
    window.scrollTo(0, 0);
  }

  function showPray(fromHistory) {
    state.steps = buildSteps(state.session.set);
    lastIdx = -1;
    $('#home').hidden = true;
    $('#pray').hidden = false;
    if (!fromHistory) { try { history.pushState({ pray: true }, ''); } catch (_) { /* marco sin historial */ } }
    keepAwake(true);
    go(state.session.step || 0, { instant: true });
    $('#stage').focus({ preventScroll: true });
  }

  function startNew() {
    state.session = {
      set: state.selectedSet,
      step: 0,
      intention: $('#intention').value.trim(),
      ts: Date.now(),
      done: false,
    };
    store.save();
    showPray();
  }

  function leavePray() {
    if (history.state && history.state.pray) history.back(); // dispara popstate → showHome
    else showHome();
  }

  // ───────────────────────── Eventos ─────────────────────────
  function bindEvents() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.lang) setLang(t.dataset.lang);
      else if (t.dataset.theme) { state.theme = t.dataset.theme; store.save(); applyTheme(); }
      else if (t.dataset.set) { state.selectedSet = t.dataset.set; renderHome(); }
      else if (t.dataset.go) { openDrawer(false); go(Number(t.dataset.go)); }
      else if (t.dataset.action === 'home') leavePray();
    });

    $('#btn-start').addEventListener('click', startNew);
    $('#btn-resume').addEventListener('click', () => showPray());
    $('#btn-discard').addEventListener('click', () => { state.session = null; store.save(); renderHome(); });
    $('#btn-next').addEventListener('click', next);
    $('#btn-prev').addEventListener('click', prev);
    $('#btn-home').addEventListener('click', leavePray);
    $('#btn-menu').addEventListener('click', () => openDrawer($('#drawer').hidden));
    $('#btn-close').addEventListener('click', () => openDrawer(false));
    $('#scrim').addEventListener('click', () => openDrawer(false));
    $('#font-dec').addEventListener('click', () => { state.font -= 0.1; applyFont(); store.save(); });
    $('#font-inc').addEventListener('click', () => { state.font += 0.1; applyFont(); store.save(); });

    // Tocar el texto de un Ave María avanza (cómodo para "pasar las cuentas").
    $('#card').addEventListener('click', (e) => {
      if ($('#card').dataset.kind !== 'ave' || e.target.closest('button')) return;
      const sel = window.getSelection && window.getSelection();
      if (sel && String(sel).length) return;
      next();
    });

    // Gestos: deslizar a izquierda/derecha.
    let sx = 0, sy = 0, st = 0;
    const stage = $('#stage');
    stage.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; st = Date.now();
    }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Date.now() - st < 600 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) next(); else prev();
      }
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
      if ($('#pray').hidden) return;
      if (e.target.closest('textarea, input')) return;
      if (e.key === 'Escape') { if (!$('#drawer').hidden) openDrawer(false); return; }
      if (!$('#drawer').hidden) return;
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key) && !e.target.closest('button')) { e.preventDefault(); next(); }
      else if (['ArrowRight', 'PageDown'].includes(e.key)) { e.preventDefault(); next(); }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    });

    window.addEventListener('popstate', () => { if (!$('#pray').hidden) showHome(); });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !$('#pray').hidden) keepAwake(true);
    });
  }

  // ───────────────────────── Inicio ─────────────────────────
  function init() {
    document.documentElement.dataset.lang = state.lang;
    applyTheme();
    applyFont();
    renderLangControls();
    bindEvents();
    showHome();

    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  init();
})();
