import { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeProvider';

const STEP = 34;        // px of cursor travel between prints
const SIDE_OFFSET = 6;  // perpendicular gap between left/right feet
const MAX_PRINTS = 60;
const IDLE_WIPE_MS = 2500;

// shoe print, toe up: sole leaning slightly right + heel; mirrored for the left foot
const PRINT_SVG =
  '<svg viewBox="0 0 12 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M6.8 0.4 C9.6 0.8 11 3.4 10.8 6.8 C10.6 9.8 9 12.2 6.4 12.4 C3.6 12.6 1.6 10.4 1.4 7.2 C1.2 3.8 3.6 0 6.8 0.4 Z"/>' +
  '<ellipse cx="6.2" cy="18.4" rx="3.3" ry="3.1"/>' +
  '</svg>';

function pointerAllowed() {
  return (
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function Footprints() {
  const { mode } = useTheme();
  const layerRef = useRef(null);
  const active = mode === 'personal' && typeof window !== 'undefined' && pointerAllowed();

  useEffect(() => {
    if (!active) return;
    const layer = layerRef.current;
    let last = null;
    let side = 1;
    let wiping = false;
    let wipeTimer, clearTimer;

    const spawn = (x, y, theta) => {
      const el = document.createElement('span');
      el.className = 'fp';
      el.innerHTML = PRINT_SVG;
      el.style.left = `${x - 6}px`;
      el.style.top = `${y - 11}px`;
      el.style.transform =
        `rotate(${theta * (180 / Math.PI) + 90}deg)` + (side < 0 ? ' scaleX(-1)' : '');
      el.addEventListener('animationend', () => el.remove());
      layer.appendChild(el);
      while (layer.childElementCount > MAX_PRINTS) layer.firstElementChild.remove();
    };

    const scheduleWipe = () => {
      clearTimeout(wipeTimer);
      wipeTimer = setTimeout(() => {
        wiping = true;
        layer.classList.add('fp-wipe');
        clearTimer = setTimeout(() => {
          layer.replaceChildren();
          layer.classList.remove('fp-wipe');
          wiping = false;
        }, 600);
      }, IDLE_WIPE_MS);
    };

    const onMove = (e) => {
      if (wiping) {
        // mischief managed — a wipe in progress finishes clean, no resurrected prints
        clearTimeout(clearTimer);
        layer.replaceChildren();
        layer.classList.remove('fp-wipe');
        wiping = false;
        last = null;
      }
      const x = e.pageX;
      const y = e.pageY;
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        if (Math.hypot(dx, dy) >= STEP) {
          const theta = Math.atan2(dy, dx);
          spawn(
            x - Math.sin(theta) * SIDE_OFFSET * side,
            y + Math.cos(theta) * SIDE_OFFSET * side,
            theta
          );
          side = -side;
          last = { x, y };
        }
      } else {
        last = { x, y };
      }
      scheduleWipe();
    };

    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      clearTimeout(wipeTimer);
      clearTimeout(clearTimer);
      layer.replaceChildren();
      layer.classList.remove('fp-wipe');
    };
  }, [active]);

  if (!active) return null;
  return <div className="footprints" aria-hidden="true" ref={layerRef} />;
}
