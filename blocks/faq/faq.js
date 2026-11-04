/**
 * faq — intro column (heading + lede) beside an accordion of questions.
 *
 * Authoring rows (classified by content):
 *   - intro row: <h2> + lede paragraph (a row with one cell)
 *   - question rows: cell 1 the question heading (<h3>/<h4>), cell 2 the answer (prose)
 * The question stays outside the toggle (EW7): the row takes the click, the +/- button is an
 * icon-only toggle. Reconstructive (repeat group).
 *
 * Index mode (no question rows): the questions come from the FAQ structured-content documents
 * (schema "FAQ": question, answer, category, relatedLinks[]) via FAQ_INDEX. One-cell rows without
 * a heading whose text matches a category (e.g. "Ansys Fluent") filter the entries; no matching
 * category row shows every entry. Several categories render as grouped lists. Also publishes the
 * shown entries as FAQPage JSON-LD.
 */

const FAQ_INDEX = '/faq-index.json';
// the FAQ schema's category enum: these filter even before any entry uses them
const CATEGORIES = ['Ansys Fluent', 'Ansys CFX', 'Ansys Rocky', 'Ansys Speos', 'Ansys Mechanical'];

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

/**
 * Builds one accordion row.
 * @param {Element|null} question The question heading
 * @param {Node[]} answer The answer content
 * @returns {Element} The row
 */
function buildItem(question, answer) {
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
  prose.append(...answer);
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

/**
 * Builds an accordion row from an authored row (question cell + answer cells).
 * @param {Element} row The authored row
 * @returns {Element} The row
 */
function buildRowItem(row) {
  const cells = [...row.children];
  const qCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6')) || cells[0];
  const question = qCell.querySelector('h1, h2, h3, h4, h5, h6');
  const answer = cells.filter((c) => c !== qCell).flatMap((c) => [...c.childNodes]);
  return buildItem(question, answer);
}

/**
 * Reads a multi-value index column (stored as a JSON array string).
 * @param {string} value The column value
 * @returns {string[]} The values
 */
function toList(value) {
  if (!value) return [];
  try {
    const list = JSON.parse(value);
    if (Array.isArray(list)) return list.map((v) => String(v).trim());
  } catch { /* a single plain value */ }
  return [String(value).trim()];
}

/**
 * Keeps http(s) and site-relative URLs only.
 * @param {string} url The authored URL
 * @returns {string|null} The safe URL
 */
function safeUrl(url) {
  try {
    const u = new URL(url, window.location.href);
    return ['http:', 'https:'].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
}

/**
 * Builds an accordion row from an FAQ index entry.
 * @param {Object} faq The index entry
 * @returns {Element} The row
 */
function buildEntryItem(faq) {
  const question = el('h4');
  question.textContent = faq.question;

  const answer = String(faq.answer || '').split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean)
    .map((t) => {
      const p = el('p');
      p.textContent = t;
      return p;
    });

  const labels = toList(faq.relatedLabels);
  const links = toList(faq.relatedUrls)
    .map((url, i) => ({ url: safeUrl(url), label: labels[i] || url }))
    .filter((link) => link.url);
  if (links.length) {
    const label = el('p', 'faq-related-label');
    label.textContent = 'Related resources';
    const list = el('ul', 'faq-related');
    links.forEach(({ url, label: text }) => {
      const a = el('a');
      a.href = url;
      a.textContent = text;
      const li = el('li');
      li.append(a);
      list.append(li);
    });
    answer.push(label, list);
  }
  return buildItem(question, answer);
}

async function fetchFaqs() {
  try {
    const resp = await fetch(FAQ_INDEX);
    if (!resp.ok) return [];
    const json = await resp.json();
    return (json?.data || []).filter((faq) => faq.question);
  } catch {
    return [];
  }
}

function publishFaqSchema(faqs) {
  const script = el('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  });
  document.head.append(script);
}

/**
 * Fills the list from the FAQ index, filtered and grouped by the authored categories.
 * @param {Element} list The accordion list
 * @param {Element[]} rows The one-cell rows without a heading (category candidates)
 * @param {Element} lede The intro lede (non-category rows go here)
 */
async function buildFromIndex(list, rows, lede) {
  const faqs = (await fetchFaqs())
    .sort((a, b) => String(a.path).localeCompare(String(b.path), undefined, { numeric: true }));
  const known = new Map([...CATEGORIES, ...faqs.map((faq) => faq.category)]
    .map((name) => [String(name).trim().toLowerCase(), name]));

  const categories = [];
  rows.forEach((r) => {
    const name = known.get(r.textContent.trim().toLowerCase());
    if (name) {
      if (!categories.includes(name)) categories.push(name);
    } else if (faqs.length) {
      // not a category: intro copy (dropped when the index is unavailable, as it may be one)
      r.querySelectorAll('p').forEach((p) => lede.append(p));
    }
  });

  const shown = categories.length ? faqs.filter((faq) => categories.includes(faq.category)) : faqs;
  if (!shown.length) {
    const empty = el('p', 'faq-empty');
    empty.textContent = 'No FAQs found.';
    list.append(empty);
    return;
  }

  const groups = categories.length ? categories : [...new Set(shown.map((faq) => faq.category))];
  groups.forEach((category) => {
    const entries = shown.filter((faq) => faq.category === category);
    if (!entries.length) return;
    if (groups.length > 1) {
      const heading = el('h3', 'faq-category');
      heading.textContent = category;
      list.append(heading);
    }
    entries.forEach((faq) => list.append(buildEntryItem(faq)));
  });
  publishFaqSchema(shown);
}

export default async function decorate(block) {
  const rows = [...block.children];
  const itemRows = rows.filter((r) => r.children.length > 1);
  const introRows = rows.filter((r) => !itemRows.includes(r));
  const indexMode = !itemRows.length;
  // index mode: one-cell rows without a heading are category candidates
  const categoryRows = indexMode
    ? introRows.filter((r) => !r.querySelector('h1, h2, h3, h4, h5, h6') && r.textContent.trim())
    : [];

  const root = el('div', 'faq-inner');
  const intro = el('div', 'faq-intro');
  const head = el('div', 'faq-head');
  const titles = el('div', 'faq-titles');
  const lede = el('div', 'faq-lede');
  introRows.filter((r) => !categoryRows.includes(r)).forEach((r) => {
    r.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => titles.append(h));
    r.querySelectorAll('p').forEach((p) => lede.append(p));
  });

  const list = el('div', 'faq-list');
  if (indexMode) await buildFromIndex(list, categoryRows, lede);
  else itemRows.forEach((r) => list.append(buildRowItem(r)));

  head.append(titles);
  if (lede.children.length) head.append(lede);
  intro.append(head);
  root.append(intro, list);
  block.replaceChildren(root);
}
