---
name: portfolio-theme-and-content
description: >
  Day-to-day mechanics of themes and content in the akashreya-portfolio repo. Load this when:
  changing colors, fonts, accents, or any CSS custom property / design token; asking "where does
  this text/copy live?"; editing hero text, taglines, project descriptions, case-study prose,
  principles, nav labels, or contact info; wondering why the M or T keyboard shortcut does or
  doesn't work; debugging ?mode= / ?tone= URL params or localStorage theme persistence; deciding
  whether copy goes in the backend admin UI, src/data/fallback.js, or JSX; or navigating the
  Design/ directory (which files are spec vs dead prototype). Keywords: theme, token, tone,
  mode, voice, copy, content, tagline, accent color, Baloo 2, Instrument Serif, data-mode,
  applyTheme, ThemeProvider, fallback.js, admin UI, seed data, API_HANDOVER.
---

# Portfolio: theme mechanics + where content lives

Repo: `E:\Work\Code\GitHub\akashreya-portfolio`. React 19 + Vite SPA, plain CSS with custom
properties (no Tailwind). All file:line references verified against `main` on 2026-07-10.

**CLAUDE.md was refreshed 2026-07-11** to v3 vocabulary and is no longer the stale v2 document
this used to warn about. It's still a static snapshot, not the living doc — when this skill and
CLAUDE.md disagree, this skill (and `src/`) still wins, but disagreement should now be rarer.

## Terminology — four words that WILL be confused

| Term | Means | Values | Lives in |
|---|---|---|---|
| **mode** | Which *persona* of the site: professional vs personal. Changes tokens, fonts, copy, and which components render. | `recruiter`, `personal` | `src/theme/themes.js`, `useTheme().mode`, `<html data-mode>` |
| **tone** | Light/dark variant *within* a mode. | `light`, `dark` | `themes.js` per-mode token maps, `<html data-tone>` |
| **theme** | Loose word for a (mode × tone) token set. Avoid it in code discussion; say mode or tone. | 4 combos | — |
| **voice** | Which *text register* of a piece of API copy to show. Follows `mode`. A **voiced field** is `{recruiter: "...", personal: "..."}` in API JSON. | `recruiter`, `personal` | `src/api/client.js` (`pickVoice`, `deepResolveVoice`) |

Why the axes are shaped this way (the conceptual model, invariants): see
**portfolio-architecture-contract**. Voiced-field resolution semantics, shape detection, and the
TTL cache: see **portfolio-api-and-fallback**. This skill covers the mechanics only.

## When NOT to use this skill

- Debugging why voiced fields render as `[object Object]` / React error #31, cache staleness, or
  API-vs-fallback behavior → **portfolio-api-and-fallback** (semantics) or
  **portfolio-debugging-playbook** (symptom triage).
- Shipping a change (env setup, build, the deploy gate, GH Actions) → **portfolio-build-run-deploy**.
- Updating Playwright baselines after a visual change → **portfolio-visual-testing**.
- Anything about the personal-mode redesign, new embeds, seeding `/api/sidequests` + `/api/ticker`,
  or flipping `PERSONAL_MODE_ENABLED` → **portfolio-personal-mode-campaign**.
- Understanding *why* the system is designed this way → **portfolio-architecture-contract**.

---

# Part 1 — Theme mechanics

## 1.1 The feature flag (read this first)

`src/config.js:3` — `export const PERSONAL_MODE_ENABLED = false;` (as of 2026-07-10).
Personal mode is **LAUNCHED** (2026-07-11, commit `b2b9ca2` — flag `true` on main; M toggles
mode, T toggles tone, `?mode=` honored). The paragraph below describes flag-OFF behavior —
historical, and what returns if the flag is ever flipped back as a kill switch: the site is
recruiter-mode-only: mode init hard-forces `'recruiter'` regardless of URL param or localStorage
(`src/theme/ThemeProvider.jsx:12-15`), and `triggerModeTransition` is a no-op
(`ThemeProvider.jsx:44`). Do not flip the flag as part of theme/content work — that is a gated
launch step owned by **portfolio-personal-mode-campaign**.

## 1.2 themes.js structure

`src/theme/themes.js` exports `themes` (lines 1-104) and `applyTheme` (lines 106-120).

```
themes
├── recruiter          ("Bloomberg terminal": flat, warm, serif)
│   ├── fonts          display: Instrument Serif · body: Manrope · mono: IBM Plex Mono · script: Instrument Serif  (4-9)
│   ├── light          accent #c8341e / #e14b3a  (10-29)
│   └── dark           accent #e14b3a / #f56f54  (30-49)
└── personal           (PARCHMENT — shipped 44d54c4; violet-glass/Baloo 2 is gone)
    ├── fonts          display: Fondamento · body: Alegreya · script: Sacramento  (54-59)
    ├── light          "day parchment": bg #ccb891, ink #33240f, accent #38591f leaf-green  (63-82)
    └── dark           "wandlight": bg #1b1408, ink #ecdcb2, accent #8fb96a, amber candle glows  (83-102)
```

Each tone map has 18 tokens: `bg bg2 surf surf2 line line2 ink ink2 ink3 accent accent2
surf-blur surf-radius surf-shadow surf-border pill-shadow glow-a glow-b`. The recruiter/personal
character difference is carried in the tokens themselves: recruiter has `surf-radius: 4px`,
transparent glows (flat editorial look); personal has `surf-radius: 10px` and tea-stain
radial-gradient glows (illustrated manuscript). Both modes now run `surf-blur: 0px` — the
glassmorphism blur died with violet/glass. Personal-light's ground/lines/ink2 are sampled from
the Marauder's Map film prop (comment at `themes.js:61-62`); seal red `#5a0606` is deliberately
UNUSED — reserved for one rare wax-seal detail on owner request.

## 1.3 How tokens land on the page

`applyTheme(modeName, tone)` (`themes.js:106-120`):

1. For every token key `k`, sets inline `--{k}` on `document.documentElement` — so `bg` becomes
   `--bg`, `surf-blur` becomes `--surf-blur`.
2. Sets `--font-display`, `--font-body`, `--font-mono`, `--font-script` from the mode's `fonts`
   (`script` added 2026-07-11: Sacramento for personal card headings, Instrument Serif as the
   recruiter no-op).
3. Sets `root.dataset.mode` and `root.dataset.tone` → `<html data-mode="..." data-tone="...">`.

CSS consumes tokens as `var(--bg)` etc., and mode-specific *rules* key off the data attribute,
e.g. `[data-mode="personal"] .cs-title` (`src/styles/case-study.css:52`) or
`[data-mode="recruiter"] .ins-hint { display: none !important; }` (`src/styles/cs-inspector.css:44`).
Grep `data-mode` in `src/styles/` to find every mode-forked rule.

`applyTheme` runs in a `useEffect` on every mode/tone change (`ThemeProvider.jsx:64-66`).

**FOUC guard:** `index.html:2` hardcodes `<html data-mode="recruiter" data-tone="dark">` and
`index.html:16-48` inlines a *duplicate copy* of the recruiter-dark tokens as a `:root` style
block so the page paints correctly before React mounts. **If you change a recruiter-dark token in
themes.js, change it in index.html too** — otherwise the page flashes the old value on load.
All font families load from one Google Fonts URL at `index.html:12` — Instrument Serif, Manrope,
IBM Plex Mono, Fondamento, Alegreya, Sacramento (Baloo 2 removed 2026-07-11). Fondamento has
NO weight above 400 — don't set bolder weights on display text in personal mode.

## 1.4 State, persistence, URL params — ThemeProvider.jsx

| Concern | Behavior | Where |
|---|---|---|
| mode init | flag ON: `?mode=` param → localStorage `akashreya.mode` → `'recruiter'`. Flag OFF: always `'recruiter'`. | `ThemeProvider.jsx:10-16` |
| tone init | `?tone=` param → localStorage `akashreya.tone` → `'dark'`. Only `light`/`dark` accepted. | `ThemeProvider.jsx:18-22` |
| URL params | Read **once** at module load (`new URLSearchParams(window.location.search)`, line 7). Changing the URL after load does nothing without a full reload. | `ThemeProvider.jsx:7` |
| persistence | `setMode`/`setTone` write localStorage on every change (keys `akashreya.mode`, `akashreya.tone`). Note: `akashreya.mode` is still *written* but *ignored at init* while the flag is false. | `ThemeProvider.jsx:32-41` |
| context | `useTheme()` → `{ mode, tone, setMode, setTone, triggerModeTransition, transOverlay }` | `ThemeProvider.jsx:88, 94-96` |

`triggerModeTransition(nextMode)` (`ThemeProvider.jsx:43-62`): no-op when flag false; instant
switch under `prefers-reduced-motion`; otherwise plays the `ModeTransition` overlay (`iris`
entering personal, `curtain` returning; mode flips at 260ms; overlay clears at 700ms). The beat
texts (`'> entering personal mode · akash@kelvin'` etc.) are hardcoded at lines 52-54.

## 1.5 Keyboard shortcuts — flag-dependent (CLAUDE.md is wrong here)

Verified at `ThemeProvider.jsx:68-85`. Keys are ignored when focus is in an input/textarea.

| Flag state | `M` key | `T` key |
|---|---|---|
| `false` (**prod today, as of 2026-07-10**) | toggles **tone** (light/dark) | **does nothing** |
| `true` | toggles **mode** (with transition overlay) | toggles **tone** |

`ThemeHint` (bottom-right button, `src/components/ThemeHint.jsx:16-19`) shows the matching label:
flag off → "M tone", flag on → "M mode · T tone". Clicking it always toggles tone.

Mode-toggle buttons in navpills: the shared `NavPill` gates its mode segment behind the flag
(`src/components/NavPill.jsx:56`), but `CaseStudyPage` (lines 300-307) and `InTheWildPage`
(lines 135-142) render their own inline navpill mode buttons **ungated** — visible in prod but
inert because `triggerModeTransition` no-ops. Known quirk; don't "fix" it in passing.

## 1.6 Runbook: change or add a theme token

1. Edit the value in `src/theme/themes.js` — usually in **both** `light` and `dark` of the mode
   (and consider the other mode for parity).
2. If it's a **recruiter-dark** token, mirror the edit in the inline block at `index.html:18-40`
   (FOUC guard duplicate).
3. Adding a **new** token: add the key to all four tone maps. `applyTheme` picks it up
   automatically (it iterates `Object.entries`); consume it in CSS as `var(--your-key)`. Add it
   to the index.html block only if it affects above-the-fold first paint.
4. Verify live: `npm run dev` → http://localhost:5173 → press `M` to check both tones (flag off:
   M = tone). For personal-mode checks while the flag is off, temporarily set
   `PERSONAL_MODE_ENABLED = true` locally — **never commit that**.
5. Color/spacing changes will move Playwright visual baselines → **portfolio-visual-testing**.
6. Ship through the deploy gate → **portfolio-build-run-deploy**.

Mode-conditional *styling* (not tokens) goes in CSS under `[data-mode="personal"]` /
`[data-mode="recruiter"]` selectors, not in JS.

---

# Part 2 — Where does this copy live?

Three homes. Picking the wrong one is the most common content mistake.

| Content | Home | Change via |
|---|---|---|
| Brand/tagline, hero text + stats + CTAs, live banner, principles, nav items, enterprise cards, contact/socials | Backend `GET /api/site` | Admin UI (below), then mirror in `fallback.js` |
| Project grid cards (title, desc, tags, metrics) | Backend `GET /api/projects` | Admin UI, then mirror `fallbackProjects` |
| Case-study prose (overview, problem, architecture, decisions, process, outcome) | Backend `GET /api/projects/:slug` | Admin UI, then mirror `fallbackCaseStudies` |
| In-the-wild mention cards | Backend `GET /api/mentions` | Admin UI, then mirror `fallbackMentions` |
| SideQuests board nodes | Backend `GET /api/sidequests` (since 2026-07-11) | Admin UI, then mirror `fallbackSideQuests` |
| Hero ticker lines | Backend `GET /api/ticker` (since 2026-07-11) | Admin UI, then mirror `fallbackTicker` |
| Everything in the table below | **Hardcoded JSX** | Edit the component, ship through deploy gate |

Backend content is entered via the **admin UI at `https://projects.akashreya.space`**
(owner-confirmed 2026-07-10 — that host is the content-entry UI, **NOT** an API endpoint; the
API is `https://projectsapi.akashreya.space`). Backend source: `E:\Work\Code\GitHub\projectservice`
— internals out of scope here. Endpoint catalog, live shapes, and backend topology:
**portfolio-api-and-fallback** (all five endpoints live and seeded as of 2026-07-11).

## 2.1 Hardcoded-copy inventory (changing these requires a code deploy)

| Copy | File:line | Mode it shows in |
|---|---|---|
| Faux console line `GET /api/v1/me · personal · 12ms` | `src/components/ConsoleLine.jsx:8` | personal |
| Hero map-pin label `Bengaluru · IST` | `src/sections/Hero.jsx:79` | recruiter |
| Enterprise collapsed strip `13y · enterprise, ...` + `resume.pdf →` | `src/sections/Enterprise.jsx:11-12` | personal |
| Footer name casing + `Bengaluru · IST` | `src/sections/Footer.jsx:10-17` | both (forked) |
| Section headings: `things i made.` / `Selected work.` | `src/sections/Projects.jsx:66` | both (forked) |
| Section headings: `rules.` / `How I build.` | `src/sections/Principles.jsx:10` | both (forked) |
| `obsessions.` heading, `Enterprise work.` heading | `SideQuests.jsx:36`, `Enterprise.jsx:21` | per section |
| Mode-transition beat texts | `src/theme/ThemeProvider.jsx:52-54` | transition overlay |
| ThemeHint label | `src/components/ThemeHint.jsx:16-19` | both |

Ticker and SideQuests copy moved OUT of this inventory on 2026-07-11: both are API-driven
(`fetchSideQuests`/`fetchTicker`, seeded on prod, mirrored in `fallbackSideQuests`/`fallbackTicker`).
Note: the `Design/seed_data` JSONs still carry the OLD hardcoded copy — relics, not truth.
Content history + current live shapes: **portfolio-api-and-fallback**.

## 2.2 fallback.js — the offline mirror

`src/data/fallback.js` (955 lines) is a static mirror of API content so the site renders with the
API down. Exports (verified line numbers):

| Export | Line | Mirrors |
|---|---|---|
| `fallbackCaseStudies` | 1 | 8 case studies keyed by slug (no `marketstream`) |
| `fallbackSite` | 595 | v2-flat site object, recruiter copy |
| `fallbackSiteRecruiter` | 680 | alias of `fallbackSite` (same object) |
| `fallbackSitePersonal` | 682 | personal-voice site copy — **`nav`/`enterprise` gap fixed 2026-07-11** (now references `fallbackSite.nav`/`fallbackSite.enterprise`, not duplicated) |
| `fallbackProjects` | 738 | 8 project cards |
| `fallbackMentions` | 909 | 4 mention cards |
| `fallbackSideQuests` | ~962 | 7 board nodes, verbatim mirror of the live seeded API (2026-07-11) |
| `fallbackTicker` | ~972 | 9 ticker strings, verbatim mirror of live (2026-07-11) |

All fallback strings are **flat** (never voiced wrappers) — voice is expressed by having two
separate site objects. Which fallback is used when, the v2/v3 shape detection, and the sync
discipline (what must stay in lockstep with the API) are owned by **portfolio-api-and-fallback** —
read that before editing this file.

## 2.3 Runbook: change content WITHOUT touching components

1. **Locate the home** with the table in §2.0. If it's in the hardcoded inventory (§2.1), stop —
   that's a code change, not a content change.
2. **API-backed copy:** edit it in the admin UI at `https://projects.akashreya.space`. No frontend
   build or deploy is needed — the live site fetches it.
3. **Voiced copy:** if the recruiter and personal registers should differ, enter the field as
   `{"recruiter": "...", "personal": "..."}` per `Design/API_HANDOVER_v3.md`. Plain strings serve
   both modes. Resolution semantics: **portfolio-api-and-fallback**.
4. **Mirror the change in `src/data/fallback.js`** (same field, same shape — flat string, current
   mode's register in the matching fallback object). Skipping this leaves offline/apifail visitors
   seeing stale copy. Sync rules: **portfolio-api-and-fallback**.
5. **Expect delay:** the frontend caches API responses in memory — site/projects 10 min,
   case-study/mentions 5 min (`src/api/client.js:36-47`). A hard reload clears it (module-level
   cache). Don't debug "my edit didn't show" before ruling this out.
6. The fallback.js edit is a code change → Playwright green + manual dev-server check + the
   deploy gate: **portfolio-build-run-deploy**.

Quick check — which component consumes a given API field: `PortfolioPage.jsx:36-45` fans
`resolved.*` out to sections (`TopMark(brand)`, `Hero(hero)`, `LiveBanner(liveBanner)`,
`Principles(principles)`, `Enterprise(enterprise, contact)`, `Footer(brand, contact)`,
`NavPill(resolved.nav)`).

---

# Part 3 — Design/ directory map: spec vs relic

`Design/` is a mix of authoritative specs and dead prototypes. Do not treat a prototype as spec.

## Authoritative (as of 2026-07-10)

| Path | What it is |
|---|---|
| `Design/API_HANDOVER_v3.md` | **Current API spec** (dated 2026-05-29). Voiced fields, sidequests/ticker DDL, SQLite types, backward-compat rule. Explicitly supersedes `API_HANDOVER.md`. |
| `Design/seed_data/portfolio_v3_seed_data/` | **Relic as of 2026-07-11** for sidequests/ticker: `json/side_quests.json` + `ticker.json` mirror the OLD hardcoded arrays, NOT what the owner actually seeded (live content differs — new nodes, `time` hub, 9 lines). The live API is the source of truth. `sql/01-04` + README remain useful only as local-backend bootstrap scaffolding. |

Caveat: the v3 seed `site.json` uses the top-level `{recruiter, personal}` split, while
API_HANDOVER_v3.md's `/api/site` example shows per-field wrappers. The frontend handles both
shapes (**portfolio-api-and-fallback**); which one the live backend serves is not verifiable
from this repo.

## Historical / reference only — never cite as spec

| Path | What it is |
|---|---|
| `Design/API_HANDOVER.md` | v2 API spec. Superseded. |
| `Design/seed_data/portfolio_v2_seed_data/` | v2 seed JSON. Superseded. |
| `Design/Ds_v2/` | v2 static HTML/JSX design-system prototype ("Portfolio DS" folder + zip). Pre-React reference, not the running app. |
| `Design/Portfolio DS-handoff.zip` | Same prototype era, zipped. |
| `Design/seed_data/*.md`, `portfolio.html`, `quotes.txt` | Raw source material (work-history writeups, per-project portfolio drafts, quotes) used to author seed content. Input corpus, not spec. |

---

# Provenance and maintenance

Everything above was verified against `main` on 2026-07-10. Facts that drift, and the one-line
re-verification for each (PowerShell; run from repo root):

| Volatile fact | Re-verify with |
|---|---|
| `PERSONAL_MODE_ENABLED` state | `Get-Content src/config.js` |
| Shortcut behavior / init rules | `Get-Content src/theme/ThemeProvider.jsx` (keys at ~68-85, init ~10-22) |
| Token keys and values | `Get-Content src/theme/themes.js` |
| FOUC-guard duplicate tokens | `Select-String -Path index.html -Pattern '--bg|--accent'` |
| localStorage keys | `Select-String -Path src/theme/ThemeProvider.jsx -Pattern 'localStorage'` |
| fallback.js export lines | `Select-String -Path src/data/fallback.js -Pattern '^export const'` |
| Sidequests/ticker still API-driven (since 2026-07-11) | `Select-String -Path src/api/client.js -Pattern 'fetchSideQuests|fetchTicker'` (expect both; no hits = regressed to hardcoded) |
| Mode-forked CSS rules | `Select-String -Path src/styles/*.css -Pattern 'data-mode'` |
| Design/ contents | `Get-ChildItem Design; Get-ChildItem Design/seed_data/portfolio_v3_seed_data -Recurse` |
| Admin UI vs API hosts | Owner-confirmed 2026-07-10; not verifiable from this repo. Backend source: `E:\Work\Code\GitHub\projectservice`. |
