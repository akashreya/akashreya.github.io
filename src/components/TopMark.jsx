export default function TopMark({ brand }) {
  return (
    <div className="topmark">
      <span className="brand">
        <span>A</span>
        <span className="dot">·</span>
        <span>S</span>
      </span>
      <span className="sep" />
      <span className="url muted-mono">{brand.url}</span>
    </div>
  );
}
