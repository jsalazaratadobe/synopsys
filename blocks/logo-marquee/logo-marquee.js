/**
 * logo-marquee — heading over rows of logos scrolling in an endless marquee.
 *
 * Authoring rows (classified by content):
 *   - heading row: <h2>
 *   - logo rows: one row per marquee lane, its pictures in order
 * Each lane is doubled with a presentational copy (instrumentation stripped) so the -50 %
 * translate loops seamlessly; lanes alternate 40 s / 30 s. Reconstructive.
 */

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
  node.removeAttribute('data-image-index');
  return node;
}

export default function decorate(block) {
  const rows = [...block.children];
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');

  const root = el('div', 'logo-marquee-inner');
  const head = el('div', 'logo-marquee-head');
  if (heading) head.append(heading);
  root.append(head);

  const marquee = el('div', 'logo-marquee-track');
  marquee.append(el('div', 'logo-marquee-fade logo-marquee-fade-l'));
  marquee.append(el('div', 'logo-marquee-fade logo-marquee-fade-r'));
  const lanes = el('div', 'logo-marquee-rows');
  let lane = 0;
  rows.forEach((row) => {
    const pics = [...row.querySelectorAll('picture')];
    const imgs = pics.length ? pics : [...row.querySelectorAll('img')];
    if (!imgs.length) return;
    const line = el('div', `logo-marquee-row${lane % 2 ? ' logo-marquee-row-medium' : ''}`);
    lane += 1;
    const items = imgs.map((pic) => {
      const item = el('div', 'logo-marquee-item');
      item.append(pic.closest('p') || pic);
      return item;
    });
    line.append(...items);
    items.forEach((item) => {
      const copy = stripInstrumentation(item.cloneNode(true));
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
      line.append(copy);
    });
    lanes.append(line);
  });
  marquee.append(lanes);
  root.append(marquee);
  block.replaceChildren(root);
}
