export default function Principles({ principles }) {
  const { quote, items } = principles;

  return (
    <section id="principles" className="page">
      <div className="section-head reveal">
        <h2>How I build.</h2>
        <span className="nb">§ IV</span>
      </div>
      <div className="principles">
        <div className="principles__quote reveal">
          {quote.pre} <em>{quote.strong}</em>{quote.post}
        </div>
        <div className="principles__list reveal">
          {items.map(p => (
            <div key={p.n} className="principle">
              <span className="principle__n">{p.n}</span>
              <span className="principle__b">{p.body}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
