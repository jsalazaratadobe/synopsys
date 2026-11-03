/**
 * cta-band — closing call-to-action band.
 *
 * Authoring rows (classified by content, never by index):
 *   - optional Vidyard link row (`https://play.vidyard.com/<id>`) — video variant background
 *   - copy: optional eyebrow heading (before the title), title heading, optional lede
 *     paragraph(s), CTA paragraph(s) (<strong> = primary, <em> = secondary)
 *
 * @variants block class: video | lede | default (default default) — video: centred copy over
 *   a muted looping Vidyard background, tall; lede: left title + lede + button; default:
 *   centred title + button
 * @ew-exempt <p> Vidyard source link — the background player's id, never displayed
 * Template-slotted.
 */

const VIDYARD = /play\.vidyard\.com\/([A-Za-z0-9]+)/;

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

function vidyardBackground(id) {
  const vy = el('div', 'vy');
  const region = el('div', 'vy-region');
  const poster = el('img', 'vy-poster');
  poster.src = `https://play.vidyard.com/${id}.jpg`;
  poster.alt = '';
  poster.loading = 'lazy';
  const frame = el('iframe', 'vy-frame');
  frame.src = `https://play.vidyard.com/${id}/type/background?disable_popouts=1&autoplay=1`
    + '&v=4.3.26&type=inline&muted=1&loop=1&hidden_controls=1&disable_ctas=1';
  frame.title = 'Vidyard video player';
  frame.allow = 'autoplay; fullscreen; picture-in-picture';
  frame.loading = 'lazy';
  frame.setAttribute('tabindex', '-1');
  frame.setAttribute('aria-hidden', 'true');
  region.append(poster, frame);
  vy.append(region);
  return vy;
}

export default function decorate(block) {
  const link = [...block.querySelectorAll('a[href]')].find((a) => VIDYARD.test(a.href));
  const linkPar = link ? (link.closest('p') || link) : null;
  const headings = [...block.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  const paras = [...block.querySelectorAll('p')].filter((p) => p !== linkPar);
  const ctas = paras.filter((p) => p.querySelector('a'));
  const ledes = paras.filter((p) => !ctas.includes(p));

  const pad = el('div', 'cta-band-pad');
  const wrap = el('div', 'cta-band-wrap');
  const stack = el('div', 'cta-band-stack');
  const head = el('div', 'cta-band-head');
  headings.forEach((h, i) => {
    const eyebrow = headings.length > 1 && i < headings.length - 1;
    head.append(wrapNode(h, eyebrow ? 'cta-band-eyebrow' : 'cta-band-title'));
  });
  ledes.forEach((p) => head.append(wrapNode(p, 'cta-band-lede')));
  stack.append(head);
  if (ctas.length) {
    const row = el('div', 'cta-row');
    row.append(...ctas);
    stack.append(row);
  }
  wrap.append(stack);

  const parts = [];
  if (link) {
    const bg = el('div', 'cta-band-bg');
    bg.append(vidyardBackground(link.href.match(VIDYARD)[1]));
    parts.push(bg);
  }
  pad.append(wrap);
  parts.push(pad);
  block.replaceChildren(...parts);
}
