import axiosInstance from './axios';
import { fallbackProjects, fallbackMentions, fallbackSiteRecruiter, fallbackSitePersonal, fallbackCaseStudies, fallbackSideQuests, fallbackTicker } from '../data/fallback';

function normalizeProject(p) {
  const rawDesc = p.shortDescription ?? p.desc ?? '';
  return {
    ...p,
    kind: p.kind?.toLowerCase(),
    span: p.span?.toLowerCase(),
    // Keep the raw (possibly {recruiter, personal}) value — resolved per-mode at render
    // by the consuming component via pickVoice, not hard-pinned here.
    desc: rawDesc,
    tags: Array.isArray(p.technologies)
      ? p.technologies.map(t => t.name)
      : (p.tags ?? []),
  };
}

function normalizeMention(m) {
  return { ...m, kind: m.kind?.toLowerCase() };
}

// Resolve a "voiced" field: {recruiter: T, personal: T} → T for the given mode.
// Flat values (strings, arrays, plain objects without recruiter/personal) pass through unchanged.
export function pickVoice(field, mode) {
  if (
    field !== null &&
    field !== undefined &&
    typeof field === 'object' &&
    !Array.isArray(field) &&
    ('recruiter' in field || 'personal' in field)
  ) {
    return field[mode] ?? field.recruiter ?? field.personal;
  }
  return field;
}

const TTL_LANDING = 10 * 60 * 1000;  // main-page bundle: site + projects grid
const TTL_CLICK = 5 * 60 * 1000;     // click-through pages: case study, mentions

const _cache = new Map(); // key -> { value, expiresAt }

async function withCache(key, ttlMs, producer) {
  const hit = _cache.get(key);
  if (hit && hit.expiresAt > performance.now()) return hit.value;
  const value = await producer();
  _cache.set(key, { value, expiresAt: performance.now() + ttlMs });
  return value;
}

export async function fetchSite() {
  try {
    return await withCache('site', TTL_LANDING, async () => {
      const res = await axiosInstance.get('/api/site', { withCredentials: false });
      return res.data ?? null;
    });
  } catch {
    console.warn('GET /api/site failed, using fallback');
    return null;
  }
}

export async function fetchProjects() {
  try {
    return await withCache('projects', TTL_LANDING, async () => {
      const data = (await axiosInstance.get('/api/projects', { withCredentials: false })).data;
      if (!Array.isArray(data) || data.length === 0) throw new Error('empty projects response');
      return data.map(normalizeProject);
    });
  } catch {
    console.warn('GET /api/projects failed, using fallback');
    return fallbackProjects;
  }
}

function isVoicedWrapper(field) {
  return (
    field !== null &&
    field !== undefined &&
    typeof field === 'object' &&
    !Array.isArray(field) &&
    ('recruiter' in field || 'personal' in field)
  );
}

// Recursively unwraps any {recruiter, personal} node anywhere in the tree,
// so rendering is safe regardless of which fields the backend chooses to voice.
function deepResolveVoice(node, mode) {
  if (isVoicedWrapper(node)) return pickVoice(node, mode);
  if (Array.isArray(node)) return node.map(item => deepResolveVoice(item, mode));
  if (node !== null && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node).map(([key, value]) => [key, deepResolveVoice(value, mode)])
    );
  }
  return node;
}

// API_HANDOVER_v3.2: the pre-v3.2 shape (six fixed top-level fields, still what
// fallback.js and any un-migrated backend row use) mapped onto the v3.2 sections[]
// discriminated-union shape, so the renderer only ever has to know one shape.
const LEGACY_SECTION_MAP = [
  { key: 'problem', type: 'prose', num: '01' },
  { key: 'architecture', type: 'diagram', num: '02' },
  { key: 'decisions', type: 'decisions', num: '03' },
  { key: 'process', type: 'timeline', num: '04' },
  { key: 'tradeoffs', type: 'tradeoffs', num: '05' },
  { key: 'outcome', type: 'prose', num: '06' },
];

function synthesizeSections(data) {
  const sections = [];
  for (const { key, type, num } of LEGACY_SECTION_MAP) {
    const src = data[key];
    if (!src) continue;
    const id = key;
    if (type === 'prose') {
      sections.push({ id, type, num, title: src.title, body: src.body });
    } else if (type === 'diagram') {
      sections.push({ id, type, num, title: src.title, intro: src.intro, diagram: src.diagram, outro: src.outro });
    } else if (type === 'decisions') {
      sections.push({
        id, type, num,
        title: src.title,
        choiceLabel: 'Choice',
        alternativesLabel: 'Alternatives',
        reasoningLabel: 'Reasoning',
        items: src.items ?? [],
      });
    } else if (type === 'timeline') {
      sections.push({ id, type, num, title: src.title, phases: src.phases ?? [] });
    } else if (type === 'tradeoffs') {
      sections.push({
        id, type, num,
        title: src.title || 'Trade-offs.',
        gainedLabel: 'What we gained',
        gaveUpLabel: 'What we gave up',
        gained: src.gained,
        gaveUp: src.gaveUp,
      });
    }
  }
  return sections;
}

function synthesizeNav(sections) {
  return sections.map(s => ({ id: s.id, num: s.num, name: s.title, target: s.id }));
}

// Collapses the v3.2 payload (nav + sections[], plus the temporary legacy mirror)
// or a pre-v3.2 payload (six fixed fields, e.g. fallback.js) onto one canonical
// shape: { slug, overview, metrics, nav, sections, links }. The six mirrored
// fields are dropped here — never carried past this point — so nothing downstream
// can accidentally read them; that's what makes it safe to tell the backend the
// mirror is unread (API_HANDOVER_v3.2 migration step 3).
function upgradeCaseStudy(data) {
  if (!data) return data;
  const hasSections = Array.isArray(data.sections) && data.sections.length > 0;
  const sections = hasSections ? data.sections : synthesizeSections(data);
  const nav = Array.isArray(data.nav) && data.nav.length > 0 ? data.nav : synthesizeNav(sections);
  return { slug: data.slug, overview: data.overview, metrics: data.metrics, nav, sections, links: data.links };
}

function normalizeCaseStudy(data, mode) {
  return data ? upgradeCaseStudy(deepResolveVoice(data, mode)) : data;
}

export async function fetchCaseStudy(slug, mode = 'recruiter') {
  try {
    return await withCache(`case:${slug}:${mode}`, TTL_CLICK, async () => {
      try {
        const res = await axiosInstance.get(`/api/projects/${slug}`, { withCredentials: false });
        // raw is the untouched API payload (voiced wrappers, legacy mirror, all intact) — kept
        // separately from the voice-resolved+upgraded `data` so ServiceInspector can show the
        // real response while the renderer only ever sees the canonical nav+sections shape.
        return { data: normalizeCaseStudy(res.data, mode), raw: res.data, notFound: false };
      } catch (err) {
        if (err.response?.status === 404) return { data: null, raw: null, notFound: true };
        throw err;
      }
    });
  } catch {
    console.warn(`GET /api/projects/${slug} failed, using fallback`);
    const fallback = fallbackCaseStudies[slug];
    // raw stays null on fallback — it isn't a real API response, so callers must not present it as one.
    return { data: normalizeCaseStudy(fallback, mode), raw: null, notFound: !fallback };
  }
}

function normalizeSideQuest(q) {
  return { ...q, proj: q.projectRef ? `→ ${q.projectRef}` : null };
}

// Sidequests/ticker fields are flat per API_HANDOVER_v3 §5-6; if the backend
// ever voices them, route through deepResolveVoice and mode-key the cache.
export async function fetchSideQuests() {
  try {
    return await withCache('sidequests', TTL_LANDING, async () => {
      const data = (await axiosInstance.get('/api/sidequests', { withCredentials: false })).data;
      if (!Array.isArray(data) || data.length === 0) throw new Error('empty sidequests response');
      return [...data].sort((a, b) => a.displayOrder - b.displayOrder).map(normalizeSideQuest);
    });
  } catch {
    console.warn('GET /api/sidequests failed, using fallback');
    return fallbackSideQuests;
  }
}

export async function fetchTicker() {
  try {
    return await withCache('ticker', TTL_LANDING, async () => {
      const data = (await axiosInstance.get('/api/ticker', { withCredentials: false })).data;
      if (!Array.isArray(data) || data.length === 0) throw new Error('empty ticker response');
      return [...data].sort((a, b) => a.displayOrder - b.displayOrder).map(t => t.text);
    });
  } catch {
    console.warn('GET /api/ticker failed, using fallback');
    return fallbackTicker;
  }
}

export async function fetchMentions() {
  try {
    return await withCache('mentions', TTL_CLICK, async () => {
      const data = (await axiosInstance.get('/api/mentions', { withCredentials: false })).data;
      if (!Array.isArray(data) || data.length === 0) throw new Error('empty mentions response');
      return data.map(normalizeMention);
    });
  } catch {
    console.warn('GET /api/mentions failed, using fallback');
    return fallbackMentions;
  }
}

// Section headings: empty-string voices mean "unseeded", so || (not ??) lets
// them fall through to the fallback string — no heading can render blank.
function resolveSections(apiSections, mode, fbSections) {
  const out = {};
  for (const key of ['projects', 'sidequests', 'principles', 'enterprise']) {
    const api = apiSections?.[key];
    const fb = fbSections?.[key] ?? {};
    out[key] = {
      num: api?.num || fb.num,
      title: pickVoice(api?.title, mode) || fb.title,
      collapsed: pickVoice(api?.collapsed, mode) || fb.collapsed,
    };
  }
  return out;
}

export function resolveVoice(siteData, mode) {
  const fallback = mode === 'personal' ? fallbackSitePersonal : fallbackSiteRecruiter;
  if (!siteData) return fallback;

  // v3: top-level recruiter/personal split
  if (siteData.recruiter && siteData.personal) {
    return { ...fallback, ...(siteData[mode] ?? {}) };
  }

  // v2: per-field {recruiter, personal} wrappers — resolve each field by mode
  return {
    brand: siteData.brand ? {
      ...siteData.brand,
      tagline: pickVoice(siteData.brand.tagline, mode) ?? fallback.brand?.tagline,
    } : fallback.brand,
    hero: pickVoice(siteData.hero, mode) ?? fallback.hero,
    liveBanner: pickVoice(siteData.liveBanner, mode) ?? fallback.liveBanner,
    principles: pickVoice(siteData.principles, mode) ?? fallback.principles,
    nav: pickVoice(siteData.nav, mode) ?? fallback.nav,
    enterprise: siteData.enterprise ?? fallback.enterprise,
    contact: siteData.contact ?? fallback.contact,
    sections: resolveSections(siteData.sections, mode, fallback.sections),
  };
}
