import { useTheme } from '../theme/ThemeProvider';

export default function Footer({ brand, contact }) {
  const { mode } = useTheme();

  return (
    <footer id="footer" className="foot page reveal">
      <div className="foot__brand">
        <div className="name">
          {mode === 'personal'
            ? <>akash <em>s k.</em></>
            : <>Akash <em>S K</em></>}
        </div>
        <div className="foot__tag">{brand.tagline}</div>
        {mode === 'personal' && (
          <div className="foot__where">Bengaluru · IST</div>
        )}
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
