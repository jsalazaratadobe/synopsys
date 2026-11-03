# Block map — Ansys Fluent rollout (Phase B)

Pages: OV = overview, CAP = capabilities, RES = resources, PU = product-updates.
Tier: T = template-slotted (fixed composition), R = reconstructive (repeat group).

- `header` / `footer` — chrome → /nav, /footer fragments (site-header-section, site-footer); all 4.
- `hero` — `section.hero` (OV, variant `video`: Vidyard bg, eyebrow h1 + title + lede + cta-row) / `section.phero` (CAP, RES, PU, default: h1 + lede); T.
- `product-subnav` — `section.subnav-sec` `.subnav` (sticky + static copies are one authored list); all 4; R (link list).
- `video-feature` — `.blk--feature > .feature` (video poster + overlay title/lede); OV; T.
- `icon-cards` — `.why` (intro + `.iconcard`×3); OV; R.
- `logo-marquee` — `.blk--logos .logos` / `.marquee` rows; OV; R.
- `tile-rail` — `.railblk .rail` (`.tile`×N, dots, arrows); OV×2, CAP×2; R.
- `case-carousel` — `.cases` (`.case`×3, arrows, dots); OV; R.
- `capabilities-list` — `.caps` (intro + cta-row + ul list); OV; T.
- `split` — `.split` text/media 50/50, variant `reverse` (`.split--rev`); text may carry `.checks` list or cta-row, media is Vidyard or picture; OV, CAP, RES, PU; T.
- `faq` — `section.faq-sec .faq` (intro + `.faq__item` accordion rows); OV; R.
- `cta-band` — one block, variants by section: `video` (OV `section.ctaband`: Vidyard bg, eyebrow + title, centered, tall), `lede` (CAP `section.tctasec` `.tcta`: left title + lede + button), default/compact (RES, PU `section.ctab-sec` `.ctab`; CAP `section.dlband` brochure download — same centered title + button layout, secondary button); all 4 (CAP ×2); T.
- `video-tabs` — `.mp` media player (vertical tablist of videos + panel grid); RES; R.
- `resource-cards` — image/teaser card grid: `.rgrid` `.rcard` (RES, default), `.rgrid--blog` `.bcard` (RES, variant `blog`), `.rgrid` `.ccard` (RES support, variant `compact`), `.past` `.pcard` with first `--wide` (PU, variant `featured`); optional `.rlist__head` title + `.morelink`; RES, PU; R.
- `link-cards` — title + arrow link tiles: `.wpgrid .wpi` (RES whitepapers), `.rlist--tp .tpgrid .tpi` (RES tech papers), `.mres .mres__card` (PU more resources); RES, PU; R.
- `release-notes` — `.rn` timeline (`.rn__mark` slash + `.rn__body` meta + prose)×3; PU; R.

Default content (no block): `.galhead` section heading + lede (all pages), `.rnhead` eyebrow + title (PU).
