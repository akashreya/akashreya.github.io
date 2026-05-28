import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCaseStudy } from '../api/client';
import { useReveal } from '../hooks/useReveal';
import '../styles/case-study.css';

const SECTIONS = [
  { num: 'I',   label: 'Overview',     target: 'overview' },
  { num: 'II',  label: 'Problem',      target: 'problem' },
  { num: 'III', label: 'Architecture', target: 'architecture' },
  { num: 'IV',  label: 'Decisions',    target: 'decisions' },
  { num: 'V',   label: 'Process',      target: 'process' },
  { num: 'VI',  label: 'Outcome',      target: 'outcome' },
];

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
  const [loading, setLoading] = useState(true);
  const [study, setStudy] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const sectionIds = SECTIONS.map(s => s.target);
  const activeSection = useActiveSectionSpy(sectionIds);

  useReveal([study]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setStudy(null);

    fetchCaseStudy(slug)
      .then(({ data, notFound: nf }) => {
        if (cancelled) return;
        if (nf || !data) {
          setNotFound(true);
        } else {
          setStudy(data);
        }
      })
      .catch(() => {
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
        <section id="overview" className="cs-hero reveal">
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

        <section className="cs-section reveal">
          <div className="cs-metrics">
            {study.metrics.map((m, i) => (
              <div key={i} className="cs-metric">
                <div className="v">{m.value}</div>
                <div className="l">{m.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="problem" className="cs-section reveal">
          <div className="cs-section__head">
            <h2 className="cs-section__title">{study.problem.title}</h2>
            <span className="cs-section__num">§ II</span>
          </div>
          <div className="cs-prose" dangerouslySetInnerHTML={{ __html: study.problem.body }} />
        </section>

        <section id="architecture" className="cs-section reveal">
          <div className="cs-section__head">
            <h2 className="cs-section__title">{study.architecture.title}</h2>
            <span className="cs-section__num">§ III</span>
          </div>
          <div className="cs-prose" dangerouslySetInnerHTML={{ __html: study.architecture.intro }} />
          <pre className="cs-ascii">{study.architecture.diagram}</pre>
          <div className="cs-prose" dangerouslySetInnerHTML={{ __html: study.architecture.outro }} />
        </section>

        <section id="decisions" className="cs-section reveal">
          <div className="cs-section__head">
            <h2 className="cs-section__title">{study.decisions.title}</h2>
            <span className="cs-section__num">§ IV</span>
          </div>
          <div className="cs-decisions">
            {study.decisions.items.map((d, i) => (
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

        <section id="process" className="cs-section reveal">
          <div className="cs-section__head">
            <h2 className="cs-section__title">{study.process.title}</h2>
            <span className="cs-section__num">§ V</span>
          </div>
          <div className="cs-process">
            {study.process.phases.map((ph, i) => (
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

        <section className="cs-section reveal">
          <div className="cs-section__head">
            <h2 className="cs-section__title">{study.tradeoffs.title}</h2>
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

        <section id="outcome" className="cs-section reveal">
          <div className="cs-section__head">
            <h2 className="cs-section__title">{study.outcome.title}</h2>
            <span className="cs-section__num">§ VI</span>
          </div>
          <div className="cs-outcome-card cs-prose" dangerouslySetInnerHTML={{ __html: study.outcome.body }} />
          <div className="cs-links">
            {study.links.map((link, i) => (
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
        <Link to="/#projects" className="navpill__cmd">←</Link>
      </nav>

      <div className="theme-hint">
        <kbd>T</kbd> theme · <kbd>M</kbd> mode
      </div>
    </>
  );
}
