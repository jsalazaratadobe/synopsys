/**
 * release-notes — a vertical timeline of software releases: a gold slash marker, then a ruled
 * row with the release's title and date beside its notes.
 *
 * Authoring rows (repeat group, one row per release; cells classified by content):
 *   - meta cell: the release title heading (e.g. <h6>Ansys 2026 R1: Release Highlights</h6>) and
 *     the release date paragraph
 *   - notes cell: rich text — topic headings (<h6>), paragraphs, lists, links
 *   A one-cell row is read as notes only; a cell the pipeline delivers unwrapped (bare text)
 *   is treated as one paragraph.
 *
 * @variants none
 * Reconstructive.
 */

const SLASH = '<svg class="release-notes-slash" xmlns="http://www.w3.org/2000/svg" width="1em" '
  + 'height="1em" viewBox="0 0 24 34" fill="none" aria-hidden="true"><path d="M14.5054 0L0 '
  + '34.0064H9.90527L23.8723 0H14.5054Z" fill="#FDB71A"></path></svg>';

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

/** the cell's authored nodes; loose text (a single-paragraph cell delivered unwrapped) is
 * moved into a paragraph so it styles as prose */
function nodesOf(cell) {
  if (!cell) return [];
  const loose = [...cell.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE
    || (n.nodeType === Node.ELEMENT_NODE && /^(A|STRONG|EM|SPAN|CODE|BR)$/.test(n.tagName)));
  if (loose.some((n) => n.textContent.trim())) {
    const p = el('p');
    loose[0].before(p);
    p.append(...loose);
  }
  return [...cell.children];
}

export default function decorate(block) {
  const list = el('div', 'release-notes-list');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('img'));
    if (!cells.length) return;
    const notesCell = cells[cells.length - 1];
    const metaCell = cells.length > 1 ? cells[0] : null;

    const mark = el('div', 'release-notes-mark');
    mark.innerHTML = SLASH;
    const body = el('div', 'release-notes-body');

    if (metaCell) {
      const meta = el('div', 'release-notes-meta');
      nodesOf(metaCell).forEach((n, i) => {
        if (i === 0 && /^H[1-6]$/.test(n.tagName)) n.classList.add('release-notes-title');
        meta.append(n);
      });
      body.append(meta);
    }
    const prose = el('div', 'prose release-notes-prose');
    prose.append(...nodesOf(notesCell));
    body.append(prose);
    list.append(mark, body);
  });
  block.replaceChildren(list);
}
