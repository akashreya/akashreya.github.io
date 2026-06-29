import { useTheme } from '../theme/ThemeProvider';

export default function ConsoleLine() {
  const { mode } = useTheme();
  if (mode !== 'personal') return null;
  return (
    <div className="console-line" aria-hidden="true">
      GET /api/v1/me · personal · 12ms
    </div>
  );
}
