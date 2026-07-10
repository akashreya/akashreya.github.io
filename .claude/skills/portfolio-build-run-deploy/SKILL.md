---
name: portfolio-build-run-deploy
description: >
  Environment setup, dev/build/preview commands, VITE_API_URL wiring, and the
  live-deploy pipeline for the akashreya-portfolio repo. Load this when: setting
  up the repo from scratch; running or building the site locally; deciding
  whether it is safe to push to main (push-to-main IS a live deploy to
  akashreya.space); anything involving .github/workflows/deploy.yml, GitHub
  Pages, gh-pages branch, CNAME, or the custom domain; deep links 404ing on the
  live site (404.html + sessionStorage mechanism); pointing the frontend at a
  local vs prod backend; .env file confusion; "why does prod hit the wrong API
  URL"; rollback after a bad deploy. Keywords: npm run dev, vite build, deploy
  gate, GitHub Actions, VITE_API_URL, CNAME, SPA routing, 404.html, vercel.
---

# Build, Run, Deploy — akashreya-portfolio

Runbook for taking this repo from a bare clone to a verified live deploy at
https://akashreya.space. Windows 11 / PowerShell 5.1 native: separate commands
with `;`, never `&&`.

**The one rule that governs everything here: pushing to `main` deploys the live
site.** There is no staging environment and no CI test step. Every behavior
change routes through the deploy gate in section 5.

## When NOT to use this skill

| You are trying to... | Load instead |
|---|---|
| Understand why the architecture is shaped this way (voice/theme/mode axes, API-with-fallback invariant) | `portfolio-architecture-contract` |
| Work with API endpoints, `pickVoice`, shape detection, TTL cache, fallback.js | `portfolio-api-and-fallback` |
| Triage a bug or crash (React error #31, null crashes, observer churn) | `portfolio-debugging-playbook` |
| Read visual diffs, update baselines, add screenshot coverage | `portfolio-visual-testing` |
| Edit theme tokens or site copy | `portfolio-theme-and-content` |
| Anything personal-mode redesign / launch related | `portfolio-personal-mode-campaign` |

Term disambiguation (one line each — full treatment in
`portfolio-architecture-contract`): **mode** = recruiter vs personal audience
(`data-mode` on `<html>`); **theme** = visual token set per mode;
**voice** = which copy variant of a field renders; **voiced field** = an API
value shaped `{recruiter: ..., personal: ...}` that must be resolved before
rendering. This skill only needs "mode" (the test suite screenshots both).

## 1. Prerequisites and setup from scratch

| Requirement | Detail |
|---|---|
| Node | Local: Node 24.x (`node -v`). CI builds on Node 18 (`deploy.yml:26`) — at the floor of Vite 6's support range. Don't rely on Node-22+-only syntax in build scripts. |
| npm | Ships with Node. No pnpm/yarn — lockfile is `package-lock.json`, CI runs `npm ci`. |
| Browsers for tests | `npx playwright install chromium` (one-time; suite is Chromium-only). |
| Backend (optional) | Spring-style API at `E:\Work\Code\GitHub\projectservice` (internals out of scope here). Site renders fully offline via `src/data/fallback.js` — see `portfolio-api-and-fallback`. |

```powershell
cd E:\Work\Code\GitHub\akashreya-portfolio
npm install
npx playwright install chromium
npm run dev    # http://localhost:5173
```

No `engines` field exists in `package.json`, so npm will not warn you about a
wrong Node version — check manually.

## 2. VITE_API_URL semantics

`src/api/axios.js:3-10`: if `import.meta.env.VITE_API_URL` is unset, the axios
base URL falls back to `http://localhost:8080` and logs a console warning.
Every API call goes through this instance.

Resolution order (Vite standard): **process env var > `.env.[mode].local` >
`.env.[mode]` > `.env.local` > `.env`**, where Vite's mode is `development`
for `npm run dev` and `production` for `npm run build`. Baked in at build
time — changing the env after a build does nothing; rebuild.

State of the env files in this working tree, as of 2026-07-10:

| File | Tracked in git? | Content | Effective? |
|---|---|---|---|
| `.env.local` | no (`.gitignore:80`) | `VITE_API_URL=http://localhost:8080` | **YES — this is the file that actually works locally.** UTF-8. |
| `.env` | no (`.gitignore:76`) | same URL, but **UTF-16 LE encoded** | Inert — Vite's dotenv reads UTF-8; UTF-16 bytes never parse as a key. |
| `.env.production` | **yes, tracked** | placeholder `https://your-production-api.com`, also UTF-16 LE | Inert (encoding), and CI's process-level env would override it anyway. Harmless but committed. |

**Encoding trap:** PowerShell 5.1's `Out-File`/`Set-Content` default to UTF-16.
If you ever write an env file, use `-Encoding utf8` or Vite silently ignores
it — that is exactly how `.env` and `.env.production` became inert.

Pointing at each backend:

```powershell
# Local backend (default — matches .env.local and the axios fallback)
# 1. Start projectservice (E:\Work\Code\GitHub\projectservice) on port 8080
# 2. Then:
npm run dev

# Prod API for one session (process env beats every .env file):
$env:VITE_API_URL = 'https://projectsapi.akashreya.space'; npm run dev
```

**URL trap — two similar hostnames, only one is an API:**

| URL | What it is |
|---|---|
| `https://projectsapi.akashreya.space` | Backend API (prod). The only valid prod `VITE_API_URL`. |
| `https://projects.akashreya.space` | **Admin UI** for content entry. NOT an API. Pointing the frontend here returns HTML, every fetch fails, and the site silently renders fallback data. |

Prod-debugging protocol (owner-mandated): never debug prod bugs against the
prod API first. Run the backend locally, point `VITE_API_URL` at it, reproduce
there. Details in `portfolio-debugging-playbook`.

## 3. Command anatomy

Scripts from `package.json:7-15`:

| Command | What it does | Notes |
|---|---|---|
| `npm run dev` | Vite dev server, `http://localhost:5173`, `host: true` (LAN-reachable), HMR | Port set at `vite.config.js:9`. `strictPort` unset — if 5173 is busy Vite auto-increments to 5174. |
| `npm run build` | Production build to `dist/` | `base: "/"` (custom domain, not a repo subpath). `manualChunks: undefined` → single JS bundle. `dist/` is gitignored. |
| `npm run preview` | Serves `dist/` locally | Sanity-check a production build before pushing. Reads the same baked-in `VITE_API_URL`. |
| `npm run lint` | ESLint over the repo | Not run in CI. |
| `npm run test:visual` | Playwright visual suite: 2 modes × 7 viewports | The deploy-gate test command. Details in `portfolio-visual-testing`. |
| `npm run test` | Bare `playwright test` — picks up the 7 `*-preview.spec.ts` files too, which call `page.pause()` and are meant for manual inspection | **Avoid for automation; use `test:visual`.** |
| `npm run update-baseline` | Runs `update-baseline.ps1` | **Stale as of 2026-07-10** — its regexes target a spec shape that no longer exists; running it would wipe baselines and copy nothing back. Use `npx playwright test --update-snapshots tests/playwright-viewport.spec.ts` instead. See `portfolio-visual-testing`. |

**Playwright port quirk** (`playwright.config.js:38-42` vs `vite.config.js:9`):
the suite navigates to and waits on port **5174**, but its `webServer` command
is `npm run dev`, which serves **5173** when free. Practical recipe — keep your
manual dev server running on 5173; Playwright's spawned server then
auto-increments to 5174 and the suite works. On a cold machine with nothing on
5173, `npm run test:visual` times out waiting for 5174. Workaround:

```powershell
# terminal 1 — your manual-check server (holds 5173)
npm run dev
# terminal 2 — suite spawns its own server, which lands on 5174
npm run test:visual
```

`tests/` is entirely gitignored (`.gitignore:159`) — specs and the 77 baseline
PNGs (35 recruiter + 42 personal) exist only in this working tree, not in git. A fresh clone has no tests
and no baselines. (This contradicts older docs claiming checked-in baselines;
the repo wins.)

## 4. What CI does NOT do

`.github/workflows/deploy.yml` runs `npm ci` and `npm run build`. That's all.
No lint, no Playwright, no smoke test. If it compiles, it ships. All quality
control is the local gate below — by design, not omission.

## 5. THE DEPLOY GATE (non-negotiable)

`git push origin main` = live deploy to https://akashreya.space within minutes.
Before any push to `main` that changes behavior:

```
[ ] 1. Playwright visual suite green:
        npm run test:visual        (with a dev server on 5173 — see section 3)
[ ] 2. Manual check on the local dev server:
        npm run dev  →  open http://localhost:5173
        - load the home page in recruiter mode, click into a case study,
          visit /in-the-wild
        - watch the console for errors (React error #31 = voiced-field
          regression; see portfolio-debugging-playbook)
[ ] 3. Both passed → push. Either failed → the push does not happen.
```

Both checks are required — screenshots don't catch console errors or broken
interactions, and eyeballs don't catch 2560-px layout drift. PR builds run
(the workflow triggers on `pull_request` too) but only build; the deploy step
is skipped for PRs.

**Rollback:** the gh-pages branch is force-orphaned every deploy (single
commit, no history — `deploy.yml:44`), so there is nothing to roll back to on
gh-pages itself. Rollback = `git revert <bad-commit>` on `main`, run the gate,
push. The revert redeploys the previous state.

## 6. The GitHub Actions pipeline, step by step

File: `.github/workflows/deploy.yml` (45 lines). As of 2026-07-10:

| Step | Line(s) | Detail |
|---|---|---|
| Triggers | 3-7 | `push` to `main` (build + deploy) and `pull_request` targeting `main` (build only). |
| Permissions | 10-13 | `contents: write`, `pages: write`, `id-token: write`. |
| Checkout | 20-21 | `actions/checkout@v4` |
| Node | 23-27 | `actions/setup-node@v4`, `node-version: "18"`, npm cache. |
| Install | 29-30 | `npm ci` |
| Build | 32-36 | `npm run build` with `VITE_API_URL` from the env block below. |
| Deploy | 38-44 | `peaceiris/actions-gh-pages@v3`, gated `if: github.ref == 'refs/heads/main'` (line 40), `publish_dir: ./dist`, `force_orphan: true`. Publish branch unspecified → action default `gh-pages`. GitHub Pages serves that branch. |

### The known latent misconfiguration — document, do not fix

`deploy.yml:36`, verbatim:

```yaml
VITE_API_URL: ${{ secrets.VITE_API_URL || 'https://projects.akashreya.space' }}
```

If the `VITE_API_URL` repo secret is ever unset or deleted, the build falls
back to `https://projects.akashreya.space` — **the admin UI, not the API**
(section 2). The deployed site would then fail every fetch and silently serve
static fallback content. Symptom on live: stale/fallback data everywhere,
network tab full of requests to `projects.akashreya.space` returning HTML.
Owner knows; leave the line as is unless explicitly told otherwise. Whether
the secret is currently set is not verifiable from the working tree — check
via `gh secret list` or repo Settings → Secrets → Actions.

Other pipeline notes:
- `force_orphan: true` rewrites gh-pages history on every deploy — gh-pages
  is a build artifact, never a source of truth.
- `origin/gh-pages` tip is an orphan commit of built output; it is not an
  ancestor of `main`. Never merge or cherry-pick from it.

## 7. Custom domain (CNAME)

- `public/CNAME` contains exactly `akashreya.space`. Vite copies `public/`
  into `dist/` verbatim, so every force-orphan deploy re-publishes the CNAME
  file — this is what keeps the custom domain bound. **Deleting or renaming
  `public/CNAME` unbinds the domain on the next deploy.**
- `vite.config.js:6` sets `base: "/"` — correct for a custom domain apex.
  (A `github.io/repo-name` setup would need `base: "/repo-name/"`; not this
  repo.)
- `package.json:6` still says `"homepage": "https://akashreya.github.io"` —
  stale CRA-convention leftover, ignored by Vite, harmless. Don't trust it as
  the deploy target.

## 8. SPA routing on GitHub Pages — the 404.html + sessionStorage mechanism

This skill owns the operational detail. GitHub Pages is a static file host
with no rewrite rules, so a direct request to `/work/some-slug` finds no file
and serves `404.html`. The workaround is a two-file handshake:

**Step 1 — `public/404.html:5-8`** (served for any unknown path):

```html
<script>
  sessionStorage.setItem('spa-redirect', location.pathname + location.search + location.hash);
  location.replace('/');
</script>
```

Saves the full intended URL, then hard-redirects to `/`, which Pages can serve
(`index.html`).

**Step 2 — `index.html:51-58`** (inline in `<body>`, runs before the React
module script on line 60):

```html
<script>
  // GitHub Pages SPA routing: restore path saved by 404.html
  var redirect = sessionStorage.getItem('spa-redirect');
  if (redirect) {
    sessionStorage.removeItem('spa-redirect');
    history.replaceState(null, '', redirect);
  }
</script>
```

Restores the saved path via `history.replaceState` — the address bar shows the
deep link again before React Router mounts, so `BrowserRouter` sees the right
location and renders the right route. No reload, no history pollution
(`replaceState`, and the key is removed immediately).

Operational implications:
- Deep links flash through `/` once (a redirect happens); this is inherent to
  the trick, not a bug.
- The restore script must stay **before** `<script type="module"
  src="/src/main.jsx">` in `index.html`. Moving it after breaks deep linking.
- `npm run dev` never exercises this path — the Vite dev server has its own
  SPA fallback. Only the live site (or `npm run preview` + manually opening
  `dist/404.html` semantics) uses it. Test deep links post-deploy (section 10).
- Query strings and hashes survive (both are captured in step 1) — theme/mode
  URL params on deep links keep working.

## 9. The vercel.json dead end

History, 22 minutes total on 2026-06-30 launch night:
- `77b128e` (01:13) added a `vercel.json` with a single SPA rewrite
  (`/(.*)` → `/index.html`) — a Vercel hosting attempt for clean SPA routing
  without the 404 trick.
- `c0342f3` (01:35) deleted it and added `public/CNAME` — committed to GitHub
  Pages + custom domain instead.

The commit messages don't record why Vercel was abandoned; owner-confirmed
"dead end" (2026-07-10). What matters operationally: **there is no Vercel
deployment.** If you find `vercel.json` in a diff or an agent proposes adding
one, that's the abandoned path — hosting is GitHub Pages + CNAME + the 404
trick, full stop.

## 10. Post-deploy verification checklist

Run after every push to `main`, once the Actions run is green
(https://github.com/akashreya/akashreya-portfolio/actions — or `gh run list
--limit 3`):

```
[ ] Actions run green (build + deploy steps both succeeded)
[ ] https://akashreya.space loads; hard-refresh (Ctrl+F5) to bust cache
[ ] DevTools console: no errors — specifically no minified React error #31
    and no "VITE_API_URL not set" warning
[ ] DevTools network: API calls go to projectsapi.akashreya.space and return
    JSON. Requests to projects.akashreya.space (admin UI) = the deploy.yml:36
    secret fell back — see section 6.
[ ] Deep link test (exercises the 404 trick, section 8): open
    https://akashreya.space/in-the-wild directly in a fresh tab — must land on
    the In The Wild page, not a 404 or the home page
[ ] Case study deep link: open a /work/<slug> URL directly
[ ] Content is live API data, not fallback: change something small via the
    admin UI or compare against src/data/fallback.js — identical-to-fallback
    everywhere suggests fetches are failing silently
[ ] Recruiter mode renders (personal mode is feature-flagged OFF as of
    2026-07-10 — PERSONAL_MODE_ENABLED=false in src/config.js:3; do NOT treat
    its absence on live as a bug. See portfolio-personal-mode-campaign.)
```

Note the TTL cache (`portfolio-api-and-fallback`): the client caches API
responses in memory 5-10 min, but that's per page load — a hard refresh always
refetches.

## Provenance and maintenance

All facts verified against the working tree at `main` @ `27e7ae0`, 2026-07-10.
Re-verify the volatile ones before trusting this document:

| Fact | Re-verification (PowerShell, from repo root) |
|---|---|
| npm scripts | `Get-Content package.json -TotalCount 15` |
| Dev port / base path | `Get-Content vite.config.js` |
| axios default URL | `Select-String -Path src\api\axios.js -Pattern 'localhost'` |
| deploy.yml fallback URL + node version | `Select-String -Path .github\workflows\deploy.yml -Pattern 'VITE_API_URL\|node-version'` |
| VITE_API_URL secret set? | `gh secret list` |
| CNAME content | `Get-Content public\CNAME` |
| 404 trick intact | `Select-String -Path public\404.html,index.html -Pattern 'spa-redirect'` |
| Personal mode flag | `Get-Content src\config.js` |
| tests/ still untracked | `git check-ignore tests/` (prints `tests/` if still ignored) |
| Playwright port quirk | `Select-String -Path playwright.config.js -Pattern 'port'` |
| .env file encodings | `Format-Hex .env.production \| Select-Object -First 1` (FF FE = UTF-16, inert) |
| update-baseline.ps1 still stale | `Select-String -Path tests\playwright-viewport.spec.ts -Pattern 'page\.screenshot'` (no hits = script's regexes still match nothing) |
