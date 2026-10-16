import { useState, useEffect, useRef } from 'react';
import '../styles/cs-inspector.css';
import { scrollToEl } from '../utils/motion';

function isNoteKey(k) {
  return /(_note|_signature|inspector_note|philosophy)$/i.test(k);
}

function renderValue(v, depth) {
  const pad = '  '.repeat(depth);
  if (v === null) return '<span class="j-null">null</span>';
  if (typeof v === 'boolean') return `<span class="j-b">${v}</span>`;
  if (typeof v === 'number') return `<span class="j-n">${v}</span>`;
  if (typeof v === 'string') {
    const esc = v.replace(/[<>&]/g, ch => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[ch]));
    return `<span class="j-s">"${esc}"</span>`;
  }
  if (Array.isArray(v)) {
    if (v.length === 0) return '<span class="j-p">[]</span>';
    const inner = v.map(item => `${pad}  ${renderValue(item, depth + 1)}`).join(',\n');
    return `<span class="j-p">[</span>\n${inner}\n${pad}<span class="j-p">]</span>`;
  }
  if (typeof v === 'object') {
    const keys = Object.keys(v);
    if (keys.length === 0) return '<span class="j-p">{}</span>';
    const inner = keys.map(k => {
      // API_HANDOVER_v3.2: sections live nested in sections[] rather than as top-level keys, so a
      // section is no longer identifiable by its JSON key name — it's identifiable by its own "id"
      // field. Tag that field's line so hover-linking can key off it instead (see keyMap usage below).
      const sectionAttr = (k === 'id' && typeof v[k] === 'string') ? ` data-section-id="${v[k]}"` : '';
      const line = `${pad}  <span class="j-k" data-key="${k}"${sectionAttr}>"${k}"</span><span class="j-p">:</span> ${renderValue(v[k], depth + 1)}`;
      const cls = isNoteKey(k) ? 'j-line is-note' : 'j-line';
      return `<span class="${cls}">${line}</span>`;
    }).join('<span class="j-p">,</span>\n');
    return `<span class="j-p">{</span>\n${inner}\n${pad}<span class="j-p">}</span>`;
  }
  return String(v);
}

export default function ServiceInspector({
  data = {},
  endpoint = '/api/v1/projects/cod-rto',
  statusMs = 12,
  keyMap = {},
  footer = 'The right people know what they\'re looking at.',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const bodyRef = useRef(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    function onKey(e) {
      if (/input|textarea/i.test(e.target?.tagName || '')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'j' || e.key === 'J') setIsOpen(o => !o);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!bodyRef.current) return;
    const cleanups = [];

    const bind = (el, targetId, sourceKey) => {
      const sect = document.getElementById(targetId);
      if (!sect) return;
      sect.setAttribute('data-source-key', sourceKey);
      const enter = () => { el.classList.add('is-hot'); sect.classList.add('ins-highlight'); };
      const leave = () => { el.classList.remove('is-hot'); sect.classList.remove('ins-highlight'); };
      const click = (e) => { e.stopPropagation(); scrollToEl(sect); };
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      el.addEventListener('click', click);
      cleanups.push(() => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
        el.removeEventListener('click', click);
      });
    };

    // Top-level keys (overview, metrics) — explicit caller-provided map.
    bodyRef.current.querySelectorAll('.j-k[data-key]').forEach(kEl => {
      const targetId = keyMap[kEl.getAttribute('data-key')];
      if (targetId) bind(kEl, targetId, kEl.getAttribute('data-key'));
    });

    // Section entries nested in sections[] — matched by their own "id" value (data-section-id,
    // tagged in renderValue) rather than a top-level key, since v3.2 moved them into an array.
    bodyRef.current.querySelectorAll('.j-k[data-section-id]').forEach(kEl => {
      const targetId = kEl.getAttribute('data-section-id');
      bind(kEl, targetId, targetId);
    });

    return () => cleanups.forEach(fn => fn());
  }, [keyMap, isOpen]);

  const jsonHtml = renderValue(data, 0);

  return (
    <>
      <button className="ins-hint" aria-label="Open service inspector" onClick={() => isOpen ? close() : open()}>
        <span className="ins-hint__dot" aria-hidden="true" />
        <span className="ins-hint__status">200 OK</span>
        <span className="ins-hint__ms">{statusMs}ms</span>
        <span className="ins-hint__brace">{'{ }'}</span>
      </button>

      <div
        className={'ins-backdrop' + (isOpen ? ' open' : '')}
        aria-hidden="true"
        onClick={close}
      />

      <aside
        className={'ins-drawer' + (isOpen ? ' open' : '')}
        aria-hidden={!isOpen}
        role="dialog"
      >
        <div className="ins-drawer__header">
          <span className="ins-drawer__icon">{'{}'}</span>
          <span className="ins-drawer__title">Service Inspector</span>
          <span className="ins-drawer__badge">live</span>
          <div className="ins-drawer__spacer" />
          <button className="ins-drawer__close" aria-label="Close inspector" onClick={close}>×</button>
        </div>
        <div className="ins-drawer__req">
          <span className="ins-drawer__verb">GET</span>
          <span className="ins-drawer__path">{endpoint}</span>
          <span className="ins-drawer__sep">→</span>
          <span className="ins-drawer__status">● 200 OK</span>
          <span className="ins-drawer__ms">{statusMs}ms</span>
        </div>
        <div className="ins-drawer__tabs">
          <button className="ins-drawer__tab active" type="button">Response · Body</button>
        </div>
        <div className="ins-drawer__body" ref={bodyRef}>
          <pre dangerouslySetInnerHTML={{ __html: jsonHtml }} />
        </div>
        <div className="ins-drawer__foot">{footer}</div>
      </aside>
    </>
  );
}
