export default function Footer({ brand, contact }) {
  return (
    <footer id="footer" className="foot page reveal">
      <div className="foot__brand">
        <div className="name">Akash <em>S K</em></div>
        <div className="foot__tag">{brand.tagline}</div>
      </div>
      <div className="foot__links">
        {contact.socials.map(s => (
          <a key={s.label} href={s.href}>{s.label}</a>
        ))}
      </div>
      <div className="foot__bottom">
        <span>© 2026 Akash S K</span>
        <span>{brand.url}</span>
      </div>
    </footer>
  );
}
