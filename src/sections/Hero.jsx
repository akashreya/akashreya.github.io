function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Hero({ hero }) {
  const {
    nameFirst,
    nameLast,
    title,
    thesis,
    stats = [],
    ctas = [],
  } = hero;

  function handleCtaClick(href) {
    if (!href) return;
    if (href.startsWith('#')) {
      scrollToId(href.slice(1));
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <section id="hero" className="hero page">
      <div className="hero__left reveal">
        <div className="hero__eye">
          <span className="eyebrow">{hero.eyebrow}</span>
        </div>
        <h1 className="hero__name">
          {nameFirst}
          <br />
          <em>{nameLast}</em>
        </h1>
        <div className="hero__sub">{title}</div>
      </div>

      <div className="hero__right reveal">
        <div className="thesis">
          <span className="quote">"</span>
          {thesis}
        </div>

        <div className="stats">
          {stats.map((stat, i) => (
            <div key={i} className="stat">
              <div className="stat__value">{stat.value}</div>
              <div className="stat__label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="cta-row">
          {ctas.map((cta, i) => (
            <button
              key={i}
              className={i === 0 ? 'btn btn--primary' : 'btn btn--ghost'}
              onClick={() => handleCtaClick(cta.href)}
            >
              {cta.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
