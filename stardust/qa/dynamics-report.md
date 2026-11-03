# Dynamics parity check — https://main--0f0b9fb5--aemcoder.aem.live — 2026-11-03T19:58:19.208Z

Replayed 17 checks over 17 features · pass 17 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| OneTrust CMP | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 2 gated host pattern(s) before consent | play.vidyard.com:302×4 play.vidyard.com:200×2 cdn.vidyard.com:200×4 assets.vidyard.com:200×3 cdn.vidyard.com:206×1 |
| Try Fluent Today gated trial form | F | interim | dom-count | PASS | 4 × main a[href^="https://ansys.synopsys.com/products/fluids/ansys-fluent#gate-"] (min 1) | play.vidyard.com:302×4 cdn.vidyard.com:200×4 play.vidyard.com:200×2 assets.vidyard.com:200×3 cdn.vidyard.com:206×1 |
| Vidyard background + inline players | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 14 (ok) | play.vidyard.com:302×4 cdn.vidyard.com:200×4 play.vidyard.com:200×2 assets.vidyard.com:200×3 cdn.vidyard.com:206×1 |
| Vidyard background + inline players | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 52 (ok) | play.vidyard.com:302×5 cdn.vidyard.com:200×20 play.vidyard.com:200×5 assets.vidyard.com:200×17 cdn.vidyard.com:206×1 raw.vidyard.com:200×4 |
| Vidyard background + inline players | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 49 (ok) | play.vidyard.com:302×7 cdn.vidyard.com:200×22 play.vidyard.com:200×3 assets.vidyard.com:200×14 raw.vidyard.com:200×3 |
| YouTube links (FAQ, learning playlist) | V | done | dom-count | PASS | 2 × main a[href*="youtube.com"] (min 2) | play.vidyard.com:302×4 play.vidyard.com:200×2 cdn.vidyard.com:200×4 assets.vidyard.com:200×3 cdn.vidyard.com:206×1 |
| video lightboxes + search modal | M | done | click-dialog | PASS | dialog 1296px · heading "" · 0 fields · iframe · Escape closes: true | play.vidyard.com:302×5 play.vidyard.com:200×5 cdn.vidyard.com:200×20 assets.vidyard.com:200×17 cdn.vidyard.com:206×1 |
| video lightboxes + search modal | M | done | click-dialog | PASS | dialog 1440px · heading "" · 1 fields · Escape closes: true | play.vidyard.com:302×4 play.vidyard.com:200×2 cdn.vidyard.com:200×4 assets.vidyard.com:200×3 cdn.vidyard.com:206×1 |
| header mega menus, Countries & Regions, mobile drawer | M | done | dom-count | PASS | 19 × .header button[aria-expanded] (min 4) | play.vidyard.com:302×4 cdn.vidyard.com:200×4 play.vidyard.com:200×2 assets.vidyard.com:200×3 cdn.vidyard.com:206×1 |
| header mega menus, Countries & Regions, mobile drawer | M | done | no-page-errors | PASS | none on 4 page(s) |  |
| header search → source /search | S | interim | dom-count | PASS | 1 × .header form[action^="https://ansys.synopsys.com/search"] (min 1) | play.vidyard.com:200×2 play.vidyard.com:302×4 cdn.vidyard.com:200×4 assets.vidyard.com:200×3 cdn.vidyard.com:206×1 |
| case carousel + tile rails | CR | done | dom-count | PASS | 3 × .case-carousel article.case (min 2) | play.vidyard.com:302×4 cdn.vidyard.com:200×4 play.vidyard.com:200×2 assets.vidyard.com:200×3 cdn.vidyard.com:206×1 |
| case carousel + tile rails | CR | done | dom-count | PASS | 9 × .tile-rail .tile-card (min 4) | play.vidyard.com:302×4 play.vidyard.com:200×2 cdn.vidyard.com:200×4 assets.vidyard.com:200×3 cdn.vidyard.com:206×1 |
| utility bar + breadcrumb | CR | done | dom-count | PASS | 6 × .header .ubar-crumbs a (min 3) | play.vidyard.com:302×7 cdn.vidyard.com:200×7 play.vidyard.com:200×2 assets.vidyard.com:200×3 cdn.vidyard.com:206×1 |
| authored card groups | L | done | dom-count | PASS | 16 × main .resource-cards a[href] (min 6) | play.vidyard.com:302×6 cdn.vidyard.com:200×6 |
| authored card groups | L | done | dom-count | PASS | 3 × main .release-notes .release-notes-body (min 1) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (4 gated · 1 cross-site host(s) blocked) |  |

## Features without checks

- tag stack (Launch, Analytics, GTM, pixels …) (T) — scaffolded-awaiting-owner · owner: D1 — enable the CMP, then each tag route
- digitalData / dataLayer / adobeDataLayer globals (A) — interim · owner: D1 — Launch data-layer rules rewritten by the owner
- Countries & Regions → source locales (I18N) — interim · owner: D4 — locale pages out of this run
- Ask AI assistant (X) — interim · owner: D5 — assistant backend
- sign-in / account links (X) — interim · owner: D5 — account pages stay on the source
- Experience Edge privacy/interact (A) — scaffolded-awaiting-owner · owner: D1
