import { getMetadata } from '../../scripts/aem.js';
import {
  h, loadIcons, icon, authoredIcon, stripInstrumentation, plainLink,
} from '../../scripts/chrome-utils.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Header — the source's global header, template-slotted from the authored /nav document.
 *
 * /nav content model (default content, one DA section each, in order):
 *  1. utility bar: Synopsys link · Ansys link · h3 country title · current country (p)
 *     · country list (ul) · Ask label (p)
 *  2. brand: logo link (text = its accessible name) · **Free Trials** CTA · drawer card link
 *     · drawer card text (p)
 *  3. menus: each section opening with an h2. With h3 tabs it is a mega menu: per tab, each ul is
 *     a column (li = group: optional :icon:, head link, nested ul of links; a column of plain
 *     links continues the previous column) and trailing p's are the promo (:icon: + strong title,
 *     text, *CTA*). Without h3 it is a dropdown (ul, note p, phone link p, *CTA*).
 *     A section without an h2 right after a menu is that menu's bottom strip (ul of :icon: links,
 *     or strong title p + text p + *CTA*).
 * Chrome UI labels (Search, Menu, Back, placeholder) are fixed UI strings, not authored copy.
 */

const SOURCE_ORIGIN = 'https://ansys.synopsys.com';
const LOCAL_ROOT = '/products/fluids/ansys-fluent';
const UI_ICONS = ['arrow', 'chevron', 'globe', 'sparkle', 'ansys-logo', 'search-glass',
  'customers', 'menu', 'close', 'synopsys-logo'];

const slug = (s) => s.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const arrow = () => icon('arrow', 'ic s-5');
const linkIn = (el) => (el ? el.querySelector('a[href]') : null);

/** Unwraps the paragraph DA/decorateButtons put around a link and returns the plain link. */
function takeLink(el, cls) {
  const a = el && (el.matches('a') ? el : linkIn(el));
  if (!a) return null;
  plainLink(a);
  a.removeAttribute('title');
  if (cls) a.className = cls;
  return a;
}

/** Removes the authored :icon: span that belongs to el (not to nested lists); returns its name. */
function popIcon(el) {
  const span = el.querySelector(':scope > span.icon, :scope > p > span.icon, '
    + ':scope > a > span.icon, :scope > strong > span.icon');
  if (!span) return null;
  const name = authoredIcon(span);
  span.remove();
  return name;
}

/** Moves an element's child nodes into a new wrapper (strong/em unwrapped). */
function contentsOf(el) {
  const inner = el.querySelector(':scope > strong, :scope > em');
  return [...(inner || el).childNodes];
}

/** Two-state trigger content: [closed span, open span] (the source swaps them). */
function twoState(build) {
  // whitespace between the states keeps the accessible name "Label Label", as on the source
  return [h('span', {}, ' ', build(false), ' '), ' ', h('span', { hidden: true }, ' ', build(true), ' ')];
}

/* ---------------------------------------------------------------- parse */

function parseNav(fragment) {
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .map((s) => [...(s.querySelector('.default-content-wrapper') || s).children])
    .filter((els) => els.length);
  const [util = [], brand = [], ...rest] = sections;
  const menus = [];
  let last = null;
  rest.forEach((els) => {
    if (els[0].tagName === 'H2') {
      last = {
        title: els[0], els: els.slice(1), mega: els.some((e) => e.tagName === 'H3'), strip: null,
      };
      menus.push(last);
    } else if (last && !last.strip) last.strip = els;
  });
  return { util, brand, menus };
}

function parseTabs(els) {
  const tabs = [];
  els.forEach((el) => {
    if (el.tagName === 'H3') tabs.push({ title: el, cols: [], promo: [] });
    else if (tabs.length && (el.tagName === 'UL' || el.tagName === 'OL')) {
      tabs[tabs.length - 1].cols.push(el);
    } else if (tabs.length) tabs[tabs.length - 1].promo.push(el);
  });
  return tabs;
}

/* ---------------------------------------------------------------- pieces */

function navLinkItem(li) {
  const name = popIcon(li);
  const a = takeLink(li, 'nav-link link-ansys-nav');
  if (!a) return null;
  a.setAttribute('data-active', 'false');
  if (name) a.prepend(icon(name, 'ic s-8 s-5'));
  a.append(arrow());
  return h('li', {}, a);
}

/** One column ul → mm-group elements. */
function columnGroups(ul) {
  const lis = [...ul.children];
  const nested = lis.some((li) => li.querySelector(':scope ul'));
  if (!nested) {
    return [h(
      'div',
      { class: 'mm-group mm-group-tight' },
      h('div', { class: 'mm-spacer' }),
      h('ul', { class: 'mm-list' }, lis.map(navLinkItem)),
    )];
  }
  return lis.map((li) => {
    const sub = li.querySelector(':scope > ul');
    const name = popIcon(li);
    const head = takeLink(li.querySelector(':scope > a, :scope > p > a'), 'mm-head');
    const group = h('div', { class: 'mm-group' });
    if (name) group.append(icon(name, 'ic mm-gicon'));
    if (head) {
      head.setAttribute('data-active', 'false');
      head.replaceChildren(h('span', { class: 'mm-head-label' }, ...head.childNodes), arrow());
      group.append(head);
    }
    if (sub) group.append(h('ul', { class: 'mm-list' }, [...sub.children].map(navLinkItem)));
    return group;
  });
}

function promoBox(ps) {
  if (!ps.length) return null;
  const [titleP, ...restP] = ps;
  const name = popIcon(titleP);
  const ctaP = restP.find((p) => linkIn(p));
  const textP = restP.find((p) => p !== ctaP);
  titleP.replaceChildren(...contentsOf(titleP));
  titleP.className = 'mm-promo-title';
  if (textP) textP.className = 'mm-promo-text';
  const cta = takeLink(ctaP, 'btn-smtext btn btn-sm btn-secondary');
  if (cta) cta.append(arrow());
  return h(
    'div',
    { class: 'mm-promo' },
    h('div', { class: 'mm-promo-ic' }, name ? icon(name, 'ic s-6') : null),
    h('div', { class: 'mm-stack4' }, titleP, textP),
    h('div', { class: 'mm-promo-cta' }, cta),
  );
}

function strip(els) {
  if (!els) return null;
  const list = els.find((e) => e.tagName === 'UL');
  if (list) {
    return h('div', { class: 'mm-strip' }, h('ul', { class: 'mm-quick' }, [...list.children].map((li) => {
      const name = popIcon(li);
      const a = takeLink(li, 'mm-quick-link');
      a.setAttribute('data-active', 'false');
      a.replaceChildren(
        name ? icon(name, 'ic s-6 mm-ic6') : '',
        h('span', {}, ...a.childNodes),
        icon('arrow', 'ic mm-quick-arrow'),
      );
      return h('li', { class: 'mm-quick-item' }, a);
    })));
  }
  const ctaP = els.find((p) => linkIn(p));
  const [titleP, bodyP] = els.filter((p) => p !== ctaP);
  if (titleP) {
    titleP.replaceChildren(...contentsOf(titleP));
    titleP.className = 'mm-strip-title';
  }
  if (bodyP) bodyP.className = 'mm-strip-body';
  const cta = takeLink(ctaP, 'btn-solid btn-smtext mm-strip-btn btn btn-sm btn-secondary');
  if (cta) cta.append(arrow());
  return h(
    'div',
    { class: 'mm-strip mm-strip-split' },
    h('div', { class: 'mm-strip-text' }, titleP, bodyP),
    h('div', { class: 'mm-strip-cta' }, cta),
  );
}

function megaItem(menu, index) {
  const title = text(menu.title);
  const tabs = parseTabs(menu.els).map((tab, i) => {
    const tabSlug = slug(text(tab.title));
    const groups = tab.cols.map(columnGroups);
    return {
      i,
      title: text(tab.title),
      tabId: `ansys-nav-${tabSlug}-tab-${i}`,
      panelId: `ansys-nav-${tabSlug}-panel-${i}`,
      cols: groups,
      promo: promoBox(tab.promo),
    };
  });
  const single = tabs.length < 2;
  const tabButtons = tabs.map((t) => h('button', {
    class: 'mm-tab',
    'aria-controls': t.panelId,
    'aria-selected': String(t.i === 0),
    role: 'tab',
    id: t.tabId,
    type: 'button',
    tabindex: t.i === 0 ? '0' : '-1',
    'data-active': String(t.i === 0),
  }, t.title));
  const panels = tabs.map((t) => h(
    'div',
    {
      class: 'mm-panel',
      'aria-labelledby': t.tabId,
      role: 'tabpanel',
      id: t.panelId,
      'data-active': String(t.i === 0),
      hidden: t.i !== 0,
    },
    t.cols.map((g) => h('div', { class: 'mm-col' }, g)),
    t.promo ? h('div', { class: 'mm-promo-cell' }, t.promo) : null,
  ));
  const stripEl = strip(menu.strip);
  const trigger = h(
    'button',
    { class: 'nav-trigger btn btn-sm', 'aria-expanded': 'false', type: 'button' },
    twoState((open) => h(
      'span',
      { class: 'nav-trigger-row' },
      h('span', { class: 'nav-trigger-label' }, title),
      icon('chevron', open ? 'ic s-6 nav-trigger-chev' : 'ic s-6 nav-trigger-chev r180'),
      open ? h('div', { class: 'nav-overlay' }) : null,
    )),
  );
  const item = h(
    'div',
    { class: 'nav-item', 'data-open': 'false' },
    trigger,
    h(
      'div',
      { class: 'menu-panel', 'data-open': 'false' },
      h('div', { class: 'mega', 'data-theme': 'light' }, h(
        'div',
        { class: 'mega-in' },
        h(
          'div',
          { class: single ? 'mm-grid1' : 'mm-grid', id: `ansys-nav-${slug(title)}` },
          h(
            'div',
            { role: 'tablist' },
            h(
              'div',
              single ? { hidden: true } : { class: 'mm-tabs' },
              h('div', { class: 'mm-tabs-list' }, tabButtons),
            ),
          ),
          h('div', {}, h('div', single ? {} : { class: 'mm-panels' }, panels)),
        ),
        stripEl,
      )),
    ),
  );
  return {
    item, title, tabs, single, strip: stripEl, index,
  };
}

/* ---------------------------------------------------------------- drawer */

/** Drawer accordion body: all groups flattened, empty divs between (not before tight ones). */
function drawerBody(tab) {
  const list = h('ul', { class: 'mm-list' });
  tab.cols.flat().forEach((g, i) => {
    if (i > 0 && !g.classList.contains('mm-group-tight')) list.append(h('div'));
    const clone = stripInstrumentation(g.cloneNode(true));
    // drawer list items carry their glyph after the label and no arrow (as the source)
    clone.querySelectorAll('a.nav-link').forEach((a) => {
      const glyph = a.querySelector(':scope > svg.s-8');
      if (!glyph) return;
      a.querySelectorAll(':scope > svg:not(.s-8)').forEach((s) => s.remove());
      a.append(glyph);
    });
    list.append(clone);
  });
  return h(
    'div',
    { class: 'dr-acc-body' },
    h('div', { class: 'mm-group' }, list),
    tab.promo ? h('div', {}, stripInstrumentation(tab.promo.cloneNode(true))) : null,
  );
}

function drawerPanel(mega, card) {
  const groups = mega.tabs.map((tab) => {
    if (mega.single) return h('div', { class: 'dr-group' }, drawerBody(tab));
    return h('div', { class: 'dr-group' }, h(
      'div',
      { 'data-open': 'false' },
      h(
        'button',
        { class: 'dr-btn', 'aria-expanded': 'false', type: 'button' },
        twoState((open) => h(
          'div',
          { class: 'dr-acc' },
          h('span', { class: 'dr-acc-title' }, tab.title),
          icon('chevron', `ic s-5 dr-chev dr-chev-sm ${open ? 'r180' : 'r90'}`),
        )),
      ),
      h('div', { class: 'menu-panel', 'data-open': 'false' }, drawerBody(tab)),
    ));
  });
  return h(
    'div',
    {
      class: 'dr-panel',
      'aria-labelledby': `ansys-nav-mobile-trigger-${mega.index}`,
      id: `ansys-nav-mobile-panel-${mega.index}`,
      'data-theme': 'dark',
      'data-active': 'false',
    },
    h(
      'button',
      { class: 'dr-back', type: 'button' },
      icon('chevron', 'ic s-5 rm90'),
      h('span', { class: 'dr-strong' }, 'Back'),
    ),
    h(
      'div',
      { class: 'dr-panel-in' },
      h('span', { class: 'dr-title' }, mega.title),
      h('div', { class: 'dr-groups' }, groups),
      mega.strip ? stripInstrumentation(mega.strip.cloneNode(true)) : null,
      stripInstrumentation(card.cloneNode(true)),
    ),
  );
}

function drawerDropdown(label, iconName, box, ariaLabel) {
  return h(
    'div',
    { class: 'dr-dd', 'data-open': 'false' },
    h('button', {
      class: 'dr-btn', 'aria-label': ariaLabel, 'aria-expanded': 'false', type: 'button',
    }, twoState((open) => h(
      'span',
      { class: 'dr-dd-row' },
      h(
        'span',
        { class: 'dr-dd-label' },
        icon(iconName, 'ic s-6'),
        h('span', { class: 'dr-strong' }, label),
      ),
      icon('chevron', `ic s-6 dr-chev ${open ? 'r180' : 'r90'}`),
    ))),
    h('div', { class: 'menu-panel', 'data-open': 'false' }, box),
  );
}

/* ---------------------------------------------------------------- breadcrumb */

function crumbHref(path) {
  return path === LOCAL_ROOT || path.startsWith(`${LOCAL_ROOT}/`) ? path : `${SOURCE_ORIGIN}${path}`;
}

function breadcrumb() {
  const label = (s) => s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const parts = window.location.pathname.split('/').filter(Boolean);
  const sep = () => h('span', { class: 'ubar-crumb-sep', 'aria-hidden': 'true' }, '/');
  const crumb = (i) => [sep(), h('a', {
    class: 'ubar-crumb', href: crumbHref(`/${parts.slice(0, i + 1).join('/')}`),
  }, label(parts[i]))];
  const nav = h('nav', { class: 'ubar-crumbs', 'aria-label': 'Breadcrumb' });
  const ancestors = parts.slice(0, -1).map((_, i) => i);
  if (ancestors.length >= 3) {
    nav.append(
      ...crumb(0),
      h('button', {
        class: 'ubar-crumb-more',
        type: 'button',
        'aria-expanded': 'false',
        'aria-label': 'Show all breadcrumb steps',
      }, sep(), h('span', { class: 'ubar-crumb-dots' }, '…')),
      h(
        'span',
        { class: 'ubar-crumb-mid', 'aria-hidden': 'true', inert: true },
        ...ancestors.slice(1, -1).flatMap(crumb),
      ),
      ...crumb(ancestors[ancestors.length - 1]),
    );
  } else ancestors.forEach((i) => nav.append(...crumb(i)));
  if (parts.length) {
    nav.append(sep(), h(
      'span',
      { class: 'ubar-crumb ubar-crumb-current' },
      label(parts[parts.length - 1]),
    ));
  }
  return nav;
}

/** Points the country links at the current page's localized path. */
function localizeCountries(list) {
  const here = window.location.pathname.replace(/\/$/, '');
  list.querySelectorAll('a[href]').forEach((a) => {
    const url = new URL(a.getAttribute('href'), window.location.href);
    const at = url.pathname.indexOf(LOCAL_ROOT);
    if (at >= 0 && here.startsWith(LOCAL_ROOT)) {
      const path = url.pathname.slice(0, at) + here;
      a.setAttribute('href', url.origin === window.location.origin ? path : `${url.origin}${path}`);
    }
    // the site is the source's default locale: the link without a locale prefix is current
    a.setAttribute('data-active', String(at === 0));
  });
}

/* ---------------------------------------------------------------- behaviour */

function bindBehaviour(root) {
  const panels = [];
  const swapState = (btn, open) => {
    const spans = btn.querySelectorAll(':scope > span');
    if (spans.length === 2) {
      spans[0].hidden = open;
      spans[1].hidden = !open;
    }
    if (btn.hasAttribute('aria-expanded')) btn.setAttribute('aria-expanded', String(open));
  };
  const resetTabs = (panel) => panel.querySelectorAll('[role=tablist]').forEach((list) => {
    [...list.querySelectorAll('[role=tab]')].forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === 0));
      t.setAttribute('data-active', String(i === 0));
      t.tabIndex = i === 0 ? 0 : -1;
      const p = root.querySelector(`#${t.getAttribute('aria-controls')}`);
      if (p) p.hidden = i !== 0;
    });
  });
  const setOpen = (btn, panel, open) => {
    if (!open) resetTabs(panel);
    panel.dataset.open = String(open);
    if (btn.parentElement) btn.parentElement.dataset.open = String(open);
    swapState(btn, open);
  };
  const closeAll = (except) => panels.forEach(([b, p]) => {
    if (p !== except && p.dataset.open === 'true') setOpen(b, p, false);
  });
  root.querySelectorAll('.menu-panel').forEach((panel) => {
    const btn = panel.previousElementSibling;
    if (!btn || btn.tagName !== 'BUTTON') return;
    panels.push([btn, panel]);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = panel.dataset.open !== 'true';
      // drawer accordions/dropdowns keep their ancestors open
      closeAll(panel.closest('.modal') ? null : panel);
      if (panel.closest('.modal')) {
        panels.forEach(([b, p]) => {
          if (p !== panel && !p.contains(panel) && p.closest('.modal') === panel.closest('.modal')
            && p.dataset.open === 'true') setOpen(b, p, false);
        });
      }
      setOpen(btn, panel, open);
      // a drawer accordion scrolls its header to the top of the slide-in panel (as live)
      const scroller = open && btn.closest('.dr-panel');
      if (scroller) {
        const delta = btn.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
        scroller.scrollTop += delta;
      }
    });
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('.menu-panel')) return;
    panels.forEach(([b, p]) => {
      if (!p.closest('.modal') && p.dataset.open === 'true') setOpen(b, p, false);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = panels.find(([, p]) => p.dataset.open === 'true' && !p.closest('.modal'));
    if (!open) return;
    closeAll(null);
    open[0].focus();
  });

  // mega-menu tabs
  root.querySelectorAll('.mega [role=tablist]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role=tab]')];
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('data-active', String(on));
        t.tabIndex = on ? 0 : -1;
        const p = root.querySelector(`#${t.getAttribute('aria-controls')}`);
        if (p) p.hidden = !on;
      });
    }));
  });

  // dialogs: search + mobile drawer
  const search = root.querySelector('.modal-search');
  const drawer = root.querySelector('.modal-drawer');
  const openModal = (d) => {
    if (!d || d.open) return;
    if (d !== search && search && search.open) search.close();
    closeAll(null);
    d.showModal();
    document.documentElement.classList.add('is-scroll-locked');
  };
  root.querySelectorAll('.nav-search, .dr-search').forEach((b) => b.addEventListener('click', () => openModal(search)));
  root.querySelectorAll('.burger').forEach((b) => b.addEventListener('click', () => openModal(drawer)));
  root.querySelectorAll('.modal-close').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
  root.querySelectorAll('dialog.modal').forEach((d) => d.addEventListener('close', () => {
    if (!document.querySelector('dialog.modal[open]')) document.documentElement.classList.remove('is-scroll-locked');
    // a closed drawer reopens at its first level: slide panels out, collapse dropdowns
    d.querySelectorAll('.dr-panel[data-active="true"]').forEach((p) => { p.dataset.active = 'false'; });
    d.querySelectorAll('.dr-trigger[aria-expanded="true"]').forEach((t) => t.setAttribute('aria-expanded', 'false'));
    panels.forEach(([b, p]) => {
      if (d.contains(p) && p.dataset.open === 'true') setOpen(b, p, false);
    });
  }));
  // drawer: level-1 triggers slide their sub-panel in; Back slides it out
  root.querySelectorAll('.dr-trigger[aria-controls]').forEach((t) => {
    const panel = root.querySelector(`#${t.getAttribute('aria-controls')}`);
    if (!panel) return;
    const back = panel.querySelector('.dr-back');
    t.addEventListener('click', () => {
      panel.dataset.active = 'true';
      t.setAttribute('aria-expanded', 'true');
      if (back) back.focus();
    });
    if (back) {
      back.addEventListener('click', () => {
        panel.dataset.active = 'false';
        t.setAttribute('aria-expanded', 'false');
        t.focus();
      });
    }
  });

  // sticky utility bar: the fixed copy shows once the in-flow bar scrolled away (>= 1280px)
  const clone = root.querySelector('.hdr-sticky');
  const orig = root.querySelector('.hdr-ubar .ubar');
  const stick = () => {
    if (!clone || !orig) return;
    const on = window.innerWidth >= 1280 && orig.getBoundingClientRect().bottom <= 0;
    if (on === (clone.style.display === 'block')) return;
    clone.style.display = on ? 'block' : 'none';
    if (on) requestAnimationFrame(() => requestAnimationFrame(() => clone.classList.add('is-sticky')));
    else clone.classList.remove('is-sticky');
  };
  window.addEventListener('scroll', stick, { passive: true });
  window.addEventListener('resize', stick);
  stick();
}

/* ---------------------------------------------------------------- decorate */

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  const authoredIcons = [...fragment.querySelectorAll('span.icon')].map((s) => authoredIcon(s));
  await loadIcons([...UI_ICONS, ...authoredIcons]);
  const { util, brand, menus } = parseNav(fragment);

  /* utility bar */
  const uLinks = util.filter((e) => linkIn(e) && e.tagName === 'P');
  const synopsys = takeLink(uLinks[0], 'ubar-link');
  const ansys = takeLink(uLinks[1], 'ubar-link');
  const countryTitle = util.find((e) => /^H[1-6]$/.test(e.tagName));
  const countryList = util.find((e) => e.tagName === 'UL');
  const plainPs = util.filter((e) => e.tagName === 'P' && !linkIn(e));
  const afterList = (e) => countryList && util.indexOf(e) > util.indexOf(countryList);
  const countryLabel = text(plainPs.find((p) => !afterList(p)));
  const askLabel = text(plainPs.find((p) => afterList(p))) || 'Ask';
  const countryName = text(countryTitle);
  if (countryTitle) countryTitle.className = 'dd-title';
  if (countryList) {
    countryList.className = 'dd-list';
    countryList.replaceChildren(...[...countryList.children].map(navLinkItem).filter(Boolean));
    localizeCountries(countryList);
  }
  const countryDd = h(
    'div',
    { class: 'dd dd-country', 'data-open': 'false' },
    h('button', {
      class: 'ubar-country btn btn-secondary btn-ghost',
      'aria-label': countryName,
      'aria-expanded': 'false',
      type: 'button',
    }, twoState(() => h(
      'span',
      { class: 'ubar-country-row' },
      h('span', { class: 'sr-only' }, countryName),
      h('div', { class: 'ubar-country-pill' }, icon('globe', 'ic s-5'), h('span', {}, countryLabel)),
    ))),
    h(
      'div',
      { class: 'menu-panel', 'data-open': 'false' },
      h(
        'div',
        { class: 'dd-box dd-box-country', 'data-theme': 'light' },
        h('div', { class: 'dd-stack' }, countryTitle, countryList),
      ),
    ),
  );
  const ubar = h(
    'div',
    { class: 'ubar', 'data-theme': 'dark' },
    h(
      'div',
      { class: 'ubar-left' },
      h(
        'div',
        { class: 'ubar-brand' },
        synopsys,
        h('div', { class: 'ubar-divider', 'aria-hidden': 'true' }),
      ),
      ansys,
      breadcrumb(),
    ),
    h('div', { class: 'ubar-center' }),
    h(
      'div',
      { class: 'ubar-right' },
      countryDd,
      h('button', { class: 'ask-btn', type: 'button' }, icon('sparkle', 'ic s-4'), h('span', {}, askLabel)),
    ),
  );

  /* brand + CTA + drawer card */
  const bLinks = brand.filter((e) => linkIn(e));
  const logoLink = takeLink(bLinks[0], 'main-nav-logo');
  const logoName = text(logoLink);
  logoLink.replaceChildren(
    h('span', { class: 'sr-only' }, ...logoLink.childNodes),
    icon('ansys-logo', 'main-nav-logo-svg'),
  );
  const ctaLink = takeLink(
    bLinks.find((p) => p.querySelector('a.button, strong a')) || bLinks[1],
    'btn btn-sm btn-primary',
  );
  ctaLink.setAttribute('data-active', 'false');
  ctaLink.append(arrow());
  const cardLink = takeLink(bLinks.find((p) => p !== bLinks[0] && !p.contains(ctaLink)), 'dr-card-link');
  if (cardLink) {
    cardLink.setAttribute('data-active', 'false');
    cardLink.append(arrow());
  }
  const cardText = brand.find((e) => e.tagName === 'P' && !linkIn(e));
  if (cardText) cardText.className = 'dr-small';
  const card = h('div', { class: 'dr-pad' }, h(
    'div',
    { class: 'dr-card' },
    h(
      'div',
      { class: 'dr-card-row' },
      h(
        'a',
        { href: synopsys ? synopsys.getAttribute('href') : 'https://www.synopsys.com' },
        h('span', { class: 'sr-only' }, text(synopsys) || 'Synopsys'),
        icon('synopsys-logo', 'dr-syn'),
      ),
      h('div', { class: 'dr-card-sep', 'aria-hidden': 'true' }),
      cardLink,
    ),
    h('div', {}, cardText),
  ));

  /* menus */
  const megas = menus.filter((m) => m.mega).map((m, i) => megaItem(m, i));
  const dropdowns = menus.filter((m) => !m.mega).map((m) => {
    const label = text(m.title);
    const list = m.els.find((e) => e.tagName === 'UL');
    if (list) list.replaceChildren(...[...list.children].map(navLinkItem).filter(Boolean));
    const ps = m.els.filter((e) => e.tagName === 'P');
    const ctaP = ps.find((p) => p.querySelector('a.button, em a, strong a'));
    const phoneP = ps.find((p) => p !== ctaP && linkIn(p));
    const note = ps.find((p) => p !== ctaP && p !== phoneP);
    if (note) note.className = 'mm-small';
    const phone = takeLink(phoneP);
    const cta = takeLink(ctaP, 'btn btn-sm btn-secondary');
    if (cta) {
      cta.setAttribute('data-active', 'false');
      cta.append(arrow());
    }
    const item = h(
      'div',
      { class: 'nav-item nav-item-customers', 'data-open': 'false' },
      h(
        'button',
        { class: 'nav-trigger btn btn-sm', 'aria-expanded': 'false', type: 'button' },
        twoState((open) => h(
          'span',
          { class: 'nav-trigger-row' },
          icon('customers', 'ic s-6'),
          h('span', { class: 'nav-trigger-label' }, label),
          icon('chevron', open ? 'ic s-6' : 'ic s-6 r180'),
        )),
      ),
      h(
        'div',
        { class: 'menu-panel', 'data-open': 'false' },
        h(
          'div',
          { class: 'dd-box dd-box-customers', 'data-theme': 'light' },
          list,
          h('div', { class: 'mm-rule' }),
          h('span', { class: 'mm-stack0' }, note, h('div', { class: 'mm-phone prose' }, phone)),
          h('div', { class: 'cta-row' }, cta),
        ),
      ),
    );
    const box = h(
      'div',
      { class: 'dr-dd-box' },
      list ? stripInstrumentation(list.cloneNode(true)) : null,
      h('div'),
      h(
        'div',
        { class: 'mm-stack0' },
        note ? stripInstrumentation(note.cloneNode(true)) : null,
        h('div', { class: 'mm-phone prose' }, phone ? phone.cloneNode(true) : null),
      ),
      cta ? stripInstrumentation(cta.cloneNode(true)) : null,
    );
    return { item, drawer: drawerDropdown(label, 'customers', box) };
  });

  /* main nav row */
  const mainNav = h(
    'nav',
    { class: 'main-nav' },
    logoLink,
    h('div', { class: 'main-nav-menus' }, megas.map((m) => m.item)),
    h(
      'div',
      { class: 'main-nav-tools' },
      h('button', {
        class: 'nav-search btn btn-md btn-secondary btn-ghost', 'aria-label': 'Search', type: 'button',
      }, h('span', { class: 'sr-only' }, 'Search'), icon('search-glass', 'ic s-6')),
    ),
    dropdowns.map((d) => d.item),
    h('div', { class: 'main-nav-cta' }, ctaLink),
    h('div', { class: 'main-nav-burger' }, h(
      'div',
      { class: 'main-nav-burger-row' },
      h(
        'button',
        { class: 'burger btn btn-md btn-secondary btn-ghost btn-circle', type: 'button' },
        h('span', { class: 'sr-only' }, 'Menu'),
        icon('menu', 'ic s-6'),
      ),
    )),
  );

  /* dialogs */
  const closeRow = () => h(
    'div',
    { class: 'modal-close-row' },
    h('button', { class: 'modal-close', type: 'button', 'aria-label': 'Close' }, icon('close', 'ic s-5')),
  );
  const searchDialog = h(
    'dialog',
    { class: 'modal modal-search', id: 'coveoSearch' },
    h('div', { class: 'modal-box' }, closeRow(), h(
      'div',
      { class: 'modal-body' },
      h('section', { 'data-theme': 'light' }, h(
        'div',
        {},
        h(
          'form',
          {
            class: 'srch-form',
            id: 'coveo-search-form',
            action: `${SOURCE_ORIGIN}/search?tab=AllAnsysTab`,
            method: 'get',
          },
          h(
            'div',
            { class: 'srch-box' },
            icon('search-glass', 'ic s-6'),
            h('input', {
              class: 'srch-input',
              type: 'search',
              name: 'q',
              placeholder: 'Search or ask a question...',
              'aria-label': 'Search',
            }),
          ),
          h('div', { class: 'srch-results', id: 'inline-search-results' }),
        ),
      )),
    )),
  );

  const countryBox = h('div', { class: 'dr-dd-box' }, h(
    'span',
    { class: 'dr-dd-pad' },
    h(
      'div',
      { class: 'mm-stack4' },
      countryTitle ? stripInstrumentation(countryTitle.cloneNode(true)) : null,
      countryList ? stripInstrumentation(countryList.cloneNode(true)) : null,
    ),
  ));
  const drCta = stripInstrumentation(ctaLink.cloneNode(true));
  drCta.className = 'dr-cta btn btn-sm btn-primary';
  const drawer = h(
    'dialog',
    { class: 'modal modal-drawer', id: 'MainNavMenuModal' },
    h('div', { class: 'modal-box' }, closeRow(), h(
      'div',
      { class: 'modal-body' },
      h(
        'div',
        { class: 'dr-col' },
        h('section', { 'data-theme': 'dark' }, h('div', {}, h('div', {}, h(
          'div',
          { class: 'dr-logo' },
          h(
            'a',
            { href: logoLink.getAttribute('href') },
            h('span', { class: 'sr-only' }, logoName),
            icon('ansys-logo', 'dr-logo-svg'),
          ),
        )))),
        h(
          'div',
          { class: 'dr-body' },
          h('div', { class: 'dr-scroll' }, h('section', { 'data-theme': 'dark' }, h(
            'div',
            {},
            h('div', {}, h('nav', {}, h(
              'div',
              { class: 'dr-main' },
              h(
                'button',
                { class: 'dr-search', 'aria-label': 'Search', type: 'button' },
                icon('search-glass', 'ic s-6'),
                h('span', { class: 'dr-search-label' }, 'Search'),
              ),
              h('div', { class: 'dr-triggers' }, megas.map((m) => h('button', {
                class: 'dr-trigger',
                'aria-expanded': 'false',
                'aria-controls': `ansys-nav-mobile-panel-${m.index}`,
                id: `ansys-nav-mobile-trigger-${m.index}`,
                type: 'button',
              }, h('span', { class: 'dr-title' }, m.title), icon('chevron', 'ic s-6 r90')))),
              h('div', { class: 'dr-rule' }),
              h(
                'div',
                { class: 'dr-stack' },
                drawerDropdown(countryName, 'globe', countryBox, countryName),
                dropdowns.map((d) => d.drawer),
                h('button', { class: 'dr-ask', type: 'button' }, icon('sparkle', 'ic s-5'), askLabel),
              ),
              h('div', { class: 'dr-ctas' }, drCta),
              card,
            ))),
          ))),
          megas.map((m) => drawerPanel(m, card)),
        ),
      ),
    )),
  );

  const ubarWrap = h('div', { class: 'hdr-ubar' }, ubar);
  const sticky = h(
    'div',
    { class: 'hdr-sticky', style: 'display:none' },
    stripInstrumentation(ubar.cloneNode(true)),
  );
  const root = h(
    'div',
    { class: 'site-header', 'data-theme': 'dark' },
    sticky,
    h('div', { class: 'hdr-sentinel' }),
    ubarWrap,
    h('div', { class: 'hdr-main' }, mainNav),
    searchDialog,
    drawer,
  );

  block.replaceChildren(root);
  bindBehaviour(root);
}
