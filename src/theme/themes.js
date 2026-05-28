export const themes = {
  crimson: {
    name: 'crimson',
    fonts: {
      display: '"Instrument Serif", "Cormorant Garamond", Georgia, serif',
      body:    '"Manrope", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      mono:    '"IBM Plex Mono", "JetBrains Mono", monospace',
    },
    light: {
      bg:          '#f6f1e6',
      bg2:         '#efe7d4',
      surf:        '#fbf7ee',
      surf2:       'rgba(251,247,238,0.92)',
      line:        '#dccdaf',
      line2:       '#1a140e',
      ink:         '#1a140e',
      ink2:        '#5e4e3a',
      ink3:        '#9c8a6f',
      accent:      '#c8341e',
      accent2:     '#e14b3a',
      'surf-blur':   '0px',
      'surf-radius': '4px',
      'surf-shadow': '0 1px 0 rgba(40,20,10,0.04)',
      'surf-border': '1px solid var(--line)',
      'pill-shadow': '0 14px 40px rgba(40,20,10,0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
      'glow-a':      'transparent',
      'glow-b':      'transparent',
    },
    dark: {
      bg:          '#15110d',
      bg2:         '#1e1812',
      surf:        '#221a14',
      surf2:       'rgba(33,26,20,0.86)',
      line:        '#3a2e22',
      line2:       '#f0e6d4',
      ink:         '#f0e6d4',
      ink2:        '#bca890',
      ink3:        '#7a6a55',
      accent:      '#e14b3a',
      accent2:     '#f56f54',
      'surf-blur':   '0px',
      'surf-radius': '4px',
      'surf-shadow': '0 1px 0 rgba(0,0,0,0.25)',
      'surf-border': '1px solid var(--line)',
      'pill-shadow': '0 14px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(225,75,58,0.08), inset 0 1px 0 rgba(240,230,212,0.06)',
      'glow-a':      'transparent',
      'glow-b':      'transparent',
    },
  },

  glass: {
    name: 'glass',
    fonts: {
      display: '"Manrope", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      body:    '"Manrope", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      mono:    '"IBM Plex Mono", "JetBrains Mono", monospace',
    },
    light: {
      bg:          '#f7f6fb',
      bg2:         '#eeecf6',
      surf:        'rgba(255,255,255,0.65)',
      surf2:       'rgba(255,255,255,0.62)',
      line:        'rgba(110,69,255,0.18)',
      line2:       'rgba(20,15,40,0.12)',
      ink:         '#0e0b1a',
      ink2:        '#4a4565',
      ink3:        '#8a85a5',
      accent:      '#6e45ff',
      accent2:     '#9b8aff',
      'surf-blur':   '16px',
      'surf-radius': '18px',
      'surf-shadow': '0 8px 32px rgba(110,69,255,0.10), inset 0 1px 0 rgba(255,255,255,0.7)',
      'surf-border': '1px solid var(--line)',
      'pill-shadow': '0 12px 40px rgba(110,69,255,0.16), inset 0 1px 0 rgba(255,255,255,0.8)',
      'glow-a':      'radial-gradient(1200px 600px at 80% -10%, rgba(110,69,255,0.18), transparent 60%)',
      'glow-b':      'radial-gradient(900px 500px at -10% 90%, rgba(178,140,255,0.12), transparent 60%)',
    },
    dark: {
      bg:          '#0a0814',
      bg2:         '#13102a',
      surf:        'rgba(255,255,255,0.04)',
      surf2:       'rgba(20,15,40,0.55)',
      line:        'rgba(155,138,255,0.18)',
      line2:       'rgba(255,255,255,0.10)',
      ink:         '#f0ecff',
      ink2:        '#b3aad0',
      ink3:        '#6f6890',
      accent:      '#9b8aff',
      accent2:     '#c2b3ff',
      'surf-blur':   '16px',
      'surf-radius': '18px',
      'surf-shadow': '0 8px 32px rgba(110,69,255,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
      'surf-border': '1px solid var(--line)',
      'pill-shadow': '0 12px 40px rgba(110,69,255,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
      'glow-a':      'radial-gradient(1200px 600px at 80% -10%, rgba(110,69,255,0.32), transparent 60%)',
      'glow-b':      'radial-gradient(900px 500px at -10% 90%, rgba(60,40,160,0.28), transparent 65%)',
    },
  },
};

export function applyTheme(themeName, mode) {
  const theme = themes[themeName];
  if (!theme) return;
  const root = document.documentElement;
  const tokens = theme[mode];
  for (const [k, v] of Object.entries(tokens)) {
    root.style.setProperty('--' + k, v);
  }
  root.style.setProperty('--font-display', theme.fonts.display);
  root.style.setProperty('--font-body',    theme.fonts.body);
  root.style.setProperty('--font-mono',    theme.fonts.mono);
  root.dataset.theme = themeName;
  root.dataset.mode  = mode;
}
