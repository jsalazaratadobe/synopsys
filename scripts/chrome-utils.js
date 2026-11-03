/*
 * Shared helpers for the chrome blocks (header, footer): a tiny element builder and
 * an inline-SVG icon cache. Icons live in /icons/<name>.svg and are inlined (not <img>)
 * because they paint with currentColor, as on the source.
 */

const ICONS = new Map();

/**
 * Builds an element.
 * @param {string} tag tag name
 * @param {Object} [attrs] attributes; `class` may be a string
 * @param {...(Node|string|null)} children child nodes or text
 * @returns {HTMLElement}
 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === null || v === undefined || v === false) return;
    el.setAttribute(k, v === true ? '' : v);
  });
  children.flat().forEach((c) => {
    if (c === null || c === undefined || c === false) return;
    el.append(c);
  });
  return el;
}

/**
 * Fetches icons into the cache (once each).
 * @param {string[]} names icon names (file names without .svg)
 */
export async function loadIcons(names) {
  const base = (window.hlx && window.hlx.codeBasePath) || '';
  await Promise.all([...new Set(names)].filter((n) => n && !ICONS.has(n)).map(async (n) => {
    ICONS.set(n, '');
    try {
      const resp = await fetch(`${base}/icons/${n}.svg`);
      if (resp.ok) ICONS.set(n, await resp.text());
    } catch (e) {
      // a missing icon degrades to an empty slot
    }
  }));
}

/**
 * Returns an inline <svg> for a cached icon.
 * @param {string} name icon name
 * @param {string} [cls] class list (default "ic")
 * @returns {Element}
 */
export function icon(name, cls = 'ic') {
  const tpl = document.createElement('template');
  tpl.innerHTML = ICONS.get(name) || '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
  const svg = tpl.content.querySelector('svg') || document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', cls);
  if (cls.split(' ').includes('ic')) {
    // icon glyphs size from 1em (as the source); logos size from their CSS width
    svg.setAttribute('width', '1em');
    svg.setAttribute('height', '1em');
  }
  svg.setAttribute('aria-hidden', 'true');
  return svg;
}

/**
 * Name of an authored :icon: span (span.icon.icon-<name>) inside or at el.
 * @param {Element} el element
 * @returns {string|null}
 */
export function authoredIcon(el) {
  const span = el && (el.matches('span.icon') ? el : el.querySelector('span.icon'));
  if (!span) return null;
  const cls = [...span.classList].find((c) => c.startsWith('icon-'));
  return cls ? cls.slice(5) : null;
}

/**
 * Removes the Experience Workspace instrumentation from a presentational clone (EW4).
 * @param {Element} el clone root
 * @returns {Element}
 */
export function stripInstrumentation(el) {
  const attrs = ['data-prose-index', 'data-image-index', 'data-block-index'];
  [el, ...el.querySelectorAll('*')].forEach((n) => attrs.forEach((a) => n.removeAttribute(a)));
  return el;
}

/**
 * Removes the button decoration decorateButtons() put on an authored chrome link.
 * @param {HTMLAnchorElement} a link
 * @returns {HTMLAnchorElement}
 */
export function plainLink(a) {
  a.classList.remove('button', 'primary', 'secondary', 'accent');
  if (!a.className) a.removeAttribute('class');
  return a;
}
