# API Handover v3.1 — section titles + principles item titles

Addendum to `API_HANDOVER_v3.md`. Two additions to the `/api/site` payload, one seed-data
fix, one optional CORS change. Nothing here breaks the current payload — the frontend ships
tolerant readers first (missing fields fall back to today's hardcoded strings), so deploy
order doesn't matter.

Date: 2026-07-11. Frontend contact: akashreya-portfolio repo, `src/api/client.js`.

---

## 1. New `sections` node on `/api/site`

**Problem.** Every section heading on the portfolio page is hardcoded in JSX with a
mode-ternary (`'rules.'` vs `'How I build.'` etc.). The admin UI can retitle the hero but
not the section above it. This moves the headings into the site payload where the rest of
the voiced copy already lives.

**Shape.** The site singleton currently serves the v2 per-field-wrapper shape (top-level
keys, individual fields voiced as `{"recruiter": ..., "personal": ...}`). `sections` follows
the same convention — one new top-level key:

```jsonc
"sections": {
  "projects": {
    "num": "III",
    "title": { "recruiter": "Selected work.", "personal": "things i made." }
  },
  "sidequests": {
    "num": "III·b",
    "title": { "personal": "obsessions." }          // personal-only section; recruiter key omitted
  },
  "principles": {
    "num": "IV",
    "title": { "recruiter": "How I build.", "personal": "rules." }
  },
  "enterprise": {
    "num": "V",
    "title": { "recruiter": "Enterprise Work." },   // recruiter-only heading
    "collapsed": { "personal": "15y · enterprise, decisioning, telecom · the long story" }
  }
}
```

Rules:

- `title` values are plain strings including the final period. The frontend owns styling
  (it renders the trailing `.` in an accent `<em>` itself — do not add markup).
- `num` is a flat string (the `§` prefix is frontend chrome — send `"IV"`, not `"§ IV"`).
- Single-voice wrappers are fine (`{"personal": "obsessions."}`); the frontend's `pickVoice`
  resolves mode → recruiter → personal.
- `enterprise.collapsed` is the personal-mode one-line strip. Note the content fix baked in:
  **15y**, not 13y (earliest enterprise period is Aug 2011; the current hardcoded "13y"
  contradicts the ticker's "15 years" on the same page).
- All four fields must be editable in the admin UI — same treatment as `brand.tagline`.

Seed exactly the values above; they reproduce today's rendering except the 13y→15y fix.

## 2. Principles items: optional `title` field

**Problem.** The frontend renders a bold title line per principle when `items[].title`
exists (`{ n, title, body }`). The live payload serves only `{ n, body }`, so the personal
principles render without their title lines — the owner has flagged this on the live site.

**Change.** Support and seed an optional `title` string per principles item, per voice.
Recruiter items have no titles today (leave them `{ n, body }` — title-less items render
body-only by design). Personal items get these (matched to the live bodies by content):

| n | title | matches live body starting… |
|---|---|---|
| 01 | `Time is the one thing you can't get back.` | "Every sticky nav, every search bar…" |
| 02 | `Give the right signal to the right people.` | "I give you the node…" |
| 05 | `AI earns its place at the unbounded state space.` | "Everything before that is just orchestration…" |
| 06 | `Build it properly or don't build it.` | "POKÉTOPIA has official fonts…" |

Items 03 and 04 were added after the original set and have no titles — the owner writes
those in the admin UI if he wants them; leave them title-less otherwise. The admin UI needs
a title input per principles item.

## 3. Optional: allow localhost origins in CORS (dev quality-of-life)

The prod API returns **403** to browser requests carrying `Origin: http://localhost:5173`
(verified 2026-07-11). Deployed origins (`akashreya.space`, `akashreya.github.io`) work; the
403 only blocks local frontend dev against the prod API — the dev server silently falls back
to static content for everything. If acceptable, add `http://localhost:5173` (and 5174, the
Playwright port) to the allowed-origins list. Owner's call; skip if prod lockdown is
preferred.

## 4. Stale seed-data warning

`Design/seed_data/portfolio_v3_seed_data/json/side_quests.json` and `ticker.json` (and their
SQL) predate the 2026-07-11 admin-UI seeding and no longer match production content (old
node set, `craft` hub, 10 ticker lines vs the live 9). **Do not re-seed from those files** —
the live DB is the source of truth. Also note: the frontend now ignores the sidequests
`emoji` field entirely (owner removed emotes); serving it is harmless, populating it is
pointless.

## Verification (run after seeding)

```powershell
$s = Invoke-RestMethod "https://projectsapi.akashreya.space/api/site"
$s.sections | ConvertTo-Json -Depth 4          # expect the four nodes from §1
$s.principles.personal.items | ConvertTo-Json  # expect title on items 01, 02, 05, 06
```

Frontend picks changes up within its 10-minute cache TTL; hard-reload the tab to see them
immediately. Until the frontend's `sections` reader ships, the new node is simply ignored —
safe to seed early.
