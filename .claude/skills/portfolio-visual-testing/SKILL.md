---
name: portfolio-visual-testing
description: >-
  Playwright visual regression for akashreya-portfolio: how to run the 7-viewport
  screenshot suite, why it needs a dev server on port 5174, how reveal/ticker/blob
  animations are defeated before screenshots, where actual/expected/diff images land
  when a test fails, and the discipline for updating baselines (legitimate refresh vs
  masking a regression). Load when: running npm run test / test:visual; a
  toHaveScreenshot assertion fails; "Screenshot comparison failed"; "Error: A snapshot
  doesn't exist"; Playwright times out waiting for http://localhost:5174; deciding
  whether to regenerate baselines after a CSS/layout change; adding screenshot coverage
  for a new section or page; update-baseline.ps1 questions; personal-mode tests failing
  on #sidequests; producing the test evidence required before pushing to main.
  Keywords: visual regression, baseline, snapshot, toHaveScreenshot, diff, viewport,
  playwright-viewport.spec.ts, update-snapshots, test-results, flaky screenshot.
---

# Portfolio visual testing — evidence for the deploy gate

This suite is the automated half of the deploy gate: **push to `main` = live deploy to akashreya.space**, and the owner's rule is Playwright green + manual dev-server check before any push. This skill covers producing and interpreting that Playwright evidence. The gate itself (pipeline, rollback, manual-check protocol) is owned by **portfolio-build-run-deploy**.

**When NOT to use this skill:**

| You actually want | Load instead |
|---|---|
| The deploy pipeline, GH Actions, whether it's safe to push | portfolio-build-run-deploy |
| Why a section renders blank / "[object Object]" / crashes (a real bug the screenshots caught) | portfolio-debugging-playbook |
| What "mode" vs "tone" vs "voice" mean, what PERSONAL_MODE_ENABLED gates | portfolio-architecture-contract |
| Changing theme tokens or copy (the thing that made the pixels change) | portfolio-theme-and-content |
| API/fallback data shape questions | portfolio-api-and-fallback |

Terminology used below (full treatment in portfolio-architecture-contract): **mode** = `recruiter` | `personal` (content persona, `?mode=` URL param, `data-mode` attribute); **tone** = `light` | `dark` (color scheme). "Theme" loosely means the mode+tone token set; "voice" is an API content concept — irrelevant here. The visual suite is parameterized by **mode only**; tone is whatever the default is (dark).

## 1. The suite at a glance

- Spec: `tests/playwright-viewport.spec.ts` (the ONLY regression spec). Config: `playwright.config.js`.
- Matrix: 2 modes × 7 viewports = **14 tests**, run serially (`test.describe.configure({ mode: 'serial' })`), single Chromium project. Viewports are set per-test via `setViewportSize` — they are NOT Playwright projects.
- Each test scrolls section-by-section and takes a viewport screenshot (`fullPage: false`) per section:
  - both modes: `hero`, `projects`, `principles`, `footer`
  - recruiter only: `enterprise`
  - personal only: `sidequests`, `enterprise-collapsed` (Enterprise renders a collapsed stub in personal mode)
- Baselines: `tests/playwright-viewport.spec.ts-snapshots/` — **77 PNGs** (35 recruiter + 42 personal) named `<mode>-<Viewport-Name>-<section>-chromium-win32.png`, as of 2026-07-10. **Personal baselines are STALE as of 2026-07-11**: the parchment identity replaced violet/glass AND the sidequests board content changed (API-driven since 2026-07-11 — new node set, hub "Time · Craft · Intentionality"). Regenerate deliberately before treating personal diffs as regressions.
- Content determinism note: SideQuests/HeroTicker now fetch from the API with fallback-seeded state. Screenshots taken with the local backend absent/empty render `fallbackSideQuests`/`fallbackTicker` — deterministic because the mirrors are verbatim copies of the live content; if a screenshot shows content mid-swap, the fetch resolved between scroll and shot (fallback ≠ mirror would be the real cause — re-sync fallback.js first).
- Comparison: `toHaveScreenshot: { threshold: 0.2 }` — per-pixel color-distance tolerance (0–1 scale), no `maxDiffPixels` cap.

The 7 viewports (`tests/playwright-viewport.spec.ts:3-11`):

| Name | Size |
|---|---|
| Mobile Portrait | 360×800 |
| Mobile Landscape | 800×360 |
| Tablet Portrait | 768×1024 |
| Tablet Landscape | 1024×768 |
| Desktop Small | 1366×768 |
| Desktop Large | 1920×1080 |
| Desktop XL | 2560×1440 |

**Nothing in git, nothing in CI.** `.gitignore:159` ignores `tests/` wholesale — specs AND baselines live only in the working tree (CLAUDE.md's "checked-in baselines" is wrong). `.github/workflows/deploy.yml` runs `npm ci && npm run build` only; no test step. The suite exists exclusively on this machine, run by hand. Losing the working tree loses the baselines.

## 2. Running it

```powershell
# one-time: browsers (not npm-installed)
npx playwright install chromium

# the visual regression suite (the deploy-gate command)
npm run test:visual

# view the HTML report afterwards
npx playwright show-report
```

**Do NOT use `npm run test` for automation.** It runs every spec in `tests/`, including the seven `playwright-*-preview.spec.ts` files, which end in `await page.pause()` — they are manual-inspection harnesses (open a viewport, pause in the Inspector), not assertions. `npm run test:visual` targets only the regression spec.

### The port 5174 trap

`playwright.config.js` declares `webServer: { command: "npm run dev", port: 5174 }`, but `vite.config.js` serves on **5173** (strictPort unset, so Vite auto-increments when 5173 is busy). Consequence:

- **Cold start (nothing running): expect the suite to time out** waiting for 5174 — Playwright's spawned dev server lands on free 5173 and nothing ever binds 5174 (inferred from config; the working recipe below is what's observed to bring the suite up).
- **Working recipe (observed 2026-07-10):** start your own dev server first, then run the suite. Your server takes 5173; Playwright's spawned one increments to 5174; the webServer wait passes and tests execute against 5174.

```powershell
# terminal 1 (or run_in_background)
npm run dev

# terminal 2
npm run test:visual
```

(Equivalent: `npx vite --port 5174` and `reuseExistingServer` picks it up.) The preview specs, by contrast, hardcode `http://localhost:5173` — they hit YOUR manually started server.

Because the suite runs against `npm run dev` with your local env, **whatever `VITE_API_URL` points at leaks into the screenshots** — content from a local backend vs prod vs fallback data can differ and produce diffs that are data drift, not code regressions. See portfolio-api-and-fallback for the data layer; keep the API target consistent between baseline generation and test runs.

### Personal-mode tests skip (not fail) when the flag is off (FIXED 2026-07-11)

`src/config.js` ships `PERSONAL_MODE_ENABLED = false`, and `src/theme/ThemeProvider.jsx:12-15` then **ignores `?mode=personal` entirely** — mode is forced to `recruiter`. `SideQuests.jsx:29` returns `null` outside personal mode. Previously, the 7 `personal / *` tests **failed** on `expect(page.locator('#sidequests')).toBeVisible()` while the flag was off, which blocked reading "full suite green" as a clean deploy-gate signal.

**Fix applied:** the spec now imports `PERSONAL_MODE_ENABLED` from `src/config.js` and calls `test.skip(mode === 'personal' && !PERSONAL_MODE_ENABLED, '...')` at the top of each test body. Personal cases now **skip** instead of failing when the flag is off, so "full suite green" (recruiter passed, personal skipped) is again a trustworthy deploy-gate reading without needing to scope to `-g "recruiter"`. Note this fix lives in `tests/playwright-viewport.spec.ts`, which is gitignored — it's a local-tree-only change, same as the rest of the suite.

The 42 personal baselines were still generated with the flag on, and still require the flag on to regenerate or to actually exercise the personal assertions (not just skip past them):

To run the full 14-test matrix for real: temporarily set `PERSONAL_MODE_ENABLED = true` in `src/config.js`, run the suite, **revert before committing** (flipping the flag is a launch decision owned by portfolio-personal-mode-campaign, not a test convenience). If you only changed recruiter-visible surface, gating on the recruiter half is still the pragmatic minimum (and now equivalent to just running the full suite, since personal will self-skip):

```powershell
npx playwright test tests/playwright-viewport.spec.ts -g "recruiter"
```

## 3. How animations are defeated (and why)

Screenshots of animated pages are nondeterministic — the assertion would capture whatever frame the animation happened to be on. Two layers prevent that:

1. **`reducedMotion: "reduce"`** in `playwright.config.js` (set in both `use` and the chromium project) — makes the page honor `prefers-reduced-motion`.
2. **`DISABLE_ANIMATIONS`**, a CSS string injected per-test via `page.addStyleTag` (`tests/playwright-viewport.spec.ts:15-53`, applied at line 65 after React mounts). It zeroes all animation/transition durations and force-finishes every animated component:

| Rule target | What it neutralizes |
|---|---|
| `*, *::before, *::after` durations/delays → 0s | everything generic |
| `.reveal`, `.reveal.no-anim` → `opacity: 1` | scroll-reveal elements — `portfolio.css:41-47` starts them at `opacity: 0; translateY(14px)` until `useReveal`'s IntersectionObserver adds `.in-view`; without the override, sections scrolled to mid-test could screenshot invisible |
| `.letter-drop > span` | LetterDrop per-letter entrance |
| `.ticker-inner` | HeroTicker marquee scroll |
| `.blob` | AmbientBlobs drift |
| `.mode-iris`, `.mode-curtain` → `display: none` | ModeTransition overlay |
| `.mention`, `.mention.is-dropped` | personal-mode mention drop-in |
| `.sq-node` | SideQuests node entrance |

**Rule: any new component with entrance/looping animation MUST get a force-final-state rule appended to `DISABLE_ANIMATIONS`**, or it will screenshot mid-flight and flake. The generic `*` duration-zeroing does not cover elements whose *initial* CSS state is hidden and only becomes visible via a JS-added class or a keyframe end-state.

Also note: `page.goto` uses `waitUntil: 'commit'` then polls for `#hero` (`waitForFunction`, line 64) instead of waiting for `load` — deliberate, so a slow Google Fonts fetch can't time the test out. Side effect: a late-loading web font can still repaint text after the style injection; if you see text-metric-only diffs across the board, suspect font timing, not your change.

## 4. Reading a failure

A failed `toHaveScreenshot` writes three artifacts under `test-results/` (gitignored), in a folder named after the test:

```
test-results/
  <spec-name>-<test-title-slug>-chromium/   one folder per failed test
    <screenshot-name>-actual.png     what this run rendered
    <screenshot-name>-expected.png   the baseline it was compared to
    <screenshot-name>-diff.png       highlight overlay of differing pixels
```

`npx playwright show-report` (serves `playwright-report/`, also gitignored) shows the same triplet with a slider — fastest way to eyeball. Read the diff before anything else:

- **Diff localized to the element you changed** → expected; proceed to the baseline decision below.
- **Diff in a section you didn't touch** → regression or environment drift (API data changed, font raced, mode/flag state wrong). Investigate — portfolio-debugging-playbook has the symptom table.
- **Whole-image speckle at low intensity** → rendering-environment drift (GPU/OS/browser-version change since baselines were generated). Baselines are `-win32` and machine-local; a Playwright/Chromium upgrade can shift antialiasing everywhere.
- **Test failed before any screenshot** (e.g. `toBeVisible` timeout on `#sidequests` or `.hero__name`) → not a visual diff at all; the section didn't render. Check the flag state (§2) and the data layer.
- **`Error: A snapshot doesn't exist at ...`** → new screenshot name with no baseline; Playwright writes the actual as the new baseline on `--update-snapshots` (§6).

## 5. Baseline update discipline

Regenerating baselines makes the suite agree with whatever the page currently looks like. That is either recording an intentional change or laundering a regression — the command is identical, so the discipline is the checklist:

**Update baselines only when ALL of these are true:**

- [ ] You can name the commit/edit that caused the pixel change, and the diff footprint matches it (changed the hero accent → only hero/section diffs where that accent appears).
- [ ] You looked at every failing diff image, not just the count. 14 tests × up to 6 screenshots — "37 failed, must be my CSS change" is not evidence.
- [ ] Diffs in sections you didn't touch are explained (e.g. footer inherits the token you changed) — or investigated as regressions first.
- [ ] The dev server state matches how baselines are always generated: same `VITE_API_URL` target, correct `PERSONAL_MODE_ENABLED` state, no local uncommitted experiments.
- [ ] The new actuals were visually reviewed as *correct*, not merely *current*.

**It is masking, not updating, when:** you can't explain a diff but update anyway; you update to make the suite green before investigating a `toBeVisible` failure; you update after an environment change (Playwright/Chromium bump) without noting that all-viewport drift is now baked in; or you update personal-mode baselines while unsure what flag/data state produced them.

After updating: run `npm run test:visual` again and confirm green — a baseline refresh that doesn't immediately pass means the page is nondeterministic (unkilled animation, racing font, live data), which is its own bug.

## 6. How to actually regenerate baselines

**Use Playwright's built-in mechanism:**

```powershell
# dev server on 5173 first (see §2), then:
npx playwright test --update-snapshots tests/playwright-viewport.spec.ts
npm run test:visual   # confirm green
```

`--update-snapshots` rewrites only the baselines for tests that run — combine with `-g "recruiter"` to refresh half the matrix.

**`update-baseline.ps1` was deleted 2026-07-11 — if you're looking for it, it's gone on purpose.** It was stale (verified 2026-07-10): the script edited the spec with regexes that expected an older spec shape, and would have wiped `tests\playwright-viewport.spec.ts-snapshots\` and copied nothing back (baselines aren't in git — §1 — so that deletion would have been unrecoverable except by regenerating). It was deleted rather than fixed, with the file's tracked status confirmed and the deletion owner-approved first. `npm run update-baseline` (`package.json`) now runs `playwright test --update-snapshots tests/playwright-viewport.spec.ts` directly — the same command in §6 below, just aliased. Use that; there is no separate script anymore.

## 7. Adding coverage for a new section or page

For a new section on the portfolio page (follow the existing pattern in `tests/playwright-viewport.spec.ts:69-99`):

1. Give the section a stable anchor (`id="..."`) and a deterministic-content selector for the visibility gate.
2. Add a block inside the test body, in scroll order:
   ```ts
   await page.locator('#newsection').scrollIntoViewIfNeeded();
   await expect(page.locator('#newsection .some-child').first()).toBeVisible();
   await expect(page).toHaveScreenshot(`${slug}-newsection.png`, { fullPage: false });
   ```
   If the section is mode-specific, wrap it in `if (mode === 'personal')` / `'recruiter'` like sidequests/enterprise.
3. If the section animates in, append its force-final-state rule to `DISABLE_ANIMATIONS` (§3) — do this BEFORE generating baselines.
4. Generate the 14 new baselines: `npx playwright test --update-snapshots tests/playwright-viewport.spec.ts` (missing snapshots are created from the actuals).
5. Review each new PNG in `tests/playwright-viewport.spec.ts-snapshots/` — you are certifying these as ground truth.
6. `npm run test:visual` → green twice in a row (determinism check).

For a new *page* (route): the current suite only covers `/`. Add a sibling spec `tests/playwright-<pagename>.spec.ts` copying the viewport array, `DISABLE_ANIMATIONS`, and the 5174 URL scheme from the main spec; add a matching `test:visual`-style script or run it explicitly — remember bare `npm run test` also drags in the pausing preview specs.

## Provenance and maintenance

Verified against the working tree 2026-07-10 (branch `main`, commit 27e7ae0; `tests/` itself is untracked). Re-verify before trusting:

| Claim | Check |
|---|---|
| Scripts (`test`, `test:visual`, `update-baseline`) | `Get-Content package.json` (lines 12-14) |
| Threshold, webServer port 5174, reducedMotion | `Get-Content playwright.config.js` |
| Vite dev port 5173 | `Get-Content vite.config.js` (server.port) |
| Viewports, modes, DISABLE_ANIMATIONS, screenshot list | `Get-Content tests/playwright-viewport.spec.ts` |
| Baseline count/naming | `(Get-ChildItem tests/playwright-viewport.spec.ts-snapshots).Count` (77 as of 2026-07-10) |
| `tests/` gitignored | `git check-ignore tests/ ; git ls-files tests/` (empty) |
| Personal flag state | `Get-Content src/config.js` (`PERSONAL_MODE_ENABLED`, false as of 2026-07-10) |
| Flag forces recruiter, ignores `?mode=` | `src/theme/ThemeProvider.jsx:12-15` |
| update-baseline.ps1 still deleted (fixed 2026-07-11) | `Test-Path update-baseline.ps1` (expect `False`) |
| Personal tests still skip (not fail) with flag off (fixed 2026-07-11) | `Select-String -Path tests/playwright-viewport.spec.ts -Pattern 'test\.skip|PERSONAL_MODE_ENABLED'` (expect hits for both) |
| No CI test step | `Get-Content .github/workflows/deploy.yml` |
