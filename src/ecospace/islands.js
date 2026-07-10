// Graybox world data. Positions/radii in world units; all island tops at y=0.
// Bridges are radial (hub <-> island), so autopilot routes through the hub.

export const ISLANDS = [
  {
    id: 'hub',
    name: 'the hub',
    pos: [0, 0, 0],
    r: 12,
    lines: [
      "you're the chikorita. that's the whole tutorial.",
      'wasd walks. clicking the ground also walks. fly menu top-right.',
    ],
  },
  {
    id: 'grass',
    name: 'tall grass',
    pos: [34, 0, -14],
    r: 11,
    lines: [
      'DEX No. 005 — HOT WATER. consumed daily at 06:30. not coffee. not tea. observed for 13 years with no signs of being a phase.',
      'DEX No. 003 — FICTION. two novels, neither finished. the research for both was extremely thorough.',
      'DEX No. 006 — THE DIFF TOOL. 4.5 hours → 30 seconds. still no README. planning PyPI eventually.',
    ],
  },
  {
    id: 'made',
    name: 'things i made',
    pos: [-34, 0, -16],
    r: 13,
    lines: [
      'eight things shipped. eight badges.',
      'cod/rto · ivr simulator · poketopia · everything abc — case studies open as overlays here, eventually.',
    ],
  },
  {
    id: 'fame',
    name: 'hall of fame',
    pos: [10, 0, -42],
    r: 8,
    lines: [
      'first place, fico gsi partner hackathon 2026. demoed at fico world while i was in bengaluru. the platform ran. that was kind of the point.',
    ],
  },
  {
    id: 'league',
    name: 'the league',
    pos: [-14, 0, 36],
    r: 10,
    lines: [
      'enterprise floor. lseg · goldman sachs · reuters · sita. 13 years. mostly, nothing broke.',
    ],
  },
  {
    id: 'center',
    name: 'pokémon center',
    pos: [26, 0, 26],
    r: 8,
    lines: [
      'the place you go to recover. github · linkedin · email.',
    ],
  },
];

export const HUB = ISLANDS[0];

export function islandAt(x, z) {
  for (const isl of ISLANDS) {
    const dx = x - isl.pos[0];
    const dz = z - isl.pos[2];
    if (dx * dx + dz * dz <= isl.r * isl.r) return isl;
  }
  return null;
}

// Waypoint route between islands. Bridges are radial (hub <-> island), and
// the only line guaranteed to lie on a bridge is center-to-center — so every
// hop goes: my island's center -> hub center -> destination center.
export function routeTo(fromId, destId) {
  const dest = ISLANDS.find(i => i.id === destId);
  if (!dest) return [];
  const center = i => [i.pos[0], i.pos[2]];
  if (fromId === destId) return [center(dest)];
  const from = ISLANDS.find(i => i.id === fromId);
  const path = [];
  if (from && from.id !== 'hub') path.push(center(from));
  path.push(center(HUB));
  if (destId !== 'hub') path.push(center(dest));
  return path;
}
