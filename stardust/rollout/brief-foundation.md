# C0 foundation brief — Ansys Fluent replica (EDS, DA-backed)

Project root /workspace/0f0b9fb5 (the EDS repo itself; `main` branch, GitHub aemcoder/0f0b9fb5, Code Sync on).
Hands-off: never ask questions. Read AGENTS.md first (EDS rules: never edit scripts/aem.js; scope CSS to `.blockname`;
`-wrapper`/`-container` are section classes; no build step).

## Goal
Author AND deploy the site FOUNDATION so every page renders the gated prototypes' chrome and base styles:
`styles/` (styles.css, fonts.css, lazy-styles.css), `fonts/` (self-hosted OFL woff2: Montserrat + Source Sans 3 from
`stardust/prototypes/assets/fonts/` — drop the boilerplate Roboto files), `favicon.ico` (from
`stardust/prototypes/assets/favicon.ico`), `head.html`, `blocks/header/`, `blocks/footer/`,
`stardust/runtime-contract.json`, and `scripts/martech.js` regenerated from the (just regenerated) contract:
`node stardust/scripts/deploy/martech-scaffold.mjs --help` then run it (every part stays disabled). Plus the DA chrome
documents `/nav` and `/footer` (each with a `Robots | noindex` metadata row), PUT → preview → PUBLISH.
No page body blocks — those belong to the archetype units (hero, product-subnav, split, cta-band, … per
`stardust/rollout/block-map.md`). Do not author them.

## Sources (the gated prototypes are the spec — recreate, never redesign)
- Shared canon: `stardust/prototypes/css/canon.css` (tokens, fonts, buttons, header, utility bar, footer, shared
  modules) and `stardust/prototypes/js/canon.js` (header mega menus, mobile drawer, sticky behaviour). Header/footer
  markup: `stardust/prototypes/products-fluids-ansys-fluent-capabilities-proposed.html` (deeper-page breadcrumb).
  Read big files by query (cheerio at /app/node_modules/cheerio/dist/esm/index.js; `node stardust/scripts/replica/css-rules.mjs`
  for CSS); never cat whole.
- Header behaviour contract: `stardust/chrome/header-contract.json` (+ `../diff/SKILL.md` § The header contract:
  `node stardust/scripts/replica/section.mjs /home/node/adobe-skills/plugins/stardust/skills/diff/SKILL.md 'header contract'`).
- Deploy method, by SECTION only (`node stardust/scripts/replica/section.mjs /home/node/adobe-skills/plugins/stardust/skills/deploy/SKILL.md --list`,
  then one heading per call): foundation, chrome (nav/footer documents + header/footer blocks), Experience Workspace
  editability contract (EW1–EW10: node-slotting, never value-slotting; banned: `x.textContent = cell.textContent`,
  `${text}` interpolation of authored copy), Target runtime, Deploy (DA Source API). Also the contract card
  `/home/node/adobe-skills/plugins/stardust/skills/replica/reference/handoff-contract.md` § 2 (already summarised here).
- Script flags: `/home/node/adobe-skills/plugins/stardust/skills/stardust/reference/scripts-index.md`, then `--help`. Project copies
  live under `stardust/scripts/{deploy,rollout,replica,diff,dynamics}/` — run those, never plugin paths.

## Content (DA)
- Author `content/nav.html` and `content/footer.html` as DA documents (canonical div-class block form; see the
  `da-content` skill rules if needed: `/home/node/adobe-skills/plugins/aem/edge-delivery-services/skills/da-content/SKILL.md`, by section).
  Every string verbatim from the prototype chrome (mega-menu panels included — hidden content is content).
  Links: root-relative for the 4 in-scope pages (`/products/fluids/ansys-fluent`, `…/capabilities`, `…/resources`,
  `…/product-updates`); every other target stays an absolute `https://ansys.synopsys.com/…` URL (out of scope — never a 404).
- Images in chrome: logo inline SVG in the header block is fine (decorative/brand mark), or an editorial image via
  `da-media-upload.mjs` (never `/img/…` in content).
- Token: the IMS token file path is in env `ADOBE_IMS_TOKEN_FILE`. Pass `--token-file "$ADOBE_IMS_TOKEN_FILE"` to the
  deploy scripts, or `-H "Authorization: Bearer $(cat "$ADOBE_IMS_TOKEN_FILE")"` inline in curl. NEVER print, echo,
  copy or write the token anywhere (no files, no logs, no briefs).
- DA: org `aemcoder`, repo `0f0b9fb5`, branch `main`. PUT `https://admin.da.live/source/aemcoder/0f0b9fb5/<path>.html`
  (multipart field `data`), preview `POST https://admin.hlx.page/preview/aemcoder/0f0b9fb5/main/<path>`, publish
  `POST https://admin.hlx.page/live/aemcoder/0f0b9fb5/main/<path>`. Run `sanitise.js` and `davids-model-lint.mjs` on
  each content file before PUT. Check `.plain.html` after preview.
- Shell check page: PUT a minimal `drafts/shell.html` (one h1 "Ansys Fluent shell" + one paragraph), PREVIEW ONLY
  (never publish it), so the chrome can be gated at `https://main--0f0b9fb5--aemcoder.aem.page/drafts/shell`.

## Code
- Lint: if `node_modules/.bin/eslint` is missing, run `npm ci` at the project root only. Then `npm run lint:fix`, then
  `npm run lint` must pass (airbnb-base + stylelint standard: kebab-case classes, lines ≤ 100 chars, one statement per
  line). Never add an .eslintignore for runtime files.
- Commit your code with a message ending in the line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and
  `git push origin main` so Code Sync builds it; poll `https://main--0f0b9fb5--aemcoder.aem.page/blocks/header/header.js`
  with bounded `curl -sf` (≤ 5 s apart, ≤ 3 min) until it serves your version.
- Never write stardust/status.jsonl, state.json or stardust/rollout/progress.json (the main agent does).
- Long instruments (Playwright captures, gates) go through `node stardust/scripts/replica/run-bg.mjs start --name … -- …`
  then `run-bg.mjs wait` as the next call. At most 2 browser jobs at once. Leave nothing running.

## Self-check before reporting (on the preview shell page vs the live page)
- `node stardust/scripts/diff/chrome-compare.mjs --help` → run it live (https://ansys.synopsys.com/products/fluids/ansys-fluent/capabilities)
  vs the shell preview at 1440 and 390/360; target exit 0 (the header contract). Note: the live header sits inside
  `<main>` on the source; on EDS it is the `<header>` block — compare the chrome, not the root placement.
- `stardust/scripts/replica/crop-compare.mjs` header and footer bands vs live ≤ 2 % at 1440 and 360 (see `--help`).
Up to 3 fix rounds; then report residuals honestly.

## Report back (≤ 15 lines)
One verdict line `foundation: files n, nav/footer live, lint ok|<errors>, chrome-compare 1440 <exit>/<findings> 360 …,
header band x%/y%, footer band x%/y%`, then the file list of the foundation, the commit sha pushed, and residuals.
