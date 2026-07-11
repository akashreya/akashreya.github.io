---
name: portfolio-debugging-playbook
description: >
  Symptom-to-triage runbook for the akashreya-portfolio frontend. Load when debugging:
  React minified error #31 / "Objects are not valid as a React child" / a component rendering
  "[object Object]"; a bug that reproduces on akashreya.space but NOT locally (prod-only bug);
  a blank or missing section on any page (hero, projects grid, principles, enterprise, case study,
  in-the-wild mentions); "No mentions in this category yet" flashes; a crash on .map of undefined;
  keyboard shortcut M or T "not working"; theme/tone not persisting or flickering; reveal-animation
  elements invisible or flaky in Playwright screenshots; stale API data that won't refresh;
  personal-mode features (SideQuests, HeroTicker, AmbientBlobs) not appearing. Contains the
  project's failure archaeology: which commits fixed each trap and the discriminating experiment
  that separates lookalike causes.
---

# Portfolio Debugging Playbook

Symptom -> first-move triage for `E:\Work\Code\GitHub\akashreya-portfolio` (React 19 + Vite SPA, deployed to GitHub Pages at akashreya.space). Every trap below actually happened; commits are cited so you can `git show` the fix.

**CLAUDE.md is stale (describes v2).** Verify against `src/`, never against CLAUDE.md.

## When NOT to use this skill

| You are... | Load instead |
|---|---|
| Building a feature / need design rationale (why voice/mode/fallback exist) | `portfolio-architecture-contract` |
| Looking up endpoint shapes, pickVoice semantics, fallback.js sync rules | `portfolio-api-and-fallback` |
| Asking about test infra, baselines, adding visual coverage | `portfolio-visual-testing` |
| Setting up env, deploying, touching the deploy gate or GH Actions | `portfolio-build-run-deploy` |
| Changing themes, tokens, or copy | `portfolio-theme-and-content` |
| Working on the personal-mode redesign/launch | `portfolio-personal-mode-campaign` |

## Vocabulary (these four words WILL be confused)

Full axis explanation is owned by `portfolio-architecture-contract`. Minimum to debug:

| Term | Values | What it is |
|---|---|---|
| **mode** | `recruiter` \| `personal` | Which persona of the site. Personal is feature-flagged OFF (`src/config.js:3`, as of 2026-07-10) |
| **tone** | `light` \| `dark` | Color scheme within a mode |
| **voice** | per-field `{recruiter: T, personal: T}` wrapper in API data | A DATA shape, not a UI state. Unresolved voice wrappers are the #1 crash source (see Trap 1) |
| **theme** | — | Loose word for mode+tone token set in `src/theme/themes.js`. Avoid; say mode or tone |

## Symptom -> first move (one screen)

| Symptom | Most likely cause | First move |
|---|---|---|
| React error #31 / "[object Object]" rendered | Unresolved voiced field from API | Trap 1. Check the crashing field against the raw endpoint JSON |
| Bug on akashreya.space, NOT reproducible locally | Local dev is silently on fallback data (backend not running) | **Trap 2 FIRST — run the backend locally. Do not open browser automation on prod.** |
| Section blank / missing / empty list | Null guard gap vs API shape mismatch vs unseeded endpoint | Trap 3 decision tree |
| Playwright screenshots show invisible content | `.reveal` elements start at opacity 0; tests must inject the disable-animations CSS | Trap 4 |
| Theme/mode/tone flicker, ignored URL params, localStorage weirdness | ThemeProvider init logic | Trap 5 |
| Reveal animations re-fire / jank on every state change | useReveal deps passed as array literal | Trap 6 |
| Pressing `T` does nothing; `M` toggles the "wrong" thing | Flag-dependent shortcuts, working as coded | Trap 7 |
| Fixed the data but site still shows old data | 5–10 min TTL in-memory cache | Trap 8 |
| Toggling mode on a case-study page doesn't change the copy | **Fixed 2026-07-11** — see Trap 9 for what it used to be | Trap 9 |
| SideQuests/HeroTicker/personal anything missing | `PERSONAL_MODE_ENABLED = false` — not a bug | See `portfolio-personal-mode-campaign` |

Before proposing any fix, also load `superpowers:systematic-debugging`. Any fix that changes behavior ships through the deploy gate (Playwright green + manual dev-server check before push to main) — see `portfolio-build-run-deploy`.

---

## Trap 1 — React error #31: unresolved voiced field

**Symptom.** Minified prod crash `Minified React error #31` (dev: "Objects are not valid as a React child"), or a string slot rendering `[object Object]`.

**Cause.** The backend can serve any text field as a voice wrapper `{recruiter: "...", personal: "..."}`. Rendering that object as a React child crashes. Resolution happens in `src/api/client.js`:

- `pickVoice(field, mode)` (`client.js:23-34`) — unwraps one field; fallback chain: requested mode -> recruiter -> personal.
- `deepResolveVoice(node, mode)` (`client.js:86-95`) — recursively unwraps wrappers anywhere in a tree. Case studies go through this (`normalizeCaseStudy`, `client.js:97-99`).
- `resolveVoice(siteData, mode)` (`client.js:132-154`) — handles `/api/site`; detects the v3 top-level `{recruiter:{...}, personal:{...}}` split (`client.js:137`) vs v2 per-field wrappers, merging over fallback.

**The saga (2026-06-30 -> 07-03, six deploys for one data-shape mismatch — the full story, so you don't repeat it):**

1. `21f2dfd` — first guard: `resolveVoice` merges API data over fallback; optional-chain `quote?.pre`.
2. `4a7f2d3` (6 min later) — pivot to gatekeeping: `fetchSite` validates shape, returns fallback wholesale if not v3. **Accidentally reverts the merge from step 1** — a regression shipped inside a fix.
3. `b120b40` — gate too loose (v2 flat shapes slipped through `?? data`); tightened to require `data.recruiter.hero.stats` array.
4. `1b8c840` — re-applies the merge that step 2 reverted.
5. `86beafa` — strategy change: **stop rejecting shapes, resolve them.** Gate deleted; `pickVoice` born; root cause named in the commit message ("voiced strings like brand.tagline became objects").
6. `6e97326` — same bug class, second endpoint: projects grid `shortDescription`. "Not reproducible locally" noted in the commit — this blind spot birthed Trap 2's protocol.
7. `269fe0b` — third endpoint: case studies, field-by-field patching (`overview.lede`, `problem.body`, `outcome.body`).
8. `06bd26f` — field-by-field abandoned; `deepResolveVoice` closes the whole class for case studies.

**Lessons encoded:** (a) never render an API string slot without it passing through pickVoice/deepResolveVoice/resolveVoice; (b) don't shape-gate at fetch time — resolve at read time; (c) when the same class hits a third endpoint, generalize, don't patch.

**Discriminating experiment.** Hit the endpoint raw and look for wrappers:

```powershell
# adjust base URL to whatever the running frontend actually points at
Invoke-RestMethod http://localhost:8080/api/site | ConvertTo-Json -Depth 10 | Select-String -Pattern '"recruiter"'
```

Wrapper present + crash = a render path bypasses resolution. Grep the crashing component for the field name; trace back to which fetch fed it.

**FIXED 2026-07-11** (was: "Known live asymmetry, unverified whether intentional"): the projects-grid `desc` used to be hard-pinned to recruiter voice — `pickVoice(rawDesc, 'recruiter')` at `client.js:10`. Now `normalizeProject` keeps the raw voiced value and `Projects.jsx` resolves it per-mode at render via the now-exported `pickVoice`. Confirmed live: personal-voice `shortDescription` renders correctly in personal mode. The `projects` cache key is still not mode-keyed — no longer needed, since resolution moved from fetch-time to render-time.

---

## Trap 2 — Prod-only bug: run the backend locally FIRST

**Symptom.** Reproduces on https://akashreya.space, not on `npm run dev`.

**Why this protocol exists.** During the Trap 1 saga, local dev had no backend running, so every fetch silently fell back to `src/data/fallback.js` (flat, un-voiced strings) — the bug was literally invisible locally. Hours were burned debugging the minified prod bundle through browser automation when running the backend locally would have shown the voiced `shortDescription` immediately (`6e97326` commit message records this).

**Protocol (do this before ANY prod investigation):**

```powershell
# 1. Start the backend (source: E:\Work\Code\GitHub\projectservice — internals out of scope here;
#    see portfolio-api-and-fallback for backend topology)
# 2. Point the frontend at it — .env.local already contains this (verified 2026-07-10):
Get-Content E:\Work\Code\GitHub\akashreya-portfolio\.env.local   # VITE_API_URL=http://localhost:8080
# 3. Run the frontend
npm run dev
```

Now DevTools Network shows real API payloads with real shapes. Reproduce, fix, verify locally, then ship through the deploy gate.

**How to confirm you're on fallback (the trap itself):** console shows `⚠️ VITE_API_URL not set, using fallback` (`src/api/axios.js:6`) or `GET /api/... failed, using fallback` warnings (`client.js:56,69,113,127`). If you see those, you are NOT looking at prod-shaped data.

**Prod API base:** https://projectsapi.akashreya.space. **https://projects.akashreya.space is the ADMIN UI, not an API.** `deploy.yml:36` used to fall back to that admin-UI URL when the `VITE_API_URL` secret was unset; **fixed 2026-07-11** — it now falls back to `https://projectsapi.akashreya.space` instead (owned by `portfolio-build-run-deploy`). If prod fetches 404/CORS-fail across the board, check which base URL got baked into the bundle — should no longer be the admin UI even if the secret is missing.

---

## Trap 3 — Blank or missing section: three lookalike causes

Decision tree, fastest discriminator first:

**Step 1 — Is it fallback data at all?** Check console for the `failed, using fallback` warnings (Trap 2). If yes, the API is down/unreachable/empty; the section content is whatever `src/data/fallback.js` has.

**Step 2 — Empty response vs missing field?**
- `fetchProjects`/`fetchMentions` treat an EMPTY ARRAY as failure and throw -> fallback (`client.js:65,123`). An unseeded-but-live endpoint therefore shows fallback content, not a blank section.
- `/api/sidequests` and `/api/ticker`: built on the backend but UNSEEDED, and **the frontend never calls them anyway** (as of 2026-07-10 no fetch exists in `src/`; `HeroTicker.jsx:1-12` and `SideQuests.jsx:13-21` are hardcoded). If someone reports "sidequests data wrong", it's the hardcoded array, not an API. Endpoint catalog: `portfolio-api-and-fallback`.

**Step 3 — Shape mismatch?** `/api/site` has NO fetch-time shape validation (`client.js:49-59`) — an empty object `{}` would be cached 10 min and resolve field-by-field to fallback via the v2 branch. Compare raw payload against both shapes `resolveVoice` handles (v3 top-level split at `client.js:137`, v2 per-field otherwise).

**Step 4 — Null guard gap?** History of exactly this:
- `ef9da75` — CaseStudyPage: unguarded `.map`s on `metrics`/`decisions.items`/`process.phases`/`links`, a `tradeoffs.title` that no data source ever had, per-render `sectionIds` re-registering the scroll spy, and a silent empty `.catch`. All fixed; guards look like `(study.metrics ?? []).map` (`CaseStudyPage.jsx:153,207,232,276`).
- `97d291e` — sweep: `(items ?? []).map` in NavPill/Principles/Enterprise; InTheWildPage initial state seeded with `fallbackMentions` (`InTheWildPage.jsx:58`) to kill the "No mentions in this category yet." flash before fetch resolves.

If you add a section that maps over API data, guard it the same way, or you're re-opening this trap.

**FIXED 2026-07-11** (was: "Known gap"): `fallbackSitePersonal` used to have no `nav` key (`fallback.js:682-736`) — personal mode with the API down yielded an empty NavPill (NavPill's `items ?? []` guard made it blank, not crashed). It now sets `nav: fallbackSite.nav` and `enterprise: fallbackSite.enterprise` (references to the recruiter fallback, so the two can't drift apart).

---

## Trap 4 — Reveal elements invisible or flaky in Playwright

**Mechanism.** Elements with `.reveal` start hidden (opacity 0) until `useReveal`'s IntersectionObserver adds `.in-view` (`src/hooks/useReveal.js`). Screenshots taken before intersection fire capture blank sections.

**The fix that exists:** `tests/playwright-viewport.spec.ts:15-53` defines `DISABLE_ANIMATIONS` CSS — `.reveal { opacity: 1 !important; transform: none !important; }` plus letter-drop, ticker, blob, mode-transition, mention, and sq-node neutralizers — injected via `page.addStyleTag` (`spec.ts:65`) after React mounts (polled via `#hero` existing, `spec.ts:64`). Config also sets `reducedMotion: "reduce"` (`playwright.config.js:18`).

**Triage.** If a NEW test shows invisible content: you forgot `addStyleTag(DISABLE_ANIMATIONS)`, or you added a new animated element whose selector isn't in that CSS block — add it there, not in product CSS. Baseline mechanics, diff reading, and the update-baseline.ps1 flow: `portfolio-visual-testing`.

**FIXED 2026-07-11** (was: "Adjacent gotcha, unverified by running the suite"): the spec iterates `modes = ['recruiter', 'personal']` and asserts `#sidequests` in personal mode (`spec.ts:77-81`), but `PERSONAL_MODE_ENABLED=false` forces recruiter regardless of `?mode=personal` (`ThemeProvider.jsx:12-14`). The spec used to hard-fail on `#sidequests` when the flag is off; it now imports `PERSONAL_MODE_ENABLED` and calls `test.skip(...)` for personal cases when the flag is off, so those cases skip instead of failing. Personal baselines (42 files) still require a flag-on run to regenerate — see `portfolio-visual-testing`.

---

## Trap 5 — ThemeProvider render side-effects (fixed; don't reintroduce)

**Story (`0fd75bc`).** `new URL(window.location.href)` and `localStorage.getItem()` ran in the component body on EVERY render; only the first render's values were consumed by `useState`. Wasted work plus a footgun. Fix: both moved into `useState(() => ...)` lazy initializers; `0177b6e` then hoisted URL parsing to module level (`_startParams`, `ThemeProvider.jsx:7`).

**Current init contract (verified 2026-07-10, `ThemeProvider.jsx:10-22`):**
- mode: flag ON -> `?mode=` param > localStorage `akashreya.mode` > `recruiter`; flag OFF -> **hard-forced `recruiter`**, URL and localStorage ignored.
- tone: `?tone=` param > localStorage `akashreya.tone` > `dark`.
- URL params are read ONCE at module load — changing the query string without a full reload does nothing.

**Rule.** Anything reading `window`/`localStorage` for initial state goes inside a `useState` lazy initializer, never the component body.

---

## Trap 6 — useReveal observer recreation (fixed; don't reintroduce)

**Story (`aabf4e7`).** Callers wrote `useReveal([site, projects])` — a fresh array literal every render, never referentially equal, so the effect re-fired and the IntersectionObserver was torn down and recreated on every render. Fix: rest params — signature is `useReveal(...deps)` (`useReveal.js:3`), deps spread through to the effect (`useReveal.js:37`, with an eslint-disable), callers pass values directly: `useReveal(site, projects, mode)` (`PortfolioPage.jsx:33`, `mode` added 2026-07-11 to fix the SideQuests-invisible-after-mode-toggle bug — a different bug than this trap, same file; see `portfolio-architecture-contract` §6 #11).

**Rule.** Call `useReveal(a, b)`, never `useReveal([a, b])` — the array form silently resurrects the churn.

---

## Trap 7 — "Keyboard shortcut broken" (it isn't)

Shortcuts are flag-dependent (`ThemeProvider.jsx:68-85`, verified 2026-07-10):

| Flag state | `M` | `T` |
|---|---|---|
| `PERSONAL_MODE_ENABLED = false` (current prod) | toggles **tone** (light/dark) | **dead** |
| `= true` | toggles **mode** (with transition overlay) | toggles tone |

CLAUDE.md's "T/M shortcuts" describes the flag-ON world. Also: CaseStudyPage and InTheWildPage render a mode-toggle navpill button that is NOT gated by the flag (`CaseStudyPage.jsx:300-307`, `InTheWildPage.jsx:135-142`) — visible but inert, because `triggerModeTransition` no-ops when the flag is off (`ThemeProvider.jsx:44`). "Button does nothing" there is current expected behavior, not a regression. Keys are ignored when focus is in an input/textarea (`ThemeProvider.jsx:70`).

---

## Trap 8 — Stale data: the TTL cache

`src/api/client.js:36-47` (added `27e7ae0`): module-level in-memory `Map`; site + projects cached 10 min, case studies + mentions 5 min. Keys: `site`, `projects`, `mentions`, `` `case:${slug}:${mode}` ``. Full semantics: `portfolio-api-and-fallback`.

Debug-relevant consequences:
- You fixed backend data but the SPA shows old content -> **hard reload** (cache is per-page-load memory, nothing persistent).
- Case-study **404 results ARE cached** for 5 min (`client.js:103-108`) — seeding a missing slug won't show until reload/expiry.
- Errors are never cached (throw happens before `_cache.set`), so fallback responses retry on next call.

---

## Trap 9 — Case study ignores mode toggle (FIXED 2026-07-11)

`CaseStudyPage.jsx:75-99`: `fetchCaseStudy(slug, mode)` is called with the current mode, but the effect deps used to be **`[slug]` only**. Toggling mode on an open case study never refetched or re-resolved voice, even though the cache was already mode-keyed. Contrast PortfolioPage, where `resolveVoice(site, mode)` runs every render (`PortfolioPage.jsx:24`) so mode toggles work without refetch.

**Fix applied:** deps changed to `[slug, mode]` (`CaseStudyPage.jsx:99`). A mode toggle on an open case study now refetches (or reads the already-warm mode-keyed cache entry) and re-resolves voice. No other change was needed — the fetch function and cache key already supported this.

---

## Closed traps you might trip over in git archaeology

| Commit | What it was |
|---|---|
| `a910b9c` | v1 JWT scaffolding in the axios request interceptor sent any same-origin localStorage `token` as a Bearer header. Removed; `axios.js` now has only a passthrough response interceptor |
| `dd99966` | Mobile: ThemeHint untappable / overlapped nav pill. Now a button, top-right on small screens |
| `77b128e` -> `c0342f3` | Vercel hosting attempt (`vercel.json`) abandoned after 22 minutes for GitHub Pages + CNAME. SPA deep links use the `public/404.html` + sessionStorage trick — owned by `portfolio-build-run-deploy` |
| `4a7f2d3` / `b120b40` | The fetch-time shape gate (`recruiter.hero.stats` check). **Lived ~66 minutes on 2026-06-30 and no longer exists** — if a doc references it, the doc is stale. Current code branches-and-resolves in `resolveVoice` instead |

---

## Provenance and maintenance

All file:line references verified against working tree `main` @ `27e7ae0` on 2026-07-10. Re-verify before trusting:

```powershell
# Flag state (Trap 7, personal-mode anything)
Get-Content src\config.js
# Voice resolution still lives where this doc says (Trap 1)
Select-String -Path src\api\client.js -Pattern 'pickVoice|deepResolveVoice|resolveVoice' | Select-Object LineNumber, Line
# Grid desc still resolves per-mode at render, not pinned to recruiter (Trap 1 asymmetry, fixed 2026-07-11)
Select-String -Path src\api\client.js -Pattern "desc: rawDesc"
# Cache TTLs and keys (Trap 8)
Select-String -Path src\api\client.js -Pattern 'TTL_|withCache\('
# Case-study effect deps still [slug, mode] (Trap 9, fixed 2026-07-11)
Select-String -Path src\pages\CaseStudyPage.jsx -Pattern '\}, \[slug, mode\]\);'
# Null guards still in place (Trap 3)
Select-String -Path src\pages\CaseStudyPage.jsx,src\components\NavPill.jsx,src\sections\Principles.jsx,src\sections\Enterprise.jsx -Pattern '\?\? \[\]\)\.map'
# Test opacity injection (Trap 4)
Select-String -Path tests\playwright-viewport.spec.ts -Pattern 'DISABLE_ANIMATIONS|addStyleTag'
# deploy.yml fallback URL still the admin UI (Trap 2)
Select-String -Path .github\workflows\deploy.yml -Pattern 'VITE_API_URL'
# Saga archaeology
git log --oneline 21f2dfd..06bd26f
```
