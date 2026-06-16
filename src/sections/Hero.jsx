import { useTheme } from '../theme/ThemeProvider';
import LetterDrop from '../components/LetterDrop';
import HeroTicker from './HeroTicker';

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Hero({ hero }) {
  const { mode } = useTheme();
  const { nameFirst, nameLast, eyebrow, title, thesis, stats = [], ctas = [] } = hero;

  function handleCtaClick(e, href) {
    if (!href) return;
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollToId(href.slice(1));
    }
  }

  if (mode === 'personal') {
    return (
      <section id="hero" className="hero page">
        <div className="hero__left reveal">
          <div className="hero__eye"><span className="eyebrow">{eyebrow}</span></div>
          <h1 className="hero__name">
            <LetterDrop text={nameFirst} />
            <br />
            <LetterDrop text={nameLast} delayStart={0.35} />
          </h1>
          <div className="hero__title">{title}</div>
          <div className="hero__sub">{thesis}</div>
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
                onClick={(e) => handleCtaClick(e, cta.href)}
              >
                {cta.label}
              </button>
            ))}
          </div>
        </div>
        <div className="hero__right reveal">
          <HeroTicker />
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="hero page">
      <div className="hero__left reveal">
        <div className="hero__eye"><span className="eyebrow">{eyebrow}</span></div>
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
              onClick={(e) => handleCtaClick(e, cta.href)}
            >
              {cta.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
