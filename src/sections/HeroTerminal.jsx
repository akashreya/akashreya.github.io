import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fallbackSiteRecruiter } from '../data/fallback';

export default function HeroTerminal({ liveBanner, terminal }) {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!liveBanner) return null;
  const { label, title, badgeBig, badgeLabel } = liveBanner;
  const projectRef = liveBanner.projectRef ?? fallbackSiteRecruiter.liveBanner.projectRef;
  const t = terminal ?? {};

  return (
    <div className="term">
      <div className="term__head"><span className="term__dot" />{label}</div>
      <div className="term__main">
        <div className="term__title">{title}</div>
        <div className="term__win"><b>{badgeBig}</b>{badgeLabel ? ` — ${badgeLabel}` : ''}</div>
        {projectRef && <Link className="term__link" to={`/work/${projectRef}`}>CASE STUDY →</Link>}
      </div>
      <div className="term__rows">
        <div className="term__row">
          <span className="term__lbl">LOC</span>
          <span className="term__val">{t.loc ?? 'Bengaluru'} · <b className="term__clock">{time}</b> IST</span>
        </div>
        {t.now && (
          <div className="term__row">
            <span className="term__lbl">NOW</span>
            <span className="term__val">{t.now}</span>
          </div>
        )}
        {t.latest && (
          <div className="term__row">
            <span className="term__lbl">LATEST</span>
            <span className="term__val">
              {t.latest.projectRef
                ? <Link to={`/work/${t.latest.projectRef}`}>{t.latest.text}</Link>
                : t.latest.text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
