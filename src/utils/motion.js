export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// smooth unless the visitor asked for reduced motion; CSS scroll-behavior is gated the same way
export function scrollToEl(el) {
  el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

// coalesce bursts (scroll, resize) into one call per frame
export function rafThrottle(fn) {
  let frame = 0;
  const run = () => { frame = 0; fn(); };
  const throttled = () => { if (!frame) frame = requestAnimationFrame(run); };
  throttled.cancel = () => { cancelAnimationFrame(frame); frame = 0; };
  return throttled;
}
