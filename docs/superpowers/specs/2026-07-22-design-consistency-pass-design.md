# Design Consistency Pass — Design Spec

Date: 2026-07-22

## Context

`docs/chazen-website-audit-roadmap.md` (2026-07-15) identified that the site's
16+ routes are built on four incompatible page-building systems, causing
visible drift in spacing, card styles, and motion. Much of that audit's
Phase 1 (color tokens, fonts, nav links) is already merged. This pass targets
the remaining structural inconsistency.

Verification against current code (not the week-old audit) found:

- The motion system is **not** actually inconsistent: the homepage's local
  `fadeUp`/`stagger` framer-motion variants (duration 0.9, cubic-bezier
  `[0.22, 1, 0.36, 1]`, `staggerChildren: 0.09`) already match the shared
  `MotionReveal` component's spec almost exactly. This is code duplication,
  not a visible bug — out of scope.
- Real drift exists in `globals.css`: `border-radius: 999px` (pill shapes)
  and organic blob shapes appear despite `docs/REDESIGN_BRIEF.md` mandating
  `2px` border-radius everywhere and "no pill buttons."
- Of 22 routes, 8 already use the shared `ChazenSubpage` component system
  (b2b, tea-boxes, tea-culture, tea-ritual, five-cups, five-cups/[cup]) —
  no work needed there.
- Home, gift-box, tea-collection, and tea-test are bespoke, high-quality
  pages per the audit ("best-executed... on the site"). Forcing them onto
  the generic `ChazenSubpage` template would flatten their distinctiveness
  — the opposite of the goal. They should stay bespoke but be checked
  against brand-bible tokens/rules.
- `/about` is the only page in this tier that is genuinely thin (plain
  content, no bespoke layout, zero scroll motion) — it's the one real
  migration candidate.
- `/tea-assessment` already redirects to `/tea-test` (audit Phase 3, done).

## Goal

Make the site read as one considered system rather than pages built at
different times, without homogenizing pages that already have earned,
distinctive layouts.

## Scope

### 1. Brand-bible compliance audit + fix
Pages: `/` (home), `/gift-box`, `/tea-collection` (`TeaCollectionExperience.tsx`),
`/tea-test` (`TeaAssessmentExperience.tsx`).

For each page, check against `docs/REDESIGN_BRIEF.md`:
- Border-radius is `2px` on buttons/cards/images (no pill buttons, no
  arbitrary organic-blob radii).
- Cards use a brass top hairline (`border-top: 1px solid rgba(157,129,80,0.35)`),
  not a full border.
- Numbers (prices, step counts) use `font-variant-numeric: tabular-nums`.
- Headings are sentence case, serif weight 300–400, no bold serif display.
- No off-brand hardcoded hex colors — use the token set in
  `tailwind.config.ts` / `globals.css` `:root`.
- Buttons reuse `.button-primary` / `.button-secondary` / `.button-light` /
  `.button-ghost` rather than one-off styles.

Fix violations in place (CSS module or the relevant `globals.css` selector
for that page). Layout structure, copy, and images are unchanged — this is
a token/style-detail pass, not a rebuild.

### 2. Migrate `/about` onto `ChazenSubpage`
Replace the current standalone `.section`/`.container` + `about.module.css`
structure with:
- `ChazenSubpageHero` for the intro (eyebrow "Our story" / title / lead copy
  — content taken verbatim from the current `SectionHeading` props).
- `ChazenContentSection` for the story text block and the three pillar
  cards (content unchanged).
- `ChazenCtaBand` for the closing mission panel's two CTAs
  (`/tea-test`, `/b2b` — hrefs and labels unchanged).

All existing copy (EN + ZH), images, and links carry over exactly — this is
a structural swap onto shared components, not a content rewrite. The page
gains the scroll-reveal motion (`MotionReveal`, baked into `ChazenSubpage`)
it currently entirely lacks. `about.module.css` is deleted once nothing
references it.

### 3. Explicitly out of scope
- `ChazenHomeExperience.tsx` (orphaned 2,400-line module) — separate decision,
  not touched.
- Legal/utility pages (privacy, terms, faq, contact, shipping-returns) —
  already functional, low visual-impact, not touched.
- five-cups, b2b, tea-boxes, tea-ritual, tea-culture — already on
  `ChazenSubpage`, not touched.
- No new photography, copy changes, or product claims — per
  `docs/REDESIGN_BRIEF.md`'s hard constraints.
- Homepage's locally-duplicated motion variants are left as-is (functionally
  equivalent to `MotionReveal`; deduplicating is a code-cleanliness nice-to-have,
  not a visible fix, and risks touching the highest-traffic page's tested code
  for no user-facing benefit).

## Verification

- `npm run build` (static export) succeeds with no new errors/warnings.
- Manual visual check of each touched page (home, gift-box, tea-collection,
  tea-test, about) in a local dev/branch preview, both `en` and `zh` language
  states.
- All existing routes, hrefs, and ids unchanged (`/about` keeps its URL and
  external links to it keep working).
- No bilingual string dropped — every `t(en, zh)` pair from the original
  `/about` page is present in the migrated version.
- Diff review confirms only style/structure changed on the four audited
  pages — no copy or data changes.
