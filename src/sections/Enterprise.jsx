import { useTheme } from '../theme/ThemeProvider';
import SectionHead from '../components/SectionHead';
import { bullets } from '../utils/text';

export default function Enterprise({ enterprise, contact, sections }) {
  const { mode } = useTheme();
  const head = <SectionHead title={sections?.enterprise?.title} num={sections?.enterprise?.num} />;

  if (mode === 'personal') {
    const email = contact?.email ?? 'akashakashreya@gmail.com';
    return (
      <section className="page">
        {head}
        <div className="enterprise">
          {(enterprise ?? []).map((e, i) => (
            <div key={i} className="ent-card reveal">
              <div className="ent-card__head">
                <span className="ent-card__client">{e.client}</span>
                <span className="ent-card__period">{e.period}</span>
              </div>
              <h3 className="ent-card__role">{e.role}</h3>
            </div>
          ))}
        </div>
        <div className="enterprise-collapsed reveal">
          <span>{sections?.enterprise?.collapsed}</span>
          <a href={`mailto:${email}`}>Connect→</a>
        </div>
      </section>
    );
  }

  return (
    <section id="enterprise" className="page">
      {head}
      <div className="enterprise">
        {(enterprise ?? []).map((e, i) => (
          <div key={i} className="ent-card reveal">
            <div className="ent-card__head">
              <span className="ent-card__client">{e.client}</span>
              <span className="ent-card__period">{e.period}</span>
            </div>
            <h3 className="ent-card__role">{e.role}</h3>
            <ul className="ent-card__points">
              {bullets(e.desc).map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
            <div className="tags">
              {e.tags.map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
