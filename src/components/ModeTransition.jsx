import '../styles/mode-transition.css';
import { useTheme } from '../theme/ThemeProvider';

export default function ModeTransition() {
  const { transOverlay } = useTheme();
  if (!transOverlay) return null;

  const { direction, beatText, phase } = transOverlay;

  if (direction === 'iris') {
    return (
      <div className={`mode-iris mode-iris--${phase}`} data-into="personal" aria-hidden="true">
        <div className="mode-iris__disc" />
        <div className="mode-iris__beat">
          {beatText}<span className="mode-iris__caret" />
        </div>
      </div>
    );
  }

  return (
    <div className={`mode-curtain mode-curtain--${phase}`} aria-hidden="true">
      <div className="mode-curtain__beat">
        {beatText}<span className="mode-curtain__caret" />
      </div>
    </div>
  );
}
