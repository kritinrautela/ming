# Homepage Visual Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real per-cup photography to the homepage's Five Cups section, replacing the current text-only treatment, using 5 existing unused image files. Per
`docs/superpowers/specs/2026-07-22-homepage-visual-upgrade-design.md`.

**Architecture:** Static Next.js 15 site, no test framework. Verification is `npm run build` +
`npm run lint` + manual visual/browser check in `en` and `zh`.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS, plain CSS in `globals.css`, framer-motion.

## Global Constraints

- Only these 5 files may be referenced as new images: `cup-faith-jian-zhan.png`,
  `cup-effort-jian-zhan.png`, `cup-mindfulness-jian-zhan.png`, `cup-stillness-jian-zhan.png`,
  `cup-wisdom-jian-zhan.png` (all already in `public/images/`, confirmed unused elsewhere).
- No copy changes. No changes to the hero section (`src/app/page.tsx:277-331`) or any other
  homepage section. No changes to any other page.
- Existing behavior must be preserved: hover/focus `flex-grow` expansion on `.cz-cup`, the
  `.cz-cup-support` reveal-on-hover text, the CTA arrow-gap animation, `prefers-reduced-motion`
  handling (inherited from the existing `MotionReveal`-equivalent `reveal`/`stagger`/`fadeUp`
  pattern already on this page — do not touch that).
- Text contrast: the porcelain-on-dark text in each card must remain clearly readable over the
  new photo backgrounds at every viewport size.

---

### Task 1: Add per-cup background photography

**Files:**
- Modify: `src/app/page.tsx` (the `teaWorlds` array, ~lines 14-100+, and the Five Cups section
  JSX at lines 380-402)
- Modify: `src/app/globals.css` (`.cz-cup` and related selectors, lines 14484-14593)

**Interfaces:** None — this is a self-contained homepage section change, no shared component
signatures involved.

- [ ] **Step 1: Read the current `teaWorlds` array and Five Cups JSX in full**

Run: `sed -n '1,120p' src/app/page.tsx` to see the full `teaWorlds` array (5 objects: faith,
effort, mindfulness, stillness, wisdom, each with `key`, `title`, `english`, `copy`, `support`,
`cta`, `href`).

- [ ] **Step 2: Add an `image` field to each of the 5 `teaWorlds` entries**

For each entry, add an `image` property with the matching filename, keyed by the entry's existing
`key` field:
- `key: "faith"` → `image: "cup-faith-jian-zhan.png"`
- `key: "effort"` → `image: "cup-effort-jian-zhan.png"`
- `key: "mindfulness"` → `image: "cup-mindfulness-jian-zhan.png"`
- `key: "stillness"` → `image: "cup-stillness-jian-zhan.png"`
- `key: "wisdom"` → `image: "cup-wisdom-jian-zhan.png"`

Double-check each mapping against the entry's `key` field, not its position in the array — verify
key-to-filename correspondence explicitly rather than assuming array order matches this list.

- [ ] **Step 3: Render the image as a background layer inside each card**

In the Five Cups section JSX (`src/app/page.tsx`, inside the `.map((world, index) => ...)` that
renders `<motion.article className="cz-cup">`), add an image layer as the first child inside
`.cz-cup-link`, before the existing `<span className="cz-cup-index">`:

```tsx
<Image
  src={withBasePath(`/images/${world.image}`)}
  alt=""
  fill
  sizes="(min-width: 1024px) 20vw, 100vw"
  className="cz-cup-photo"
/>
<div className="cz-cup-veil" aria-hidden="true" />
```

`alt=""` is correct here (not a mistake to fix) — the photo is decorative background context for
a card whose heading/copy already convey the same meaning in text; an empty alt avoids redundant
screen-reader announcements, matching how `.cz-hero-image`'s sibling `.cz-hero-veil` pattern
already treats decorative overlay layers on this same page. `Image` is already imported at the
top of `src/app/page.tsx` — do not add a duplicate import.

- [ ] **Step 4: Add CSS for `.cz-cup-photo` and `.cz-cup-veil`, and make `.cz-cup-link` a
  positioning context**

In `src/app/globals.css`, near the existing `.cz-cup-link` rule (~line 14502), add:

```css
.cz-cup-photo {
  z-index: 0;
  object-fit: cover;
  transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

.cz-cup-veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, rgba(14, 16, 13, 0.55) 0%, rgba(14, 16, 13, 0.55) 40%, rgba(14, 16, 13, 0.92) 100%);
  pointer-events: none;
}

.cz-cup:hover .cz-cup-photo,
.cz-cup:focus-within .cz-cup-photo {
  transform: scale(1.04);
}
```

Then update `.cz-cup-link` (existing rule, ~line 14502-14512) to add `z-index: 2` to its content
so it stacks above the new photo/veil layers — every existing direct child of `.cz-cup-link`
(`.cz-cup-index`, `.cz-cup-char`, `h3`, `strong`, `p`, `.cz-cup-support`, `.cz-cup-cta`) already
renders in DOM order after the two new elements, so with `.cz-cup-link { position: relative }`
(already present) and the new elements at `z-index: 0`/`1`, no further z-index change to the text
elements should be needed — but verify this visually in Step 7 and add `z-index: 2` to
`.cz-cup-link`'s existing children only if the photo/veil visually cover the text.

Do not modify `.cz-cup-char`'s existing `z-index`-less absolute positioning — verify in Step 7
whether the decorative watermark character still reads correctly on top of a photo (it may need
its opacity or position adjusted if it now looks wrong over real photography rather than the
plain dark background it was designed for); if so, that's an expected follow-up to note in your
report, not something to guess a fix for blindly — try one adjustment (e.g., increasing
`.cz-cup-char`'s opacity slightly for visibility against varied photo backgrounds) and describe
what you changed and why.

- [ ] **Step 5: Verify all 5 image-to-cup mappings are correct**

Run: `grep -n "key:\|image:" src/app/page.tsx | grep -A1 "faith\|effort\|mindfulness\|stillness\|wisdom"`
(or simply re-read the edited `teaWorlds` array) and manually confirm each `key`/`image` pair
matches the Step 2 mapping exactly.

- [ ] **Step 6: Build check**

Run: `npm run build`
Expected: exits 0, `/` (home) in route output, no new warnings.

- [ ] **Step 7: Visual check**

Run `npm run dev`, open `/` in a browser, scroll to the Five Cups section. Confirm:
- All 5 cards show a real photo background (not broken image icons).
- Each card's photo is plausible for its cup (you don't need the exact right photo memorized —
  just confirm images differ from each other, i.e. it's not the same image repeated 5 times,
  which would indicate a mapping bug).
- Heading, body copy, and CTA text are clearly readable over every photo (check the darkest and
  lightest-looking photos specifically, since a single gradient overlay may work better on some
  photos than others).
- Hover/focus on a card still triggers the existing `flex-grow` expansion and reveals the
  `.cz-cup-support` text, and now also anything from the Step 4 hover photo-scale effect — confirm
  it feels smooth, not jarring.
- Toggle to `zh` and confirm nothing about the text layout broke (longer/shorter CJK text over the
  same photo backgrounds).
- Check `prefers-reduced-motion` (browser/OS setting, or devtools emulation) still suppresses the
  entrance animation as it did before this change — this task didn't touch that logic, but confirm
  it wasn't accidentally affected.

If text legibility fails on any card, strengthen the gradient in `.cz-cup-veil` (increase the
opacity values) rather than changing text color — the porcelain-on-dark text color is a sitewide
convention on this page, don't diverge from it for one section.

- [ ] **Step 8: Commit**

```bash
git add src/app/page.tsx src/app/globals.css
git commit -m "Add real per-cup photography to homepage Five Cups section

Five matching product photos (cup-faith/effort/mindfulness/stillness/wisdom-jian-zhan.png)
existed in public/images/ but were never rendered anywhere on the live site.
This replaces the previous text-only card treatment (a single decorative
character, no photo) with the real photography behind a dark gradient veil,
keeping all existing text, hover behavior, and motion unchanged."
```

---

### Task 2: Final verification

**Files:** None modified — verification only.

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: exits 0, all routes listed, no warnings introduced by this plan's change.

- [ ] **Step 2: Full lint**

Run: `npm run lint`
Expected: exits 0.

- [ ] **Step 3: Confirm scope**

Run: `git diff --stat` against this branch's starting point and confirm only `src/app/page.tsx`
and `src/app/globals.css` changed — no other file.

- [ ] **Step 4: Push branch and open a draft PR**

```bash
git push -u origin HEAD
gh pr create --draft --title "Homepage: add real photography to Five Cups section" --body "$(cat <<'EOF'
## Summary
- The Five Cups homepage section previously showed only a large decorative character per card, no photography
- 5 matching product photos already existed in public/images/ but were never rendered anywhere (confirmed via grep — referenced only as inert data in fiveCupsData.ts, never read by any live component)
- Added them as card background photography with a dark gradient veil, preserving all existing text, hover/focus behavior, and motion

See docs/superpowers/specs/2026-07-22-homepage-visual-upgrade-design.md for full rationale, including why a hero image swap was considered and dropped (no unused hero-appropriate photo exists — every candidate is already in use on another page).

## Test plan
- [x] npm run build passes
- [x] npm run lint passes
- [x] Manual visual check: all 5 cards show distinct, correctly-matched photos, text legible in en + zh, hover/focus behavior intact

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
