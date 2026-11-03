/**
 * product-subnav — the product's pill sub-navigation (title, page links, trial CTA).
 *
 * Authoring rows (classified by content):
 *   - title paragraph (no link), e.g. "Fluent"
 *   - a list (<ul>) of page links; the link matching the current path is marked active
 *   - CTA paragraph(s) — <em> link = secondary button (sticky copy shows it as primary)
 *
 * Below 1280px the list folds into a dropdown opened by a chevron toggle; at 1280px and up a
 * fixed sticky copy (presentational clone) shows once the bar scrolls under the utility bar.
 * Reconstructive (link list).
 */

const CHEVRON = '<svg class="ic" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" '
  + 'viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="m480-541.85-184 '
  + '184L253.85-400 480-626.15 706.15-400 664-357.85l-184-184Z"></path></svg>';
const STICKY_TOP = 57;

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

function samePath(a) {
  try {
    const p = new URL(a.href, window.location.href).pathname.replace(/\/$/, '');
    return p === window.location.pathname.replace(/\/$/, '');
  } catch {
    return false;
  }
}

function setOpen(bar, open) {
  bar.dataset.open = String(open);
  const toggle = bar.querySelector('.subnav-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', String(open));
  const panel = bar.querySelector('.subnav-links');
  if (panel) panel.dataset.open = String(open);
}

function wireToggle(bar) {
  const toggle = bar.querySelector('.subnav-toggle');
  const row = bar.querySelector('.subnav-title');
  const flip = (e) => {
    e.stopPropagation();
    setOpen(bar, bar.dataset.open !== 'true');
  };
  if (toggle) toggle.addEventListener('click', flip);
  if (row) row.addEventListener('click', (e) => { if (!e.target.closest('button')) flip(e); });
}

export default function decorate(block) {
  const list = block.querySelector('ul, ol');
  const paras = [...block.querySelectorAll('p')].filter((p) => !list || !list.contains(p));
  const title = paras.find((p) => !p.querySelector('a'));
  const ctas = paras.filter((p) => p.querySelector('a'));

  const subnav = el('div', 'subnav');
  const wrap = el('div', 'subnav-wrap');
  const bar = el('nav', 'subnav-bar');
  bar.setAttribute('aria-label', 'Product navigation');
  bar.dataset.open = 'false';
  const inner = el('div', 'subnav-inner');
  subnav.append(wrap);
  wrap.append(bar);
  bar.append(inner);

  const head = el('div', 'subnav-title');
  if (title) head.append(title);
  const toggle = el('button', 'subnav-toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Open subnavigation menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = CHEVRON;
  head.append(toggle);
  inner.append(head);

  const links = el('div', 'subnav-links menu-panel');
  links.dataset.open = 'false';
  if (list) {
    list.querySelectorAll('a').forEach((a) => {
      if (samePath(a)) a.setAttribute('aria-current', 'page');
    });
    links.append(list);
  }
  inner.append(links);

  const cta = el('div', 'subnav-cta');
  cta.append(...ctas);
  inner.append(cta);

  block.replaceChildren(subnav);
  wireToggle(bar);
  document.addEventListener('click', (e) => {
    if (!bar.contains(e.target) && bar.dataset.open === 'true') setOpen(bar, false);
  });

  // sticky copy: presentational clone, fixed under the utility bar once the bar scrolls past
  const sticky = stripInstrumentation(subnav.cloneNode(true));
  const holder = el('div', 'subnav-sticky');
  holder.setAttribute('aria-hidden', 'true');
  holder.inert = true;
  holder.append(sticky);
  holder.querySelectorAll('.subnav-cta a').forEach((a) => {
    a.classList.remove('secondary');
    a.classList.add('primary');
  });
  block.append(holder);
  const stick = () => {
    const on = window.innerWidth >= 1280
      && bar.getBoundingClientRect().bottom <= STICKY_TOP;
    if (on === holder.classList.contains('is-shown')) return;
    holder.classList.toggle('is-shown', on);
    if (on) {
      requestAnimationFrame(() => requestAnimationFrame(() => holder.classList.add('is-sticky')));
    } else holder.classList.remove('is-sticky');
  };
  window.addEventListener('scroll', stick, { passive: true });
  window.addEventListener('resize', stick);
  stick();
}
