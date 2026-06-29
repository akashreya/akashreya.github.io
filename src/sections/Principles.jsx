import { useTheme } from '../theme/ThemeProvider';

export default function Principles({ principles }) {
  const { mode } = useTheme();
  const { quote, items } = principles;

  return (
    <section id="principles" className="page">
      <div className="section-head reveal">
        <h2>{mode === 'personal' ? 'rules.' : 'How I build.'}</h2>
        <span className="nb">§ IV</span>
      </div>
      <div className="principles">
        <div className="principles__quote reveal">
          {quote?.pre} <em>{quote?.strong}</em>{quote?.post}
        </div>
        <div className="principles__list reveal">
          {items.map(p => (
            <div key={p.n} className="principle">
              <span className="principle__n">{p.n}</span>
              <span className="principle__b">
                {p.title
                  ? <><strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 4 }}>{p.title}</strong>{p.body}</>
                  : p.body}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
