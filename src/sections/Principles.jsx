import SectionHead from '../components/SectionHead';

export default function Principles({ principles, sections }) {
  const { quote, items } = principles;

  return (
    <section id="principles" className="page">
      <SectionHead title={sections?.principles?.title} num={sections?.principles?.num} />
      <div className="principles">
        <div className="principles__quote reveal">
          {quote?.pre} <em>{quote?.strong}</em>{quote?.post}
        </div>
        <div className="principles__list reveal">
          {(items ?? []).map(p => (
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
