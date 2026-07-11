export const themes = {
  recruiter: {
    name: 'recruiter',
    fonts: {
      display: '"Instrument Serif", "Cormorant Garamond", Georgia, serif',
      body:    '"Manrope", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      mono:    '"IBM Plex Mono", "JetBrains Mono", monospace',
      script:  '"Instrument Serif", Georgia, serif',
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

  personal: {
    name: 'personal',
    fonts: {
      display: '"Fondamento", "Alegreya", Georgia, serif',
      body:    '"Alegreya", Georgia, serif',
      mono:    '"IBM Plex Mono", "JetBrains Mono", monospace',
      script:  '"Sacramento", "Fondamento", cursive',
    },
    /* parchment: light = day parchment, dark = wandlight */
    /* light ground/lines/ink2 sampled from the film prop (color-hex palette 66316):
       #ccb891 ground, #a59172 aged mid, #f6f4ef highlight, #4d4735 ink, #5a0606 seal red */
    light: {
      bg:          '#ccb891',
      bg2:         '#bfa87c',
      surf:        '#e0d3ae',
      surf2:       'rgba(224,211,174,0.93)',
      line:        '#a59172',
      line2:       '#33240f',
      ink:         '#33240f',
      ink2:        '#4d4735',
      ink3:        '#82724f',
      accent:      '#38591f',
      accent2:     '#567f38',
      'surf-blur':   '0px',
      'surf-radius': '10px',
      'surf-shadow': '0 2px 12px rgba(72,50,20,0.12), inset 0 1px 0 rgba(246,244,239,0.5)',
      'surf-border': '1px solid var(--line)',
      'pill-shadow': '0 14px 40px rgba(72,50,20,0.22), inset 0 1px 0 rgba(246,244,239,0.6)',
      'glow-a':      'radial-gradient(1000px 600px at 78% -8%, rgba(115,80,30,0.20), transparent 60%)',
      'glow-b':      'radial-gradient(800px 520px at -8% 92%, rgba(90,64,24,0.16), transparent 62%)',
    },
    dark: {
      bg:          '#1b1408',
      bg2:         '#241a0c',
      surf:        '#271e10',
      surf2:       'rgba(39,30,16,0.90)',
      line:        '#453519',
      line2:       '#ecdcb2',
      ink:         '#ecdcb2',
      ink2:        '#bda87a',
      ink3:        '#82704b',
      accent:      '#8fb96a',
      accent2:     '#aed189',
      'surf-blur':   '0px',
      'surf-radius': '10px',
      'surf-shadow': '0 2px 14px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,235,190,0.05)',
      'surf-border': '1px solid var(--line)',
      'pill-shadow': '0 14px 40px rgba(0,0,0,0.50), 0 0 0 1px rgba(174,209,137,0.08), inset 0 1px 0 rgba(236,220,178,0.06)',
      'glow-a':      'radial-gradient(1000px 600px at 78% -8%, rgba(255,168,58,0.10), transparent 60%)',
      'glow-b':      'radial-gradient(800px 520px at -8% 92%, rgba(150,112,48,0.09), transparent 62%)',
    },
  },
};

export function applyTheme(modeName, tone) {
  const theme = themes[modeName];
  if (!theme) return;
  const root = document.documentElement;
  const tokens = theme[tone];
  for (const [k, v] of Object.entries(tokens)) {
    root.style.setProperty('--' + k, v);
  }
  root.style.setProperty('--font-display', theme.fonts.display);
  root.style.setProperty('--font-body',    theme.fonts.body);
  root.style.setProperty('--font-mono',    theme.fonts.mono);
  root.style.setProperty('--font-script',  theme.fonts.script);
  root.dataset.mode = modeName;
  root.dataset.tone = tone;
}
