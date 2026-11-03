/**
 * video-tabs — media player: a vertical tab list of videos beside a player panel.
 *
 * Authoring rows (classified by content, never by index):
 *   - head row: optional eyebrow heading + title heading (e.g. <h5> + <h4>)
 *   - video rows (repeat group): the tab label (a paragraph) + a Vidyard link
 *     (`https://play.vidyard.com/<id>`)
 *   - more row: a paragraph with one link (not Vidyard) — the "view more" link under the tabs
 *
 * At 1280px and up the active tab's inline player shows beside the list; 1024–1279px shows the
 * poster with a play link; below 1024px the panels are hidden and each tab is a play link that
 * opens the video in a lightbox. Tabs: click / arrow keys (vertical tablist). Reconstructive.
 * @ew-exempt <p> Vidyard source link — the tab's player id, never displayed
 */

const VIDYARD = /play\.vidyard\.com\/([A-Za-z0-9]+)/;
const CIRCLE_PLAY = (cls) => `<svg class="ic ${cls}" xmlns="http://www.w3.org/2000/svg" `
  + 'width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">'
  + '<path d="M16 0C7.168 0 0 7.168 0 16C0 24.832 7.168 32 16 32C24.832 32 32 24.832 32 16C32 '
  + '7.168 24.832 0 16 0ZM12.8 23.2V8.8L22.4 16L12.8 23.2Z"></path></svg>';
const TRI = '<svg class="vyplay-tri" viewBox="0 0 45 48" width="45" height="48" aria-hidden="true">'
  + '<path d="M6 3.5 L41 24 L6 44.5 Z" fill="#fff" stroke="#fff" stroke-width="6" '
  + 'stroke-linejoin="round"></path></svg>';
const SLASH = '<svg class="morelink-slash" xmlns="http://www.w3.org/2000/svg" width="1em" '
  + 'height="1em" viewBox="0 0 24 34" fill="none" aria-hidden="true"><path d="M14.5054 0L0 '
  + '34.0064H9.90527L23.8723 0H14.5054Z" fill="#FDB71A"></path></svg>';
const ARROW = '<svg class="ic s-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" '
  + 'viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="m553.85-253.85-'
  + '42.16-43.38L664.46-450H180v-60h484.46L511.69-662.77l42.16-43.38L780-480 553.85-253.85Z">'
  + '</path></svg>';
const CLOSE = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" '
  + 'viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="m256-213.85-42.15'
  + '-42.15L437.85-480 213.85-704l42.15-42.15L480-522.15l224-224L746.15-704l-224 224 224 224L704'
  + '-213.85l-224-224-224 224Z"></path></svg>';

let uid = 0;

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function external(a) {
  try {
    const u = new URL(a.href, window.location.href);
    return u.origin !== window.location.origin && !/(^|\.)ansys\.synopsys\.com$/.test(u.hostname);
  } catch {
    return false;
  }
}

/** "view more" link: brand slash + label + arrow (the source's morelink); the authored
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
  if (external(a)) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  return p;
}

function vidyardSrc(id, extra = '') {
  return `https://play.vidyard.com/${id}?disable_popouts=1&v=4.3.26&type=inline${extra}`;
}

function openLightbox(id) {
  const dialog = el('dialog', 'video-tabs-modal');
  dialog.setAttribute('aria-label', 'Video');
  const close = el('button', 'video-tabs-close');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.innerHTML = CLOSE;
  const box = el('div', 'video-tabs-frame');
  const frame = el('iframe');
  frame.src = vidyardSrc(id, '&autoplay=1');
  frame.title = 'Vidyard video player';
  frame.allow = 'autoplay; fullscreen; picture-in-picture';
  frame.allowFullscreen = true;
  box.append(frame);
  dialog.append(close, box);
  document.body.append(dialog);
  const done = () => {
    dialog.remove();
    document.documentElement.classList.remove('is-scroll-locked');
  };
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', done);
  dialog.showModal();
  document.documentElement.classList.add('is-scroll-locked');
}

/** inline player at rest: poster + play button; the player iframe replaces it on click */
function inlinePlayer(id, eager) {
  const vy = el('div', 'vy');
  const region = el('div', 'vy-region');
  region.setAttribute('role', 'region');
  region.setAttribute('aria-label', 'Vidyard media player');
  const poster = el('img', 'vy-poster');
  poster.src = `https://play.vidyard.com/${id}.jpg`;
  poster.alt = '';
  poster.width = 1280;
  poster.height = 720;
  poster.loading = eager ? 'eager' : 'lazy';
  poster.addEventListener('load', () => {
    if (poster.naturalWidth) {
      const pct = (poster.naturalHeight / poster.naturalWidth) * 100;
      region.style.paddingBottom = `${pct.toFixed(2)}%`;
    }
  });
  const play = el('button', 'vyplay');
  play.type = 'button';
  play.setAttribute('aria-label', 'Play video');
  play.innerHTML = TRI;
  play.addEventListener('click', () => {
    const frame = el('iframe', 'vy-frame');
    frame.src = vidyardSrc(id, '&autoplay=1');
    frame.title = 'Vidyard video player';
    frame.allow = 'autoplay; fullscreen; picture-in-picture';
    frame.allowFullscreen = true;
    region.replaceChildren(frame);
  });
  region.append(poster, play);
  vy.append(region);
  return vy;
}

export default function decorate(block) {
  uid += 1;
  const rows = [...block.children];
  const videos = [];
  let head = null;
  let more = null;
  rows.forEach((row) => {
    const link = [...row.querySelectorAll('a[href]')].find((a) => VIDYARD.test(a.href));
    if (link) {
      const linkPar = link.closest('p') || link;
      // the pipeline unwraps a lone paragraph, so the label may be the bare cell
      const labelNode = [...row.querySelectorAll('p, h1, h2, h3, h4, h5, h6'), ...row.children]
        .find((n) => n !== linkPar && !n.contains(link) && n.textContent.trim());
      let label = labelNode ? labelNode.textContent.trim() : link.textContent.trim();
      if (VIDYARD.test(label)) label = `Video ${videos.length + 1}`;
      videos.push({ id: link.href.match(VIDYARD)[1], label, labelNode });
      return;
    }
    if (row.querySelector('h1, h2, h3, h4, h5, h6')) {
      head = row;
      return;
    }
    const a = row.querySelector('a[href]');
    if (a) more = a;
  });

  const base = `video-tabs-${uid}`;
  const list = el('div', 'video-tabs-list');
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-orientation', 'vertical');
  const col = el('div', 'video-tabs-col');
  const stack = el('div', 'video-tabs-stack');
  if (head) {
    const headings = [...head.querySelectorAll('h1, h2, h3, h4, h5, h6')];
    const h = el('div', 'video-tabs-head');
    headings.forEach((n, i) => {
      n.classList.add(i === headings.length - 1 ? 'video-tabs-title' : 'video-tabs-eyebrow');
      h.append(n);
    });
    stack.append(h);
  }
  const tabsBox = el('div', 'video-tabs-tabs');
  const grid = el('div', 'video-tabs-grid');
  const tabs = [];
  const panels = [];
  videos.forEach((v, i) => {
    const key = `${base}-${slug(v.label) || i}`;
    const item = el('div', 'video-tabs-item');
    const play = el('a', 'video-tabs-play');
    play.href = `#/video${i + 1}`;
    play.setAttribute('aria-label', `Play video ${v.label}`);
    play.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(v.id);
    });
    const tab = el('button', 'video-tabs-tab');
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.id = `${key}-tab-${i}`;
    tab.setAttribute('aria-controls', `${key}-panel-${i}`);
    tab.innerHTML = CIRCLE_PLAY('s-8');
    const body = el('div', 'video-tabs-tab-body');
    const text = el('div', 'video-tabs-tab-text');
    // the authored label paragraph moves into the tab
    if (v.labelNode) text.append(v.labelNode);
    else text.textContent = v.label;
    body.append(text);
    tab.append(body);
    item.append(play, tab);
    tabsBox.append(item);
    tabs.push(tab);

    const panel = el('div', 'video-tabs-panel');
    panel.setAttribute('role', 'tabpanel');
    panel.id = `${key}-panel-${i}`;
    panel.setAttribute('aria-labelledby', tab.id);
    const fig = el('figure', 'video-tabs-fig');
    const poster = el('img', 'video-tabs-poster');
    poster.src = `https://play.vidyard.com/${v.id}.jpg`;
    poster.alt = `Video thumbnail for ${v.label}`;
    poster.width = 1280;
    poster.height = 720;
    poster.loading = 'lazy';
    const figLink = el('a', 'video-tabs-fig-link');
    figLink.href = `#/video${i + 1}`;
    figLink.setAttribute('aria-label', `Play video ${v.label}`);
    figLink.innerHTML = CIRCLE_PLAY('video-tabs-fig-ic');
    figLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(v.id);
    });
    fig.append(poster, figLink);
    const player = el('div', 'video-tabs-player');
    player.append(inlinePlayer(v.id, i === 0));
    panel.append(fig, player);
    grid.append(panel);
    panels.push(panel);
  });
  stack.append(tabsBox);
  if (more) stack.append(moreLink(more));
  col.append(stack);
  list.append(col);
  const panelsBox = el('div', 'video-tabs-panels');
  panelsBox.append(grid);

  const select = (index, focus) => {
    tabs.forEach((t, k) => {
      const on = k === index;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      t.dataset.active = String(on);
    });
    panels.forEach((p, k) => {
      const on = k === index;
      p.dataset.active = String(on);
      p.toggleAttribute('inert', !on);
      if (on) p.removeAttribute('aria-hidden');
      else p.setAttribute('aria-hidden', 'true');
    });
    if (focus) tabs[index].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const d = {
        ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1,
      }[e.key];
      if (d) {
        e.preventDefault();
        select((i + d + tabs.length) % tabs.length, true);
      }
    });
  });
  if (tabs.length) select(0);

  const mp = el('div', 'video-tabs-mp');
  mp.append(list, panelsBox);
  block.replaceChildren(mp);
}
