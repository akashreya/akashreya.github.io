---
name: portfolio-personal-mode-campaign
description: >
  Plan-of-record for launching PERSONAL MODE on akashreya.space — currently UNLAUNCHED
  (PERSONAL_MODE_ENABLED=false) and mid-redesign. Load this when the task mentions: personal mode,
  the personal-mode redesign, flipping PERSONAL_MODE_ENABLED, the violet/glass theme, Baloo 2,
  "harry potter + pokemon + videogames + shreya ghoshal", embeds / per-project character /
  PokeTypeAtmosphere / ServiceInspector / LetterDrop, sidequests or ticker seeding, the admin UI
  at projects.akashreya.space, the obsessions board, HeroTicker, or "when can we launch personal
  mode". Also load before ANY change to personal-mode visuals, before seeding /api/sidequests or
  /api/ticker, and before touching src/config.js. Do NOT load for recruiter-mode work, general
  debugging, or deploy mechanics (see siblings listed inside).
---

# Personal Mode Campaign

The decision-gated runbook for redesigning, seeding, and launching personal mode. The owner has
deferred this work; this skill is the plan-of-record for whenever it restarts. Status as of
2026-07-10:

| Item | State (2026-07-10) | Where |
|---|---|---|
| `PERSONAL_MODE_ENABLED` | `false` | `src/config.js:3` |
| Personal theme | Built (violet/glass, Baloo 2) — owner rejected the identity | `src/theme/themes.js:51-98` |
| `/api/sidequests`, `/api/ticker` | Live on prod, return `200 []` — BUILT BUT UNSEEDED (verified by GET on 2026-07-10) | backend |
| Frontend fetch of those endpoints | DOES NOT EXIST — SideQuests + HeroTicker content is hardcoded in the components | `src/sections/SideQuests.jsx:13-21`, `src/sections/HeroTicker.jsx:1-12` |
| Per-project embeds | 2 exist (poketopia, fico-cod-rto); owner verdict: right direction, "too less" | `src/pages/CaseStudyPage.jsx:315-332` |
| Visual test coverage | Personal half of the suite exists (7 viewports × 6 shots); baselines still only generatable with the flag flipped locally, but as of 2026-07-11 the spec `test.skip`s personal cases when the flag is off instead of failing them | `tests/playwright-viewport.spec.ts:13` |

Launch chain (owner-confirmed order): **redesign converges → seed sidequests/ticker via admin UI
→ flip the flag → deploy gate → push**. Each phase below is a gate; do not start a later phase
before the earlier gate is signed off.

## Terminology (30 seconds — full treatment in portfolio-architecture-contract)

These four words overlap and WILL be confused:

| Term | Meaning here | Values |
|---|---|---|
| **mode** | Which persona the site presents. THE axis this skill is about. | `recruiter`, `personal` |
| **tone** | Light/dark within a mode. Orthogonal to mode. | `light`, `dark` |
| **theme** | The token set for one mode (colors, fonts, radii) in `themes.js`. "The personal theme" = `themes.personal`. | one per mode |
| **voice** | Which copy variant the API serves for a field wrapped `{recruiter, personal}`. Content, not visuals. | follows mode |

CLAUDE.md still describes v2 ("crimson"/"glass" themes) — it is stale. `src/` wins.

## When NOT to use this skill

- Recruiter-mode styling or content → **portfolio-theme-and-content**
- How `pickVoice` / fallback / TTL cache / endpoint shapes work → **portfolio-api-and-fallback**
- Deploy pipeline, the deploy gate in general, 404.html, env setup → **portfolio-build-run-deploy**
- Running/reading the visual suite, baseline update mechanics → **portfolio-visual-testing**
- A bug you're triaging right now → **portfolio-debugging-playbook**
- Why the architecture is shaped this way → **portfolio-architecture-contract**

---

## (a) DESIGN BRIEF — first gate, blocks everything

Two named problems, both owner-stated:

**Problem 1 — IDENTITY.** The current personal theme is violet/glass: accents `#6e45ff`/`#9b8aff`
(light) and `#9b8aff`/`#c2b3ff` (dark), Baloo 2 display face, 16px backdrop blur, 18px radius,
radial-gradient glows (`src/theme/themes.js:54, 58-97`). The owner's verdict: it does not express
his personality. His brief, verbatim:

> "harry potter + pokemon + videogames + shreya ghoshal"

**Problem 2 — DENSITY.** Per-project embedded character (PokeTypeAtmosphere, ServiceInspector,
LetterDrop) is the right direction but under-committed — his words: "too less". The code agrees:
9 type-pair palettes are defined in `PokeTypeAtmosphere.jsx:4-14` but only 1 of 8 case studies
(`poketopia`) consumes them (`CaseStudyPage.jsx:23-32`), and only 1 (`fico-cod-rto`) has an
inspector. **Amplify, don't replace.**

### The gate

Before ANY implementation, translate the brief into **3-5 written, named design commitments**,
covering at minimum:

1. **Palette direction** — what replaces/reworks violet-glass, per tone
2. **Type voice** — keep or replace Baloo 2, and why
3. **Motion character** — what movement says "him" (current: iris/curtain transition, letter-drop, ticker scroll, blob drift)
4. **Texture / motif vocabulary** — the recurring visual language (the four brief ingredients must be locatable in it)

Each commitment gets a name and one sentence. The **owner signs off on the written list** before
a line of CSS changes.

**Why this gate exists:** iterating on an undecidable brief is the established failure mode of
this workstream — the current violet/glass theme was fully built and then rejected on identity
grounds. "Shows personality" is decided at this gate, once, in writing. It is never re-judged by
eye during implementation; implementation is judged only against the signed commitments.

---

## (b) EMBED PROGRAM

"Embed" = a per-project character component mounted on a case-study page, giving that project its
own atmosphere. Two exist; they define the two extension patterns.

### Anatomy pattern 1 — DOM-driven atmosphere (PokeTypeAtmosphere)

`src/components/PokeTypeAtmosphere.jsx`, mounted only when `slug === 'poketopia'`
(`CaseStudyPage.jsx:332`), no props.

| Mechanic | How |
|---|---|
| Activation | On mount sets `data-poketypes="on"` on `<html>` (`PokeTypeAtmosphere.jsx:21`); all styling keys off that attribute |
| Section hooks | CaseStudyPage puts `className="t-section"` + `data-type-pair` on sections, driven by its hardcoded `TYPE_PAIRS` map (`CaseStudyPage.jsx:23-32`); the embed queries `.t-section[data-type-pair]` and prepends a `.t-glow` div into each (`:23-32` of the component) |
| Scroll state | Reference line at `scrollY + 30% viewport`; last section past it gets `.t-active` and sets `--page-c1`/`--page-c2` on `<html>` (`:46-61`) |
| CSS ownership | Its own stylesheet, imported by the component: `src/styles/cs-poketypes.css` |
| Cleanup | Unmount removes the attribute, the CSS vars, listeners, and every injected `.t-glow` (`:66-77`) |

### Anatomy pattern 2 — props-driven overlay (ServiceInspector)

`src/components/ServiceInspector.jsx`, mounted only when `slug === 'fico-cod-rto'`
(`CaseStudyPage.jsx:315-331`), receiving `data` (whole study object), `endpoint`, `statusMs`,
`keyMap` (JSON key → section DOM id), `footer`. Floating "200 OK · 12ms · { }" button opens a
drawer rendering the study JSON syntax-highlighted (strings HTML-escaped, `:14`); `J` toggles,
`Escape` closes (`:49-53`); hovering a key in `keyMap` highlights the linked section, click
scrolls to it. CSS: `src/styles/cs-inspector.css`.

### Ambient (non-per-project) personal character — the "louder" candidates

- `LetterDrop` (`src/components/LetterDrop.jsx`) — per-char staggered drop of the hero name, personal branch of `Hero.jsx:29-31`; animation CSS scoped under `[data-mode="personal"]` in `portfolio.css`
- `HeroTicker` — 10 hardcoded lines, doubled for seamless loop (`HeroTicker.jsx:14-15`)
- `SideQuests` — 7 hardcoded corkboard nodes, `null` unless personal mode (`SideQuests.jsx:29`)
- `AmbientBlobs`, `ConsoleLine` — personal-only, PortfolioPage
- InTheWildPage staggers `.mention` cards with `.is-dropped` at 70ms intervals in personal mode (`InTheWildPage.jsx:71-80`) — unrelated to the `LetterDrop` component despite the name

### Proposal protocol (owner-mandated)

For **each** case-study project, before building anything:

1. Agent proposes **2-3 concrete embed concepts**, each with: one-paragraph description, which anatomy pattern it follows, effort estimate (S/M/L), and which signed design commitment it expresses.
2. Owner approves ONE (or none) per project. **No build without approval.**
3. Separately propose how the EXISTING embeds get louder — e.g. `TYPE_PAIRS` entries for more of the 8 case studies (9 palettes already exist unused), inspector variants for other backend-flavored projects. Same approval rule.

### Build checklist per approved embed

- [ ] Own stylesheet under `src/styles/`, imported by the component (pattern of both existing embeds)
- [ ] Conditional mount in `CaseStudyPage.jsx` keyed on slug (extend the block at `:315-332`)
- [ ] Full cleanup on unmount (PokeTypeAtmosphere `:66-77` is the reference)
- [ ] If it animates: add defeat rules to `DISABLE_ANIMATIONS` in `tests/playwright-viewport.spec.ts:15-53`, or screenshots will flake
- [ ] Case-study pages are not in the visual suite (portfolio page only) — decide coverage with **portfolio-visual-testing**

---

## (c) IMPLEMENTATION GATES

All personal-mode work runs against a locally flipped flag. **Never commit the flipped flag until
the launch protocol** — push-to-main deploys live.

### Gate C1 — personal mode running locally

```powershell
# 1. Flip the flag LOCALLY (src/config.js line 3): false -> true. Do not commit.
# 2. Start dev server
npm run dev
# 3. Open http://localhost:5173/?mode=personal
```

Expected observations:

| Check | Expected |
|---|---|
| Page loads in personal mode | Violet/glass tokens (or your redesign), Baloo 2 headings |
| Press `M` (outside inputs) | Iris transition overlay, "> entering personal mode · akash@kelvin" beat text, mode flips |
| Press `T` | Tone toggles light/dark |
| Scroll the portfolio page | SideQuests corkboard renders after Projects; HeroTicker scrolls in hero right column; ambient blobs; Enterprise collapsed to one-line strip |

If you see X instead → branch:

| Symptom | Cause | Fix |
|---|---|---|
| `?mode=personal` ignored, site stays recruiter | Flag still `false` — ThemeProvider hard-forces `recruiter` when disabled (`ThemeProvider.jsx:12-14`) | Verify `src/config.js:3`, restart dev server |
| `M` toggles light/dark instead of mode; `T` dead | Same — flag-off keymap (`ThemeProvider.jsx:77-80`) | Same |
| Mode-toggle button on a case-study or in-the-wild page does nothing | Those pages render the button UNGATED (`CaseStudyPage.jsx:300-307`, `InTheWildPage.jsx:135-142`) but `triggerModeTransition` no-ops when the flag is off (`ThemeProvider.jsx:44`) | Expected with flag off; works with flag on |
| Site loads recruiter despite flag on | Stale `localStorage['akashreya.mode']` is only consulted when flag is on, but an explicit `?mode=` always wins — check for typos in the param | — |

### Gate C2 — empty vs seeded data states

As of 2026-07-10 the frontend does **not** fetch `/api/sidequests` or `/api/ticker` — content is
hardcoded, so today there is no empty-state risk from those endpoints. **If API wiring is built**
(a separate, owner-approved scope), both states must be exercised before launch:

```powershell
# Seeded state: run the backend locally (repo: E:\Work\Code\GitHub\projectservice — internals out
# of scope here), seed it from Design/seed_data/portfolio_v3_seed_data/, and point the frontend at it.
# .env.local already sets VITE_API_URL=http://localhost:8080.
npm run dev
```

- **Seeded**: board shows 7 nodes, ticker 10 lines, matching `json/side_quests.json` / `json/ticker.json`.
- **Empty** (backend up, tables empty — this is prod's current truth: `200 []`): components must fall back (hardcoded arrays or `fallback.js` data), never render a blank board. If they blank → the wiring lacks an empty-array guard; fix before proceeding.
- **API down** (kill the backend): whole site must still render from fallbacks. **FIXED 2026-07-11:** `fallbackSitePersonal` used to have no `nav` key, so personal mode offline yielded an empty NavPill; it now references `fallbackSite.nav`/`fallbackSite.enterprise` — details in **portfolio-api-and-fallback**.

**FIXED 2026-07-11** (was: "known voice gap to decide before launch"): `CaseStudyPage` used to fetch with `[slug]`-only effect deps, so toggling mode ON a case-study page didn't re-resolve voiced copy until navigation. Deps are now `[slug, mode]` (`CaseStudyPage.jsx:99`) — this gate is satisfied, no owner decision needed here anymore.

### Gate C3 — visual baselines for changed sections

The suite already covers personal mode: `const modes = ['recruiter', 'personal']`
(`tests/playwright-viewport.spec.ts:13`), 7 viewports, personal-only `sidequests` and
`enterprise-collapsed` shots. **Critical:** the spec navigates with `?mode=personal`, which is
dead while the flag is `false` — the personal half of the suite only passes with the flag flipped
locally. Run it flag-on:

```powershell
npm run test:visual
```

Any redesign changes personal-mode pixels wholesale → baselines must be regenerated
deliberately, not to silence diffs. Mechanics, the port-5174 webServer quirk, and
legitimate-vs-masking updates: **portfolio-visual-testing**.

---

## (d) SEEDING PROTOCOL

Seed `/api/sidequests` and `/api/ticker` **via the admin UI at https://projects.akashreya.space**
(that URL is the content-entry UI, NOT an API endpoint — the API is
`https://projectsapi.akashreya.space`).

Source material (repo-verified paths):

| File | Feeds | Content |
|---|---|---|
| `Design/seed_data/portfolio_v3_seed_data/json/side_quests.json` | `/api/sidequests` | 7 nodes — mirrors the array hardcoded in `SideQuests.jsx:13-21` |
| `Design/seed_data/portfolio_v3_seed_data/json/ticker.json` | `/api/ticker` | 10 lines — mirrors `HeroTicker.jsx:1-12` |
| `Design/seed_data/portfolio_v3_seed_data/sql/03_side_quests_v3.sql`, `04_ticker_v3.sql` | direct SQLite alternative | idempotent CREATE + INSERT (see the folder's README) |

Spec for shapes: `Design/API_HANDOVER_v3.md` §5 (sidequests) and §6 (ticker). Ticker rule from the
spec: text is "Akash's voice — do not sanitise or paraphrase."

### Verify after seeding (PowerShell — note `;` not `&&`)

```powershell
Invoke-RestMethod https://projectsapi.akashreya.space/api/sidequests | ConvertTo-Json -Depth 4
Invoke-RestMethod https://projectsapi.akashreya.space/api/ticker | ConvertTo-Json -Depth 4
```

Expected skeletons (per API_HANDOVER_v3.md):

```jsonc
// /api/sidequests — 7 objects
[ { "id": "pokemon", "pos": "tl", "emoji": "🎮", "title": "Pokémon",
    "body": "...", "projectRef": "poketopia", "displayOrder": 1 }, ... ]
// pos must be one of: tl, tr, r, br, bl, l, center

// /api/ticker — 10 objects
[ { "text": "...", "projectRef": "fico-cod-rto", "displayOrder": 4 }, ... ]
```

If you get `[]` → still unseeded (that IS the response as of 2026-07-10, HTTP 200). If you get a
count mismatch or missing fields → fix in the admin UI, re-verify; do not proceed to launch.

### Fenced-off wrong paths

- **DO NOT flip `PERSONAL_MODE_ENABLED` in a commit before seeding is done and verified.** The launch chain is owner-defined (converge → seed → flip); push-to-main is a live deploy, and the config comment (`src/config.js:1-2`) explicitly conditions the flag on seeded endpoints.
- **DO NOT edit `src/data/fallback.js` as a substitute for seeding.** Fallback is the offline mirror, not the source of truth; content enters through the admin UI. Fallback sync discipline: **portfolio-api-and-fallback**.

---

## (e) LAUNCH PROTOCOL

Preconditions — all must be true, in writing:

- [ ] Design commitments signed (gate a)
- [ ] Approved embeds built; existing embeds amplified per approved proposals (gate b)
- [ ] Gates C1-C3 passed; personal visual baselines regenerated and green
- [ ] Sidequests + ticker seeded and verified live (gate d)
- [ ] Decision recorded: launch on hardcoded SideQuests/HeroTicker content (seed JSONs mirror it, so pixels are identical) OR API wiring built and both data states tested (gate C2)

Then:

```powershell
# 1. Flip the flag for real
#    src/config.js line 3: export const PERSONAL_MODE_ENABLED = true;
# 2. Confirm nothing else gates personal mode (expect hits only in config.js + its consumers)
#    (Grep tool: pattern PERSONAL_MODE_ENABLED, path src/)
# 3. THE DEPLOY GATE (owner-confirmed; full anatomy in portfolio-build-run-deploy):
npm run test:visual        # must be green — run with the flag as committed
npm run dev                # manual check: both modes, all three routes, both tones
# 4. Commit the flag flip alone; push to main = LIVE DEPLOY via GitHub Actions
```

Side effects of the flip (all verified in code): `M` becomes mode-toggle and `T` becomes
tone-toggle (`ThemeProvider.jsx:71-76`); the previously-inert mode buttons on CaseStudyPage and
InTheWildPage go live; NavPill shows its gated mode segment (`NavPill.jsx:56`); `?mode=` URL param
and `localStorage['akashreya.mode']` start being honored.

### Post-deploy verification on https://akashreya.space

- [ ] Hard reload `/` — recruiter mode unchanged (default is still recruiter)
- [ ] `/?mode=personal` loads personal mode
- [ ] `M` toggles mode with iris/curtain transition; `T` toggles tone
- [ ] SideQuests board (7 nodes), HeroTicker, blobs, collapsed Enterprise all render
- [ ] `/work/poketopia` in personal mode — type-pair atmosphere + caption badge
- [ ] `/work/fico-cod-rto` — inspector hint button; `J` opens the drawer
- [ ] `/in-the-wild` in personal mode — cards stagger in with the drop animation
- [ ] Deep link test: paste `https://akashreya.space/work/poketopia?mode=personal` in a fresh tab — must survive the 404.html→sessionStorage redirect (mechanism in **portfolio-build-run-deploy**)
- [ ] Reload after toggling — mode persists via localStorage
- [ ] One-line CI caveat (**fixed 2026-07-11**): `deploy.yml:36` used to bake in the ADMIN UI url if the `VITE_API_URL` secret was ever unset; it now falls back to `https://projectsapi.akashreya.space` (the real API) instead — details in **portfolio-build-run-deploy**. Personal mode running on fallbacks due to this specific misconfig is no longer a risk; fallback data can still occur for other reasons (backend down, etc.)

Rollback: revert the flag-flip commit, push to main. The deploy is `force_orphan`, so the previous
gh-pages state is not recoverable from the branch — rollback is always roll-forward from `main`.

---

## Provenance and maintenance

All claims verified against the working tree and live API on **2026-07-10**. Re-verify before
trusting:

| Volatile fact | Re-verification (PowerShell) |
|---|---|
| Flag state | `Get-Content E:\Work\Code\GitHub\akashreya-portfolio\src\config.js` |
| Endpoints still unseeded | `Invoke-RestMethod https://projectsapi.akashreya.space/api/sidequests; Invoke-RestMethod https://projectsapi.akashreya.space/api/ticker` (expect `[]` until seeded) |
| Personal theme still violet/glass | Grep `6e45ff` in `src/theme/themes.js` |
| SideQuests/HeroTicker still hardcoded | Grep `TICKER_LINES` in `src/sections/HeroTicker.jsx` and `const NODES` in `src/sections/SideQuests.jsx`; Grep `sidequests\|ticker` in `src/api/client.js` (expect no hits) |
| Embed mounts unchanged | Grep `slug === ` in `src/pages/CaseStudyPage.jsx` (expect `fico-cod-rto`, `poketopia`) |
| Suite still tests both modes | Grep `const modes` in `tests/playwright-viewport.spec.ts` |
| Flag-off keymap (M=tone, T=dead) | Read `src/theme/ThemeProvider.jsx` lines 68-85 |
| CI fallback URL misconfig | Read `.github/workflows/deploy.yml` line 36 |
