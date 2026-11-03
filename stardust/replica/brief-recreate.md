# Recreate brief — Ansys Fluent replica (shared by every archetype subagent)

Project root: /workspace/0f0b9fb5. Run everything from there. Hands-off: never ask questions.

## Goal
Author ONE archetype prototype as clean semantic HTML/CSS that matches the live page near pixel-perfect,
then pass the source-fidelity gate at 1440 AND 360 (cap 3 iterations per breakpoint after the first --full round).
Same design, same content — recreation, never redesign, never DOM copy, never port page-level CSS.

## Pages (slug → live URL → page type)
- products-fluids-ansys-fluent → https://ansys.synopsys.com/products/fluids/ansys-fluent → landing (CANON archetype, built first)
- products-fluids-ansys-fluent-capabilities → …/ansys-fluent/capabilities → program
- products-fluids-ansys-fluent-resources → …/ansys-fluent/resources → listing
- products-fluids-ansys-fluent-product-updates → …/ansys-fluent/product-updates → article

## Inputs (read by query — the context is the budget)
- Content, verbatim: `stardust/current/pages/<slug>.json` (json-query.mjs) and the settled DOM `stardust/current/pages/<slug>.html`
  (html-slice.mjs; or a throwaway cheerio walker under /tmp — cheerio at /app/node_modules/cheerio/dist/esm/index.js).
  Ready-made outline helpers: `node /tmp/tools/outline.mjs <html> '<sel>'` (children summary) and
  `node /tmp/tools/tree.mjs <html> '<sel>' <depth>` (class/text tree). Crop helper: `node /tmp/tools/crop.mjs in.png out.png x y w h [scale]`.
- Source CSS (Tailwind v4, Astro): `stardust/current/assets/css/ansys.css` — read with
  `node stardust/scripts/replica/css-rules.mjs <sheet> '<selector regex>' [--media <re>] [--decl <re>]`.
  The page uses CONTAINER queries (`@3xl/section` = 48rem, `@5xl` = 64rem, `@7xl` = 80rem, `@10xl`, `@11xl`, `@13xl` —
  read the real widths from the sheet's `@container` rules / `--container-*` tokens). Lift exact values; never eyeball.
  Theme: dark default (`--color-base` tungsten-950 #171917, text tungsten-50) with light scopes; gold #fdb71a primary.
- Computed styles at 1440 + 360: `stardust/current/_computed-styles.json` (json-query.mjs).
- Ground truth screenshot: `stardust/current/assets/screenshots/<slug>.png` (1440 wide) — crops only, one per fact.
- Box comparison live vs prototype: `node stardust/scripts/replica/measure.mjs <live-url> --against <proto-url> --selectors "<css>,…" --width 1440,360`.
- Header behaviour contract: `stardust/chrome/header-contract.json` (mega menus open on hover/click, mobile drawer).
- Scripts flags: `/home/node/adobe-skills/plugins/stardust/skills/stardust/reference/scripts-index.md`, then `--help`. Never read script source.
- Method docs (read by SECTION only: `node stardust/scripts/replica/section.mjs <doc> --list`, then one heading per call):
  `/home/node/adobe-skills/plugins/stardust/skills/replica/reference/recreation-procedure.md` and `…/source-fidelity-gate.md`
  (§ Pass bar, § Reading the band breakdown, § Iteration discipline, § Hardening rules, § Residual logging format).

## Files you write
- `stardust/prototypes/<slug>-proposed.html` — links `css/canon.css` (shared: fonts, tokens, buttons, header, utility bar,
  product sub-nav, footer, shared modules) + `css/<slug>.css` (this archetype's modules) + `js/canon.js` (shared minimal JS:
  sticky-header morph if the live one morphs, menus/drawer, carousels arrows) and per-page JS only if needed.
  The canon archetype CREATES canon.css/canon.js; later archetypes IMPORT them and only ADD rules (append, never change a
  gated rule's value; if a canon value is wrong for every page, fix it in canon and say so in your report).
- Fonts: `stardust/prototypes/assets/fonts/*.woff2` (Montserrat + Source Sans 3, OFL, already copied). Logo: `assets/logo.svg`
  (paths have class fill-white — inline the SVG in the header or set fill in CSS). Favicon `assets/favicon.ico`.
- Images: reference the source's absolute image URLs (`currentSrc` in the page JSON `media.imgs`), with width/height and alt verbatim.
  Videos (Vidyard background in hero, inline players): render the poster frame exactly as the live capture shows it
  (stitch-shot freezes video at t=0) and record it as captureState with restoreAtDelivery (e.g. "Vidyard background autoplay muted loop, id …").
- `stardust/replica/progress.json` — merge (never replace) `types.<page type>`: { slug, archetype, iterations:{1440:n,360:n},
  gates:{1440:{pixel,heightDelta,contentDiff,visualDiff,clip,overflow},360:{…}}, cap: "PASS|…", residuals:[…], captureState:[…],
  motion:{observed:[],implemented:[],dead:[]} } — read it first if it exists.
- `stardust/replica/units.json` — declare repeated-unit families you author (cards, FAQ rows) per gate doc item 7 (merge, never replace).

## Root structure (decided — keep it symmetric with live)
The live page has NO `<footer>` element and its `<header>` sits INSIDE `<main>` (main > section:first-child > div > header);
the footer is main's last `<section>`. content-diff matches per root, so the prototype MIRRORS this root structure:
`<body><main class="main"><section class="site-header-section"><header>…</header></section> … content sections … <section class="site-footer">…</section></main></body>`.
Gate with `--main "main"` on every round. Do not add a `<footer>` element.

## Server
A python http.server already serves `stardust/prototypes/` on port 8791 (PID recorded by the main agent — never kill it, never start another).
PROTO=http://localhost:8791/<slug>-proposed.html

## Gate (one command per round, through run-bg; never foreground, never a hand wrapper)
```
LIVE=<live url>; PROTO=http://localhost:8791/<slug>-proposed.html
node stardust/scripts/replica/run-bg.mjs start --name <slug>-1440-iter1 -- stardust/scripts/replica/gate.sh <slug> "$LIVE" "$PROTO" 1440 iter1 --full --main "main" --marker "Ansys"
node stardust/scripts/replica/run-bg.mjs start --name <slug>-360-iter1 -- stardust/scripts/replica/gate.sh <slug> "$LIVE" "$PROTO" 360 iter1 --full --main "main" --marker "Ansys"
node stardust/scripts/replica/run-bg.mjs wait        # exit 75 = still going → `wait` again as your NEXT step (never sleep/loop)
```
Pixel rounds in between: same command without `--full`, label iter2/iter3. The LAST round per width is `--full` (confirmation).
Inner loop: `anchor.mjs` (live side cached via --cache), `chrome-parity.mjs` for header/footer before pixel rounds, `crop-compare.mjs`
for the first hot band (one image per round). Content-cap row once after the 1440 pass:
`node stardust/scripts/replica/cap-probe.mjs "$LIVE" --against "$PROTO" --design DESIGN.json --slug <slug> --main "main"`.
At most 2 gate jobs at once (each spawns Chromiums; the machine is small). Exit 124 = deadline → re-run, not a verdict.
Consent: OneTrust (`#onetrust-accept-btn-handler`) — add `--consent "#onetrust-accept-btn-handler"` if the live capture shows the banner.

Pass bar per width: content-diff 0 🔴 and 0 nothing-lost 🟡 (main root); visual-diff flags none or justified; pixel ≤ 10 % with no
unexplained hot band; |Δh| ≤ 8 px; clip-probe Clipped: 0; overflow assert ok; cap-probe PASS (1440 only).
Hard cap: 3 iterations per breakpoint after iter1; then log residuals (gate doc § Residual logging format) and stop.
Fix the FIRST hot band top-down; fix height deltas first (everything below is offset-contaminated).

## Interaction parity (after the static gate passes)
`node stardust/scripts/replica/motion-observe.mjs --help` → observe live → `stardust/replica/motion/<slug>.json`; implement only behaviours
that fired (carousels arrows/dots, menu hover, accordion/FAQ toggles); observe the prototype with the same pokes →
`motion/<slug>-build.json`; `motion-compare.mjs` the two; re-run one pixel round (number must return to the gated value).

## Rules
- Content verbatim: no rewording, no fabrication, no dropped items. Count cards/rows per section against the capture before authoring.
- Hidden content (mega-menu panels, FAQ answers, modal templates) is part of the page: author it hidden the same way (content-diff reads it).
- Reading discipline: never cat big files; never read whole screenshots; never print >~4 KB of any capture at once.
- Never edit files under stardust/scripts/ or the project-root scripts/, blocks/, styles/ (EDS code comes later).
- Never run npm install. Never kill processes by name/pattern; only PIDs you started yourself.
- Do NOT write stardust/status.jsonl, state.json, or commit — the main agent does bookkeeping.

## Report back (≤ 25 lines)
Per width: iterations used, final pixel %, height Δ, content-diff tiers, visual-diff flags, clip, overflow; cap-probe line; motion summary;
residuals; canon files created/changed; anything the next archetype must know.
