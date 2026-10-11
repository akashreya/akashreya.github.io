---
name: portfolio-theme-and-content
description: >
  Theme tokens, copy locations, and the personal-mode identity for akashreya-portfolio. Load
  when changing colors, fonts, accents or any CSS custom property in src/theme/themes.js;
  asking where a piece of text lives (admin UI, src/data/fallback.js, or hardcoded JSX); editing
  hero, tagline, project, case-study, principles, nav or contact copy; debugging ?mode=/?tone=
  params or localStorage persistence; navigating the Design/ directory (which handover doc is
  current). Also load before any personal-mode visual or identity work: the parchment /
  Marauder's-Map palette, Fondamento/Alegreya/Sacramento fonts, Footprints, Chikorita,
  AmbientBlobs, LetterDrop, SideQuests or HeroTicker look, per-project case-study embeds
  (PokeTypeAtmosphere, ServiceInspector, TYPE_PAIRS), proposing a new embed, GBA dialogue boxes
  or other unapproved concept-board ideas, or assessing a reference the owner shares. Keywords:
  token, applyTheme, FOUC, admin UI, API_HANDOVER, wandlight.
---

# Portfolio: theme mechanics, where content lives, personal-mode identity

Vocabulary (mode / tone / voice / voiced field), keyboard shortcuts and `PERSONAL_MODE_ENABLED`
semantics: **portfolio-architecture-contract**. Voiced-field resolution, cache TTLs, endpoint
shapes, fallback exports and sync rules: **portfolio-api-and-fallback**. Baselines after a visual
change: **portfolio-visual-testing**. Shipping: **portfolio-build-run-deploy**.

## Hard rules

- A recruiter-dark token change goes in two places: `src/theme/themes.js` and the inline
  `:root` block in `index.html` (FOUC guard). Skip the second and the page flashes the old value
  before React mounts.
- Mode-conditional styling lives in CSS under `[data-mode="personal"]` / `[data-mode="recruiter"]`,
  never in JS style objects.
- Fondamento ships only weight 400. Never set a bolder weight on personal display text.
- API-backed copy is edited in the admin UI, then mirrored in `src/data/fallback.js` in the same
  change set. Editing only `fallback.js` changes nothing for visitors while the API is up.
- When the owner shares a reference (file, screenshot, link), give an assessment and verdict
  first and wait for a go. Never start building from a reference.
- Items on the not-approved list below need a fresh owner yes before any build.
- Every decorative feature degrades to absent, never broken.

## 1. Theme mechanics

`src/theme/themes.js` exports `themes` and `applyTheme`.

```
themes
├── recruiter   flat editorial, "Bloomberg terminal"
│   ├── fonts   display Instrument Serif · body Manrope · mono IBM Plex Mono · script Instrument Serif
│   ├── light   accent #c8341e / #e14b3a
│   └── dark    accent #e14b3a / #f56f54
└── personal    illustrated-manuscript parchment
    ├── fonts   display Fondamento · body Alegreya · mono IBM Plex Mono · script Sacramento
    ├── light   "day parchment": bg #ccb891, ink #33240f, accent #38591f
    └── dark    "wandlight": bg #1b1408, ink #ecdcb2, accent #8fb96a, amber candle glows
```

Each tone map has the same 18 keys: `bg bg2 surf surf2 line line2 ink ink2 ink3 accent accent2
surf-blur surf-radius surf-shadow surf-border pill-shadow glow-a glow-b`. The mode character is
carried by the tokens: recruiter `surf-radius: 4px` with transparent glows; personal
`surf-radius: 10px` with tea-stain radial-gradient glows. Both modes use `surf-blur: 0px`.

`applyTheme(modeName, tone)` sets every token as `--{key}` on `<html>`, sets `--font-display`,
`--font-body`, `--font-mono`, `--font-script` from the mode's `fonts`, and writes
`data-mode` / `data-tone`. `ThemeProvider` calls it in an effect on every mode/tone change. CSS
reads `var(--bg)` etc.; mode-forked rules key off `[data-mode=...]` across `src/styles/*.css`.

FOUC guard: `index.html` hardcodes `<html data-mode="recruiter" data-tone="dark">` and inlines a
copy of the recruiter-dark tokens. All six families (Instrument Serif, Manrope, IBM Plex Mono,
Fondamento, Alegreya, Sacramento) load from one Google Fonts link in `index.html`.

State (`src/theme/ThemeProvider.jsx`): mode init is `?mode=` param, then localStorage
`akashreya.mode`, then `recruiter`; tone init is `?tone=`, then `akashreya.tone`, then `dark`.
URL params are read once at module load (`_startParams`); changing the URL later needs a reload.
`setMode` / `setTone` persist to localStorage. `triggerModeTransition(nextMode)` plays the
`ModeTransition` overlay (`iris` into personal, `curtain` back; mode flips at 260ms, overlay
clears at 700ms) and switches instantly under `prefers-reduced-motion`.

### Change or add a token

1. Edit `themes.js`, usually in both tones of the mode; consider the other mode for parity.
2. Recruiter-dark token: mirror it in the `index.html` `:root` block.
3. New token: add the key to all four tone maps (`applyTheme` iterates `Object.entries`), consume
   it as `var(--key)`. Add it to `index.html` only if it affects first paint.
4. Check both modes and tones on `npm run dev` (`M` mode, `T` tone).
5. Pixels moved: regenerate baselines per **portfolio-visual-testing**.

## 2. Where copy lives

| Content | Home | Change via |
|---|---|---|
| Brand, tagline, hero (eyebrow, name, title, thesis, stats, CTAs, recruiter `terminal`, personal `ledger`), live banner, section heads (`sections.*.title/num/collapsed`), principles, nav, enterprise, contact | `GET /api/site` | Admin UI, then mirror `fallbackSite` / `fallbackSitePersonal` |
| Project grid cards | `GET /api/projects` | Admin UI, then mirror `fallbackProjects` |
| Case-study prose (`nav{recruiter,personal}`, `sections[]`) | `GET /api/projects/:slug` | Admin UI, then mirror `fallbackCaseStudies` |
| In-the-wild mentions | `GET /api/mentions` | Admin UI, then mirror `fallbackMentions` |
| SideQuests board nodes | `GET /api/sidequests` | Admin UI, then mirror `fallbackSideQuests` |
| HeroTicker margin notes | `GET /api/ticker` | Admin UI, then mirror `fallbackTicker` |
| Inventory below | Hardcoded JSX | Code change through the deploy gate |

The admin UI is `https://projects.akashreya.space` (content entry, not an API). The API is
`https://projectsapi.akashreya.space`. Ticker text is the owner's voice: never sanitise or
paraphrase it. `PortfolioPage` fans `resolveVoice(site, mode)` out to `TopMark`, `Hero`,
`Projects`, `SideQuests`, `Principles`, `Enterprise`, `Footer`, `NavPill`.

### Hardcoded copy

| Copy | Where | Mode |
|---|---|---|
| Ledger heading `Presently`, caption `BENGALURU · IST · UPDATED OFTEN` | `src/sections/Hero.jsx` `Ledger` | personal |
| Terminal row labels `LOC` / `NOW` / `LATEST`, `CASE STUDY →`, `Bengaluru` default when `terminal.loc` is missing | `src/sections/HeroTerminal.jsx` | recruiter |
| `Connect→` mailto label on the collapsed strip | `src/sections/Enterprise.jsx` | personal |
| Footer name casing, `Bengaluru · IST`, `© 2026 Akash S K` | `src/sections/Footer.jsx` | both (forked) |
| Trailing `.` of a section title rendered as accent `<em>` | `src/components/SectionHead.jsx` | both |
| Mode-transition beat texts | `ThemeProvider.jsx` `triggerModeTransition` | overlay |
| ThemeHint label | `src/components/ThemeHint.jsx` | both |

### Change content without touching components

1. Find the home in the table. Hardcoded means it is a code change, not a content change.
2. Edit in the admin UI. No frontend deploy needed for visitors.
3. Registers differ by mode: enter the field as `{"recruiter": "...", "personal": "..."}`. A plain
   string serves both.
4. Mirror in `src/data/fallback.js`: flat strings only, the matching register in the matching
   fallback object. That edit is a code change and goes through the deploy gate.
5. "My edit didn't show": the client caches responses in memory (TTLs in
   **portfolio-api-and-fallback**). A hard reload clears it.

## 3. Design/ map

Only the four v3 handover specs are tracked in git. Everything else in `Design/` is gitignored and local only.

| Path | Status |
|---|---|
| `API_HANDOVER_v3.md` | Base v3 API spec: voiced fields, sidequests/ticker, SQLite types |
| `API_HANDOVER_v3.1.md` | Addendum: `sections` node on `/api/site`, principle item titles |
| `API_HANDOVER_v3.1_HERO.md` | Addendum: hero redesign fields (terminal, ledger) |
| `API_HANDOVER_v3.2_CASE_STUDY.md` | Current case-study spec; supersedes v3 §3 |
| `API_HANDOVER.md` | v2 spec, superseded, local only. Never cite it. |
| `Ds_v2/`, `Portfolio DS-handoff.zip` | v2 static design-system prototype. Reference only, not the running app |
| `chikorita-frames/`, `chikorita-frames-handover.md` | Source art and generation brief for Chikorita frames (served from the CDN, not from here) |

v3's mode names ("Editorial Crimson", "Glass Violet") are outdated; the personal identity is
parchment (below).

## 4. Personal-mode identity and embeds

Owner's brief: "harry potter + pokemon + videogames + shreya ghoshal". Identity is enacted, not
announced: nothing captions or explains the references, ambient layers stay quiet.

**Palette.** Marauder's-Map film-prop parchment. Light: ground `#ccb891`, aged mid `#a59172`,
ink `#33240f`, leaf-green accent `#38591f`. Dark ("wandlight"): deep amber-brown with candle-glow
gradients. Seal red `#5a0606` is deliberately unused, reserved for one rare wax-seal detail on
owner request.

**Type.** Fondamento display (400 only), Alegreya body, Sacramento as `--font-script` for card
headings.

**Ambient layer** (all return null outside personal mode):

| Component | Behavior |
|---|---|
| `Footprints` | Ink-print trail behind the cursor; wipes after 2.5s idle (`IDLE_WIPE_MS`). Needs fine pointer and no reduced motion |
| `Chikorita` | Buddy sprite above the navpill, state machine over frames at `${VITE_CDN_URL}/site/chikorita/`. Absent without the env var; hides itself if a frame fails to load |
| `AmbientBlobs` | Drifting background blobs |
| `LetterDrop` | Per-letter drop of the personal hero name; CSS scoped under `[data-mode="personal"]` in `portfolio.css` |
| `SideQuests` | Obsessions board; hub is the node with `pos === 'center'` |
| `HeroTicker` | Margin-notes strip under the personal hero, content doubled for a seamless loop |

`InTheWildPage` staggers `.mention` cards with `.is-dropped` at 70ms intervals in personal mode
(unrelated to `LetterDrop`).

**Not approved** (ideas only, need a fresh owner yes): GBA-style dialogue boxes, continue
screen, dex, trainer card, or anything else from the old concept board. The `emoji` field on
sidequest nodes is ignored on purpose; a redesign replaces it, never restores it.

### Embeds

An embed is a per-project character component mounted on a case-study page. Two exist and they
define the two patterns. Owner verdict: right direction, too few. Amplify, don't replace.

**Pattern 1, DOM-driven atmosphere: `PokeTypeAtmosphere`.** Mounted when `slug === 'poketopia'`
in `CaseStudyPage`, no props. On mount sets `data-poketypes="on"` on `<html>`. `CaseStudyPage`'s
`TYPE_PAIRS` map assigns a type pair per section; `CaseStudySection` (and the case-study hero)
render `t-section` + `data-type-pair`. The component prepends a `.t-glow` into each, marks the
section past 30% of the viewport `.t-active`, and sets `--page-c1` / `--page-c2`. Nine pairs exist
in its `PAIRS` map; only poketopia uses them. Styles: `src/styles/cs-poketypes.css`, imported by
the component. Unmount removes the attribute, vars, listeners and every injected glow.

**Pattern 2, props-driven overlay: `ServiceInspector`.** Mounted when `slug === 'fico-cod-rto'`
with `data` (raw study), `endpoint`, `statusMs`, `keyMap`, `footer`. A floating status button opens
a drawer of syntax-highlighted JSON (strings HTML-escaped); `J` toggles, `Escape` closes. Hovering
a mapped key highlights its section, click scrolls to it; sections inside `sections[]` link by
their own `id` field. Styles: `src/styles/cs-inspector.css`.

**Proposal protocol.** For each case study, before building: propose 2-3 concepts, each with a
one-paragraph description, the pattern it follows, effort (S/M/L), and the identity commitment it
expresses. The owner approves one or none. Propose making existing embeds louder (more
`TYPE_PAIRS` entries, inspector variants for other backend-flavored projects) separately, same
approval rule.

**Build checklist per approved embed**

- [ ] Own stylesheet under `src/styles/`, imported by the component
- [ ] Conditional mount in `CaseStudyPage` keyed on slug, next to the existing two
- [ ] Full cleanup on unmount (`PokeTypeAtmosphere`'s effect cleanup is the reference)
- [ ] If it animates on the portfolio page, add a force-final-state rule to `DISABLE_ANIMATIONS`
      (**portfolio-visual-testing**). Case-study pages are not in the visual suite.
- [ ] Degrades to absent when its data or assets are missing
