import { useLayoutEffect, useRef, useState } from 'react';

// Measures the navpill's .navpill__item.active so one absolutely-positioned
// .navpill__ind can slide between items instead of the fill teleporting.
// `key` must change whenever the active item or the item set changes.
// First placement is not animated (live: false); later moves are.
export function usePillIndicator(key) {
  const navRef = useRef(null);
  const [box, setBox] = useState(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const el = nav.querySelector('.navpill__item.active');
      if (!el) { setBox(null); return; }
      // Chromium pixel-snaps each edge of a box's background; snap both edges the same
      // way so the sliding fill lands exactly where the item's own fill would paint.
      // (offsetWidth rounds the width alone, which can leave the fill 1px short.)
      // Relative to the nav's padding edge, which is where position:absolute 0,0 lands.
      const dpr = window.devicePixelRatio || 1;
      const snap = v => Math.round(v * dpr) / dpr;
      const n = nav.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      // nav-local coordinates: the nav sits at a fractional translateX(-50%), and items snap inside it
      const ox = n.left + nav.clientLeft, oy = n.top + nav.clientTop;
      const x = snap(r.left - ox), y = snap(r.top - oy);
      const next = { x, y, w: snap(r.right - ox) - x, h: snap(r.bottom - oy) - y };
      setBox(prev => {
        if (prev && prev.x === next.x && prev.y === next.y && prev.w === next.w && prev.h === next.h) return prev;
        return { ...next, live: !!prev };
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    nav.querySelectorAll('.navpill__item').forEach(b => ro.observe(b));
    return () => ro.disconnect();
  }, [key]);

  const indicator = box && (
    <span
      className={'navpill__ind' + (box.live ? ' is-live' : '')}
      aria-hidden="true"
      style={{ width: box.w, height: box.h, transform: `translate(${box.x}px, ${box.y}px)` }}
    />
  );

  return { navRef, indicator, navClass: box ? ' navpill--ind' : '' };
}
