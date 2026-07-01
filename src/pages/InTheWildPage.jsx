import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchMentions } from '../api/client';
import { fallbackMentions } from '../data/fallback';
import { useReveal } from '../hooks/useReveal';
import { useTheme } from '../theme/ThemeProvider';
import ThemeHint from '../components/ThemeHint';
import '../styles/said.css';
import ModeTransition from '../components/ModeTransition';

const FILTER_LABELS = {
  all:     'All mentions',
  rec:     'Recommendations',
  post:    'Posts',
  article: 'Articles',
  talk:    'Talks',
  press:   'Press',
};

const FILTERS = [
  { filter: 'all',     num: 'I',   label: 'All' },
  { filter: 'rec',     num: 'II',  label: 'Recs' },
  { filter: 'post',    num: 'III', label: 'Posts' },
  { filter: 'article', num: 'IV',  label: 'Articles' },
  { filter: 'talk',    num: 'V',   label: 'Talks' },
  { filter: 'press',   num: 'VI',  label: 'Press' },
];

function MentionCard({ m }) {
  const linkLabel = m.kind === 'talk' ? 'talk ↗' : m.kind === 'article' ? 'read ↗' : 'linkedin ↗';

  return (
    <article className="mention reveal" data-kind={m.kind}>
      <div className="mention__head">
        <span className="mention__badge">{m.badge}</span>
        <span className="mention__date">{m.date}</span>
      </div>
      <p className="mention__quote">
        <span className="qmark">"</span>{m.quote}
      </p>
      <div className="mention__foot">
        <div className="mention__avatar">{m.authorInitials}</div>
        <div className="mention__who">
          <div className="mention__name">{m.authorName}</div>
          <div className="mention__role">{m.authorRole}</div>
        </div>
        {m.link && m.link !== '#' && (
          <a className="mention__link" href={m.link} target="_blank" rel="noopener noreferrer">
            {linkLabel}
          </a>
        )}
      </div>
    </article>
  );
}

export default function InTheWildPage() {
  const [mentions, setMentions] = useState(fallbackMentions);
  const [activeFilter, setActiveFilter] = useState('all');
  const { mode, triggerModeTransition } = useTheme();
  const gridRef = useRef(null);

  useReveal(mentions, activeFilter);

  useEffect(() => {
    fetchMentions()
      .then(data => setMentions(data && data.length ? data : fallbackMentions))
      .catch(() => setMentions(fallbackMentions));
  }, []);

  useEffect(() => {
    if (mode !== 'personal' || !gridRef.current) return;
    const cards = Array.from(gridRef.current.querySelectorAll('.mention'));
    cards.forEach(card => card.classList.remove('is-dropped'));
    cards
      .filter(card => activeFilter === 'all' || card.dataset.kind === activeFilter)
      .forEach((card, i) => {
        setTimeout(() => card.classList.add('is-dropped'), i * 70);
      });
  }, [mentions, activeFilter, mode]);

  const visibleCount = activeFilter === 'all'
    ? mentions.length
    : mentions.filter(m => m.kind === activeFilter).length;

  return (
    <>
      <div className="sd-crumb">
        <Link to="/" className="brand">A<span className="dot">·</span>S</Link>
        <span className="arrow">/</span>
        <span>In the wild</span>
      </div>

      <main className="sd-shell">
        <section className="sd-hero reveal">
          <div className="sd-eyebrow">§ Mentions, recommendations &amp; references</div>
          <h1 className="sd-title">In the wild.</h1>
          <p className="sd-lede">What other engineers have said about the work...</p>
        </section>

        <div className="sd-filter-status reveal">
          <span><span className="current">{FILTER_LABELS[activeFilter]}</span></span>
          <span className="count">{visibleCount} {visibleCount === 1 ? 'card' : 'cards'}</span>
        </div>

        <div className="sd-grid" ref={gridRef} data-filter={activeFilter}>
          {mentions.map(m => (
            <MentionCard key={m.id} m={m} />
          ))}
          {visibleCount === 0 && (
            <div className="sd-empty" style={{ display: 'block' }}>
              No mentions in this category yet.
            </div>
          )}
        </div>

        <div className="sd-foot">
          <Link to="/">← Back to portfolio</Link>
          <span>akashreya.space</span>
        </div>
      </main>

      <nav className="navpill" aria-label="Filter mentions">
        {FILTERS.map(item => (
          <button
            key={item.filter}
            className={'navpill__item' + (activeFilter === item.filter ? ' active' : '')}
            onClick={() => setActiveFilter(item.filter)}
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
        <Link to="/" className="navpill__item">← Back</Link>
      </nav>

      <ThemeHint />
      <ModeTransition />
    </>
  );
}
