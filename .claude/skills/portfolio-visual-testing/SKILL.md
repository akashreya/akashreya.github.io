---
name: portfolio-visual-testing
description: >-
  Playwright visual regression for akashreya-portfolio, the automated half of the deploy gate.
  Covers running the 14-test suite (2 modes x 7 viewports) in tests/playwright-viewport.spec.ts,
  the port 5174 dev-server requirement, the DISABLE_ANIMATIONS CSS that freezes reveal, ticker,
  terminal clock, blobs, footprints, Chikorita and mode-transition animations before screenshots,
  how to read a failed toHaveScreenshot diff, and the discipline for regenerating baselines
  (recording an intended change vs masking a regression). Load when running npm run test:visual
  or npm run update-baseline; a screenshot comparison fails or "A snapshot doesn't exist";
  Playwright times out waiting for localhost:5174; deciding whether to regenerate baselines after
  a CSS, token or layout change; adding screenshot coverage for a new section, page or animated
  component; or producing test evidence before a push to main. Keywords: visual regression,
  baseline, snapshot, toHaveScreenshot, diff, viewport, update-snapshots, flaky screenshot.
---

# Portfolio visual testing

Push to `main` is a live deploy, and the gate is Playwright green plus a manual dev-server check.
This skill covers the Playwright half. The gate itself, pipeline and rollback:
**portfolio-build-run-deploy**. Mode/tone vocabulary and the flag: **portfolio-architecture-contract**.

## Hard rules

- Run `npm run test:visual`, not `npm run test`. Bare `test` also runs the seven
  `tests/playwright-*-preview.spec.ts` harnesses, which end in `page.pause()` and hang.
- Start your own dev server before the suite (port trap, section 2).
- Any new component with an entrance or looping animation gets a force-final-state rule in
  `DISABLE_ANIMATIONS` before baselines are generated, or it screenshots mid-flight and flakes.
- Regenerate baselines only for a change you can name and have reviewed (section 5). A refresh to
  make red go green is masking.
- `tests/` is gitignored: the spec and baselines exist only in this working tree. CI runs no tests.
  Losing the tree loses the baselines.

## 1. The suite

- Spec: `tests/playwright-viewport.spec.ts`, the only regression spec. Config: `playwright.config.js`
  (single Chromium project, `reducedMotion: "reduce"` in `use` and in the project,
  `toHaveScreenshot: { threshold: 0.2 }`, no `maxDiffPixels`).
- Matrix: `modes = ['recruiter', 'personal']` x 7 viewports = 14 tests, serial. Viewports are set
  per test with `setViewportSize`, not as Playwright projects. Tone is the default (`dark`).
- Each test loads `http://localhost:5174/?mode=<mode>` and takes a viewport screenshot
  (`fullPage: false`) per section:
  - both modes: `hero`, `projects`, `principles`, `footer`
  - recruiter only: `enterprise` (gate: `#enterprise .ent-card`)
  - personal only: `sidequests`, `enterprise-collapsed`
- Personal cases call `test.skip(mode === 'personal' && !PERSONAL_MODE_ENABLED, ...)`, so they
  skip only if the kill switch in `src/config.js` is off.
- Baselines: `tests/playwright-viewport.spec.ts-snapshots/`, named
  `<mode>-<Viewport-Name>-<section>-chromium-win32.png`. They are current against the committed
  code and machine-local (`-win32`).

| Viewport | Size |
|---|---|
| Mobile Portrait | 360x800 |
| Mobile Landscape | 800x360 |
| Tablet Portrait | 768x1024 |
| Tablet Landscape | 1024x768 |
| Desktop Small | 1366x768 |
| Desktop Large | 1920x1080 |
| Desktop XL | 2560x1440 |

## 2. Running it

```
npx playwright install chromium   # once
npm run dev                        # terminal 1 (takes 5173)
npm run test:visual                # terminal 2
npx playwright show-report         # after a failure
```

Port trap: `playwright.config.js` declares `webServer: { command: "npm run dev", port: 5174 }`
with `reuseExistingServer` locally, but `vite.config.js` serves on 5173 without `strictPort`. On a
cold start Playwright's spawned server takes the free 5173 and nothing binds 5174, so the run
times out. With your server already on 5173, the spawned one increments to 5174 and the tests run
against it. `npx vite --port 5174` also works. The preview specs hardcode 5173.

The dev server uses your local env, so `VITE_API_URL` leaks into the screenshots. Local backend,
prod and fallback content render differently; keep the target the same for baseline generation and
test runs, or diffs will be data drift rather than code regressions.

Navigation uses `waitUntil: 'commit'` and then polls for `#hero`, so a slow Google Fonts fetch
cannot time the test out. A late font can still repaint text after the styles are injected: diffs
that are text-metric-only across every section suggest font timing.

## 3. Animation defeat

Two layers. `reducedMotion: "reduce"` makes the page honor `prefers-reduced-motion` (which also
stops `Footprints`, makes `triggerModeTransition` instant, and skips the route fade and tone
crossfade; the reduced-motion blocks at the end of `portfolio.css`, `said.css`,
`cs-inspector.css` and `mode-transition.css` settle every entrance and loop at its final state). Then, after `#hero` exists, the spec
injects `DISABLE_ANIMATIONS` with `page.addStyleTag`. Its rules, exactly:

| Selector | Rule | Neutralizes |
|---|---|---|
| `*, *::before, *::after` | animation/transition duration and delay `0s` | everything generic |
| `.reveal, .reveal.no-anim` | `opacity: 1; transform: none; transition: none` | scroll reveal (starts hidden until `useReveal` adds `.in-view`) |
| `.letter-drop > span` | `opacity: 1; transform: none; animation: none; filter: none` | LetterDrop personal hero name |
| `.ticker-inner` | `animation: none; transform: none` | HeroTicker marquee |
| `.term__clock` | `visibility: hidden` | live IST clock in HeroTerminal |
| `.term__dot` | `animation: none; box-shadow: none` | terminal pulse dot |
| `.blob` | `animation: none` | AmbientBlobs drift |
| `.footprints` | `display: none` | cursor ink trail |
| `.chikorita` | `display: none` | buddy sprite |
| `.mode-iris, .mode-curtain` | `display: none` | ModeTransition overlay |
| `[data-mode="personal"] .mention` | `opacity: 1; transform: none` | personal mention cards |
| `.mention.is-dropped` | `animation: none; opacity: 1; transform: none` | mention drop-in |
| `.sq-node` | `opacity: 1; transform: none; animation: none` | SideQuests node entrance |

All rules are `!important`. The generic duration rule does not rescue elements whose initial
state is hidden and only becomes visible through a JS-added class or a keyframe end state; those
need their own rule. Anything time-dependent (clocks) or randomized (Chikorita's walk) is hidden
rather than frozen.

## 4. Reading a failure

Open the HTML report (`npx playwright show-report`) and look at the actual/expected/diff triplet
for every failure before deciding anything.

- Diff confined to what you changed: expected; go to section 5.
- Diff in a section you did not touch: regression or environment drift (API data, font timing).
  Investigate first; **portfolio-debugging-playbook** has the symptom table.
- Low-intensity speckle across the whole image: rendering drift (Chromium/Playwright upgrade, GPU,
  OS). Baselines are machine-local.
- Failure before any screenshot (`toBeVisible` timeout on `.hero__name`, `#sidequests`,
  `.enterprise-collapsed`): the section did not render. Not a visual diff; check data and mode.
- `A snapshot doesn't exist`: new screenshot name; generate it (section 6).

## 5. Baseline discipline

Regenerating makes the suite agree with whatever the page shows now. The command is the same
whether you are recording a change or laundering a regression, so the checklist is the control.
Update only when all hold:

- [ ] You can name the edit that moved the pixels, and the diff footprint matches it.
- [ ] You looked at every failing diff image, not the failure count.
- [ ] Diffs outside the edited area are explained (a shared token) or investigated first.
- [ ] Same `VITE_API_URL` target and flag state as the existing baselines, no uncommitted
      experiments in the tree.
- [ ] You reviewed the new actuals as correct, not merely current.

It is masking when you update over an unexplained diff, update to get past a `toBeVisible`
failure, or bake in an environment change (browser bump) without saying so. After updating, run
`npm run test:visual` again: a fresh baseline that does not pass immediately means the page is
nondeterministic, which is its own bug.

## 6. Regenerating

```
npm run update-baseline   # = playwright test --update-snapshots tests/playwright-viewport.spec.ts
npm run test:visual       # confirm green
```

Dev server on 5173 first, as in section 2. `npm run update-baseline -- -g "recruiter"` refreshes
half the matrix. Missing snapshots are created from the actuals.

## 7. Adding coverage

New portfolio-page section:

1. Give it a stable `id` and a deterministic child selector for the visibility gate.
2. Add a block in scroll order inside the test body:
   ```ts
   await page.locator('#newsection').scrollIntoViewIfNeeded();
   await expect(page.locator('#newsection .some-child').first()).toBeVisible();
   await expect(page).toHaveScreenshot(`${slug}-newsection.png`, { fullPage: false });
   ```
   Wrap mode-specific sections in `if (mode === 'personal')` like `sidequests`.
3. If it animates, add its `DISABLE_ANIMATIONS` rule first.
4. Generate, review each new PNG, then run `npm run test:visual` twice (determinism check).

New route: the suite only covers `/`; case-study and in-the-wild pages have no coverage. Add a
sibling spec reusing the viewport array, `DISABLE_ANIMATIONS` and the 5174 URL, and run it
explicitly (or add a script), since bare `npm run test` drags in the pausing preview specs.
