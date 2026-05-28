import { useTheme } from '../theme/ThemeProvider';

export default function ThemeHint() {
  const { themeName, mode } = useTheme();

  return (
    <div className="theme-hint">
      <kbd>T</kbd> theme · <kbd>M</kbd> mode
      <span style={{ opacity: 0.6 }}>· {themeName} / {mode}</span>
    </div>
  );
}
