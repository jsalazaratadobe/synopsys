# Dynamic features — ansys.synopsys.com (Ansys Fluent, 4 pages)

Curated from `stardust/dynamics/dynamic-features.generated-plan.{md,json}` (103 draft rows; evidence `stardust/current/_dynamics.json`). Hands-off run: every non-`self` row ships its interim tier and its decision is recorded by name (never `decided-out`).

## Listings contract

none — the card rails (industries, applications, resources, blog/whitepaper/case-study grids, product-update posts) are authored content on each page, captured verbatim; no listing reads an index. (Draft rows 36–40 re-dispositioned from `index-backed` to `static-snapshot`: authored rows, document-first.)

## Features

| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | martech-stack | Tag stack: Adobe Launch (121 rules, 330 data elements), Adobe Analytics/Experience Edge, GTM, Google Ads, Marketo Munchkin, LinkedIn/Reddit/Twitter/Facebook/Quora/AdRoll pixels, Crazy Egg, Siteimprove, Convertful, Conversica chat, d41/ml314/eyeota/pubmatic/bidswitch beacons (draft rows 0–8, 12–22, 52–95) | T/A | 4/4 | embed-passthrough | runtime (`scripts/martech.js`) | needs-business-decision | scaffolded-awaiting-owner | martech | D1 — owner enables routes in `stardust/martech-contract.json` | `stardust/martech/` |
| 2 | consent-onetrust | OneTrust CMP | T | 4/4 | embed-passthrough | runtime | needs-business-decision | scaffolded-awaiting-owner | martech consent | D1 — CMP id + enable | `t-consent-onetrust` |
| 3 | data-layers | `digitalData`, `dataLayer`, `adobeDataLayer`, `CQ` globals | A | 4/4 | static-snapshot | runtime | self | interim | martech | D1 — Launch data-layer rules rewritten by owner (handoff lists them) | rows 9–11, 22 |
| 4 | gated-trial-form | "Try Fluent Today" / Free Trial gated form (gatedcontent.com + Marketo "Free Trial – MKTO Production (en)", Turnstile captcha, Pardot) | F | 4/4 | embed-passthrough | content (link to source form) | needs-business-decision | interim | form-service passthrough | D2 — form service on new host; interim: `#gate-…` CTAs rewritten at runtime (scripts.js `decorateGateLinks`) to the same source page + hash, which opens the source trial form | rows 31–33 |
| 5 | vidyard-player | Vidyard background + inline players (hero, "What is Fluent?") | V | 4/4 | embed-passthrough | content (player id/URL) | self | planned | hosted-player | — | rows 96–97 |
| 6 | youtube | YouTube embeds | V | 2/4 | embed-passthrough | content | self | planned | hosted-player | — | row 98 |
| 7 | modals | dialog modals (video lightbox, gated-content modal, coveo search modal) | M | 4/4 | rebuild-native | runtime | self | planned | modal-loader | — | rows 41–48 |
| 8 | header-chrome | header mega menus, Countries & Regions, Ask, mobile drawer | M | 4/4 | rebuild-native | runtime (header block) | self | planned | chrome | gated by chrome-compare | rows 100–101, `stardust/chrome/header-contract.json` |
| 9 | site-search | header search → hosted (Coveo) /search | S | 4/4 | embed-passthrough | content (link to source /search) | needs-business-decision | interim | search | D3 — search over 4 migrated pages is not a site search; interim: header search submits to the source results page | rows 46, 49–51, 102 |
| 10 | carousels | card rails + testimonial slider (scroll-snap, arrows, dots) | CR | 4/4 | rebuild-native | block JS | self | planned | carousel | — | rows 23–29 |
| 11 | utility-nav | utility bar (Synopsys/Ansys/breadcrumb, region, Ask) | CR | 4/4 | rebuild-native | header block | self | planned | chrome | — | row 30 |
| 12 | locale-variants | hreflang alternates en-gb, en-in, fr-fr, de-de, it-it, ja-jp, ko-kr, zh-tw, zh-cn | I18N | 4/4 | static-snapshot | content (links to source locales) | needs-business-decision | interim | locale-tree | D4 — locale pages out of this run's scope; region links keep source URLs | rows 34–35 |
| 13 | ask-ai | "Ask" AI assistant (chat panel) | X | 4/4 | static-snapshot | content | needs-backend | interim | — | D5 — assistant backend is the owner's; button kept, opens nothing until wired | header contract `Ask` states |
| 14 | sign-in | sign-in / account (Customers menu) | X | 4/4 | static-snapshot | content (links to source) | needs-backend | interim | — | D5 — links point at the source account pages | row 99 |
| 15 | privacy-edge | Experience Edge privacy/interact POSTs | A | 4/4 | embed-passthrough | runtime (Web SDK via martech contract) | needs-business-decision | scaffolded-awaiting-owner | martech | D1 | rows 8, 17 |
| 16 | card-listings | card groups (tile rails, resource / blog / curated / link cards, past-release cards) — server-rendered on the source, no feed | L | 4/4 | static-snapshot | block (authored rows) | self | planned | editorial-curated | hands-off: editorially curated — the 4-page scope has no index to drive them; cards are authored verbatim in their blocks | B2 re-detect 2026-11-03: 5 `listing-index-backed` candidates, evidence none |

## Decision batch

One message to the owner (recorded as named assumptions; the interim tier ships):

- **D1 — Tags, analytics and consent.** Everything from the source is carried in `stardust/martech-contract.json`, every part disabled. Enable the OneTrust CMP (id), then each tag route; rewrite Launch rules/data elements that read old paths (`stardust/martech-handoff.md`).
- **D2 — Free-trial / gated forms.** Choose the form service on the new host (gatedcontent.com + Marketo). Interim: "Try Fluent Today" links to the source form.
- **D3 — Site search.** Interim: header search goes to the source `/search` results.
- **D4 — Other locales.** Out of scope for this 4-page run; region switcher links to the source locale pages.
- **D5 — Ask assistant + account.** Backends stay with the owner; UI kept, links to source.

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| — | none: no owner statement in this run | — |

**B2 re-verification (2026-11-03, rollout).** Fresh `dynamics-detect` on the 4 pages: 90 findings → 93 plan rows (`stardust/dynamics/dynamic-features.generated-plan.md`, `--target-origin` the EDS preview, `--migrated`, `--martech`, `--chrome`). Every row maps to a curated feature above: the 3 host-bound rows are Experience Edge privacy/interact (row 15) and the Coveo search token (row 9); the 5 listing candidates are row 16 (new). The martech contract was regenerated, every part still disabled.

**D2 parity (2026-11-03, rollout).** `stardust/dynamics/parity.json` — 16 features, replayable checks on the published origin (`dynamics-check.mjs --origin https://main--0f0b9fb5--aemcoder.aem.live` → `stardust/qa/dynamics-report.md`). Self rows: Vidyard background + lightbox playback, lightbox/search dialogs, header chrome, carousels, breadcrumb, card groups; interim rows check their link-out (trial form, search); martech: no tag host requested while every part is off. No `/query-index.json` needed: no listing reads an index.
