---
name: portfolio-api-and-fallback
description: >
  The API integration layer of akashreya-portfolio: endpoint catalog (which are live-and-seeded
  vs built-but-unseeded), pickVoice/deepResolveVoice semantics, v2-vs-v3 site shape detection,
  TTL cache behavior, fallback.js sync discipline, and backend topology (projectsapi vs admin UI).
  Load when: touching src/api/client.js or src/api/axios.js; adding/changing an API call; content
  looks wrong/stale/mixed-voice; deciding whether to edit fallback.js or seed the backend;
  "[object Object]" or React error #31 renders; wiring /api/sidequests or /api/ticker; verifying
  what the live backend actually serves; setting VITE_API_URL; CORS questions. Keywords: voiced
  field, pickVoice, resolveVoice, deepResolveVoice, TTL cache, fallback, projectsapi, admin UI,
  seed data, API handover.
---

# Portfolio API and Fallback Layer

Everything the frontend knows about the backend lives in two files: `src/api/axios.js`
(25 lines, base URL + timeout) and `src/api/client.js` (155 lines, everything else).
Static mirror of API content: `src/data/fallback.js` (955 lines). No other file in
`src/` makes HTTP calls.

**Terminology — these four words WILL be confused. Fix them now:**

| Term | Means | Values | Lives in |
|---|---|---|---|
| **mode** | Which persona the site presents | `recruiter`, `personal` | `useTheme().mode`, `data-mode` on `<html>` |
| **voice** | Which copy variant of a *content field* is shown | the `recruiter`/`personal` keys inside a voiced field | API payloads + `client.js` resolution |
| **voiced field** | A JSON value shaped `{"recruiter": X, "personal": Y}` instead of a flat value | — | API responses |
| **tone** | Light/dark color scheme | `light`, `dark` | `useTheme().tone`, `data-tone` |

"Theme" is not a real axis in v3 — CLAUDE.md's "crimson/glass themes" description is stale.
Mode selects voice. Full axis rationale: see **portfolio-architecture-contract**.

## When NOT to use this skill

- Diagnosing a rendering crash or blank section → **portfolio-debugging-playbook** (it owns the symptom→triage table; this skill owns the mechanics it references).
- Deploy pipeline, GH Actions, env-from-scratch setup → **portfolio-build-run-deploy**.
- Theme tokens, where hardcoded copy lives, Design/ directory map → **portfolio-theme-and-content**.
- Seeding sidequests/ticker as part of the personal-mode launch → **portfolio-personal-mode-campaign** (it owns the seeding *protocol*; this skill owns the endpoint *facts*).
- Why the architecture is API-with-fallback at all → **portfolio-architecture-contract**.

## Backend topology

| Host / path | What it is | Notes |
|---|---|---|
| `https://projectsapi.akashreya.space` | **The production API.** | This is what `VITE_API_URL` should point at in prod. |
| `https://projects.akashreya.space` | **Admin UI** for content entry. NOT an API endpoint. | Never point the frontend here. |
| `E:\Work\Code\GitHub\projectservice` | Backend source (Spring-side repo "ProjectService"). | Pointer only — backend internals are out of scope for this skill library. DB is SQLite. |

**Known latent misconfiguration (document, don't fix):** `.github/workflows/deploy.yml:36`
sets `VITE_API_URL: ${{ secrets.VITE_API_URL || 'https://projects.akashreya.space' }}` —
the fallback is the *admin UI*, not the API. Harmless while the secret is set; a footgun if
it's ever deleted. Pipeline details: see **portfolio-build-run-deploy**.

**Prod-debugging protocol:** never debug a prod data bug against the live backend. Run the
backend locally from `E:\Work\Code\GitHub\projectservice`, point the frontend at it, reproduce
first:

```powershell
# .env.local already contains VITE_API_URL=http://localhost:8080
# start backend in projectservice (its own README/run config), then:
npm run dev
```

### VITE_API_URL resolution

`src/api/axios.js:3-10`: reads `import.meta.env.VITE_API_URL`; if unset, warns and falls back
to `http://localhost:8080`. Single axios instance, 30s timeout, no retry, no auth.

| File | Value | Status |
|---|---|---|
| `.env.local` | `http://localhost:8080` | Dev source of truth (UTF-8, wins over `.env`) |
| `.env` | `http://localhost:8080` | UTF-16 LE encoded — do not rely on it, `.env.local` covers dev |
| `.env.production` | `https://your-production-api.com` | **Placeholder, dead URL.** A bare local `npm run build` bakes this in. CI overrides via process env. |
| CI (`deploy.yml:36`) | secret, or admin-UI fallback | See misconfig above |

## Endpoint catalog

Base URL below = `https://projectsapi.akashreya.space`. All frontend GETs pass
`{ withCredentials: false }`. Status verified live 2026-07-10.

### LIVE AND SEEDED (as of 2026-07-10)

| Endpoint | Frontend caller | Cache key / TTL | On failure |
|---|---|---|---|
| `GET /api/site` | `fetchSite()` (`client.js:49`) | `site` / 10 min | returns `null`; `resolveVoice` supplies fallback |
| `GET /api/projects` | `fetchProjects()` (`client.js:61`) | `projects` / 10 min | `fallbackProjects` |
| `GET /api/projects/:slug` | `fetchCaseStudy(slug, mode)` (`client.js:101`) | `case:${slug}:${mode}` / 5 min | `fallbackCaseStudies[slug]` or not-found |
| `GET /api/mentions` | `fetchMentions()` (`client.js:119`) | `mentions` / 5 min | `fallbackMentions` |

**`/api/site`** — singleton. The live backend serves the **v2 per-field-wrapper shape**
(verified 2026-07-10), not the v3 top-level split:

```jsonc
{
  "brand": { "name": "Akash S K", "mark": "A·S", "url": "akashreya.space",
             "tagline": { "recruiter": "...", "personal": "..." } },   // voiced
  "hero":       { "recruiter": { /* eyebrow, nameFirst, ... */ }, "personal": { ... } },
  "liveBanner": { "recruiter": { ... }, "personal": { ... } },
  "principles": { "recruiter": { ... }, "personal": { ... } },
  "nav": [ { "id": "hero", "num": "01", "name": "...", "target": "#hero" }, ... ],
  "enterprise": [ { "client": "...", "role": "...", "period": "...", "desc": "...", "tags": [] } ],
  "contact": { "email": "...", "socials": [ { "label": "github", "href": "..." } ] }
}
```

**`/api/projects`** — array of 8 (slugs: fico-cod-rto, everythingabc, poketopia,
fico-ivr-simulator, lseg-rfa, reuters-pts, goldman-secdb, sita-dcs). Per item:

```jsonc
{ "id": 1, "slug": "fico-cod-rto", "title": "...", "kind": "WIN", "span": "WIDE",
  "eyebrow": "...", "year": "...", "hasCaseStudy": true, "displayOrder": 1,
  "shortDescription": { "recruiter": "...", "personal": "..." },   // voiced (live, verified)
  "technologies": [ { "name": "..." } ], "metrics": [ ... ],
  "githubUrl": null, "liveDemoUrl": null, "projectType": "...",
  "images": [ ... ], "createdAt": "...", "updatedAt": "..." }
```

**`/api/projects/:slug`** — case study detail. Top-level keys (live, verified):
`slug, overview, problem, architecture, decisions, process, tradeoffs, outcome, metrics, links`.
Some sub-fields are voiced (e.g. `overview.lede` is `{recruiter, personal}` live) — the
handover spec limits voicing to `overview.lede`, `problem.body`, `outcome.body`, but the
frontend deep-resolves voiced wrappers *anywhere* in the tree (`deepResolveVoice`), which is
deliberately broader than the spec. Unknown slugs return HTTP 404.

**`/api/mentions`** — array of 4. Per item:
`{ id, kind, badge, date, quote, authorName, authorRole, authorInitials, link }`.
`kind` arrives uppercase (`"TALK"`); `normalizeMention` lowercases it. No voiced fields.

### BUILT BUT UNSEEDED (as of 2026-07-10)

| Endpoint | Live status | Spec | Seed material |
|---|---|---|---|
| `GET /api/sidequests` | **200, returns `[]`** (verified 2026-07-10) | `Design/API_HANDOVER_v3.md` §5 | `Design/seed_data/portfolio_v3_seed_data/json/side_quests.json` + `sql/03_side_quests_v3.sql` |
| `GET /api/ticker` | **200, returns `[]`** (verified 2026-07-10) | `Design/API_HANDOVER_v3.md` §6 | `Design/seed_data/portfolio_v3_seed_data/json/ticker.json` + `sql/04_ticker_v3.sql` |

Never document these as populated. Spec shapes: sidequests items are
`{ id, pos ('tl'|'tr'|'r'|'br'|'bl'|'l'|'center'), emoji, title, body, projectRef, displayOrder }`;
ticker items are `{ text, projectRef, displayOrder }`.

**Critical refinement of the "built but unseeded" fact:** the backend serves these endpoints,
but **the frontend never calls them**. There is no `fetchSideQuests`/`fetchTicker` in
`src/api/client.js` — grep `src/` for `/api/sidequests|/api/ticker` and you hit only the
comment in `src/config.js:2`. `SideQuests.jsx` hardcodes 7 nodes (`NODES`, lines 13-21) and
`HeroTicker.jsx` hardcodes 10 lines (`TICKER_LINES`, lines 1-12); the two seed JSONs are exact
mirrors of those arrays. So "flip `PERSONAL_MODE_ENABLED` and it's API-driven" is FALSE —
seeding the backend AND writing the fetch wiring are both open work. Launch sequencing:
see **portfolio-personal-mode-campaign**.

### Verification commands (PowerShell, copy-paste)

```powershell
# Status + payload size per endpoint (unseeded ones show len=2, i.e. "[]")
foreach ($ep in 'site','projects','mentions','sidequests','ticker') {
  $r = Invoke-WebRequest -Uri "https://projectsapi.akashreya.space/api/$ep" -UseBasicParsing -TimeoutSec 15
  Write-Output "$ep -> $($r.StatusCode) len=$($r.Content.Length)"
}

# Which shape does /api/site serve? Top-level keys 'recruiter','personal' = v3 split;
# 'brand','hero',... = v2 per-field wrappers (the live shape as of 2026-07-10)
$s = Invoke-RestMethod "https://projectsapi.akashreya.space/api/site"
$s | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name

# Is a project field voiced? (PSCustomObject with recruiter/personal = voiced)
$p = Invoke-RestMethod "https://projectsapi.akashreya.space/api/projects"
$p[0].shortDescription

# Case study detail + 404 behavior
Invoke-RestMethod "https://projectsapi.akashreya.space/api/projects/fico-cod-rto" | ConvertTo-Json -Depth 2
try { Invoke-WebRequest "https://projectsapi.akashreya.space/api/projects/nope" -UseBasicParsing } catch { $_.Exception.Response.StatusCode.value__ }  # expect 404
```

## Voice resolution — the exact rules

### pickVoice(field, mode) — `client.js:23-34`, not exported

```js
if (field !== null && field !== undefined && typeof field === 'object' &&
    !Array.isArray(field) && ('recruiter' in field || 'personal' in field)) {
  return field[mode] ?? field.recruiter ?? field.personal;
}
return field;
```

- Detection is **key presence** (`in`), not truthiness — a wrapper carrying only one voice still unwraps.
- Fallback chain: requested mode → `recruiter` → `personal`.
- Flat strings, arrays, and plain objects pass through unchanged (the v2 backward-compat rule).
- `isVoicedWrapper` (`client.js:74-82`) is the identical predicate duplicated as a named helper.

### deepResolveVoice(node, mode) — `client.js:86-95`

Recursively unwraps voiced wrappers **anywhere** in a tree: arrays are mapped, plain objects
rebuilt via `Object.fromEntries`, primitives pass through. Applied to case-study payloads by
`normalizeCaseStudy` (`client.js:97-99`).

### WHERE resolution must happen (the React error #31 rule)

**Every API payload must pass through voice resolution before any component renders it.**
A voiced field that reaches JSX unresolved is an object child → React throws minified
error #31 (or renders `[object Object]`). This is exactly what the voiced-fields saga was
(commits 86beafa → 06bd26f); `deepResolveVoice` is the fix. Triage steps for a live #31:
see **portfolio-debugging-playbook**.

The resolution points, and they differ by endpoint — know which is which:

| Data | Resolved WHERE | Consequence |
|---|---|---|
| Site (`/api/site`) | **Per render** — `fetchSite` caches the RAW voiced payload; `PortfolioPage.jsx:24` calls `resolveVoice(site, mode)` every render | Mode toggle re-voices instantly, no refetch |
| Case study | **At fetch time** — `deepResolveVoice` inside `fetchCaseStudy`, cache key includes mode | Mode toggle mid-page does NOT re-voice: `CaseStudyPage.jsx` effect deps are `[slug]` only (line 99), so the mode-keyed cache entry is never requested. Known gap. |
| Project grid `desc` | In `normalizeProject` (`client.js:10`) — **hard-pinned to `pickVoice(raw, 'recruiter')`**, and the `projects` cache key is not mode-keyed | The personal voice of `shortDescription` never renders on the grid as written |
| Mentions | No voiced fields; only `kind` lowercased | — |

If you add a new fetch (e.g. sidequests/ticker wiring): run the payload through
`deepResolveVoice` (or confirm the spec guarantees flat fields, as sidequests/ticker do) and
decide render-time vs fetch-time resolution consciously — render-time + raw cache is the
pattern that keeps mode toggles free.

### resolveVoice(siteData, mode) — v2 vs v3 shape detection, `client.js:132-154`

1. Picks fallback: `fallbackSitePersonal` if mode is personal, else `fallbackSiteRecruiter`.
2. `!siteData` (the `null` from a failed `fetchSite`) → return fallback whole.
3. **v3 shape** — `if (siteData.recruiter && siteData.personal)` (top-level split, truthiness
   check): returns `{ ...fallback, ...(siteData[mode] ?? {}) }`. Shallow merge — any top-level
   key the API voice omits comes from fallback. This matters: the v3 seed
   `json/site.json` has **no `enterprise` key** in either voice; the merge papers over it.
4. **v2 shape** (anything else): field-by-field —
   `brand` spread with `tagline: pickVoice(...) ?? fallback.brand?.tagline`;
   `hero`/`liveBanner`/`principles`/`nav` each `pickVoice(field, mode) ?? fallback.X`;
   `enterprise`/`contact` flat with `?? fallback`.

**Reality check (2026-07-10): the live backend serves the v2 per-field shape**, so branch 4
is the production path. The v3 seed `site.json` uses the top-level split (branch 3). Both
work; do not assume one from the docs — `Design/API_HANDOVER_v3.md` §1 documents the
per-field shape while the seed JSON is the split shape. History of the shape-detection work:
commits 4a7f2d3, b120b40 (see **portfolio-debugging-playbook**).

Note: `fetchSite` has NO shape validation (unlike projects/mentions' non-empty-array checks).
An empty `{}` from the API caches for 10 min and falls through to the v2 branch, resolving
all-fallback field-by-field.

## TTL cache — `client.js:36-47`

```js
const TTL_LANDING = 10 * 60 * 1000;  // site + projects grid
const TTL_CLICK   = 5 * 60 * 1000;   // case study, mentions
const _cache = new Map();            // key -> { value, expiresAt }  (performance.now() based)
```

| Key | TTL | Holds |
|---|---|---|
| `site` | 10 min | RAW (possibly voiced) site payload |
| `projects` | 10 min | Normalized projects array (recruiter-pinned desc) |
| `case:${slug}:${mode}` | 5 min | `{ data: resolvedStudy, notFound }` — only mode-keyed cache |
| `mentions` | 5 min | Normalized mentions |

Invalidation reality:

- Module-level, in-memory. **The only invalidation is a full page reload.** No API, no eviction.
- Errors are NOT cached — the producer throws before `_cache.set`, so failures retry on next call.
- **Exception: a 404 case study IS cached** — the inner catch in `fetchCaseStudy` converts
  HTTP 404 to `{ data: null, notFound: true }`, a successful producer result, cached 5 min.
- No in-flight dedup: two simultaneous calls with the same key both hit the network.
- After editing backend content, hard-reload the tab; content appearing stale within
  5-10 min is the cache working, not a bug.

## fallback.js sync discipline

`src/data/fallback.js` is the static mirror that keeps the site rendering when the API is
down (GitHub Pages up + backend down must still look complete). Exports:

| Export | Line | Notes |
|---|---|---|
| `fallbackCaseStudies` | 1 | Keyed by slug, 8 entries. All fields FLAT strings — no voiced wrappers. `poketopia` carries extra `_typePairs`. |
| `fallbackSite` / `fallbackSiteRecruiter` | 595 / 680 | Same object (alias). Flat v2 shape. |
| `fallbackSitePersonal` | 682 | **Missing `nav` and `enterprise` keys** — personal mode offline yields an empty NavPill (guarded by `items ?? []`). Contact email differs: `hello@akashreya.space` vs recruiter's `akashakashreya@gmail.com`. |
| `fallbackProjects` | 738 | 8 projects, matches live slugs. |
| `fallbackMentions` | 909 | 4 mentions. |

**The rules:**

1. **Editing fallback.js is NEVER a substitute for seeding the backend.** Content's source of
   truth is the backend (entered via the admin UI at `https://projects.akashreya.space`).
   fallback.js is a mirror for offline resilience. If you only edit fallback.js, prod users
   (API up) never see the change and the mirror silently diverges.
2. When content changes on the backend, mirror it into the corresponding fallback export in
   the same change set. Fallback fields stay FLAT (pre-resolved per voice via the
   Recruiter/Personal site exports); do not put `{recruiter, personal}` wrappers in fallback.js.
3. Verify the mirror by killing the API locally: stop the local backend (or set
   `VITE_API_URL` to a dead port), `npm run dev`, and confirm the site renders complete.
4. Adding a project or case study to the backend without adding its fallback entry means
   that content vanishes offline (and unknown case-study slugs show "not found") — the
   seed SQL's `marketstream` slug is the standing example: `02_projects_v3.sql:19-22`
   references it, but it exists in neither the live API (8 slugs, verified 2026-07-10) nor
   `fallbackProjects`/`fallbackCaseStudies`. Treat it as a ghost until the owner seeds it.

## CORS

Per `Design/API_HANDOVER_v3.md:363-365`: `akashreya.github.io` and `akashreya.space` must
remain in the backend's allowed-origins list (unchanged from v2). The frontend sends
`withCredentials: false` on every call, so no credentialed-CORS complexity. If a browser
shows CORS errors from a new origin (e.g. a preview host), the fix is backend-side in
`projectservice` — out of scope here beyond the pointer.

## Known gaps and quirks (facts, not bugs to silently "fix")

| Quirk | Location | Status |
|---|---|---|
| Grid `desc` always recruiter voice; `projects` cache not mode-keyed | `client.js:10`, `client.js:63` | As written; personal grid voice unreachable |
| Case study doesn't re-voice on mode toggle | `CaseStudyPage.jsx:99` deps `[slug]` | Known gap; intent unverified |
| `fetchSite` accepts any shape incl. `{}` | `client.js:49-59` | No validation, 10-min cache |
| 404 case studies cached 5 min | `client.js:103-108` | Deliberate-looking |
| `fallbackSitePersonal` lacks `nav`/`enterprise` | `fallback.js:682-736` | Offline personal mode = empty NavPill |
| Frontend never calls /api/sidequests, /api/ticker | grep `src/` | Wiring not built; content hardcoded |
| deploy.yml VITE_API_URL fallback = admin UI | `.github/workflows/deploy.yml:36` | Document, don't fix |
| `marketstream` in seed SQL only | `02_projects_v3.sql:19-22` | Ghost slug |

## Provenance and maintenance

All facts verified against `main` and the live API on **2026-07-10**. Re-verify before trusting:

```powershell
# Endpoint status + seeded-ness (sidequests/ticker len=2 means still unseeded)
foreach ($ep in 'site','projects','mentions','sidequests','ticker') { $r = Invoke-WebRequest -Uri "https://projectsapi.akashreya.space/api/$ep" -UseBasicParsing -TimeoutSec 15; Write-Output "$ep -> $($r.StatusCode) len=$($r.Content.Length)" }

# Live /api/site shape (top-level 'recruiter','personal' = v3 split; 'brand','hero',... = v2 per-field)
(Invoke-RestMethod "https://projectsapi.akashreya.space/api/site") | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name

# client.js internals still as documented (pickVoice, cache TTLs, resolveVoice branches)
Select-String -Path src\api\client.js -Pattern 'TTL_LANDING|TTL_CLICK|recruiter.*personal|case:'

# Frontend still doesn't fetch sidequests/ticker (only hit should be the src/config.js comment)
Get-ChildItem src -Recurse -Include *.js,*.jsx | Select-String -Pattern 'api/sidequests|api/ticker'

# Personal-mode flag state
Get-Content src\config.js

# fallback.js export lines still match
Select-String -Path src\data\fallback.js -Pattern "^export const"

# CI VITE_API_URL fallback still the admin UI
Select-String -Path .github\workflows\deploy.yml -Pattern "VITE_API_URL"
```
