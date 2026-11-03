# Foundation change requests (applied once at C-final)

- foundation | header drawer accordions at 360: 7 open-state crops 2.4–15.3 % over the 2 % bar (Service & Support worst; live scrolls ~22 px further, hover state differs) | chrome-compare 360 exit 2, crops in stardust/.work/c0/gate/ | all templates
- foundation | header drawer "Back" key: Tab does not move into the panel after Back as on live (3 errors) | chrome-compare 360 key test | all templates
- foundation | Countries & Regions links: header rewrites to the current page's localized URL — re-verify on a deployed in-scope page (unverifiable on /drafts/shell) | chrome-compare 1440 | all templates
- foundation | trigger outline-color/offset/width transitions missing (warnings) | chrome-compare 1440 warnings | all templates
- archetype-landing | authored CTA arrow is a CSS ::after mask; live CTAs carry an inline 20×20 svg, so unit-geometry rows report the glyph missing (case-carousel now injects the svg locally and hides ::after) | unit-geometry 1440 case-slide svg#1 off / 360 missing 1 before the local fix | all templates
- archetype-program | header breadcrumb() passes `ancestors.slice(1, -1).map(crumb)` (array of arrays) to h(), so .ubar-crumb-mid renders the text "[object HTMLSpanElement],https://…/products/fluids" instead of the Fluids crumb; on 4-level pages the wrapped text grows .ubar 57 → 65px (fix: `.flatMap(crumb)`; hero.css carries a white-space: nowrap override meanwhile) | crop-compare header band 1440 3.34 % (EDS nav row +4–6 px vs live; landing 0.00 %), DOM probe .ubar h65 vs h57 on landing | program, listing, article (every 4-level path)

## Applied at C-final (2026-11-03)

- breadcrumb `.ubar-crumb-mid` → fixed at the root (`...ancestors.slice(1, -1).flatMap(crumb)`, `white-space: nowrap` moved into header.css); hero.css scoped override removed.
- drawer accordions 360 / Back-key Tab / outline-color transitions → re-explored on the deployed overview (chrome-explore → stardust/.work/chrome/hdr-build-base.json): the Learn/About accordion crops and the Back-key Tab findings no longer report; Countries & Regions 390 crop matches line for line (live list scrolled ~16 px further — residual). Outline-* transitions stay warnings (focus-ring motion only), no change.
- Countries & Regions links → verified on the deployed in-scope page: the 1440/390 panels list the same 10 localized links as the contract, chrome-compare reports no link delta.
- CTA arrow ::after vs inline svg → no foundation change: every gate row reports units 0; the case-carousel local fix stays scoped to its block.
- Remaining chrome-compare errors are the Ask chat (brandConcierge — owner/backend dynamics row, 0-link hover states included) and source-side crop artifacts (contract crops taken scrolled, page body + chat bubble inside the crop: Customers, Countries & Regions, mega panels).
