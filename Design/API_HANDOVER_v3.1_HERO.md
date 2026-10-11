# API Handover — Hero Redesign (v3.1)

**From:** frontend repo (`akashreya-portfolio`, branch `main`)
**To:** backend repo (`ProjectService`)
**Date:** 2026-07-13
**Extends:** `Design/API_HANDOVER_v3.md` (does NOT supersede it — this is a delta; only new changes are listed)
**Baseline:** shapes below were verified against the live API (`https://projectsapi.akashreya.space`) on 2026-07-13.

## What changed

The hero section is being redesigned in both modes:

- **Recruiter**: the standalone LiveBanner section is removed from the page. Its content moves
  into a "terminal panel" in the hero's right column, alongside a client-rendered IST clock and
  a new `LATEST` row.
- **Personal**: the hero right column becomes a "Presently" ledger — five label/value rows
  (drinking / playing / listening / writing / building). The ticker moves from the hero right
  column to a horizontal strip below the hero (endpoint unchanged).

**Everything lands inside the `GET /api/site` singleton. No new endpoints. No DDL** —
`site_content` already stores one TEXT JSON blob.

`/api/ticker`, `/api/sidequests`, `/api/projects`, `/api/projects/{slug}`, `/api/mentions`:
**unchanged**.

---

## ⚠ Voice-wrapper rule (read before adding keys)

The frontend detects a voiced field by key presence:

```js
if ('recruiter' in field || 'personal' in field) return field[mode];
```

`pickVoice` returns **only** `field[mode]` — any sibling key next to `recruiter`/`personal`
is silently dropped. Therefore every new key below goes **inside** a voice object, never
beside one. (This is why `liveBanner.projectRef` is specified per-voice.)

---

## 1. `GET /api/site` — three additions

### 1a. `hero.recruiter.terminal` — NEW object

Feeds the terminal panel rows. The clock is client-side (the frontend renders live IST); the
backend only supplies text.

```jsonc
"hero": {
  "recruiter": {
    // ...existing fields unchanged (eyebrow, nameFirst, nameLast, title, thesis, stats, ctas)...
    "terminal": {
      "loc":  "Bengaluru",                                            // clock renders next to this, client-side
      "now":  "Platform demoed at FICO World while I stayed in Bengaluru. It ran.",
      "latest": {
        "text": "Everything ABC — solo product · ~2K users",
        "projectRef": "everythingabc"                                 // slug → /work/everythingabc link
      }
    }
  }
}
```

Why `latest` is explicit instead of derived from `/api/projects`: the first project by
`displayOrder` is `fico-cod-rto`, which is already the panel's LIVE item — deriving would
duplicate it.

### 1b. `hero.personal.ledger` — NEW array

Feeds the "Presently" card. Order in the array is display order.

```jsonc
"hero": {
  "personal": {
    // ...existing fields unchanged...
    "ledger": [
      { "label": "drinking",  "value": "hot water. Not coffee. This is not a debate.",                     "projectRef": null, "href": null },
      { "label": "playing",   "value": "POKÉTOPIA — built it myself. Nine regions. ~500 trainers.",        "projectRef": "poketopia", "href": null },
      { "label": "listening", "value": "Shreya Ghoshal. No shuffle.",                                      "projectRef": null, "href": null },
      { "label": "writing",   "value": "Three books in 2025. Did not announce them. They exist anyway.",   "projectRef": null, "href": null },
      { "label": "building",  "value": "this site — one mode per audience.",                               "projectRef": null, "href": "https://github.com/akashreya" }
    ]
  }
}
```

| Field | Type | Notes |
|---|---|---|
| `label` | TEXT | One word, lowercase — rendered in the script font |
| `value` | TEXT | Akash's voice — do not sanitise or paraphrase (same rule as ticker) |
| `projectRef` | TEXT NULL | Project slug; frontend links the value to `/work/{slug}` |
| `href` | TEXT NULL | External/absolute link; used only when `projectRef` is null |

### 1c. `hero.recruiter.thesis` — MAY now be structured (optional)

The recruiter thesis supports the same `{pre, strong, post}` shape the principles quote
already uses — `strong` renders in the accent color. A flat string keeps working unchanged.

```jsonc
"thesis": {
  "pre":    "AI generates fast. ",
  "strong": "Validation is where the engineering lives.",
  "post":   " Anything repeatable is AI-automatable."
}
```

### 1d. `liveBanner.{recruiter,personal}.projectRef` — NEW field per voice

The terminal panel's `CASE STUDY →` link needs the slug. Add **inside each voice object**
(see wrapper rule above):

```jsonc
"liveBanner": {
  "recruiter": { /* existing fields */ "projectRef": "fico-cod-rto" },
  "personal":  { /* existing fields */ "projectRef": "fico-cod-rto" }
}
```

The personal page no longer renders LiveBanner either, but keep both voices populated —
the field is about the underlying fact, and the frontend resolves whichever voice is active.

### 1e. `hero.{voice}.stats[].href` — NEW field per stat (both voices)

Stats render as evidence links in the redesigned hero: `#hash` scrolls to a section,
`/work/{slug}` routes to a case study, absent/null renders a plain non-link tile.

```jsonc
"stats": [
  { "value": "15+", "label": "Years in fintech", "href": "#enterprise" },
  { "value": "7K+", "label": "Engineers shipped to", "href": "/work/lseg-rfa" },
  { "value": "#1",  "label": "FICO GSI Hackathon 2026", "href": "/work/fico-cod-rto" }
]
```

*(Added 2026-07-16 — missed in the original delta; without it, stats saved through the
admin UI drop their links because the backend `Stat` DTO strips unknown fields.)*

---

## 2. Service-layer impact

- **DB**: none. `site_content.content` is a TEXT JSON string; the new keys ride along.
- **DTO/VO**: if the hero voice is a typed value object, extend it:
  - `HeroVoice` + `Terminal { String loc; String now; Latest latest; }`, `Latest { String text; String projectRef; }` (recruiter voice only — leave nullable)
  - `HeroVoice` + `List<LedgerRow> ledger;`, `LedgerRow { String label; String value; String projectRef; String href; }` (personal voice only — leave nullable)
  - `LiveBannerVoice` + `String projectRef;`
- **Admin UI** (projects.akashreya.space): form support for the three additions —
  a 5-row editable ledger table, the three terminal fields, and the liveBanner projectRef.
  Ledger edits are expected to be frequent (the card footer literally says "UPDATED OFTEN").

---

## 3. Content edits (admin UI, no code — owner decisions, listed for completeness)

1. **`nav.recruiter`**: remove the `{ "id": "live", "num": "II", "name": "Live", "target": "live" }`
   entry and renumber III→II etc. The LiveBanner section no longer exists as a scroll target.
   (The frontend no-ops on missing targets, so nothing breaks if this lags — the button is just dead.)
2. **`hero.recruiter.stats`**: currently `4 Projects in 2025 / ~2K Users / 15+ Years`. The
   redesign turns stats into evidence links; the stronger v3-seed set was
   `15+ Years in fintech / 7K+ Engineers shipped to / #1 FICO GSI Hackathon 2026`. Owner's call.
3. **Ticker dedup (optional)**: ledger rows promote ticker lines id `5` (hot water) and id `3`
   (three books), and paraphrase id `1` (POKÉTOPIA). Both ledger and ticker are visible on the
   same screen now — consider removing/replacing those ticker lines.

---

## 4. Deploy order

Any order works. The frontend ships with `fallback.js` mirrors of every new field and falls
back per-field when a key is absent (`hero.terminal` missing → panel renders from fallback
values; `ledger` missing → fallback ledger). Backward compatibility rule from v3 still holds:
old payloads keep working unchanged.
