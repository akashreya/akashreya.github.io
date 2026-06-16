import { useTheme } from '../theme/ThemeProvider';

const NODE_POS = {
  tl:     { x: 18, y: 18 },
  tr:     { x: 82, y: 12 },
  r:      { x: 92, y: 50 },
  br:     { x: 78, y: 82 },
  bl:     { x: 18, y: 78 },
  l:      { x: 18, y: 50 },
  center: { x: 50, y: 50 },
};

const NODES = [
  { id: 'pokemon',   pos: 'tl',     emoji: '🎮', title: 'Pokémon',      body: 'Nine regions. Every type. The Lunatone/Solrock toggle exists because thematic integrity matters.', proj: '→ POKÉTOPIA' },
  { id: 'cards',     pos: 'tr',     emoji: '🃏', title: 'Card games',   body: 'Built a card-game framework for a story I never published. The engine still works.', proj: '→ Black Queen' },
  { id: 'fiction',   pos: 'r',      emoji: '📖', title: 'Fiction',      body: 'Wrote two novels. Neither is finished. The research for both was extremely thorough.', proj: '→ Shreya & Madhu' },
  { id: 'ai',        pos: 'br',     emoji: '🤖', title: 'AI consciousness', body: 'The interesting question isn\'t capability. It\'s the moment the system notices it\'s reasoning.', proj: null },
  { id: 'water',     pos: 'bl',     emoji: '☕', title: 'Hot water',    body: 'Not coffee. Not tea. Just hot water. 06:30 every day. This is not a phase.', proj: null },
  { id: 'difftool',  pos: 'l',      emoji: '⚡', title: 'The diff tool', body: '4.5 hours → 30 seconds. Still has no README. Planning PyPI eventually.', proj: '→ IVR Simulator' },
  { id: 'craft',     pos: 'center', emoji: '🎯', title: 'Time · Craft · Intentionality', body: 'Every project here exists because finishing it was the point. Not shipping. Finishing.', proj: null },
];

const CONNECTORS = NODES
  .filter(n => n.pos !== 'center')
  .map(n => ({ from: n.id, to: 'craft' }));

export default function SideQuests() {
  const { mode } = useTheme();
  if (mode !== 'personal') return null;

  const nodeById = Object.fromEntries(NODES.map(n => [n.id, n]));

  return (
    <section id="sidequests" className="side-quests page">
      <div className="section-head reveal">
        <h2>obsessions<em>.</em></h2>
        <span className="nb">§ III·b</span>
      </div>
      <div className="sq-board reveal">
        <svg
          className="sq-board__svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {CONNECTORS.map((c, i) => {
            const a = NODE_POS[nodeById[c.from]?.pos];
            const b = NODE_POS[nodeById[c.to]?.pos];
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
        {NODES.map(n => (
          <div key={n.id} className="sq-node" data-pos={n.pos}>
            <span className="sq-node__pin" />
            <span className="sq-node__em">{n.emoji}</span>
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
