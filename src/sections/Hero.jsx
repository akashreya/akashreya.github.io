import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import LetterDrop from '../components/LetterDrop';
import Typeset from '../components/Typeset';
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

// Odometer frames for the boot roll: two "approaching" values ahead of the real
// one, derived from the first digit run so any API-served string degrades to a
// static value rather than breaking. Final frame is first — that's the resting
// state when animations are off (reduced motion) or unsupported.
function rollFrames(value) {
  if (typeof value !== 'string') return null;
  const m = value.match(/^([^0-9]*)(\d+)(.*)$/);
  if (!m) return null;
  const n = parseInt(m[2], 10);
  if (n < 2) return null;
  return [value, `${m[1]}${n - 1}${m[3]}`, `${m[1]}${n - 2}${m[3]}`];
}

function ProofItem({ stat, roll = false }) {
  const frames = roll ? rollFrames(stat.value) : null;
  const value = frames ? (
    <span className="stat__roll" aria-label={stat.value}>
      <span className="stat__roll-in" aria-hidden="true">
        {frames.map((f, i) => <span key={i}>{f}</span>)}
      </span>
    </span>
  ) : stat.value;
  const inner = (
    <>
      <div className="stat__value">{value}</div>
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

// API text wins; the structured fallback is applied only as a presentation
// upgrade when its concatenated text is identical to the flat API string.
function structureThesis(thesis, structured) {
  if (typeof thesis !== 'string' || !structured || typeof structured !== 'object') return thesis;
  const flat = `${structured.pre}${structured.strong}${structured.post}`;
  return flat.trim() === thesis.trim() ? structured : thesis;
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
          <h1 className="hero__name"><Typeset text={nameFirst || ''} /> <em><Typeset text={(nameLast || '').trim()} delayStart={0.3} /></em></h1>
          <p className="hero__thesis">&ldquo;<Thesis value={structureThesis(thesis, fallbackSiteRecruiter.hero.thesis)} />&rdquo;</p>
          <div className="hero__proof">
            {stats.map((stat, i) => <ProofItem key={i} stat={stat} roll />)}
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
