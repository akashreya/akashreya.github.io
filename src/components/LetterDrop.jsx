export default function LetterDrop({ text, delayStart = 0 }) {
  return (
    <span className="letter-drop" aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} style={{ animationDelay: `${delayStart + i * 0.06}s` }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}
