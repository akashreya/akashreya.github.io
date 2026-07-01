import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCaseStudy } from '../api/client';
import { useReveal } from '../hooks/useReveal';
import { useTheme } from '../theme/ThemeProvider';
import '../styles/case-study.css';
import ModeTransition from '../components/ModeTransition';
import ThemeHint from '../components/ThemeHint';
import ServiceInspector from '../components/ServiceInspector';
import PokeTypeAtmosphere from '../components/PokeTypeAtmosphere';

const SECTIONS = [
  { num: 'I',   label: 'Overview',     target: 'overview' },
  { num: 'II',  label: 'Problem',      target: 'problem' },
  { num: 'III', label: 'Architecture', target: 'architecture' },
  { num: 'IV',  label: 'Decisions',    target: 'decisions' },
  { num: 'V',   label: 'Process',      target: 'process' },
  { num: 'VI',  label: 'Outcome',      target: 'outcome' },
];

const SECTION_IDS = SECTIONS.map(s => s.target);

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
  const [notFound, setNotFound] = useState(false);

  const activeSection = useActiveSectionSpy(SECTION_IDS);

  useReveal(study);

  const typePairs = TYPE_PAIRS[slug] || {};

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setStudy(null);

    fetchCaseStudy(slug, mode)
      .then(({ data, notFound: nf }) => {
        if (cancelled) return;
        if (nf || !data) {
          setNotFound(true);
        } else {
          setStudy(data);
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
  }, [slug]);

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

        <section
          id="problem"
          className={'cs-section reveal' + (typePairs.problem ? ' t-section' : '')}
          {...(typePairs.problem ? { 'data-type-pair': typePairs.problem } : {})}
        >
          <div className="cs-section__head">
            <h2 className="cs-section__title">
              {typePairs.problem && <span className="t-dots"><span className="a"/><span className="b"/></span>}
              {study.problem.title}
            </h2>
            <span className="cs-section__num">§ II</span>
          </div>
          <div className="cs-prose" dangerouslySetInnerHTML={{ __html: study.problem.body }} />
        </section>

        <section
          id="architecture"
          className={'cs-section reveal' + (typePairs.architecture ? ' t-section' : '')}
          {...(typePairs.architecture ? { 'data-type-pair': typePairs.architecture } : {})}
        >
          <div className="cs-section__head">
            <h2 className="cs-section__title">
              {typePairs.architecture && <span className="t-dots"><span className="a"/><span className="b"/></span>}
              {study.architecture.title}
            </h2>
            <span className="cs-section__num">§ III</span>
          </div>
          <div className="cs-prose" dangerouslySetInnerHTML={{ __html: study.architecture.intro }} />
          <pre className="cs-ascii">{study.architecture.diagram}</pre>
          <div className="cs-prose" dangerouslySetInnerHTML={{ __html: study.architecture.outro }} />
        </section>

        <section
          id="decisions"
          className={'cs-section reveal' + (typePairs.decisions ? ' t-section' : '')}
          {...(typePairs.decisions ? { 'data-type-pair': typePairs.decisions } : {})}
        >
          <div className="cs-section__head">
            <h2 className="cs-section__title">
              {typePairs.decisions && <span className="t-dots"><span className="a"/><span className="b"/></span>}
              {study.decisions.title}
            </h2>
            <span className="cs-section__num">§ IV</span>
          </div>
          <div className="cs-decisions">
            {(study.decisions?.items ?? []).map((d, i) => (
              <div key={i} className="cs-decision">
                <div>
                  <div className="cs-decision__choice">{d.choice}</div>
                  <div className="cs-decision__alts">over {d.alternatives}</div>
                </div>
                <div className="cs-decision__why">{d.reasoning}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="process"
          className={'cs-section reveal' + (typePairs.process ? ' t-section' : '')}
          {...(typePairs.process ? { 'data-type-pair': typePairs.process } : {})}
        >
          <div className="cs-section__head">
            <h2 className="cs-section__title">
              {typePairs.process && <span className="t-dots"><span className="a"/><span className="b"/></span>}
              {study.process.title}
            </h2>
            <span className="cs-section__num">§ V</span>
          </div>
          <div className="cs-process">
            {(study.process?.phases ?? []).map((ph, i) => (
              <div key={i} className="cs-phase">
                <div className="cs-phase__date">{ph.date}</div>
                <div>
                  <h3 className="cs-phase__name">{ph.name}</h3>
                  <div className="cs-phase__body">{ph.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {study.tradeoffs && (
          <section className="cs-section reveal">
            <div className="cs-section__head">
              <h2 className="cs-section__title">Trade-offs</h2>
            </div>
            <div className="cs-tradeoffs">
              <div className="cs-tradeoff">
                <div className="cs-tradeoff__l">What we gained</div>
                <div className="cs-tradeoff__b">{study.tradeoffs.gained}</div>
              </div>
              <div className="cs-tradeoff">
                <div className="cs-tradeoff__l">What we gave up</div>
                <div className="cs-tradeoff__b">{study.tradeoffs.gaveUp}</div>
              </div>
            </div>
          </section>
        )}

        <section
          id="outcome"
          className={'cs-section reveal' + (typePairs.outcome ? ' t-section' : '')}
          {...(typePairs.outcome ? { 'data-type-pair': typePairs.outcome } : {})}
        >
          <div className="cs-section__head">
            <h2 className="cs-section__title">
              {typePairs.outcome && <span className="t-dots"><span className="a"/><span className="b"/></span>}
              {study.outcome.title}
            </h2>
            <span className="cs-section__num">§ VI</span>
          </div>
          <div className="cs-outcome-card cs-prose" dangerouslySetInnerHTML={{ __html: study.outcome.body }} />
          <div className="cs-links">
            {(study.links ?? []).map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>
            ))}
          </div>
        </section>

        <div className="cs-foot">
          <Link to="/#projects">← Back to projects</Link>
          <span>akashreya.space</span>
        </div>
      </main>

      <nav className="navpill" aria-label="Case-study sections">
        {SECTIONS.map(item => (
          <button
            key={item.target}
            className={'navpill__item' + (activeSection === item.target ? ' active' : '')}
            onClick={() => document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            <span className="navpill__num">{item.num}</span>
            <span className="label">{item.label}</span>
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

      {slug === 'fico-cod-rto' && (
        <ServiceInspector
          data={study}
          endpoint={`/api/v1/projects/${slug}`}
          statusMs={12}
          keyMap={{
            overview:     'overview',
            metrics:      'metrics-section',
            problem:      'problem',
            architecture: 'architecture',
            decisions:    'decisions',
            process:      'process',
            outcome:      'outcome',
          }}
          footer={`GET /api/v1/projects/${slug} · the same panel we showed the judges.`}
        />
      )}
      {slug === 'poketopia' && <PokeTypeAtmosphere />}
    </>
  );
}
