# Learnings — Ansys Fluent replica run

- **EDS renders a `JSON-LD` metadata row server-side** as `<script type="application/ld+json">` in `<head>` — carry the source's structured data verbatim as one metadata row (an array), no runtime injector. When inserting a metadata row into generated content, anchor on the metadata block's own close: generated fragments can carry loose closing tags, and "the last `</div>` before `</main>`" was the section, not the block.
- **Gated-form anchors (`#gate-<uuid>`) are dead on EDS**; the source opens its form from the hash on page load, so the interim link-out is source page + hash. Catch these in B2/D2 (`a[href^="#"]` whose target id is absent on the delivered page).
- **chrome-explore contract crops can be source-side artifacts** (the live page captured scrolled: page body + chat bubble inside the panel crop). Compare the crop pair before iterating a panel-visual 🔴.
- **Scoped runs and the root:** with the home page out of scope, the root redirect makes `/` answer, but `localize-links` then wants to rewrite home links to `/` → the overview. Keep home links on the source and run `--check` without the root rows.
- **gate-all reads `state.json` deployed rows**; a scratch state (status deployed + liveUrl + deployedPath) plus per-width units caches (the origin units cache is width-blind) drove the roster run cleanly.
