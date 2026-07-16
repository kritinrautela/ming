# Chazen "Ink & Ember" Redesign Brief

Direction: Song-dynasty scholar's studio meets contemporary editorial. Deep-ink immersive
chapters alternating with warm grained paper, vertical CJK accents, seal-red stamp marks,
brass hairlines, full-bleed imagery, calm spring-physics motion. Conservative, quiet luxury —
never loud, never promotional.

## Tokens (already in :root of globals.css — use these, never invent colors)

- `--cz-ink #171713`, `--cz-charcoal #10120f` (dark sections use `#0e100d`/`#14110c` bases)
- `--cz-porcelain #fbfaf6`, `--cz-paper #f6f1e7`, `--cz-ivory #f2eadc`, `--cz-stone #d8d0c2`
- `--cz-moss #3f5945`, `--cz-leaf #203a2b` (primary buttons)
- `--cz-clay #6f4a32`, `--cz-brass #9d8150`, `--cz-brass-bright #c8a765` (accents, hairlines)
- `--cz-seal #9f3f2f` — tiny accents only (step numbers, eyebrow dots). Never large fills.
- `--cz-serif` = Cormorant Garamond + Noto Serif TC (CJK). Sans = Instrument Sans (default).

## Typography rules

- Display headings: serif, weight 300–400, `letter-spacing -0.01em`, `line-height 1.05–1.1`,
  `text-wrap: balance`. Section h2 ≈ `clamp(2rem, 4vw, 3.4rem)`. Never bold serif display.
- Eyebrows: 0.72rem, 600 weight, `letter-spacing 0.2em`, uppercase, with a small rotated
  square seal-red dot (see `.chazen-subpage-eyebrow::before` / `.cz-mark`).
- Body: 0.9–1rem, `line-height 1.7`, max width ~54–62ch, ink at 55–68% opacity.
- Numbers (step counts, prices): `font-variant-numeric: tabular-nums`.
- Chinese text: always `lang="zh-Hant"`; big CJK glyphs as low-opacity brass watermarks are a
  signature motif (see `.cz-cup-char`, `.chazen-subpage-cta::after`).

## Surfaces & layout

- Light sections: `--cz-paper` / `--cz-porcelain` / `--cz-ivory` alternation; soft radial
  `rgba(216,208,194,…)` washes; no pure white, no pure black.
- Dark sections: `#0e100d` with a moss radial glow
  (`radial-gradient(110% 90% at 88% 0%, rgba(63,89,69,0.28), transparent 55%)`).
- Cards: NO full borders. Brass top hairline (`border-top: 1px solid rgba(157,129,80,0.35)`),
  porcelain surface, tinted clay shadow `rgba(111,74,50,…)`, hover `translateY(-4px)`.
- Border-radius: 2px everywhere (buttons, cards, images). No pill buttons.
- Prefer editorial layouts over equal card grids: numbered index lists with hairline dividers
  (see `.cz-culture-index`), 2-col zig-zags, asymmetric splits (1.05fr/1fr), full-bleed images.
- Avoid 4-up card rows that orphan into 4+2; use 3×2 numbered lists with `border-top` hairlines.

## Interaction

- Transitions 200–300ms, ease `cubic-bezier(0.22, 1, 0.36, 1)`. Hover: lift/underline-grow/
  arrow-shift (gap grows 0.45→0.7rem). Active: `scale(0.98)`.
- Buttons: use existing `.button-primary`, `.button-secondary`, `.button-light`, `.button-ghost`,
  `.chazen-subpage-button(-primary)` — already styled; do not restyle them.
- Text links: bottom hairline + arrow, see `.cz-text-link`.
- Respect `prefers-reduced-motion`. framer-motion is available (use `whileInView`,
  `viewport={{ once: true }}`, stagger 0.09s, y: 24–30, duration ~0.9).
- Every interactive element needs a visible hover state and must keep focus-visible outlines.

## Imagery (in /public/images, use via `withBasePath("/images/…")` + next/image)

chazen-hero-gongfu-room-v3.png, chazen-tea-room-hero-v2.png, chazen-tea-table-topdown-v3.png,
chazen-shanshui-chapter-2.png, chazen-song-diancha-v1.png, chazen-tea-collection-v1.png,
chazen-gift-box-v1.png, chazen-arrival-room.avif. Reuse freely; darken with ink gradient veils
when text sits on top. Always meaningful `alt` in both languages via `t()`.

## Content rules

- Bilingual EVERYWHERE via `useLanguage()`'s `t(en, zh)` — never drop existing zh strings.
- Keep existing copy meaning; you may tighten EN phrasing. Sentence case headings ("The ritual
  before the tea", not Title Case). No exclamation marks, no "elevate/seamless/unleash".
- Never invent prices or product claims not already in the code.

## Hard constraints

- DO NOT edit: globals.css, tailwind.config.ts, src/app/layout.tsx, src/app/page.tsx,
  Header.tsx, Footer.tsx, ChazenSubpage.tsx, ChapterHero.tsx, SectionHeading.tsx,
  MotionReveal.tsx, lib/*. New styles → CSS Modules co-located with your pages, or Tailwind
  utilities. Reuse existing `chazen-subpage-*` and button classes wherever possible.
- Do not add dependencies, do not restart the dev server (already at localhost:3000).
- Preserve all routes, hrefs, ids, form behavior, and data flows.
