import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ISLANDS } from './islands';

const GRAY_TOP = '#b8bdb6';
const GRAY_SIDE = '#9aa097';
const GRAY_PROP = '#a8ada4';
const BRIDGE = '#c4c8c0';

function Island({ isl, onGroundClick }) {
  const [x, , z] = isl.pos;
  return (
    <group position={[x, 0, z]}>
      {/* walkable top disc — name flags it for the ground raycast */}
      <mesh name="walkable" position={[0, -0.5, 0]} onPointerDown={onGroundClick}>
        <cylinderGeometry args={[isl.r, isl.r, 1, 40]} />
        <meshStandardMaterial color={GRAY_TOP} />
      </mesh>
      {/* underside cone silhouette */}
      <mesh position={[0, -4.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[isl.r * 0.92, 7, 9]} />
        <meshStandardMaterial color={GRAY_SIDE} flatShading />
      </mesh>
    </group>
  );
}

function Bridge({ from, to, onGroundClick }) {
  const ax = from.pos[0], az = from.pos[2];
  const bx = to.pos[0], bz = to.pos[2];
  const dx = bx - ax, dz = bz - az;
  const dist = Math.hypot(dx, dz);
  const ux = dx / dist, uz = dz / dist;
  // span from edge to edge, tucked 1 unit into each island
  const start = from.r - 1;
  const end = dist - (to.r - 1);
  const len = end - start;
  const cx = ax + ux * (start + len / 2);
  const cz = az + uz * (start + len / 2);
  const rotY = Math.atan2(dx, dz);
  return (
    <mesh name="walkable" position={[cx, -0.3, cz]} rotation={[0, rotY, 0]} onPointerDown={onGroundClick}>
      <boxGeometry args={[4, 0.6, len]} />
      <meshStandardMaterial color={BRIDGE} />
    </mesh>
  );
}

// a few gray props per island so places read as places, not discs
function Props() {
  const props = useMemo(() => {
    const out = [];
    ISLANDS.forEach((isl, ii) => {
      const n = isl.id === 'hub' ? 3 : 5;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + ii * 1.7;
        const rr = isl.r * (0.55 + 0.3 * ((k * 7 + ii * 3) % 5) / 5);
        const h = 0.8 + ((k * 13 + ii * 5) % 7) * 0.45;
        out.push({
          x: isl.pos[0] + Math.cos(a) * rr,
          z: isl.pos[2] + Math.sin(a) * rr,
          h,
          box: (k + ii) % 3 !== 0,
        });
      }
    });
    return out;
  }, []);
  return props.map((p, i) => (
    <mesh key={i} position={[p.x, p.h / 2, p.z]}>
      {p.box
        ? <boxGeometry args={[1.1, p.h, 1.1]} />
        : <coneGeometry args={[0.8, p.h, 6]} />}
      <meshStandardMaterial color={GRAY_PROP} flatShading />
    </mesh>
  ));
}

function Clouds() {
  const group = useRef();
  const clouds = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      x: -90 + (i * 37) % 180,
      y: -10 - (i % 4) * 3,
      z: -80 + (i * 53) % 160,
      s: 4 + (i % 5) * 2,
      v: 0.6 + (i % 3) * 0.35,
    })), []);
  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.children.forEach((m, i) => {
      m.position.x += clouds[i].v * dt;
      if (m.position.x > 110) m.position.x = -110;
    });
  });
  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]} scale={[c.s, c.s * 0.35, c.s * 0.6]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

export default function World({ walkableRef, onGroundClick }) {
  const hub = ISLANDS[0];
  return (
    <group>
      <ambientLight intensity={0.85} />
      <directionalLight position={[30, 50, 20]} intensity={1.1} />
      {/* everything named "walkable" is collected under this group for raycasts */}
      <group ref={walkableRef}>
        {ISLANDS.map(isl => <Island key={isl.id} isl={isl} onGroundClick={onGroundClick} />)}
        {ISLANDS.slice(1).map(isl => (
          <Bridge key={isl.id} from={hub} to={isl} onGroundClick={onGroundClick} />
        ))}
      </group>
      <Props />
      <Clouds />
    </group>
  );
}
