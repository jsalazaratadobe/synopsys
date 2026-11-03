/* canon.js — shared minimal behaviour for the Ansys replica prototypes:
   header dropdowns / mega menus, search + mobile drawer dialogs, sub-nav toggle,
   FAQ accordion, gallery rails and case-study carousel arrows/dots. */
(() => {
  const swapState = (btn, open) => {
    const spans = btn.querySelectorAll(':scope > span');
    if (spans.length === 2) {
      spans[0].hidden = open; spans[1].hidden = !open;
      spans[0].classList.toggle('hidden', open); spans[1].classList.toggle('hidden', !open);
    }
    if (btn.hasAttribute('aria-expanded')) btn.setAttribute('aria-expanded', String(open));
  };
  const panels = [];
  const resetTabs = (panel) => panel.querySelectorAll('[role=tablist]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role=tab]')];
    tabs.forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === 0)); t.tabIndex = i === 0 ? 0 : -1;
      const p = document.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = i !== 0;
    });
  });
  const setOpen = (btn, panel, open) => {
    if (!open) resetTabs(panel); // live resets the mega-menu tabs on close (data-reset-tabs-on-close)
    panel.dataset.open = String(open);
    const item = btn.parentElement; if (item) item.dataset.open = String(open);
    swapState(btn, open);
  };
  const closeAll = (except) => panels.forEach(([b, p]) => { if (p !== except && p.dataset.open === 'true') setOpen(b, p, false); });

  // dropdown pattern: <button> followed by .menu-panel sibling
  document.querySelectorAll('.menu-panel').forEach((panel) => {
    const btn = panel.previousElementSibling;
    if (!btn || btn.tagName !== 'BUTTON') return;
    panels.push([btn, panel]);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = panel.dataset.open !== 'true';
      if (!btn.closest('.faq__item')) closeAll(panel);
      setOpen(btn, panel, open);
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-panel')) panels.forEach(([b, p]) => { if (!b.closest('.faq__item') && p.dataset.open === 'true') setOpen(b, p, false); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = panels.find(([b, p]) => p.dataset.open === 'true' && !b.closest('.faq__item'));
    closeAll(null);
    if (open) open[0].focus(); // focus returns to the trigger (header contract)
  });

  // mega-menu tabs
  document.querySelectorAll('.mega [role=tablist]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role=tab]')];
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
        const p = document.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = !on;
      });
    }));
  });

  // dialogs: search + mobile drawer
  const search = document.querySelector('.modal--search');
  const drawer = document.querySelector('.modal--drawer');
  const openModal = (d) => { if (!d || d.open) return; if (d !== search && search && search.open) search.close(); d.showModal(); document.documentElement.classList.add('is-scroll-locked'); };
  document.querySelectorAll('.nav-search, .dr-search').forEach((b) => b.addEventListener('click', () => openModal(search)));
  document.querySelectorAll('.burger').forEach((b) => b.addEventListener('click', () => openModal(drawer)));
  document.querySelectorAll('.modal__close').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
  document.querySelectorAll('dialog.modal').forEach((d) => d.addEventListener('close', () => {
    if (!document.querySelector('dialog.modal[open]')) document.documentElement.classList.remove('is-scroll-locked');
  }));
  // drawer: level-1 triggers slide their sub-panel in; the panel's first button (Back) slides it out
  document.querySelectorAll('.dr-trigger[aria-controls]').forEach((t) => {
    const panel = document.getElementById(t.getAttribute('aria-controls'));
    if (!panel) return;
    const back = panel.querySelector('.dr-back');
    t.addEventListener('click', () => { panel.dataset.active = 'true'; t.setAttribute('aria-expanded', 'true'); if (back) back.focus(); });
    if (back) back.addEventListener('click', () => { panel.dataset.active = 'false'; t.setAttribute('aria-expanded', 'false'); t.focus(); });
  });

  // sticky clones: the fixed copy shows once its in-flow original has scrolled under its top offset (≥1280px)
  const pairs = [['.hdr-sticky', '.hdr-ubar'], ['.subnav-sticky', '.subnav-static']]
    .map(([c, o]) => [document.querySelector(c), document.querySelector(o)]).filter(([c, o]) => c && o);
  const stick = () => pairs.forEach(([clone, orig]) => {
    const top = parseFloat(clone.style.top || getComputedStyle(clone).top) || 0;
    const ref = orig.querySelector('.ubar, .subnav__bar') || orig;
    const on = window.innerWidth >= 1280 && ref.getBoundingClientRect().bottom <= top;
    if (on === (clone.style.display === 'block')) return;
    clone.style.display = on ? 'block' : 'none';
    if (on) requestAnimationFrame(() => requestAnimationFrame(() => clone.classList.add('is-sticky')));
    else clone.classList.remove('is-sticky');
  });
  window.addEventListener('scroll', stick, { passive: true });
  window.addEventListener('resize', stick);
  stick();

  // horizontal rails: arrows + dots + edge fades
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('.rail__track, .cases__track');
    const prev = root.querySelector('[aria-label="Previous slide"]');
    const next = root.querySelector('[aria-label="Next slide"]');
    const dots = [...root.querySelectorAll('.dot')];
    const items = [...track.children];
    const step = () => (items[1] ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth);
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth - 1;
      if (prev) { prev.disabled = track.scrollLeft <= 0; prev.classList.toggle('disabled', prev.disabled); }
      if (next) { next.disabled = track.scrollLeft >= max; next.classList.toggle('disabled', next.disabled); }
      const i = Math.round(track.scrollLeft / step());
      dots.forEach((d, k) => d.dataset.activeDot = String(k === Math.min(i, dots.length - 1)));
      const r = root.querySelector('.rail__edge--r'); const l = root.querySelector('.rail__edge--l');
      if (r) r.style.opacity = track.scrollLeft >= max ? '0' : '1';
      if (l) l.style.opacity = track.scrollLeft <= 0 ? '0' : '1';
    };
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    dots.forEach((d, k) => d.addEventListener('click', () => track.scrollTo({ left: k * step(), behavior: 'smooth' })));
    track.addEventListener('scroll', sync, { passive: true });
    sync();
  });
})();
