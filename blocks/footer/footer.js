import { getMetadata } from '../../scripts/aem.js';
import {
  h, loadIcons, icon, stripInstrumentation, plainLink,
} from '../../scripts/chrome-utils.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Footer — the source's global footer, template-slotted from the authored /footer document.
 *
 * /footer content model (default content, one DA section each, in order):
 *  1. brand: logo link (text = its accessible name) · blurb (p) · *newsletter CTA*
 *     · social links (ul; link text = network name, the glyph comes from the block)
 *  2. link columns: per column a label (p) followed by its links (ul)
 *  3. legal: copyright (p) · legal links (ul)
 *  4. accessibility band: title (p) · link (p)
 *  5. floating button label (p) — the source's fixed "Ask a Question" button
 */

const SOCIAL = {
  youtube: 'social-youtube',
  facebook: 'social-facebook',
  'x/twitter': 'social-x-twitter',
  twitter: 'social-x-twitter',
  linkedin: 'social-linkedin',
  instagram: 'social-instagram',
};

const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const linkIn = (el) => (el ? el.querySelector('a[href]') : null);

function takeLink(el, cls) {
  const a = el && (el.matches('a') ? el : linkIn(el));
  if (!a) return null;
  plainLink(a);
  a.removeAttribute('title');
  if (cls) a.className = cls;
  return a;
}

function withArrow(a) {
  if (a) {
    a.setAttribute('data-active', 'false');
    a.append(icon('arrow', 'ic s-5'));
  }
  return a;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  await loadIcons(['arrow', 'ansys-logo', 'sparkle', ...new Set(Object.values(SOCIAL))]);
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .map((s) => [...(s.querySelector('.default-content-wrapper') || s).children])
    .filter((els) => els.length);
  const [brand = [], cols = [], legal = [], a11y = [], fab = []] = sections;

  /* brand */
  const logo = takeLink(brand.find((e) => linkIn(e)), 'sf-logo');
  if (logo) {
    logo.replaceChildren(
      h('span', { class: 'sr-only' }, ...logo.childNodes),
      icon('ansys-logo', 'sf-logo-svg'),
    );
  }
  const blurb = brand.find((e) => e.tagName === 'P' && !linkIn(e));
  if (blurb) blurb.className = 'sf-blurb';
  const news = withArrow(takeLink(
    brand.find((e) => e.tagName === 'P' && linkIn(e) && !e.contains(logo)),
    'sf-news btn btn-sm btn-secondary',
  ));
  const socialList = brand.find((e) => e.tagName === 'UL');
  const social = h('div', { class: 'sf-social' }, socialList ? [...socialList.querySelectorAll('a')].map((a) => {
    takeLink(a, 'sf-social-link link');
    const name = SOCIAL[text(a).toLowerCase()];
    a.replaceChildren(h('span', { class: 'sr-only' }, ...a.childNodes), name ? icon(name, 'ic') : '');
    return a;
  }) : []);
  const follow = h('div', { class: 'sf-follow sf-follow-desk' }, news, social);
  const followMob = stripInstrumentation(follow.cloneNode(true));
  followMob.className = 'sf-follow sf-follow-mob';

  /* link columns: label p + ul */
  const columns = [];
  cols.forEach((el) => {
    if (el.tagName === 'UL' && columns.length) {
      el.className = 'sf-list';
      [...el.querySelectorAll('a')].forEach((a) => withArrow(takeLink(a, 'nav-link link-ansys-nav')));
      columns[columns.length - 1].append(el);
    } else if (el.tagName !== 'UL') {
      columns.push(h(
        'div',
        { class: 'sf-col' },
        h(
          'a',
          { class: 'sf-col-head', disabled: true },
          h('span', { class: 'sf-col-label' }, ...el.childNodes),
        ),
      ));
    }
  });

  /* legal */
  const copy = legal.find((e) => e.tagName === 'P');
  if (copy) copy.className = 'sf-copy';
  const legalList = legal.find((e) => e.tagName === 'UL');
  const legalLinks = h('div', { class: 'sf-legal-links' }, legalList
    ? [...legalList.querySelectorAll('a')].map((a) => {
      takeLink(a, 'sf-legal-link link');
      a.setAttribute('data-active', 'false');
      return a;
    }) : []);

  /* accessibility band */
  const a11yLink = withArrow(takeLink(a11y.find((e) => linkIn(e)), 'sf-a11y-link link'));
  const a11yTitle = a11y.find((e) => e.tagName === 'P' && !linkIn(e));
  if (a11yTitle) a11yTitle.className = 'sf-a11y-title';

  const inner = h(
    'div',
    { class: 'site-footer-inner', 'data-theme': 'dark' },
    h(
      'div',
      { class: 'sf-main' },
      h(
        'section',
        { class: 'sf-top' },
        h('aside', { class: 'sf-aside' }, h('div', { class: 'sf-brand' }, logo, blurb), follow),
        h('div', { class: 'sf-cols' }, columns),
        followMob,
      ),
      h('section', { class: 'sf-legal' }, copy, legalLinks),
    ),
    h('div', { class: 'sf-a11y' }, h(
      'div',
      { class: 'sf-a11y-in' },
      h('div', { class: 'sf-a11y-text' }, a11yTitle),
      h('div', { class: 'sf-a11y-cta' }, a11yLink),
    )),
  );

  /* floating Ask button (fixed, body level on the source) */
  const fabLabel = fab.find((e) => e.tagName === 'P');
  const askFloat = fabLabel ? h(
    'div',
    { class: 'ask-float' },
    h(
      'button',
      { class: 'ask-fab', type: 'button' },
      icon('sparkle', 'ic ask-fab-ic'),
      h('span', { class: 'ask-fab-label' }, ...fabLabel.childNodes),
    ),
  ) : null;

  block.replaceChildren(h('div', { class: 'site-footer', 'data-theme': 'dark' }, inner), askFloat);
}
