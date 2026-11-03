/**
 * split — text / media 50-50 band.
 *
 * Authoring (one row, two cells; classified by content):
 *   - text cell: optional icon (`:name:`), optional eyebrow heading (<h3> before the title),
 *     title heading (<h2>), lede paragraph(s) or a list, CTA paragraph(s) (<em> = secondary),
 *     optional checklist: each heading after the title (<h4>–<h6>) starts a check item whose
 *     following paragraph(s) are its text
 *   - an icon span inside running text (the pipeline's `:word:` decoration) is restored to text
 *   - media cell: a Vidyard link (`https://play.vidyard.com/<id>`) — a muted looping
 *     background player — or a picture
 *
 * @variants block class: reverse | default (default default) — reverse puts the media first
 * @ew-exempt <p> Vidyard source link — the inline background player's id, never displayed
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
  // the ratio box follows the video's aspect (Vidyard sizes it from the poster frame)
  poster.addEventListener('load', () => {
    if (poster.naturalWidth) {
      const pct = (poster.naturalHeight / poster.naturalWidth) * 100;
      region.style.paddingBottom = `${pct.toFixed(2)}%`;
    }
  });
  const frame = el('iframe', 'vy-frame');
  frame.src = `https://play.vidyard.com/${id}/type/background?disable_popouts=1&autoplay=1`
    + '&v=4.3.26&type=inline&muted=1&loop=1&hidden_controls=1&disable_ctas=1';
  frame.title = 'Vidyard video player';
  frame.allow = 'autoplay; fullscreen; picture-in-picture';
  frame.loading = 'lazy';
  frame.setAttribute('tabindex', '-1');
  region.append(poster, frame);
  vy.append(region);
  return vy;
}

export default function decorate(block) {
  const link = [...block.querySelectorAll('a[href]')].find((a) => VIDYARD.test(a.href));
  const linkPar = link ? (link.closest('p') || link) : null;
  const picture = block.querySelector('picture');
  // the delivery pipeline turns any `:word:` run in prose into an icon span; an icon sharing
  // its paragraph with text is authored prose (e.g. "applications:Aerospace:") — restore it
  block.querySelectorAll('p .icon').forEach((span) => {
    const name = [...span.classList].find((c) => c.startsWith('icon-'));
    if (name && span.closest('p').textContent.trim()) span.replaceWith(`:${name.slice(5)}:`);
  });
  const icon = block.querySelector('.icon');
  const iconPar = icon ? (icon.closest('p') || icon) : null;
  const headings = [...block.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  const title = headings.find((h) => h.tagName === 'H2') || headings[headings.length - 1];
  const order = [...block.querySelectorAll('*')];
  const after = (a, b) => order.indexOf(a) < order.indexOf(b);
  const checkHeads = title ? headings.filter((h) => h !== title && after(title, h)
    && /^H[4-6]$/.test(h.tagName)) : [];
  const eyebrows = headings.filter((h) => h !== title && !checkHeads.includes(h));
  const nodes = [...block.querySelectorAll('p, ul, ol')]
    .filter((n) => n !== linkPar && n !== iconPar && !n.closest('li')
      && !n.querySelector('picture') && !n.closest('picture'));
  // a node after the first check heading belongs to the nearest check heading before it
  const ownerOf = (n) => checkHeads.filter((h) => after(h, n)).pop();
  const paras = nodes.filter((n) => !ownerOf(n));
  const ctas = paras.filter((n) => n.tagName === 'P' && n.querySelector('a'));
  const ledes = paras.filter((n) => !ctas.includes(n));

  const article = el('article', 'split-inner');
  const text = el('div', 'split-text');
  const head = el('div', 'split-head');
  const titles = el('div', 'split-titles');
  if (iconPar) titles.append(wrapNode(iconPar, 'split-ic'));
  eyebrows.forEach((h) => titles.append(wrapNode(h, 'split-eyebrow')));
  if (title) titles.append(wrapNode(title, 'split-title'));
  head.append(titles);
  ledes.forEach((n) => head.append(wrapNode(n, 'split-lede')));
  text.append(head);
  if (checkHeads.length) {
    const list = el('ul', 'split-checks');
    checkHeads.forEach((h) => {
      const owned = nodes.filter((n) => ownerOf(n) === h);
      const item = el('li', 'split-check');
      const row = el('div', 'split-check-row');
      const body = el('div', 'split-check-body');
      body.append(wrapNode(h, 'split-check-title'));
      if (owned.length) {
        const txt = el('div', 'split-check-text');
        txt.append(...owned);
        body.append(txt);
      }
      row.append(el('span', 'split-check-ic'), body);
      item.append(row);
      list.append(item);
    });
    text.append(list);
  }
  if (ctas.length) {
    const row = el('div', 'cta-row');
    row.append(...ctas);
    text.append(row);
  }

  const media = el('div', 'split-media');
  if (link) {
    media.classList.add('split-media-video');
    media.append(vidyardBackground(link.href.match(VIDYARD)[1]));
  } else if (picture) {
    media.append(picture);
  }
  article.append(text, media);
  block.replaceChildren(article);
}
