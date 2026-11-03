# Martech hand-off

Everything below is scaffolded **off**. To ship it, set `enabled: true` on `consent.cmp` and on each route in `stardust/martech-contract.json`, then re-run `deploy/scripts/martech-scaffold.mjs` and `dynamics/scripts/dynamics-check.mjs` to confirm the enabled tags load. Enabled tags load on `ansys.synopsys.com` only; preview with `?martech=on` (add `&consent=accept` to grant every category).

## Consent

- **CMP:** OneTrust · `data-domain-script` = `019fcb0a-3dc6-7e13-b07b-7b16394f3285`
- **Model `per-tag`:** the source loads the tag manager ungated and gates each tag inside it by consent group. Keep it: leave every route `category` null.
- **Categories:** no CMP configuration read — run `spec-martech.mjs` first, or decide categories with the owner.

## Routes

| id | vendor | src | CMP groups listing its host | enabled |
|---|---|---|---|---|
| adobe-launch | Adobe Launch | `https://assets.adobedtm.com/79b3942b8dfa/604ce2434de1/launch-2396cdda8e60.min.js` | — | false |
| google-tag-manager-1 | Google Tag Manager | `https://www.googletagmanager.com/gtag/js?id=G-T3YLKBRZ5S` | — | false |
| google-tag-manager-2 | Google Tag Manager | `https://www.googletagmanager.com/gtag/js?id=AW-1060031238` | — | false |
| google-tag-manager-3 | Google Tag Manager | `https://www.googletagmanager.com/gtag/js?id=AW-1022216734` | — | false |

Also seen, not routed (loaded by the tag manager or inline on the source — confirm each still fires): analytics: Google Analytics / Ads · marketing: Marketo Munchkin · marketing: ad / retargeting pixel.

## Rewrite before go-live

These read the old URLs or DOM and will not match the migrated pages:
- rule `RL0058caed2fdf48f6890c20a112cdab3b` cvent conversion - multi-die-auto-routing-wp — paths `/resources/multi-die-auto-routing-wp.html`
- rule `RL26b445074a5a477e8a12c42b50ecb4cf` Ansys - File Download Variables — selectors `a[href]`
- rule `RL2b87ac5296c4455bba38a5ec7422c2b8` cvent conversion - innovate-faster — paths `/multi-die-system/innovate-faster.html`
- rule `RL2f9dd9932c85454cb7f0d016a7f1bab3` CES Registration - Pageview thankyou — paths `/events/ces/register/thankyou.html`
- rule `RL5014c0fd6f8b4e13a55835c5afaa7fae` TheTradeDesk - Click - Silicon IP Form Submit DW — selectors `#form input`
- rule `RL5253bf7224a440249c330476bd363b22` TheTradeDesk - Click - Silicon IP DL Brochure DW — paths `/designware-ip/processor-solutions/arc-processors.html` — selectors `a`
- rule `RL56c327f9b9d0404cb5665da97921d11b` Intensify - Pageview thankyou — paths `/thankyou.html`, `/thank-you.html`
- rule `RL57e41e68052145b3b46bfcb981de6d1e` WebSDK - Set User Consent — paths `/page_login_timeout.html`
- rule `RL5903abff79e346af80b200c0f8c6f92d` ANSYS LEGACY - SimulationWorld - Register Now - Virtual Events Click — selectors `a#reg-button`
- rule `RL60fc47cf263c45a6956ffbe65772394b` cvent conversion - start-guide — paths `/multi-die-system/start-guide.html`
- rule `RL757f0f3aaa6c4e389e0b44a2d92d987a` Automitive eBook - Pageview thankyou — paths `/resources/navigating-software-defined-vehicle-development/thank-you.html`
- rule `RL7f9993f7bb6b461599e3e8372edf7309` Custom - Redirect with Identity — selectors `a[href]`
- rule `RLa84be48673134bc0b9746d39f5d8ef60` Google Ads - Pageview - Virtual Processing TY — paths `/blogs/chip-design/ai-software-testing-architectural-separation-reliable-results.html`
- rule `RLacd9749dc6914286afecc85010be8cb1` ANSYS LEGACY - Google AGI ODTK button pixel — selectors `div.hero__content>div> div.cta-group>a`
- rule `RLbcc0b4bd7372404b9df7e6f639340bce` TheTradeDesk - Click - Silicon IP Form Input DW — selectors `#form input`
- rule `RLc87c2190c5b84089a1bd40255310de3c` TheTradeDesk - Click - Silicon IP Arc Page DW — paths `/designware-ip/processor-solutions/arc-processors.html` — selectors `a`
- rule `RLd4c1054b5dbf4085912b7c05b4717695` Custom - Thank You Page Redirect — paths `/thankyou.html(\\?)?.*`, `/thank-you.html(\\?)?.*`, `/converge/livestream-2026/watch\\.html(\\?.*)?$`, `/converge/executive-forum-2025/watch.html(\\?.*)?$`, `/converge/executive-forum-2026/watch.html(\\?.*)?$`
- rule `RLd561ec325f8f47dfaa20822697f6eff5` ANSYS LEGACY - Google AGI STK button pixel — selectors `div.hero__content>div> div.cta-group>a`
- rule `RLf398f26059fc4b5abe365f99bb6ca749` TheTradeDesk - Click - Silicon IP Contact Sales DW — paths `/designware-ip/processor-solutions/arc-processors.html` — selectors `a`
- data element `ANSYS LEGACY MAIN - Custom Code: Search Tab` — selectors `atomic-tab[active]`, `atomic-tab-manager`
- data element `Custom - PDF Page View Event` — selectors `[id^=`
- data element `Solvnet - User Company Name` — selectors `div > c-analytics-user-detail`, `span[id*=`
- data element `DataLayer - Product Interests` — selectors `meta[name=`
- data element `ANSYS LEGACY - Core: Convertful Source` — selectors `div.conv_active.conv-widget`
- data element `Custom - Form ID` — selectors `form`
- data element `Custom - Tab Name` — selectors `.primary-nav-button[data-target=`
- data element `Custom - Form Provider` — selectors `.mktoForm, form[id^=`
- data element `Custom - Form Name` — selectors `.page-title`
- data element `Solvnet - User ID` — selectors `div > c-analytics-user-detail`, `span[id*=`
- data element `ANSYS LEGACY MAIN - Authenticated` — selectors `button.theavatar-loggedin`
- data element `ANSYS LEGACY MAIN - Custom Code: Search Term` — selectors `atomic-search-interface`
- data element `Custom - Client Type` — selectors `meta[name=`
- data element `Custom - Survey ID` — selectors `a.sg-b-l-m[href*=`
- data element `Custom - Blog Title` — selectors `h1.title`
- data element `Custom - Blog Publish Date` — selectors `.date`
- data element `Custom - Blog Author` — selectors `.blog-author span`

## Data layer

The source pages expose `adobeDataLayer`, `dataLayer`, `digitalData`; keep the same global names.
Adobe Launch rules fire on data-layer pushes; the migrated pages must push the same events: `formSuccess` (6) · `concierge:meeting-scheduled` (4) · `formPrefillSuccess` (3) · `concierge:open-modal` (2) · `concierge:close-confirm` (2) · `concierge:minimize` (2) · `page-view-dnb` (2) · `formInitiation` (1) · `formError` (1) · `form-view` (1) · `formStep` (1) · `page-view` (1) · `video_open` (1) · `video_25` (1) · `video_50` (1) · `video_75` (1) · `video_close` (1) · `video_90` (1) · `searchSortFilterAction` (1) · `searchResultsClicksAction` (1) · `searchPaginationClicksAction` (1) · `search` (1) · `nav-hover` (1) · `scroll` (1) · `click-link-solvnet` (1) · `concierge:impression` (1) · `concierge:close-request` (1) · `concierge:close-cancel` (1) · `concierge:hide-chatbar` (1) · `concierge:floating-icon-clicked` (1) · `concierge:resume-chatbar` (1) · `concierge:query:submitted` (1) · `concierge:response:completed` (1) · `concierge:link-clicked` (1) · `concierge:card_clicked` (1) · `concierge:citation_source_clicked` (1) · `concierge:promptSuggestion:clicked` (1) · `concierge:feedback:submitted` (1) · `concierge:error:occurred` (1) · `concierge:session-time` (1) · `concierge:citation_superscript_clicked` (1).
Data elements read these data-layer paths: `siteKnowledge.supportSiteSearch.searchType`, `company_name`, `_synopsys.forms.formProvider`, `_synopsys.web.webPageDetails.pageType`, `_synopsys.forms.formTypeDetail`, `_synopsys.forms.formName`, `_synopsys.videos.videoName`, `_synopsys.forms.formType`, `_synopsys.web.webInteraction.rightRailComponent`, `company_revenue`, `_synopsys.videos.videoTimeSpent.value`, `_synopsys.internalCampaign.campaignCode`, `siteKnowledge.supportSiteSearch.refinementType`, `siteKnowledge.supportSiteSearch.sortType`, `_synopsys.web.webPageDetails.solutionInterest.solutionInterest1`, `siteKnowledge.supportSiteSearch.nullInstances`, `_synopsys.internalSearch.searchHub`, `web.webInteraction.type`, `web.webPageDetails.name`, `_synopsys.web.webPageDetails.siteSubSection3`, `web.webInteraction.componentType`, `siteKnowledge.supportSiteSearch.refinementValue`, `_synopsys.videos.videoId`, `_synopsys.web.webPageDetails.product`, `company_size`, `siteKnowledge.supportSiteSearch.term`, `web.webInteraction.URL`, `web.webInteraction.linkName`, `_synopsys.surveys.surveyId`, `_synopsys.web.webPageDetails.siteName`, `_synopsys.forms.formStep`, `web.webPageDetails.siteSection`, `_synopsys.web.webPageDetails.articleAuthor`, `_synopsys.web.webPageDetails.articlePublishDate`, `_synopsys.web.webPageDetails.countryLanguage`, `web.webInteraction.componentName`, `_synopsys.forms.formID`, `_synopsys.videos.contentSegment`, `web.webInteraction.linkClicks.value`, `web.webInteraction.linkRegion`, `web.webPageDetails.isErrorPage`, `company_industry`, `domain`, `_synopsys.videos.videoTotalLength`, `_synopsys.videos.videoProvider`, `_synopsys.web.webPageDetails.siteSubSection2`, `_synopsys.web.webPageDetails.siteSubSection1`, `_synopsys.forms.formNameNew`, `web.webInteraction.fileTitle`, `_synopsys.web.webInteraction.linkLevel`, `siteKnowledge.supportSiteSearch.numberOfResults`.
Rules in Google Tag Manager were not parsed. Read each library listed in `martech/tags.json` and record its rules and data elements in the contract's `tagNotes`, keyed by tag manager, each citing where it was read (`from`); until then their triggers and events come from the tagging plan.
Ask the owner for the tagging plan (solution design reference): each event, its payload and the interaction that pushes it. With it, add each push in the block that owns the interaction.

- rule `RL15858b1b815a4c45a2c20ad0efe200ff` Google Ads - Pageview — listens for `concierge:meeting-scheduled`
- rule `RL17c93ffb557f453ca9b7aebc05836d27` Brand Concierge (BC) - Session Timer — listens for `concierge:open-modal`, `concierge:close-confirm`, `concierge:minimize`
- rule `RL1bf2125f51494bb7924c67166ad39340` WebSDK - Form Tracking — listens for `formInitiation`, `formError`, `formSuccess`, `formPrefillSuccess`, `form-view`, `formStep`
- rule `RL3c2ffb2ef1a949b5a9df134b061ce902` Bing - Form Submit (Synopsys) — listens for `formSuccess`, `formPrefillSuccess`
- rule `RL5b0acc1bcea04597a58744024d528290` WebSDK - Pageview - Error — listens for `page-view`
- rule `RL64f21ebdb0de4123afa6cbaa99573b37` OpenAI - Form Submit — listens for `formSuccess`
- rule `RL6c2eac447020495dabaf8747ff29c44a` Forms - Set UTM and DnB Fields — listens for `page-view-dnb`
- rule `RL741577f363124b0180a43399c18eb6eb` LinkedIn - Pageview (Ansys) — listens for `concierge:meeting-scheduled`
- rule `RL7c74ff055658407b9f5bf6f55bbed75c` WebSDK -\xa0Video Tracking — listens for `video_open`, `video_25`, `video_50`, `video_75`, `video_close`, `video_90`
- rule `RL868ea2439b52491393fd44e7b1573816` LinkedIn - Pageview (Synopsys) — listens for `concierge:meeting-scheduled`
- rule `RL9a4fd5f8b45f435d97c215a55410c0f5` WebSDK - Search - Filters — listens for `searchSortFilterAction`
- rule `RL9c2e0506bb104e21a1da48efd625e794` LinkedIn - Form Submit (Ansys) — listens for `formSuccess`
- rule `RLa42749b2463842e495c39d8100637f89` WebSDk - Search Result Click — listens for `searchResultsClicksAction`
- rule `RLa4d60e6f9c9743edb8d59903bf833b61` WebSDK - Search Pagination Click — listens for `searchPaginationClicksAction`
- rule `RLa84be48673134bc0b9746d39f5d8ef60` Google Ads - Pageview - Virtual Processing TY — listens for `concierge:meeting-scheduled`
- rule `RLb8cfe69a565f455284d7c1e108083df9` WebSDK - Search — listens for `search`
- rule `RLc787dcd2af0443eca9f7dd11470e4e0a` LinkedIn - Form Submit (Synopsys) — listens for `formSuccess`, `formPrefillSuccess`
- rule `RLea28f0a8c0b040d69b0ae548dac25a47` WebSDK - Target Decisioning Pre Fetch — listens for `page-view-dnb`
- rule `RLee0c5cfe6d1e4b418933249ae22e8d94` ANSYS LEGACY - Media Tags: Universal Form Submission (C0002) — listens for `formSuccess`
- rule `RLf12fcf70a7794f5692490fe5965627ec` WebSDK - Navbar Hover — listens for `nav-hover`
- rule `RLf4e55f5f159c4e37937fb152852252b6` WebSDK - Scroll — listens for `scroll`
- rule `RLfc9d421a22994b58b9fcb49d62265c9b` WebSDK - Component Click (Solvnet Temp) — listens for `click-link-solvnet`
- rule `RLfdf55e86a54d4a65bc47ba245e8b3fbd` WebSDK - Brand Concierge (BC) — listens for `concierge:impression`, `concierge:open-modal`, `concierge:close-confirm`, `concierge:close-request`, `concierge:close-cancel`, `concierge:minimize`, `concierge:hide-chatbar`, `concierge:floating-icon-clicked`, `concierge:resume-chatbar`, `concierge:query:submitted`, `concierge:response:completed`, `concierge:link-clicked`, `concierge:card_clicked`, `concierge:citation_source_clicked`, `concierge:promptSuggestion:clicked`, `concierge:feedback:submitted`, `concierge:error:occurred`, `concierge:session-time`, `concierge:citation_superscript_clicked`

## Web SDK (aem-martech)

The source runs the Adobe Experience Platform Web SDK from the Launch extension 2.38.0 (managed library, self-hosted build supported). The `aem-martech` plugin can load it on the migrated site instead. It is off; the routes above stay the default.

- **orgId:** `96E61CFE53295EF20A490D45@AdobeOrg` · **instance:** `alloy` · **edge domain:** `smetrics.synopsys.com`
- **datastreamId:** the Launch data element picks one of `d1b60f6b-909e-4efa-9b2e-f909e1628080`, `f4a7084d-6768-447f-b65e-c9f8afa3753a`, `2176cf9f-2ff5-45aa-9dae-6a6d24efd275`, `ea4980cc-9e09-4d81-8b60-5e60b99a4657`, `b6fcba23-df1c-4889-9f12-551793a32348`, `96f90a97-f187-4033-8eed-af1b12440d77`, `4e614e4a-8f05-4027-89b7-37558e8dfec9`, `9d60ac7e-06dc-4f23-b533-0717a7af979a` at runtime — choose one
- **defaultConsent:** source `pending`; the plugin defaults to `pending` and sends nothing until `updateUserConsent`. With `aemMartech.category` set, the scaffold starts the SDK `pending` whatever this value and grants `collect` once the CMP grants that group; without a category, this value applies as is. Launch rules that call `setConsent` on the source are not read — set the category to keep a consent gate.

To switch: (1) `git subtree add --squash --prefix plugins/martech https://github.com/adobe-rnd/aem-martech.git main`; (2) in Launch, set the Web SDK extension to the self-hosted build with the same instance name and publish — otherwise the SDK loads twice; (3) set `aemMartech.enabled` and leave the `adobe-launch` route disabled (the plugin loads `launchUrls`); (4) re-run the scaffold.

## Personalization (Target)

Target decisions come through the Web SDK (rules `RLea28f0a8c0b040d69b0ae548dac25a47` render them). To keep them: with `aemMartech` switched on, set `target.enabled` and re-run the scaffold. The plugin then fetches decisions in the eager phase and hides the page until they apply; check LCP and flicker on preview.
Also, at.js (Launch extension `adobe-target-v2`). Launch loads late on the migrated site, so above-the-fold activities apply late or flicker. `aem-martech` renders Target only through the Web SDK: moving the activities to the Web SDK is an owner project.
`target` stays off until then.
