import { createContext, useContext, useState, useEffect } from 'react';
import { themes, applyTheme } from './themes';

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
  const url = new URL(window.location.href);
  const savedTheme = localStorage.getItem('akashreya.theme');
  const savedMode  = localStorage.getItem('akashreya.mode');

  const startTheme = url.searchParams.get('theme') || savedTheme || 'crimson';
  const startMode  = url.searchParams.get('mode')  || savedMode  || 'dark';

  const [themeName, setThemeNameRaw] = useState(themes[startTheme] ? startTheme : 'crimson');
  const [mode, setModeRaw]           = useState(['light', 'dark'].includes(startMode) ? startMode : 'dark');

  const setThemeName = (name) => {
    setThemeNameRaw(name);
    localStorage.setItem('akashreya.theme', name);
  };
  const setMode = (m) => {
    setModeRaw(m);
    localStorage.setItem('akashreya.mode', m);
  };

  useEffect(() => {
    applyTheme(themeName, mode);
  }, [themeName, mode]);

  useEffect(() => {
    function onKey(e) {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === 't' || e.key === 'T') {
        setThemeName(n => n === 'crimson' ? 'glass' : 'crimson');
      } else if (e.key === 'm' || e.key === 'M') {
        setMode(m => m === 'dark' ? 'light' : 'dark');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <ThemeCtx.Provider value={{ themeName, mode, setThemeName, setMode }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
