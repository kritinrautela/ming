# CHAZEN Website Audit & 0→100 Improvement Roadmap

Reviewed: full Next.js codebase (`chazen-website/`) — 16 routes, 22 shared components, existing dev screenshots, brand bible, asset docs. No code changed. Method note: headless browser screenshots couldn't be generated in this environment (sandbox missing system libs, no sudo), so visual review used existing dev screenshots (flagged stale in places — see callouts) cross-checked against source code, which is ground truth for structure/logic/copy.

## Top findings before you read the tables

1. **~2,400 lines of unused, more brand-faithful code exist and are wired to nothing** (`ChazenHomeExperience.tsx` + 7 components + 3 data files). It implements Song Room video, Wisdom Collection, gaiwan ritual video, gift box photo — closer to the brand bible than what's actually live. Worth reviewing before writing anything new.
2. **Three of twelve brand chapters are built, good, and orphaned**: `/song-room`, `/stillness-mode`, `/tea-collection` have zero internal links anywhere in the live code. `/tea-collection` in particular reads as the most premium section on the whole site per screenshot review — nobody can reach it by clicking.
3. **Three incompatible color-token systems coexist** (brand bible hex ≠ `tailwind.config.ts` ≠ `globals.css` custom properties), and the configured display font (Cormorant Garamond) is never actually loaded — the site renders in fallback Georgia everywhere.
4. **Visible, user-facing placeholders ship live**: `/b2b`, `/tea-boxes`, `/tea-culture`, `/tea-ritual`, `/five-cups` print literal filenames as visible copy (e.g. "Future visual: b2b-corporate-gift-scene.webp") rather than hiding unfinished sections.
5. **No form on the site actually submits anywhere** except `InquiryForm` (which opens the user's email client, not a real backend) — the B2B enquiry form and homepage newsletter are static markup with no handler.
6. **Real, already-produced assets sit unused** while placeholder text ships instead: `chazen-song-diancha-v1.png`, `chazen-gift-box-v1.png`, `gaiwan-ritual.mp4`, `stillness-room.mp4`, `dian-cha.mp4`, `singing-bowl.mp3` are all in `public/` and referenced only by the dead code. This is the cheapest visual win available — reuse before requesting anything new.

---

## Section Scorecard

| # | Section | Current | Target | Priority | Visual Impact | Difficulty |
|---|---|---|---|---|---|---|
| 1 | Navigation & Site Architecture | 3 | 9 | High | Low | Medium |
| 2 | Design Tokens (color + type) | 3 | 9 | High | High | Medium |
| 3 | Component/Design-System Consistency | 3 | 8 | High | Medium | Hard |
| 4 | Live Placeholder Content | 2 | 9 | High | High | Medium |
| 5 | Forms & Conversion Wiring | 3 | 8 | High | Low | Medium |
| 6 | Dead Code / Orphaned Modules | — | — | Medium | — | Medium |
| 7 | Home — Hero | 5 | 9 | High | High | Medium |
| 8 | Home — Body Sections | 4 | 8 | High | High | Hard |
| 9 | Home — Footer / Newsletter | 2 | 8 | Medium | Low | Easy |
| 10 | About | 3 | 8 | Medium | Medium | Easy |
| 11 | AI Tea Guide | 3 | 7 | Medium | Low | Medium |
| 12 | B2B | 2 | 8 | High | High | Medium |
| 13 | Contact | 6 | 8 | Low | Low | Easy |
| 14 | Five Cups (+ cup detail pages) | 5 | 9 | Medium | High | Medium |
| 15 | Gift Box | 6 | 9 | High | High | Easy–Medium |
| 16 | Song Room | 4 | 9 | High | Medium | Easy |
| 17 | Stillness Mode | 4 | 9 | High | Medium | Easy |
| 18 | Tea Assessment / Tea Test (duplicate routes) | 5 | 9 | High | Medium | Medium |
| 19 | Tea Atlas | 5 | 8 | Medium | Medium | Medium |
| 20 | Tea Boxes | 3 | 8 | High | High | Medium |
| 21 | Tea Collection | 5* | 9 | High | High | Easy |
| 22 | Tea Culture | 4 | 8 | Medium | Medium | Medium |
| 23 | Tea Ritual | 4 | 8 | Medium | Medium | Easy |
| 24 | Accessibility (cross-cutting) | 6 | 9 | Medium | Low | Medium |
| 25 | Performance (cross-cutting) | 5 | 8 | Medium | Low | Medium |
| 26 | SEO / Share Readiness | 3 | 8 | Medium | Low | Easy |

\* Tea Collection content quality alone would score 8; scored 5 because it's currently undiscoverable (0 internal links).

---

## Detailed Findings

### 1. Navigation & Site Architecture — High / Low impact / Medium difficulty
- **Working:** Header, Footer, MobileNav are clean and accessible where used (`aria-expanded`, real `<button>`, keyboard-friendly).
- **Improve:** Only 6 of 16 routes appear in Header/Footer/home nav. `/song-room`, `/stillness-mode`, `/tea-collection` have zero internal links anywhere. `/tea-assessment` and `/tea-test` render the identical component (pick one). `/ai-tea-guide` unlinked. Home logo is `href="#"` (dead link). `TeaCollectionExperience`'s "Return to CHAZEN" link points to `#chapter-index`, an id that doesn't exist on the home page.

### 2. Design Tokens — High / High impact / Medium difficulty
- **Working:** Brand bible itself is well-specified and distinctive.
- **Improve:** Three separate, non-matching color systems in production simultaneously (brand bible hex vs. `tailwind.config.ts` vs. `globals.css` custom properties, the latter duplicated 3× in the file). `Cormorant Garamond` is declared in Tailwind config but never loaded via `next/font` or `<link>` — the site actually renders in fallback Georgia sitewide. Off-brand hardcoded hex appear ad hoc (`bg-[#e8decc]` on gift-box; a clay-red off by one digit in `InquiryForm`).

### 3. Component Consistency — High / Medium impact / Hard
- **Working:** Each individual system (Tailwind+SectionHeading, ChazenSubpage, ChapterHero+MotionReveal) is internally coherent.
- **Improve:** Four incompatible page-building systems coexist across 16 routes, plus a homepage with entirely custom CSS and its own local `SectionHeading` function that shadows (same name, different props than) the shared component. No visitor consciously notices "four systems," but it shows up as visible inconsistency in spacing, card styles, and motion between pages.

### 4. Live Placeholder Content — High / High impact / Medium difficulty
- **Improve:** `ChazenMediaPlaceholder` is a shared component used by every `ChazenSubpageHero` — meaning B2B, Tea Boxes, Tea Culture, Tea Ritual, and Five Cups *all* ship visible placeholder captions/filenames as real content, not dev comments. This reads as unfinished to any visitor, which is the opposite of the intended "quiet, precise, scholarly" tone.

### 5. Forms & Conversion Wiring — High / Low impact / Medium difficulty
- **Working:** `InquiryForm` (used on Contact, Gift Box, Tea Assessment CTAs) has real validation, honeypot spam field, `aria-live` status, and functions (via `mailto:`, since the site is a static GitHub Pages export with no backend).
- **Improve:** B2B enquiry form and home newsletter form have no `onSubmit`/handler at all — clicking submit does nothing. Given the static-export constraint, these need either a form service (Formspree/Getform-style) or the same `mailto:` pattern as `InquiryForm`.

### 6. Dead Code / Orphaned Modules — Medium priority
- `ChazenHomeExperience.tsx` (1,700 lines) + `SoundDock`, `StillnessPractice`, `TeaAtlasMap`, `TeaHistoryTimeline`, `TeaTableInteractive`, `VideoModal`, `MediaModal`, `FeatureBand`, plus `teaHistory.ts`/`teaObjects.ts`/`teaOrigins.ts` — zero imports from `src/app`, confirmed by grep. This is the only place the full 12-chapter structure is wired together, including a working interactive tea-table object glossary. Worth a deliberate decision: mine it for the live site, or delete it.

### 7. Home — Hero — High / High impact / Medium difficulty
- **Working:** Nav renders cleanly. Video hero (`chazen-home-hero.mp4`, 2.5MB, proper `autoPlay muted loop playsInline preload="metadata"`) is the largest/most-produced media asset on the site. An earlier dev pass (`director-pass`/`focused-final` screenshots) shows a genuinely premium, well-exposed hero photo with poetic copy ("One Cup. One Breath. One Return.") — proof the design has hit the target bar before.
- **Improve:** Current homepage copy ("Premium Chinese tea rituals, sound, and meaningful gifts for moments of return" + triple CTA row) reads more like fast-commerce marketing than the restrained tone in the brand bible, a regression from the earlier pass. Most recent dev screenshot (`premium-home-*`) renders as a near-black, textureless hero on both desktop and mobile — likely a stale/broken capture given the video-hero commit came after it, but needs a live re-check. Mobile screenshot shows hero copy ("...meaningful") clipped at the viewport edge — a real overflow bug worth confirming live.

### 8. Home — Body Sections — High / High impact / Hard
- **Improve:** The homepage currently re-teases nearly the entire site in sequence (five cups, tea-test teaser, exhibition cards, ritual steps, philosophy, history timeline, atlas teaser, tea boxes, membership tiers, B2B teaser, journal) — it's long and largely duplicates dedicated pages rather than a curated preview. The tea-test teaser shows a **hardcoded fake result** ("Current State: Overthinking / Restless...") regardless of the visitor — reads as deceptive personalization. Journal category chips all link to `/tea-atlas` regardless of category. Four different CTA labels point to the same quiz within one file. A membership-tier pricing section (Free/Community A$28/Premium A$38) exists only here with no corresponding page anywhere.
- **Working:** Content variety is genuinely rich; the raw material for a strong homepage is present, it just needs editing down and de-duplicating against dedicated pages.

### 9. Home — Footer / Newsletter — Medium / Low impact / Easy
- **Improve:** Newsletter form has no handler — submits nowhere. Footer repeats the same 6-route link set as Header (see Navigation).

### 10. About — Medium / Medium impact / Easy
- **Improve:** Three generic cards (Mission/Vision/Principle), zero images, thin for the chapter meant to be the "Brand House." Low difficulty to fix — mostly content + one hero image.

### 11. AI Tea Guide — Medium / Low impact / Medium difficulty
- **Improve:** Markets a conversational AI feature ("Cha, your AI Tea Guide") that doesn't exist — no chat interface, just static prompt cards. This is a brand-trust risk (over-promising) more than a visual one. Also unlinked from nav. Decide: build it, or reframe honestly as "coming soon."

### 12. B2B — High / High impact / Medium difficulty
- **Improve:** 5 separate visible placeholder blocks, a completely non-functional enquiry form (no handler), and zero real photography anywhere despite `chazen-gift-box-v1.png` existing unused. This is a named strategic pillar (corporate/settlement gifting) currently presented as the least finished page on the site.

### 13. Contact — Low / Low impact / Easy
- **Working:** The one fully functional form on the site. No significant issues found.

### 14. Five Cups (+ dynamic `[cup]` pages) — Medium / High impact / Medium difficulty
- **Working:** Best accessibility on the site — correct WAI-ARIA tabs pattern (`role="tablist"`, arrow-key nav, `aria-selected`). Strong bilingual copy tied to the Five Faculties (信精進念定慧).
- **Improve:** Visual layer is CSS-only bowl/steam shapes with the asset filename printed as visible caption text (e.g. `cup-faith-jian-zhan.webp` shown as literal text). Every cup page also injects the same hardcoded "A$25 First Pack" upsell regardless of which cup is being viewed.

### 15. Gift Box — High / High impact / Easy–Medium
- **Working:** Best-executed commerce page — real pricing, correct routing on CTAs, clear box-contents grid and ritual steps, no placeholders in the copy.
- **Improve:** The hero visual is pure CSS div soup (`.tea-box`, `.qr-card`, literal `<div>Ritual card</div>` text) despite `chazen-gift-box-v1.png` sitting unused in `public/images/`. One off-brand hardcoded background color. This is the actual purchase page — highest conversion stakes on the site — and cheapest to fix (swap in the existing image).

### 16. Song Room — High / Medium impact / Easy
- **Working:** Per screenshot, on-brand and restrained — pale ink-wash gifting-symbol cards (福/祿/壽), clean bilingual hierarchy. Dark curator-note section has good contrast.
- **Improve:** Zero internal links anywhere — completely unreachable except by typed URL. Reuses the same generic hero photo as Tea Atlas and Stillness Mode. `chazen-song-diancha-v1.png` exists and matches this chapter exactly but is unused. Quick win: link it + swap the hero image.

### 17. Stillness Mode — High / Medium impact / Easy
- **Working:** Genuinely interesting build — 60-second breath timer, mood-to-tea selector, a "strike the bowl" interaction.
- **Improve:** Also completely orphaned from navigation. The bowl-strike synthesizes a sine-wave tone in WebAudio instead of playing the real `singing-bowl.mp3` asset that already exists in `public/audio/`. Quick win: link it + use the real audio file.
- **Fixed:** Linked into nav, real audio wired in (see Phase 1/2). Also discovered while simplifying the visuals: every classname the component used (`stillness-room`, `stillness-stage`, `breath-orb`, `bowl-button`, `bowl-ripple`, `stillness-steam`, `mood-selector`, `tea-recommendation`) had zero matching CSS anywhere in `globals.css` — the whole interactive room was rendering completely unstyled in production. Rebuilt with a simpler layout and the brand palette (porcelain/ink/moss/clay) instead of the previous dark charcoal/gold theme, using existing shared classes (`button-primary`, `button-secondary`, `premium-card`, `museum-label`) instead of new bespoke CSS.

### 18. Tea Assessment / Tea Test — High / Medium impact / Medium difficulty
- **Working:** Well-built 15-question quiz, 5 Tea-Mind result types, good accessibility (`fieldset`/`legend`, `aria-live`).
- **Improve:** `/tea-assessment` and `/tea-test` are the identical component under two URLs — pick one and redirect the other. "Save My Result" button claims "Result Saved" but only copies to clipboard, no actual save/download. Screenshot shows a large near-black hero and mobile text/button clipping on this page specifically — worth a live re-check given it's a core personalization/conversion tool.

### 19. Tea Atlas — Medium / Medium impact / Medium difficulty
- **Working:** Per screenshot, restrained and on-brand — museum-caption tone, clean origin cards (e.g. Fujian Wuyi rock tea).
- **Improve:** The "map" is functionally just positioned buttons on a plain CSS shape, not real geography or illustration. Reuses the same generic hero image as Song Room / Stillness Mode.

### 20. Tea Boxes — High / High impact / Medium difficulty
- **Working:** Clear comparison table (4 SKUs × 6 attributes), consistent pricing with the rest of the site.
- **Improve:** A section literally titled "Visual placeholders" ships live, and box cards print "Future visual: [filename]" as visible card copy. Direct purchase-consideration page — worth prioritizing real product photography here.

### 21. Tea Collection — High / High impact / Easy
- **Working:** Richest, most premium-reading content on the site per screenshot — 8 teas with tasting notes, filter tabs, dynamic liquor-color swatches, real hero image with good alt text, disciplined museum-caption fields (DRY LEAF / PROCESS / TASTE / CULTURAL NOTE).
- **Improve:** Zero internal links from any live page — the best section on the site is invisible to visitors. One broken in-page anchor (`#chapter-index`). Minor: every tea card reuses the same abstract line-art icon, only recolored per category. This is your single highest-ROI, lowest-effort fix — just link it.

### 22. Tea Culture — Medium / Medium impact / Medium difficulty
- **Working:** Good 5-entry bilingual dynasty timeline (神農→唐→宋→明→modern).
- **Improve:** Every timeline card visibly prints "Future visual: [filename]" as content. Note: `chazen-song-diancha-v1.png` already exists and would cover the Song-dynasty entry directly.

### 23. Tea Ritual — Medium / Medium impact / Easy
- **Working:** Clear 6-step ritual structure (溫器/置茶/醒茶/聞香/出湯/慢飲) plus a "common mistakes" section.
- **Improve:** Ends with a visible "Media placeholders" section. `gaiwan-ritual.mp4` already exists in `public/video/` and is unused anywhere in live code — this is a direct, ready-to-use fix, no new asset needed.

### 24. Accessibility (cross-cutting) — Medium / Low impact / Medium difficulty
- **Working:** Several genuinely strong patterns — Five Cups tabs (best on site), MobileNav, InquiryForm, `MotionReveal`/`SectionIndexNav` both respect `prefers-reduced-motion` in JS, not just CSS.
- **Improve:** Quality is inconsistent because it tracks which of the 4 design systems a page uses rather than a sitewide standard. Substantive `alt` text exists on only 2 of the ~8 real photos in use.

### 25. Performance (cross-cutting) — Medium / Low impact / Medium difficulty
- **Working:** `next/image` used consistently wherever real photography exists — no raw `<img>` tags anywhere.
- **Improve:** Home page runs two persistent `requestAnimationFrame` loops (particle system + scroll-driven transform) that aren't coupled to `prefers-reduced-motion`. 4 of 5 produced video assets and the gift-box product image ship in `public/` but are never requested by any live route — pure dead weight in the deployed bundle.

### 26. SEO / Share Readiness — Medium / Low impact / Easy
- **Improve:** No Open Graph tags, no Twitter Card metadata, no favicon anywhere in the project — sharing a Chazen link shows no preview image and a blank browser tab icon. Home page also sets `document.title` in a `useEffect`, which fights with the Metadata API's title template.

---

## Image / Asset Review

### A — Reuse existing assets first (already produced, currently unused — no upload needed)

| File Name | Current Location | Recommended Use |
|---|---|---|
| `chazen-song-diancha-v1.png` (1672×941, PNG) | `public/images/`, unused | Song Room hero/content — matches the chapter directly |
| `chazen-gift-box-v1.png` (1672×941, PNG) | `public/images/`, unused | Gift Box hero — replace the CSS div mockup |
| `chazen-shanshui-chapter-2.png` (1672×941, PNG) | `public/images/`, unused | Philosophy section or Tea Atlas — differentiate from the reused generic `ChapterHero` image |
| `chazen-tea-table-topdown-v3.png` (1254×1254, PNG) | `public/images/`, unused | Tea Table object glossary, if revived from dead code |
| `gaiwan-ritual.mp4` (120KB) | `public/video/`, unused | Tea Ritual page — exact-match content, ready to embed |
| `dian-cha.mp4` (100KB) | `public/video/`, unused | Song Room whisking demonstration |
| `chazen-ritual-film.mp4` (156KB) | `public/video/`, unused | Ties to the "Watch Ritual Film" CTA seen in the earlier home draft |
| `stillness-room.mp4` (160KB) | `public/video/`, unused | Stillness Mode background/loop |
| `singing-bowl.mp3` | `public/audio/`, unused | Stillness Mode bowl-strike — replace the synthesized WebAudio tone |
| `tea-pour.mp3`, `boiling-water.mp3`, `garden-rain.mp3`, `bamboo-wind.mp3`, `temple-bell.mp3`, `tea-room-ambient.mp3` | `public/audio/`, unused | Ambient layer for Tea Ritual / Stillness Mode / Song Room if a sound-design pass is scoped |

Note: `gaiwan-ritual.mp4`, `dian-cha.mp4`, `chazen-ritual-film.mp4`, and `stillness-room.mp4` are all under 160KB — worth confirming they're final-quality footage and not early placeholder loops before relying on them as hero material.

### B — New assets needed (nothing to do yet — listed for when you're ready to generate/shoot and upload)

| File Name | Purpose | Aspect Ratio | Resolution | Format | Website Location | Description |
|---|---|---|---|---|---|---|
| `b2b-corporate-gift-scene.webp` | B2B hero | 16:9 | 1920×1080 | WEBP | `/b2b` hero | Corporate gifting scene with Chazen boxes |
| `b2b-settlement-gift.webp` | B2B section | 4:3 | 1600×1200 | WEBP | `/b2b` mid-page | Settlement/relocation gifting scenario |
| `b2b-custom-branding.webp` | B2B section | 4:3 | 1600×1200 | WEBP | `/b2b` mid-page | Custom-branded box detail |
| `cup-faith-jian-zhan.webp` … `cup-wisdom-jian-zhan.webp` (5 files) | Five Cups tab visuals | 1:1 | 1200×1200 | WEBP | `/five-cups`, `/five-cups/[cup]` | One jian zhan cup photo per Five Faculty (信精進念定慧) |
| `first-pack-mockup.webp`, `starter-tea-box-mockup.webp`, `lifetime-tea-box-mockup.webp` | Tea Boxes product shots | 4:3 | 1600×1200 | WEBP | `/tea-boxes` cards | Product photography per SKU |
| `culture-shennong.webp`, `culture-luyu-tea-classic.webp`, `culture-ming-loose-leaf.webp`, `culture-five-faculties.webp` | Tea Culture timeline | 4:3 | 1600×1200 | WEBP | `/tea-culture` timeline cards | One image per dynasty/era entry (Song entry already covered by existing asset A) |
| `tea-atlas-map.svg` | Tea Atlas base map | — | vector | SVG | `/tea-atlas` | Illustrated tea-origin map/landmass to replace the current plain CSS shape |
| `about-brand-house.webp` | About hero | 3:2 | 1800×1200 | WEBP | `/about` | Founder/workshop/brand-house imagery — page currently has zero images |
| `favicon.ico` + `og-default.png` | Browser tab + share preview | 1:1 / 1.91:1 | 512×512 / 1200×630 | ICO / PNG | site-wide `<head>` | Favicon and default Open Graph share image |

---

## Improvement Roadmap

### Phase 1 — Foundation
- [x] Consolidate the 3 conflicting color-token systems into one (brand bible hex as source of truth) across `tailwind.config.ts` and `globals.css` — added `seal` (#9f3f2f) and `charcoal` (#10120f) tokens that didn't exist before; `stone`/`leaf` left as-is (no brand-bible analog, not conflicting). All arbitrary `bg-[#...]`/`text-[#...]` hex classes replaced with tokens.
- [x] Load the configured display font (Cormorant Garamond) via `next/font`, plus Inter for the interface sans (also declared but unloaded) — wired into all 136 hardcoded `Georgia` declarations and the 1 hardcoded `Avenir Next` declaration in `globals.css` via CSS variables, so existing selectors now render the real fonts without needing 137 individual edits
- [x] Fix dead/broken links: home logo (`href="#"` → `/`), Tea Collection's `#chapter-index` anchor (→ `#entrance`) — `/tea-test` vs `/tea-assessment` duplication still open
- [x] Add Song Room, Stillness Mode, Tea Collection, and AI Tea Guide to primary navigation (Header, Footer, MobileNav via shared `navItems`/`footerItems`, plus the homepage's own inline nav+footer)
- [x] Wire up the B2B enquiry form (merged from `codex/site-wide-improvement-pass-1`, mailto to chazen24tz@gmail.com) and the homepage newsletter form (mailto to `site.email`) to actual submit actions
- [ ] Decide fate of the ~2,400-line orphaned `ChazenHomeExperience` module — mine it or remove it
- [x] Home page's `document.title` `useEffect` now mirrors the Metadata API's default English title exactly instead of a divergent hardcoded string, so it only diverges for the zh toggle state
- [x] Added favicon (`src/app/icon.svg`, `favicon.ico`, `apple-icon.png`, brand moon-gate mark); Open Graph and Twitter Card metadata merged from `codex/site-wide-improvement-pass-1`

### Phase 2 — Visual Design
- [x] Swap in existing unused real assets — song-diancha image (Song Room hero), gift-box image (Gift Box hero, replacing CSS mockup), gaiwan-ritual video (Tea Ritual hero), singing-bowl audio (Stillness Mode bowl-strike, replacing synthesized tone). `stillness-room.mp4` and `dian-cha.mp4` (used in Song Room's dian-cha exhibit, replacing an unstyled/invisible div block — found during this pass) also wired in. `chazen-ritual-film.mp4` still unused — no clear slot yet.
- [ ] Replace visible `ChazenMediaPlaceholder` instances (filenames printed as copy) on B2B, Tea Boxes, Tea Culture, Five Cups, and the 3 remaining Tea Ritual slots (cha-hai pour, five-cups grid, six-step animation) — these need real photography that doesn't exist yet, see Image Review table
- [x] Give Song Room / Tea Atlas / Stillness Mode distinct hero imagery instead of one reused generic photo (song-diancha, shanshui, tea-room-hero-v2 respectively)
- [x] Fix off-brand hardcoded colors (gift-box background → `bg-stone`, InquiryForm's off-by-one clay red `9f3d2f` → `9f3f2f`)
- [ ] Reconsider the single repeated tea-card icon in Tea Collection (recolored per category but not distinct)

### Phase 3 — UX
- [x] Merge `/tea-test` and `/tea-assessment` into one route — `/tea-test` is canonical (every nav/CTA site-wide already pointed there); `/tea-assessment` now client-redirects to it instead of duplicating the quiz component
- [x] Standardized CTA copy — all 4 homepage buttons linking to `/tea-test` now read "Start Tea Test" / 開始茶測試
- [x] Fixed mobile heading overflow risk on the Tea Test hero — `clamp()` minimum font size was large enough (4.2rem/67px) that long words could exceed the container width, and the ancestor's `overflow: hidden` was silently clipping instead of wrapping. Added `overflow-wrap`/`word-break` plus a tighter clamp under 640px to both `.assessment-hero-inner h1` and `.tea-mind-hero-inner h1`. Note: the specific clipped strings seen in the earlier screenshot audit ("PERSONAL TEA TEMPERAMENT", "profile coming soon") belong to an older version of this page's copy that no longer exists in the codebase — this fix addresses the underlying structural risk, not that exact (now-gone) text. Home hero overflow still unverified live.
- [x] Replaced the hardcoded fake "Current State" result on the homepage tea-test teaser with copy that clearly labels it as an example (was presented as if it were the visitor's own result). Journal category chips all linking to the same page is still open.
- [ ] Right-size the homepage — decide what's a true teaser vs. redundant duplication of dedicated pages
- [x] Fixed "Save My Result" — now actually downloads a `.txt` file of the result (matching its Download icon) in addition to copying to clipboard, so "Result Saved" is accurate

### Phase 4 — Animation
- [ ] Replace the hand-rolled scroll-jacking RAF loop on Home (430vh pinned wrapper) with the same restrained `MotionReveal` pattern used elsewhere
- [x] Coupled both home-page animation loops to `prefers-reduced-motion` — the ambient particle canvas is skipped entirely, and the scroll-tied reveal loop runs only on scroll/resize events instead of a persistent `requestAnimationFrame` loop
- [ ] Extend `MotionReveal`'s consistent easing to Home and the `ChazenSubpage` pages (currently used on only 3 of 16 routes)

### Phase 5 — Content
- [ ] About page: add real imagery and deepen the "Brand House" narrative
- [ ] AI Tea Guide: build the real feature or reframe copy honestly as "coming soon"
- [ ] Resolve the "$25 profile coming soon" placeholder messaging on Tea Assessment
- [ ] Replace the placeholder contact email (`hello@chazen.example`) with a real address
- [ ] Reconcile `CHAZEN_PREMIUM_ASSETS_NEEDED.md` and `GAIWAN_ASSETS_NEEDED.md` against what's actually in `public/` now — both docs are stale
