import axiosInstance from './axios';
import { fallbackSite, fallbackProjects, fallbackMentions, fallbackSiteRecruiter, fallbackSitePersonal, fallbackCaseStudies } from '../data/fallback';

function normalizeProject(p) {
  const rawDesc = p.shortDescription ?? p.desc ?? '';
  return {
    ...p,
    kind: p.kind?.toLowerCase(),
    span: p.span?.toLowerCase(),
    desc: pickVoice(rawDesc, 'recruiter'),
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
function pickVoice(field, mode) {
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

export async function fetchSite() {
  try {
    const res = await axiosInstance.get('/api/site', { withCredentials: false });
    return res.data ?? null;
  } catch {
    console.warn('GET /api/site failed, using fallback');
    return null;
  }
}

export async function fetchProjects() {
  try {
    const res = await axiosInstance.get('/api/projects', { withCredentials: false });
    const data = res.data;
    if (!Array.isArray(data) || data.length === 0) return fallbackProjects;
    return data.map(normalizeProject);
  } catch {
    console.warn('GET /api/projects failed, using fallback');
    return fallbackProjects;
  }
}

export async function fetchCaseStudy(slug) {
  try {
    const res = await axiosInstance.get(`/api/projects/${slug}`, { withCredentials: false });
    return { data: res.data, notFound: false };
  } catch (err) {
    if (err.response?.status === 404) return { data: null, notFound: true };
    console.warn(`GET /api/projects/${slug} failed, using fallback`);
    const fallback = fallbackCaseStudies[slug];
    return { data: fallback ?? null, notFound: !fallback };
  }
}

export async function fetchMentions() {
  try {
    const res = await axiosInstance.get('/api/mentions', { withCredentials: false });
    const data = res.data;
    if (!Array.isArray(data) || data.length === 0) return fallbackMentions;
    return data.map(normalizeMention);
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
