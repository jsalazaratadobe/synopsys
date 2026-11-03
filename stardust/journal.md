# Journal — Ansys Fluent replica

## Extract — 4 pages captured live, consent recapture (2026-11-03)

- `crawl.mjs --pages <4 urls> --dynamics`: 4/4 OK, headless, no bot protection. Overview + capabilities had the OneTrust banner in the screenshot at medium wait → recaptured at `--wait slow` (vision check: 2 recaptured, 2 ok).
- Source is Astro + Tailwind v4, one stylesheet (`assets/css/ansys.css`); fonts Montserrat + Source Sans 3 (OFL, self-hosted on source) downloaded to `assets/fonts/`.
- style-census at 1440 + 360 → `_computed-styles.json`. cap-probe: contentMaxWidth 1660 (module) on 3 pages, 1280 on overview; shell fluid.
- Page types (one archetype each, the pages differ in body composition): overview=landing, capabilities=program, resources=listing, product-updates=article.
- Provenance: 4/4 live.
- Header contract: chrome-explore (`--max-states 60 --max-depth 2`; the default budget hit the 1500 s deadline on the mega menu) → `stardust/chrome/header-contract.json`: 1440 — 11 controls (6 menus, 1 search, 4 links), 43 states, 140 links; 390 — 1 drawer, 17 states, 44 links. Truncated at depth 2 (recorded, not silent).

## Preserve direction — verbatim promotion, empty register, dynamics triaged (2026-11-03)

- PRODUCT.md / DESIGN.md / DESIGN.json promoted verbatim to the root (DESIGN.json added to `.hlxignore`). `stardust/direction.md` written (PRESERVE). Register empty — pure replica.
- dynamics-detect on home + 4 pages (100 findings); dynamics-plan `--martech --chrome --target-origin` → 103 draft rows, curated into 15 features in `stardust/dynamic-features.md` (+ plan). Decisions D1–D5 recorded as hands-off assumptions; interim tiers ship; nothing decided-out.
- Martech: spec-martech (Launch 121 rules / 330 data elements, OneTrust per-tag model) → `stardust/martech-contract.json` + `martech-handoff.md`, every part disabled; CMP id copied from page markup; `martech-scaffold.mjs` wrote `scripts/martech.js` (no CMP, 0 routes enabled).

## Recreate — overview archetype (landing) gated (2026-11-03)

- Canon layer authored (`css/canon.css`, `js/canon.js`) + `css/products-fluids-ansys-fluent.css`. 1440: 3.86 %, Δh 0; 360: 3.93 %, Δh 0; content-diff 0 🔴 / 0 nothing-lost; clip 0; overflow ok; cap-probe PASS. 3 iterations per width.
- Residuals: Vidyard background videos (frame vs poster) and logo marquee phase — captureState, restore autoplay muted loop at delivery. Header-contract compare 41 findings left open (agent's direct checks disagree on Escape/outside-click; Ask chat = dynamics D5) — revisit at C0.
- Live does have a footer element (main > section:last-child > div > footer); mirrored.

## Recreate — capabilities archetype (program) gated (2026-11-03)

- Cumulative on canon; new module CSS `css/products-fluids-ansys-fluent-capabilities.css`. 1440: 2.66 %, Δh 0; 360: 4.15 %, Δh −1; content-diff 0 🔴 / 0 nothing-lost; clip 0; overflow ok; cap-probe PASS (10/10). 3 rounds per width.
- Canon append (no value changed): breadcrumb-collapse rules for deeper pages. Motion 26 parity / 0 missing / 0 extra.
- Residuals: six Vidyard background videos rendered as posters (captureState, restore autoplay muted loop at delivery). Unit-geometry origin cache is keyed by slug, not width — run widths sequentially or `--force`.

## Recreate — resources archetype (listing) gated (2026-11-03)

- Cumulative on canon; `css/` + `js/products-fluids-ansys-fluent-resources.*` (video-tab cross-fade observed on live). 1440: 0.34 %, Δh 0; 360: 0.53 %, Δh 0; content-diff 0 🔴 / 0 nothing-lost (12 advisory: known chrome + video icon links); clip 0; overflow ok; cap-probe PASS (9/9). Motion 22 parity / 0 missing / 0 extra.
- Canon: `.phero` text-hero moved unchanged from the capabilities CSS into canon.css. Units: video-tab, resource-card, blog-card, curated-card.
- Residuals: Vidyard tutorial players + background video as posters (restoreAtDelivery); <64rem tabs open video modals (templates after </main>). Resource lists are server-rendered; "Access all…" → Coveo search, trial form modal (dynamics rows).

## Recreate — product-updates archetype (article) gated; prototype tables 4/4 (2026-11-03)

- Article: 1440 0.01 % / 360 0.00 %, Δh 0 both; content-diff 0 🔴 / 0 nothing-lost; clip 0; cap-probe PASS (8/8); motion 24 parity / 0 missing / 0 extra; no videos. Canon: `.s-7`, `.card-action`, `.blk--s`, `.morelink*`, `.ctab*`, `.split__img` moved unchanged into canon.css (siblings re-checked at their gated values).
- Prototype tables (`gates/prototypes-{1440,360}/`): 1440 — 4 delivered (landing via documented `overrides.json`: case-slide unit 2 is the off-canvas carousel slide, clipped identically on both sides, all Δ 0); 360 — 4/4 PASS.
- Instrument traps fixed: unit-geometry origin cache is keyed by slug, not width — the two widths must run sequentially with the cache cleared between them; gate-all splits `origin=build` on the first `=`, so attribute-equality selectors in units.json break the build side (resources families rewritten to class selectors).

## Handoff — migrate plan: 4 approved archetypes, no siblings (2026-11-03)

- Page map: 4 entries, 0 collisions (URL-literal `products/fluids/ansys-fluent/…/index.html`). Every page is its template's gated archetype (Path A), so no sibling clusters exist; one render unit covers all four.
- Phase 5 script sets copied (deploy, rollout, dynamics, migrate). DA access: the run's provisioned IMS token file (referenced by path only, never copied). Stray gate PNGs removed from the repo root (they would have been served).

## Handoff — migrate render: 4 archetypes placed (2026-11-03)

- `migrate.mjs render … --canon-css stardust/prototypes/css/canon.css` → 4 rendered, 0 refused (6–10 assets each). ~360 unresolved links per page are the mega-menu / footer targets outside this run's 4-page scope; E2 repoints them to the source host.

## Handoff — migrate state-and-report: 4 pages migrated, evidence complete (2026-11-03)

- `state.mjs advance … --to migrated` for all 4; `gate-evidence.mjs` wrote 4 gates per sidecar. The `case-slide` unit family now measures only the on-canvas slide (`:first-of-type` both sides) — the documented override was dropped and the 1440 prototype table re-run: 4/4 PASS on the full verdict.

## Rollout A-inventory — 4 pages, 4 templates (2026-11-03)

- `inventory.mjs` → 4 pages pending, 4 templates (one archetype each). `rollout.json` site: DA aemcoder/0f0b9fb5 ref main, live host main--0f0b9fb5--aemcoder.aem.live. Sidecar `modules[]` still empty — Phase B assigns block ids per section (shared: hero/phero, subnav, content blk modules, faq, cta bands, rails; chrome = header/footer blocks).

## Rollout B-block — 15 module blocks + header/footer chrome (2026-11-03)

- Blocks: hero (default / `video`), product-subnav, split (`reverse`), cta-band (default / `video` / `lede`; ctab + dlband = default), tile-rail, resource-cards (`blog` / `compact` / `featured`), link-cards, video-feature, icon-cards, logo-marquee, case-carousel, capabilities-list, faq, video-tabs, release-notes. Section heads (`.galhead`, `.rnhead`) are default content. Mapping + decode tiers: `stardust/rollout/block-map.md`.
- Plan: overview converts 11, product-updates 3, resources 1, capabilities reuses only; header/footer delivered once as fragments.

## Rollout B2-dynamic — triage re-verified against fresh detection (2026-11-03)

- 4/4 pages re-detected (90 findings, 93 plan rows). No new feature class beyond the curated 15 except card listings → row 16, editorially curated (static, authored in blocks). Host-bound: Experience Edge ×2 (row 15), Coveo token (row 9). Martech contract regenerated, all parts disabled.

## Rollout C-deliver — foundation unit done (2026-11-03)

- Foundation subagent: styles, self-hosted Montserrat + Source Sans 3, favicon, header/footer blocks (+ `scripts/chrome-utils.js`, 49 chrome icons), runtime contract, martech.js regenerated (unchanged, all disabled); DA `/nav` + `/footer` published with `Robots | noindex`; `/drafts/shell` preview-only. Pushed head 127b972; lint ok.
- Shell vs live: header band 0.00 % / 0.00 %, footer 0.00 % / 0.41 % (1440/360). chrome-compare exit 2 at both widths: Ask chat + Coveo type-ahead are owner/backend dynamics rows; drawer accordion open-state, Back-key focus, C&R link rewrite → `stardust/rollout/foundation-requests.md` for C-final. Frozen: 20 files.

## Rollout C-deliver — archetype-landing unit done (2026-11-03)

- 11 blocks authored (hero video, product-subnav, video-feature, icon-cards, logo-marquee, tile-rail, case-carousel, capabilities-list, split, faq, cta-band video); page published live. Gate row on preview: 1440 3.51 % Δh 0, 360 4.80 % Δh −1, clipped 0, presence 0. Pushed head 4b59c0d.
- Notes for later units: gate-all `--eds-host` needs `https://`; gate-all needs deployed state rows (scratch `--state` used); live chrome sits inside `<main>` → presence.json sidecars; units cache ignores width; verify.mjs trailing-slash 404 for index pages (redirect/Phase D).

## Rollout C-deliver — archetype-program unit done (2026-11-03)

- Capabilities page encoded on shared blocks (hero default, cta-band lede/compact CSS, split checklists), published live. Gate row: 1440 2.04 % Δh 0, 360 1.31 % Δh −1, clipped 0, presence 0; landing re-gated 3.27 % / 4.08 %. 3 fix rounds (icon-token text restore, header breadcrumb override, `#/` link arrow). Head 744310c.
- Foundation request queued: header breadcrumb `.flatMap(crumb)` on 4-level paths (scoped override in hero.css until C-final).

## Rollout C-deliver — archetype-listing unit done (2026-11-03)

- Resources page delivered and published live on new blocks video-tabs, resource-cards (default/blog/compact/featured), link-cards (default/boxed); hero default gained the eyebrow first-heading style. Gate row: 1440 0.43 % Δh 0, 360 1.76 % Δh 0, clipped 0, presence 0; bands ≤ 0.04 %. 1 fix round (inline svg card icons; 360 units cache). Re-gates: landing 3.34 / 3.77 %, capabilities 1.99 / 1.13 %. Head 4674b10.
- For product-updates: single-paragraph cells arrive as bare divs; units cache ignores width (see stardust/.work/listing/regate.sh); link-cards section heads need heading styles.

## Rollout C-deliver — archetype-article unit done (2026-11-03)

- Product-updates page delivered and published live: new block release-notes; reuses hero, product-subnav, split ×2, link-cards boxed, resource-cards featured, cta-band. Gate row: 1440 0.89 % Δh 0, 360 3.29 % Δh −1, clipped 0, presence 0, units 0; bands ≤ 0.08 %. 0 post-deploy fix rounds (featured row-gap fixed pre-deploy off measure). Resources re-gated 0.44 / 1.76 %. Head fb916eb.
- For C-final: units cache width-blind (per-width copies under stardust/.work/article/); scratch gate state needs liveUrl + deployedPath + status deployed.

## Rollout C-deliver — gate-all unit done (2026-11-03)

- C-final prep: foundation-freeze check clean; foundation queue applied once — header breadcrumb `.flatMap(crumb)` root fix (hero.css override removed), re-explored the deployed header (chrome-explore → stardust/.work/chrome/hdr-build-base.json: 21 errors vs 41 on the stale prototype record; remaining = Ask chat owner row + source-side crop artifacts), freeze refreshed, pushed 5d43a5f.
- Roster gate (stardust/.work/final/gate-all.sh, scratch deployed state, per-width units caches): 1440 4/4 PASS (overview 2.15 %, capabilities 2.00 %, resources 0.44 %, product-updates 0.89 %), 360 4/4 PASS (4.15 / 1.13 / 1.76 / 3.30 %), Δh ≤ 1 px, clipped 0, MISSING/HIDDEN 0, units 0. Capabilities 1440 3.34 → 2.00 % after the breadcrumb fix. Coverage: 4/4 deployed, both gate tables applied.

## Rollout C-deliver — final unit, phase end (2026-11-03)

- foundation-freeze check clean; queue applied once (see gate-all section); 4/4 pages deployed and published on aem.live, gate rows PASS at both widths. Next: rollout D-redirects → I-dashboard (optimize scorecard), then the replica handoff done-check.

## Rollout D-site — redirects sheet + root answer, sitemap verified (2026-11-03)

- `stardust/redirects.tsv` → DA `/redirects.json` (6 rows: `/`, `/index.html` → overview, home out of scope; 4 trailing-slash rows as the source 301s), previewed + published; `/` 301 → overview → 200.
- assemble.mjs: sitemap served 4 = assembled 4 (extra 0, missing 0); nav/footer noindex verified on the live origin.

## Rollout D2-dynamic — parity replay 18/18 on the published origin (2026-11-03)

- `stardust/dynamics/parity.json` written (16 features): Vidyard playback ×3 (hero background, video-feature lightbox, resources inline tabs), search + lightbox dialogs, header chrome (19 disclosure controls, no page errors on 4 pages), carousels, breadcrumb, card groups, trial/search link-outs, consent-gate + martech (no tag host requested, every part off). dynamics-check → stardust/qa/dynamics-report.md: 18 PASS / 0 FAIL.
- Found and fixed: the "Try Fluent Today" `#gate-…` CTAs did nothing on EDS (the source opens its trial form from that hash) — scripts.js `decorateGateLinks` now points them at the source page + hash (interim tier of owner decision D2), pushed cd5097b.
- No `/query-index.json` needed (no listing reads an index).

## Rollout E-full-site — 4/4 verified, background video restored (2026-11-03)

- verify.mjs on aem.live: 4 checked · 4 verified · 0 failed (reachable, no about:error, internal hrefs resolve, gate pass true at both widths).
- restoreAtDelivery: every Vidyard background player scrolled into view plays (frame `<video>` not paused, currentTime advancing): overview 4/4, capabilities 6/6 (aqz2Bu looped 3.0 → 1.4 s), resources 1/1 (stardust/.work/final/vy-play.mjs). Lightbox / inline / gated-form / search entries covered by the D2 parity replay.

## Rollout E2-link-audit — in-scope links localized, out-of-scope repointed (2026-11-03)

- localize-links --check PASS (0 localizable once the scoped root redirect rows are excluded; the 3 home links stay on the source — decision in direction.md). 204 unique external hrefs: 183 × 200, 6 × 302, 5 unreachable from this network, 0 × 404. Internal hrefs resolved by verify.mjs (E).

## Rollout F-optimize — gate passes, JSON-LD queued for G (2026-11-03)

- optimize.mjs on aem.live (run-1): P1 0 · P2 4 · P3 0, source parity 0. The 4 P2s are ai-search/jsonld: the source carries WebPage + BreadcrumbList JSON-LD on every page and the delivered pages carry none — carried over in G (autofix marks JSON-LD manual).

## Rollout G-aem — JSON-LD carried over, health 100 (2026-11-03)

- The 4 open P2 ai-search/jsonld findings: the source's JSON-LD (WebPage + BreadcrumbList; resources + 5 VideoObject) carried verbatim as a `JSON-LD` metadata row per page — the pipeline renders it as a server-side `<script type="application/ld+json">` (a runtime injector was tried and removed). First insert landed outside the metadata block (loose closing tags); fixed, re-deployed 4/4 live.
- Re-optimize: P1 0 · P2 0 · P3 0, fixed this history P2 4, health 100; verify 4/4.

## Rollout H-report — summary + learnings (2026-11-03)

- stardust/rollout/report.md: 4/4 pages verified, 17/17 blocks verified (block rows updated), gate 4/4 at both widths, health 100, parity 18/18, redirects + sitemap verified, nothing in scope left to deliver. stardust/learnings.md: 5 entries.

## Rollout I-dashboard — dashboard written (2026-11-03)

- stardust/rollout/dashboard/{index.html,data.json}: 4 identified · 4 prototyped · 4 deployed · 4 optimised. Rollout complete; next: the replica handoff done-check.

## Replica handoff — complete (2026-11-03)

- migrate → deploy → rollout A–I done for the 4 planned pages; runner done-check `{"complete":true,"gaps":[]}`. Published on aem.live: 4 pages, `/nav`, `/footer`, `/redirects.json`. Open with the owner: dynamics decisions D1–D5 (tags/consent enablement, trial form service, site search, locales, Ask assistant + account), all shipped at their interim tier.
