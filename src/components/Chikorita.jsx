import { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeProvider';

// frames live under site/chikorita/ on the asset CDN (VITE_CDN_URL, no trailing slash).
// no env var -> no buddy: she is decorative and degrades to absent, never broken.
const CDN = import.meta.env.VITE_CDN_URL;
const FRAMES = CDN && {
  idle: `${CDN}/site/chikorita/idle.png`,
  walk: `${CDN}/site/chikorita/walk-a.png`,
  notice: `${CDN}/site/chikorita/notice_a.png`,
  wink: `${CDN}/site/chikorita/wink.png`,
  sleep: `${CDN}/site/chikorita/sleep.png`,
  tackle: `${CDN}/site/chikorita/tackle.png`,
  blink: `${CDN}/site/chikorita/blink.png`,
};

const WALK_EVERY = [20000, 45000]; // ms between strolls
const WALK_SPEED = 55;             // px/s
const STEP_MS = 260;               // walk frame alternation
const NOTICE_RADIUS = 130;
const NOTICE_COOLDOWN = 8000;
const SLEEP_AFTER = 90000;
const DASH_CHANCE = 0.12;
const EXIT_CHANCE = 0.12;          // stroll off-screen, wander back in from the other side

// resting spots: outside the navpill band (center ~30-70vw) and clear of the
// theme hint (bottom right). She may CROSS chrome mid-walk but never parks on it.
function pickTarget() {
  const vw = window.innerWidth;
  const zones = [
    [16, vw * 0.30 - 110],
    [vw * 0.70, vw - 270],
  ].filter(([a, b]) => b - a > 30);
  if (!zones.length) return 16; // tiny viewport: park at the left edge
  const [a, b] = zones[Math.floor(Math.random() * zones.length)];
  return a + Math.random() * (b - a);
}

export default function Chikorita() {
  const { mode } = useTheme();
  const rootRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (mode !== 'personal' || !FRAMES) return;
    const root = rootRef.current;
    const img = imgRef.current;
    const flip = root.querySelector('.chk-flip');

    let x = Math.min(90, window.innerWidth - 120);
    root.style.left = `${x}px`;
    Object.values(FRAMES).forEach((src) => { new Image().src = src; });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let state = 'idle'; // idle | walking | notice | sleeping | dashing | wink
    let lastNotice = 0;
    const timers = new Set();
    let stepInterval, walkTimer, sleepTimer;

    const after = (ms, fn) => {
      const t = setTimeout(() => { timers.delete(t); fn(); }, ms);
      timers.add(t);
      return t;
    };
    const setFrame = (name) => { img.src = FRAMES[name]; };
    const face = (dir) => flip.style.setProperty('--face', dir); // 1 = left, -1 = right
    const center = () => x + root.offsetWidth / 2;

    const toIdle = () => { state = 'idle'; root.className = 'chikorita'; setFrame('idle'); };

    let exiting = false;
    const walkTo = (target) => {
      state = 'walking';
      face(target < x ? 1 : -1);
      root.classList.add('is-walking');
      clearInterval(stepInterval);
      let step = false;
      stepInterval = setInterval(() => { step = !step; setFrame(step ? 'walk' : 'idle'); }, STEP_MS);
      root.style.transitionDuration = `${Math.abs(target - x) / WALK_SPEED}s`;
      root.style.left = `${target}px`;
      x = target;
    };

    const scheduleWalk = () => {
      clearTimeout(walkTimer);
      walkTimer = after(WALK_EVERY[0] + Math.random() * (WALK_EVERY[1] - WALK_EVERY[0]), () => {
        if (state !== 'idle') { scheduleWalk(); return; }
        if (Math.random() < EXIT_CHANCE) {
          exiting = true;
          walkTo(x < window.innerWidth / 2 ? -root.offsetWidth - 40 : window.innerWidth + 40);
        } else {
          walkTo(pickTarget());
        }
      });
    };

    const onArrive = (e) => {
      if (e.propertyName !== 'left' || state !== 'walking') return;
      clearInterval(stepInterval);
      root.style.transitionDuration = '0s';
      if (exiting) {
        // gone past the edge — slip around and wander back in from the other side
        exiting = false;
        state = 'idle';
        after(600 + Math.random() * 1400, () => {
          if (state !== 'idle') return;
          x = x < 0 ? window.innerWidth + 40 : -root.offsetWidth - 40;
          root.style.left = `${x}px`;
          requestAnimationFrame(() => walkTo(pickTarget()));
        });
        return;
      }
      if (Math.random() < DASH_CHANCE) {
        state = 'dashing';
        root.className = 'chikorita is-dashing';
        const dir = Math.random() < 0.5 ? 1 : -1;
        face(dir);
        root.style.setProperty('--dash', dir);
        setFrame('tackle');
        after(750, () => { toIdle(); scheduleWalk(); });
      } else {
        toIdle();
        scheduleWalk();
      }
    };

    const fallAsleep = () => {
      // never fall asleep mid-anything or while off-screen (unwakeable)
      if (state !== 'idle' || x < 0 || x > window.innerWidth - 20) { scheduleSleep(15000); return; }
      state = 'sleeping';
      setFrame('blink'); // drowsy beat before curling up
      after(700, () => {
        if (state !== 'sleeping') return;
        root.classList.add('is-sleeping');
        setFrame('sleep');
      });
    };
    const scheduleSleep = (ms = SLEEP_AFTER) => {
      clearTimeout(sleepTimer);
      sleepTimer = after(ms, fallAsleep);
    };
    const wake = () => { toIdle(); scheduleSleep(); };

    const onPointerMove = (e) => {
      scheduleSleep();
      const d = Math.abs(e.clientX - center());
      const near = d < NOTICE_RADIUS && Math.abs(e.clientY - (window.innerHeight - 60)) < 180;
      if (state === 'sleeping') { if (near) wake(); return; }
      if (state !== 'idle' || !near || Date.now() - lastNotice < NOTICE_COOLDOWN) return;
      lastNotice = Date.now();
      state = 'notice';
      face(e.clientX < center() ? 1 : -1);
      setFrame('notice');
      after(1400, () => { if (state === 'notice') toIdle(); });
    };

    const onActivity = () => scheduleSleep();
    const onClick = () => {
      if (state === 'sleeping') { wake(); return; }
      if (state === 'walking' || state === 'dashing') return;
      state = 'wink';
      root.classList.add('chk-hop');
      setFrame('wink');
      after(900, () => { if (state === 'wink') { toIdle(); } root.classList.remove('chk-hop'); });
    };

    setFrame('idle');
    root.addEventListener('transitionend', onArrive);
    root.addEventListener('click', onClick);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('scroll', onActivity, { passive: true });
    window.addEventListener('keydown', onActivity);
    scheduleWalk();
    scheduleSleep();

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(stepInterval);
      root.removeEventListener('transitionend', onArrive);
      root.removeEventListener('click', onClick);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onActivity);
      window.removeEventListener('keydown', onActivity);
    };
  }, [mode]);

  if (mode !== 'personal' || !FRAMES) return null;
  return (
    <div className="chikorita" aria-hidden="true" ref={rootRef}>
      <div className="chk-flip">
        <div className="chk-anim">
          <img
            ref={imgRef}
            src={FRAMES.idle}
            alt=""
            draggable="false"
            onError={() => { if (rootRef.current) rootRef.current.style.display = 'none'; }}
          />
        </div>
      </div>
      <span className="chk-z">z</span>
    </div>
  );
}
