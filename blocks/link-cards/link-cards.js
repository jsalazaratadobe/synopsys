/**
 * link-cards — title-only link tiles with a round action icon; each whole tile is one link.
 *
 * Authoring rows (classified by content, never by index):
 *   - optional title row: a heading and no link (e.g. <h5>Latest White Papers</h5>)
 *   - tile rows (repeat group): a heading holding the link (`<h3><a href>Title</a></h3>`), or a
 *     heading + a paragraph with one link; optional icon `:name:` for the round action badge
 *     (default: an east arrow)
 *   - optional more row: a paragraph with one link and no heading — the "view all" link
 *
 * @variants block class: boxed | default (default default) — default: ruled list rows, two
 *   columns from 1024px (white papers); boxed: bordered boxes, two columns from 768px and three
 *   from 1536px (technical papers, more resources)
 * Reconstructive.
 */

const SLASH = '<svg class="morelink-slash" xmlns="http://www.w3.org/2000/svg" width="1em" '
  + 'height="1em" viewBox="0 0 24 34" fill="none" aria-hidden="true"><path d="M14.5054 0L0 '
  + '34.0064H9.90527L23.8723 0H14.5054Z" fill="#FDB71A"></path></svg>';
const ARROW = (cls) => `<svg class="ic ${cls}" xmlns="http://www.w3.org/2000/svg" width="1em" `
  + 'height="1em" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path '
  + 'd="m553.85-253.85-42.16-43.38L664.46-450H180v-60h484.46L511.69-662.77l42.16-43.38L780-480 '
  + '553.85-253.85Z"></path></svg>';

const HEADINGS = 'h1, h2, h3, h4, h5, h6';

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

function setTarget(a, href) {
  try {
    const u = new URL(href, window.location.href);
    if (u.origin !== window.location.origin && !/(^|\.)ansys\.synopsys\.com$/.test(u.hostname)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  } catch {
    /* relative or malformed: same tab */
  }
}

/** "view all" link: brand slash + label + arrow (the source's morelink); the authored
 * paragraph and link are kept, their text nodes moved into the label span */
function moreLink(a) {
  const p = a.closest('p') || a;
  if (p !== a) p.className = 'morelink-p';
  a.className = 'morelink';
  a.removeAttribute('title');
  const label = el('span');
  label.append(...a.childNodes);
  const inner = el('span', 'morelink-in');
  inner.append(label);
  inner.insertAdjacentHTML('beforeend', ARROW('s-5'));
  a.insertAdjacentHTML('afterbegin', SLASH);
  a.append(inner);
  setTarget(a, a.href);
  return p;
}

function badge(icon) {
  const circ = el('div', 'link-cards-circ');
  const name = icon ? [...icon.classList].find((c) => c.startsWith('icon-')) : null;
  if (name) {
    const ic = el('span', 'ic link-cards-ic');
    ic.setAttribute('aria-hidden', 'true');
    ic.style.setProperty('--ic', `url('/icons/${name.slice(5)}.svg')`);
    circ.append(ic);
  } else {
    circ.innerHTML = ARROW('link-cards-arrow');
  }
  return circ;
}

export default function decorate(block) {
  const list = el('div', 'link-cards-list');
  const grid = el('div', 'link-cards-grid');
  let title = null;
  let more = null;

  [...block.children].forEach((row) => {
    const heading = row.querySelector(HEADINGS);
    const link = row.querySelector('a[href]');
    if (heading && link) {
      // the authored link becomes the whole-tile link; its text moves into the heading
      const a = link;
      const name = heading.textContent.trim() || link.textContent.trim();
      const icon = row.querySelector('.icon');
      if (heading.contains(link)) {
        heading.append(...link.childNodes);
        link.remove();
      }
      a.className = 'card-action link-cards-link';
      a.removeAttribute('title');
      a.setAttribute('aria-label', name);
      setTarget(a, a.href);
      const tile = el('div', 'link-cards-card');
      heading.className = 'link-cards-title';
      tile.append(heading, badge(icon));
      a.replaceChildren(tile);
      grid.append(a);
    } else if (heading) {
      title = heading;
    } else if (link) {
      more = link;
    }
  });

  if (title) {
    const head = el('div', 'link-cards-listhead');
    title.className = 'link-cards-listtitle';
    head.append(title);
    list.append(head);
  }
  list.append(grid);
  if (more) list.append(moreLink(more));
  block.replaceChildren(list);
}
