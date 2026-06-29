import axiosInstance from './axios';
import { fallbackSite, fallbackProjects, fallbackMentions, fallbackSiteRecruiter, fallbackSitePersonal, fallbackCaseStudies } from '../data/fallback';

function normalizeProject(p) {
  return {
    ...p,
    kind: p.kind?.toLowerCase(),
    span: p.span?.toLowerCase(),
    desc: p.shortDescription ?? p.desc ?? '',
    tags: Array.isArray(p.technologies)
      ? p.technologies.map(t => t.name)
      : (p.tags ?? []),
  };
}

function normalizeMention(m) {
  return { ...m, kind: m.kind?.toLowerCase() };
}

export async function fetchSite() {
  try {
    const res = await axiosInstance.get('/api/site', { withCredentials: false });
    return res.data;
  } catch {
    console.warn('GET /api/site failed, using fallback');
    return { recruiter: fallbackSiteRecruiter, personal: fallbackSitePersonal, ...fallbackSite };
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
  if (siteData.recruiter && siteData.personal) {
    return { ...fallback, ...(siteData[mode] ?? {}) };
  }
  return { ...fallback, ...siteData };
}
