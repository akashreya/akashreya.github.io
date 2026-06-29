import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';

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
      <p className="card__desc">{p.desc}</p>
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

export default function Projects({ projects }) {
  const { mode } = useTheme();

  return (
    <section id="projects" className="page">
      <div className="section-head reveal">
        <h2>{mode === 'personal' ? <>things i <em>made</em>.</> : <>Selected <em>work</em>.</>}</h2>
        <span className="nb">§ III</span>
      </div>
      <div className="projects">
        {projects.map(p => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
