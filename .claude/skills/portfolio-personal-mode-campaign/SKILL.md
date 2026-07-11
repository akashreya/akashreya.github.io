---
name: portfolio-personal-mode-campaign
description: >
  Plan-of-record for launching PERSONAL MODE on akashreya.space — parchment identity built,
  endpoints seeded, API wiring done; the flag's gate condition is MET and launch awaits the
  owner's word + deploy gate. Load this when the task mentions: personal mode, the
  parchment/marauder's-map identity, Footprints, Chikorita, flipping PERSONAL_MODE_ENABLED,
  the old violet/glass theme or Baloo 2, "harry potter + pokemon + videogames + shreya ghoshal",
  embeds / per-project character / PokeTypeAtmosphere / ServiceInspector / LetterDrop, sidequests
  or ticker content, the admin UI at projects.akashreya.space, the obsessions board, HeroTicker,
  or "when can we launch personal mode". Also load before ANY change to personal-mode visuals,
  before editing sidequests/ticker content, and before touching src/config.js. Do NOT load for
  recruiter-mode work, general debugging, or deploy mechanics (see siblings listed inside).
---

# Personal Mode Campaign

The runbook for redesigning, seeding, and launching personal mode. **The flag's written gate —
"flip to true when /api/sidequests + /api/ticker are live and seeded" (`src/config.js:1-2`) —
is MET as of 2026-07-11.** Launch is now an owner decision plus the deploy gate, not blocked
work. Status as of 2026-07-11:

| Item | State (2026-07-11) | Where |
|---|---|---|
| `PERSONAL_MODE_ENABLED` | `false` in git, `true` in the owner's working tree. **Gate condition met** — commit the flip via the launch protocol (e) on the owner's word | `src/config.js:3` |
| Personal theme | **Parchment identity SHIPPED** (`44d54c4`): Marauder's-Map prop palette, Fondamento display / Alegreya body / Sacramento script. Violet/glass + Baloo 2 are GONE. | `src/theme/themes.js` personal block |
| Ambient identity layer | Footprints (cursor ink trail) + Chikorita (CDN-frame buddy) shipped in `44d54c4`, both personal-mode-gated | `src/components/Footprints.jsx`, `Chikorita.jsx` |
| `/api/sidequests`, `/api/ticker` | **SEEDED on prod 2026-07-11** (7 nodes / 9 lines, content differs from the old hardcoded arrays). Local dev backend may still be `200 []`. | backend |
| Frontend fetch of those endpoints | **BUILT 2026-07-11** — `fetchSideQuests`/`fetchTicker` with `fallbackSideQuests`/`fallbackTicker` mirrors; hardcoded arrays deleted; empty/down/recruiter states verified | `src/api/client.js`, `src/sections/SideQuests.jsx`, `HeroTicker.jsx` |
| Per-project embeds | 2 exist (poketopia, fico-cod-rto); owner verdict: right direction, "too less" — the still-open density work | `src/pages/CaseStudyPage.jsx:315-332` |
| Visual test coverage | Personal half of the suite exists (7 viewports); spec `test.skip`s personal cases when the flag is off. Personal baselines are STALE vs the parchment redesign + new board content — deliberate regen required before they gate anything | `tests/playwright-viewport.spec.ts:13` |

Launch chain (owner-confirmed order): **redesign converges → seed sidequests/ticker via admin UI
→ flip the flag → deploy gate → push**. Identity and seeding are done — the chain is at "flip
the flag". Embed density (gate b) remains open DESIGN work but is NOT a launch blocker; it can
land post-launch.

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

## (a) DESIGN BRIEF — RESOLVED for identity; density still open

Owner's brief, verbatim: **"harry potter + pokemon + videogames + shreya ghoshal"**.

**Problem 1 — IDENTITY: RESOLVED** (approved piece-by-piece 2026-07-10, committed in `44d54c4`).
The violet/glass theme was replaced by the **illustrated-manuscript parchment register**:

- **Palette**: Marauder's-Map film-prop parchment (light tone: ground `#ccb891`, mid `#a59172`,
  ink `#33240f`, leaf-green accent `#38591f`); dark tone is "wandlight" (deep amber-brown,
  candle-glow gradients). Seal red `#5a0606` is deliberately UNUSED — reserved for one rare
  wax-seal detail, on owner request only.
- **Type**: Fondamento display (LOTR vibes, 400-only), Alegreya body, **Sacramento** as a new
  `script` token (`--font-script`, card headings — "Shreya's feminine"). Baloo 2 removed.
- **Ambient motion**: Footprints cursor trail (marauder's-map ink prints, idle wipe =
  "mischief managed", never captioned) and Chikorita buddy (imperative state machine, frames
  from CloudFront via `VITE_CDN_URL`, degrades to absent without the env var).
- **Doctrine**: identity enacted, not announced; ambient layers quiet; every decorative feature
  loses gracefully (absent, never broken).

**NOT approved** (idea-status only — do not build without a fresh owner yes): GBA-style dialogue
boxes, continue screen, dex, trainer card, or any other element from the old concept board.

**Problem 2 — DENSITY: OPEN.** Per-project embedded character (PokeTypeAtmosphere,
ServiceInspector, LetterDrop) is the right direction but under-committed — owner's words: "too
less". 9 type-pair palettes defined in `PokeTypeAtmosphere.jsx:4-14` but only 1 of 8 case studies
(`poketopia`) consumes them, and only 1 (`fico-cod-rto`) has an inspector. **Amplify, don't
replace.** This is the remaining design work before convergence.

**Process rule (owner-stated, learned the hard way):** when the owner shows a reference (a file,
a screenshot, a link), he wants ASSESSMENT AND FEEDBACK FIRST — not implementation. Never start
building from a reference without giving the verdict and getting a go.

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
- `HeroTicker` — API-driven since 2026-07-11 (`fetchTicker`, `fallbackTicker` seed state), doubled for seamless loop
- `SideQuests` — API-driven since 2026-07-11 (`fetchSideQuests`, mode-gated fetch, connector hub derived from `pos === 'center'`), `null` unless personal mode
- `Footprints` — marauder's-map ink trail behind the cursor; page-coordinate layer, gated on personal + fine pointer + no reduced-motion
- `Chikorita` — buddy sprite above the navpill; frames from `${VITE_CDN_URL}/site/chikorita/`; renders null without the env var, hides itself on frame load error
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
| Page loads in personal mode | Parchment ground (`#ccb891` light / wandlight dark), Fondamento headings, Sacramento card titles |
| Press `M` (outside inputs) | Iris transition overlay, "> entering personal mode · akash@kelvin" beat text, mode flips |
| Press `T` | Tone toggles light/dark |
| Move the cursor | Ink footprints trail and fade; stopping ~2.5s wipes the remainder together |
| Chikorita | Buddy idles above the navpill band, strolls occasionally — REQUIRES `VITE_CDN_URL` (`.env.local` for dev; CI gets it from the repo secret via `deploy.yml`); without it she is absent by design |
| Scroll the portfolio page | SideQuests corkboard renders after Projects; HeroTicker scrolls in hero right column; ambient blobs; Enterprise collapsed to one-line strip |

If you see X instead → branch:

| Symptom | Cause | Fix |
|---|---|---|
| `?mode=personal` ignored, site stays recruiter | Flag still `false` — ThemeProvider hard-forces `recruiter` when disabled (`ThemeProvider.jsx:12-14`) | Verify `src/config.js:3`, restart dev server |
| `M` toggles light/dark instead of mode; `T` dead | Same — flag-off keymap (`ThemeProvider.jsx:77-80`) | Same |
| Mode-toggle button on a case-study or in-the-wild page does nothing | Those pages render the button UNGATED (`CaseStudyPage.jsx:300-307`, `InTheWildPage.jsx:135-142`) but `triggerModeTransition` no-ops when the flag is off (`ThemeProvider.jsx:44`) | Expected with flag off; works with flag on |
| Site loads recruiter despite flag on | Stale `localStorage['akashreya.mode']` is only consulted when flag is on, but an explicit `?mode=` always wins — check for typos in the param | — |

### Gate C2 — empty vs seeded data states — PASSED 2026-07-11

The API wiring is built and all four states were exercised on 2026-07-11:

- **Seeded**: board shows the 7 live nodes (hub = "Time · Craft · Intentionality" at center,
  id `time`), ticker 9 lines — matching the LIVE API, not the stale seed JSONs. Verified via a
  local stub serving captured prod payloads (dev cannot hit prod directly — the prod API 403s
  localhost origins; see **portfolio-api-and-fallback** CORS section).
- **Empty** (backend up, tables empty — the local dev backend's state): fetchers treat `[]` as
  failure → `fallbackSideQuests`/`fallbackTicker` render; never a blank board. Verified.
- **API down**: whole site renders from fallbacks. Verified. (`fallbackSitePersonal`'s missing
  `nav` was fixed 2026-07-11 — it now references `fallbackSite.nav`/`fallbackSite.enterprise`.)
- **Recruiter mode**: zero sidequests/ticker network calls (SideQuests' effect is mode-gated;
  HeroTicker only mounts in the personal Hero branch). Verified.

Re-run this gate only if the fetchers, fallback mirrors, or backend shapes change.

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

## (d) SEEDING PROTOCOL — DONE 2026-07-11 (prod)

The owner seeded `/api/sidequests` and `/api/ticker` via the admin UI at
https://projects.akashreya.space (the content-entry UI, NOT an API endpoint — the API is
`https://projectsapi.akashreya.space`). Live content as seeded:

- **Sidequests** — 7 nodes: hotwater/bl, time/center (the hub — id is `time`, not the old
  `craft`), pokemon/tl (only node with a `projectRef`: `"poketopia"`), blackqueen/r, fiction/tr,
  games/l, shreya/br. The `emoji` field is ignored by the frontend (owner 2026-07-11: "emotes
  look childish" — render span + CSS removed; a future redesign replaces, not restores, them).
- **Ticker** — 9 lines (displayOrder gap at 6; frontend sorts). Owner-edited copy, e.g.
  "having fun is the point. Not shipping. Fun." and "Engineer. 15 years. Still writes code."

**The `Design/seed_data` JSONs/SQL are now RELICS** — they mirror the pre-2026-07-11 hardcoded
arrays (cards/ai/difftool nodes, `craft` hub, 10 ticker lines), NOT what was seeded. The live
API is the source of truth; `fallback.js` mirrors it. Don't re-seed from those files.

Content edits go through the admin UI, then re-mirror `fallbackSideQuests`/`fallbackTicker` in
the same change set (sync discipline: **portfolio-api-and-fallback**). Ticker rule from the
spec still stands: text is "Akash's voice — do not sanitise or paraphrase."

### Verify current live content (PowerShell — note `;` not `&&`)

```powershell
Invoke-RestMethod https://projectsapi.akashreya.space/api/sidequests | ConvertTo-Json -Depth 4
Invoke-RestMethod https://projectsapi.akashreya.space/api/ticker | ConvertTo-Json -Depth 4
```

`[]` from PROD would mean the seeding regressed — investigate backend-side. (`[]` from the
LOCAL backend is normal; it was never seeded.) A `pos` value outside
tl/tr/r/br/bl/l/center, or two nodes sharing a `pos`, renders wrong (missing/stacked nodes) —
fix in the admin UI.

### Fenced-off wrong paths

- **DO NOT flip `PERSONAL_MODE_ENABLED` in a commit outside the launch protocol.** Push-to-main is a live deploy.
- **DO NOT edit `src/data/fallback.js` as a substitute for the admin UI.** Fallback is the offline mirror, not the source of truth. Sync discipline: **portfolio-api-and-fallback**.

---

## (e) LAUNCH PROTOCOL

Preconditions — all must be true, in writing:

- [x] Identity design landed (gate a — parchment, `44d54c4`)
- [x] Sidequests + ticker seeded and verified live (gate d, 2026-07-11)
- [x] API wiring built and all data states tested (gate C2, 2026-07-11)
- [x] Flag's written gate condition met (seeded endpoints — `src/config.js:1-2`)
- [x] **`VITE_CDN_URL` in the production build** — owner set the repo secret (2026-07-11) and `deploy.yml` now passes it to the build env (`VITE_CDN_URL: ${{ secrets.VITE_CDN_URL }}`, deliberately no fallback: unset secret → Chikorita degrades to absent, never broken)
- [ ] Deploy gate at launch time: C1 manual check + visual suite (C3) with baselines deliberately regenerated against the parchment identity

(Embed density — gate b — is open design work, NOT a launch blocker.)

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
- [ ] SideQuests board (7 API nodes, hub "Time · Craft · Intentionality"), HeroTicker (9 API lines), blobs, collapsed Enterprise all render
- [ ] Footprints trail follows the cursor and wipes on idle; Chikorita appears (if absent, check `VITE_CDN_URL` in the build env and the CloudFront frames at `site/chikorita/`)
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

All claims verified against the working tree and live API on **2026-07-11**. Re-verify before
trusting:

| Volatile fact | Re-verification (PowerShell) |
|---|---|
| Flag state (committed vs local) | `Get-Content src\config.js; git -C . diff src/config.js` |
| Endpoints still seeded | `Invoke-RestMethod https://projectsapi.akashreya.space/api/sidequests; Invoke-RestMethod https://projectsapi.akashreya.space/api/ticker` (expect 7 and 9 items) |
| Personal theme still parchment | Grep `Fondamento` and `ccb891` in `src/theme/themes.js` (violet `6e45ff` should be GONE) |
| SideQuests/HeroTicker still API-driven | Grep `fetchSideQuests\|fetchTicker` in `src/api/client.js` and `src/sections/` (expect hits in both) |
| Embed mounts unchanged | Grep `slug === ` in `src/pages/CaseStudyPage.jsx` (expect `fico-cod-rto`, `poketopia`) |
| Suite still tests both modes | Grep `const modes` in `tests/playwright-viewport.spec.ts` |
| Flag-off keymap (M=tone, T=dead) | Read `src/theme/ThemeProvider.jsx` lines 68-85 |
| CI passes VITE_CDN_URL (wired 2026-07-11) | `Select-String -Path .github\workflows\deploy.yml -Pattern 'VITE_CDN_URL'` (expect one hit in the Build env; secret value lives in GitHub repo settings) |
