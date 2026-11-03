# EDS conversion log — Ansys Fluent replica

## Decisions

- **Publish: yes (decided by the run owner, 2026-11-03).** Every delivered page, the redirects sheet and the chrome documents (nav, footer and any locale variants) go live on the aem.live origin — `deploy-batch.mjs` without `--no-publish`, or `POST https://admin.hlx.page/live/…`.
- **Martech: carry over, every contract part disabled** (owner request). `scripts/martech.js` is generated from `stardust/martech-contract.json` by `martech-scaffold.mjs`; enabling a part stays with the owner (`stardust/martech-handoff.md`).
- DA target: org `aemcoder`, site `0f0b9fb5`, branch `main`; preview `https://main--0f0b9fb5--aemcoder.aem.page/`, live `https://main--0f0b9fb5--aemcoder.aem.live/`.

## Decode tiers

See `stardust/rollout/block-map.md` (template-slotted for fixed compositions, reconstructive for repeat groups).

## archetype-landing — /products/fluids/ansys-fluent (C-deliver unit)

Blocks (tier): hero `video` (T), product-subnav (R, link list; sticky copy = presentational clone),
video-feature (T; Vidyard lightbox P1G8KAm6mRvpUJKdyQBG5J), icon-cards (R), logo-marquee (R; lanes
doubled as stripped clones, 40 s / 30 s), tile-rail (R; card-as-link EW6), case-carousel (R),
capabilities-list (T intro + R list), split + `reverse` (T; Vidyard inline background player),
faq (R; question outside the toggle, EW7), cta-band `video` (T). Section heads `.galhead` = default
content styled from tile-rail.css. Media: 28 images under DA `media/ansys-fluent/` (medtronic.svg
rasterised to PNG — 52 KB over the SVG limit). Content icons: `icons/fluent-*.svg` (gold fill).

- D1 (davids-model-lint 🟡): hero / product-subnav / video-feature / logo-marquee / cta-band are
  bespoke compositions (video backgrounds, sticky clone, marquee), not default content — kept.
- D3 (faq rows 1 vs 2 cells): intro row + question/answer rows by design.
- Vidyard source links are `@ew-exempt` (player ids, never displayed).
- block-roundtrip: closed against a de-duplicated prototype copy (the prototype carries every FAQ
  question twice — open/closed button spans — and the feature title twice — overlay + mobile head).
- qa-gate: units FAIL lines map the prototype's `section.sec` to the hero (schema artifact); the
  2560 content-cap FAIL mirrors the prototype (modules capped 1280/1660/1920/2020, no page cap).
- Gate sidecars: `stardust/replica/gates/all-{1440,360}/presence.json` marks the live origin's
  in-<main> header/footer sections session-variable; `stardust/replica/units.json` build selectors
  gained EDS alternates (comma lists, prototype selectors kept).

## archetype-program — /products/fluids/ansys-fluent/capabilities (C-deliver unit)

0 new blocks; reuses landing blocks. Blocks (tier): hero default (T, `.phero`: h1 + lede),
product-subnav (R), tile-rail ×2 (R; capabilities rail ×4, applications rail ×5 regenerated from
this page's capture — mixing-v2 / capabilities heat-exchangers, wind, battery differ from the
landing copies), split ×8 (T; 4 Key Features Vidyard + 2 picture, one with a CTA + 2 resources/updates
Vidyard), cta-band default (T, `.dlband` brochure: compact centred → row ≥ 64rem, base-0 band, secondary
button) and cta-band `lede` ×2 (T, `.tcta`: HPC licensing inside the Key Features section + closing
band; grid 5fr / 7fr ≥ 64rem). Section heads `.galhead` = default content (tile-rail.css /
split.css). Media: 10 new images under DA `media/ansys-fluent/` (`capabilities-*.jpg`,
`topic-gallery-mixing-v2.jpg`, fetched as JPEG renditions of the source webp); gas-turbines reuses
the landing upload (same asset URN).

- Split checklist (`.checks`): authored as `<h6>` + `<p>` pairs after the lede in the text cell (DA
  lists cannot carry headings); split.js slots each heading after the title (h4–h6) into
  `ul.split-checks > li.split-check` with a CSS-mask check-circle icon (decorative →
  `icons/check-circle.svg`).
- Vidyard ratio box: split.js sizes `.vy-region` from the poster's natural aspect (90.45 / 59.6 /
  56.25 / 59.41 / 56.02 % — identical to live's player-computed padding); posters now load eagerly
  so the ratio is set before capture. `restoreAtDelivery` (background players, autoplay muted loop,
  pointer-events none, iframe fills the ratio box) is the shared vidyardBackground().
- Pipeline quirk: the delivery pipeline turned `applications:Aerospace:` into `<span class="icon
  icon-Aerospace">`; split.js restores an icon span that shares its paragraph with text to `:name:`.
  Content stays verbatim in DA.
- `Discover our web interface` (`#/web-interface` modal route) has no trailing arrow on live;
  split.css hides `::after` for `a.button[href^='#/']`.
- Content-band padding (`.content__pad`) now also keys off `.tile-rail-container` /
  `.split-container` (same values as landing's video-feature rule; landing re-gated unchanged).
- Header: 4-level paths grew the utility bar 57 → 65 px (breadcrumb() stringifies nested crumbs into
  `.ubar-crumb-mid`); foundation request queued, hero.css carries a `white-space: nowrap` override.
- D1 (davids-model-lint 🟡): hero / product-subnav / cta-band ×3 are bespoke compositions — kept.
- qa-gate: same schema-artifact units FAIL lines and 2560 content-cap FAIL as landing (mirrors the
  prototype). block-roundtrip --ew: 0 structural 🔴, EW editable 80/86, dead 0, 6 Vidyard links
  exempt (maps: hero=section.phero, product-subnav=.subnav-static, tile-rail=.railblk,
  cta-band=.dlband__row, article.tcta).
- Brochure PDF and contact-us stay absolute source-host links (out-of-scope pages), as on landing.
- Gate: scratch state `stardust/.work/program/state-gate.json`; presence.json gained the slug (same
  variable chrome sections); units.json feature-check gained `main .split .split-check-title h6`.

## archetype-listing — /products/fluids/ansys-fluent/resources (C-deliver unit)

3 new blocks (video-tabs, resource-cards, link-cards); reuses hero, product-subnav, split, cta-band.
Blocks (tier): hero default (T, `.phero` eyebrow h1 + h2 title + lede — hero.js now marks the first of
two headings `hero-eyebrow` in the default variant too; default eyebrow = weight 600, inherit colour,
pulled to the canon head gap .5 / .75 rem), product-subnav (R), video-tabs (R, `.mp`: head row h5 + h4,
one row per video = label + Vidyard link, more row; vertical tablist, arrow keys, cross-fade panels;
≥80rem inline player at rest = poster + gold play, iframe on click; <80rem poster + play / <64rem
tab play links `#/videoN` open a lightbox), resource-cards ×4 (R: default `.rcard` webinars + case
studies, `blog` `.bcard`, `compact` `.ccard` gold; `featured` = PU `.past` first card wide, authored
for product-updates, not used here), link-cards ×2 (R: default `.wpi` white papers, `boxed` `.tpi`
tech papers = PU `.mres`), split `reverse` (T, same "See what's new" composition as capabilities),
cta-band default (T, `.ctab` = capabilities `.dlband`, primary button). Section heads `.galhead` =
default content, styled from video-tabs.css / resource-cards.css (same rules as tile-rail / split).
Media: 3 blog images under DA `media/ansys-fluent/resources-blogs-*.jpg` (JPEG rendition, smartcrop
3x2 w1052 — live serves 5x3 below 640px, the only 360 pixel residue). Icons: `fluent-webinar`,
`fluent-bolt`, `open-in-new`, `lock` (white-paper badges carry the source's per-item icon).

- Content model: card rows = optional media/icon cell + copy cell (title heading, text, CTA paragraph
  — its href is the card target, its text the action label); title row = heading without link; more
  row = link without heading. link-cards rows = `<h3><a>` (+ optional icon). External hosts open in a
  new tab (block JS, as live).
- EW1: the authored CTA `<a>` becomes the whole-card link and its text nodes move into the authored
  CTA `<p>` (the action label); morelinks keep the authored `<p><a>`; text paragraphs are moved, not
  rebuilt. block-roundtrip --ew: 0 structural 🔴, EW editable 72/78, dead 0, 6 Vidyard links exempt
  (maps: hero=section.phero, product-subnav=.subnav-static, video-tabs=.mp, resource-cards=.rgrid,
  link-cards=.wpgrid, cta-band=.ctab).
- Pipeline quirk: a cell holding one paragraph is delivered unwrapped (`<div>text</div>`); video-tabs
  takes the label from the bare cell. Icons authored as `<span class="icon icon-…">` (capabilities form).
- Unit parity: resource-cards inline the authored icon as an `<svg>` (fetched, mask fallback) so the
  card's svg#1/#2 rows line up with live's inline svgs.
- D1 🔴 (davids-model-lint): "View More Videos" is a link to a YouTube search page, not an embed —
  kept as the block's more row (not auto-blocked). D1 🟡 hero / product-subnav / cta-band bespoke —
  kept; D3 🟡 video-tabs / resource-cards head + more rows are 1-cell by design.
- qa-gate: same harness artifacts as landing/program (header/footer empty on a static harness, units
  `sec`→hero schema lines, 2560 content-cap); local section heights equal the prototype at 1440 / 360.
- Gate: scratch state `stardust/.work/listing/state-gate.json`; presence.json gained the slug;
  units.json build selectors gained EDS alternates (video-tabs-tab, resource-cards variants). The
  origin units cache (`stardust/current/measure/<slug>-units.json`) is width-blind — the 360 row ran on
  a fresh 360 cache (kept at `stardust/.work/listing/units-cache-360.json`, 1440 restored).
- Gate rows (preview origin): 1440 0.43 % Δh 0, 360 1.76 % Δh 0, clipped 0, presence 0/0, units 0;
  header band 0.00 % / 0.00 %, footer 0.00 % / 0.04 %. Hero change re-gated: capabilities 1.99 % /
  1.13 % (Δh 0 / −1), landing 3.34 % / 3.77 %, all PASS.

## archetype-article — /products/fluids/ansys-fluent/product-updates (C-deliver unit)

1 new block (release-notes); reuses hero, product-subnav, split, link-cards, resource-cards, cta-band.
Blocks (tier): hero default (T, `.phero` eyebrow h1 + h2 title + lede + primary CTA "Download Latest
Release"), product-subnav (R), split ×2 (T, picture + secondary CTA; second `reverse`), release-notes
(R, `.rn`: one row per release = meta cell (h6 title + date) + notes cell (h6 topics, prose, list,
link); gold slash marker ≥48rem, gold left rule <48rem, meta | notes side by side ≥80rem),
link-cards `boxed` (R, `.mres` "More resources", 4 tiles, default east-arrow badge), resource-cards
`featured` (R, `.past` "Past Releases", first card wide + "View All Previous Releases" morelink),
cta-band default (T, `.ctab`, primary button). Section head `.rnhead` ("Latest Release Notes" +
h2) = default content, styled by resource-cards.css (same section; galhead rules = rnhead values).
Media: 5 images under DA `media/ansys-fluent/product-updates-*` (JPEG renditions smartcrop 3x2 of
the source webp; the R1 2026 split image is served as PNG by the source and kept PNG).

- Content model: release-notes cells are classified by position within the row (meta first, notes
  last; a one-cell row is notes only); loose text in a cell (the pipeline's unwrapped single
  paragraph) is moved into a `<p>`. EW1: every authored node is moved, never rebuilt.
  block-roundtrip --ew: 0 structural 🔴, EW editable 56/56, dead 0 (maps: hero=section.phero,
  product-subnav=.subnav-static, release-notes=.rn, link-cards=.mres, resource-cards=.past,
  cta-band=.ctab).
- resource-cards.css: dropped the `featured` grid gap override — it kept row-gap at 2rem ≥64rem
  where the source uses 3.5rem (past releases 1245 → 1269 px, = prototype; rects instrument).
  Featured is used only on this page; resources re-gated anyway (unchanged).
- D1 🟡 (davids-model-lint): hero / product-subnav / cta-band bespoke — kept; D3 🟡 resource-cards
  title + more rows are 1-cell by design.
- qa-gate: same harness artifacts as the other archetypes (header/footer empty on a static
  harness, units `sec`→hero schema lines, 2560 content-cap); local section heights equal the
  prototype at 1440 / 360 except the split images (DA media is private to a static harness).
  `stardust/eds-schema/products-fluids-ansys-fluent-product-updates.json` added (section-schema).
- Gate: scratch state `stardust/.work/article/state-gate.json` (page marked deployed + liveUrl +
  deployedPath); presence.json gained the slug; units.json build selectors gained EDS alternates
  (release-notes-body, link-cards boxed card, resource-cards featured card). Origin units cache:
  1440 fresh (`stardust/.work/article/units-cache-1440.json`, restored), 360 fresh
  (`units-cache-360.json`).
- Gate rows (preview origin): 1440 0.89 % Δh 0, 360 3.29 % Δh −1, clipped 0, presence 0/0, units 0;
  header band 0.00 % / 0.00 %, footer 0.00 % / 0.08 %. Resources re-gated after the resource-cards
  change: 0.44 % / 1.76 % (Δh 0 / 0), PASS. 0 fix rounds after deploy.

## D-site — redirects and the root (2026-11-03)

- **Root decision (scope):** the source root serves the Ansys home page, which is outside this run's fixed 4-page plan, so it is not delivered as `/index`; the redirects sheet sends `/` and `/index.html` → `/products/fluids/ansys-fluent` (the delivered landing). When the home page enters scope, deliver it as the root `index` document and drop both rows.
- Trailing-slash URLs 301 on the source; the sheet mirrors them (4 rows). Sheet `/redirects.json` (6 rows, from `stardust/redirects.tsv`) PUT to DA, previewed and published; `curl -sIL https://main--0f0b9fb5--aemcoder.aem.page/` ends 200.
- Served sitemap 4 = assembled 4; `/nav` and `/footer` carry `robots: noindex`.
