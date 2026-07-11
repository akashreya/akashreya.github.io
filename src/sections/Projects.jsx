import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { pickVoice } from '../api/client';
import SectionHead from '../components/SectionHead';
import { bullets } from '../utils/text';

function ProjectCard({ p }) {
  const isLive = p.kind === 'live';
  const className = [
    'card',
    `proj-${p.span}`,
    'reveal',
    isLive ? 'is-live' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <div className="card__head">
        <span className={`badge kind-${p.kind}`}>{p.eyebrow}</span>
        <span className="card__year">
          {p.year}{p.hasCaseStudy ? ' · case study →' : ' →'}
        </span>
      </div>
      <h3 className="card__title">{p.title}</h3>
      {bullets(p.desc).length > 0 && (
        <ul className="card__points">
          {bullets(p.desc).map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      {p.metrics && p.metrics.length > 0 && (
        <div className="card__metrics">
          {p.metrics.map((m, i) => (
            <div key={i} className="metric">
              <div className="metric__v">{m.value}</div>
              <div className="metric__l">{m.label}</div>
            </div>
          ))}
        </div>
      )}
      {p.tags && p.tags.length > 0 && (
        <div className="tags">
          {p.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </>
  );

  if (p.hasCaseStudy) {
    return (
      <Link to={`/work/${p.slug}`} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <article className={className}>
      {inner}
    </article>
  );
}

export default function Projects({ projects, sections }) {
  const { mode } = useTheme();

  return (
    <section id="projects" className="page">
      <SectionHead title={sections?.projects?.title} num={sections?.projects?.num} />
      <div className="projects">
        {projects.map(p => (
          <ProjectCard key={p.id} p={{ ...p, desc: pickVoice(p.desc, mode) }} />
        ))}
      </div>
    </section>
  );
}
