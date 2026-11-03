/**
 * case-carousel — full-width customer-evidence slides (background image, stat + logo, quote,
 * attribution, case-study CTA) with arrows and dots.
 *
 * Authoring rows: one slide per row (classified by content, never by index):
 *   - background picture (the first picture of the row)
 *   - stat paragraph (the short figure, e.g. "3X"), stat label paragraph, logo picture
 *   - quote heading (<h3>), attribution paragraph, CTA paragraph (<em> link = secondary button)
 * Reconstructive (repeat group).
 */

const ARROW = '<svg class="ic case-carousel-arrow-ic" xmlns="http://www.w3.org/2000/svg" '
  + 'width="1em" height="1em" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">'
  + '<path d="m553.85-253.85-42.16-43.38L664.46-450H180v-60h484.46L511.69-662.77l42.16-43.38L780'
  + '-480 553.85-253.85Z"></path></svg>';

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
 * Builds one slide from an authored row by moving its nodes.
 * @param {Element} row authored row
 * @returns {HTMLElement}
 */
function buildSlide(row) {
  const pictures = [...row.querySelectorAll('picture')];
  const bg = pictures[0] || null;
  const logo = pictures[1] || null;
  const quote = row.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const ctas = paras.filter((p) => p.querySelector('a'));
  const texts = paras.filter((p) => !p.querySelector('a'));
  const order = [...row.querySelectorAll('*')];
  const before = texts.filter((p) => !quote || order.indexOf(p) < order.indexOf(quote));
  const after = texts.filter((p) => !before.includes(p));

  const slide = el('article', 'case');
  slide.dataset.theme = 'dark';
  const back = el('div', 'case-bg');
  if (bg) back.append(bg.closest('p') || bg);
  back.append(el('div', 'case-shade1'), el('div', 'case-shade2'));

  const frame = el('div', 'case-frame');
  const inner = el('div', 'case-in');
  const stats = el('div', 'case-stats');
  const stat = el('div', 'case-stat');
  if (before[0]) {
    const num = wrapNode(before[0], 'case-num');
    num.setAttribute('role', 'heading');
    num.setAttribute('aria-level', '3');
    stat.append(num);
  }
  before.slice(1).forEach((p) => stat.append(wrapNode(p, 'case-stat-label')));
  stats.append(stat);
  const logoWrap = el('div', 'case-logo-wrap');
  if (logo) logoWrap.append(wrapNode(logo.closest('p') || logo, 'case-logo'));
  stats.append(logoWrap);

  const col = el('div', 'case-quote-col');
  const stack = el('div', 'case-quote-stack');
  const block = el('div', 'case-quote');
  if (quote) {
    const q = wrapNode(quote, 'case-q');
    const first = quote.firstChild;
    if (first && first.nodeType === Node.TEXT_NODE && /^\s*“/.test(first.textContent)) {
      // the authored opening mark hangs in the margin: wrap that one character (textContent
      // unchanged — a presentation refinement, EW2)
      const at = first.textContent.indexOf('“');
      const rest = first.splitText(at);
      rest.splitText(1);
      const mark = el('span', 'case-qmark');
      rest.replaceWith(mark);
      mark.append(rest);
    } else {
      const mark = el('span', 'case-qmark');
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = '“';
      q.append(mark);
    }
    block.append(q);
  }
  after.forEach((p) => block.append(wrapNode(p, 'case-by')));
  stack.append(block);
  if (ctas.length) {
    const row2 = el('div', 'cta-row');
    row2.append(...ctas);
    // the live CTA carries its arrow as an inline glyph (presentational, not authored text)
    row2.querySelectorAll('a.button').forEach((a) => {
      if (a.querySelector('svg')) return;
      a.insertAdjacentHTML('beforeend', ARROW.replace('case-carousel-arrow-ic', 'case-cta-ic'));
    });
    stack.append(row2);
  }
  col.append(stack);
  inner.append(stats, col);
  frame.append(inner);
  slide.append(back, frame);
  return slide;
}

export default function decorate(block) {
  const rows = [...block.children]
    .filter((r) => r.querySelector('h1, h2, h3, h4, h5, h6, picture'));
  const root = el('div', 'case-carousel-inner');
  const track = el('div', 'case-carousel-track');
  const slides = rows.map(buildSlide);
  track.append(...slides);

  const prev = el('button', 'case-carousel-arrow case-carousel-prev');
  prev.type = 'button';
  prev.dataset.theme = 'dark';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = ARROW;
  const next = el('button', 'case-carousel-arrow case-carousel-next');
  next.type = 'button';
  next.dataset.theme = 'dark';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = ARROW;

  const dots = el('div', 'case-carousel-dots');
  dots.dataset.theme = 'dark';
  dots.setAttribute('aria-label', 'Gallery pagination');
  const dotEls = slides.map((s, i) => {
    const d = el('span', 'case-carousel-dot');
    d.setAttribute('role', 'button');
    d.tabIndex = 0;
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.dataset.active = String(i === 0);
    return d;
  });
  dots.append(...dotEls);
  root.append(track, prev, dots, next);
  block.replaceChildren(root);

  const step = () => (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth);
  const go = (i) => track.scrollTo({ left: i * step(), behavior: 'smooth' });
  const sync = () => {
    const max = track.scrollWidth - track.clientWidth - 1;
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= max;
    const i = Math.min(Math.round(track.scrollLeft / (step() || 1)), dotEls.length - 1);
    dotEls.forEach((d, k) => { d.dataset.active = String(k === i); });
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  dotEls.forEach((d, k) => {
    d.addEventListener('click', () => go(k));
    d.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go(k);
      }
    });
  });
  track.addEventListener('scroll', sync, { passive: true });
  new ResizeObserver(sync).observe(track);
  sync();
}
