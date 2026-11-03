/**
 * hero — page lead band.
 *
 * Authoring rows (queried by content, never by index):
 *   - optional row: a Vidyard link (`https://play.vidyard.com/<id>`) — the background player
 *   - content row: optional eyebrow <h1> (when a title heading follows) or <h1> title,
 *     optional <h2> title,
 *     lede <p>, CTA paragraphs (<strong> link = primary button)
 *
 * @variants block class: video | default (default default) — video plays a muted looping
 *   Vidyard background behind the copy (Template-slotted)
 * @ew-exempt <p> Vidyard source link — the background player's id, never displayed
 */

const VIDYARD = /play\.vidyard\.com\/([A-Za-z0-9]+)/;

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

/**
 * Builds a Vidyard background player (autoplay, muted, loop, hidden controls).
 * @param {string} id Vidyard uuid
 * @returns {HTMLElement}
 */
function vidyardBackground(id) {
  const vy = el('div', 'vy');
  const region = el('div', 'vy-region');
  const poster = el('img', 'vy-poster');
  poster.src = `https://play.vidyard.com/${id}.jpg`;
  poster.alt = '';
  poster.loading = 'eager';
  const frame = el('iframe', 'vy-frame');
  frame.src = `https://play.vidyard.com/${id}/type/background?disable_popouts=1&autoplay=1`
    + '&v=4.3.26&type=inline&muted=1&loop=1&hidden_controls=1&disable_ctas=1';
  frame.title = 'Vidyard video player';
  frame.allow = 'autoplay; fullscreen; picture-in-picture';
  frame.setAttribute('tabindex', '-1');
  frame.setAttribute('aria-hidden', 'true');
  region.append(poster, frame);
  vy.append(region);
  return vy;
}

export default function decorate(block) {
  const link = [...block.querySelectorAll('a[href]')].find((a) => VIDYARD.test(a.href));
  const headings = [...block.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  const ctas = [...block.querySelectorAll('p')]
    .filter((p) => p.querySelector('a') && !p.contains(link));
  const ledes = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('a'));

  const pad = el('div', 'hero-pad');
  const wrap = el('div', 'hero-wrap');
  const stack = el('div', 'hero-stack');
  const head = el('div', 'hero-head');
  pad.append(wrap);
  wrap.append(stack);
  stack.append(head);

  headings.forEach((h, i) => {
    let cls = 'hero-title';
    if (i === 0 && headings.length > 1) cls = 'hero-eyebrow';
    head.append(wrapNode(h, cls));
  });
  ledes.forEach((p) => head.append(wrapNode(p, 'hero-lede')));
  if (ctas.length) {
    const row = el('div', 'cta-row hero-cta');
    row.append(...ctas);
    stack.append(row);
  }

  const parts = [];
  if (link) {
    const id = link.href.match(VIDYARD)[1];
    const bg = el('div', 'hero-bg');
    bg.append(vidyardBackground(id));
    parts.push(bg);
  }
  parts.push(pad);
  block.replaceChildren(...parts);
}
