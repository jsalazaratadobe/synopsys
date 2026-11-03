/**
 * tile-rail — horizontal gallery of tall image tiles (scroll-snap rail, arrows, dots).
 *
 * Authoring rows: one tile per row (classified by content, never by index):
 *   - picture: the tile image
 *   - <h3> title, description paragraph
 *   - link paragraph: the tile target; its label is the badge text ("Explore") — the whole
 *     tile becomes the link (card-as-link, EW6: the inner anchor is unwrapped)
 * Reconstructive (repeat group).
 */

const ARROW = '<svg class="ic tile-rail-arrow-ic" xmlns="http://www.w3.org/2000/svg" width="1em" '
  + 'height="1em" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="m553.85'
  + '-253.85-42.16-43.38L664.46-450H180v-60h484.46L511.69-662.77l42.16-43.38L780-480 '
  + '553.85-253.85Z">'
  + '</path></svg>';
const BACK = '<svg class="ic tile-rail-arrow-ic" xmlns="http://www.w3.org/2000/svg" width="1em" '
  + 'height="1em" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="M398.08'
  + '-253.85 171.92-480l226.16-226.15 42.15 43.38L287.46-510h500.62v60H287.46l152.77 152.77-42.15 '
  + '43.38Z"></path></svg>';
const PLUS = '<svg class="ic tile-rail-badge-ic" xmlns="http://www.w3.org/2000/svg" width="1em" '
  + 'height="1em" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="M450-450'
  + 'H220v-60h230v-230h60v230h230v60H510v230h-60v-230Z"></path></svg>';

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

function wrapNode(node, className) {
  const w = el('div', className);
  w.append(node);
  return w;
}

/**
 * Builds one tile from an authored row by moving its nodes.
 * @param {Element} row authored row
 * @returns {HTMLElement}
 */
function buildTile(row) {
  const picture = row.querySelector('picture') || row.querySelector('img');
  const title = row.querySelector('h1, h2, h3, h4, h5, h6');
  const link = row.querySelector('a[href]');
  const linkPar = link ? (link.closest('p') || link) : null;
  const descs = [...row.querySelectorAll('p')]
    .filter((p) => p !== linkPar && !p.querySelector('picture, img'));

  const tile = el(link ? 'a' : 'div', 'tile');
  if (link) {
    tile.href = link.getAttribute('href');
    if (title) tile.setAttribute('aria-label', title.textContent.trim());
  }
  const card = el('article', 'tile-card');
  card.dataset.theme = 'dark';
  const media = el('div', 'tile-media');
  if (picture) media.append(picture);
  media.append(el('div', 'tile-shade'));
  const body = el('div', 'tile-body');
  const head = el('div', 'tile-head');
  if (title) head.append(wrapNode(title, 'tile-title'));
  const more = el('div', 'tile-more');
  descs.forEach((p) => more.append(wrapNode(p, 'tile-desc')));
  head.append(more);
  body.append(head);
  if (linkPar) {
    const badge = el('span', 'tile-badge');
    const inner = el('span', 'tile-badge-in');
    inner.append(linkPar);
    link.replaceWith(...link.childNodes);
    badge.append(inner);
    badge.insertAdjacentHTML('beforeend', PLUS);
    body.append(badge);
  }
  card.append(media, body);
  tile.append(card);
  return tile;
}

function wireRail(root, track) {
  const prev = root.querySelector('.tile-rail-prev');
  const next = root.querySelector('.tile-rail-next');
  const dots = [...root.querySelectorAll('.tile-rail-dot')];
  const items = [...track.children];
  const edgeR = root.querySelector('.tile-rail-edge-r');
  const edgeL = root.querySelector('.tile-rail-edge-l');
  const step = () => (items[1] ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth);
  const sync = () => {
    const max = track.scrollWidth - track.clientWidth - 1;
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= max;
    root.classList.toggle('is-static', prev.disabled && next.disabled);
    const i = Math.min(Math.round(track.scrollLeft / step()), dots.length - 1);
    dots.forEach((d, k) => { d.dataset.active = String(k === i); });
    edgeR.style.opacity = track.scrollLeft >= max ? '0' : '1';
    edgeL.style.opacity = track.scrollLeft <= 0 ? '0' : '1';
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  dots.forEach((d, k) => d.addEventListener('click', () => {
    track.scrollTo({ left: k * step(), behavior: 'smooth' });
  }));
  dots.forEach((d, k) => d.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      track.scrollTo({ left: k * step(), behavior: 'smooth' });
    }
  }));
  track.addEventListener('scroll', sync, { passive: true });
  new ResizeObserver(sync).observe(track);
  sync();
}

export default function decorate(block) {
  const rows = [...block.children]
    .filter((r) => r.querySelector('h1, h2, h3, h4, h5, h6, picture'));
  const root = el('div', 'tile-rail-inner');
  const view = el('div', 'tile-rail-view');
  const track = el('div', 'tile-rail-track');
  rows.forEach((r) => track.append(buildTile(r)));
  view.append(track, el('div', 'tile-rail-edge tile-rail-edge-r'));
  view.append(el('div', 'tile-rail-edge tile-rail-edge-l'));

  const dots = el('div', 'tile-rail-dots');
  dots.setAttribute('aria-label', 'Gallery pagination');
  rows.forEach((r, i) => {
    const d = el('span', 'tile-rail-dot');
    d.setAttribute('role', 'button');
    d.tabIndex = 0;
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.dataset.active = String(i === 0);
    dots.append(d);
  });

  const arrows = el('div', 'tile-rail-arrows');
  const prev = el('button', 'tile-rail-arrow tile-rail-prev');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = BACK;
  const next = el('button', 'tile-rail-arrow tile-rail-next');
  next.type = 'button';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = ARROW;
  arrows.append(prev, next);

  root.append(view, dots, arrows);
  block.replaceChildren(root);
  wireRail(root, track);
}
