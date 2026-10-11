# CLAUDE.md

## Constraints

- Push to `main` is a live deploy to akashreya.space (`.github/workflows/deploy.yml`). Run Playwright green before pushing. CI builds only and runs no tests.
- A voiced field (`{recruiter, personal}`) reaching JSX is React error #31, a whole-page crash. Resolve through `src/api/client.js` (`resolveVoice`, `deepResolveVoice`, `pickVoice`), never render raw fetch results.
- The site renders fully with the API down. Every fetch ships a static mirror in `src/data/fallback.js` and returns it on any error or empty array.
- Docs describe the current system only. No history, no dates, no FIXED rows; git keeps history. Fix a doc the moment it disagrees with `src/`.

## Project

React 19 + Vite SPA on GitHub Pages, React Router v7 with three routes: `/` (PortfolioPage), `/work/:slug` (CaseStudyPage), `/in-the-wild` (InTheWildPage). Two axes: **mode** (`recruiter` | `personal`, the persona; personal mode is live) and **tone** (`light` | `dark`). M toggles mode, T toggles tone. Content comes from the API at `https://projectsapi.akashreya.space` (Spring service, source in `E:\Work\Code\GitHub\projectservice`), voiced per mode, with fallback. Plain CSS with custom properties, no Tailwind. Fonts: Instrument Serif, Manrope, IBM Plex Mono (recruiter); Fondamento, Alegreya, Sacramento (personal).

## Source map

| Path | Holds |
|---|---|
| `src/config.js` | `PERSONAL_MODE_ENABLED` kill switch |
| `src/theme/` | `themes.js` (mode x tone tokens, `applyTheme`), `ThemeProvider.jsx` (`useTheme`, URL params, localStorage, M/T keys) |
| `src/api/` | `axios.js` (base URL from `VITE_API_URL`), `client.js` (fetchers, TTL cache, voice resolution, `upgradeCaseStudy`) |
| `src/data/fallback.js` | static mirror of every endpoint |
| `src/pages/` | the three route pages; CaseStudyPage renders `nav` + `sections[]` through `CaseStudySection` |
| `src/sections/` | Hero, HeroTerminal (recruiter hero right column), HeroTicker (personal hero margin notes), Projects, SideQuests (personal only), Principles, Enterprise, Footer |
| `src/components/` | NavPill, TopMark, ThemeHint, SectionHead, Typeset, LetterDrop, ModeTransition, AmbientBlobs, Footprints, Chikorita, CaseStudySection, ServiceInspector (fico-cod-rto only), PokeTypeAtmosphere (poketopia only) |
| `src/hooks/useReveal.js` | `.reveal` to `.in-view` observer; pass `mode` as a dep where sections remount on mode |
| `src/styles/` | portfolio, case-study, said, cs-inspector, cs-poketypes, mode-transition |

## API

| Endpoint | Fetcher | Fallback |
|---|---|---|
| `GET /api/site` | `fetchSite` + `resolveVoice` | `fallbackSiteRecruiter` / `fallbackSitePersonal` |
| `GET /api/projects` | `fetchProjects` | `fallbackProjects` |
| `GET /api/projects/:slug` | `fetchCaseStudy` | `fallbackCaseStudies[slug]`, else not-found |
| `GET /api/mentions` | `fetchMentions` | `fallbackMentions` |
| `GET /api/sidequests`, `GET /api/ticker` | `fetchSideQuests`, `fetchTicker` | `fallbackSideQuests`, `fallbackTicker` |

`https://projects.akashreya.space` is the content admin UI, not the API.

Handover specs (in `Design/`, untracked): `API_HANDOVER_v3.md` is the base; `API_HANDOVER_v3.1.md` (site section titles) and `API_HANDOVER_v3.1_HERO.md` (hero) extend it; `API_HANDOVER_v3.2_CASE_STUDY.md` supersedes v3 for case studies. `API_HANDOVER.md` is v2 and superseded.

## Commands

`npm run dev` (port 5173) · `npm run build` · `npm run lint` · `npm run preview` · `npm run test:visual` (7-viewport Playwright suite; `tests/` is gitignored, so specs and baselines live only locally) · `npm run update-baseline`

## Skills

`.claude/skills` holds the detail. Start with `portfolio-architecture-contract` (vocabulary, kill switch, fallback invariant, decisions, open issues); then `portfolio-api-and-fallback`, `portfolio-build-run-deploy`, `portfolio-debugging-playbook`, `portfolio-theme-and-content`, `portfolio-visual-testing`.
