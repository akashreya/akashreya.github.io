---
name: portfolio-architecture-contract
description: >
  Load FIRST when working on akashreya-portfolio and you need the load-bearing design
  decisions and why they exist: the mode/tone/voice axis system (recruiter vs personal,
  light vs dark), what PERSONAL_MODE_ENABLED actually gates, the API-with-static-fallback
  invariant every feature must honor, why voiced fields exist, and §6 — the complete
  registry of known issues / weak points / latent bugs across the whole project.
  Triggers: "known issues", "is this a known bug", "open problems", "tech debt";
  confusion between "theme", "mode", "tone", "voice", or "voiced field"; adding
  any new section/component/page; anything reading useTheme(); questions like "why does M
  toggle dark mode", "why is there a recruiter/personal split", "does the site work
  offline", "what does the feature flag do", "why does CLAUDE.md disagree with the code";
  or before trusting CLAUDE.md (it is stale — describes v2 crimson/glass, v3 is merged).
---

# Portfolio Architecture Contract

The non-negotiable design decisions of `akashreya-portfolio` (React 19 + Vite SPA, GitHub Pages at `akashreya.space`), each with its rationale and — where one exists — the incident that forged it. All file:line references verified against `main` @ working tree, 2026-07-10.

**Rule zero: CLAUDE.md is stale.** It describes v2 (crimson/glass themes, "T/M shortcuts", 4 API endpoints). v3 merged to main 2026-06-30 (`3e7867d`). When CLAUDE.md and `src/` disagree, `src/` wins. Always.

**Update 2026-07-11:** CLAUDE.md was refreshed to v3 vocabulary (mode/tone/voice, flag-gated shortcuts, v3 component list, correct handover-doc pointer) — it is no longer the stale v2 document described above. It is still a static snapshot, not the living source of truth; when it and this skill disagree, this skill (and `src/`) still wins, but the gap between them is now much smaller.

## When NOT to use this skill

| You are doing | Load instead |
|---|---|
| Debugging a live symptom (crash, blank section, wrong content) | `portfolio-debugging-playbook` |
| Working with endpoints, pickVoice internals, cache TTLs, fallback.js sync | `portfolio-api-and-fallback` |
| Setting up env, building, deploying, GH Actions, 404.html mechanics | `portfolio-build-run-deploy` |
| Running/updating Playwright visual baselines | `portfolio-visual-testing` |
| Editing theme tokens or copy, finding where text lives | `portfolio-theme-and-content` |
| Anything on the personal-mode redesign/launch campaign | `portfolio-personal-mode-campaign` |

This skill is the "why the system is shaped this way" reference. It owns two things: the axis system and the fallback invariant. Everything else here is a summary with a pointer.

## 1. The axis system — MANDATORY disambiguation

Four overlapping words. They are NOT interchangeable. Any code or prose that says "theme" is either legacy v2 vocabulary or wrong.

| Term | Values | What it is | Where it lives |
|---|---|---|---|
| **mode** | `recruiter` \| `personal` | The identity axis: which persona the whole site presents. Controls fonts, colors, copy voice, and which components render at all. | `src/theme/themes.js:2,51` (top-level keys); `document.documentElement.dataset.mode` |
| **tone** | `light` \| `dark` | The brightness axis within a mode. Each mode defines both tones. | `themes.js` `light`/`dark` maps per mode; `dataset.tone` |
| **voice** | `recruiter` \| `personal` | The *content* dimension of mode: which text variant of a piece of copy is shown. Same value set as mode; resolved from mode at render/fetch time. | `pickVoice`/`resolveVoice`/`deepResolveVoice` in `src/api/client.js` |
| **voiced field** | — | An API payload node shaped `{recruiter: T, personal: T}` instead of a flat `T`. Must be unwrapped before rendering or React crashes (error #31). | Detected by key presence (`'recruiter' in field \|\| 'personal' in field`), `client.js:23-34` |
| **theme** | (avoid) | v2 word. CLAUDE.md's "crimson/glass themes × light/dark modes" maps to today's mode × tone. The only surviving legitimate uses are file/dir names (`src/theme/`, `ThemeProvider`, `useTheme`, `applyTheme`) — those APIs now operate on mode+tone. | — |

So: **mode** picks the persona, **tone** picks brightness, **voice** is how content follows mode, **voiced field** is the wire format that makes voice possible. 2 modes × 2 tones = 4 token sets, all in `src/theme/themes.js` (single source of truth for design tokens).

### How the axes are applied

- `applyTheme(modeName, tone)` (`themes.js:101-114`) writes every token as an inline CSS var (`--bg`, `--accent`, `--font-display`, ...) on `<html>` and stamps `data-mode` + `data-tone`. CSS keys off `[data-mode="personal"]` for mode-specific rules.
- `ThemeProvider` (`src/theme/ThemeProvider.jsx`) owns both axes as state. Init order: URL param (`?mode=`/`?tone=`, read once at module load, line 7) > localStorage (`akashreya.mode`/`akashreya.tone`) > defaults (`recruiter`/`dark`). Lazy `useState` initializers — that's deliberate; side effects in the component body caused re-runs every render (incident: `0fd75bc`).
- FOUC guard: `index.html` hardcodes `data-mode="recruiter" data-tone="dark"` plus inline recruiter-dark CSS vars so the first paint is correct before React mounts.
- Context: `useTheme()` returns `{ mode, tone, setMode, setTone, triggerModeTransition, transOverlay }`.

### Keyboard shortcuts — flag-dependent (as of 2026-07-10, flag OFF)

| Flag state | M key | T key |
|---|---|---|
| `PERSONAL_MODE_ENABLED = false` (prod today) | toggles **tone** | does nothing |
| `PERSONAL_MODE_ENABLED = true` | toggles **mode** (via transition overlay) | toggles tone |

Source: `ThemeProvider.jsx:68-85`. CLAUDE.md's "T/M keyboard shortcuts" is only true when the flag is on. Keys are ignored when focus is in an input/textarea.

## 2. PERSONAL_MODE_ENABLED — exactly what it gates

`src/config.js` (the entire file, 3 lines): `export const PERSONAL_MODE_ENABLED = false;` in git as of 2026-07-11 (the owner's working tree flips it locally to work on personal mode). **The flag's written gate — "flip when /api/sidequests + /api/ticker are live and seeded" — is MET as of 2026-07-11**; the redesign (parchment identity) has landed. Launch = commit the flip via the launch protocol in `portfolio-personal-mode-campaign` (e), on the owner's word, behind the deploy gate. Still: never commit the flip as a side effect of any other task.

What `false` enforces:

| Gated | Mechanism |
|---|---|
| Mode is hard-forced to `recruiter` | `ThemeProvider.jsx:12-14` — URL param and localStorage are ignored when flag is off |
| Mode transitions are no-ops | `triggerModeTransition` returns immediately (`ThemeProvider.jsx:44`) |
| NavPill hides its mode-toggle segment | `NavPill.jsx:56` |
| ThemeHint label shows tone-only hint | `ThemeHint.jsx:16-21` |
| M key toggles tone instead of mode | `ThemeProvider.jsx:77-80` |

What the flag does **not** gate (traps):

- **Personal-only components self-gate on `mode`, not the flag**: `AmbientBlobs.jsx:5`, `ConsoleLine.jsx:5`, `SideQuests.jsx:29` all `return null` unless `mode === 'personal'`, and `Hero`/`Enterprise`/`Footer`/`Projects`/`Principles` branch on `mode`. They're unreachable only because mode is forced to recruiter. Flip the flag and all of it lights up at once.
- **CaseStudyPage and InTheWildPage render an UNGATED mode-toggle button** (`CaseStudyPage.jsx:302`, `InTheWildPage.jsx:137`) — visible in prod, inert only because `triggerModeTransition` no-ops. Known inconsistency vs the gated NavPill.
- **Sidequests/ticker are API-driven as of 2026-07-11.** The config comment's condition ("flip when /api/sidequests + /api/ticker are live and seeded") is now MET: the backend was seeded (prod, 7 nodes / 9 lines) and `fetchSideQuests`/`fetchTicker` exist in `client.js` with `fallbackSideQuests`/`fallbackTicker` mirrors — the old hardcoded arrays are gone. SideQuests' fetch is mode-gated (recruiter mode makes zero calls); HeroTicker only mounts in the personal Hero branch. See `portfolio-api-and-fallback` and `portfolio-personal-mode-campaign`.

## 3. The API-with-static-fallback invariant

**Contract: the site must render fully, with real content, when the backend is down.** GitHub Pages serves static files; the backend (`https://projectsapi.akashreya.space`, source at `E:\Work\Code\GitHub\projectservice` — internals out of scope) is a separate single point of failure the frontend refuses to depend on.

Implementation (deep detail in `portfolio-api-and-fallback`):

- Every fetch in `src/api/client.js` has a catch-all that returns fallback data from `src/data/fallback.js` (or `null` for `/api/site`, which `resolveVoice` then replaces with the mode-matched fallback, `client.js:132-134`).
- Empty-array responses are treated as failures (`client.js:65,123`) — an unseeded endpoint degrades to fallback, not to a blank section.
- Pages seed initial state with fallback data (`PortfolioPage.jsx` seeds `fallbackProjects`; `InTheWildPage.jsx` seeds `fallbackMentions`) so there is no empty flash before fetch resolves (incident: `97d291e` killed the "No mentions in this category yet." flash).
- Only case-study detail is allowed a "not found" screen instead of fallback content, and even it tries `fallbackCaseStudies[slug]` first (`client.js:112-116`).

**What this obligates every new feature to do:**

1. If it fetches, it ships a static mirror in `fallback.js` and a catch path that uses it. No exceptions.
2. If it renders API data, it survives partial/null shapes: `(x ?? []).map`, optional chaining on every nested access. Two full null-guard sweeps (`ef9da75`, `97d291e`) exist because this wasn't done the first time.
3. If its data can be voiced, resolution happens **before** JSX sees it (see §4).
4. Test the offline path: stop the backend (or set `VITE_API_URL` to a dead port) and load the page. If anything is blank or crashes, the feature is not done.

Related invariant: **push-to-main = live deploy** (GH Actions builds and publishes on every main push). The deploy gate — Playwright green + manual dev-server check before pushing — is owned by `portfolio-build-run-deploy`.

## 4. Voiced fields — why they exist and where resolution must happen

Why: one backend payload serves two personas. Rather than duplicate every endpoint per mode, any text node may arrive as `{recruiter: "...", personal: "..."}` and the client unwraps it for the active mode.

The architecture-level rule, paid for in blood: **a voiced wrapper must never reach JSX.** Rendering `{recruiter, personal}` as a React child is minified React error #31 — the site's worst outage class (six deploys, 2026-06-30 → 07-03, commits `21f2dfd` → `06bd26f`). The saga's arc: guard → shape-gate (which accidentally reverted the guard) → tighten gate → restore guard → abandon gating entirely and *resolve* instead → chase the same bug through three endpoints → generalize recursively. The surviving design:

- Reject nothing; resolve everything. `fetchSite` has no shape validation; `resolveVoice` (`client.js:132-154`) branch-detects v3 top-level `{recruiter:{...}, personal:{...}}` split vs v2 per-field wrappers and handles both, merged over fallback.
- Case studies get `deepResolveVoice` (`client.js:86-95`) — recursive unwrap of any voiced node anywhere in the tree, "regardless of which fields the backend chooses to voice" (`06bd26f`).
- Resolution points differ by endpoint (site: per-render in `resolveVoice`, so mode toggles re-voice without refetch; case studies: at fetch time with mode-keyed cache). Semantics, asymmetries (project-grid desc is pinned to recruiter voice at `client.js:10`), and the TTL cache are owned by `portfolio-api-and-fallback`.

If you add a component that renders API data: assume any string field might arrive voiced, and route it through the existing resolution layer rather than reading raw fetch results.

## 5. GH Pages SPA routing (summary)

GitHub Pages has no rewrite rules, so deep links like `/work/poketopia` would 404. The trick: `public/404.html` saves `location.pathname + search + hash` to `sessionStorage['spa-redirect']` and redirects to `/`; the inline script in `index.html:51-58` restores it via `history.replaceState` before React Router mounts. History: a Vercel hosting attempt lived 22 minutes (`77b128e` → `c0342f3`, 2026-06-30) before committing to Pages + custom domain (`public/CNAME` = `akashreya.space`). Operational detail — deploy pipeline, custom-domain DNS, testing the trick — is owned by `portfolio-build-run-deploy`.

## 6. Known weak points and open issues (documented, unfixed as of 2026-07-10)

This table is the **complete registry** of known issues across the project. Rows that another
skill owns give a one-liner here and defer detail to that skill — do not duplicate treatment.

**Status column added 2026-07-11**, when 6 of these 11 items were fixed in one pass (verified: lint clean, `npm run build` succeeds, and A1/A4 confirmed live in-browser via a client-side mode toggle). Fixed rows are kept in the table — with what changed and where — rather than deleted, since the row is still useful project history and the "why this existed" reasoning still applies to any regression.

| # | Weakness | Location | Consequence | Status |
|---|---|---|---|---|
| 1 | Deploy workflow used to fall back to the **admin UI** URL, not the API, when the `VITE_API_URL` secret is unset: `secrets.VITE_API_URL \|\| 'https://projects.akashreya.space'`. The API is `https://projectsapi.akashreya.space`; `projects.` is the content-entry admin UI. | `.github/workflows/deploy.yml:36` | If the secret is ever deleted, prod would silently build against a non-API host and every fetch would fall back. | **FIXED 2026-07-11** (owner-requested, after initially being excluded — owner's call: "doesn't make sense to fall back on a UI"). Fallback changed to `https://projectsapi.akashreya.space`. If the secret is ever unset, the build now falls back to the real API host instead of the admin UI. |
| 2 | `fallbackSitePersonal` has no `nav` (and no `enterprise`) key | `fallback.js:682-736` | Personal mode + backend down (v2-shape path) → `resolved.nav` undefined → empty NavPill (guarded against crash by `items ?? []`, `NavPill.jsx`). Latent until flag flips. | **FIXED 2026-07-11** — `fallbackSitePersonal` now sets `nav: fallbackSite.nav` and `enterprise: fallbackSite.enterprise` (references, not copies, to avoid drift). Offline personal mode now renders both. |
| 3 | CaseStudyPage fetch effect deps are `[slug]` only, though voice resolution is mode-dependent | `CaseStudyPage.jsx:99` | Toggling mode on an open case study doesn't re-voice it. Inert while flag is off; unverified whether intentional. Detail: `portfolio-api-and-fallback`. | **FIXED 2026-07-11** — deps changed to `[slug, mode]`; a mode toggle on an open case study now refetches/re-resolves (mode-keyed cache already existed, only the missing dep was the bug). |
| 4 | Ungated mode-toggle buttons on CaseStudyPage/InTheWildPage navpills | `CaseStudyPage.jsx:302`, `InTheWildPage.jsx:137` | Visible-but-inert UI in prod; becomes live the moment the flag flips. | **OPEN** — out of scope for the 2026-07-11 pass. |
| 5 | `.env.production` contains placeholder `https://your-production-api.com`; both `.env` and `.env.production` are **UTF-16 LE encoded**, which Vite's dotenv cannot parse (expects UTF-8) — inert either way | `.env.production:1`, `.env` | A local `npm run build` without env override bakes a dead API URL (CI overrides it). Never rely on these files; use `.env.local` (UTF-8). Detail: `portfolio-build-run-deploy`. | **FIXED 2026-07-11, revised approach.** First pass rewrote `.env.production` as UTF-8 with a real URL — then the owner pointed out CI never reads this file at all (it sets `VITE_API_URL` as a process env var, which always wins over any `.env.*` file), so committing a real URL there was pointless and env files with real values shouldn't be tracked regardless. Final fix: `.env.production` **deleted** (untracked + removed from disk), `.gitignore` now also ignores plain `.env.production` (it previously only listed `.env.production.local`, which is why this file got committed in the first place), and a value-free `.env.example` added as the committed template. `.env` untouched (already gitignored, `.env.local` covers dev). |
| 6 | CLAUDE.md describes v2 | `CLAUDE.md` | Any agent trusting it will use wrong vocabulary (theme/mode), wrong shortcut map, and miss 8 v3 components. | **FIXED 2026-07-11** — refreshed to v3 vocabulary, flag-gated shortcut table, full v3 component list, corrected `Design/API_HANDOVER_v3.md` pointer, and a pointer to `.claude/skills` as the living source of truth. See "Rule zero" note above — it's a scoped refresh, not a guarantee of permanent parity with `src/`. |
| 7 | `update-baseline.ps1` (`npm run update-baseline`) is **stale and destructive** — its regexes target a spec shape that no longer exists; running it would wipe baselines and copy nothing back (verified by inspection, not execution) | `update-baseline.ps1` | Never run it. Use `npx playwright test --update-snapshots tests/playwright-viewport.spec.ts` instead. Detail: `portfolio-visual-testing`. | **FIXED 2026-07-11** — file deleted (owner-confirmed before deletion, since it was a tracked file). `npm run update-baseline` now runs `playwright test --update-snapshots tests/playwright-viewport.spec.ts` directly. |
| 8 | The personal half of the visual suite (42 baselines) likely **fails while the flag is off**: specs assert `#sidequests` in personal mode, but `PERSONAL_MODE_ENABLED=false` hard-forces recruiter (`ThemeProvider.jsx:12-15`), so `SideQuests` returns `null` | `tests/playwright-viewport.spec.ts` | Verified by code reading, not runtime (suite not executed 2026-07-10). Blocks "full suite green" as a deploy-gate reading until resolved or scoped to recruiter tests. Detail: `portfolio-visual-testing`. | **FIXED 2026-07-11** — spec now imports `PERSONAL_MODE_ENABLED` and calls `test.skip(mode === 'personal' && !PERSONAL_MODE_ENABLED, ...)`, so personal cases **skip** (not fail) when the flag is off. Note: `tests/` is gitignored, so this fix is local-only, same as the spec file itself. |
| 9 | Frontend never fetches `/api/sidequests` or `/api/ticker` — content was hardcoded; endpoints were unseeded | `SideQuests.jsx`, `HeroTicker.jsx`, `client.js` | Flag-flip alone would have shipped hardcoded content. | **FIXED 2026-07-11** — owner seeded prod via the admin UI (7 nodes / 9 lines, content differs from the old arrays); `fetchSideQuests`/`fetchTicker` wired per the fallback invariant (`fallbackSideQuests`/`fallbackTicker` mirrors, empty-array = failure); hardcoded arrays deleted; empty/down/recruiter states verified in-browser. Residuals: prod API 403s localhost origins (dev can't hit prod — CORS), and `Design/seed_data` JSONs mirror the OLD content (relics). Detail: `portfolio-api-and-fallback`. |
| 10 | Projects-grid `desc` is hard-pinned to recruiter voice and the `projects` cache key is not mode-keyed | `client.js:10`, `client.js:63` | Personal-voice `shortDescription` never renders on the grid as written. Intent unverified — decide before personal-mode launch. Detail: `portfolio-api-and-fallback`. | **FIXED 2026-07-11** — `normalizeProject` now keeps the raw voiced value (`desc: rawDesc`); `pickVoice` is exported from `client.js` and `Projects.jsx` resolves `desc` per-mode at render (`pickVoice(p.desc, mode)`). Cache key unchanged (`projects`, not mode-keyed) — no longer needed since resolution moved to render time. Confirmed live: personal-voice grid copy renders correctly in personal mode. |
| 11 | `SideQuests` stays **invisible after a mode toggle**: `useReveal(site, projects)` deps (`PortfolioPage.jsx:31`) don't include `mode`, so when `SideQuests` remounts on M-toggle its `.reveal` nodes are never observed and hold `opacity: 0` (confirmed live on dev 2026-07-10: both sidequests reveals were the page's only `.reveal:not(.in-view)` elements, an ~830px blank band between Projects and Principles) | `PortfolioPage.jsx:31`, `SideQuests.jsx:29` | The entire obsessions board silently vanishes on the most common personal-mode path (arrive → toggle M). Feeds the "personal mode feels too thin" perception. Fix candidate: add `mode` to `useReveal` deps. | **FIXED 2026-07-11** — applied the fix candidate: `useReveal(site, projects, mode)`. Confirmed live in-browser: obsessions board renders fully, no blank band, immediately after an M-toggle. |

## 7. Decision register — what/why/incident

| Decision | Rationale | Incident behind it |
|---|---|---|
| Two axes (mode × tone), tokens in one file, applied as CSS vars on `<html>` | 4 combinations from 2×2, zero CSS duplication; components style off vars + `[data-mode]` selectors | — (v3 design, `d0122c3`) |
| Resolve voiced fields recursively instead of validating API shape | Shape gates broke twice in one morning (too loose, then too strict) and rejected valid data; resolution is robust to whatever the backend voices | React #31 saga, `86beafa` + `06bd26f` |
| resolveVoice merges API data **over** fallback | Partial API payloads (e.g. seed site.json has no `enterprise`) get holes filled instead of rendering undefined | `21f2dfd`, reverted by accident in `4a7f2d3`, restored in `1b8c840` |
| Fallback-seeded initial state, empty-array = failure | No blank flash, no blank section from an unseeded endpoint | `97d291e` |
| Feature flag hard-forces mode at init, not just hides UI | URL params/localStorage can't smuggle an unfinished mode into prod | v3 gating decision, `d0122c3` |
| Lazy useState initializers for theme init | URL/localStorage reads ran every render, only first render's values used | `0fd75bc` |
| `useReveal(...deps)` rest params | Array-literal deps recreated the IntersectionObserver every render | `aabf4e7` |
| No auth machinery in axios | v1 JWT scaffolding forwarded any same-origin localStorage `token` as a Bearer header | `a910b9c` |
| GH Pages + 404.html trick over Vercel | (Rationale unrecorded in git; owner calls Vercel a dead end) | `77b128e` → `c0342f3` |

## Provenance and maintenance

Verified against working tree of `main` @ `27e7ae0`, 2026-07-10. Re-verify volatile facts before relying on them (PowerShell — use `;`, not `&&`):

| Fact | Re-verify with |
|---|---|
| Flag state | `Get-Content E:\Work\Code\GitHub\akashreya-portfolio\src\config.js` |
| Mode/tone axes + shortcut map | `Get-Content E:\Work\Code\GitHub\akashreya-portfolio\src\theme\ThemeProvider.jsx` (init lines 10-22, keys lines 68-85) |
| Voice resolution shape handling | `Get-Content E:\Work\Code\GitHub\akashreya-portfolio\src\api\client.js` (resolveVoice at bottom, deepResolveVoice ~line 86) |
| Deploy fallback URL misconfig | `Select-String -Path E:\Work\Code\GitHub\akashreya-portfolio\.github\workflows\deploy.yml -Pattern 'VITE_API_URL'` |
| Ungated mode toggles still present | `Select-String -Path E:\Work\Code\GitHub\akashreya-portfolio\src\pages\*.jsx -Pattern 'triggerModeTransition'` |
| Sidequests/ticker still fetched by frontend (fixed 2026-07-11) | `Select-String -Path E:\Work\Code\GitHub\akashreya-portfolio\src\api\client.js -Pattern 'fetchSideQuests\|fetchTicker'` (expect both) |
| fallbackSitePersonal still has `nav`/`enterprise` (fixed 2026-07-11) | `Select-String -Path E:\Work\Code\GitHub\akashreya-portfolio\src\data\fallback.js -Pattern 'fallbackSitePersonal' -Context 0,60` — expect `nav: fallbackSite.nav` and `enterprise: fallbackSite.enterprise` near the end of the object |
| Grid desc still resolves per-mode (fixed 2026-07-11) | `Select-String -Path E:\Work\Code\GitHub\akashreya-portfolio\src\api\client.js -Pattern 'desc: rawDesc'` (a hit confirms the fix; a hit for `pickVoice(rawDesc, 'recruiter')` would mean it regressed) |
| Case-study effect deps still `[slug, mode]` (fixed 2026-07-11) | `Select-String -Path E:\Work\Code\GitHub\akashreya-portfolio\src\pages\CaseStudyPage.jsx -Pattern '\}, \[slug, mode\]\);'` |
| useReveal on PortfolioPage still includes `mode` (fixed 2026-07-11) | `Select-String -Path E:\Work\Code\GitHub\akashreya-portfolio\src\pages\PortfolioPage.jsx -Pattern 'useReveal\('` |
| update-baseline.ps1 still deleted (fixed 2026-07-11) | `Test-Path E:\Work\Code\GitHub\akashreya-portfolio\update-baseline.ps1` (expect `False`) |
