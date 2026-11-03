/**
 * video-feature — large video still with an overlaid title + lede and a play button that opens
 * the video in a lightbox.
 *
 * Authoring rows (classified by content):
 *   - picture: the video still
 *   - heading (<h2>) + lede paragraph
 *   - a Vidyard link (`https://play.vidyard.com/<id>`) — the video the play button opens
 *
 * At 1024px and up the copy overlays the still (parallelogram mask from 1280px); below it the
 * copy stacks under the still. Template-slotted.
 * @ew-exempt <p> Vidyard source link — the lightbox video id, never displayed
 */

const VIDYARD = /play\.vidyard\.com\/([A-Za-z0-9]+)/;
const PLAY = '<svg class="ic video-feature-play-ic" xmlns="http://www.w3.org/2000/svg" '
  + 'width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">'
  + '<path d="M16 0C7.168 0 0 7.168 0 16C0 24.832 7.168 32 16 32C24.832 32 32 24.832 32 16C32 '
  + '7.168 24.832 0 16 0ZM12.8 23.2V8.8L22.4 16L12.8 23.2Z"></path></svg>';
const CLOSE = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" '
  + 'viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="m256-213.85-42.15'
  + '-42.15L437.85-480 213.85-704l42.15-42.15L480-522.15l224-224L746.15-704l-224 224 224 224L704'
  + '-213.85l-224-224-224 224Z"></path></svg>';

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

function playButton(variant) {
  const b = el('button', `video-feature-play video-feature-play-${variant}`);
  b.type = 'button';
  b.innerHTML = `<span class="sr-only">Play video</span>${PLAY}`;
  return b;
}

function openLightbox(id) {
  const dialog = el('dialog', 'video-feature-modal');
  dialog.setAttribute('aria-label', 'Video');
  const close = el('button', 'video-feature-close');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.innerHTML = CLOSE;
  const frameBox = el('div', 'video-feature-frame');
  const frame = el('iframe');
  frame.src = `https://play.vidyard.com/${id}?disable_popouts=1&autoplay=1&v=4.3.26&type=inline`;
  frame.title = 'Vidyard video player';
  frame.allow = 'autoplay; fullscreen; picture-in-picture';
  frame.allowFullscreen = true;
  frameBox.append(frame);
  dialog.append(close, frameBox);
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

export default function decorate(block) {
  const picture = block.querySelector('picture') || block.querySelector('img');
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const link = [...block.querySelectorAll('a[href]')].find((a) => VIDYARD.test(a.href));
  const ledes = [...block.querySelectorAll('p')]
    .filter((p) => !p.querySelector('a, picture, img') && !p.contains(link));
  const id = link ? link.href.match(VIDYARD)[1] : null;

  const article = el('article', 'video-feature-card');
  const media = el('div', 'video-feature-media');
  if (picture) media.append(picture);
  const overlay = el('div', 'video-feature-overlay');
  const head = el('div', 'video-feature-head');
  if (heading) head.append(wrapNode(heading, 'video-feature-title'));
  ledes.forEach((p) => head.append(wrapNode(p, 'video-feature-lede')));
  overlay.append(head);

  if (id) {
    const mob = playButton('mob');
    const desk = playButton('desk');
    media.append(mob);
    overlay.append(desk);
    [mob, desk].forEach((b) => b.addEventListener('click', () => openLightbox(id)));
  }
  article.append(media, overlay);
  block.replaceChildren(article);
}
