export const fallbackCaseStudies = {
  'fico-cod-rto': {
    "slug": "fico-cod-rto",
    "overview": {
      "eyebrow": "§ I - FICO WORLD 2026",
      "title": "Decision Intelligence for eCommerce",
      "shortTitle": "COD/RTO",
      "lede": "Built a real-time order risk decisioning intelligence on FICO Platform that won first place at the FICO GSI Partner Hackathon 2026 and is now showcased at FICO World, Orlando.",
      "role": "Lead Designer & Builder · Tech Mahindra Team",
      "period": "Q1 2026",
      "stack": "FICO Decision Modeler, FICO Process Designer, FICO Process Execution Engine, FICO DBaaS, FICO PLOR, Java 11 (38 classes), XSLT 3.0, Groovy, Claude Code",
      "team": "Tech Mahindra hackathon team"
    },
    "metrics": [
      { "value": "#1",    "label": "FICO GSI Partner Hackathon 2026" },
      { "value": "85",    "label": "Decision rules" },
      { "value": "<200ms","label": "Decision latency" },
      { "value": "8",     "label": "Sequential data signals" }
    ],
    "problem": {
      "title": "The problem.",
      "body": "<p>In Indian e-commerce, 60–65% of all orders are Cash-on-Delivery. Of those, 25–30% result in Return-to-Origin - the customer refuses delivery or isn't available. Each failed delivery costs ₹180–240 in reverse logistics. At industry scale, that is roughly ₹2,000 crore in annual losses and it is largely preventable with the right data signals evaluated at order placement time.</p><p>Every other team at the hackathon went to FICO's home turf - banking, credit risk, fraud, loan decisioning. We did the research, surveyed 300 sites, and found eight problems worth solving. Indian e-commerce COD risk was the one nobody else was looking at. Not because it was the wrong tool - because everyone assumed it was someone else's problem.</p>"
    },
    "architecture": {
      "title": "Architecture.",
      "intro": "<p>The platform makes four decisions per order in a single pass: COD eligibility (allow/deny/require prepaid), prepaid incentive amount (₹0/₹25/₹50/₹100), optimal dark-store fulfilment selection and best Delivery Partner.. PLOR orchestrates 8 API calls enriching a single <code>EvaluationContext</code> object with one more data source. Plor orchestrates the Decision Manager call and a progressive scorecard runs accumulating risk signal as data arrives. </p>",
      "diagram": "  Incoming Order\n        |\n   [1] ADDRESS_SETUP    -> blocked? DENY\n   [2] PHONE_CHECK      -> blocked? DENY\n   [3] PINCODE_CHECK    -> blocked? DENY\n   [4] CUSTOMER_CHECK   -> blocked? DENY\n   [5] PRODUCT_EVAL     (scoring)\n   [6] FRAUD_CHECK      -> blocked? DENY\n   [7] DELIVERY_EVAL    (scoring)\n   [8] FINAL_DECISION   -> COD + Incentive + Dark Store",
      "outro": "<p>38 Java classes - 16 enums and 22 model classes across 5 architectural layers - and a single unified BOM root (<code>EvaluationContext</code>) that is both input and output of every Decision Manager call. The architecture decided how each kind of risk should behave <em>before</em> a single line of rule logic was written.</p>"
    },
    "decisions": {
      "title": "Key decisions.",
      "items": [
        {
          "choice": "Parallel Intelligence",
          "alternatives": "Single mega-decision, parallel fan-out",
          "reasoning": "A Parallel API calls makes the enrichment lightning fast during the cart to payment screen."
        },
        {
          "choice": "Unified BOM root (EvaluationContext)",
          "alternatives": "Phase-specific request/response objects",
          "reasoning": "One object that grows across phases means every rule has access to every prior signal without translation layers. It also gave us a single place to attach the scorecard breakdown for explainability."
        },
        {
          "choice": "AI-assisted onboarding instead of waiting for community answers",
          "alternatives": "Reading FICO docs, raising support tickets",
          "reasoning": "No one on the team had built on the FICO platform before. We scraped FICO documentation, converted to markdown, built it into Claude skills with project context. Onboarded the team in days instead of weeks."
        },
        {
          "choice": "Audit the object model against every rule before authoring",
          "alternatives": "Start writing rules and fix gaps as found",
          "reasoning": "Asked Claude to cross-check each of the 85 rule conditions against the Java BOM. Found seven design gaps on paper - including missing computed getters and a String-vs-enum mismatch - before any rule was written. By go-time, ambiguity was gone."
        }
      ]
    },
    "process": {
      "title": "How it happened.",
      "phases": [
        { "date": "Week 1",       "name": "Problem selection",            "body": "Researched 300 sites, found 8 candidate problems, picked Indian e-commerce COD risk specifically because nobody else would. Validated the ₹2,000-crore loss number against logistics data." },
        { "date": "Week 2",       "name": "AI-built onboarding",          "body": "Scraped FICO documentation, converted to structured markdown, built into shared Claude skills. Onboarded the whole team in days." },
        { "date": "Week 3",       "name": "BOM design & gap audit",       "body": "Designed 38 Java classes across 5 layers. Audited every rule condition against the model - 7 design gaps found and resolved before code." },
        { "date": "Week 4",       "name": "Rule authoring",               "body": "85 decision rules across 10 rule sets in Decision Manager. Progressive scorecard wired through 7 phases." },
        { "date": "Week 5",       "name": "Cross-component auth deep-dive","body": "PLOR calling DBaaS across solution boundaries hit 403/401/timeout cascades. Playwright MCP drove the FICO UI; Postman MCP parsed a 440KB collection to reverse-engineer the correct token endpoint. Root cause: DMP Bearer with parent-solution credentials, not the solution-generated token." },
        { "date": "Week 6",       "name": "XSL bug hunt via live calls",  "body": "Live fetch() from the browser against DBaaS endpoints revealed delivery-partner fields were lowercase snake_case while dark-store fields were uppercase. Would have been silent (200 OK, empty fields) without live inspection." },
        { "date": "Mar 26, 2026", "name": "Hackathon presentation",       "body": "Demo'd to FICO GSI judges. Won first place. Judges asked: 'When are you taking this to e-commerce and marketing it?'" },
        { "date": "May 20, 2026", "name": "FICO World 2026 showcase",     "body": "Live at FICO World, Orlando." }
      ]
    },
    "tradeoffs": {
      "gained": "First-place hackathon win, FICO World showcase, a reusable parallel-call pattern for any risk problem, a proven AI-as-IDE workflow for an unfamiliar enterprise platform.",
      "gaveUp": "Time spent on AI-assisted onboarding and rule-vs-BOM audit pushed actual rule authoring later than other teams. The bet was that ambiguity-free rule authoring would be faster than re-authoring rules during the build. It was."
    },
    "outcome": {
      "title": "Outcome.",
      "body": "<p>First place, FICO GSI Partner Hackathon 2026. Showcased at FICO World, Orlando, May 2026. Judges' question - 'When are you taking this to e-commerce and marketing it?' - turned a hackathon project into a productisation conversation.</p><p>The deeper outcome is the pattern: AI doesn't just generate code. It enables a different kind of engineering - where ambiguity is removed before development starts, where unfamiliar enterprise platforms are onboarded in days, and where a 4-hour debugging session becomes 2 hours with full root cause analysis attached.</p>"
    },
    "links": [
      { "label": "LinkedIn announcement", "url": "https://www.linkedin.com/feed/update/urn:li:share:7458164794626322432/" }
    ]
  },

  'fico-ivr-simulator': {
    "slug": "fico-ivr-simulator",
    "overview": {
      "eyebrow": "§ II - PRODUCTIVITY MULTIPLIER",
      "title": "FICO IVR Workflow Testing Platform",
      "shortTitle": "IVR Simulator",
      "lede": "A local simulation platform that replaces phone-based IVR testing with millisecond execution, validating every reachable path through a fraud-workflow before deployment.",
      "role": "Lead Developer",
      "period": "2026",
      "stack": "JSON workflow parser, custom regression framework",
      "team": "Solo · built for Dev and QA teams"
    },
    "metrics": [
      { "value": "2651", "label": "Nodes validated across 3 banks" },
      { "value": "35",   "label": "Node types supported" }
    ],
    "problem": {
      "title": "The problem.",
      "body": "<p>Major banks use FICO's Customer Communications platform to manage how they contact customers during fraud events - IVR menus, SMS alerts, real-time decisions to block a card or escalate to a live agent. These workflows are decision trees with hundreds of branching paths.</p><p>Before this project, testing one of these workflows meant booking time with telephony infrastructure, making real phone calls into a live deployed environment, pressing keys through menus manually, and repeating for every scenario. A single test took 3–5 minutes. Full coverage was simply not practical, so workflows shipped undertested. Wrong fraud dispositions, missed card replacements, broken retry logic - in a fraud context, these are not minor bugs.</p>"
    },
    "architecture": {
      "title": "Architecture.",
      "intro": "<p>The platform is a faithful reimplementation of the FICO workflow engine, designed in layers - from a core execution engine, to CSV-driven batch testing, to an interactive terminal simulator, to an automated exhaustive path explorer that runs in CI.</p>",
      "diagram": "  Workflow JSON\n        |\n  [Execution Engine] - supports all 35 node types\n        |\n  [Test Mode Selector]\n   |    |    |    |\n  CSV  Terminal  Auto-explore  Single-run\n   |    |    |    |\n  [Two-layer outputs]\n   |        |\n  Bank      Customer\n  postback  IVR experience\n        |\n   [HTML Report]",
      "outro": "<p>Two-layer test output is the key design choice: bank outputs (the postback payloads with the financial decision) are validated separately from customer outputs (the IVR experience). This mirrors how QA actually thinks about these workflows - 'did the bank get the right decision?' and 'did the customer have the right experience?' - and lets each layer be asserted independently.</p>"
    },
    "decisions": {
      "title": "Key decisions.",
      "items": [
        {
          "choice": "Layered platform: engine → batch → interactive → exhaustive",
          "alternatives": "Single-purpose tool",
          "reasoning": "Each layer earns its own keep. The execution engine is the foundation. Batch testing handles QA's daily work. The interactive terminal replaces ad-hoc phone tests. Exhaustive path simulation runs in CI and blocks deployments when coverage drops."
        },
        {
          "choice": "Two-layer test output (bank vs customer)",
          "alternatives": "Single combined assertion model",
          "reasoning": "Different stakeholders care about different things. Risk engineering cares about the bank postback. QA cares about the customer experience. Asserting them separately means each can fail independently and clearly."
        },
        {
          "choice": "Self-contained HTML reports",
          "alternatives": "Server-rendered dashboard",
          "reasoning": "Reports need to be forwardable in email and attachable to Jira tickets. No server, no auth, no dependencies - just an .html file with collapsible execution timelines and colour-coded pass/fail."
        }
      ]
    },
    "process": {
      "title": "How it happened.",
      "phases": [
        { "date": "Phase 1",   "name": "Execution engine",           "body": "Built the core node-type executor against three live production workflows - 100% execution coverage of 35 node types." },
        { "date": "Phase 2",   "name": "Test data generation",       "body": "Workflow inspection that infers variable types from naming conventions and produces ready-to-run test files." },
        { "date": "Phase 3",   "name": "Documentation generators",   "body": "Human-readable workflow docs from the JSON: entry points, decision trees, variable inventory, strategy definitions, compliance activity mapping validator." },
        { "date": "In design", "name": "CSV batch runner",           "body": "Spreadsheet-driven scenario validation - 50 scenarios validated in under 10 seconds with a shareable HTML report." },
        { "date": "In design", "name": "Interactive terminal simulator", "body": "Replaces phone-based ad-hoc testing for 80% of scenarios. Replayable sessions, exportable HTML." },
        { "date": "In design", "name": "Exhaustive path simulation", "body": "Automated reachable-path discovery. Designed to run in CI and block deploys on coverage regression." }
      ]
    },
    "tradeoffs": {
      "gained": "Validation moved from sample-based to exhaustive - every reachable path verified before deploy. Instant, offline execution replaces phone-dependent infrastructure for every scenario covered by the engine.",
      "gaveUp": "The platform must track FICO workflow engine semantics as they evolve. Each new node type or attribute is a maintenance task. Worth it: the alternative is back to phones."
    },
    "outcome": {
      "title": "Outcome.",
      "body": "<p>Core platform live, advanced simulation in design. Validated against 2,651 nodes across three banks, covering all 35 node types the FICO platform supports. The shift this drives: from phone-dependent, sample-based, infrastructure-heavy testing to instant, exhaustive, offline, evidence-backed workflow validation.</p>"
    },
    "links": []
  },

  'everythingabc': {
    "slug": "everythingabc",
    "overview": {
      "eyebrow": "§ IV - SOLO PRODUCT",
      "title": "Everything ABC",
      "shortTitle": "Everything ABC",
      "lede": "A solo, AI-assisted full-stack vocabulary learning platform built under the constraint that time is the scarcest resource.",
      "role": "Solo product owner & engineer",
      "period": "2025",
      "stack": "React 19, Vite, Tailwind CSS 4, Node.js 18, Express 4, MongoDB 7, Mongoose, Sharp.js, Bull + Redis, AWS S3 + CloudFront, JWT, Docker",
      "team": "Solo · 10–20 hrs/week"
    },
    "metrics": [
      { "value": "1300+", "label": "Items across categories" },
      { "value": "99.2%", "label": "API payload reduction (V1→V2)" }
    ],
    "problem": {
      "title": "The problem.",
      "body": "<p>A visual vocabulary platform lets K–12 students, ESL learners, and casual learners explore hundreds of categories - Animals, Fruits, Household Items, Musical Instruments - A to Z with curated images, descriptions, and facts. The naïve workflow for the developer is brutal: research 26 items per letter for multiple categories, Google an image for each, download, resize, upload, link. Hundreds of hours of manual work, before any real product features ship.</p><p>The constraint shaping every decision: 10–20 hrs/week of solo time. AI is not a crutch here - it is a force multiplier that compresses research cycles, automates the mechanical parts of content creation, and audits AI-generated content against quality rules so the developer's time is spent on judgement, not generation.</p>"
    },
    "architecture": {
      "title": "Architecture.",
      "intro": "<p>Three surfaces: a public learning UI (React + Vite), a protected admin CMS, and a separate image-collection dashboard. Data lives in MongoDB. Image processing flows through a Bull queue on Redis, with each step (collect → analyse → resize → upload) as its own queue processor. S3 + CloudFront serves processed images in five sizes globally.</p>",
      "diagram": "  Public UI (React + Vite)\n     |\n     v\n  V2 API (hypermedia-inspired)\n     |\n     v\n  MongoDB (categories, items, images, audit_log)\n     ^\n     |\n  Admin CMS  --> image-collection-system (separate React app)\n                       |\n                       v\n             Bull Queue (Redis)\n             - collect (Unsplash/Pixabay/Pexels)\n             - analyse (quality scoring)\n             - process (Sharp.js → WebP × 5 sizes)\n             - upload (S3 → CloudFront)",
      "outro": "<p>V1 embedded items inside category documents. That was fast to build and query but blocked letter-browsing across all categories. V2 separated items into their own collection with denormalised category fields and an index on <code>letter</code>. Letter browsing became a single index scan and category response sizes dropped from 291KB to 2.4KB - a 99.2% reduction.</p>"
    },
    "decisions": {
      "title": "Key decisions.",
      "items": [
        {
          "choice": "MongoDB over Postgres for flexible content schema",
          "alternatives": "Postgres, hybrid",
          "reasoning": "Categories add new fields over time without migrations. Mongoose schemas provide validation; the native driver handles bulk reads and migrations. Schema evolution is a feature, not a problem."
        },
        {
          "choice": "Hypermedia-inspired V2 API",
          "alternatives": "Stick with V1 embedded responses",
          "reasoning": "Every response advertises related resources via URLs. Frontend fetches what it needs when it needs it. Cards do not need full item data. Cacheable at the CDN layer. The cost was a one-time migration."
        },
        {
          "choice": "Automated image pipeline with human-in-the-loop review",
          "alternatives": "Fully manual or fully automated approval",
          "reasoning": "Took longer to build than manually collecting images for 5 categories. By category 6 it had paid for itself. By category 20 it had saved 80–100 hours. The creative judgement is still human - the mechanical work is automated."
        },
        {
          "choice": "Custom regression suite (not Jest, not Playwright)",
          "alternatives": "Off-the-shelf test runners",
          "reasoning": "The testing surface is not unit logic - it is data correctness inside a running production system. Robot-Framework-style reporting (clear names, pass/fail, actionable failure messages) over generic test runners. Deep-crawls the API by following hypermedia links instead of relying on a developer's memory of which endpoints exist."
        },
        {
          "choice": "AI as a quality auditor of AI-generated content",
          "alternatives": "Trust the enrichment output",
          "reasoning": "AI generates fast - validation is where the engineering lives. The suite catches shoehorned items (e.g. 'jacket-hanger' fabricated to fill J), placeholder descriptions ('Learn about...'), missing tags or facts, and orphan images. The rules came from analysing what the enrichment pipeline actually produces when it runs out of real content."
        }
      ]
    },
    "process": {
      "title": "How it happened.",
      "phases": [
        { "date": "Phase 1", "name": "V1 with embedded items",    "body": "Fastest path to a working app. REST endpoints returning full category documents. Got real users in front of the product." },
        { "date": "Phase 2", "name": "Admin CMS + audit log",     "body": "Protected admin panel for CRUD. Every action recorded - actor, IP, before/after state. Has paid back many times during content debugging." },
        { "date": "Phase 3", "name": "Image pipeline",            "body": "Bull-queue pipeline: collect from Unsplash/Pixabay/Pexels, score quality across 4 dimensions, resize via Sharp.js to 5 WebP sizes, upload to S3, serve via CloudFront. Review queue collapses image selection to one click per item." },
        { "date": "Phase 4", "name": "V2 API migration",          "body": "Separated items into their own collection. Added letter index. PokeAPI-style hypermedia responses. 99.2% payload reduction on category endpoints. Frontend kept working through the migration." },
        { "date": "Phase 5", "name": "Regression suite",          "body": "Four suites: database integrity, data quality, image validation, deep-crawl API. First run surfaced ~1,845 broken imageId references and 40 orphan images. Now part of the deployment loop." }
      ]
    },
    "tradeoffs": {
      "gained": "A live product on zero marketing. A pipeline that handles content growth without dev intervention. A regression suite that catches AI content failures at scale. A reusable pattern for solo-developer AI-assisted full-stack work.",
      "gaveUp": "No user authentication yet (deferred until market validation). No Playwright E2E suite yet (UI evolves too fast for the maintenance cost). Single-region CloudFront (no evidence of international traffic yet). State management is React Context + useReducer everywhere - no Redux, no Zustand."
    },
    "outcome": {
      "title": "Outcome.",
      "body": "<p>Live at <a href=\"https://everythingabc.com\">everythingabc.com</a>. What the project proves: with the right AI integration, a solo developer at 10–20 hrs/week can build and operate a real production system - not a tutorial CRUD app - with feature scope, technical debt, and time investment all actively managed. The deeper lesson is that AI's role is leverage, not replacement: it removes mechanical work so the developer focuses on the decisions that actually matter.</p>"
    },
    "links": [
      { "label": "Live", "url": "https://everythingabc.com" }
    ]
  },

  'poketopia': {
    "slug": "poketopia",
    "overview": {
      "eyebrow": "§ V - DESIGN-FIRST FRONTEND",
      "title": "Poketopia",
      "shortTitle": "Poketopia",
      "lede": "A Pokemon encyclopedia and daily Wordle-style guessing game. Type-themed gradient detail pages, keyboard parity, swipe navigation, animation, and full accessibility - built to prove that frontend is a design problem first, an engineering problem second.",
      "role": "Solo build",
      "period": "2025",
      "stack": "React 18 + Vite 6, TypeScript + JSX hybrid, React Router 7, Tailwind CSS 4 with custom type-color utilities, Framer Motion v12, Radix UI, canvas-confetti, react-ga4, web-vitals, PokéAPI, Jest 30, Vercel",
      "team": "Solo"
    },
    "metrics": [
      { "value": "~500", "label": "Users" },
      { "value": "1025", "label": "Pokemon covered" },
      { "value": "10",   "label": "Attributes compared in PokeGuess" },
      { "value": "11",   "label": "Custom GA4 events" }
    ],
    "problem": {
      "title": "The problem.",
      "body": "<p>Pokémon clones are everywhere. Most are list-and-detail apps with stock animations and a default Pokémon-red theme. The challenge was different: build a Pokédex that is genuinely a pleasure to use - type-themed visuals, keyboard parity, swipe navigation, fuzzy search, glassmorphism - without sacrificing performance, accessibility, or maintainability.</p><p>The Wordle-style daily game was the second proof: a date-hash deterministic target across three difficulty tiers, ten attributes compared with five-color feedback, statistics, share-to-clipboard. Frontend as a design problem first.</p>"
    },
    "architecture": {
      "title": "Architecture.",
      "intro": "<p>BrowserRouter with four main routes plus a 404 catch-all. Three React contexts (Pokemon list, user preferences, favorites). A custom service layer with a localStorage-backed HTTP cache, recursive evolution-chain parser, and async throttle queue. Tailwind's <code>safelist</code> keeps all 54 type-gradient utility classes from being tree-shaken.</p>",
      "diagram": "  / (Home)              - hero + featured strip + features\n  /pokemon              - filter sidebar + grid/list + pagination\n  /pokemon/:id          - type-gradient hero + about/stats/moves/evolution\n  /pokeguess            - daily Wordle-style game\n        |\n        v\n  Service layer\n  - pokedexapi.ts       (PokéAPI wrappers)\n  - cache.ts            (localStorage HTTP cache with TTL)\n  - evolutionService.ts (recursive chain parser + decision tree)\n  - throttle.ts         (async FIFO queue)\n  - pokemonWordleService.ts",
      "outro": "<p>The type-gradient system is the visual through-line: every detail page derives its background from the Pokémon's type pair using a 155deg linear gradient between pastel <code>TYPE_GRAD_LIGHT_HEX</code> and saturated <code>TYPE_SOLID_HEX</code> values across all 18 types. The same gradients power evolution nodes, badges, and card backgrounds.</p>"
    },
    "decisions": {
      "title": "Key decisions.",
      "items": [
        {
          "choice": "Custom SVG hex radar chart over a chart library",
          "alternatives": "Chart.js, Recharts",
          "reasoning": "Hand-drawn polygon means total control over the look - concentric hex rings, gradient fill (grass green → poison purple), axis labels with stat colors. React.useId() prevents gradient ID collisions on remount."
        },
        {
          "choice": "Date-hash deterministic Wordle target",
          "alternatives": "Server-side daily target",
          "reasoning": "32-bit string hash on YYYY-MM-DD means every player gets the same Pokémon on the same day without a server. Day number = days since 2024-01-01 + 1, shown in the header."
        },
        {
          "choice": "9 localStorage keys for back-navigation restoration",
          "alternatives": "Context-only state",
          "reasoning": "Detail-to-list back navigation restores exact scroll position, filters, sort, page, and view mode via React Router location.state. The user returning to the list sees what they left, not a reset state."
        },
        {
          "choice": "Keyboard parity as a design requirement",
          "alternatives": "Mouse-only with token keyboard support",
          "reasoning": "Arrow-key grid navigation, Home/End, Enter-to-detail, Escape - column-aware vertical movement. PokeGuess has 6 page-level shortcuts. Every mouse-accessible interaction has a keyboard path."
        },
        {
          "choice": "Color never the only indicator",
          "alternatives": "Color-only feedback",
          "reasoning": "Type badges show text + color + icon. Game feedback uses color + emoji + directional glyph. ARIA labels and titles on every cell. Game board cells are role='cell' with natural-language labels."
        }
      ]
    },
    "process": {
      "title": "How it happened.",
      "phases": [
        { "date": "Phase 1", "name": "Listing + detail core",   "body": "Filter sidebar with 7 dimensions, fuzzy search (Levenshtein), dual-range height/weight sliders, type-gradient cards, pagination with smooth scroll." },
        { "date": "Phase 2", "name": "Detail polish",           "body": "Type-gradient hero, sprite gallery carousel, type effectiveness matrix, hex radar chart, animated stat bars with staggered fills, evolution decision-tree engine with 4 layout types (complete-tree / linear / mid-branch / single-stage)." },
        { "date": "Phase 3", "name": "PokeGuess",               "body": "Date-hash target selection, 3 difficulty tiers, 10 attribute comparison with 5-color feedback, dual-cannon confetti win, share-to-clipboard emoji grid, statistics modal." },
        { "date": "Phase 4", "name": "Accessibility + keyboard","body": "Full keyboard navigation across listing and game. ARIA across collapsible sections, game cells, dialogs. Escape closes everything." },
        { "date": "Phase 5", "name": "Analytics + perf",        "body": "GA4 with 11 custom events (Pokemon, Game, Feedback). web-vitals → gtag pipeline. Performance budget asserts CLS/FID/FCP/LCP/TTFB." }
      ]
    },
    "tradeoffs": {
      "gained": "A Pokédex that feels designed, not assembled. Type-gradient system, keyboard parity, accessibility, performance budget, deterministic daily game. Live with roughly 500 users on zero marketing.",
      "gaveUp": "Route-change pageviews are a known gap (initial pageview only). No service-worker offline mode for the game. Hybrid TypeScript/JSX codebase carries some duplication."
    },
    "outcome": {
      "title": "Outcome.",
      "body": "<p>Live at <a href=\"https://pokemon.akashreya.space\">pokemon.akashreya.space</a>. ~500 users, zero marketing. The project proves the thesis: frontend done well is a design problem first and an engineering problem second. The type-gradient system, the keyboard parity, the swipe + animation choreography - those decisions came before any code, and the code exists to honour them.</p>"
    },
    "links": [
      { "label": "Live", "url": "https://pokemon.akashreya.space" }
    ],
    "_typePairs": {
      "overview":     "flying-psychic",
      "problem":      "ghost-dark",
      "architecture": "electric-ice",
      "decisions":    "fire-fighting",
      "process":      "grass-water",
      "outcome":      "dragon-fairy"
    }
  },

  'lseg-rfa': {
    "slug": "lseg-rfa",
    "overview": {
      "eyebrow": "§ VI - ENTERPRISE: LSEG",
      "title": "LSEG Robust Foundation API - Java Edition",
      "shortTitle": "LSEG RFA",
      "lede": "Enterprise real-time market data API consumed by investment banks, hedge funds, and asset managers including Goldman Sachs, JPMorgan, and Barclays. Led Java 8→11 migration, JUnit 3→5 upgrade, OMM encoding rewrite, RFA-TREP connection stabilisation, and JVM performance tuning.",
      "role": "Tech Lead · Tech Mahindra engagement",
      "period": "2019 - 2025",
      "stack": "Java 8/11, Ant→Maven, Spring, Hibernate, RFA Java SDK, OMM, TREP/RTDS",
      "team": "LSEG product team"
    },
    "metrics": [
      { "value": "7.3M/s", "label": "Price updates handled by RTDS" },
      { "value": "70%",    "label": "Technical debt reduction" }
    ],
    "problem": {
      "title": "The problem.",
      "body": "<p>RFA is LSEG's enterprise API for consuming real-time streaming market data from TREP/RTDS. RTDS handles 7.3M price updates per second across hundreds of instruments. The Java edition was carrying significant baggage: a Java 8 codebase, deprecated APIs, Ant build scripts, brittle TREP reconnect behavior, and OMM (Open Message Model) encoding logic that produced messy downstream parsing.</p><p>RFA powers trading systems, risk engines, and pricing tools at institutions like Goldman Sachs, JPMorgan, and Barclays. The cost of getting reliability and performance wrong is measured in real basis points of trading risk.</p>"
    },
    "architecture": {
      "title": "Architecture.",
      "intro": "<p>RFA exists in C++, Java, and .NET editions. The Java edition sits on top of the TREP/RTDS infrastructure that banks host on-prem, handling subscriptions, decoding the proprietary RSSL protocol, and presenting OMM messages to consuming applications. The work focused on five surfaces: language version migration, connection management, OMM encode/decode, batch view handling, and JVM-level performance.</p>",
      "diagram": "  RSSL/TREP wire\n        |\n   [RFA Java SDK]\n        |\n   [Subscription manager] - reconnect, failover, partition recovery\n        |\n   [OMM encode/decode] - MarketPrice, MarketByOrder, MarketByPrice\n        |\n   [Batch view dispatcher] - grouped instrument requests\n        |\n        v\n   Consuming application (bank trading/risk system)",
      "outro": "<p>OMM is LSEG's unified message model used across all TREP versions. Streamlining the encode path produced cleaner downstream parsing for every downstream consumer, not just the team that owned RFA.</p>"
    },
    "decisions": {
      "title": "Key decisions.",
      "items": [
        {
          "choice": "Java 8 → 11 migration with JUnit 3 → 5",
          "alternatives": "Stay on Java 8, incremental patching",
          "reasoning": "Java 11 brought the module system, better GC options, and LTS guarantees. Migrating JUnit 3→5 in the same pass kept the upgrade coherent - one coordinated breaking-change window rather than two separate disruptions.\njunit upgrade helped in testing any particular test vs running all tests."
        },
        {
          "choice": "Ant → Maven for the build",
          "alternatives": "Stay on Ant, jump to Gradle",
          "reasoning": "Maven matched the rest of the LSEG Java estate. Dependency management, reproducible builds, and Jenkins integration with no special handling."
        },
        {
          "choice": "Rewrite the OMM encoder rather than patch it",
          "alternatives": "Incremental fixes",
          "reasoning": "Encoding logic produced downstream parsing complexity. A rewrite to a streamlined message path saved every downstream consumer parsing effort and gave a single place to apply performance tuning."
        },
        {
          "choice": "Stabilise reconnect state machine before tuning performance",
          "alternatives": "Tune first, fix correctness later",
          "reasoning": "Reconnect and failover were the dominant source of production incidents. Performance tuning a system that occasionally drops state would have hidden the wins behind incidents."
        }
      ]
    },
    "process": {
      "title": "How it happened.",
      "phases": [
        { "date": "Phase 1", "name": "Java 8 → 11",              "body": "Deprecated API audit, build script modernisation (Ant → Maven), module system migration, JUnit 3→5 upgrade, GC behaviour profiling." },
        { "date": "Phase 2", "name": "Connection management",     "body": "Revamped the TREP subscription state machine. Stabilised reconnect, failover, and partial-partition recovery. Measurable reduction in HA-failover downtime." },
        { "date": "Phase 3", "name": "OMM encode/decode rewrite", "body": "Replaced the legacy encoding path with a cleaner one across MarketPrice, MarketByOrder, MarketByPrice domains." },
        { "date": "Phase 4", "name": "Batch view redesign",       "body": "Grouped instrument request handling reworked for efficiency. Reduced redundant message fan-out to downstream consumers." },
        { "date": "Phase 5", "name": "JVM tuning",               "body": "Heap and GC profiled under sustained tick load. Targeted optimisations to flatten latency spikes." }
      ]
    },
    "tradeoffs": {
      "gained": "70% technical debt reduction. Measurable JVM startup and GC improvements. Stabilised reconnect flows reducing HA-failover downtime. Cleaner OMM downstream parsing for every consumer.",
      "gaveUp": "Long migration timeline that overlapped with active production traffic. Every change had to be backwards-compatible with downstream consumers across investment banks on independent release schedules."
    },
    "outcome": {
      "title": "Outcome.",
      "body": "<p>The Java edition continued to be the production market-data API for major investment banks throughout the migration. LSEG issued the three-year EOL notice for RFA 7.x in March 2023; the modernised codebase carried the platform through that EOL window and into customer migrations.</p>"
    },
    "links": []
  },

  'reuters-pts': {
    "slug": "reuters-pts",
    "overview": {
      "eyebrow": "§ VII - ENTERPRISE: REFINITIV",
      "title": "Refinitiv Post Trade Services",
      "shortTitle": "Reuters PTS",
      "lede": "FX and fixed-income post-trade processing on the LSEG MIT Post Trade Gateway. FIX gateway, APA gateway for MiFID II real-time trade reporting, XML adapters, Solace publishing. Led an 8–10 engineer delivery team.",
      "role": "Tech Lead · 8–10 engineer team",
      "period": "2017 - 2019",
      "stack": "Java, Spring, Hibernate, QuickFIX/J, XML adapters, Solace PubSub+, APA Gateway, Maven, Jenkins",
      "team": "8–10 engineers"
    },
    "metrics": [
      { "value": "8-10",    "label": "Engineers led" },
      { "value": "MiFID II","label": "Regulatory compliance" },
      { "value": "FIX",     "label": "Industry-standard protocol" }
    ],
    "problem": {
      "title": "The problem.",
      "body": "<p>Refinitiv Post Trade Services covers trade affirmation, confirmation matching, settlement instructions, SWIFT messaging, and MiFID II regulatory reporting across FX spot, forwards, swaps, NDFs, and options. The FX Post Trade API takes executed trades from the core venue and enriches them into Trade Confirmation Records (TCRs) per FIX standards.</p><p>The platform has to translate between internal PTS message formats and external counterparty/venue formats, route trade reports to APAs (Approved Publication Arrangements) under MiFID II, and distribute confirmed trade data, risk updates, and settlement events to downstream risk and OMS systems - all within tight regulatory windows.</p>"
    },
    "architecture": {
      "title": "Architecture.",
      "intro": "<p>Four delivery surfaces: the FIX gateway (in/outbound trade affirmation and confirmation), the APA gateway (MiFID II real-time reporting), XML adapters (counterparty format translation), and the Solace publishing gateway (event distribution to internal risk/PnL/OMS consumers).</p>",
      "diagram": "  Executed trade (core venue)\n        |\n   [Trade Confirmation Record assembly]\n        |\n   [FIX Gateway] -------> Counterparty / Trade repository\n        |\n   [APA Gateway (QuickFIX/J, OMM→FIX bridge)] --> APA (MiFID II)\n        |\n   [XML Adapters] -----> External counterparty formats\n        |\n   [Solace Publisher]\n        |\n        v\n   Internal consumers: PnL, risk engines, OMS",
      "outro": "<p>The APA gateway specifically: OMM-to-FIX bridge using QuickFIX/J, with ACKs/NACKs managed after conversion before FIX routing. Every transformation has to preserve auditability for MiFID II compliance.</p>"
    },
    "decisions": {
      "title": "Key decisions.",
      "items": [
        {
          "choice": "QuickFIX/J for the FIX surface",
          "alternatives": "Custom FIX implementation",
          "reasoning": "Industry-standard library, mature session management, broad counterparty interoperability. Custom FIX is a maintenance liability."
        },
        {
          "choice": "Solace for internal event distribution",
          "alternatives": "Kafka, ActiveMQ",
          "reasoning": "Guaranteed delivery, hierarchical topic structure, broad operational tooling. Already part of the LSEG estate so ops support was free."
        },
        {
          "choice": "Separate XML adapter layer per counterparty pattern",
          "alternatives": "Single canonical adapter",
          "reasoning": "Counterparty formats drift independently. Per-pattern adapters mean a counterparty change is isolated, not a cross-cutting modification."
        },
        {
          "choice": "Embedded code review + KT sessions as team discipline",
          "alternatives": "Ad-hoc reviews",
          "reasoning": "Regulatory reporting code cannot quietly diverge across team members. Regular reviews and KT sessions kept the team coherent on coding standards and on the MiFID II semantics that underpin the rules."
        }
      ]
    },
    "process": {
      "title": "How it happened.",
      "phases": [
        { "date": "Inbound FIX",    "name": "Trade affirmation/confirmation","body": "FIX gateway components for tag mapping, ACK handling, session config with counterparties." },
        { "date": "APA integration","name": "MiFID II real-time reporting",   "body": "Integrated and configured the APA gateway within the PTS regulatory reporting pipeline. OMM→FIX conversion via QuickFIX/J with explicit ACK/NACK handling." },
        { "date": "XML adapters",   "name": "Counterparty formats",           "body": "Built and maintained adapters for schema transformation, field mapping, and validation across multiple counterparty patterns." },
        { "date": "Solace",         "name": "Event distribution",             "body": "Solace publisher components for distributing post-trade events. Topic hierarchies, guaranteed delivery configuration, message schema alignment with downstream consumers." },
        { "date": "Team leadership","name": "8–10 engineers",                 "body": "Mentored the delivery team, aligned architecture with PM and regulatory requirements, ran code reviews and KT sessions, maintained coding standards." }
      ]
    },
    "tradeoffs": {
      "gained": "Stable FIX surface across counterparties. MiFID II APA reporting in production. Reliable internal event distribution via Solace. A coherent 8–10 engineer team aligned on the regulatory semantics that shape the codebase.",
      "gaveUp": "Regulatory work is unglamorous and unforgiving. Every change has to satisfy auditability and reporting deadlines, which limits how aggressively the platform can be refactored."
    },
    "outcome": {
      "title": "Outcome.",
      "body": "<p>The platform processed FX and fixed-income post-trade flows in production across multiple counterparty integrations, with MiFID II APA reporting and downstream event distribution operating to the regulatory windows the business required.</p>"
    },
    "links": []
  },

  'goldman-secdb': {
    "slug": "goldman-secdb",
    "overview": {
      "eyebrow": "§ VIII - ENTERPRISE: GOLDMAN SACHS",
      "title": "Bank Loan Servicing on SecDB",
      "shortTitle": "Goldman SecDB",
      "lede": "L2 operations and direct-database corrections on SecDB, Goldman's proprietary distributed object store and risk platform. Analyst desk support, backdated loan/settlement adjustments, Autosys feed monitoring, full audit-trail compliance.",
      "role": "Technology Analyst · Infosys engagement",
      "period": "2014 - 2016",
      "stack": "SecDB (proprietary), Slang (proprietary), Autosys (CA Workload Automation), Oracle, SQL",
      "team": "L2 ops embedded with analyst desk"
    },
    "metrics": [
      { "value": "13K+",  "label": "Daily SecDB users" },
      { "value": "200M+", "label": "Lines of code managed in SecDB" }
    ],
    "problem": {
      "title": "The problem.",
      "body": "<p>Goldman's bank loan servicing analysts use a desktop application to enter, manage, and process bank loan transactions. Loan entries occasionally come in with wrong amounts, mismatched settlement values, or data that needs correction after entry - sometimes backdated. When the standard application workflow could not correct the data, only direct SecDB intervention could, and only by someone who understood both SecDB object semantics and the audit-trail compliance expected of the corrections.</p><p>SecDB is Goldman's proprietary, object-oriented platform for pricing, risk management, and trade management - written in Slang, used by 3,000+ developers and 13,000+ daily end users, managing 200M+ lines of code and 160M+ daily jobs. It is not a relational database; it is a distributed object store with a dataflow/spreadsheet-style valuation engine.</p>"
    },
    "architecture": {
      "title": "Architecture.",
      "intro": "<p>Three operational surfaces: the analyst desk application (Slang-backed desktop UI used by frontend analysts), the SecDB object store (where corrections are applied), and Autosys (the enterprise job scheduler orchestrating loan-data feed jobs between upstream providers and SecDB).</p>",
      "diagram": "  Upstream loan-data providers\n        |\n   [Autosys job scheduler]\n        |   - EOD price feeds\n        |   - reconciliation\n        |   - reports\n        v\n   [Feed ingestion jobs] -----> SecDB object store\n                                      ^\n                                      |\n   Analyst desk app   ----------------+\n        |                              \n   [L2 ops: direct SecDB corrections, audit log]",
      "outro": "<p>Every direct DB correction goes through an audit trail: actor, timestamp, before/after state, justification, validation against expected position and cash-flow outputs.</p>"
    },
    "decisions": {
      "title": "Key decisions.",
      "items": [
        {
          "choice": "Direct SecDB corrections only when the application workflow can't",
          "alternatives": "Always use the application path",
          "reasoning": "The desk application is the safe default. Direct intervention is for cases where the desk workflow cannot reach the data (e.g. backdated adjustments that need to restate positions retroactively). Every direct correction is documented and audited."
        },
        {
          "choice": "Validate every correction against position and cash-flow outputs",
          "alternatives": "Trust that the SecDB write succeeded",
          "reasoning": "SecDB's dataflow engine recomputes downstream objects on write. Validating the corrected records against expected outputs is the way to know the fix is right - not just present."
        },
        {
          "choice": "Maintain a runbook for recurring feed failures",
          "alternatives": "Diagnose from scratch each time",
          "reasoning": "Feed failures fall into a few canonical buckets - format errors, connectivity failures, scheduling conflicts. A runbook turns repeat incidents into 10-minute fixes and stops the desk waiting on ops."
        }
      ]
    },
    "process": {
      "title": "How it happened.",
      "phases": [
        { "date": "Daily",          "name": "Analyst desk support",       "body": "Investigated loan-entry issues, classified as application-fix or DB-fix, executed the correct path." },
        { "date": "As needed",      "name": "Direct SecDB corrections",   "body": "Backdated loan amount, settlement, and value-date adjustments. Slang-based SecDB object updates. Audit-trail compliance on every fix." },
        { "date": "Continuous",     "name": "Autosys feed monitoring",    "body": "Tracked job execution status, triaged failures across the ingestion pipeline, maintained the recurring-failure runbook." },
        { "date": "When incidents hit","name": "Incident management",     "body": "Liaised between analyst desk (business), operations, and technology teams. Resolved within SLA windows." }
      ]
    },
    "tradeoffs": {
      "gained": "Direct access to one of finance's most distinctive platforms (SecDB). Deep operational understanding of a distributed object store, dataflow valuation engine, and Slang programming model. Audit-trail discipline applied to every change.",
      "gaveUp": "Slang and SecDB are proprietary - the skills don't port directly to other employers. The value was the operational discipline, the auditing rigour, and the comfort with a non-relational data model."
    },
    "outcome": {
      "title": "Outcome.",
      "body": "<p>Two years embedded in one of the most distinctive platforms in financial services. Learned that audit trails and validation against expected outputs are not bureaucratic overhead - they are how you know a fix is right. That discipline carried forward into every subsequent platform engagement.</p>"
    },
    "links": []
  },

  'sita-dcs': {
    "slug": "sita-dcs",
    "overview": {
      "eyebrow": "§ IX - ENTERPRISE: SITA",
      "title": "SITA Departure Control System",
      "shortTitle": "SITA DCS",
      "lede": "Airport operations for Malaysian airports - passenger upgrades/regrades, cargo weight distribution with aircraft centre-of-gravity enforcement, ground-staff desktop applications, 90%+ JUnit coverage, plus SOAP services for SITA's Subscriber Identity & Access Management.",
      "role": "Senior Engineer · Mindtree engagement",
      "period": "2011 - 2014",
      "stack": "Java, SOAP Web Services, WSDL, Swing, Oracle WebLogic, JMS, JUnit, SOAP UI",
      "team": "SITA delivery team"
    },
    "metrics": [
      { "value": "90%+", "label": "JUnit coverage" },
      { "value": "MY",   "label": "Malaysian airport coverage" }
    ],
    "problem": {
      "title": "The problem.",
      "body": "<p>SITA's Departure Control System runs the check-in, boarding, and load-distribution operations for participating airports. For Malaysian airports the work covered three surfaces: passenger upgrade flows (Economy → Business, gate-side reassignments, VIP handling, overbooking), cargo weight distribution algorithms that compute weights across hold compartments and enforce aircraft centre-of-gravity rules, and the ground-operations desktop applications used by airport staff.</p><p>A parallel SITA platform, SIAM (Subscriber Identity & Access Management), needed SOAP services for identity and access management with high test coverage and full SOAP UI test automation.</p>"
    },
    "architecture": {
      "title": "Architecture.",
      "intro": "<p>DCS sits between airline passenger reservation systems, baggage handling, and the aircraft load-planning systems. SOAP web services expose passenger and load operations to airline staff applications. Swing desktop apps give ground staff direct access for upgrades, gate reassignments, and last-minute load updates. WebLogic + JMS handles the asynchronous orchestration.</p>",
      "diagram": "  Airline reservations    Baggage handling    Load planning\n        \\                  |                  /\n         \\                 |                 /\n          [SOAP Web Services]   ----WSDL----   [Swing ground-ops app]\n                  |\n          [Oracle WebLogic + JMS queues]\n                  |\n          [Departure Control System core]\n                  |\n          [Cargo weight + CG algorithm]\n                  |\n                  v\n          Aircraft load plan",
      "outro": "<p>The cargo weight algorithm computes compartment-by-compartment weights including passenger, baggage, and cargo streams, then enforces CG rules. Edge cases - cargo reshuffle mid-process, last-minute weight updates before departure - drove much of the complexity.</p>"
    },
    "decisions": {
      "title": "Key decisions.",
      "items": [
        {
          "choice": "Embedded business rules inside upgrade-eligibility checks",
          "alternatives": "",
          "reasoning": "Volume and frequency of rule changes didn't justify the operational overhead of a separate rules engine. WSDL contracts kept the eligibility surface stable for client apps."
        },
        {
          "choice": "Swing desktop over web for ground operations",
          "alternatives": "Web client",
          "reasoning": "Airport ground-staff workstations were locked-down, often offline-tolerant, and required fast keyboard-driven workflows. Swing fit the operational environment better than browsers."
        },
        {
          "choice": "90%+ JUnit coverage as the SIAM delivery bar",
          "alternatives": "Standard coverage, manual QA",
          "reasoning": "Identity and access services break things invisibly when wrong. High unit-test coverage plus SOAP UI integration testing was the cheapest insurance against regression."
        }
      ]
    },
    "process": {
      "title": "How it happened.",
      "phases": [
        { "date": "DCS - check-in", "name": "Upgrade flows",               "body": "SOAP APIs for upgrade eligibility, WSDL contracts, business rules for VIP/overbooking/gate reassignment. Swing screens for ground-side workflows." },
        { "date": "DCS - load",     "name": "Cargo weight distribution",   "body": "Algorithms to compute weight across hold compartments, enforce CG rules, integrate passenger/baggage/cargo streams. Edge cases for mid-process reshuffle and pre-departure updates." },
        { "date": "DCS - infra",    "name": "WebLogic + JMS",              "body": "Configured and maintained WebLogic clusters and JMS queues for high availability." },
        { "date": "SIAM",           "name": "Identity SOAP services",      "body": "Developed SOAP web services for identity and access management. JUnit coverage 90%+. SOAP UI integration tests." }
      ]
    },
    "tradeoffs": {
      "gained": "Production-grade SOAP/WSDL surface area, real-time load-planning algorithms with safety-critical CG enforcement, a high-coverage SIAM SOAP service, and the operational discipline of running ground-airport infrastructure where downtime is measured in delayed flights.",
      "gaveUp": "SOAP/WSDL skills aged faster than expected as the industry moved to REST and gRPC. The deeper value - safety-critical algorithmic correctness and high-coverage testing - aged well."
    },
    "outcome": {
      "title": "Outcome.",
      "body": "<p>Departure Control operations and SIAM identity services delivered for SITA. The earliest large-scale engagement in a 13+ year arc - and the place the testing-discipline habit started.</p>"
    },
    "links": []
  },
};

export const fallbackSite = {
  "brand": {
    "name": "Akash S K",
    "mark": "A·S",
    "url": "akashreya.space",
    "tagline": "Staff engineer building productivity multiplier tools and decisioning systems."
  },
  "hero": {
    "eyebrow": "STAFF ENGINEER · FICO WORLD 2026",
    "nameFirst": "Akash",
    "nameLast": " S K",
    "title": "Staff engineer building productivity multiplier tools and decisioning systems.",
    "thesis": "AI generates fast. Validation is where the engineering lives. Anything repeatable is AI-automatable.",
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
  "liveBanner": {
    "label": "LIVE · FICO WORLD 2026",
    "title": "Decision Intelligence for eCommerce",
    "sub": "First place at the FICO GSI Partner Hackathon 2026. Showcased at FICO World, Orlando.",
    "badgeBig": "1",
    "badgeSmall": "st",
    "badgeLabel": "Place"
  },
  "principles": {
    "quote": {
      "pre": "The best work doesn't make individuals faster. It eliminates entire",
      "strong": "categories of work",
      "post": "."
    },
    "items": [
      { "n": "01", "body": "Raised to respect others and value time" },
      { "n": "02", "body": "Design the brief before the tool opens. Every feature that ships exists because someone's time was worth defending." },
      { "n": "03", "body": "Anything repeatable is AI-automatable. The interesting question isn't whether to automate - it's which category of work to eliminate next." },
      { "n": "04", "body": "I've always believed that how you work matters just as much as what you deliver." }
    ]
  },
  "enterprise": [
    {
      "client": "Tech Mahindra · contracted to FICO",
      "role": "Tech Lead · Technical Advisor",
      "period": "Oct 2016 - Present",
      "desc": "Decisioning platforms, productivity multiplier tools, FICO Customer Communications. Led LSEG RFA Java migration and Refinitiv PTS delivery. 1st place FICO GSI Hackathon 2026.",
      "tags": ["fico-dmp", "java", "spring", "claude-code", "playwright-mcp"]
    },
    {
      "client": "Infosys · Goldman Sachs",
      "role": "Technology Analyst · Bank Loan Servicing",
      "period": "Sep 2014 - Sep 2016",
      "desc": "Direct corrections in SecDB, Goldman's proprietary distributed object store\nBackdated loan and settlement adjustments\nAutosys feed monitoring, audit trail compliance.",
      "tags": ["secdb", "slang", "autosys", "oracle"]
    },
    {
      "client": "Mindtree · SITA",
      "role": "Senior Engineer · Departure Control + SIAM",
      "period": "Aug 2011 - Sep 2014",
      "desc": "SOAP APIs for passenger upgrades, cargo weight algorithms enforcing aircraft CG rules, Oracle WebLogic + JMS HA, 90%+ JUnit coverage on SIAM identity services.",
      "tags": ["java", "soap", "wsdl", "weblogic", "jms"]
    }
  ],
  "nav": [
    { "id": "work",       "num": "I",   "name": "Work",       "target": "hero" },
    { "id": "live",       "num": "II",  "name": "Live",       "target": "live" },
    { "id": "projects",   "num": "III", "name": "Projects",   "target": "projects" },
    { "id": "principles", "num": "IV",  "name": "Principles", "target": "principles" },
    { "id": "enterprise", "num": "V",   "name": "Enterprise", "target": "enterprise" },
    { "id": "contact",    "num": "VI",  "name": "Contact",    "target": "footer" }
  ],
  "contact": {
    "email": "akashakashreya@gmail.com",
    "socials": [
      { "label": "github",   "href": "https://github.com/akashreya" },
      { "label": "linkedin", "href": "https://www.linkedin.com/in/akash-s-kantharaj/" },
      { "label": "email",    "href": "mailto:akashakashreya@gmail.com" }
    ]
  },
  "sections": {
    "projects":   { "num": "III",   "title": "Selected work." },
    "sidequests": { "num": "III·b", "title": "" },
    "principles": { "num": "IV",    "title": "How I build." },
    "enterprise": { "num": "V",     "title": "Enterprise Work.", "collapsed": "" }
  }
};

export const fallbackSiteRecruiter = fallbackSite;

export const fallbackSitePersonal = {
  brand: {
    name: 'akash',
    mark: 'A·S',
    url: 'akashreya.space',
    tagline: 'Builds things. Finishes them. Has opinions about fonts.',
    where: 'Bengaluru · IST',
  },
  hero: {
    eyebrow: 'Engineer · Builder · 9 projects in 2025',
    nameFirst: 'akash',
    nameLast: 's k.',
    title: 'builds things. finishes them. has opinions about fonts.',
    thesis: 'Raised to respect others and value time. Build it beautifully. Or don\'t build it.',
    stats: [
      { value: '9',    label: 'Projects, 2025' },
      { value: '10K+', label: 'Families' },
      { value: '0',    label: 'Shipped ugly' },
      { value: '3',    label: 'Books' },
    ],
    ctas: [
      { label: 'See the work',   href: '#projects',   primary: true },
      { label: 'What I\'m into', href: '#sidequests', primary: false },
    ],
  },
  liveBanner: {
    label: 'FICO WORLD 2026 · ORLANDO',
    title: 'COD/RTO Intelligence Platform',
    sub:   'First place, FICO GSI Partner Hackathon. Demoed at FICO World while I was in Bengaluru. The platform ran. That was kind of the point.',
    badgeBig: '1',
    badgeSmall: 'st',
    badgeLabel: '✦',
  },
  principles: {
    quote: {
      pre:    'Why build it at all if you\'re',
      strong: 'not going to do it properly',
      post:   '?',
    },
    items: [
      { n: '01', title: 'Time is the one thing you can\'t get back.', body: 'Every sticky nav, every search bar, every keyboard shortcut is the same idea at a different layer. The diff tool wasn\'t efficiency. It was reclamation.' },
      { n: '02', title: 'Give the right signal to the right people.', body: 'I give you the node. You find the edges. If you don\'t ask the follow-up question, that\'s information too.' },
      { n: '03', title: 'AI earns its place at the unbounded state space.', body: 'Everything before that is just orchestration. Knowing the difference is the whole job.' },
      { n: '04', title: 'Build it properly or don\'t build it.', body: 'POKÉTOPIA has official fonts, a complete design system, and WCAG indicators. Nobody asked for any of that. That\'s not the point.' },
    ],
  },
  contact: {
    email: 'hello@akashreya.space',
    socials: [
      { label: 'github',   href: 'https://github.com/akashreya' },
      { label: 'linkedin', href: 'https://www.linkedin.com/in/akash-kantharaj-68526a3a' },
      { label: 'email',    href: 'mailto:hello@akashreya.space' },
    ],
  },
  // nav and enterprise are voice-neutral, so mirror the recruiter fallback
  // rather than duplicating it (avoids drift; see portfolio-architecture-contract §6 #2).
  nav: fallbackSite.nav,
  enterprise: fallbackSite.enterprise,
  sections: {
    projects:   { num: 'III',   title: 'things i made.' },
    sidequests: { num: 'III·b', title: 'obsessions.' },
    principles: { num: 'IV',    title: 'rules.' },
    enterprise: { num: 'V',     title: '9 to 5', collapsed: '15y · enterprise, decisioning, telecom · the long story' },
  },
};

export const fallbackProjects = [
  {
    id: 1,
    slug: "fico-cod-rto",
    kind: "win",
    eyebrow: "WIN",
    title: "Decision Intelligence for eCommerce",
    desc: "Real-time e-commerce order risk decisioning on FICO Decision Management Platform. 85 rules, 8 data signals, 4 decisions in under 200ms. First place at the FICO GSI Partner Hackathon 2026, now showcased at FICO World, Orlando.",
    metrics: [
      { value: "#1",    label: "FICO GSI Hackathon" },
      { value: "85",    label: "decision rules" },
      { value: "<200ms",label: "decision latency" },
      { value: "8",     label: "data signals" }
    ],
    tags: ["fico-decision-modeler", "wsdl", "claude-code", "fico-process-designer", "xslt", "REST API", "groovy", "plor", "fico-dmp", "fico-process-execution", "java", "daas"],
    span: "wide",
    year: "2026",
    hasCaseStudy: true,
    displayOrder: 1,
    projectType: "BACKEND",
    githubUrl: "",
    liveDemoUrl: "https://codrtohackathondemo.vercel.app/"
  },
  {
    id: 4,
    slug: "everythingabc",
    kind: "live",
    eyebrow: "LIVE",
    title: "Everything ABC",
    desc: "Solo, AI-assisted full-stack vocabulary learning platform. Custom CMS, S3 image pipeline, 4-suite regression framework. 1,300+ items across multiple categories.",
    metrics: [
      { value: "1300+", label: "items" },
      { value: "99.2%", label: "API payload reduction" }
    ],
    tags: ["docker", "bull", "cloudfront", "aws-s3", "node", "mongodb", "react", "express", "vite", "redis"],
    span: "half",
    year: "2025",
    hasCaseStudy: true,
    displayOrder: 2,
    projectType: "FULLSTACK",
    githubUrl: "",
    liveDemoUrl: "https://everythingabc.com"
  },
  {
    id: 5,
    slug: "poketopia",
    kind: "live",
    eyebrow: "LIVE",
    title: "Poketopia",
    desc: "Pokemon encyclopedia and daily Wordle-style guessing game. React 18, TypeScript, type-themed gradients, animations, keyboard parity, swipe navigation, and full accessibility.",
    metrics: [
      { value: "~500", label: "users" },
      { value: "1025", label: "Pokemon" },
      { value: "10",   label: "compared attributes" },
      { value: "11",   label: "GA4 events" }
    ],
    tags: ["framer-motion", "typescript", "radix-ui", "tailwind", "react", "jest", "vite"],
    span: "half",
    year: "2025",
    hasCaseStudy: true,
    displayOrder: 3,
    projectType: "FRONTEND",
    githubUrl: "",
    liveDemoUrl: "https://pokemon.akashreya.space"
  },
  {
    id: 2,
    slug: "fico-ivr-simulator",
    kind: "tool",
    eyebrow: "TOOL",
    title: "FICO IVR Workflow Testing Platform",
    desc: "Local simulation platform that replaces phone-based IVR QA with millisecond execution. Validates every reachable path through a fraud-workflow before deployment.",
    metrics: [
      { value: "2651", label: "nodes validated" },
      { value: "35",   label: "node types" }
    ],
    tags: ["claude-code"],
    span: "narrow",
    year: "2026",
    hasCaseStudy: true,
    displayOrder: 4,
    projectType: "BACKEND",
    githubUrl: "",
    liveDemoUrl: ""
  },
  {
    id: 6,
    slug: "lseg-rfa",
    kind: "enterprise",
    eyebrow: "ENT",
    title: "LSEG Robust Foundation API - Java Edition",
    desc: "Enterprise real-time market data API serving investment banks, hedge funds, and asset managers. Led Java 7→8→11 migration, OMM encoding rewrite, RFA-TREP connection layer stabilisation, and JVM performance tuning.",
    metrics: [
      { value: "7.3M/s", label: "price updates" },
      { value: "90M",    label: "instruments" },
      { value: "70%",    label: "tech debt reduction" }
    ],
    tags: ["treprtds", "rfa-sdk", "spring", "java-11", "maven", "hibernate", "omm"],
    span: "wide",
    year: "2019-2025",
    hasCaseStudy: true,
    displayOrder: 5,
    projectType: "BACKEND",
    githubUrl: "",
    liveDemoUrl: ""
  },
  {
    id: 7,
    slug: "reuters-pts",
    kind: "enterprise",
    eyebrow: "ENT",
    title: "Refinitiv Post Trade Services",
    desc: "FX and fixed-income post-trade processing. FIX gateway, APA gateway for MiFID II, XML adapters, Solace publisher. Led an 8–10 engineer delivery team.",
    metrics: [
      { value: "8-10",    label: "engineers led" },
      { value: "MiFID II",label: "compliance" },
      { value: "FIX",     label: "industry protocol" }
    ],
    tags: ["spring", "solace", "quickfix-j", "hibernate", "xml", "java"],
    span: "narrow",
    year: "2017-2019",
    hasCaseStudy: true,
    displayOrder: 6,
    projectType: "BACKEND",
    githubUrl: "",
    liveDemoUrl: ""
  },
  {
    id: 8,
    slug: "goldman-secdb",
    kind: "enterprise",
    eyebrow: "ENT",
    title: "Goldman Sachs - Bank Loan Servicing",
    desc: "L2 operations on SecDB, Goldman's proprietary object store. Analyst desk support, direct SecDB object corrections, backdated loan/settlement adjustments, Autosys feed monitoring with full audit-trail compliance.",
    metrics: [
      { value: "13K+",  label: "daily SecDB users" },
      { value: "160M+", label: "daily jobs" },
      { value: "200M+", label: "LOC managed" }
    ],
    tags: ["autosys", "secdb", "oracle", "slang", "sql"],
    span: "half",
    year: "2014-2016",
    hasCaseStudy: true,
    displayOrder: 7,
    projectType: "BACKEND",
    githubUrl: "",
    liveDemoUrl: ""
  },
  {
    id: 9,
    slug: "sita-dcs",
    kind: "enterprise",
    eyebrow: "ENT",
    title: "SITA Departure Control System",
    desc: "Airport operations for Malaysian airports. SOAP APIs for passenger upgrade/regrade flows, cargo weight distribution algorithms enforcing aircraft CG rules, Swing desktop apps for ground staff, 90%+ JUnit coverage.",
    metrics: [
      { value: "90%+", label: "test coverage" },
      { value: "CG",   label: "rules enforced" },
      { value: "MY",   label: "airport coverage" }
    ],
    tags: ["soap", "wsdl", "jms", "junit", "swing", "weblogic", "java"],
    span: "half",
    year: "2011-2014",
    hasCaseStudy: true,
    displayOrder: 8,
    projectType: "BACKEND",
    githubUrl: "",
    liveDemoUrl: ""
  }
];

export const fallbackMentions = [
  {
    id: 1,
    kind: "talk",
    badge: "CONFERENCE SHOWCASE",
    date: "May 2026",
    quote: "The COD/RTO Optimization Platform is being showcased at FICO World 2026 - first place at the FICO GSI Partner Hackathon. 85 decision rules, 8 data signals, 4 decisions in under 200ms.",
    authorName: "FICO World 2026",
    authorRole: "Orlando · May 20, 2026",
    authorInitials: "FW",
    link: "https://www.linkedin.com/feed/update/urn:li:share:7458164794626322432/"
  },
  {
    id: 2,
    kind: "press",
    badge: "PRESS",
    date: "May 2026",
    quote: "Tech Mahindra at FICO World 2026: The Next-Gen Solution to Tackle E-Commerce Losses. Solution Demo, Demo Theater, May 20, 2026, 2:40-2:55 PM ET.",
    authorName: "Tech Mahindra",
    authorRole: "FICO World 2026 · Demo Theater, May 20",
    authorInitials: "TM",
    link: "https://www.techmahindra.com/insights/events/tech-mahindra-sponsor-fico-world-26/"
  },
  {
    id: 3,
    kind: "rec",
    badge: "JUDGES' Q",
    date: "Mar 2026",
    quote: "When are you taking this to e-commerce and marketing it?",
    authorName: "FICO GSI Hackathon Judges",
    authorRole: "After the COD/RTO demo · March 26, 2026",
    authorInitials: "FJ",
    link: ""
  },
  {
    id: 4,
    kind: "post",
    badge: "LINKEDIN POST",
    date: "Apr 2026",
    quote: "The platform doesn't care what industry you're in. E-commerce risk today. Healthcare decisioning tomorrow. Loan origination the day after. The industry changes. The rules change. The reasoning engine doesn't.",
    authorName: "Akash S K",
    authorRole: "Staff Engineer · LinkedIn",
    authorInitials: "AK",
    link: "https://www.linkedin.com/in/akash-kantharaj-68526a3a"
  }
];

// Static mirrors of /api/sidequests and /api/ticker (seeded 2026-07-11).
// Shapes match the normalized fetch output: sidequests carry a pre-built
// `proj` display string; ticker is plain strings in displayOrder.
// The API's `emoji` field is ignored — the board renders no emotes.
export const fallbackSideQuests = [
  { id: "hotwater",   pos: "bl",     title: "Hot Water",                     body: "Not coffee. Not tea. Just hot water. 06:30 every day. This is not a phase.", proj: null },
  { id: "time",       pos: "center", title: "Time · Craft · Intentionality", body: "Every project here exists because having fun is the point. Not shipping. Fun.", proj: null },
  { id: "pokemon",    pos: "tl",     title: "Pokémon",                       body: "Nine regions. Every type. The Lunatone/Solrock toggle exists because thematic integrity matters.", proj: "→ poketopia" },
  { id: "blackqueen", pos: "r",      title: "Black Queen",                   body: "Built a card-game because I loved playing it.", proj: null },
  { id: "fiction",    pos: "tr",     title: "Fiction",                       body: "Wrote two novels. Neither is finished. Nobody asked for it.", proj: null },
  { id: "games",      pos: "l",      title: "Playstation games",             body: "The Last of us is the best game. Don't argue with me and Ellie is love.", proj: null },
  { id: "shreya",     pos: "br",     title: "Shreya Ghoshal",                body: "Devdas to Kalyani. I have heard it all.", proj: null }
];

export const fallbackTicker = [
  "Everything ABC: 1300+ items. Multiple categories, Visual A to Z.",
  "Built POKÉTOPIA solo. Nine regions. Lunatone/Solrock toggle was necessary. Thematic integrity.",
  "Hot water. Not coffee. This is not a debate.",
  "Three books in 2025. Did not announce them. They exist anyway.",
  "The diff tool: 4.5 hours → 30 seconds. Planning to put it on PyPI one day. Still no README",
  "Won the FICO hackathon. Was in Bengaluru when they demoed it. The thing ran.",
  "Builds things. Finishes them. Has opinions about fonts.",
  "Engineer. 15 years. Still writes code.",
  "The point is to be so thorough that Evaluator doesn't matter."
];
