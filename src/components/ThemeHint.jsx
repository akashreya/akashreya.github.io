import { useTheme } from '../theme/ThemeProvider';
import { PERSONAL_MODE_ENABLED } from '../config';

export default function ThemeHint() {
  const { mode, tone } = useTheme();

  return (
    <div className="theme-hint">
      {PERSONAL_MODE_ENABLED
        ? <><kbd>M</kbd> mode · <kbd>T</kbd> tone</>
        : <><kbd>M</kbd> tone</>
      }
      <span style={{ opacity: 0.6 }}>· {PERSONAL_MODE_ENABLED ? `${mode} / ` : ''}{tone}</span>
    </div>
  );
}
