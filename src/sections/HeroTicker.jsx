import { useState, useEffect } from 'react';
import { fetchTicker } from '../api/client';
import { fallbackTicker } from '../data/fallback';

export default function HeroTicker() {
  const [lines, setLines] = useState(fallbackTicker);

  useEffect(() => {
    fetchTicker().then(setLines);
  }, []);

  const doubled = [...lines, ...lines];
  return (
    <div className="ticker-wrap" aria-hidden="true">
      <div className="ticker-inner">
        {doubled.map((line, i) => (
          <span key={i} className="ti">{line}</span>
        ))}
      </div>
    </div>
  );
}
