import { useTheme } from '../theme/ThemeProvider';

export default function AmbientBlobs() {
  const { mode } = useTheme();
  if (mode !== 'personal') return null;
  return (
    <>
      <div className="blob b1" aria-hidden="true" />
      <div className="blob b2" aria-hidden="true" />
      <div className="blob b3" aria-hidden="true" />
    </>
  );
}
