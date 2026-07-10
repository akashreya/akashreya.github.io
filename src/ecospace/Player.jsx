import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SPEED = 9;
const CAM_OFFSET = new THREE.Vector3(0, 12, 15);
const DOWN = new THREE.Vector3(0, -1, 0);

// Kinematic controller: WASD/arrows override autopilot; ground is whatever
// the down-raycast hits in walkableRef — no hit means an edge, so we slide or stop.
export default function Player({ walkableRef, queueRef, paused, onMove }) {
  const body = useRef();
  const keys = useRef({});
  const ray = useRef(new THREE.Raycaster());
  const yaw = useRef(0);
  const tmp = useRef({
    pos: new THREE.Vector3(0, 0, 4),
    goal: new THREE.Vector3(),
    look: new THREE.Vector3(),
    origin: new THREE.Vector3(),
  });
  const moveClock = useRef(0);

  useEffect(() => {
    const dn = e => { keys.current[e.code] = true; };
    const up = e => { keys.current[e.code] = false; };
    const blur = () => { keys.current = {}; };
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', dn);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, []);

  const groundAt = (x, z) => {
    const t = tmp.current;
    t.origin.set(x, 25, z);
    ray.current.set(t.origin, DOWN);
    const hits = ray.current.intersectObjects(walkableRef.current?.children ?? [], true);
    return hits.length ? hits[0].point.y : null;
  };

  useFrame((state, rawDt) => {
    const t = tmp.current;
    const dt = Math.min(rawDt, 0.05);
    const k = keys.current;

    let dx = 0, dz = 0;
    if (!paused) {
      dx = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0);
      dz = (k.KeyS || k.ArrowDown ? 1 : 0) - (k.KeyW || k.ArrowUp ? 1 : 0);
    }

    if (dx || dz) {
      queueRef.current.length = 0; // manual input cancels autopilot
      const inv = 1 / Math.hypot(dx, dz);
      dx *= inv; dz *= inv;
    } else if (!paused && queueRef.current.length) {
      const [wx, wz] = queueRef.current[0];
      const ex = wx - t.pos.x, ez = wz - t.pos.z;
      const d = Math.hypot(ex, ez);
      if (d < 0.6) {
        queueRef.current.shift();
      } else {
        dx = ex / d; dz = ez / d;
      }
    }

    if (dx || dz) {
      const step = SPEED * dt;
      let nx = t.pos.x + dx * step;
      let nz = t.pos.z + dz * step;
      let gy = groundAt(nx, nz);
      if (gy === null) { // edge: try sliding on one axis
        gy = groundAt(nx, t.pos.z);
        if (gy !== null) { nz = t.pos.z; }
        else {
          gy = groundAt(t.pos.x, nz);
          if (gy !== null) { nx = t.pos.x; }
        }
      }
      if (gy !== null) {
        t.pos.set(nx, gy, nz);
        yaw.current = Math.atan2(dx, dz);
      } else if (queueRef.current.length) {
        queueRef.current.length = 0; // autopilot walked into a wall; give up quietly
      }
    }

    if (body.current) {
      body.current.position.copy(t.pos);
      body.current.rotation.y += (yaw.current - body.current.rotation.y) * Math.min(1, dt * 10);
    }

    // fixed-angle follow camera (GBA overworld feel)
    t.goal.copy(t.pos).add(CAM_OFFSET);
    const a = 1 - Math.pow(0.0001, dt);
    state.camera.position.lerp(t.goal, a);
    t.look.copy(t.pos).setY(t.pos.y + 1);
    state.camera.lookAt(t.look);

    moveClock.current += dt;
    if (moveClock.current > 0.15) {
      moveClock.current = 0;
      onMove(t.pos.x, t.pos.z);
    }
  });

  return (
    <group ref={body}>
      {/* the one colored thing in the graybox: you */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.55, 0.9, 6, 14]} />
        <meshStandardMaterial color="#9ade7b" />
      </mesh>
      {/* nose cone = facing direction */}
      <mesh position={[0, 1.1, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 0.5, 8]} />
        <meshStandardMaterial color="#2e7d46" />
      </mesh>
      {/* blob shadow — cheap ground contact so edges are judgeable */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.75, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}
