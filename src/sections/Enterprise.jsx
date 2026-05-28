export default function Enterprise({ enterprise }) {
  return (
    <section id="enterprise" className="page">
      <div className="section-head reveal">
        <h2>Enterprise work.</h2>
        <span className="nb">§ V</span>
      </div>
      <div className="enterprise">
        {enterprise.map((e, i) => (
          <div key={i} className="ent-card reveal">
            <div className="ent-card__head">
              <span className="ent-card__client">{e.client}</span>
              <span className="ent-card__period">{e.period}</span>
            </div>
            <h3 className="ent-card__role">{e.role}</h3>
            <p className="card__desc">{e.desc}</p>
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
