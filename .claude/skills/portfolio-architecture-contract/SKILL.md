---
name: portfolio-architecture-contract
description: >
  Defines the load-bearing design rules of akashreya-portfolio and why they exist: the
  mode/tone/voice axis system (recruiter vs personal, light vs dark) and the voiced-field
  wire format, the M/T keyboard shortcuts and what the PERSONAL_MODE_ENABLED kill switch
  changes, the API-with-static-fallback invariant every feature must honor, the decision
  register, and the list of open known issues. Load before adding any section, component
  or page; before reading useTheme() or rendering API data; when "theme", "mode", "tone",
  "voice" or "voiced field" get confused; when asking whether something is a known bug or
  tech debt; or for questions like "does the site work offline", "what does the feature
  flag do", "why is there a recruiter/personal split".
---

# Portfolio Architecture Contract

The rules every change to `akashreya-portfolio` must respect, with the reason for each. When this skill and `src/` disagree, `src/` wins and this file gets fixed.

| Doing instead | Load |
|---|---|
| Debugging a live symptom | `portfolio-debugging-playbook` |
| Endpoint shapes, pickVoice internals, cache TTL, fallback.js sync | `portfolio-api-and-fallback` |
| Env, build, deploy gate, GitHub Pages, 404.html routing | `portfolio-build-run-deploy` |
| Playwright baselines | `portfolio-visual-testing` |
| Tokens, copy location, personal-mode identity, Design/ map | `portfolio-theme-and-content` |

## 1. Vocabulary

| Term | Values | Meaning | Lives in |
|---|---|---|---|
| mode | `recruiter` \| `personal` | Identity axis: which persona the site presents. Controls fonts, colors, copy voice, and which components render. | top-level keys of `themes` in `src/theme/themes.js`; `data-mode` on `<html>` |
| tone | `light` \| `dark` | Brightness axis within a mode. | per-mode maps in `themes.js`; `data-tone` on `<html>` |
| voice | `recruiter` \| `personal` | Content dimension of mode: which text variant is shown. Always equals the active mode. | `pickVoice`, `deepResolveVoice`, `resolveVoice` in `src/api/client.js` |
| voiced field | `{recruiter: T, personal: T}` | API wire format for a node that varies by voice. Detected by key presence (`isVoicedWrapper`). | API payloads |
| theme | avoid | v2 word. Survives only in names (`src/theme/`, `ThemeProvider`, `useTheme`, `applyTheme`), which operate on mode + tone. | |

2 modes x 2 tones = 4 token sets, all in `themes.js`. `applyTheme(mode, tone)` writes them as CSS vars on `<html>` and stamps `data-mode`/`data-tone`; CSS keys mode-specific rules off `[data-mode="personal"]`. `ThemeProvider` owns both axes; init order is URL param (`?mode=`, `?tone=`) > localStorage (`akashreya.mode`, `akashreya.tone`) > `recruiter`/`dark`. `useTheme()` returns `{ mode, tone, setMode, setTone, triggerModeTransition, transOverlay }`. The first-paint guard in `index.html` is owned by `portfolio-theme-and-content`.

## 2. Keyboard shortcuts and PERSONAL_MODE_ENABLED

`src/config.js` exports `PERSONAL_MODE_ENABLED = true`. Personal mode is live in prod. The flag is a kill switch: set it to `false` to pull personal mode without deleting code.

| | flag `true` (current) | flag `false` |
|---|---|---|
| M | toggles mode via the `ModeTransition` overlay | toggles tone |
| T | toggles tone | nothing |
| `?mode=` / stored mode | honored | ignored, mode forced to `recruiter` at init |
| `triggerModeTransition` | runs (instant swap under reduced motion) | returns immediately |
| NavPill mode segment | shown | hidden |
| ThemeHint | shows mode and tone | tone only |

Keys are ignored while focus is in an input or textarea. Personal-only components (`AmbientBlobs`, `Chikorita`, `Footprints`, `SideQuests`, the personal branches of `Hero`, `Enterprise`, `Footer`) gate on `mode`, not on the flag. Flag off only makes them unreachable by forcing the mode.

## 3. API-with-static-fallback invariant

The site renders fully, with real content, when the backend is down. GitHub Pages serves static files; the API (`https://projectsapi.akashreya.space`) is a separate failure point the frontend refuses to depend on. Every fetcher in `client.js` catches all errors and returns data from `src/data/fallback.js` (`fetchSite` returns `null`, which `resolveVoice` replaces with the mode-matched fallback site). Empty arrays count as failures. Pages seed initial state from fallback so nothing flashes empty. Case-study detail is the only path allowed a not-found screen, and only after `fallbackCaseStudies[slug]` misses.

Obligations for any new feature:

1. If it fetches, it ships a static mirror in `fallback.js` and a catch path that returns it.
2. If it renders API data, it survives partial or null shapes: `(x ?? []).map`, optional chaining on nested access.
3. If its data can be voiced, resolve before JSX sees it (section 4).
4. Test the offline path: point `VITE_API_URL` at a dead port and load the page. Anything blank or crashing means the feature is unfinished.

Push to `main` deploys live; the gate is owned by `portfolio-build-run-deploy`.

## 4. Voiced fields reach JSX resolved, or the site crashes

One backend payload serves both personas, so any text node may arrive voiced. A voiced wrapper rendered as a React child is minified React error #31, a whole-page crash. Resolve, never validate shape: `resolveVoice` handles both the v3 top-level split and v2 per-field wrappers and merges over fallback; case studies go through `deepResolveVoice`, which unwraps any voiced node anywhere in the tree. Any new component rendering API data should assume every string may be voiced and take it through this layer, never from a raw fetch result. Per-endpoint resolution points and asymmetries are in `portfolio-api-and-fallback`.

## 5. Open known issues

| Issue | Where | Consequence |
|---|---|---|
| Mode-toggle buttons on the case-study and in-the-wild navpills are not gated by `PERSONAL_MODE_ENABLED` (NavPill's is) | `CaseStudyPage`, `InTheWildPage` (`navpill__mode` button) | With the kill switch off they render but do nothing. |
| `src/config.js` comment still reads as a pre-launch condition ("Flip to true when ...") | `src/config.js` | Misdescribes a live kill switch. |

## 6. Decision register

| Decision | Rationale | Commit |
|---|---|---|
| Two axes (mode x tone), tokens in one file, applied as CSS vars on `<html>` | Four combinations with no CSS duplication | `d0122c3` |
| Resolve voiced fields recursively instead of validating API shape | Shape gates rejected valid data and still let wrappers through; resolution tolerates whatever the backend voices | `86beafa`, `06bd26f` |
| `resolveVoice` merges API data over fallback | Partial payloads get holes filled instead of rendering `undefined` | `21f2dfd` |
| Fallback-seeded initial state; empty array = failure | No empty flash, no blank section from an unseeded endpoint | `97d291e` |
| Flag forces mode at init, not just hides UI | URL params and localStorage cannot bring a pulled mode back | `d0122c3` |
| Lazy `useState` initializers for theme init | Body-level URL/localStorage reads re-ran every render | `0fd75bc` |
| `useReveal(...deps)` rest params; include `mode` where sections remount on mode | Array-literal deps recreated the observer every render; a missing `mode` dep leaves remounted `.reveal` nodes invisible | `aabf4e7` |
| No auth machinery in axios | v1 JWT scaffolding forwarded any localStorage `token` as a Bearer header | `a910b9c` |
