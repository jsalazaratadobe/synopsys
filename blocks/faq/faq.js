/**
 * faq — intro column (heading + lede) beside an accordion of questions.
 *
 * Authoring rows (classified by content):
 *   - intro row: <h2> + lede paragraph (a row with one cell)
 *   - question rows: cell 1 the question heading (<h3>/<h4>), cell 2 the answer (prose)
 * The question stays outside the toggle (EW7): the row takes the click, the +/- button is an
 * icon-only toggle. Reconstructive (repeat group).
 */

const PLUS = '<svg class="ic faq-ic-plus" xmlns="http://www.w3.org/2000/svg" width="1em" '
  + 'height="1em" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="M450-450'
  + 'H220v-60h230v-230h60v230h230v60H510v230h-60v-230Z"></path></svg>';
const MINUS = '<svg class="ic faq-ic-minus" xmlns="http://www.w3.org/2000/svg" width="1em" '
  + 'height="1em" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">'
  + '<path d="M220-450v-60h520v60H220Z"></path></svg>';

let uid = 0;

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
  const cells = [...row.children];
  const qCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6')) || cells[0];
  const question = qCell.querySelector('h1, h2, h3, h4, h5, h6');
  const answerCells = cells.filter((c) => c !== qCell);

  uid += 1;
  const panelId = `faq-panel-${uid}`;
  const item = el('div', 'faq-row');
  const inner = el('div', 'faq-item');
  const q = el('div', 'faq-q');
  if (question) q.append(wrapNode(question, 'faq-title'));
  const toggle = el('button', 'faq-ic');
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', panelId);
  toggle.setAttribute('aria-label', question ? `Toggle: ${question.textContent.trim()}` : 'Toggle');
  toggle.innerHTML = PLUS + MINUS;
  q.append(toggle);

  const panel = el('div', 'faq-panel menu-panel');
  panel.id = panelId;
  panel.dataset.open = 'false';
  const ans = el('div', 'faq-ans');
  const prose = el('div', 'prose');
  answerCells.forEach((c) => prose.append(...c.childNodes));
  ans.append(prose);
  panel.append(ans);
  inner.append(q, panel);
  item.append(inner);

  const flip = () => {
    const open = panel.dataset.open !== 'true';
    panel.dataset.open = String(open);
    item.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  q.addEventListener('click', flip);
  return item;
}

export default function decorate(block) {
  const rows = [...block.children];
  const itemRows = rows.filter((r) => r.children.length > 1);
  const introRows = rows.filter((r) => !itemRows.includes(r));

  const root = el('div', 'faq-inner');
  const intro = el('div', 'faq-intro');
  const head = el('div', 'faq-head');
  const titles = el('div', 'faq-titles');
  const lede = el('div', 'faq-lede');
  introRows.forEach((r) => {
    r.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => titles.append(h));
    r.querySelectorAll('p').forEach((p) => lede.append(p));
  });
  head.append(titles);
  if (lede.children.length) head.append(lede);
  intro.append(head);

  const list = el('div', 'faq-list');
  itemRows.forEach((r) => list.append(buildItem(r)));
  root.append(intro, list);
  block.replaceChildren(root);
}
