/**
 * capabilities-list — intro column (eyebrow, heading, lede, CTA) beside a list of icon items.
 *
 * Authoring rows (classified by content, never by index):
 *   - intro: eyebrow paragraph (before the heading), <h2>, lede, CTA paragraph (<em> link)
 *   - item rows: icon (`:name:` → span.icon), <h3>/<h4> title, body paragraph(s)
 * Template-slotted intro, reconstructive item list.
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

function buildItem(row) {
  const card = el('div', 'iconcard');
  const icon = row.querySelector('.icon');
  const iconPar = icon ? (icon.closest('p') || icon) : null;
  const title = row.querySelector('h1, h2, h3, h4, h5, h6');
  if (iconPar) card.append(wrapNode(iconPar, 'iconcard-ic'));
  if (title) card.append(wrapNode(title, 'iconcard-title'));
  const body = el('div', 'iconcard-body');
  [...row.querySelectorAll('p, ul, ol')].forEach((n) => {
    if (n !== iconPar && !n.closest('li')) body.append(n);
  });
  if (body.children.length) card.append(body);
  return card;
}

function buildIntro(rows) {
  const intro = el('div', 'capabilities-list-intro');
  const head = el('div', 'capabilities-list-head');
  const lede = el('div', 'capabilities-list-lede');
  const cta = el('div', 'cta-row capabilities-list-cta');
  rows.forEach((r) => {
    const heading = r.querySelector('h1, h2, h3, h4, h5, h6');
    const order = [...r.querySelectorAll('*')];
    [...r.querySelectorAll('p')].forEach((p) => {
      if (p.querySelector('a')) cta.append(p);
      else if (heading && order.indexOf(p) < order.indexOf(heading)) {
        head.append(wrapNode(p, 'capabilities-list-eyebrow'));
      } else lede.append(p);
    });
    if (heading) head.append(wrapNode(heading, 'capabilities-list-title'));
  });
  intro.append(head);
  if (lede.children.length) intro.append(lede);
  if (cta.children.length) intro.append(cta);
  return intro;
}

export default function decorate(block) {
  const rows = [...block.children];
  const itemRows = rows
    .filter((r) => r.querySelector('.icon') || r.querySelector('h3, h4, h5, h6'));
  const introRows = rows.filter((r) => !itemRows.includes(r));

  const article = el('article', 'capabilities-list-inner');
  article.append(buildIntro(introRows));
  const list = el('div', 'capabilities-list-items');
  const ul = el('ul');
  itemRows.forEach((r) => {
    const li = el('li');
    li.append(buildItem(r));
    ul.append(li);
  });
  list.append(ul);
  article.append(list);
  block.replaceChildren(article);
}
