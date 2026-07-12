import { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { PERSONAL_MODE_ENABLED } from '../config';

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function useScrollSpy(ids, offset = 140) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY + offset;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= y) current = id;
      }
      setActiveId(prev => (prev === current ? prev : current));
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // ids is re-derived from props each render (e.g. nav swaps from fallback to
    // fetched data); re-subscribe whenever its content actually changes, not on
    // every render — hence the joined string instead of the array itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|')]);

  return activeId;
}

export default function NavPill({ items }) {
  const targets = (items ?? []).map(item => item.target);
  const activeTarget = useScrollSpy(targets);
  const { mode, triggerModeTransition } = useTheme();

  return (
    <nav className="navpill">
      {(items ?? []).map(item => (
        <button
          key={item.id}
          className={`navpill__item${activeTarget === item.target ? ' active' : ''}`}
          onClick={() => scrollToId(item.target)}
        >
          <span className="navpill__num">{item.num}</span>
          <span className="label">{item.name}</span>
        </button>
      ))}
      {PERSONAL_MODE_ENABLED && (
        <>
          <span className="navpill__sep" />
          <button
            className="navpill__mode"
            onClick={() => triggerModeTransition(mode === 'recruiter' ? 'personal' : 'recruiter')}
            aria-label="Toggle mode"
          >
            <span className="navpill__mode-dot" />
            {mode === 'recruiter' ? 'Personal →' : 'Recruiter mode'}
          </button>
        </>
      )}
    </nav>
  );
}
