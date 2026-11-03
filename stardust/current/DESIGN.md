<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-03T00:30:00Z
  readArtifacts:
    - stardust/current/_computed-styles.json
    - stardust/current/assets/css/ansys.css
    - stardust/current/_brand-extraction.json
  synthesizedInputs: []
  stardustVersion: 0.36.0
-->
---
name: Ansys Fluent (ansys.synopsys.com)
description: Dark, technical product hub — tungsten surfaces, Ansys gold accents, heavy Montserrat headings.
colors:
  tungsten-950: "#171917"
  tungsten-900: "#1e201e"
  tungsten-800: "#272a27"
  tungsten-600: "#373b37"
  tungsten-200: "#c1c2c1"
  tungsten-100: "#ebebeb"
  tungsten-50: "#fcfcfc"
  gold-500: "#fdb71a"
  gold-400: "#fdcf73"
  blue-700: "#2166c5"
  blue-300: "#9abded"
  white: "#ffffff"
  black: "#000000"
typography:
  display:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: 1
  heading:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
  body:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  box: "24px"
  pill: "999rem"
spacing:
  unit: "4px"
components:
  button-primary:
    backgroundColor: "{colors.gold-500}"
    textColor: "{colors.black}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
---

## Overview

Product hub pages for Ansys Fluent on a Tailwind v4 system. Dark theme by default (tungsten-950 background, tungsten-50 text) with light (white) theme scopes for some sections. Gold (#fdb71a) is the single accent: primary buttons, eyebrows, icons.

## Colors

Tungsten neutral ramp (#171917 → #fcfcfc), gold accent ramp (#fdb71a primary), blue for inline links on light scopes.

## Typography

Montserrat (variable 100–900) for headings, weight 800 at 48px for h1/h2 on desktop; Source Sans 3 for body at 16–20px. Tailwind text scale.

## Layout

Full-bleed sections with an inner container; product sub-nav pill bar under the hero; card carousels; breakpoints measured by cap-probe (extensions.breakpoints).

## Shapes

Pill buttons (999rem), 24px box radius on cards/media panels, 4px small radius.

## Components

Global header (utility bar + mega menu), hero with video/photo background and centred copy, sticky product sub-nav, card carousels, testimonial slider, feature lists with gold icons, resource cards, footer.
