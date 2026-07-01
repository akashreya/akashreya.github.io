import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { themes, applyTheme } from './themes';
import { PERSONAL_MODE_ENABLED } from '../config';

const ThemeCtx = createContext(null);

const _startParams = new URLSearchParams(window.location.search);

export function ThemeProvider({ children }) {
  const [mode, setModeRaw] = useState(() => {
    const savedMode = localStorage.getItem('akashreya.mode');
    const startMode = PERSONAL_MODE_ENABLED
      ? (_startParams.get('mode') || savedMode || 'recruiter')
      : 'recruiter';
    return themes[startMode] ? startMode : 'recruiter';
  });

  const [tone, setToneRaw] = useState(() => {
    const savedTone = localStorage.getItem('akashreya.tone');
    const startTone = _startParams.get('tone') || savedTone || 'dark';
    return ['light', 'dark'].includes(startTone) ? startTone : 'dark';
  });

  const [transOverlay, setTransOverlay] = useState(null);

  const modeRef = useRef(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const toneRef = useRef(tone);
  useEffect(() => { toneRef.current = tone; }, [tone]);

  const setMode = (m) => {
    const next = typeof m === 'function' ? m(mode) : m;
    setModeRaw(next);
    localStorage.setItem('akashreya.mode', next);
  };
  const setTone = (t) => {
    const next = typeof t === 'function' ? t(tone) : t;
    setToneRaw(next);
    localStorage.setItem('akashreya.tone', next);
  };

  const triggerModeTransition = useCallback((nextMode) => {
    if (!PERSONAL_MODE_ENABLED) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setModeRaw(nextMode);
      localStorage.setItem('akashreya.mode', nextMode);
      return;
    }
    if (transOverlay) return;
    const direction = nextMode === 'personal' ? 'iris' : 'curtain';
    const beatText = nextMode === 'personal'
      ? '> entering personal mode · akash@kelvin'
      : '> recruiter mode · akashreya.space';
    setTransOverlay({ direction, beatText, phase: 'in' });
    setTimeout(() => {
      setModeRaw(nextMode);
      localStorage.setItem('akashreya.mode', nextMode);
    }, 260);
    setTimeout(() => setTransOverlay(o => o ? { ...o, phase: 'out' } : null), 380);
    setTimeout(() => setTransOverlay(null), 700);
  }, [transOverlay]);

  useEffect(() => {
    applyTheme(mode, tone);
  }, [mode, tone]);

  useEffect(() => {
    function onKey(e) {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (PERSONAL_MODE_ENABLED) {
        if (e.key === 'm' || e.key === 'M') {
          triggerModeTransition(modeRef.current === 'recruiter' ? 'personal' : 'recruiter');
        } else if (e.key === 't' || e.key === 'T') {
          setTone(toneRef.current === 'dark' ? 'light' : 'dark');
        }
      } else {
        if (e.key === 'm' || e.key === 'M') {
          setTone(toneRef.current === 'dark' ? 'light' : 'dark');
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [triggerModeTransition]);

  return (
    <ThemeCtx.Provider value={{ mode, tone, setMode, setTone, triggerModeTransition, transOverlay }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
