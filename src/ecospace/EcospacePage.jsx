import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import World from './World';
import Player from './Player';
import { ISLANDS, islandAt, routeTo } from './islands';
import './ecospace.css';

export default function EcospacePage() {
  const walkableRef = useRef();
  const queueRef = useRef([]);           // autopilot waypoints: [[x,z], ...]
  const seenRef = useRef(new Set());
  const [islandId, setIslandId] = useState('hub');
  const [overlay, setOverlay] = useState(null); // island object or null
  const islandRef = useRef('hub');

  const handleMove = useCallback((x, z) => {
    if (import.meta.env.DEV) window.__ecoPos = [x.toFixed(2), z.toFixed(2), performance.now() | 0];
    const isl = islandAt(x, z);
    const id = isl ? isl.id : null;
    if (id && id !== islandRef.current) {
      islandRef.current = id;
      setIslandId(id);
      if (!seenRef.current.has(id)) {
        seenRef.current.add(id);
        queueRef.current.length = 0;
        setOverlay(isl);
      }
    }
  }, []);

  const handleGroundClick = useCallback((e) => {
    e.stopPropagation();
    if (overlay) return;
    queueRef.current = [[e.point.x, e.point.z]];
  }, [overlay]);

  const fly = (destId) => {
    setOverlay(null);
    queueRef.current = routeTo(islandRef.current, destId);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOverlay(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const current = ISLANDS.find(i => i.id === islandId);

  return (
    <div className="eco-root">
      <Canvas camera={{ fov: 45, position: [0, 12, 19], near: 0.1, far: 300 }} dpr={[1, 2]}>
        <color attach="background" args={['#bfe8f7']} />
        <fog attach="fog" args={['#bfe8f7', 70, 160]} />
        <World walkableRef={walkableRef} onGroundClick={handleGroundClick} />
        <Player
          walkableRef={walkableRef}
          queueRef={queueRef}
          paused={overlay !== null}
          onMove={handleMove}
        />
      </Canvas>

      <div className="eco-hud-hint">wasd / arrows walk · click ground to move · esc closes boxes</div>

      <div className="eco-hud-fly">
        <div className="eco-hud-fly-label">fly</div>
        {ISLANDS.map(i => (
          <button
            key={i.id}
            className={i.id === islandId ? 'on' : ''}
            onClick={() => fly(i.id)}
          >{i.name}</button>
        ))}
      </div>

      {current && !overlay && (
        <button className="eco-plate" onClick={() => setOverlay(current)}>
          {current.name} <span>· read</span>
        </button>
      )}

      {overlay && (
        <div className="eco-dlg-wrap" onClick={() => setOverlay(null)}>
          <div className="eco-dlg" onClick={e => e.stopPropagation()}>
            <div className="eco-dlg-name">{overlay.name}</div>
            {overlay.lines.map((l, i) => <p key={i}>{l}</p>)}
            <span className="eco-dlg-adv" onClick={() => setOverlay(null)}>▼</span>
          </div>
        </div>
      )}
    </div>
  );
}
