import { useTheme } from '../theme/ThemeProvider';
import { PERSONAL_MODE_ENABLED } from '../config';

export default function ThemeHint() {
  const { mode, tone, setTone } = useTheme();
  const toggleTone = () => setTone(tone === 'dark' ? 'light' : 'dark');
  const nextTone = tone === 'dark' ? 'light' : 'dark';

  return (
    <button
      className="theme-hint"
      onClick={toggleTone}
      aria-label={`Switch to ${nextTone} tone`}
    >
      <span className="theme-hint__hint">
        {PERSONAL_MODE_ENABLED
          ? <><kbd>M</kbd> mode · <kbd>T</kbd> tone</>
          : <><kbd>M</kbd> tone</>
        }
      </span>
      <span style={{ opacity: 0.6 }}>· {PERSONAL_MODE_ENABLED ? `${mode} / ` : ''}{tone}</span>
    </button>
  );
}
