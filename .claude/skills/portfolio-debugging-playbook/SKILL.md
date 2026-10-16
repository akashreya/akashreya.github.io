---
name: portfolio-debugging-playbook
description: >
  Routes akashreya-portfolio frontend symptoms to a first move and the skill that owns the
  mechanism. Load when debugging React minified error #31, "Objects are not valid as a React
  child" or "[object Object]" in the UI; a bug that reproduces on akashreya.space but not
  locally; a blank or missing section (hero, projects, sidequests, principles, enterprise, case
  study, in-the-wild); a case-study section missing or out of order in one mode; a crash on
  .map of undefined; reveal elements stuck invisible after a mode toggle or in screenshots;
  mode/tone not persisting or URL params ignored; M or T shortcuts misbehaving; stale API data;
  Chikorita not appearing. Each row names the discriminating check that separates lookalike
  causes and the rule behind it.
---

# Portfolio debugging playbook

Symptom router. Each row gives the first move; mechanisms live in the owning skill. Before
proposing a fix, also load `superpowers:systematic-debugging`. Any behavior-changing fix ships
through the deploy gate in **portfolio-build-run-deploy**.

## Symptom → first move

| Symptom | Likely cause | First move | Owner |
|---|---|---|---|
| React error #31 / `[object Object]` | a voiced wrapper reached JSX unresolved | Rule 1 | api-and-fallback |
| Bug on akashreya.space, not on `npm run dev` | local dev is on fallback data | Rule 2 | api-and-fallback |
| Section blank, missing or showing old content | fallback, empty array, shape mismatch or null-guard gap | Rule 3 | api-and-fallback |
| Case-study section missing in one mode, or in a different order | `nav[mode]` omits or reorders it (by design) | Compare `raw.nav.recruiter` vs `.personal` | api-and-fallback |
| Case-study section blank but its pill shows | nav `target` has no matching `sections[].id`, or unknown `type` (both render `null`) | Inspect `raw.sections` | api-and-fallback |
| Content stale after a backend edit | 5-10 min in-memory TTL cache; 404 case studies cached too | Hard reload | api-and-fallback |
| Dev against prod API shows only fallback | prod CORS 403s `Origin: http://localhost:5173` | Run the local backend | api-and-fallback |
| `.reveal` content invisible after a mode toggle | `useReveal` deps miss the value that remounts the node | Rule 4 | this skill |
| Reveal observer churns every render | `useReveal([a, b])` array literal | Rule 4 | this skill |
| Content invisible in Playwright screenshots | animated element not covered by the spec's disable-animations CSS | Add its selector to that CSS block | visual-testing |
| `?mode=` / `?tone=` ignored | params are read once at module load (`_startParams`) | Full reload with the param | theme-and-content |
| M or T does the "wrong" thing | flag-dependent bindings | Check `PERSONAL_MODE_ENABLED` in `src/config.js` | architecture-contract |
| Chikorita absent in personal mode | `VITE_CDN_URL` unset at build, so she degrades to absent | Check the env | build-run-deploy |
| Personal-only section (SideQuests, HeroTicker, AmbientBlobs) missing | current mode is recruiter | Toggle mode or `?mode=personal` | architecture-contract |

Skill names above drop the `portfolio-` prefix.

## Rule 1: every API string slot passes through voice resolution

`pickVoice` (single field), `deepResolveVoice` (whole tree, case studies) and `resolveVoice`
(site) in `src/api/client.js` are the only gates. Working rules for this layer:

- Resolve shapes at read time; do not shape-gate at fetch time. Rejecting unexpected shapes
  made the site fall back wholesale and hid the real data.
- When the same bug class hits a third endpoint, generalize (`deepResolveVoice`) instead of
  patching field by field.
- A fix that rewrites a guard can silently revert an earlier fix in the same function; diff
  against the previous fix before shipping.

Discriminating check: fetch the raw endpoint and look for `"recruiter"` keys under the
crashing field. Wrapper present plus crash means some render path bypasses resolution: grep
the component for the field and trace which fetch fed it.

## Rule 2: reproduce prod-only bugs against a local backend

Local dev with no backend running renders flat fallback strings, so voiced-field bugs are
invisible locally. Start `projectservice` on 8080 (`.env.local` already points there),
`npm run dev`, and read real payloads in DevTools. Console lines `VITE_API_URL not set, using
fallback` or `GET /api/... failed, using fallback` mean you are not looking at API shapes.
Do not debug the minified prod bundle through browser automation first. If prod fetches fail
across the board, check which base URL was baked into the bundle.

## Rule 3: blank-section decision tree

1. Fallback warnings in the console? Then the content is whatever `src/data/fallback.js` has.
2. Empty array from the API? `fetchProjects`, `fetchMentions`, `fetchSideQuests`,
   `fetchTicker` treat `[]` as failure and fall back, so an unseeded endpoint shows fallback,
   not a blank section. A local backend that returns `200 []` produces exactly this.
3. Shape mismatch? `fetchSite` has no validation; compare the raw payload against the two
   shapes `resolveVoice` handles. Empty-string section headings fall through to fallback by
   design.
4. Null-guard gap? Every `.map` over API data is written `(x ?? []).map`, and pages that wait
   on a fetch seed initial state from the fallback export (`InTheWildPage` seeds
   `fallbackMentions` so "No mentions in this category yet." never flashes). A new section
   that maps over API data without both is a regression.

## Rule 4: reveal and render-time side effects

- `useReveal(...deps)` takes rest params. Call `useReveal(a, b)`, never `useReveal([a, b])`:
  a fresh array literal each render tears down and recreates the IntersectionObserver.
- Any section that can remount on a dependency (notably `mode`) must have that dependency in
  its page's `useReveal` call, or its `.reveal` nodes stay at opacity 0 after the remount.
  `PortfolioPage` passes `useReveal(site, projects, mode)` for this reason.
- Anything reading `window` or `localStorage` for initial state goes in a `useState` lazy
  initializer (see `ThemeProvider`), never the component body, where it runs every render.
