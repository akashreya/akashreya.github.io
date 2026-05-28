# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Vite dev server on localhost:5173
- **Build**: `npm run build` - Creates production build using Vite
- **Lint**: `npm run lint` - Runs ESLint on the codebase
- **Preview**: `npm run preview` - Preview production build locally
- **Visual tests**: `npm run test:visual` - Runs Playwright visual regression tests across 7 viewports
- **All tests**: `npm run test` - Runs complete Playwright test suite
- **Update test baselines**: `npx playwright test --update-snapshots tests/playwright-viewport.spec.ts` - Regenerate baselines

## Project Architecture

This is a React 19 + Vite portfolio website. v2 redesign: "Bloomberg Terminal" aesthetic, serif display face, floating pill nav, multi-page routing. Archived v1 as git tag `v1.0.0`.

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

### Theme System
- Two themes: `crimson` (warm dark) + `glass` (cool indigo)
- Two modes per theme: `light` + `dark`
- `src/theme/themes.js`: token maps for all 4 combinations
- `src/theme/ThemeProvider.jsx`: applies CSS vars to `<html>`, T/M keyboard shortcuts, `?theme=&mode=` URL params, localStorage persistence
- `useTheme()` hook exported from ThemeProvider

### Key Source Files
```
src/
  theme/
    themes.js           token definitions (crimson/glass × light/dark)
    ThemeProvider.jsx   context, T/M shortcuts, URL params
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
  sections/
    Hero.jsx            two-col hero (id="hero")
    LiveBanner.jsx      pulsing live badge (id="live")
    Projects.jsx        12-col CSS grid, ProjectCard (id="projects")
    Principles.jsx      quote + numbered list (id="principles")
    Enterprise.jsx      enterprise cards (id="enterprise")
    Footer.jsx          footer (id="footer")
  pages/
    PortfolioPage.jsx   composes all sections
    CaseStudyPage.jsx   fetches /api/projects/:slug, shows not-found if API down
    InTheWildPage.jsx   fetches /api/mentions, filter pill nav
```

### API Integration
All data loads from the live API with static fallback (site renders offline).

| Endpoint | Purpose | Fallback |
|---|---|---|
| `GET /api/site` | Site config (brand, hero, nav, etc.) | `fallbackSite` |
| `GET /api/projects` | Project grid | `fallbackProjects` |
| `GET /api/projects/:slug` | Case study detail | Shows "not found" |
| `GET /api/mentions` | In the wild cards | `fallbackMentions` |

- `VITE_API_URL` env var sets the API base URL (defaults to `http://localhost:8080`)
- API handover spec for the backend: `Design/API_HANDOVER.md`

### GitHub Pages Deployment
- `public/404.html`: catches unknown routes, saves path to `sessionStorage`, redirects to `/`
- `index.html` body script: reads `sessionStorage` on load and restores the path via `history.replaceState`
- GitHub Actions: `.github/workflows/deploy.yml` - builds and deploys to `gh-pages` branch via `peaceiris/actions-gh-pages`

### Reveal Animations
Elements with `.reveal` class start hidden. `useReveal(deps)` wires up an IntersectionObserver that adds `.in-view` when 10% visible. Elements already in viewport get `.no-anim .in-view` immediately (no transition).

### Testing Notes
- Playwright config: `playwright.config.js` - single Chromium project, `reducedMotion: "reduce"`
- Tests inject `opacity: 1 !important` CSS to force all reveal elements visible before screenshot
- Baseline snapshots: `tests/playwright-viewport.spec.ts-snapshots/`
