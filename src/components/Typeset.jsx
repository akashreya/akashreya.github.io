export default function Typeset({ text, delayStart = 0 }) {
  return (
    <span className="typeset" aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} style={{ animationDelay: `${delayStart + i * 0.05}s` }}>
          {ch}
        </span>
      ))}
    </span>
  );
}
