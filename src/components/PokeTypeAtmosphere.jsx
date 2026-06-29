import { useEffect, useState } from 'react';
import '../styles/cs-poketypes.css';

const PAIRS = {
  'flying-psychic': ['#a3b8f9', '#ff7eb6', 'flying',   'psychic'],
  'ghost-dark':     ['#9b7bd4', '#6f5a4a', 'ghost',    'dark'],
  'electric-ice':   ['#f7d44a', '#7bd1d6', 'electric', 'ice'],
  'fire-fighting':  ['#ff7849', '#d04545', 'fire',     'fighting'],
  'grass-water':    ['#7ac74c', '#5fb4ff', 'grass',    'water'],
  'dragon-fairy':   ['#8a6cff', '#ff9bd0', 'dragon',   'fairy'],
  'steel-rock':     ['#b7b8d0', '#b8a878', 'steel',    'rock'],
  'poison-bug':     ['#c084d4', '#a8b820', 'poison',   'bug'],
  'ground-normal':  ['#e0c068', '#b8b894', 'ground',   'normal'],
};

export default function PokeTypeAtmosphere() {
  const [pair, setPair] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-poketypes', 'on');

    const sections = Array.from(document.querySelectorAll('.t-section[data-type-pair]'));
    if (!sections.length) return;

    sections.forEach(sect => {
      if (!sect.querySelector(':scope > .t-glow')) {
        const g = document.createElement('div');
        g.className = 't-glow';
        sect.prepend(g);
      }
    });

    function setPagePair(slug) {
      const p = PAIRS[slug];
      if (!p) return;
      root.style.setProperty('--page-c1', p[0]);
      root.style.setProperty('--page-c2', p[1]);
      setPair(p);
    }

    let currentActive = sections[0];
    currentActive.classList.add('t-active');
    setPagePair(currentActive.getAttribute('data-type-pair'));

    function pickActive() {
      const y = window.scrollY + window.innerHeight * 0.3;
      let best = sections[0];
      let bestDist = Infinity;
      for (const s of sections) {
        const top = s.getBoundingClientRect().top + window.scrollY;
        const dist = Math.abs(top - y);
        if (top <= y && dist < bestDist) { bestDist = dist; best = s; }
      }
      if (best !== currentActive) {
        currentActive.classList.remove('t-active');
        best.classList.add('t-active');
        currentActive = best;
        setPagePair(best.getAttribute('data-type-pair'));
      }
    }

    window.addEventListener('scroll', pickActive, { passive: true });
    window.addEventListener('resize', pickActive);

    return () => {
      root.removeAttribute('data-poketypes');
      root.style.removeProperty('--page-c1');
      root.style.removeProperty('--page-c2');
      window.removeEventListener('scroll', pickActive);
      window.removeEventListener('resize', pickActive);
      sections.forEach(s => {
        s.classList.remove('t-active');
        const glow = s.querySelector(':scope > .t-glow');
        if (glow) glow.remove();
      });
    };
  }, []);

  if (!pair) return null;

  return (
    <div
      className="t-caption"
      aria-hidden="true"
      style={{ '--cap-c1': pair[0], '--cap-c2': pair[1] }}
    >
      <span className="t-sw">
        <span className="a" />
        <span className="b" />
      </span>
      <span className="t-name t-a">{pair[2]}</span>
      <span className="t-x">×</span>
      <span className="t-name t-b">{pair[3]}</span>
    </div>
  );
}
