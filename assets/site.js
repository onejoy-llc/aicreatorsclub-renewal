/* AI Creators Club — public site interactions */
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const PALETTE = ['#d4ff3a', '#ff8ad8', '#3ad6ff', '#ff5c39', '#ffd43a', '#5b4bff'];
  const page = document.body.dataset.page;
  // static build (GitHub Pages): no API, site lives under a sub-path
  const STATIC = window.ACC_STATIC || null;
  const BASE = (STATIC && STATIC.base) || '/';

  const ICON = {
    arrow: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
    up: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 13V3M4 7l4-4 4 4"/></svg>',
    close: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l10 10M13 3L3 13"/></svg>',
    play: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9-5.5z"/></svg>',
  };
  const REASON_ICONS = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12l4 4 12-12"/><path d="M4 20h16"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 19l4-4M14 4c3 0 6 3 6 6l-7 7-6-6z"/><circle cx="14.5" cy="9.5" r="1.5"/></svg>',
  ];

  const btn = (label, href, cls = '', attrs = '') =>
    `<a class="btn ${cls}" href="${href}" ${attrs}><span class="btn__label"><span>${label}</span><span aria-hidden="true">${label}</span></span><span class="btn__icon">${ICON.arrow}</span></a>`;

  /* ---------- shared header / footer ---------- */
  const NAV = [
    { href: BASE + '#about', en: 'ABOUT', ja: '概要' },
    { href: BASE + 'works', en: 'WORKS', ja: '実績' },
    { href: BASE + '#creators', en: 'CREATORS', ja: 'クリエイター' },
  ];
  $('#site-header').outerHTML = `
    <header class="header" id="header">
      <div class="header__inner">
        <a class="logo" href="${BASE}" data-hover><span class="logo__mark">AI</span>AI Creators Club</a>
        <nav class="nav" aria-label="メイン">
          ${NAV.map((n) => `<a class="nav__link" href="${n.href}"><small>${n.en}</small>${n.ja}</a>`).join('')}
          ${btn('お問い合わせ', BASE + '#contact')}
        </nav>
        <button class="burger" id="burger" aria-label="メニューを開く" aria-expanded="false"><span></span><span></span></button>
      </div>
    </header>
    <div class="mobile-menu" id="mobile-menu">
      ${NAV.map((n) => `<a class="mm-link" href="${n.href}">${n.en}<small>${n.ja}</small></a>`).join('')}
      <a class="mm-link" href="${BASE}#contact">CONTACT<small>お問い合わせ</small></a>
      ${btn('仕事を依頼する', BASE + '#contact', 'btn--light')}
    </div>`;

  const word = 'AICreatorsClub'.split('').map((c) => `<span>${c}</span>`).join('');
  $('#site-footer').outerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer__top">
          <div>
            <a class="logo" href="${BASE}"><span class="logo__mark" style="background:var(--lime);color:var(--ink)">AI</span>AI Creators Club</a>
            <p style="color:#a9a7b0;margin:16px 0 0;max-width:360px;font-size:14px">福岡を拠点とする、審査制のAIクリエイター・プロフェッショナル集団。</p>
          </div>
          <div class="footer__nav">
            <div><h4>MENU</h4>${NAV.map((n) => `<a href="${n.href}">${n.ja}</a>`).join('')}<a href="${BASE}#contact">お問い合わせ</a></div>
            <div><h4>INFO</h4><a href="#">プライバシーポリシー</a><a href="#">利用規約</a></div>
          </div>
          <a class="to-top" href="#top" aria-label="ページトップへ" data-hover>${ICON.up}</a>
        </div>
        <div class="footer__word" aria-hidden="true">${word}</div>
        <div class="footer__bottom"><span>© ${new Date().getFullYear()} AI Creators Club. All rights reserved.</span>${STATIC ? '' : '<a href="/admin">管理画面</a>'}</div>
      </div>
    </footer>`;

  /* ---------- loader ---------- */
  const loader = $('#loader');
  if (loader) {
    const done = () => { loader.classList.add('is-done'); document.documentElement.classList.add('is-loaded'); setTimeout(() => loader.remove(), 1100); };
    if (reduced || sessionStorageGet('acc_seen')) done();
    else { sessionStorageSet('acc_seen', '1'); setTimeout(done, 1300); }
  } else {
    document.documentElement.classList.add('is-loaded');
  }
  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch { /* ignore */ } }

  /* ---------- header behaviour ---------- */
  const header = $('#header');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    header.classList.toggle('is-hidden', y > 300 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
  }, { passive: true });

  const burger = $('#burger');
  const toggleMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  };
  burger.addEventListener('click', () => toggleMenu(!document.body.classList.contains('menu-open')));
  $$('#mobile-menu a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));

  /* ---------- custom cursor ---------- */
  let cursor;
  if (finePointer && !reduced) {
    cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.innerHTML = '<span>PLAY</span>';
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.append(cursor, dot);
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
    document.addEventListener('mouseleave', () => { cursor.classList.add('is-hidden'); dot.classList.add('is-hidden'); });
    document.addEventListener('mouseenter', () => { cursor.classList.remove('is-hidden'); dot.classList.remove('is-hidden'); });
    (function loop() {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px,${cy}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', (e) => {
      const play = e.target.closest('[data-cursor="play"]');
      const hov = e.target.closest('a, button, [data-hover], label, .chip');
      cursor.classList.toggle('is-play', !!play);
      cursor.classList.toggle('is-hover', !play && !!hov);
    });
  }

  /* ---------- buttons: fill origin, random color, magnet ---------- */
  function bindButtons(root = document) {
    $$('.btn', root).forEach((b) => {
      if (b.dataset.bound) return;
      b.dataset.bound = '1';
      b.addEventListener('mouseenter', (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--mx', `${e.clientX - r.left}px`);
        b.style.setProperty('--my', `${e.clientY - r.top}px`);
        const cur = b.style.getPropertyValue('--btn-fill');
        let c;
        do { c = PALETTE[Math.floor(Math.random() * PALETTE.length)]; } while (c === cur || (b.classList.contains('btn--light') && c === '#5b4bff'));
        b.style.setProperty('--btn-fill', c);
        b.style.setProperty('--btn-fill-fg', c === '#5b4bff' ? '#fff' : '#111014');
      });
      b.addEventListener('mouseleave', (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--mx', `${e.clientX - r.left}px`);
        b.style.setProperty('--my', `${e.clientY - r.top}px`);
        b.style.transform = '';
      });
      if (finePointer && !reduced) {
        b.addEventListener('mousemove', (e) => {
          const r = b.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.25;
          const y = (e.clientY - r.top - r.height / 2) * 0.35;
          b.style.transform = `translate(${x}px,${y}px)`;
        });
      }
    });
  }

  /* ---------- split text ---------- */
  function splitText(el) {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    let i = 0;
    el.innerHTML = lines.map((line) => {
      const tmp = document.createElement('div');
      tmp.innerHTML = line;
      const walk = (node) => {
        if (node.nodeType === 3) {
          return [...node.textContent].map((c) => (c === ' ' ? ' ' : `<span class="ch" style="--i:${i++}">${esc(c)}</span>`)).join('');
        }
        const clone = node.cloneNode(false);
        clone.innerHTML = [...node.childNodes].map(walk).join('');
        return clone.outerHTML;
      };
      return `<span class="line">${[...tmp.childNodes].map(walk).join('')}</span>`;
    }).join('');
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  function observe(root = document) {
    $$('.split:not([data-split])', root).forEach((el) => { el.dataset.split = '1'; splitText(el); });
    $$('.reveal, .split', root).forEach((el) => io.observe(el));
  }

  /* ---------- counters ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      countIO.unobserve(en.target);
      const el = en.target, to = +el.dataset.count, t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.firstChild.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  });

  /* ---------- modal ---------- */
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `<div class="modal__bg" data-close></div><div class="modal__box"><button class="modal__close" data-close aria-label="閉じる">${ICON.close}</button><div class="modal__content"></div></div>`;
  document.body.append(modal);
  let lastFocus;
  function openModal(html, cls = '') {
    lastFocus = document.activeElement;
    modal.className = `modal is-open ${cls}`;
    $('.modal__content', modal).innerHTML = html;
    bindButtons(modal);
    document.body.style.overflow = 'hidden';
    $('.modal__close', modal).focus();
  }
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { if (!modal.classList.contains('is-open')) $('.modal__content', modal).innerHTML = ''; }, 400);
    lastFocus && lastFocus.focus();
  }
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

  /* ---------- works ---------- */
  const ytId = (u = '') => (u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/) || [])[1];
  const CAT_COLORS = {};
  const catColor = (c) => (CAT_COLORS[c] ||= PALETTE[(Object.keys(CAT_COLORS).length + 5) % PALETTE.length]);

  function workCard(w, i) {
    const id = ytId(w.videoUrl);
    let media;
    if (w.thumbnail) media = `<img src="${esc(w.thumbnail)}" alt="" loading="lazy">`;
    else if (w.videoType === 'youtube' && id) media = `<img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" data-yt="${id}" alt="" loading="lazy">`;
    else media = `<video src="${esc(w.videoUrl)}#t=0.5" muted playsinline loop preload="metadata"></video>`;
    return `
      <article class="work reveal" style="--d:${(i % 3) * 0.08}s;--wc:${catColor(w.category)}" data-work="${esc(w.id)}" data-cursor="play" tabindex="0" role="button" aria-label="${esc(w.title)} を再生">
        <div class="work__thumb">${media}<span class="work__cat">${esc(w.category)}</span><span class="work__play">${ICON.play}</span></div>
        <div class="work__meta">
          <div><h3 class="work__title">${esc(w.title)}</h3>${w.artist ? `<div class="work__artist">${esc(w.artist)}</div>` : ''}</div>
          <span class="work__arrow">${ICON.arrow}</span>
        </div>
      </article>`;
  }

  function bindWorks(root, works) {
    $$('img[data-yt]', root).forEach((img) => {
      const fallback = () => { if (!img.dataset.fb) { img.dataset.fb = 1; img.src = `https://i.ytimg.com/vi/${img.dataset.yt}/hqdefault.jpg`; } };
      img.addEventListener('error', fallback);
      img.addEventListener('load', () => { if (img.naturalWidth <= 120) fallback(); });
    });
    $$('.work', root).forEach((card) => {
      const w = works.find((x) => x.id === card.dataset.work);
      const v = $('video', card);
      if (v && finePointer) {
        card.addEventListener('mouseenter', () => v.play().catch(() => {}));
        card.addEventListener('mouseleave', () => v.pause());
      }
      const open = () => playWork(w);
      card.addEventListener('click', open);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
  }

  function playWork(w) {
    const id = ytId(w.videoUrl);
    const vertical = w.vertical;
    const player = w.videoType === 'youtube' && id
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="${esc(w.title)}"></iframe>`
      : `<video src="${esc(w.videoUrl)}" controls autoplay playsinline></video>`;
    openModal(`<div class="player ${vertical ? 'is-vertical' : ''}">${player}</div>
      <div class="player-info"><b>${esc(w.title)}</b><span>${esc(w.artist || '')} ${w.artist ? '/' : ''} ${esc(w.category)}</span></div>`, 'modal--player');
  }

  function renderFilters(el, cats, onPick, counts) {
    el.innerHTML = ['すべて', ...cats].map((c, i) =>
      `<button class="chip ${i === 0 ? 'is-active' : ''}" data-cat="${i === 0 ? '' : esc(c)}">${esc(c)}${counts ? `<sup>${i === 0 ? counts.all : counts[c]}</sup>` : ''}</button>`).join('');
    el.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      $$('.chip', el).forEach((x) => x.classList.toggle('is-active', x === b));
      onPick(b.dataset.cat);
    });
  }

  /* ---------- creators ---------- */
  function creatorCard(c, i) {
    return `
      <button class="creator reveal" style="--d:${(i % 5) * 0.06}s" data-creator="${esc(c.id)}" data-cats="${esc(JSON.stringify(c.categories || []))}">
        <div class="creator__img"><img src="${esc(c.avatar)}" alt="${esc(c.name)}" loading="lazy"></div>
        <div class="creator__body">
          <h3 class="creator__name">${esc(c.name)}</h3>
          <div class="creator__role">${esc(c.role)}</div>
          <div class="creator__tags">${(c.categories || []).slice(0, 3).map((t) => `<span>${esc(t)}</span>`).join('')}${(c.categories || []).length > 3 ? `<span>+${c.categories.length - 3}</span>` : ''}</div>
        </div>
      </button>`;
  }
  function openCreator(c) {
    openModal(`<div class="cmodal">
      <div class="cmodal__img"><img src="${esc(c.avatar)}" alt="${esc(c.name)}"></div>
      <div class="cmodal__body">
        <div class="cmodal__role">${esc(c.role)}</div>
        <h2 class="cmodal__name">${esc(c.name)}</h2>
        ${c.bio ? `<p>${esc(c.bio)}</p>` : ''}
        <h4>ジャンル</h4><div class="tagrow">${(c.categories || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
        ${c.skills && c.skills.length ? `<h4>使用ツール・スキル</h4><div class="tagrow">${c.skills.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
        ${c.links && c.links.length ? `<h4>リンク</h4><div class="tagrow">${c.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)} ↗</a>`).join('')}</div>` : ''}
        <div style="margin-top:32px">${btn('このクリエイターに相談する', '/#contact', '', 'data-close')}</div>
      </div></div>`);
  }

  /* ---------- page: home ---------- */
  async function initHome(data) {
    const { settings, reasons, works, creators } = data;
    const h = settings.hero;

    // hero copy
    $('#hero-eyebrow').textContent = h.eyebrow;
    const title = $('#hero-title');
    title.innerHTML = `${esc(h.titleLine1)}<br><span class="hl">${esc(h.titleLine2)}</span>`;
    title.classList.add('split');
    $('#hero-lead').textContent = h.lead;

    // hero video (desktop / mobile source)
    const video = $('#hero-video');
    const mq = matchMedia('(max-width: 640px)');
    const setSrc = () => {
      const src = mq.matches ? (h.mobileVideo || h.desktopVideo) : (h.desktopVideo || h.mobileVideo);
      if (src && video.getAttribute('src') !== src) { video.src = src; video.play().catch(() => {}); }
    };
    if (h.poster) { video.poster = h.poster; $('.hero__frame').style.backgroundImage = `url("${h.poster}")`; }
    setSrc();
    mq.addEventListener('change', setSrc);

    // stats
    const cats = new Set(creators.flatMap((c) => c.categories || []));
    $('#hero-stats').innerHTML = [
      [creators.length, 'CREATORS', '所属クリエイター'],
      [works.length, 'WORKS', '制作実績'],
      [cats.size, 'GENRES', '対応ジャンル'],
    ].map(([n, en, ja]) => `<div class="stat"><div class="stat__num" data-count="${n}">0<sup>+</sup></div><div class="stat__label">${ja}</div></div>`).join('');
    $$('[data-count]').forEach((el) => countIO.observe(el));

    // about with scroll-filled words
    $('#about-title').textContent = settings.about.title;
    const big = $('#about-big');
    const accentWords = ['審査', 'プロフェッショナル集団', 'トップクリエイター'];
    big.innerHTML = settings.about.text.split(/(?<=[、。])/).map((seg) =>
      `<span class="w ${accentWords.some((a) => seg.includes(a)) ? 'acc' : ''}">${esc(seg)}</span>`).join('');
    const words = $$('.w', big);
    const fillWords = () => {
      const r = big.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    };
    addEventListener('scroll', fillWords, { passive: true });
    fillWords();

    // reasons
    $('#reasons-grid').innerHTML = reasons.map((r, i) => `
      <article class="reason reveal" style="--d:${i * 0.08}s">
        <span class="reason__no">${String(i + 1).padStart(2, '0')}</span>
        <span class="reason__icon">${REASON_ICONS[i % REASON_ICONS.length]}</span>
        <h3>${esc(r.title)}</h3><p>${esc(r.text)}</p>
      </article>`).join('');

    // works (top N)
    const top = works.slice(0, settings.topWorksCount || 6);
    const wg = $('#works-grid');
    wg.innerHTML = top.map(workCard).join('');
    bindWorks(wg, works);

    // creators + filters
    const cg = $('#creators-grid');
    cg.innerHTML = creators.map(creatorCard).join('');
    const counts = { all: creators.length };
    creators.forEach((c) => (c.categories || []).forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    const catList = Object.keys(counts).filter((k) => k !== 'all').sort((a, b) => counts[b] - counts[a]);
    renderFilters($('#creator-filters'), catList, (cat) => {
      $$('.creator', cg).forEach((el, i) => {
        const show = !cat || JSON.parse(el.dataset.cats).includes(cat);
        el.classList.toggle('is-out', !show);
        if (show && !reduced) el.animate([{ opacity: 0, transform: 'translateY(20px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: i * 30, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      });
    }, counts);
    cg.addEventListener('click', (e) => {
      const el = e.target.closest('.creator');
      if (el) openCreator(creators.find((c) => c.id === el.dataset.creator));
    });

    // contact
    $('#contact-title').textContent = settings.contact.title;
    $('#contact-text').textContent = settings.contact.text;
    initContact();

    // hero frame: tilt with mouse, scale on scroll
    const frame = $('.hero__frame');
    if (!reduced) {
      if (finePointer) {
        $('.hero').addEventListener('mousemove', (e) => {
          const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
          frame.style.setProperty('--ry', `${-6 + x * 10}deg`);
          frame.style.setProperty('--rx', `${4 - y * 8}deg`);
          $$('.blob').forEach((b, i) => { b.style.translate = `${x * (i + 1) * 30}px ${y * (i + 1) * 30}px`; });
        });
      }
      addEventListener('scroll', () => {
        const p = Math.min(1, scrollY / innerHeight);
        frame.style.setProperty('--hs', 1 + p * 0.06);
      }, { passive: true });
    }
  }

  /* ---------- contact form ---------- */
  function initContact() {
    const form = $('#contact-form');
    if (!form) return;
    const ta = form.message, count = $('#msg-count');
    ta.addEventListener('input', () => {
      count.textContent = `${ta.value.length} / 500`;
      count.classList.toggle('over', ta.value.length > 500);
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = $('#form-msg');
      msg.className = 'form-msg';
      if (ta.value.length > 500) { msg.classList.add('err'); msg.textContent = 'お問い合わせ内容は500文字以内で入力してください。'; return; }
      const body = Object.fromEntries(new FormData(form));
      const submit = $('button[type=submit]', form);
      submit.disabled = true;
      if (STATIC) {
        msg.classList.add('err');
        msg.textContent = 'このページはプレビュー版のため、フォームの送信はできません。';
        submit.disabled = false;
        return;
      }
      try {
        const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || '送信に失敗しました');
        form.innerHTML = `<div class="form-done"><div class="big">Thank you!</div><p>お問い合わせを受け付けました。担当者より折り返しご連絡いたします。</p></div>`;
      } catch (err) {
        msg.classList.add('err');
        msg.textContent = err.message;
        submit.disabled = false;
      }
    });
  }

  /* ---------- page: works ---------- */
  function initWorksPage(data) {
    const works = data.works;
    const grid = $('#works-all');
    const render = (cat) => {
      const list = cat ? works.filter((w) => w.category === cat) : works;
      grid.innerHTML = list.length ? list.map(workCard).join('') : '<p class="empty">該当する実績はありません</p>';
      bindWorks(grid, works);
      observe(grid);
    };
    const cats = [...new Set(works.map((w) => w.category))];
    const counts = { all: works.length };
    works.forEach((w) => { counts[w.category] = (counts[w.category] || 0) + 1; });
    renderFilters($('#works-filters'), cats, render, counts);
    render('');
  }

  /* ---------- boot ---------- */
  bindButtons();
  fetch(STATIC ? BASE + 'content.json' : '/api/content').then((r) => r.json()).then((data) => {
    if (page === 'home') initHome(data);
    if (page === 'works') initWorksPage(data);
    observe();
    bindButtons();
    if (location.hash) setTimeout(() => { const t = $(location.hash); t && t.scrollIntoView(); }, 50);
  }).catch((err) => console.error('content load failed', err));
  observe();
})();
