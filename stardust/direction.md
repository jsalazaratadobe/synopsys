---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-03T01:16:27Z
  againstInput: https://ansys.synopsys.com/products/fluids/ansys-fluent
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://ansys.synopsys.com/products/fluids/ansys-fluent (+ capabilities, resources, product-updates), promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md · current/DESIGN.json → DESIGN.json (at 2026-11-03T01:16:27Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md (empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Link-audit decisions (rollout E2, 2026-11-03)

- **Scope extension → repointed to the source (kept absolute):** 156 ansys.synopsys.com targets outside the fixed 4-page plan (resource center, products, academic, contact, industries, events, blog, company pages, locale roots …), including the Ansys home links in the logo and footer (3): the root redirect `/` → overview exists only so the origin answers, so home links keep the source home. No capture gaps: every in-scope target is delivered and localized (`localize-links --check` PASS without the root rows).
- External targets stay as captured; GET from this network: 183 × 200, 6 × 302 (innovationspace login chains), 5 unreachable from the test network (download/support/investors/innovation.ansys.com — environment limit, the same links the source carries). No 404 (stardust/.work/final/ext-status.txt).
