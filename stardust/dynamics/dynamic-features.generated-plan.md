<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-03T04:38:04.088Z · input stardust/current/_dynamics.json (4 pages, 93 findings) · target probe https://main--0f0b9fb5--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-app-gatedcontent-com | A | unknown third-party host app.gatedcontent.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-px-ads-linkedin-com | A | unknown third-party host px.ads.linkedin.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-insights-gatedcontent-com | A | unknown third-party host insights.gatedcontent.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-script-crazyegg-com | A | unknown third-party host script.crazyegg.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-unknown-third-party-host-ff-d41-co | A | unknown third-party host ff.d41.co | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-unknown-third-party-host-pagestates-tracking-crazyegg-com | A | unknown third-party host pagestates-tracking.crazyegg.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | a-unknown-third-party-host-assets-tracking-crazyegg-com | A | unknown third-party host assets-tracking.crazyegg.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | a-unknown-third-party-host-paapi3112-d41-co | A | unknown third-party host paapi3112.d41.co | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 9 | a-unknown-third-party-host-tracking-crazyegg-com | A | unknown third-party host tracking.crazyegg.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 10 | a-unknown-third-party-host-t-co | A | unknown third-party host t.co | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 11 | a-first-party-api-post-ee-or2-v1-privacy-set-consent | A | first-party API POST /ee/or2/v1/privacy/set-consent | 4/4 (reach 3/4) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 12 | a-first-party-api-post-ee-or2-v1-interact | A | first-party API POST /ee/or2/v1/interact | 4/4 | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 13 | a-cms-app-settings-object-digitaldata | A | CMS / app settings object digitalData | 4/4 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 14 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 4/4 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 15 | a-cms-app-settings-object-adobedatalayer | A | CMS / app settings object adobeDataLayer | 4/4 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 16 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 3/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 17 | a-unknown-third-party-host-analytics-ahrefs-com | A | unknown third-party host analytics.ahrefs.com | 3/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 18 | a-unknown-third-party-host-app-convertful-com | A | unknown third-party host app.convertful.com | 3/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 19 | a-unknown-third-party-host-d-adroll-com | A | unknown third-party host d.adroll.com | 3/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 20 | a-unknown-third-party-host-pixel-config-reddit-com | A | unknown third-party host pixel-config.reddit.com | 3/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 21 | a-unknown-third-party-host-alb-reddit-com | A | unknown third-party host alb.reddit.com | 3/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 22 | a-unknown-third-party-host-chat-conversica-com | A | unknown third-party host chat.conversica.com | 2/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 23 | cr-client-rendered-slot-group-section-container-section-rela | CR | client-rendered slot group/section @container/section relative | 4/4 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 24 | cr-client-rendered-slot-container-modal-fixed-top-0 | CR | client-rendered slot @container/modal fixed top-0 | 4/4 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 25 | cr-client-rendered-slot-container-wrapper-mx-auto-max-w-11xl | CR | client-rendered slot @container/wrapper mx-auto max-w-11xl | 4/4 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 26 | cr-client-rendered-slot-cursor-pointer-items-center-inline-f | CR | client-rendered slot cursor-pointer items-center inline-flex | 4/4 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 27 | cr-client-rendered-slot-group | CR | client-rendered slot group | 4/4 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 28 | cr-client-rendered-slot-cursor-pointer-items-center-w-full | CR | client-rendered slot cursor-pointer items-center w-full | 4/4 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 29 | cr-client-rendered-slot-relative-flex-flex-col | CR | client-rendered slot relative flex flex-col | 4/4 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 30 | f-form-protection-captcha-antibot | F | form protection: captcha / antibot | 4/4 | rebuild-native | block | needs-backend | pending | forms | production backend (vendor form id + field mapping) |  |
| 31 | f-form-free-trial-mkto-production-en-no-action-js-wired-16-f | F | form "Free Trial - MKTO Production (en)" → no action (JS-wired) (16 fields) | 4/4 | rebuild-native | block | needs-business-decision | pending | forms | production endpoint; interim capture ships now | regulated-pii: never auto-wire; submission blocked until a human configures the secured endpoint |
| 32 | i18n-locale-variants-x-default-en-en-gb-en-in-fr-fr-de-de-it | I18N | locale variants x-default,en,en-gb,en-in,fr-fr,de-de,it-it,ja-jp,ko-kr,zh-tw,zh-cn | 4/4 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 33 | l-listing-candidate-relative-flex-1-4-cards | L | listing candidate relative flex-1 (4 cards) | 4/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 34 | l-listing-candidate-grid-grid-cols-1-8-cards | L | listing candidate grid grid-cols-1 (8 cards) | 4/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 35 | l-listing-candidate-flex-w-full-8-cards | L | listing candidate flex w-full (8 cards) | 4/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 36 | l-listing-candidate-flex-w-full-6-cards | L | listing candidate flex w-full (6 cards) | 4/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 37 | l-listing-candidate-flex-w-full-7-cards | L | listing candidate flex w-full (7 cards) | 4/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 38 | m-modal-trigger-aria-controls-dialog-dialog-content | M | modal trigger aria-controls→dialog → dialog:content | 4/4 | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 39 | m-modal-trigger-bc-dialog-button-target-outside-dom-at-captu | M | modal trigger bc-dialog-button → target outside DOM at capture | 4/4 (reach 12/4) | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 40 | m-modal-trigger-gcdc-modal-linked-dialog-form | M | modal trigger gcdc-modal-linked → dialog:form | 3/4 (reach 20/4) | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 41 | m-modal-trigger-aria-haspopup-button-content | M | modal trigger aria-haspopup → button:content | 3/4 (reach 99/4) | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 42 | m-modal-trigger-aria-haspopup-target-outside-dom-at-capture | M | modal trigger aria-haspopup → target outside DOM at capture | 1/4 (reach 99/4) | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 43 | m-modal-trigger-gcdc-modal-linked-chrome-only-dialog-form | M | modal trigger gcdc-modal-linked (chrome only) → dialog:form | 1/4 (reach 20/4) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 44 | s-first-party-api-get-content-ansysincprogram-en-us-home-sea | S | first-party API GET /content/ansysincprogram/en-us/home/search.coveotoken.json | 4/4 (reach 4/4) | data-fed | block | needs-business-decision | pending | off-origin-data | datasource ownership / same-origin routing on production | **dead on target (404)** |
| 45 | s-site-search-form-search | S | site search form → /search | 4/4 (reach 0/4) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 46 | t-unknown-third-party-host-static-cloudflareinsights-com | T | unknown third-party host static.cloudflareinsights.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 47 | t-tag-manager-adobe-launch | T | tag manager: Adobe Launch | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 48 | t-unknown-third-party-host-universal-editor-service-adobe-io | T | unknown third-party host universal-editor-service.adobe.io | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 49 | t-unknown-third-party-host-delivery-p16153-e39454-adobeaemcl | T | unknown third-party host delivery-p16153-e39454.adobeaemcloud.com | 4/4 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "delivery-p16153-e39454.adobeaemcloud.com" |
| 50 | t-consent-onetrust | T | consent: OneTrust | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 51 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 52 | t-unknown-third-party-host-a-quora-com | T | unknown third-party host a.quora.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 53 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 54 | t-marketing-marketo-munchkin | T | marketing: Marketo Munchkin | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 55 | t-unknown-third-party-host-q-quora-com | T | unknown third-party host q.quora.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 56 | t-unknown-third-party-host-cdn-0-d41-co | T | unknown third-party host cdn-0.d41.co | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 57 | t-unknown-third-party-host-www-linkedin-com | T | unknown third-party host www.linkedin.com | 4/4 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.linkedin.com" |
| 58 | t-analytics-adobe-analytics-experience-cloud-id-first-party- | T | analytics: Adobe Analytics / Experience Cloud ID (first-party subdomain — needs a CNAME on the new host) | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 59 | t-unknown-third-party-host-v2-d41-co | T | unknown third-party host v2.d41.co | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 60 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 61 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 62 | t-unknown-third-party-host-s-yimg-jp | T | unknown third-party host s.yimg.jp | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 63 | t-unknown-third-party-host-s-adroll-com | T | unknown third-party host s.adroll.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 64 | t-unknown-third-party-host-siteimproveanalytics-com | T | unknown third-party host siteimproveanalytics.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 65 | t-unknown-third-party-host-6042973-global-siteimproveanalyti | T | unknown third-party host 6042973.global.siteimproveanalytics.io | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 66 | t-unknown-third-party-host-ipv4-d-adroll-com | T | unknown third-party host ipv4.d.adroll.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 67 | t-unknown-third-party-host-ml314-com | T | unknown third-party host ml314.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 68 | t-unknown-third-party-host-adsuite-pro | T | unknown third-party host adsuite.pro | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 69 | t-unknown-third-party-host-static-ads-twitter-com | T | unknown third-party host static.ads-twitter.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 70 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 4/4 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.facebook.com" |
| 71 | t-unknown-third-party-host-rtb-csync-smartadserver-com | T | unknown third-party host rtb-csync.smartadserver.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 72 | t-unknown-third-party-host-ps-eyeota-net | T | unknown third-party host ps.eyeota.net | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 73 | t-unknown-third-party-host-analytics-twitter-com | T | unknown third-party host analytics.twitter.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 74 | t-unknown-third-party-host-www-redditstatic-com | T | unknown third-party host www.redditstatic.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 75 | t-unknown-third-party-host-static-oktopost-com | T | unknown third-party host static.oktopost.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 76 | t-unknown-third-party-host-okt-to | T | unknown third-party host okt.to | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 77 | t-unknown-third-party-host-simage2-pubmatic-com | T | unknown third-party host simage2.pubmatic.com | 3/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 78 | t-unknown-third-party-host-dsum-sec-casalemedia-com | T | unknown third-party host dsum-sec.casalemedia.com | 3/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 79 | t-unknown-third-party-host-chat-conversica-com | T | unknown third-party host chat.conversica.com | 2/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 80 | t-unknown-third-party-host-x-bidswitch-net | T | unknown third-party host x.bidswitch.net | 2/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 81 | t-unknown-third-party-host-www-google-com | T | unknown third-party host www.google.com | 1/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 82 | t-unknown-third-party-host-analytics-ahrefs-com | T | unknown third-party host analytics.ahrefs.com | 1/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 83 | t-unknown-third-party-host-app-convertful-com | T | unknown third-party host app.convertful.com | 1/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 84 | t-unknown-third-party-host-d-adroll-com | T | unknown third-party host d.adroll.com | 1/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 85 | t-unknown-third-party-host-pixel-config-reddit-com | T | unknown third-party host pixel-config.reddit.com | 1/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 86 | t-unknown-third-party-host-alb-reddit-com | T | unknown third-party host alb.reddit.com | 1/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 87 | v-video-hosted-player | V | video: hosted player | 4/4 | embed-passthrough | content | self | delivered-by-capture | media-as-url | none (player ids are public) | output already carries "play.vidyard.com" |
| 88 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 4/4 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 89 | v-video-youtube | V | video: YouTube | 2/4 | embed-passthrough | content | self | delivered-by-capture | media-as-url | none (player ids are public) | output already carries "www.youtube.com" |
| 90 | x-sign-in-account-links | X | sign-in / account links | 4/4 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 91 | chrome-drawer | M | header drawer: Menu (chrome only) | 1/1 | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 92 | chrome-menu | M | header menu: Countries & Regions, Ask, Products & Services Products & Services, Learn Learn, About About, Customers Customers (chrome only) | 1/1 | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 93 | chrome-search | S | header search: Search (chrome only) | 1/1 | index-backed | widget | self | pending | search-index-backed | none (results from the query index; overlay and typeahead per the contract) |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 20 row(s) — read-settings, settled-dom-snapshot, modal-loader, chrome-interaction, search-index-backed.
- **One owner decision batch:** 67 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · production backend (vendor form id + field mapping) · production endpoint; interim capture ships now · scope of the locale trees · index-driven or editorially curated?.
- **Already delivered by the capture pipeline:** 5 row(s) — no work.
- **Host-bound on the target:** 3 of 3 probed API paths — the off-origin data work.
- **Martech:** OneTrust · 0/4 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 41
- **detect** — 20
- **interactive** — 9
- **capture** — 7
- **listings** — 5
- **off-origin data** — 3
- **forms** — 2
- **media** — 2
- **locale wave** — 1
- **search** — 1
- **embeds** — 1
- **register** — 1
