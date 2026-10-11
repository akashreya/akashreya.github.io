# API Handover — Case Study v3.2

**From:** backend repo (`ProjectService`)
**To:** frontend repo (`akashreya-portfolio`)
**Date:** 2026-07-28
**Supersedes:** the case-study section of `Docs/API_HANDOVER.md` (v2) and `Docs/API_HANDOVER_v3.md` §3
**DB:** SQLite, `case_study.content` TEXT column (JSON blob) — see "Storage" below

## What changed

Case studies got the two-voice treatment the rest of the site already has, plus the
structural fix that made it possible: sections are now an **ordered, typed list**
(`sections[]`) instead of 6 fixed, hardcoded top-level fields, and each voice gets its
**own nav** — its own pills, its own order, its own subset of sections. Nearly every
prose field (titles, body copy, decision reasoning, phase copy, trade-off labels) is now
`Voice`-typed; previously only `overview.lede`, `problem.body`, and `outcome.body` were.

**This repo's change alone does not change what `akashreya.space` renders.** The
existing renderer reads `problem`, `architecture`, `decisions`, `process`, `tradeoffs`,
`outcome` off the top level — this API keeps emitting all six (see "Legacy mirror"
below) specifically so nothing breaks on deploy. Picking up the new capabilities
(per-voice nav, arbitrary section order, editable trade-off labels) requires the
portfolio-side work this doc describes.

---

## Backward-compatibility rule (unchanged from v3)

`Docs/API_HANDOVER_v3.md`'s rule still governs every field in this payload: `if
(field?.recruiter && field?.personal) use field[mode] else use field as-is`. Every
prose leaf below is a `Voice` object; every label is too.

---

## `GET /api/projects/{slug}` — full v3.2 shape

```jsonc
{
  "slug": "fico-cod-rto",

  // The per-voice index. Render nav[mode] in order; each item's `target` resolves to
  // a section in `sections[]` by id. A section NOT referenced by nav[mode] does not
  // render in that mode — this is the mechanism for per-voice section visibility,
  // order, and pill labels all at once. There is no separate "hidden" flag.
  "nav": {
    "recruiter": [
      { "id": "problem", "num": "01", "name": "The problem.", "target": "problem" },
      { "id": "architecture", "num": "02", "name": "Architecture.", "target": "architecture" },
      { "id": "decisions", "num": "03", "name": "Key decisions.", "target": "decisions" },
      { "id": "process", "num": "04", "name": "How it happened.", "target": "process" },
      { "id": "tradeoffs", "num": "05", "name": "Trade-offs.", "target": "tradeoffs" },
      { "id": "outcome", "num": "06", "name": "Outcome.", "target": "outcome" }
    ],
    "personal": [
      { "id": "problem", "num": "01", "name": "What broke", "target": "problem" },
      { "id": "architecture", "num": "02", "name": "How it works", "target": "architecture" },
      { "id": "tradeoffs", "num": "03", "name": "The bill", "target": "tradeoffs" },
      { "id": "process", "num": "04", "name": "What happened", "target": "process" },
      { "id": "outcome", "num": "05", "name": "Outcome", "target": "outcome" }
      // note: "decisions" is absent — personal mode simply doesn't show that section here
    ]
  },

  // Every field Voice.
  "overview": {
    "eyebrow": { "recruiter": "§ I - FICO WORLD 2026", "personal": "§ I - FICO WORLD 2026" },
    "title": { "recruiter": "...", "personal": "..." },
    "shortTitle": { "recruiter": "COD/RTO", "personal": "COD/RTO" },
    "lede": { "recruiter": "...", "personal": "..." },
    "role": { "recruiter": "...", "personal": "..." },
    "period": { "recruiter": "Q1 2026", "personal": "Q1 2026" },
    "stack": { "recruiter": "...", "personal": "..." },
    "team": { "recruiter": "...", "personal": "..." }
  },

  // Unchanged shape — never voiced, stays flat.
  "metrics": [{ "value": "#1", "label": "FICO GSI Partner Hackathon 2026" }],

  // The section pool. `nav[mode]` decides what actually renders and in what order —
  // this array's own order is just the pool order, used as the default when a new
  // voice's nav is synthesized (e.g. from a legacy row).
  "sections": [
    {
      "id": "problem", "type": "prose", "num": "01",
      "title": { "recruiter": "The problem.", "personal": "What broke." },
      "body": { "recruiter": "<p>...</p>", "personal": "<p>...</p>" }
    },
    {
      "id": "architecture", "type": "diagram", "num": "02",
      "title": { "recruiter": "...", "personal": "..." },
      "intro": { "recruiter": "<p>...</p>", "personal": "<p>...</p>" },
      "diagram": { "recruiter": "  [Kafka] --> ...", "personal": "  [Kafka] --> ..." },
      "outro": { "recruiter": "<p>...</p>", "personal": "<p>...</p>" }
    },
    {
      "id": "decisions", "type": "decisions", "num": "03",
      "title": { "recruiter": "...", "personal": "..." },
      "choiceLabel": { "recruiter": "Choice", "personal": "Choice" },
      "alternativesLabel": { "recruiter": "Alternatives", "personal": "Alternatives" },
      "reasoningLabel": { "recruiter": "Reasoning", "personal": "Reasoning" },
      "items": [
        {
          "choice": { "recruiter": "...", "personal": "..." },
          "alternatives": { "recruiter": "...", "personal": "..." },
          "reasoning": { "recruiter": "...", "personal": "..." }
        }
      ]
    },
    {
      "id": "process", "type": "timeline", "num": "04",
      "title": { "recruiter": "...", "personal": "..." },
      "phases": [
        {
          "date": { "recruiter": "Week 1", "personal": "Week 1" },
          "name": { "recruiter": "...", "personal": "..." },
          "body": { "recruiter": "...", "personal": "..." }
        }
      ]
    },
    {
      "id": "tradeoffs", "type": "tradeoffs", "num": "05",
      "title": { "recruiter": "Trade-offs.", "personal": "Trade-offs." },
      "gainedLabel": { "recruiter": "What we gained", "personal": "What I got" },
      "gaveUpLabel": { "recruiter": "What we gave up", "personal": "What it cost" },
      "gained": { "recruiter": "...", "personal": "..." },
      "gaveUp": { "recruiter": "...", "personal": "..." }
    },
    {
      "id": "outcome", "type": "prose", "num": "06",
      "title": { "recruiter": "Outcome.", "personal": "Outcome." },
      "body": { "recruiter": "<p>...</p>", "personal": "<p>...</p>" }
    }
  ],

  "links": [{ "label": { "recruiter": "...", "personal": "..." }, "url": "https://..." }],

  // --- Legacy mirror — see "Legacy mirror" section below. Read-only, derived. ---
  "problem": { "title": "The problem.", "body": { "recruiter": "...", "personal": "..." } },
  "architecture": { "title": "...", "intro": "...", "diagram": "...", "outro": "..." },
  "decisions": { "title": "...", "items": [{ "choice": "...", "alternatives": "...", "reasoning": "..." }] },
  "process": { "title": "...", "phases": [{ "date": "...", "name": "...", "body": "..." }] },
  "tradeoffs": { "gained": "...", "gaveUp": "..." },
  "outcome": { "title": "Outcome.", "body": { "recruiter": "...", "personal": "..." } }
}
```

### Field types not in the old shape

`Overview` gained no new fields — every one of its 8 was already there, just promoted
from `String` to `Voice`. What's genuinely new: the top-level `nav` object, and
`sections[]` replacing the 6 fixed fields. Within `sections[]`, `type` is a
discriminator — the fields that are meaningful (and present; everything else is
omitted, not null, via server-side `NON_NULL`) depend on it:

| `type` | Renders as | Present fields |
|---|---|---|
| `prose` | A heading + one HTML block | `title`, `body` |
| `diagram` | Heading + intro prose + `<pre>` diagram + outro prose | `title`, `intro`, `diagram`, `outro` |
| `decisions` | Heading + a labeled table of choice/alternatives/reasoning rows | `title`, `choiceLabel`, `alternativesLabel`, `reasoningLabel`, `items[]` |
| `timeline` | Heading + a list of dated phases | `title`, `phases[]` |
| `tradeoffs` | Heading + two labeled prose blocks | `title`, `gainedLabel`, `gaveUpLabel`, `gained`, `gaveUp` |

A section `type` the renderer doesn't recognize should be skipped, not crashed on —
new types can be added on the backend (admin console supports any of the five above
today) without a portfolio deploy landing in the same window.

### The nav-as-index rule

Read `nav[mode]` top to bottom. For each item, look up `sections[]` by matching
`item.target` to a section's `id` and render that section, in that position, with
`item.num` and `item.name` as the pill. **A section absent from `nav[mode]` does not
render in that mode.** This is intentional and is how personal mode can, for example,
skip the `decisions` section entirely for a case study where the reasoning behind each
decision isn't worth a personal-voice retelling — see the `fico-cod-rto` example above.

Do not derive pills from section titles anymore (the old approach, since section titles
now differ per voice and per-voice section sets differ too) — `nav[mode]` is the single
source of truth for pills, order, and visibility together.

### Trade-off labels are now data

`sections[].gainedLabel` / `gaveUpLabel` replace whatever string the portfolio
currently hardcodes for "What we gained" / "What we gave up" (or "What we gained" /
"What we gave up" — check the current renderer, it may already say something slightly
different). Read these from the payload; do not hardcode them. They default to "What we
gained" / "What we gave up" in both voices for any case study that hasn't customized
them yet, so removing the hardcoded fallback is safe the moment this API is live.

---

## Legacy mirror (temporary, remove when the portfolio migrates)

Six top-level fields — `problem`, `architecture`, `decisions`, `process`, `tradeoffs`,
`outcome` — are still emitted, reconstructed server-side from `sections[]`, in exactly
the pre-v3.2 shape (`CaseStudyServiceImpl#populateLegacyMirror`). This is what lets the
current renderer (which reads `data.problem.body`, `data.tradeoffs.gained`, etc.
directly) keep working unmodified after this deploys.

**Important asymmetry**: within the mirror, `problem.body` and `outcome.body` are still
full `{recruiter, personal}` objects (matching what production emits today — the v3 doc
already documented these two as two-voice). Every other mirrored field —
`architecture.intro/diagram/outro`, `decisions.items[].*`, `process.phases[].*`,
`tradeoffs.gained/gaveUp` — is flattened to a single string (the recruiter voice, or
personal if recruiter is empty), because the v3 doc's two-voice table explicitly listed
those as staying flat, and the current renderer never runs them through a voice-picker.
`overview` and `links` are not mirrored at all — they stay top-level in their new voiced
shape, which is safe under the general backward-compat rule since neither field moved
or was restructured, only its leaf type changed (string → `{recruiter, personal}`).

**Payload size roughly doubles** (~7–9 KB → ~15 KB) while the mirror exists. Note also
that `fico-cod-rto`'s personal-mode Service Inspector renders this response verbatim, so
the duplication is momentarily user-visible on that one page.

**Migration path for the portfolio repo:**

1. Switch the case-study page to read `nav[mode]` + `sections[]` instead of the six
   fixed fields.
2. Read `gainedLabel` / `gaveUpLabel` instead of a hardcoded trade-offs heading.
3. Confirm nothing still reads the six mirrored top-level fields.
4. Tell the backend team — the mirror (`populateLegacyMirror` plus the six response
   fields on `CaseStudyResponseType`) gets deleted in one small PR.

---

## Storage (backend-internal, no portfolio impact)

`case_study` gained one nullable `content` TEXT column holding the entire payload above
as one JSON blob — the same pattern `site_content.content` already uses. The 9 legacy
columns (`overview`, `problem`, `architecture`, `decisions`, `process_data`,
`tradeoffs`, `outcome`, `metrics`, `links`) are frozen, no longer written, and read only
to upgrade a row that predates this column. No DDL beyond the new column; `sections[]`
means adding a section type going forward is a DTO change, not a migration.

---

## What did NOT change

- Endpoints: still `GET /api/projects/{slug}` (public) and `POST
  /api/admin/projects/{id}/case-study` (admin, full replace — same as before, no partial
  update).
- `metrics[]` and `links[].url` — unvoiced, same shape as v2/v3 (only `links[].label`
  became `Voice`).
- 404 semantics, auth, CORS — unchanged from v2/v3.
