import { useEffect, useRef } from 'react';

export function useReveal(deps = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current || document;
    const els = Array.from(container.querySelectorAll('.reveal:not(.in-view)'));

    function reveal(el) {
      if (document.visibilityState === 'hidden') el.classList.add('no-anim');
      el.classList.add('in-view');
    }

    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('no-anim', 'in-view');
      }
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, deps);

  return containerRef;
}
