// Shared section heading. Title text (and its punctuation) is content and comes
// from the API/fallback; the accent <em> on a trailing period is chrome.
export default function SectionHead({ title, num }) {
  if (!title) return null;
  const dotted = title.endsWith('.');
  return (
    <div className="section-head reveal">
      <h2>{dotted ? <>{title.slice(0, -1)}<em>.</em></> : title}</h2>
      <span className="nb">§ {num}</span>
    </div>
  );
}
