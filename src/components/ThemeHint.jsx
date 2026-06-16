import { useTheme } from '../theme/ThemeProvider';

export default function ThemeHint() {
  const { mode, tone } = useTheme();

  return (
    <div className="theme-hint">
      <kbd>M</kbd> mode · <kbd>T</kbd> tone
      <span style={{ opacity: 0.6 }}>· {mode} / {tone}</span>
    </div>
  );
}
