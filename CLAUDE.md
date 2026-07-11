# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**For anything beyond a quick orientation, load `.claude/skills` first** — it's the maintained source of truth (known issues, architecture rationale, debugging playbook, API/fallback semantics, deploy/testing mechanics). This file is a static map; the skills are the living one. Start with `portfolio-architecture-contract` if you need the "why."

## Development Commands

- **Development server**: `npm run dev` - Starts Vite dev server on localhost:5173
- **Build**: `npm run build` - Creates production build using Vite
- **Lint**: `npm run lint` - Runs ESLint on the codebase
- **Preview**: `npm run preview` - Preview production build locally
- **Visual tests**: `npm run test:visual` - Runs Playwright visual regression tests across 7 viewports
- **All tests**: `npm run test` - Runs complete Playwright test suite
- **Update test baselines**: `npx playwright test --update-snapshots tests/playwright-viewport.spec.ts` - Regenerate baselines

## Project Architecture

This is a React 19 + Vite portfolio website. v3 is current on `main` (merged 2026-06-30): the mode/tone/voice system below, plus the personal-mode components. v1 is archived as git tag `v1.0.0`. The "Bloomberg Terminal" aesthetic from earlier redesigns — serif display face, floating pill nav, multi-page routing — still holds.

### Tech Stack
- **Frontend**: React 19 + Vite
- **Routing**: React Router v7 (BrowserRouter, three routes)
- **Styling**: Plain CSS with CSS custom properties (no Tailwind). Three stylesheets: `portfolio.css`, `case-study.css`, `said.css`
- **Fonts**: Instrument Serif (display), Manrope (body), IBM Plex Mono (mono) - loaded from Google Fonts
- **HTTP Client**: Axios (`src/api/axios.js`) with fallback strategy
- **Testing**: Playwright visual regression, 7 viewports

### Routes
| Path | Component | Description |
|---|---|---|
| `/` | `PortfolioPage` | Main portfolio: hero, projects grid, principles, enterprise, footer |
| `/work/:slug` | `CaseStudyPage` | Full case study for a project (fetched from API) |
| `/in-the-wild` | `InTheWildPage` | Mentions, recommendations, references with filter |

### Mode / Tone / Voice System
Three distinct, non-interchangeable axes — see `portfolio-architecture-contract` skill for full detail:
- **mode** (`recruiter` \| `personal`): the identity axis — which persona the site presents. Controls fonts, colors, copy voice, and which components render at all.
- **tone** (`light` \| `dark`): the brightness axis within a mode.
- **voice**: the content dimension of mode — resolved from mode via `pickVoice`/`resolveVoice`/`deepResolveVoice` in `src/api/client.js`.
- `src/theme/themes.js`: token maps for all 2×2 mode×tone combinations, applied as CSS vars on `<html>` via `applyTheme(mode, tone)`.
- `src/theme/ThemeProvider.jsx`: owns both axes as state; `?mode=&tone=` URL params, `localStorage` persistence (`akashreya.mode`/`akashreya.tone`).
- `useTheme()` hook exported from ThemeProvider, returns `{ mode, tone, setMode, setTone, triggerModeTransition, transOverlay }`.
- **Keyboard shortcuts are gated by `src/config.js`'s `PERSONAL_MODE_ENABLED` flag.** Flag off: `M` toggles tone, `T` does nothing. Flag on: `M` toggles mode (via transition overlay), `T` toggles tone. Check `src/config.js` before relying on either behavior — it changes locally and is not meant to be assumed from this file.
- "Theme" is legacy v2 vocabulary — avoid it outside the `src/theme/` directory/API names, which now operate on mode+tone.

### Key Source Files
```
src/
  theme/
    themes.js           token definitions (mode × tone, 2×2)
    ThemeProvider.jsx   context, flag-gated M/T shortcuts, URL params
  styles/
    portfolio.css       shared layout, navpill, hero, cards, etc.
    case-study.css      case study page styles
    said.css            in-the-wild page styles
  hooks/
    useReveal.js        IntersectionObserver reveal (.reveal → .in-view)
  api/
    axios.js            Axios instance (VITE_API_URL or localhost:8080)
    client.js           fetch wrappers with fallback to static data
  data/
    fallback.js         static mirror of all API content
  components/
    NavPill.jsx         floating bottom-center pill nav with scroll-spy
    TopMark.jsx         fixed top-left brand pill
    ThemeHint.jsx       bottom-right keyboard shortcut hint
    ModeTransition.jsx  full-screen wipe overlay played on mode toggle
    AmbientBlobs.jsx    personal-mode-only background decoration (mode-gated)
    Footprints.jsx      cursor-trail footprint effect
    Chikorita.jsx       personal-mode buddy sprite (mode-gated)
    ConsoleLine.jsx     personal-mode-only console-style line (mode-gated)
    PokeTypeAtmosphere.jsx  Pokémon-type ambient effect, poketopia case study only
    ServiceInspector.jsx    dev-console-style API panel, fico-cod-rto case study only
    LetterDrop.jsx      text reveal animation primitive
  sections/
    Hero.jsx            two-col hero (id="hero")
    LiveBanner.jsx      pulsing live badge (id="live")
    HeroTicker.jsx      scrolling ticker strip (hardcoded content; /api/ticker unwired)
    Projects.jsx        12-col CSS grid, ProjectCard (id="projects")
    SideQuests.jsx      personal-mode-only obsessions board (id="sidequests", mode-gated)
    Principles.jsx      quote + numbered list (id="principles")
    Enterprise.jsx      enterprise cards (id="enterprise")
    Footer.jsx          footer (id="footer")
  pages/
    PortfolioPage.jsx   composes all sections
    CaseStudyPage.jsx   fetches /api/projects/:slug, shows not-found if API down; re-voices on mode change
    InTheWildPage.jsx   fetches /api/mentions, filter pill nav
```

### API Integration
All data loads from the live API with static fallback (site renders fully, with real content, when the backend is down — see `portfolio-api-and-fallback` skill for the full contract).

| Endpoint | Purpose | Fallback |
|---|---|---|
| `GET /api/site` | Site config (brand, hero, nav, etc.) | `fallbackSite` / `fallbackSitePersonal` by mode |
| `GET /api/projects` | Project grid | `fallbackProjects` |
| `GET /api/projects/:slug` | Case study detail | `fallbackCaseStudies[slug]`, else "not found" |
| `GET /api/mentions` | In the wild cards | `fallbackMentions` |

`/api/sidequests` and `/api/ticker` exist on the backend but the frontend never calls them — `SideQuests`/`HeroTicker` content is hardcoded regardless of API state.

Response fields may arrive "voiced" — `{recruiter: T, personal: T}` instead of flat `T` — and must be resolved via `pickVoice`/`resolveVoice`/`deepResolveVoice` before reaching JSX (a raw voiced wrapper as a React child is a hard crash). See `portfolio-architecture-contract` §4.

- `VITE_API_URL` env var sets the API base URL (defaults to `http://localhost:8080`; production API is `https://projectsapi.akashreya.space` — do not confuse with `https://projects.akashreya.space`, the content-admin UI)
- API handover spec for the backend: `Design/API_HANDOVER_v3.md` (the v2 `Design/API_HANDOVER.md` is a superseded relic — don't cite it)

### GitHub Pages Deployment
- `public/404.html`: catches unknown routes, saves path to `sessionStorage`, redirects to `/`
- `index.html` body script: reads `sessionStorage` on load and restores the path via `history.replaceState`
- GitHub Actions: `.github/workflows/deploy.yml` - builds and deploys to `gh-pages` branch via `peaceiris/actions-gh-pages`

### Reveal Animations
Elements with `.reveal` class start hidden. `useReveal(...deps)` (rest params, not an array — recreating the deps array every render broke the observer once, see `portfolio-debugging-playbook`) wires up an IntersectionObserver that adds `.in-view` when 10% visible. Elements already in viewport get `.no-anim .in-view` immediately (no transition). Any section that can remount on a dependency (e.g. `mode`) must include that dependency, or its `.reveal` nodes stay invisible after the remount.

### Testing Notes
- Playwright config: `playwright.config.js` - single Chromium project, `reducedMotion: "reduce"`
- Tests inject `opacity: 1 !important` CSS to force all reveal elements visible before screenshot
- Baseline snapshots: `tests/playwright-viewport.spec.ts-snapshots/` — **`tests/` is gitignored**, so baselines exist only in the local working tree, not in git or CI. CI runs no tests at all (build-only). See `portfolio-visual-testing` skill before touching baselines.
