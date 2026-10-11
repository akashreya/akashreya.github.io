---
name: portfolio-api-and-fallback
description: >
  Owns the API integration layer of akashreya-portfolio: the five-endpoint catalog with
  per-endpoint shapes, the v3.2 case-study shape (nav{recruiter,personal} + sections[],
  upgradeCaseStudy, LEGACY_SECTION_MAP, the raw payload for ServiceInspector), voice resolution
  (pickVoice, deepResolveVoice, resolveVoice v2/v3 site detection, /api/site sections), the TTL
  cache, the fallback.js exports and sync rule, and backend topology (projectsapi vs admin UI,
  prod CORS 403 for localhost). Load when touching src/api/client.js, src/api/axios.js,
  src/data/fallback.js or CaseStudySection.jsx; adding or changing an API call; content looks
  stale, wrong or mixed-voice; deciding between editing fallback.js and editing backend content;
  "[object Object]" or React error #31; case-study sections missing or out of order; verifying
  what the live backend serves; CORS questions.
---

# Portfolio API and fallback layer

All HTTP lives in `src/api/axios.js` (base URL, 30s timeout, no auth, no retry) and
`src/api/client.js` (fetchers, voice resolution, cache). `src/data/fallback.js` is the static
mirror. No other file in `src/` makes HTTP calls. Mode/tone/voice vocabulary and the
API-with-fallback invariant: **portfolio-architecture-contract**.

## Hard rules

1. Every API payload passes through voice resolution before it reaches JSX. A voiced wrapper
   (`{recruiter, personal}`) rendered as a React child is minified error #31 in prod.
2. Every fetcher returns usable data when the API is down, empty or unreachable. Arrays treat
   `[]` as failure and fall back.
3. Content's source of truth is the backend, edited through the admin UI. `fallback.js`
   mirrors it for offline rendering; editing only `fallback.js` changes nothing for prod
   users with the API up.
4. When backend content changes, mirror it into the matching fallback export in the same
   change set. Fallback fields stay flat (pre-resolved per voice), never voiced wrappers.
5. Debug prod data bugs against a local backend first, not the live API (see Topology).

## Topology

| Host / path | What it is |
|---|---|
| `https://projectsapi.akashreya.space` | Production API. The only valid prod `VITE_API_URL`. |
| `https://projects.akashreya.space` | Admin UI for content entry. Returns HTML; never point the frontend here. |
| `E:\Work\Code\GitHub\projectservice` | Backend source (Spring Boot, SQLite). Read-only from this repo. |

`VITE_API_URL` unset: `axios.js` `getApiUrl` warns `VITE_API_URL not set, using fallback` and
uses `http://localhost:8080`. `.env.local` sets the same URL. Env wiring and CI values:
**portfolio-build-run-deploy**.

**CORS.** Prod allows `https://akashreya.space`; its list comes from the `CORS_ALLOWED_ORIGINS`
env var in the backend's prod profile (`GlobalCorsConfig`). The local dev profile allows
`http://localhost:5173`. Against prod, a request carrying
`Origin: http://localhost:5173` gets **403** (the browser may surface it as 503). So a local
dev server pointed at the prod API silently renders fallbacks for everything. curl without an
Origin header succeeds, which is why the API "works from the shell but not the browser". For
real data in dev, run the local backend. CORS changes are backend-side in `projectservice`.
Every frontend GET sends `withCredentials: false`.

**Prod-bug protocol.** Run `projectservice` locally on 8080, `npm run dev` (`.env.local`
already points there), reproduce with real payloads in DevTools. A console showing
`GET /api/... failed, using fallback` means you are looking at fallback data, not API shapes.

## Endpoints

| Endpoint | Fetcher | Cache key / TTL | On failure |
|---|---|---|---|
| `GET /api/site` | `fetchSite()` | `site` / 10 min | returns `null`; `resolveVoice` supplies the fallback |
| `GET /api/projects` | `fetchProjects()` | `projects` / 10 min | `fallbackProjects` |
| `GET /api/projects/:slug` | `fetchCaseStudy(slug, mode)` | `case:${slug}:${mode}` / 5 min | `fallbackCaseStudies[slug]`, else not-found |
| `GET /api/mentions` | `fetchMentions()` | `mentions` / 5 min | `fallbackMentions` |
| `GET /api/sidequests` | `fetchSideQuests()` | `sidequests` / 10 min | `fallbackSideQuests` |
| `GET /api/ticker` | `fetchTicker()` | `ticker` / 10 min | `fallbackTicker` |

Specs: `Design/API_HANDOVER_v3.md` (site, projects, mentions, sidequests, ticker),
`API_HANDOVER_v3.1.md` (site `sections`), `API_HANDOVER_v3.1_HERO.md` (hero),
`API_HANDOVER_v3.2_CASE_STUDY.md` (case studies; supersedes v3 §3). `API_HANDOVER.md` is v2
and superseded (local only, gitignored).

**`/api/site`** (singleton). Live serves the per-field ("v2") shape: top-level keys `brand`,
`hero`, `liveBanner`, `principles`, `enterprise`, `nav`, `contact`, `sections`.
`brand.tagline`, `hero`, `liveBanner`, `principles` are voiced wrappers. `sections` carries
per-section headings:

```jsonc
"sections": {
  "projects":   { "num": "III", "title": { "recruiter": "Work .", "personal": "Things I built " } },
  "sidequests": { "num": "IV",  "title": { "recruiter": "", "personal": "Obsessions" } },
  "principles": { "num": "V",   "title": { ... } },
  "enterprise": { "num": "VI",  "title": { ... }, "collapsed": { "recruiter": "", "personal": "..." } }
}
```

An empty-string voice means "unseeded": `resolveSections` uses `||`, so it falls through to
the fallback heading. No heading renders blank.

**`/api/projects`**: array. `shortDescription` is voiced. `normalizeProject` lowercases
`kind`/`span`, maps `technologies[].name` to `tags`, and keeps `desc` raw (voiced);
`Projects.jsx` resolves it with `pickVoice(p.desc, mode)` at render.

**`/api/projects/:slug`**: see the case-study section below. Unknown slug returns 404.

**`/api/mentions`**: array of `{ id, kind, badge, date, quote, authorName, authorRole,
authorInitials, link }`. `kind` arrives uppercase; `normalizeMention` lowercases it. No voiced
fields.

**`/api/sidequests`**: array of `{ id, pos, emoji, title, body, projectRef, displayOrder }`,
`pos` one of `tl tr r br bl l center`. Sorted by `displayOrder`; `normalizeSideQuest` builds
`proj: '→ ' + projectRef` (raw slug) or `null`. The frontend ignores `emoji` (owner decision).
`SideQuests.jsx` derives the connector hub from `pos === 'center'`, not an id, and fetches only
in personal mode.

**`/api/ticker`**: array of `{ id, text, projectRef, displayOrder }`. `fetchTicker` sorts by
`displayOrder` and returns plain strings.

Sidequests and ticker are flat per spec, so their fetchers skip voice resolution. A comment
in `client.js` marks the revisit point: if the backend voices them, route through
`deepResolveVoice` and mode-key the cache.

## Case studies (v3.2 shape)

Live `GET /api/projects/:slug` top-level keys: `slug, nav, overview, metrics, sections, links`,
plus the **legacy mirror** `problem, architecture, decisions, process, tradeoffs, outcome`.

- `nav` is a voiced wrapper: `{ recruiter: [items], personal: [items] }`, item
  `{ id, num, name, target }`. `nav[mode]` is the single source of truth for which sections
  render, their order and pill labels. A section absent from `nav[mode]` does not render in
  that mode (no separate hidden flag).
- `sections[]` is the section pool. `type` is a discriminator:

| `type` | Fields |
|---|---|
| `prose` | `title`, `body` (HTML) |
| `diagram` | `title`, `intro`, `diagram` (preformatted), `outro` |
| `decisions` | `title`, `choiceLabel`, `alternativesLabel`, `reasoningLabel`, `items[{choice, alternatives, reasoning}]` |
| `timeline` | `title`, `phases[{date, name, body}]` |
| `tradeoffs` | `title`, `gainedLabel`, `gaveUpLabel`, `gained`, `gaveUp` |

- Nearly every prose leaf and label in `overview`, `sections[]` and `links[].label` is voiced.
  `metrics` and `links[].url` stay flat.
- The legacy mirror is server-derived from `sections[]` for pre-v3.2 renderers. The frontend
  never reads it: `upgradeCaseStudy` drops it. Once the backend removes it, nothing here
  changes.

**Pipeline in `client.js`** (`fetchCaseStudy` → `normalizeCaseStudy`):

1. `deepResolveVoice(data, mode)` unwraps every voiced node, including `nav` itself, so
   `nav` becomes the `nav[mode]` array.
2. `upgradeCaseStudy` returns the canonical shape `{ slug, overview, metrics, nav, sections,
   links }`. If `sections[]` is missing or empty (pre-v3.2 payloads, and every
   `fallbackCaseStudies` entry), `synthesizeSections` builds it from the six legacy fields via
   `LEGACY_SECTION_MAP` (problem→prose 01, architecture→diagram 02, decisions→decisions 03,
   process→timeline 04, tradeoffs→tradeoffs 05, outcome→prose 06), filling default labels
   (`Choice`, `Alternatives`, `Reasoning`, `What we gained`, `What we gave up`). If `nav` is
   missing or empty, `synthesizeNav` derives it from `sections` (name = title, target = id).
   Every other key is dropped, including fallback's unused `_typePairs` (type pairs come from
   `TYPE_PAIRS` in `CaseStudyPage.jsx`).
3. The cached value is `{ data, raw, notFound }`. `raw` is the untouched API payload (voiced
   wrappers and legacy mirror intact) for `ServiceInspector` on `fico-cod-rto`. `raw` is
   `null` on fallback and on 404; never present fallback data as an API response.

**Render side.** `CaseStudyPage` prepends a synthetic Overview pill to `study.nav`, indexes
`sections` by id, and renders one `CaseStudySection` per nav item with
`section={sectionsById.get(item.target)}`. `CaseStudySection` switches on `section.type`;
an unknown type or a missing target renders `null` instead of crashing, so the backend can
add types ahead of a frontend deploy. `prose`/`diagram` HTML goes through
`dangerouslySetInnerHTML`. The prose section with id `outcome` gets the callout card styling.
`romanize` turns `num` into the section numeral. The effect depends on `[slug, mode]`, so a
mode toggle re-fetches (or hits the mode-keyed cache) and re-voices.

## Voice resolution

**`pickVoice(field, mode)`** (exported): a wrapper is a non-null, non-array object with a
`recruiter` or `personal` key (key presence, not truthiness). Returns
`field[mode] ?? field.recruiter ?? field.personal`. Anything else passes through unchanged.
`isVoicedWrapper` is the same predicate as a named helper.

**`deepResolveVoice(node, mode)`**: recursively unwraps wrappers anywhere in a tree (arrays
mapped, plain objects rebuilt). Used for case studies only. Side effect to know: any object
with a `recruiter` or `personal` key is treated as a wrapper, so never use those as ordinary
data keys.

**`resolveVoice(siteData, mode)`** (site, runs every render in `PortfolioPage`):

1. Fallback is `fallbackSitePersonal` for personal, else `fallbackSiteRecruiter`.
2. `!siteData` (failed fetch) → fallback whole.
3. Top-level split (`siteData.recruiter && siteData.personal`) → shallow merge
   `{ ...fallback, ...siteData[mode] }`.
4. Otherwise (the live shape) field by field: `brand` with `tagline` picked; `hero`,
   `liveBanner`, `principles`, `nav` via `pickVoice(...) ?? fallback`; `enterprise`,
   `contact` flat `?? fallback`; `sections` via `resolveSections` (keys `projects`,
   `sidequests`, `principles`, `enterprise`; `num`, `title`, `collapsed`, each `||` fallback).

`fetchSite` has no shape validation: an empty `{}` caches for 10 minutes and resolves to all
fallback via branch 4.

**Where resolution happens:**

| Data | Resolved | Consequence |
|---|---|---|
| Site | per render; cache holds the raw voiced payload | mode toggle re-voices with no refetch |
| Project `desc` | per render in `Projects.jsx` | `projects` cache needs no mode key |
| Case study | at fetch time; cache key includes mode | toggle re-fetches or hits the other mode's entry |
| Mentions, sidequests, ticker | none (flat) | no mode key needed |

For a new fetcher: resolve through `deepResolveVoice` or confirm the spec guarantees flat
fields, and pick render-time (raw cache, free toggles) or fetch-time (mode-keyed cache)
deliberately.

## TTL cache

`withCache(key, ttlMs, producer)` over a module-level `Map`, `performance.now()` expiry.
`TTL_LANDING` 10 min (site, projects, sidequests, ticker), `TTL_CLICK` 5 min (case study,
mentions).

- In-memory per page load. A full reload is the only invalidation. Content looking stale for
  5-10 minutes after a backend edit is the cache working; hard-reload.
- Errors are not cached (the producer throws before `set`), so failures retry on the next call.
- A 404 case study is cached: the inner catch turns it into `{ data: null, raw: null,
  notFound: true }`, a successful result, for 5 minutes. Seeding a missing slug shows only
  after reload or expiry.
- No in-flight dedup: concurrent calls for one key both hit the network.

## fallback.js exports

| Export | Shape and notes |
|---|---|
| `fallbackCaseStudies` | keyed by slug; pre-v3.2 legacy shape (six fixed fields), all flat. Upgraded by `upgradeCaseStudy` at read time. |
| `fallbackSite` / `fallbackSiteRecruiter` | same object (alias); flat recruiter site incl. `sections` |
| `fallbackSitePersonal` | flat personal site with its own `nav` and `sections`; `enterprise` references `fallbackSite.enterprise` |
| `fallbackProjects` | array; `desc` flat |
| `fallbackMentions` | array |
| `fallbackSideQuests` | normalized shape: carries the built `proj` string, no `emoji` |
| `fallbackTicker` | plain strings in display order |

Adding a project or case study on the backend without its fallback entry means it vanishes
offline (an unknown case-study slug shows "not found"). Verify the mirror by pointing
`VITE_API_URL` at a dead port and checking every page renders complete.
