<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-03T00:30:00Z
  readArtifacts:
    - stardust/current/pages/products-fluids-ansys-fluent.json
    - stardust/current/pages/products-fluids-ansys-fluent-capabilities.json
    - stardust/current/pages/products-fluids-ansys-fluent-resources.json
    - stardust/current/pages/products-fluids-ansys-fluent-product-updates.json
    - stardust/current/_brand-extraction.json
  synthesizedInputs: []
  stardustVersion: 0.36.0
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Simulation engineers, CFD analysts and engineering managers evaluating or using Ansys Fluent (part of Synopsys) across automotive, aerospace, energy and industrial sectors.

## Product Purpose

The four captured pages form the Ansys Fluent product hub: an overview (positioning, industry use cases, customer proof), a capabilities deep-dive, a resources library (tutorials, webinars, papers, case studies) and product-update release notes. Each funnels to "Try Fluent Today" / free trials.

## Positioning

"The world's most advanced Computational Fluid Dynamics (CFD) software, designed to help engineers solve their most challenging fluid dynamics problems at gold-standard accuracy."

## Capabilities and Constraints

Astro + Tailwind v4 front end; global header with mega menu, utility bar and locale switcher; product sub-nav shared by all four pages; Vidyard video players; gated content forms (gatedcontent.com); OneTrust consent; Adobe Launch tags.

## Brand Commitments

Register: brand (marketing / product landing). Personality: technical, confident, premium — dark tungsten surfaces with Ansys gold accents, heavy Montserrat headings, photographic engineering imagery. Anti-references (observed absence): no playful illustration, no gradients-as-decoration beyond image scrims.

## Evidence on Hand

- stardust/current/pages/*.json + *.html (4 live renders)
- stardust/current/assets/screenshots/*.png
- stardust/current/assets/css/ansys.css (live stylesheet)
- stardust/current/assets/fonts/ (Montserrat, Source Sans 3 — OFL)
- stardust/current/_computed-styles.json (1440 + 360 census)

## Product Principles

_provenance: inferred — from captured copy.
- Accuracy and validation first ("gold-standard accuracy").
- Speed and scale (GPU solver, HPC).
- Breadth of physics in one tool.
