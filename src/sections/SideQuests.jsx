import { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { fetchSideQuests } from '../api/client';
import { fallbackSideQuests } from '../data/fallback';
import SectionHead from '../components/SectionHead';

const NODE_POS = {
  tl:     { x: 18, y: 18 },
  tr:     { x: 82, y: 12 },
  r:      { x: 92, y: 50 },
  br:     { x: 78, y: 82 },
  bl:     { x: 18, y: 78 },
  l:      { x: 18, y: 50 },
  center: { x: 50, y: 50 },
};

export default function SideQuests({ sections }) {
  const { mode } = useTheme();
  const [quests, setQuests] = useState(fallbackSideQuests);

  useEffect(() => {
    if (mode !== 'personal') return;
    fetchSideQuests().then(setQuests);
  }, [mode]);

  if (mode !== 'personal') return null;

  // Every non-center node connects to the center hub, whatever its id.
  const hub = quests.find(q => q.pos === 'center');
  const connectors = hub ? quests.filter(q => q.pos !== 'center') : [];

  return (
    <section id="sidequests" className="side-quests page">
      <SectionHead title={sections?.sidequests?.title} num={sections?.sidequests?.num} />
      <div className="sq-board reveal">
        <svg
          className="sq-board__svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {connectors.map((c, i) => {
            const a = NODE_POS[c.pos];
            const b = NODE_POS[hub.pos];
            if (!a || !b) return null;
            return (
              <line
                key={i}
                x1={a.x} y1={a.y}
                x2={b.x} y2={b.y}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        {quests.map(n => (
          <div key={n.id} className="sq-node" data-pos={n.pos}>
            <span className="sq-node__pin" />
            <div className="sq-node__title">{n.title}</div>
            <div className="sq-node__body">{n.body}</div>
            {n.proj && <span className="sq-node__proj">{n.proj}</span>}
          </div>
        ))}
        <span className="sq-board__hint">hover to focus · lines show connections</span>
      </div>
    </section>
  );
}
