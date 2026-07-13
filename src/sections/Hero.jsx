import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import LetterDrop from '../components/LetterDrop';
import HeroTerminal from './HeroTerminal';
import HeroTicker from './HeroTicker';
import { fallbackSiteRecruiter, fallbackSitePersonal } from '../data/fallback';

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleCtaClick(e, href) {
  if (href?.startsWith('#')) {
    e.preventDefault();
    scrollToId(href.slice(1));
  }
}

function ProofItem({ stat }) {
  const inner = (
    <>
      <div className="stat__value">{stat.value}</div>
      <div className="stat__label">{stat.label}</div>
    </>
  );
  if (!stat.href) return <div className="stat">{inner}</div>;
  if (stat.href.startsWith('#')) {
    return <a className="stat" href={stat.href} onClick={(e) => handleCtaClick(e, stat.href)}>{inner}</a>;
  }
  return <Link className="stat" to={stat.href}>{inner}</Link>;
}

function Ctas({ ctas }) {
  return (
    <div className="cta-row">
      {ctas.map((cta, i) => (
        <a
          key={i}
          className={i === 0 ? 'btn btn--primary' : 'btn btn--ghost'}
          href={cta.href}
          onClick={(e) => handleCtaClick(e, cta.href)}
        >
          {cta.label}
        </a>
      ))}
    </div>
  );
}

function Ledger({ ledger }) {
  if (!ledger?.length) return null;
  return (
    <div className="led">
      <div className="led__inner">
        <div className="led__head">
          <span className="led__title">Presently</span>
          <span className="led__star">⁂</span>
        </div>
        {ledger.map((row, i) => (
          <div key={i} className="led__row">
            <span className="led__label">{row.label}</span>
            <span className="led__value">
              {row.projectRef
                ? <Link to={`/work/${row.projectRef}`}>{row.value}</Link>
                : row.href
                  ? <a href={row.href}>{row.value}</a>
                  : row.value}
            </span>
          </div>
        ))}
      </div>
      <div className="led__cap"><span>BENGALURU · IST</span><span>· UPDATED OFTEN ·</span></div>
    </div>
  );
}

function Thesis({ value }) {
  if (value && typeof value === 'object') {
    return (
      <>
        {value.pre}
        <strong className="hero__thesis-acc">{value.strong}</strong>
        {value.post}
      </>
    );
  }
  return value ?? null;
}

export default function Hero({ hero, liveBanner }) {
  const { mode } = useTheme();
  const { nameFirst, nameLast, eyebrow, title, thesis, stats = [], ctas = [] } = hero;
  const terminal = hero.terminal ?? fallbackSiteRecruiter.hero.terminal;
  const ledger   = hero.ledger   ?? fallbackSitePersonal.hero.ledger;

  if (mode === 'personal') {
    return (
      <section id="hero" className="hero page">
        <div className="hero__cols">
          <div className="hero__left reveal">
            <div className="hero__eye">
              <span className="eyebrow"><span className="hero__sec">§ I</span> — {eyebrow}</span>
            </div>
            <h1 className="hero__name">
              <LetterDrop text={nameFirst} /> <LetterDrop text={nameLast} delayStart={0.35} />
            </h1>
            <div className="hero__script">{title}</div>
            <div className="hero__sub"><Thesis value={thesis} /></div>
            <div className="hero__proof">
              {stats.map((stat, i) => <ProofItem key={i} stat={stat} />)}
            </div>
            <Ctas ctas={ctas} />
          </div>
          <div className="hero__right reveal">
            <Ledger ledger={ledger} />
          </div>
        </div>
        <div className="hero__notes reveal"><HeroTicker /></div>
      </section>
    );
  }

  return (
    <section id="hero" className="hero page">
      <div className="hero__cols">
        <div className="hero__left reveal">
          <div className="hero__eye"><span className="eyebrow">{eyebrow}</span></div>
          <h1 className="hero__name">{nameFirst} <em>{nameLast}</em></h1>
          <p className="hero__thesis">&ldquo;<Thesis value={thesis} />&rdquo;</p>
          <div className="hero__proof">
            {stats.map((stat, i) => <ProofItem key={i} stat={stat} />)}
          </div>
          <Ctas ctas={ctas} />
        </div>
        <div className="hero__right reveal">
          <HeroTerminal liveBanner={liveBanner} terminal={terminal} />
        </div>
      </div>
    </section>
  );
}
