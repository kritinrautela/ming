# Design Consistency Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix brand-bible token drift on the site's four bespoke pages (home, gift-box, tea-collection, tea-test) and migrate `/about` onto the shared `ChazenSubpage` component system, per `docs/superpowers/specs/2026-07-22-design-consistency-pass-design.md`.

**Architecture:** This is a static Next.js 15 site (`next build`, no server, exported for GitHub Pages) with no unit test framework. Verification is `npm run build` + `npm run lint` (both must exit 0) plus a manual visual check in `npm run dev` for `en` and `zh` language states, per task. No new dependencies, no new test infra — none of that is in the approved spec.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS, CSS Modules, framer-motion.

## Global Constraints

- Brand tokens are defined once in `src/app/globals.css:11-22` (`--cz-ink #171713`, `--cz-charcoal #10120f`, `--cz-porcelain #fbfaf6`, `--cz-paper #f6f1e7`, `--cz-ivory #f2eadc`, `--cz-moss #3f5945`, `--cz-leaf #203a2b`, `--cz-clay #6f4a32`, `--cz-brass #9d8150`, `--cz-brass-bright #c8a765`, `--cz-seal #9f3f2f`, `--cz-stone #d8d0c2`) — use these, never a new hardcoded hex.
- Border-radius is `2px` on buttons/cards/images (no pill buttons, no arbitrary radii) — decorative micro-elements matching an explicitly documented brand motif (e.g. the rotated-square eyebrow dot) are exempt.
- No new photography, copy changes, product claims, or price changes — content is byte-for-byte preserved on every touched page.
- No dependency changes, no new test framework — verification uses only `npm run build` / `npm run lint` / manual dev-server check, all already in `package.json`.
- Do not touch: `ChazenHomeExperience.tsx` and its 7 dependent components/3 data files, `/privacy`, `/terms`, `/faq`, `/contact`, `/shipping-returns`, or any page already on `ChazenSubpage` (`/b2b`, `/tea-boxes`, `/tea-culture`, `/tea-ritual`, `/five-cups`, `/five-cups/[cup]`).
- Preserve every existing route, href, and `id` exactly. `/about`'s URL does not change.
- Every bilingual `t(en, zh)` string pair present before a task must be present after it — verify by diffing extracted strings, not just eyeballing.

---

### Task 1: Fix gift-box.module.css token drift

**Files:**
- Modify: `src/app/gift-box/gift-box.module.css:53,84,119`

**Interfaces:** None — pure CSS value swap, no class names or markup change.

- [ ] **Step 1: Read the current values to confirm line numbers haven't shifted**

Run: `grep -n "9f3f2f\|fbfaf6" src/app/gift-box/gift-box.module.css`
Expected output includes three lines matching:
```
53:  color: #9f3f2f;
84:  color: #9f3f2f;
119:  background: #fbfaf6;
```
If line numbers differ, use the grep output's actual line numbers for Step 2.

- [ ] **Step 2: Replace hardcoded hex with the matching brand token**

At line 53, change:
```css
  color: #9f3f2f;
```
to:
```css
  color: var(--cz-seal);
```

At line 84, apply the identical change (same selector pattern, second occurrence).

At line 119, change:
```css
  background: #fbfaf6;
```
to:
```css
  background: var(--cz-porcelain);
```

- [ ] **Step 3: Verify no hardcoded brand-color hex remains in this file**

Run: `grep -n "#9f3f2f\|#fbfaf6" src/app/gift-box/gift-box.module.css`
Expected: no output (empty).

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: exits 0, `/gift-box` listed in the route output, no new warnings mentioning `gift-box`.

- [ ] **Step 5: Visual check**

Run `npm run dev`, open `/gift-box` in both `en` and `zh` (use the language toggle in the header). Confirm the seal-red text and porcelain background render identically to before the change (token values are byte-identical to the hex they replaced, so there must be zero visible difference).

- [ ] **Step 6: Commit**

```bash
git add src/app/gift-box/gift-box.module.css
git commit -m "Use brand tokens instead of hardcoded hex on gift-box page"
```

---

### Task 2: Fix TeaCollectionExperience.module.css token and radius drift

**Files:**
- Modify: `src/components/TeaCollectionExperience.module.css:22,148`

**Interfaces:** None — pure CSS value swap.

- [ ] **Step 1: Confirm current line numbers**

Run: `grep -n "border-radius: 3px\|#9f3f2f" src/components/TeaCollectionExperience.module.css`
Expected:
```
22:  border-radius: 3px;
148:  color: #9f3f2f;
```

- [ ] **Step 2: Fix the scrollbar-thumb radius**

At line 22 (selector `.tea-scroll-gallery::-webkit-scrollbar-thumb`), change:
```css
  border-radius: 3px;
```
to:
```css
  border-radius: 2px;
```

- [ ] **Step 3: Fix the hardcoded seal-red category label**

At line 148 (selector `.tea-leaf-copy > span`), change:
```css
  color: #9f3f2f;
```
to:
```css
  color: var(--cz-seal);
```

- [ ] **Step 4: Verify no hardcoded seal hex remains**

Run: `grep -n "#9f3f2f" src/components/TeaCollectionExperience.module.css`
Expected: no output.

- [ ] **Step 5: Build check**

Run: `npm run build`
Expected: exits 0, `/tea-collection` listed in route output, no new warnings.

- [ ] **Step 6: Visual check**

`npm run dev`, open `/tea-collection`, confirm the tea-leaf card category labels (e.g. "DRY LEAF") still render seal-red, and the horizontal scroll gallery's scrollbar thumb looks unchanged (1px radius difference is not visible at this size).

- [ ] **Step 7: Commit**

```bash
git add src/components/TeaCollectionExperience.module.css
git commit -m "Use brand tokens and 2px radius convention on Tea Collection"
```

---

### Task 3: Fix TeaAssessmentExperience.module.css token drift

**Files:**
- Modify: `src/components/TeaAssessmentExperience.module.css:130,186,275,345`

**Interfaces:** None — pure CSS value swap. Do NOT touch line 632 (`border-radius: 1px` on the rotated-square eyebrow dot `::before`) — that's the brand bible's documented seal-dot motif (`docs/REDESIGN_BRIEF.md`: "Eyebrows: ... with a small rotated square seal-red dot"), not a bug.

**Interfaces:** None.

- [ ] **Step 1: Confirm current line numbers**

Run: `grep -n "#2d4a37\|#171713" src/components/TeaAssessmentExperience.module.css`
Expected:
```
130:  background: #2d4a37;
186:  color: #171713;
275:  background: #2d4a37;
345:  color: #171713;
```

- [ ] **Step 2: Fix the two off-brand hover-darken hex values**

`#2d4a37` matches no defined token — it's an independent near-miss of the sitewide hover-darken convention already established at `src/app/globals.css:3730` (`.button-primary:hover { background: #2b4d38; }`) and `src/components/TeaCollectionExperience.module.css:227` (`.tea-curator-actions a:hover { background: #2b4d38; }`). Align both occurrences to that existing convention.

At line 130 (`.tea-mind-primary-action:hover`), change:
```css
  background: #2d4a37;
```
to:
```css
  background: #2b4d38;
```

At line 275 (`.tea-mind-result-actions a:hover`), apply the identical change.

- [ ] **Step 3: Fix the two hardcoded ink-color values**

`#171713` is exactly `--cz-ink`. At line 186 (`.tea-mind-full-plan h3`), change:
```css
  color: #171713;
```
to:
```css
  color: var(--cz-ink);
```

At line 345 (`.tea-mind-plan-includes strong`), apply the identical change.

- [ ] **Step 4: Verify no targeted hex remains**

Run: `grep -n "#2d4a37\|#171713" src/components/TeaAssessmentExperience.module.css`
Expected: no output.

- [ ] **Step 5: Confirm the seal-dot motif at line ~632 is untouched**

Run: `grep -n "border-radius: 1px" src/components/TeaAssessmentExperience.module.css`
Expected: still present, unchanged — this line must NOT have been edited.

- [ ] **Step 6: Build check**

Run: `npm run build`
Expected: exits 0, `/tea-test` listed in route output, no new warnings.

- [ ] **Step 7: Visual check**

`npm run dev`, open `/tea-test`, complete a few quiz steps to reach a result screen. Confirm: the primary action button's hover state still darkens to the same near-black-green (no visible difference — `#2b4d38` vs `#2d4a37` differ by ~1 shade, verify side-by-side if unsure), and headings still render ink-black.

- [ ] **Step 8: Commit**

```bash
git add src/components/TeaAssessmentExperience.module.css
git commit -m "Use brand tokens and established hover convention on Tea Test"
```

---

### Task 4: Audit the homepage against the brand-bible checklist

**Files:** None expected to change — this task's deliverable is a verified "compliant" finding, or fixes if the audit turns up something Task-writing time didn't catch.

**Interfaces:** None.

- [ ] **Step 1: Check for non-2px border-radius in homepage-specific selectors**

Run: `awk 'NR>=14242 && NR<=15180 && /border-radius/ {print NR": "$0}' src/app/globals.css`
Expected: only `border-radius: 2px;` occurrences (lines ~14299, ~14710 as of this plan's writing). If any other value appears, open the file at that line, identify the selector, and change it to `2px` unless it's a documented brand-bible motif (rotated seal dot, circular icon button) — if unsure whether something is a motif, leave it and note it in the task's commit message rather than guessing.

- [ ] **Step 2: Check for hardcoded hex outside the documented dark-section bases**

Run: `awk 'NR>=14242 && NR<=15180 && /#[0-9a-fA-F]{3,6}/ && !/var\(--/ {print NR": "$0}' src/app/globals.css`
Expected: only `#0e100d` / `#14110c` (the brand bible's explicitly permitted dark-section base colors, `docs/REDESIGN_BRIEF.md` line 10). If anything else appears, replace it with the matching `--cz-*` token from the Global Constraints list above.

- [ ] **Step 3: Check for full borders on card-like elements (should be brass hairline, not full border)**

Run: `awk 'NR>=14242 && NR<=15180 && /^\s*border:/ {print NR": "$0}' src/app/globals.css`
Expected: no output. If any full `border:` declaration appears on a card selector, replace it with `border-top: 1px solid rgba(157, 129, 80, 0.35);` matching the convention at `src/components/TeaCollectionExperience.module.css:175`.

- [ ] **Step 4: If Steps 1-3 found no violations, record that explicitly**

If all three checks came back clean (matching what this plan's author found during spec research), make no code change. Skip to Step 6.

- [ ] **Step 5: If a violation was found and fixed, build + visually verify it**

Run: `npm run build` (expect exit 0), then `npm run dev` and check `/` in both `en` and `zh`.

- [ ] **Step 6: Commit**

If Step 4 applied (no changes):
```bash
git commit --allow-empty -m "Audit homepage against brand-bible checklist: no violations found"
```

If Step 5 applied (a fix was made):
```bash
git add src/app/globals.css
git commit -m "Fix brand-bible violation found on homepage audit: <describe what was fixed>"
```

---

### Task 5: Migrate `/about` onto the shared ChazenSubpage system

**Files:**
- Modify: `src/app/about/page.tsx` (full rewrite of the component body; content unchanged)
- Modify: `src/app/about/about.module.css` (trim to only the classes still referenced — do not delete the file; `storyGrid`, `pullStatement`, `storyText`, `storyFigure`, `pillarsGrid`, `pillarCard`, `pillarTitle`, `pillarText` still need bespoke layout CSS that `ChazenContentSection` doesn't provide, since it only wraps arbitrary `children`)

**Interfaces:**
- Consumes: `ChazenSubpageHero`, `ChazenContentSection`, `ChazenCtaBand` from `@/components/ChazenSubpage` (props defined at `src/components/ChazenSubpage.tsx:23-32,62-71,73-93`).
- Produces: nothing consumed by later tasks — `/about` is a leaf route.

- [ ] **Step 1: Read the current page fully to capture every string, href, and image exactly**

Run: `cat src/app/about/page.tsx`
(Already captured during spec research — the file has: a `SectionHeading` hero block, a two-column story grid with a `茶禪一味` pull-statement and three paragraphs, a full-bleed figure with `chazen-tea-room-hero-v2.jpg`, a three-card pillars grid, and a mission panel with two CTAs to `/tea-test` and `/b2b`.)

- [ ] **Step 2: Check what `about.module.css` classes are actually used today**

Run: `grep -o "styles\.[a-zA-Z]*" src/app/about/page.tsx | sort -u`
Expected: `styles.missionActions`, `styles.missionCopy`, `styles.missionEyebrow`, `styles.missionHeading`, `styles.missionPanel`, `styles.pillarCard`, `styles.pillarText`, `styles.pillarTitle`, `styles.pillarsGrid`, `styles.storyFigure`, `styles.storyGrid`, `styles.storySection`, `styles.storyText`, `styles.pullStatement`. Keep this list — every one of these class names must still exist in `about.module.css` after Step 4, since only the outer `.section`/`.container`/`SectionHeading` wrapper is being replaced, not the inner content styling.

- [ ] **Step 3: Rewrite `src/app/about/page.tsx`**

Replace the full file with:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";
import { useLanguage } from "@/lib/language";
import { withBasePath } from "@/lib/media";
import styles from "./about.module.css";

const pillars = [
  {
    en: ["Culture, carried forward", "We respect the knowledge, objects, and gestures of Chinese tea culture, then present them with clarity for contemporary life."],
    zh: ["承傳文化", "我們尊重中國茶文化中的知識、器物與動作，再以清晰、當代的方式帶進日常生活。"]
  },
  {
    en: ["Ritual before product", "Tea is more than something to consume. Warming the cup, watching the leaf open, and sharing the first pour can turn an ordinary pause into a meaningful return."],
    zh: ["儀式先於商品", "茶不只是被消費的東西。溫杯、看茶葉舒展、分享第一泡，都能把普通的停頓變成一次有意義的回歸。"]
  },
  {
    en: ["Quiet, considered luxury", "We choose restraint over noise: thoughtful materials, useful details, honest storytelling, and gifts that feel personal rather than promotional."],
    zh: ["安靜而有分寸的質感", "我們選擇克制而非喧鬧：用心的材質、有用的細節、真誠的故事，以及有個人溫度而非宣傳式的禮物。"]
  }
];

export default function AboutPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === "zh" ? "品牌故事 | Chazen" : "Our Story | Chazen";
  }, [language]);

  return (
    <main>
      <ChazenSubpageHero
        eyebrow="Our story"
        eyebrowZh="品牌故事"
        title="以茶，回到當下。"
        english="Tea as a way to return."
        copy="Chazen 茶禪是一個以文化為本的中國茶品牌。我們相信，一杯茶可以為平靜、專注與連結留出空間。"
        copyEn="Chazen 茶禪 is a culture-first Chinese tea brand created around a simple belief: a cup of tea can make space for calm, attention, and connection."
      />

      <ChazenContentSection tone="ivory">
        <div className={styles.storyGrid}>
          <p className={styles.pullStatement}>{t("茶禪一味", "茶禪一味")}</p>
          <div className={styles.storyText}>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(
              "The name Chazen brings tea and Zen into one idea. It reflects the long relationship between tea, awareness, hospitality, and the art of slowing down.",
              "Chazen 將「茶」與「禪」放在同一個概念之中，回應茶、覺察、待客之道與慢下來的藝術之間悠久的連結。"
            )}</p>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(
              "We are building a modern tea house beyond a physical room: tea rituals, cultural stories, guided discovery, sound, and meaningful gifts designed to meet people where they are.",
              "我們正在建立一間不受實體空間限制的現代茶文化之家，透過茶儀式、文化故事、引導式探索、聲音與有意義的贈禮，讓不同的人都能找到自己的入口。"
            )}</p>
            <p lang={language === "zh" ? "zh-Hant" : undefined}>{t(
              "Our intention is not to simplify Chinese tea into a trend. It is to make the first step welcoming while keeping the culture visible, respected, and worth learning.",
              "我們的目的不是把中國茶簡化成潮流，而是讓第一步更容易親近，同時讓文化保持可見、受到尊重，並值得繼續學習。"
            )}</p>
          </div>
        </div>

        <figure className={styles.storyFigure}>
          <Image
            src={withBasePath("/images/chazen-tea-room-hero-v2.jpg")}
            alt={t(
              "The Chazen tea room: a low wooden table, gaiwan, and warm side light.",
              "Chazen 茶室：矮木茶桌、蓋碗，與溫暖的側光。"
            )}
            fill
            sizes="(min-width: 1024px) 80vw, 100vw"
          />
          <figcaption lang={language === "zh" ? "zh-Hant" : undefined}>
            {t("The tea room the brand is built around.", "品牌圍繞著的那間茶室。")}
          </figcaption>
        </figure>

        <div className={styles.pillarsGrid}>
          {pillars.map((item) => (
            <article key={item.en[0]} className={styles.pillarCard}>
              <h2 className={styles.pillarTitle} lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.en[0], item.zh[0])}</h2>
              <p className={styles.pillarText} lang={language === "zh" ? "zh-Hant" : undefined}>{t(item.en[1], item.zh[1])}</p>
            </article>
          ))}
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="一條從好奇心走向個人茶儀式的清晰路徑。"
        titleEn="A thoughtful path from curiosity to personal ritual."
        copy="Chazen 結合引導式選茶、實用沖泡儀式、文化內容、五盞理念，以及為個人與企業重要時刻而設的贈禮。"
        copyZh="Chazen 結合引導式選茶、實用沖泡儀式、文化內容、五盞理念，以及為個人與企業重要時刻而設的贈禮。"
        primary={{ href: "/tea-test", label: "Begin with the tea test", labelZh: "從茶測試開始" }}
        secondary={{ href: "/b2b", label: "Explore cultural gifting", labelZh: "探索文化贈禮" }}
      />
    </main>
  );
}
```

Note: `ChazenCtaBand`'s `copy`/`copyZh` props are `(zh-default, zh-override)` — same pattern as `ChazenContentSection`'s `copy`/`copyEn` (see `src/components/ChazenSubpage.tsx:191,199`: `t(copy, copyZh ?? copy)`, `zh` renders first). Both `copy` and `copyZh` are set to the same Chinese string here since the mission panel's original copy had no separate English variant for that specific line — reuse the ZH-first pattern exactly as `ChazenCtaBand` expects it, do not invent new English copy.

The `ArrowRight` icon and `button-primary`/`button-secondary` classes from the original file are dropped because `ChazenCtaBand` renders its own `chazen-subpage-button(-primary)` styling and arrow icon internally (`src/components/ChazenSubpage.tsx:202-214`) — do not re-add them.

- [ ] **Step 4: Trim `about.module.css` to remove only the now-unused wrapper styles**

Run: `cat src/app/about/about.module.css` and identify any `.section`/`.container`-style rules that existed solely to lay out the old `SectionHeading`-based hero (the hero markup no longer exists in this file — `ChazenSubpageHero` supplies its own layout via `chazen-subpage-hero` in `globals.css`). Remove only rules for classes no longer referenced by `page.tsx` (cross-check against the Step 2 list — every class in that list must remain). Do not remove `storyGrid`, `pullStatement`, `storyText`, `storyFigure`, `pillarsGrid`, `pillarCard`, `pillarTitle`, `pillarText`, `missionPanel`, `missionEyebrow`, `missionHeading`, `missionCopy`, `missionActions` — none of these are provided by `ChazenSubpage`, wait: `missionPanel`/`missionEyebrow`/`missionHeading`/`missionCopy`/`missionActions` are now replaced by `ChazenCtaBand` and are no longer referenced by the new `page.tsx` — these ARE safe to remove. Only `storyGrid`, `pullStatement`, `storyText`, `storyFigure`, `pillarsGrid`, `pillarCard`, `pillarTitle`, `pillarText` remain in use.

- [ ] **Step 5: Verify no orphaned or missing classes**

Run: `grep -o "styles\.[a-zA-Z]*" src/app/about/page.tsx | sed 's/styles\.//' | sort -u > /tmp/used-classes.txt`
Run: `grep -oE "^\.[a-zA-Z]+" src/app/about/about.module.css | sed 's/^\.//' | sort -u > /tmp/defined-classes.txt`
Run: `comm -23 /tmp/used-classes.txt /tmp/defined-classes.txt`
Expected: no output (every class the page uses is defined). If output appears, add the missing CSS rule (do not remove the class usage from the page).

- [ ] **Step 6: Build check**

Run: `npm run build`
Expected: exits 0, `/about` listed in route output, no TypeScript errors, no unused-import lint errors for the removed `SectionHeading`/`Link`/`ArrowRight` imports (they've been removed from the rewritten file in Step 3 — `Link` is no longer imported since `ChazenCtaBand` handles its own links internally).

- [ ] **Step 7: Lint check**

Run: `npm run lint`
Expected: exits 0, no errors on `src/app/about/page.tsx` or `src/app/about/about.module.css`.

- [ ] **Step 8: Visual + content check**

Run `npm run dev`, open `/about` in both `en` and `zh`:
- Confirm the hero now animates in on load (scroll-reveal via `MotionReveal`, baked into `ChazenSubpageHero`) — the old page had zero motion.
- Confirm every paragraph, the pull-statement, the tea-room photo + caption, all three pillar cards, and both CTA buttons (`/tea-test`, `/b2b`) are present with identical text to before, in both languages.
- Confirm the page title still updates correctly in the browser tab when toggling language.

- [ ] **Step 9: Commit**

```bash
git add src/app/about/page.tsx src/app/about/about.module.css
git commit -m "Migrate /about onto the shared ChazenSubpage component system"
```

---

### Task 6: Final sitewide verification

**Files:** None modified — this is a verification-only task.

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: exits 0, all 22 routes listed, no warnings introduced by this plan's changes.

- [ ] **Step 2: Full lint**

Run: `npm run lint`
Expected: exits 0.

- [ ] **Step 3: Confirm untouched pages are actually untouched**

Run: `git diff --stat main...HEAD` (or the appropriate base branch) and confirm the only files touched across all tasks are: `src/app/gift-box/gift-box.module.css`, `src/components/TeaCollectionExperience.module.css`, `src/components/TeaAssessmentExperience.module.css`, possibly `src/app/globals.css` (only if Task 4 found a fix), `src/app/about/page.tsx`, `src/app/about/about.module.css`.

- [ ] **Step 4: Spot-check the five touched pages one more time in sequence**

`npm run dev`, click through `/`, `/gift-box`, `/tea-collection`, `/tea-test`, `/about` in order, toggling `en`/`zh` on each. Confirm nothing looks broken and no console errors appear (open browser devtools console while clicking through).

- [ ] **Step 5: Push branch and open a draft PR**

```bash
git push -u origin HEAD
gh pr create --draft --title "Design consistency pass: brand-token audit + /about migration" --body "$(cat <<'EOF'
## Summary
- Fixed hardcoded hex colors that drifted from brand tokens on gift-box, tea-collection, and tea-test
- Fixed a 3px and a 1px border-radius that drifted from the brand bible's 2px convention
- Migrated /about onto the shared ChazenSubpage component system (was the only thin page with no bespoke layout to lose and zero scroll motion)
- Audited the homepage against the brand-bible checklist

See docs/superpowers/specs/2026-07-22-design-consistency-pass-design.md for the full design rationale.

## Test plan
- [x] npm run build passes
- [x] npm run lint passes
- [x] Manual visual check of all 5 touched pages in en + zh
- [x] No routes, hrefs, or copy changed

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
