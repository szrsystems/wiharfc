/* ============================================================
   WIHAR FC — wiharfc.hu
   ============================================================
   ⚙️  MINDENT EBBEN A CONFIG BLOKKBAN TUDSZ ÁTÁLLÍTANI.
       (Ár, készlet, Stripe linkek, e-mail, keret.)
   ============================================================ */
const CONFIG = {

  /* ---- ár & készlet ---- */
  PRICE: 13499,                  // Ft, bruttó
  STOCK_LEFT: 20,                // hány db van még — állítsd át, ha fogy
  SOLD_OUT: false,               // true = "ELFOGYOTT", a gomb letiltva

  /* ---- HOGYAN LEHET RENDELNI? ------------------------------
     'vinted' = a MEGRENDELEM gomb a rendeles.html oldalra visz,
                ahol a vevő átmásolja a rendelését és a Vintedre megy
     'stripe' = bankkártyás fizetés (töltsd ki a STRIPE_LINK-et)
     'email'  = előre kitöltött e-mailt nyit
  ------------------------------------------------------------ */
  ORDER_MODE: 'vinted',

  /* ---- Vinted ---- */
  VINTED_URL: 'https://www.vinted.hu/member/242944965-wihar-fc',

  /* ---- STRIPE (most nincs használatban, de itt marad) -------
     Ha később átállsz kártyás fizetésre: ORDER_MODE: 'stripe',
     és told be ide a Payment Link-et (https://buy.stripe.com/...).
     Méretenként külön link is mehet a STRIPE_LINK_BY_SIZE-ba.
  ------------------------------------------------------------ */
  STRIPE_LINK: '',
  STRIPE_LINK_BY_SIZE: {
    // 'XS':  'https://buy.stripe.com/...',
    // 'M':   'https://buy.stripe.com/...',
  },

  /* ---- elérhetőség ---- */
  EMAIL: 'info@wiharfc.hu',
  INSTAGRAM: 'https://instagram.com/wiharfc',

  /* ---- méretek ---- */
  SIZES: ['XS', 'S', 'M', 'L', 'XL', '2XL'],

  /* ---- a keret (ábécé sorrendben) ---- */
  PLAYERS: [
    { name: 'Bede',      no: 19 },
    { name: 'Bús',       no: 3  },
    { name: 'Chris',     no: 5  },
    { name: 'Csongi',    no: 7  },
    { name: 'Dodi',      no: 11 },
    { name: 'Dörmi',     no: 35 },
    { name: 'Hege',      no: 8  },
    { name: 'Marcell',   no: 6  },
    { name: 'Portillo',  no: 12 },
    { name: 'Rapčak',    no: 4  },
    { name: 'Széphelyi', no: 1  },
    { name: 'Turbó',     no: 10 },
  ],
};

/* ============================================================
   Innentől nem kell hozzányúlni.
   ============================================================ */
(function () {
  'use strict';
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const fmt = n => new Intl.NumberFormat('hu-HU').format(n) + ' Ft';

  /* ---------- state ---------- */
  const state = { size: '', mode: 'custom', name: '', num: '', player: null };

  /* ---------- header ---------- */
  const hdr = $('#hdr');
  const onScroll = () => {
    hdr.classList.toggle('solid', window.scrollY > 24);
    const p = $('#bolt').getBoundingClientRect();
    $('#sticky').classList.toggle('on', p.top < window.innerHeight * 0.4 && p.bottom > 240);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('#nav a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- smooth scroll buttons ---------- */
  $$('[data-scroll]').forEach(b => b.addEventListener('click', () => {
    nav.classList.remove('open');
    const t = $(b.dataset.scroll);
    if (!t) return;
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (b.dataset.focus) setTimeout(() => { const f = $('#' + b.dataset.focus); if (f) f.focus({ preventScroll: true }); }, 650);
  }));

  /* ---------- contact links ---------- */
  $$('[data-email]').forEach(a => { a.href = 'mailto:' + CONFIG.EMAIL; a.textContent = CONFIG.EMAIL; });
  $$('[data-insta]').forEach(a => { a.href = CONFIG.INSTAGRAM; });
  $$('[data-vinted]').forEach(a => { a.href = CONFIG.VINTED_URL; });
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- price & stock ---------- */
  $('#priceTag').textContent = fmt(CONFIG.PRICE);
  $('#sumPrice').textContent = fmt(CONFIG.PRICE);
  $('.stickybar .m b').textContent = fmt(CONFIG.PRICE);
  $$('[data-scroll="#bolt"]').forEach(b => {
    if (/MEGVESZEM/.test(b.textContent)) b.textContent = 'MEGVESZEM — ' + fmt(CONFIG.PRICE);
  });
  const stockTag = $('#stockTag');
  if (CONFIG.SOLD_OUT || CONFIG.STOCK_LEFT <= 0) {
    stockTag.textContent = '⚡ Elfogyott';
  } else if (CONFIG.STOCK_LEFT <= 5) {
    stockTag.textContent = '⚡ Utolsó ' + CONFIG.STOCK_LEFT + ' db!';
  } else {
    stockTag.textContent = '⚡ Már csak ' + CONFIG.STOCK_LEFT + ' db';
  }

  /* ---------- gallery ---------- */
  const CAPS = ['MEZ ELEJE', 'MEZ HÁTULJA'];
  function goSlide(i) {
    $$('.slide').forEach(s => s.classList.toggle('on', +s.dataset.slide === i));
    $$('.thumb').forEach(t => {
      const on = +t.dataset.go === i;
      t.classList.toggle('on', on); t.setAttribute('aria-selected', String(on));
    });
    $('#stageBadge').textContent = CAPS[i] || '';
  }
  $$('.thumb').forEach(t => t.addEventListener('click', () => goSlide(+t.dataset.go)));

  /* ---------- sizes ---------- */
  const sizesEl = $('#sizes');
  CONFIG.SIZES.forEach(s => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'size'; b.textContent = s;
    b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', 'Méret ' + s);
    b.addEventListener('click', () => {
      state.size = s;
      $$('.size').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      $('#sizeErr').classList.remove('on');
      render();
    });
    sizesEl.appendChild(b);
  });

  /* ---------- squad ---------- */
  const squad = $('#squad'), sel = $('#selPlayer');
  CONFIG.PLAYERS.forEach((p, i) => {
    const c = document.createElement('button');
    c.type = 'button'; c.className = 'pcard';
    c.innerHTML = '<span class="n">' + p.no + '</span>' +
      '<span class="nm">' + esc(p.name) + '</span>' +
      '<span class="no">#' + p.no + '</span>' +
      '<span class="go">Ezt a mezt kérem →</span>';
    c.addEventListener('click', () => {
      setMode('player'); sel.value = String(i); applyPlayer();
      $('#bolt').scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast(p.name + ' #' + p.no + ' — beállítva');
    });
    squad.appendChild(c);

    const o = document.createElement('option');
    o.value = String(i); o.textContent = p.name + ' — ' + p.no;
    sel.appendChild(o);
  });

  /* ---------- personalisation ---------- */
  let booting = true;
  const inName = $('#inName'), inNum = $('#inNum');

  function setMode(m) {
    state.mode = m;
    $$('.tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.mode === m)));
    $('#paneCustom').hidden = m !== 'custom';
    $('#panePlayer').hidden = m !== 'player';
    if (m === 'none') { state.name = ''; state.num = ''; state.player = null; }
    if (m === 'custom') { state.player = null; state.name = clean(inName.value); state.num = digits(inNum.value); }
    if (m === 'player') applyPlayer();
    if (m !== 'none' && !booting) goSlide(1);
    render();
  }
  $$('.tab').forEach(t => t.addEventListener('click', () => setMode(t.dataset.mode)));

  function applyPlayer() {
    const p = CONFIG.PLAYERS[+sel.value];
    state.player = p || null;
    state.name = p ? p.name.toUpperCase() : '';
    state.num = p ? String(p.no) : '';
    render();
  }
  sel.addEventListener('change', () => { applyPlayer(); goSlide(1); });

  // csak betű, szóköz, kötőjel, pont — max 12
  function clean(v) {
    return (v || '').toUpperCase()
      .replace(/[^A-ZÁÉÍÓÖŐÚÜŰČŠŽ .'-]/g, '')
      .replace(/\s+/g, ' ')
      .slice(0, 12);
  }
  function digits(v) {
    const d = (v || '').replace(/\D/g, '').slice(0, 2);
    return d;
  }
  // A kurzort CSAK akkor mozgatjuk, ha a tisztítás tényleg kivett karaktert.
  // (A kisbetű→NAGYBETŰ csere nem változtat hosszt, ott maradnia kell a helyén.)
  function bindClean(el, cleaner, after) {
    el.addEventListener('input', () => {
      const before = el.value;
      const pos = el.selectionStart;
      const cleaned = cleaner(before);
      if (cleaned !== before) {
        const removed = before.length - cleaned.length;
        el.value = cleaned;
        const np = Math.max(0, pos - (removed > 0 ? removed : 0));
        try { el.setSelectionRange(np, np); } catch (e) { /* type=number stb. */ }
      }
      after(el.value);
    });
  }
  bindClean(inName, clean,  v => { state.name = v; goSlide(1); render(); });
  bindClean(inNum,  digits, v => { state.num  = v; goSlide(1); render(); });

  /* ---------- live back print ----------
     A hosszú nevet NEM összenyomjuk, hanem arányosan kisebbre vesszük,
     ahogy egy igazi mezen is történne. (viewBox: 0 0 1100 1213)      */
  const NAME = { base: 120, max: 520, min: 46 };
  const NUM  = { base: 430, max: 600, min: 190 };
  const nameNodes = [$('#pvName'), $('#mvName')].filter(Boolean);
  const numNodes  = [$('#pvNum'),  $('#mvNum')].filter(Boolean);
  function drawPrint() {
    const n = state.mode === 'none' ? '' : (state.name || '');
    const k = state.mode === 'none' ? '' : (state.num || '');
    nameNodes.forEach(el => { el.textContent = n; fit(el, NAME); });
    numNodes.forEach(el => { el.textContent = k; fit(el, NUM); });
  }
  function fit(node, cfg) {
    node.removeAttribute('textLength');
    node.removeAttribute('lengthAdjust');
    node.setAttribute('font-size', cfg.base);
    if (!node.textContent) return;
    let w = 0;
    try { w = node.getComputedTextLength(); } catch (e) { return; }
    if (w <= cfg.max) return;
    const size = Math.max(cfg.min, Math.floor(cfg.base * cfg.max / w));
    node.setAttribute('font-size', size);
    try {
      if (node.getComputedTextLength() > cfg.max) {
        node.setAttribute('textLength', cfg.max);
        node.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      }
    } catch (e) { /* nem baj */ }
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawPrint);

  /* ---------- render ---------- */
  function printLabel() {
    if (state.mode === 'none') return 'Felirat nélkül';
    if (!state.name && !state.num) return '—';
    return (state.name || '—') + ' / ' + (state.num !== '' ? state.num : '—');
  }
  function render() {
    drawPrint();
    $('#sumSize').textContent = state.size || '—';
    $('#sumPrint').textContent = printLabel();
    $('#stickyMeta').textContent = state.size
      ? state.size + ' · ' + printLabel()
      : 'Válassz méretet';
    const dead = CONFIG.SOLD_OUT || CONFIG.STOCK_LEFT <= 0;
    $$('#buyBtn,[data-buy]').forEach(b => {
      b.disabled = dead;
      b.textContent = dead ? 'ELFOGYOTT' : 'MEGRENDELEM';
    });
  }

  /* ---------- validation + checkout ---------- */
  function validate() {
    if (!state.size) {
      $('#sizeErr').classList.add('on');
      $('#bolt').scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast('Válassz méretet!');
      return false;
    }
    if (state.mode === 'custom') {
      if (!state.name && !state.num) {
        toast('Írd be a nevet és a számot, vagy válaszd a „Felirat nélkül” opciót.');
        inName.focus(); return false;
      }
      if (!state.name) { toast('Add meg a feliratot.'); inName.focus(); return false; }
      if (state.num === '') { toast('Add meg a számot (0–99).'); inNum.focus(); return false; }
    }
    if (state.mode === 'player' && !state.player) {
      toast('Válassz egy játékost a listából.'); sel.focus(); return false;
    }
    return true;
  }

  // Rendelésazonosító: csak [A-Za-z0-9_-] (Stripe client_reference_id kompatibilis)
  function refCode() {
    const strip = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]/g, '');
    const parts = ['WIHAR', strip(state.size) || 'NA'];
    if (state.mode === 'none') parts.push('NOPRINT');
    else parts.push(strip(state.name) || 'NA', state.num !== '' ? state.num : 'NA');
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return (parts.join('-') + '-' + rnd).slice(0, 200);
  }

  function orderQuery(ref) {
    const q = new URLSearchParams();
    q.set('meret', state.size);
    q.set('mod', state.mode);
    if (state.mode !== 'none') {
      q.set('nev', state.name);
      q.set('szam', state.num);
    }
    q.set('ar', String(CONFIG.PRICE));
    q.set('ref', ref);
    return q.toString();
  }

  function checkout() {
    if (!validate()) return;
    const ref = refCode();

    /* ---- 1) Vinted (jelenlegi mód) ---- */
    if (CONFIG.ORDER_MODE === 'vinted') {
      window.location.href = 'rendeles.html?' + orderQuery(ref);
      return;
    }

    /* ---- 2) Stripe ---- */
    const bySize = CONFIG.STRIPE_LINK_BY_SIZE && CONFIG.STRIPE_LINK_BY_SIZE[state.size];
    const base = bySize || CONFIG.STRIPE_LINK;
    if (CONFIG.ORDER_MODE === 'stripe' && base && /^https:\/\//.test(base)) {
      const u = new URL(base);
      u.searchParams.set('client_reference_id', ref);
      u.searchParams.set('locale', 'hu');
      window.location.href = u.toString();
      return;
    }

    /* ---- 3) E-mail (tartalék) ---- */
    const body = [
      'Szia Wihar FC!',
      '',
      'Rendelést szeretnék leadni:',
      '',
      'Termék:      Wihar hivatalos mez',
      'Méret:       ' + state.size,
      'Felirat:     ' + (state.mode === 'none' ? 'felirat nélkül' : state.name),
      'Szám:        ' + (state.mode === 'none' ? '-' : state.num),
      'Ár:          ' + fmt(CONFIG.PRICE),
      'Rendelésazonosító: ' + ref,
      '',
      'Nevem:  ',
      'Telefon: ',
      'Átvétel: ',
      '',
      'Köszi!'
    ].join('\n');
    window.location.href = 'mailto:' + CONFIG.EMAIL +
      '?subject=' + encodeURIComponent('Mez rendelés — ' + ref) +
      '&body=' + encodeURIComponent(body);
  }
  $('#buyBtn').addEventListener('click', checkout);
  $$('[data-buy]').forEach(b => b.addEventListener('click', checkout));

  /* ---------- size chart modal ---------- */
  const modal = $('#chart');
  let lastFocus = null;
  function openChart(e) {
    if (e) e.preventDefault();
    lastFocus = document.activeElement;
    modal.classList.add('on');
    document.body.style.overflow = 'hidden';
    $('.modal-close', modal).focus();
  }
  function closeChart() {
    modal.classList.remove('on');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $('#openChart').addEventListener('click', openChart);
  $$('[data-openchart]').forEach(b => b.addEventListener('click', openChart));
  $$('[data-close]', modal).forEach(b => b.addEventListener('click', closeChart));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('on')) closeChart();
    if (e.key === 'Tab' && modal.classList.contains('on')) {
      const f = $$('button,a[href],input,select,[tabindex]:not([tabindex="-1"])', modal)
        .filter(x => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- toast ---------- */
  let tt;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('on');
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove('on'), 3200);
  }

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: .12 });
    $$('.rv').forEach(el => {
      io.observe(el);
      el.addEventListener('transitionend', () => el.classList.remove('rv', 'in'), { once: true });
    });
  } else {
    $$('.rv').forEach(el => el.classList.add('in'));
  }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  /* ---------- boot ---------- */
  setMode('custom');
  booting = false;
  goSlide(0);
  render();
})();
