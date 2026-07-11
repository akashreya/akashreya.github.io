import axiosInstance from './axios';
import { fallbackSite, fallbackProjects, fallbackMentions, fallbackSiteRecruiter, fallbackSitePersonal, fallbackCaseStudies } from '../data/fallback';

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

function normalizeCaseStudy(data, mode) {
  return data ? deepResolveVoice(data, mode) : data;
}

export async function fetchCaseStudy(slug, mode = 'recruiter') {
  try {
    return await withCache(`case:${slug}:${mode}`, TTL_CLICK, async () => {
      try {
        const res = await axiosInstance.get(`/api/projects/${slug}`, { withCredentials: false });
        return { data: normalizeCaseStudy(res.data, mode), notFound: false };
      } catch (err) {
        if (err.response?.status === 404) return { data: null, notFound: true };
        throw err;
      }
    });
  } catch {
    console.warn(`GET /api/projects/${slug} failed, using fallback`);
    const fallback = fallbackCaseStudies[slug];
    return { data: fallback ?? null, notFound: !fallback };
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
  };
}
