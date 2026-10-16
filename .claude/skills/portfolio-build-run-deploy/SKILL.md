---
name: portfolio-build-run-deploy
description: >
  Owns the deploy gate and live-deploy pipeline for akashreya-portfolio: a push to main is a
  live deploy to akashreya.space with no staging and no CI tests. Covers the gate checklist,
  .github/workflows/deploy.yml (build on push and PR, gh-pages deploy on main via peaceiris
  with force_orphan), rollback, the CNAME custom domain, the 404.html + sessionStorage SPA
  deep-link trick, env vars (VITE_API_URL, VITE_CDN_URL) in dev and CI, and the dev, build,
  preview and lint commands. Load when deciding whether it is safe to push to main; touching
  deploy.yml, GitHub Pages, gh-pages, CNAME or index.html's redirect script; deep links 404ing
  on the live site; wiring the frontend to a local vs prod backend; .env confusion; prod
  baking in the wrong API URL; Chikorita missing on the live site; rolling back a bad deploy;
  setting up the repo from scratch.
---

# Build, run, deploy

`git push origin main` deploys https://akashreya.space within minutes. There is no staging
environment and CI runs no tests, lint or smoke checks: if it compiles, it ships. All quality
control is the local gate below.

## Deploy gate

Before any push to `main` that changes behavior:

1. Playwright visual suite green: `npm run test:visual`. Port and server requirements:
   **portfolio-visual-testing**.
2. Manual check on `npm run dev` (http://localhost:5173): home page in both modes, one case
   study, `/in-the-wild`, with the console open. Any React error #31 is a voiced-field
   regression (**portfolio-debugging-playbook**).
3. Both pass, then push. Either fails, no push.

Both are required: screenshots miss console errors and broken interactions; eyeballs miss
layout drift at the extreme viewports.

**Rollback.** gh-pages is force-orphaned on every deploy (one commit, no history), so there
is nothing to roll back to there. Rollback is `git revert <bad-commit>` on `main`, run the
gate, push.

## Commands

| Command | Notes |
|---|---|
| `npm run dev` | Vite on port 5173, `host: true` (LAN-reachable), no `strictPort` |
| `npm run build` | to `dist/` (gitignored); `base: "/"` for the custom-domain apex; single JS bundle (`manualChunks: undefined`) |
| `npm run preview` | serves `dist/`; same baked-in env values |
| `npm run lint` | ESLint; not run in CI |
| `npm run test:visual` | the gate's suite (`tests/playwright-viewport.spec.ts`) |
| `npm run update-baseline` | regenerates baselines; see **portfolio-visual-testing** first |
| `npm run test` | bare `playwright test`; also picks up the manual `*-preview.spec.ts` files that call `page.pause()`. Use `test:visual` for automation. |

Setup: `npm install`, `npx playwright install chromium`. Local Node is 24.x; CI builds on
Node 18 and `package.json` has no `engines` field, so keep build-time code Node 18 compatible.
`tests/` is tracked except the `*-preview.spec.ts` harnesses, so a fresh clone has the specs and
the win32 baselines.

## Env vars

Both are read at build time through `import.meta.env`; changing them needs a rebuild.

| Var | Read by | Unset behavior |
|---|---|---|
| `VITE_API_URL` | `src/api/axios.js` `getApiUrl` | warns and uses `http://localhost:8080` |
| `VITE_CDN_URL` | `src/components/Chikorita.jsx` (`${CDN}/site/chikorita/*.png`, no trailing slash) | no buddy: Chikorita renders nothing |

| Where | Values |
|---|---|
| `.env.local` (gitignored, UTF-8) | `VITE_API_URL=http://localhost:8080` and the CloudFront `VITE_CDN_URL`. The working dev file. |
| `.env.example` (tracked) | value-free template; copy to `.env.local` |
| `.env` (gitignored) | UTF-16 LE, so Vite ignores it. Write env files as UTF-8; PowerShell 5.1 `Out-File`/`Set-Content` default to other encodings. |
| CI build step | `VITE_API_URL: secrets.VITE_API_URL \|\| 'https://projectsapi.akashreya.space'`; `VITE_CDN_URL: secrets.VITE_CDN_URL` with no fallback on purpose |

One session against the prod API: `$env:VITE_API_URL = 'https://projectsapi.akashreya.space'; npm run dev`.
Prod CORS 403s localhost origins, so this renders fallbacks; for real data run the local
backend. Topology (`projectsapi` is the API, `projects.` is the admin UI) and CORS:
**portfolio-api-and-fallback**.

## CI pipeline (`.github/workflows/deploy.yml`)

| Step | Detail |
|---|---|
| Triggers | `push` to `main` (build and deploy); `pull_request` to `main` (build only) |
| Permissions | `contents: write`, `pages: write`, `id-token: write` |
| Build | `actions/checkout@v4`, `actions/setup-node@v4` Node 18 with npm cache, `npm ci`, `npm run build` with the env above |
| Deploy | `peaceiris/actions-gh-pages@v3`, `if: github.ref == 'refs/heads/main'`, `publish_dir: ./dist`, `force_orphan: true`, default branch `gh-pages`; GitHub Pages serves that branch |

gh-pages is a build artifact, not an ancestor of `main`. Never merge or cherry-pick from it.
Whether the secrets are set is visible only via `gh secret list` or repo settings.

## Custom domain

`public/CNAME` contains `akashreya.space`. Vite copies `public/` into `dist/`, so every
force-orphan deploy republishes it. Deleting or renaming `public/CNAME` unbinds the domain on
the next deploy. Hosting is GitHub Pages only; there is no Vercel deployment, and a
`vercel.json` in a diff is not the hosting path.

## SPA deep links on GitHub Pages

Pages has no rewrite rules, so a direct request to `/work/<slug>` or `/in-the-wild` serves
`404.html`. Two files hand the path across:

1. `public/404.html` saves `location.pathname + location.search + location.hash` to
   `sessionStorage['spa-redirect']`, then `location.replace('/')`.
2. An inline script at the top of `<body>` in `index.html` reads `spa-redirect`, removes it,
   and calls `history.replaceState(null, '', redirect)` before React Router mounts.

Consequences:

- The restore script must stay before `<script type="module" src="/src/main.jsx">`. Moving
  it after breaks deep linking.
- Deep links pass through `/` once; that redirect is inherent.
- Query strings and hashes survive, so `?mode=`/`?tone=` on deep links keep working.
- `npm run dev` never exercises this path (Vite has its own SPA fallback). Test deep links on
  the live site after deploy.

## Post-deploy check

After the Actions run is green (`gh run list --limit 3`):

- https://akashreya.space loads after a hard refresh; console has no error #31 and no
  `VITE_API_URL not set` warning.
- Network: API calls go to `projectsapi.akashreya.space` and return JSON.
- Open `https://akashreya.space/in-the-wild` and a `/work/<slug>` URL directly in fresh tabs:
  each lands on its page (exercises the 404 trick).
- Both modes render; Chikorita appears in personal mode (confirms `VITE_CDN_URL` was baked in).
- Content is live data, not fallback: content identical to `src/data/fallback.js` everywhere
  suggests fetches are failing silently.
