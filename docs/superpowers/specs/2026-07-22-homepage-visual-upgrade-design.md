# Homepage Visual Upgrade — Design Spec

Date: 2026-07-22

## Context

Following the design-consistency pass (merged in PR #16), the site owner asked for a visible
upgrade to the homepage specifically — the earlier pass was intentionally invisible (token/motion
consistency fixes only). This pass should produce a real, noticeable improvement without a new
photo shoot: `public/images/` already contains high-quality, unused product photography.

Verified against current code (not the stale 2026-07-15 audit):
- The current hero copy ("One cup. One breath. One return.") is already restrained and on-brand —
  the audit's complaint about "fast-commerce marketing" copy referred to an older, since-replaced
  version. **No copy changes are in scope for this pass.**
- Tea Test, Culture, Ritual, and Gift Box homepage sections already use real photography
  (`chazen-tea-table-topdown-v3.jpg`, `chazen-shanshui-chapter-2.jpg`, `chazen-song-diancha-v1.jpg`,
  `chazen-gift-box-packaging-real.png`) — not touched by this pass.
- The hero (`src/app/page.tsx:277-331`) uses `chazen-hero-gongfu-room-v3.jpg`. Every other
  "unused" scene photo checked (`chazen-gongfu-pour-v2.png`, `chazen-first-evening-gaiwan.png`,
  `chazen-blue-white-porcelain-set.png`, `chazen-garden-bamboo-tea.png`, `chazen-tea-collection-v1.jpg`,
  etc.) turns out to already be in use on another page (b2b, tea-ritual, tea-collection, tea-boxes).
  Reusing any of them for the homepage hero would create duplicate imagery across pages, which
  undercuts distinctiveness rather than helping it. **The hero image swap is dropped from scope** —
  the current hero photo is a real, solid photo, not a placeholder, and there's no better unused
  candidate. Hero is untouched by this pass.
- The Five Cups section (`src/app/page.tsx:361-403`, cards styled at `src/app/globals.css:14479-14593`)
  currently shows only a large low-opacity decorative Chinese character (`.cz-cup-char`) per card,
  no photography. Five matching, unused, correctly-named photos exist:
  `cup-faith-jian-zhan.png`, `cup-effort-jian-zhan.png`, `cup-mindfulness-jian-zhan.png`,
  `cup-stillness-jian-zhan.png`, `cup-wisdom-jian-zhan.png` — one per cup, in the same order as
  the existing `teaWorlds` data array (`src/app/page.tsx`, keys: faith, effort, mindfulness,
  stillness, wisdom).

## Goal

Make the homepage visibly more premium using only existing, genuinely-unused assets: real product
photography on the Five Cups section, currently the most abstract/least tangible section on the
page (a large decorative character, no photo, per card). No copy, layout structure, hero, or route
changes.

## Scope

### 1. Five Cups: add real per-cup photography
Each `teaWorlds` entry (`src/app/page.tsx`, 5 objects: faith/effort/mindfulness/stillness/wisdom)
gets a new `image` field pointing to its matching `cup-*-jian-zhan.png` file. The `.cz-cup-link`
card (`src/app/globals.css:14502-14512`) gains a background photo treatment matching the hero's
existing image+veil pattern:
- The photo sits behind the existing content as a `background-image` (or an absolutely-positioned
  `<Image fill>` behind the text, consistent with how `.cz-hero-image`/`.cz-hero-veil` are layered
  at `globals.css:14326-14339`) — a dark gradient overlay on top ensures the existing porcelain-on-dark
  text remains readable at the same contrast it has today.
- The existing `.cz-cup-char` decorative watermark, `.cz-cup-index` step number, heading, copy,
  hover-reveal support text, and CTA link are all unchanged in content and behavior — this is a
  background layer added behind them, not a card redesign.
- The existing hover interaction (`flex-grow: 1.75` on hover/focus) is unchanged.

### 2. Explicitly out of scope
- No hero image change (see Context — no safe unused candidate exists).
- No copy changes anywhere on the homepage (verified current hero/section copy is already on-brand).
- No changes to any other homepage section (manifesto, tea test, culture, ritual, gift box, journal).
- No changes to any other page.
- No new photography — only the 5 existing, confirmed-unused `cup-*-jian-zhan.png` files.
- No layout/structural changes beyond adding the background-photo layer to the cup cards.

## Verification

- `npm run build` succeeds with no new errors/warnings.
- Manual visual check: each of the 5 cup cards shows its correct matching photo (faith→faith,
  effort→effort, etc. — no mismatches); text remains legible against the photo background at the
  same contrast as today; hover/focus interaction still works; `prefers-reduced-motion` still
  respected.
- Both `en` and `zh` language states checked — no copy changed, so this confirms nothing broke.
- Hero section (`src/app/page.tsx:277-331`) unchanged — confirm the diff doesn't touch it.
