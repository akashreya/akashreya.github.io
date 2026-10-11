# API Handover — Portfolio v3

**From:** frontend repo (`akashreya-portfolio`, branch `v3-redesign`)
**To:** backend repo (`ProjectService`)
**Date:** 2026-05-29
**Supersedes:** `Design/API_HANDOVER.md` (v2)
**DB:** SQLite (not Postgres — all DDL and types updated accordingly)

## What changed in v3

The site now has two modes: `recruiter` (Editorial Crimson) and `personal` (Glass Violet).
Several content fields now carry **two voices** — the same fact told in two registers.
Components read `useTheme().mode` and pick the right voice at render time.

Two new endpoints are required: `GET /api/sidequests` and `GET /api/ticker`.

The frontend handles backward compatibility: if a field comes back as a plain string
(old shape), it is used for both modes. Only fields wrapped in `{ recruiter, personal }`
trigger voice-switching.

---

## SQLite types quick reference

| Postgres type used in v2 | SQLite equivalent |
|---|---|
| `BIGSERIAL PRIMARY KEY` | `INTEGER PRIMARY KEY AUTOINCREMENT` |
| `JSONB` | `TEXT` (store valid JSON string; parse in the service layer) |
| `BOOLEAN` | `INTEGER` (0 = false, 1 = true) |
| `VARCHAR(n)` | `TEXT` |
| `TIMESTAMP DEFAULT NOW()` | `TEXT DEFAULT (datetime('now'))` |
| Dollar-quoted strings (`$cs$...$cs$`) | Single-quoted strings with `''` escaping |
| `ALTER TABLE t DROP/ADD CONSTRAINT` | Not supported — constraints go in `CREATE TABLE` |
| `ALTER TABLE t ADD COLUMN IF NOT EXISTS` | `ALTER TABLE t ADD COLUMN` (SQLite silently allows re-adding the same column if the service is idempotent, so wrap in a try/catch at the application level) |
| `ON CONFLICT DO UPDATE` (Postgres upsert) | `INSERT OR REPLACE INTO ...` |

---

## Backward-compatibility rule

Any field in the v2 API that returns a plain string or object **continues to work unchanged**.
The frontend checks: `if (field?.recruiter && field?.personal) use field[mode] else use field as-is`.
Deploy new fields incrementally — the site stays functional at every step.

---

## 1. `GET /api/site` — extended

Returns a singleton object. v3 wraps the voice-varying fields in `{ recruiter, personal }`.
All other fields stay flat (unchanged from v2).

### Fields that now carry two voices

```jsonc
{
  "brand": {
    "name": "Akash S K",          // flat — same in both modes
    "mark": "A·S",                 // flat
    "url": "akashreya.space",      // flat
    "tagline": {                   // TWO-VOICE
      "recruiter": "Staff Engineer · FICO CoE · Tech Mahindra. Distributed-systems engineer building analytic decisioning platforms.",
      "personal":  "Builds things. Finishes them. Has opinions about fonts."
    },
    "where": "Bengaluru · IST"     // personal-only (ignored in recruiter mode)
  },
  "hero": {                        // ENTIRE HERO IS TWO-VOICE
    "recruiter": {
      "eyebrow":   "STAFF ENGINEER · FICO WORLD 2026",
      "nameFirst": "Akash",
      "nameLast":  "S K.",
      "title":     "Distributed-systems engineer building analytic decisioning platforms.",
      "thesis":    "Build the system that makes the decision boring. Optimise the decision until the system disappears.",
      "stats": [
        { "value": "15+", "label": "Years in fintech" },
        { "value": "7K+", "label": "Engineers shipped to" },
        { "value": "#1",  "label": "FICO GSI Hackathon 2026" }
      ],
      "ctas": [
        { "label": "Read the work", "href": "#projects",   "primary": true },
        { "label": "Principles",    "href": "#principles", "primary": false }
      ]
    },
    "personal": {
      "eyebrow":   "Engineer · Builder · 9 projects in 2025",
      "nameFirst": "akash",
      "nameLast":  "s k.",
      "title":     "builds things. finishes them. has opinions about fonts.",
      "thesis":    "Raised to respect others and value time. Build it beautifully. Or don't build it.",
      "stats": [
        { "value": "9",    "label": "Projects, 2025" },
        { "value": "10K+", "label": "Families" },
        { "value": "0",    "label": "Shipped ugly" },
        { "value": "3",    "label": "Books" }
      ],
      "ctas": [
        { "label": "See the work",   "href": "#projects",   "primary": true },
        { "label": "What I'm into",  "href": "#sidequests", "primary": false }
      ]
    }
  },
  "liveBanner": {                  // TWO-VOICE
    "recruiter": {
      "label":      "LIVE · FICO WORLD 2026",
      "title":      "COD/RTO Optimization Platform",
      "sub":        "First place at the FICO GSI Partner Hackathon 2026. Showcased at FICO World, Orlando.",
      "badgeBig":   "1",
      "badgeSmall": "st",
      "badgeLabel": "Place"
    },
    "personal": {
      "label":      "FICO WORLD 2026 · ORLANDO",
      "title":      "COD/RTO Intelligence Platform",
      "sub":        "First place, FICO GSI Partner Hackathon. Demoed at FICO World while I was in Bengaluru. The platform ran. That was kind of the point.",
      "badgeBig":   "1",
      "badgeSmall": "st",
      "badgeLabel": "✦"
    }
  },
  "principles": {                  // TWO-VOICE
    "recruiter": {
      "quote": {
        "pre":    "The best work doesn't make individuals faster. It eliminates entire",
        "strong": "categories of work",
        "post":   "."
      },
      "items": [
        { "n": "01", "body": "AI generates fast. Validation is where the engineering lives. Treat AI as a force multiplier for judgement, not a substitute for it." },
        { "n": "02", "body": "Design the brief before the tool opens. Every feature that ships exists because someone's time was worth defending." },
        { "n": "03", "body": "Anything repeatable is AI-automatable. The interesting question isn't whether to automate — it's which category of work to eliminate next." },
        { "n": "04", "body": "Don't compete where everyone competes. The win comes from finding the problem nobody else thought to bring the right tool to." }
      ]
    },
    "personal": {
      "quote": {
        "pre":    "Why build it at all if you're",
        "strong": "not going to do it properly",
        "post":   "?"
      },
      "items": [
        { "n": "01", "title": "Time is the one thing you can't get back.", "body": "Every sticky nav, every search bar, every keyboard shortcut is the same idea at a different layer. The diff tool wasn't efficiency. It was reclamation." },
        { "n": "02", "title": "Give the right signal to the right people.", "body": "I give you the node. You find the edges. If you don't ask the follow-up question, that's information too." },
        { "n": "03", "title": "AI earns its place at the unbounded state space.", "body": "Everything before that is just orchestration. Knowing the difference is the whole job." },
        { "n": "04", "title": "Build it properly or don't build it.", "body": "POKÉTOPIA has official fonts, a complete design system, and WCAG indicators. Nobody asked for any of that. That's not the point." }
      ]
    }
  },
  "nav": { ... },        // flat — unchanged from v2
  "enterprise": [ ... ], // flat — unchanged from v2 (personal mode hides it via CSS)
  "contact": { ... }     // flat — unchanged from v2
}
```

### DB migration (`site_content` table)

The `site_content` table stores content as a `TEXT` column containing a JSON string. No schema change needed. Update the row using the service's admin API or directly:

```sql
-- Load the full JSON from Design/seed_data/portfolio_v3_seed_data/json/site.json
-- and pass it to the service's seed endpoint, or run via the admin script.
-- Direct SQLite update (escape single quotes by doubling them):
INSERT OR REPLACE INTO site_content (id, content, updated_at)
VALUES (1, '<contents of site.json as a single-quoted string>', datetime('now'));
```

Because the JSON contains apostrophes, **prefer loading via the service's admin/seed endpoint** rather than raw SQL. See `Design/seed_data/portfolio_v3_seed_data/sql/01_site_v3.sql` for the migration script.

---

## 2. `GET /api/projects` — extended

Add a `shortDescription` field with two-voice content. All other fields unchanged.

```jsonc
{
  "id": 1,
  "slug": "fico-cod-rto",
  "kind": "WIN",
  "eyebrow": "WIN",
  "title": "COD/RTO Optimization Platform",
  "shortDescription": {          // NEW: two-voice (was plain TEXT in v2)
    "recruiter": "Real-time e-commerce order risk decisioning on FICO Decision Management Platform. 85 rules, 8 data signals, 4 decisions in under 200ms. First place at the FICO GSI Partner Hackathon 2026, now showcased at FICO World, Orlando.",
    "personal":  "Won the FICO GSI Hackathon 2026. Multi-agent decisioning for e-commerce return fraud. 85+ rulesets. Was in Bengaluru when they demoed it. The thing ran."
  },
  "metrics": [ ... ],  // unchanged
  "span": "WIDE",
  "year": "2026",
  "hasCaseStudy": true
}
```

### DB migration (`project` table)

The existing `short_description TEXT` column now stores a JSON string instead of a plain string. No type change needed in SQLite (everything is TEXT). The service layer serialises the two-voice object to JSON on write and parses it on read.

```sql
-- No DDL needed — column already exists as TEXT.
-- Update each project's short_description to the two-voice JSON string.
-- See Design/seed_data/portfolio_v3_seed_data/sql/02_projects_v3.sql
```

If the service is using an ORM with a typed `shortDescription: String` field, change it to `shortDescription: String (JSON)` or a dedicated `ShortDescriptionVO` value object that the serialiser knows to write as `{"recruiter":"...","personal":"..."}`.

---

## 3. `GET /api/projects/{slug}` — case studies (extended)

### Service Inspector (fico-cod-rto only)

The `fico-cod-rto` case study page renders a **Service Inspector** widget in personal mode — a slide-in side panel that shows the raw JSON response from this endpoint, syntax-highlighted. The user can hover JSON keys to highlight the corresponding section on the page.

**The inspector shows whatever the endpoint returns.** No special fields or formatting needed. When the API is live it shows the live response. When offline it shows the fallback JSON. The widget is purely frontend — the backend just needs to serve the correct case study JSON.

The only implication: make sure the fico-cod-rto case study response is accurate, since it's displayed verbatim to users (and was shown to the FICO judges at FICO World).

### Two-voice sub-fields (all projects)

The following sub-fields can optionally carry two voices. All are optional — omitting personal voice falls back to the recruiter value.

| Field | Two-voice? | Notes |
|---|---|---|
| `overview.lede` | Optional | Recruiter: formal summary. Personal: first-person admitted. |
| `problem.body` | Optional | HTML string. Personal voice more direct. |
| `outcome.body` | Optional | HTML string. Personal: "The thing ran." style. |
| Everything else | No | Stays flat. |

The `case_study` table already stores all sections as `TEXT` (JSON strings). No schema change needed. Just update the JSON content per case study.

---

## 4. `GET /api/mentions` — unchanged

No voice differences needed. The same content works in both modes. CSS handles visual differences.

---

## 5. `GET /api/sidequests` — NEW ENDPOINT

Personal-mode only. Powers the obsessions pinboard on the portfolio page.

### Response shape

```jsonc
[
  {
    "id": "pokemon",
    "pos": "tl",
    "emoji": "🎮",
    "title": "Pokémon",
    "body": "Every region. Lunatone and Solrock for the toggle — celestial opposites. That detail was not optional.",
    "projectRef": "poketopia",
    "displayOrder": 1
  },
  {
    "id": "craft",
    "pos": "center",
    "emoji": "✦",
    "title": "Time · Craft · Intentionality",
    "body": "Everything connects here. Every project exists because finishing it was the point.",
    "projectRef": null,
    "displayOrder": 7
  }
]
```

### Fields

| Field | Type | Notes |
|---|---|---|
| `id` | `TEXT` | Unique slug |
| `pos` | `TEXT` | `tl`, `tr`, `r`, `br`, `bl`, `l`, `center` — board position |
| `emoji` | `TEXT` | Display emoji |
| `title` | `TEXT` | Node title |
| `body` | `TEXT` | Short body text |
| `projectRef` | `TEXT NULL` | Slug of related project |
| `displayOrder` | `INTEGER` | Sort order |

### SQLite DDL

```sql
CREATE TABLE IF NOT EXISTS side_quest (
  id            TEXT    PRIMARY KEY,
  pos           TEXT    NOT NULL CHECK (pos IN ('tl','tr','r','br','bl','l','center')),
  emoji         TEXT    NOT NULL DEFAULT '',
  title         TEXT    NOT NULL DEFAULT '',
  body          TEXT    NOT NULL DEFAULT '',
  project_ref   TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);
```

Seed data: `Design/seed_data/portfolio_v3_seed_data/json/side_quests.json`
Migration script: `Design/seed_data/portfolio_v3_seed_data/sql/03_side_quests_v3.sql`

---

## 6. `GET /api/ticker` — NEW ENDPOINT

Personal-mode only. Powers the vertical scrolling ticker in the hero right column.

### Response shape

```jsonc
[
  {
    "text": "Won the FICO hackathon. Was in Bengaluru when they demoed it. The thing ran.",
    "projectRef": "fico-cod-rto",
    "displayOrder": 4
  },
  {
    "text": "Hot water. Not coffee. This is not a debate.",
    "projectRef": null,
    "displayOrder": 5
  }
]
```

### Fields

| Field | Type | Notes |
|---|---|---|
| `text` | `TEXT` | One-liner. Akash's voice — do not sanitise or paraphrase. |
| `projectRef` | `TEXT NULL` | Related project slug |
| `displayOrder` | `INTEGER` | Sort order |

### SQLite DDL

```sql
CREATE TABLE IF NOT EXISTS ticker_line (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  text          TEXT    NOT NULL DEFAULT '',
  project_ref   TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);
```

Seed data: `Design/seed_data/portfolio_v3_seed_data/json/ticker.json`
Migration script: `Design/seed_data/portfolio_v3_seed_data/sql/04_ticker_v3.sql`

---

## Seed data

Full v3 seed data at `Design/seed_data/portfolio_v3_seed_data/`:

```
portfolio_v3_seed_data/
├── README.md
├── json/
│   ├── site.json          → two-voice site content
│   ├── side_quests.json   → 7 nodes for the obsessions board
│   └── ticker.json        → 10 ticker lines
└── sql/
    ├── 01_site_v3.sql         → UPDATE site_content to two-voice shape
    ├── 02_projects_v3.sql     → UPDATE short_description to two-voice JSON
    ├── 03_side_quests_v3.sql  → CREATE TABLE + INSERT side_quest rows
    └── 04_ticker_v3.sql       → CREATE TABLE + INSERT ticker_line rows
```

Run the scripts in order. Each is idempotent (`INSERT OR REPLACE` / `CREATE TABLE IF NOT EXISTS`).

---

## CORS

Ensure `akashreya.github.io` and `akashreya.space` remain in the allowed origins list. No change from v2.

---

## Frontend static fallbacks

While the backend ships the new endpoints/fields, the frontend uses static data from `src/data/fallback.js`. The fallback exports both voices (`fallbackSiteRecruiter`, `fallbackSitePersonal`) and `fetchSite()` returns the structured fallback on API failure. The site renders correctly offline with no backend running.
