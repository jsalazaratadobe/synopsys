/**
 * resource-cards — a grid of teaser cards; each whole card is one link.
 *
 * Authoring rows (classified by content, never by index):
 *   - optional title row: a heading and no link (e.g. <h5>Latest Blog Posts</h5>)
 *   - card rows (repeat group): optional media cell (a picture, or an icon `:name:`), and a copy
 *     cell: title heading, optional text paragraph(s), CTA paragraph with one link — the link's
 *     href is the card's target, its text the card's action label
 *   - optional more row: a paragraph with one link and no heading — the "view all" link
 *
 * @variants block class: blog | compact | featured | default (default default) —
 *   default: bordered card, icon + title + text + ghost action (webinars, case studies);
 *   blog: image-background card, title + action link;
 *   compact: gold card, icon + title + text + small secondary button (support links);
 *   featured: image-background cards, the first one spans two columns (past releases)
 * Reconstructive.
 */

const SLASH = '<svg class="morelink-slash" xmlns="http://www.w3.org/2000/svg" width="1em" '
  + 'height="1em" viewBox="0 0 24 34" fill="none" aria-hidden="true"><path d="M14.5054 0L0 '
  + '34.0064H9.90527L23.8723 0H14.5054Z" fill="#FDB71A"></path></svg>';
const ARROW = '<svg class="ic s-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" '
  + 'viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="m553.85-253.85-'
  + '42.16-43.38L664.46-450H180v-60h484.46L511.69-662.77l42.16-43.38L780-480 553.85-253.85Z">'
  + '</path></svg>';

const HEADINGS = 'h1, h2, h3, h4, h5, h6';

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

function external(href) {
  try {
    const u = new URL(href, window.location.href);
    return u.origin !== window.location.origin && !/(^|\.)ansys\.synopsys\.com$/.test(u.hostname);
  } catch {
    return false;
  }
}

function setTarget(a, href) {
  if (external(href)) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
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
  inner.insertAdjacentHTML('beforeend', ARROW);
  a.insertAdjacentHTML('afterbegin', SLASH);
  a.append(inner);
  setTarget(a, a.href);
  return p;
}

/** the action label inside a card: the authored CTA paragraph, its link unwrapped (the card
 * itself is the link) */
function action(card, className) {
  const p = card.ctaPar === card.cta ? el('span') : card.ctaPar;
  p.className = className;
  p.setAttribute('aria-hidden', 'true');
  p.append(...card.cta.childNodes);
  card.cta.remove();
  p.insertAdjacentHTML('beforeend', ARROW);
  return p;
}

/** an authored icon (`:name:` → span.icon > img) becomes an inline currentColor svg (the
 * source draws its card icons inline); a mask span stands in until the svg arrives */
function iconSvg(span) {
  const name = [...span.classList].find((c) => c.startsWith('icon-'));
  const ic = el('span', 'ic s-10 resource-cards-ic');
  ic.setAttribute('aria-hidden', 'true');
  if (!name) return ic;
  const url = `${window.hlx?.codeBasePath || ''}/icons/${name.slice(5)}.svg`;
  ic.style.setProperty('--ic', `url('${url}')`);
  fetch(url).then((r) => (r.ok ? r.text() : '')).then((txt) => {
    const svg = new DOMParser().parseFromString(txt, 'image/svg+xml').querySelector('svg');
    if (!svg) return;
    svg.setAttribute('class', 'ic s-10');
    svg.setAttribute('width', '1em');
    svg.setAttribute('height', '1em');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    ic.replaceWith(document.importNode(svg, true));
  }).catch(() => { /* the mask stays */ });
  return ic;
}

function parseCard(row) {
  const cta = [...row.querySelectorAll('a[href]')].pop();
  const ctaPar = cta.closest('p') || cta;
  const heading = row.querySelector(HEADINGS);
  const picture = row.querySelector('picture');
  const icon = row.querySelector('.icon');
  const texts = [...row.querySelectorAll('p')].filter((p) => p !== ctaPar
    && !p.contains(picture) && !(icon && p.contains(icon)) && p.textContent.trim());
  return {
    cta,
    ctaPar,
    href: cta.getAttribute('href'),
    label: cta.textContent.trim(),
    heading,
    picture,
    icon,
    texts,
  };
}

function bgCard(card, variant) {
  const article = el('article', `resource-cards-card resource-cards-${variant}`);
  article.dataset.theme = 'dark';
  const bg = el('div', 'resource-cards-bg');
  if (card.picture) {
    const img = card.picture.querySelector('img');
    if (img) {
      img.classList.add('resource-cards-img');
      img.setAttribute('role', 'presentation');
    }
    bg.append(card.picture);
  }
  bg.append(el('div', 'resource-cards-shade'));
  const body = el('div', 'resource-cards-body');
  const head = el('div', 'resource-cards-head');
  const row = el('div', 'resource-cards-titles');
  if (card.heading) {
    card.heading.className = 'resource-cards-title';
    row.append(card.heading);
  }
  head.append(row);
  body.append(head, action(card, 'link resource-cards-action'));
  article.append(bg, body);
  return article;
}

function boxCard(card, variant) {
  const article = el('article', `resource-cards-card resource-cards-${variant}`);
  if (variant === 'compact') article.dataset.theme = 'light';
  const fig = el('figure', 'resource-cards-fig');
  if (card.icon) fig.append(iconSvg(card.icon));
  const body = el('div', 'resource-cards-body');
  if (card.heading) {
    card.heading.className = 'resource-cards-title';
    body.append(card.heading);
  }
  card.texts.forEach((p) => {
    p.className = 'resource-cards-text';
    body.append(p);
  });
  const cls = variant === 'compact'
    ? 'btn btn-secondary btn-sm resource-cards-action'
    : 'btn btn-ghost-link resource-cards-action';
  article.append(fig, body, action(card, cls));
  return article;
}

export default function decorate(block) {
  let variant = 'default';
  ['blog', 'compact', 'featured'].forEach((v) => {
    if (block.classList.contains(v)) variant = v;
  });
  const list = el('div', 'resource-cards-list');
  const grid = el('div', 'resource-cards-grid');
  let title = null;
  let more = null;

  [...block.children].forEach((row) => {
    const heading = row.querySelector(HEADINGS);
    const link = row.querySelector('a[href]');
    if (heading && link) {
      const card = parseCard(row);
      // the authored CTA link becomes the whole-card link (its label moves into the card)
      const a = card.cta;
      a.className = 'card-action resource-cards-link';
      a.removeAttribute('title');
      a.setAttribute('aria-label', card.heading ? card.heading.textContent.trim() : card.label);
      setTarget(a, card.href);
      const bg = variant === 'blog' || variant === 'featured';
      const article = bg ? bgCard(card, variant) : boxCard(card, variant);
      a.replaceChildren(article);
      grid.append(a);
    } else if (heading) {
      title = heading;
    } else if (link) {
      more = link;
    }
  });

  if (variant === 'featured' && grid.firstElementChild) {
    grid.firstElementChild.classList.add('resource-cards-wide');
  }
  if (title) {
    const head = el('div', 'resource-cards-listhead');
    title.className = 'resource-cards-listtitle';
    head.append(title);
    list.append(head);
  }
  list.append(grid);
  if (more) list.append(moreLink(more));
  block.replaceChildren(list);
}
