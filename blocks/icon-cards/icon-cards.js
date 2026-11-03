/**
 * icon-cards — section intro (heading + lede) over a grid of icon cards.
 *
 * Authoring rows (classified by content, never by index):
 *   - intro: <h2> + lede paragraph (no icon)
 *   - card rows: icon (`:name:` → span.icon), <h3>/<h4> title, body paragraph(s)
 * Reconstructive (repeat group).
 */

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
 * Builds one icon card by moving the row's authored nodes.
 * @param {Element} row authored row
 * @returns {HTMLElement}
 */
function buildCard(row) {
  const card = el('div', 'iconcard');
  const icon = row.querySelector('.icon');
  const iconPar = icon ? (icon.closest('p') || icon) : null;
  const title = row.querySelector('h1, h2, h3, h4, h5, h6');
  if (iconPar) card.append(wrapNode(iconPar, 'iconcard-ic'));
  if (title) card.append(wrapNode(title, 'iconcard-title'));
  const body = el('div', 'iconcard-body');
  [...row.querySelectorAll('p, ul, ol')].forEach((n) => {
    if (n !== iconPar && !n.contains(icon) && !n.closest('li')) body.append(n);
  });
  if (body.children.length) card.append(body);
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  const cardRows = rows
    .filter((r) => r.querySelector('.icon') || r.querySelector('h3, h4, h5, h6'));
  const introRows = rows.filter((r) => !cardRows.includes(r));

  const why = el('div', 'icon-cards-inner');
  if (introRows.length) {
    const intro = el('div', 'icon-cards-intro');
    const head = el('div', 'icon-cards-head');
    const lede = el('div', 'icon-cards-lede');
    introRows.forEach((r) => {
      r.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => head.append(h));
      r.querySelectorAll('p').forEach((p) => lede.append(p));
    });
    intro.append(head);
    if (lede.children.length) intro.append(lede);
    why.append(intro);
  }
  const grid = el('div', 'icon-cards-grid');
  cardRows.forEach((r) => grid.append(buildCard(r)));
  why.append(grid);
  block.replaceChildren(why);
}
