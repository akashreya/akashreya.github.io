import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { fetchCaseStudy } from '../api/client';
import { useReveal } from '../hooks/useReveal';
import { useTheme } from '../theme/ThemeProvider';
import '../styles/case-study.css';
import ModeTransition from '../components/ModeTransition';
import ThemeHint from '../components/ThemeHint';
import ServiceInspector from '../components/ServiceInspector';
import PokeTypeAtmosphere from '../components/PokeTypeAtmosphere';
import CaseStudySection, { romanize } from '../components/CaseStudySection';

// The Overview hero + metrics strip aren't part of study.nav[mode] (API_HANDOVER_v3.2 — nav only
// indexes sections[]), so this synthetic entry is prepended to give the navpill a way back to the
// top of the page.
const OVERVIEW_PILL = { id: 'overview', num: null, name: 'Overview', target: 'overview' };

const TYPE_PAIRS = {
  poketopia: {
    overview:     'flying-psychic',
    problem:      'ghost-dark',
    architecture: 'electric-ice',
    decisions:    'fire-fighting',
    process:      'grass-water',
    outcome:      'dragon-fairy',
  },
};

function useActiveSectionSpy(ids) {
  const [activeSection, setActiveSection] = useState(ids[0]);

  useEffect(() => {
    function onScroll() {
      let closest = ids[0];
      let minOffset = Infinity;
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const offset = Math.abs(el.getBoundingClientRect().top);
          if (offset < minOffset) {
            minOffset = offset;
            closest = id;
          }
        }
      });
      setActiveSection(closest);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids]);

  return activeSection;
}

export default function CaseStudyPage() {
  const { slug } = useParams();
  const { mode, triggerModeTransition } = useTheme();
  const [loading, setLoading] = useState(true);
  const [study, setStudy] = useState(null);
  const [rawStudy, setRawStudy] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // nav[mode] is the single source of truth for pills, order, and per-voice section visibility
  // (API_HANDOVER_v3.2 "nav-as-index rule") — Overview is synthetic since it isn't a nav entry.
  const pills = useMemo(() => [OVERVIEW_PILL, ...(study?.nav ?? [])], [study]);
  const ids = useMemo(() => pills.map(p => p.target), [pills]);
  const sectionsById = useMemo(() => new Map((study?.sections ?? []).map(s => [s.id, s])), [study]);

  const activeSection = useActiveSectionSpy(ids);

  useReveal(study);

  const typePairs = TYPE_PAIRS[slug] || {};

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setStudy(null);
    setRawStudy(null);

    fetchCaseStudy(slug, mode)
      .then(({ data, raw, notFound: nf }) => {
        if (cancelled) return;
        if (nf || !data) {
          setNotFound(true);
        } else {
          setStudy(data);
          setRawStudy(raw);
        }
      })
      .catch((err) => {
        console.error('[CaseStudyPage] fetch error:', err);
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug, mode]);

  if (loading) {
    return (
      <div style={{ padding: '40vh 56px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
        Loading...
      </div>
    );
  }

  if (notFound || !study) {
    return (
      <div style={{ padding: '40vh 56px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
        Case study not found. <Link to="/">Go home</Link>
      </div>
    );
  }

  return (
    <>
      <div className="cs-crumb">
        <Link to="/" className="brand">A<span className="dot">·</span>S</Link>
        <span className="arrow">/</span>
        <Link to="/#projects" className="pre">Projects</Link>
        <span className="arrow pre">/</span>
        <span>{study?.overview?.shortTitle ?? slug}</span>
      </div>

      <main className="cs-shell">
        <section
          id="overview"
          className={'cs-hero reveal' + (typePairs.overview ? ' t-section' : '')}
          {...(typePairs.overview ? { 'data-type-pair': typePairs.overview } : {})}
        >
          <div className="cs-eyebrow">{study.overview.eyebrow}</div>
          <h1 className="cs-title">{study.overview.title}</h1>
          <p className="cs-lede">{study.overview.lede}</p>
          <div className="cs-meta">
            {[
              { l: 'Role',      v: study.overview.role },
              { l: 'Period',    v: study.overview.period },
              { l: 'Stack',     v: study.overview.stack },
              { l: 'Team size', v: study.overview.team },
            ].map(item => (
              <div key={item.l} className="cs-meta__item">
                <div className="l">{item.l}</div>
                <div className="v">{item.v}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="metrics-section" className="cs-section reveal">
          <div className="cs-metrics">
            {(study.metrics ?? []).map((m, i) => (
              <div key={i} className="cs-metric">
                <div className="v">{m.value}</div>
                <div className="l">{m.label}</div>
              </div>
            ))}
          </div>
        </section>

        {(study.nav ?? []).map(item => (
          <CaseStudySection
            key={item.target}
            item={item}
            section={sectionsById.get(item.target)}
            typePair={typePairs[item.target]}
          />
        ))}

        <div className="cs-links">
          {(study.links ?? []).map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>
          ))}
        </div>

        <div className="cs-foot">
          <Link to="/#projects">← Back to projects</Link>
          <span>akashreya.space</span>
        </div>
      </main>

      <nav className="navpill" aria-label="Case-study sections">
        {pills.map(item => (
          <button
            key={item.target}
            className={'navpill__item' + (activeSection === item.target ? ' active' : '')}
            onClick={() => document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            {item.num != null && <span className="navpill__num">{romanize(item.num)}</span>}
            <span className="label">{item.name}</span>
          </button>
        ))}
        <span className="navpill__sep" />
        <button
          className="navpill__mode"
          onClick={() => triggerModeTransition(mode === 'recruiter' ? 'personal' : 'recruiter')}
          aria-label="Toggle mode"
        >
          <span className="navpill__mode-dot" />
          {mode === 'recruiter' ? 'Personal →' : 'Recruiter mode'}
        </button>
        <span className="navpill__sep" />
        <Link to="/#projects" className="navpill__cmd">←</Link>
      </nav>

      <ThemeHint />
      <ModeTransition />

      {slug === 'fico-cod-rto' && rawStudy && (
        <ServiceInspector
          data={rawStudy}
          endpoint={`/api/v1/projects/${slug}`}
          statusMs={12}
          keyMap={{
            overview: 'overview',
            metrics:  'metrics-section',
            // Individual sections are nested inside sections[] under v3.2, so they're no longer
            // reachable by top-level key — ServiceInspector links those by each entry's own "id"
            // field instead (see data-section-id wiring in ServiceInspector.jsx).
          }}
          footer={`GET /api/v1/projects/${slug} · the same panel we showed the judges.`}
        />
      )}
      {slug === 'poketopia' && <PokeTypeAtmosphere />}
    </>
  );
}
