import { hash, type Palette } from "./palettes";

/**
 * The world a garment stands in.
 *
 * DESIGN.md's art direction is urban architecture, concrete, stairwells, night
 * streets — so the stand-in draws a place rather than a backdrop. The setting
 * keys off the code *family*, which means a whole run reads as one location
 * while each frame within it still varies.
 *
 * Everything here is flat tone and straight edges: one horizon, one cast
 * shadow or one light shaft, and nothing that pretends to be a photograph.
 */

export type Setting =
  | "colonnade"
  | "stair"
  | "underpass"
  | "wall"
  | "window-grid"
  | "kerb";

const SETTINGS: Setting[] = [
  "colonnade",
  "stair",
  "underpass",
  "wall",
  "window-grid",
  "kerb",
];

export function settingFor(family: string): Setting {
  return SETTINGS[hash(`${family}-set`) % SETTINGS.length];
}

type Props = {
  w: number;
  h: number;
  /** Where the ground plane begins. */
  floor: number;
  palette: Palette;
  seed: number;
  /** The tone the buildings are drawn in — see `structureFor`. */
  tone: string;
  /** Opacity scale for that tone, so dark and light grounds read the same. */
  k: number;
};

/**
 * A building has to be visible against the sky behind it.
 *
 * On a light ground that means drawing in `ground` over `far`. On a night
 * ground the two are almost the same value, so the structure has to be drawn in
 * `form` — the light tone — at a much lower opacity instead. Getting this wrong
 * is what makes a dark frame look like an empty rectangle.
 */
function structureFor(palette: Palette): { tone: string; k: number } {
  return palette.dark ? { tone: palette.form, k: 0.4 } : { tone: palette.ground, k: 1 };
}

function Colonnade({ w, h, floor, seed, tone, k }: Props) {
  const count = 4 + (seed % 3);
  const step = w / count;
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <rect
          key={i}
          x={i * step + step * 0.12}
          y={h * 0.04}
          width={step * 0.34}
          height={floor - h * 0.04}
          fill={tone}
          opacity={(0.3 + (i % 2) * 0.16) * k}
        />
      ))}
      <rect x="0" y={h * 0.04} width={w} height={h * 0.03} fill={tone} opacity={0.5 * k} />
    </>
  );
}

function Stair({ w, h, floor, palette, seed, tone, k }: Props) {
  const steps = 5 + (seed % 3);
  const rise = (floor - h * 0.14) / steps;
  const run = (w * 0.62) / steps;
  return (
    <>
      {Array.from({ length: steps }, (_, i) => (
        <rect
          key={i}
          x={w * 0.34 - i * run * 0.34}
          y={floor - (i + 1) * rise}
          width={w * 0.66 + i * run * 0.34}
          height={rise}
          fill={tone}
          opacity={(0.18 + i * 0.07) * k}
        />
      ))}
      <path
        d={`M${w * 0.34},${floor} L${w * 0.34 - steps * run * 0.34},${floor - steps * rise}`}
        stroke={palette.line}
        strokeWidth="1.5"
        opacity="0.5"
        fill="none"
      />
    </>
  );
}

function Underpass({ w, h, floor, palette, tone, k }: Props) {
  const springs = h * 0.16;
  return (
    <>
      <path
        d={`M${w * 0.2},${floor} L${w * 0.2},${springs + h * 0.14}
            Q${w * 0.5},${springs - h * 0.06} ${w * 0.8},${springs + h * 0.14}
            L${w * 0.8},${floor} Z`}
        fill={tone}
        opacity={0.42 * k}
      />
      {/* The mouth of the underpass — always darker than the wall around it. */}
      <path
        d={`M${w * 0.28},${floor} L${w * 0.28},${springs + h * 0.2}
            Q${w * 0.5},${springs + h * 0.04} ${w * 0.72},${springs + h * 0.2}
            L${w * 0.72},${floor} Z`}
        fill={palette.far}
        opacity="0.9"
      />
    </>
  );
}

function Wall({ w, h, floor, palette, seed, tone, k }: Props) {
  const joint = floor * (0.42 + (seed % 3) * 0.08);
  return (
    <>
      <rect x="0" y="0" width={w} height={joint} fill={tone} opacity={0.34 * k} />
      <rect x="0" y={joint} width={w} height="2" fill={palette.line} opacity="0.4" />
      <rect
        x={w * 0.58}
        y={joint + h * 0.06}
        width={w * 0.3}
        height={floor - joint - h * 0.14}
        fill={tone}
        opacity={0.18 * k}
      />
    </>
  );
}

function WindowGrid({ w, floor, seed, tone, k }: Props) {
  const cols = 3 + (seed % 2);
  const rows = 3;
  const cw = (w * 0.86) / cols;
  const ch = (floor * 0.62) / rows;
  return (
    <>
      {Array.from({ length: cols * rows }, (_, i) => (
        <rect
          key={i}
          x={w * 0.07 + (i % cols) * cw + cw * 0.14}
          y={floor * 0.08 + Math.floor(i / cols) * ch + ch * 0.16}
          width={cw * 0.72}
          height={ch * 0.64}
          fill={tone}
          opacity={(0.2 + ((i * 7) % 5) * 0.07) * k}
        />
      ))}
    </>
  );
}

function Kerb({ w, h, floor, seed, tone, k }: Props) {
  return (
    <>
      <rect x="0" y={h * 0.06} width={w} height={floor * 0.44} fill={tone} opacity={0.22 * k} />
      <rect x="0" y={floor - h * 0.03} width={w} height={h * 0.03} fill={tone} opacity={0.55 * k} />
      <rect
        x={w * (0.08 + (seed % 3) * 0.04)}
        y={floor - h * 0.22}
        width={w * 0.012}
        height={h * 0.22}
        fill={tone}
        opacity={0.6 * k}
      />
    </>
  );
}

const RENDERERS: Record<Setting, (props: Props) => React.ReactElement> = {
  colonnade: Colonnade,
  stair: Stair,
  underpass: Underpass,
  wall: Wall,
  "window-grid": WindowGrid,
  kerb: Kerb,
};

/**
 * The ground plane, the setting on it, and the horizon rule between them.
 * A dark palette gets a light pool instead of a cast shadow — a night street is
 * lit from a source, not from the sky.
 */
export function Architecture({
  setting,
  w,
  h,
  floor,
  palette,
  seed,
}: Omit<Props, "tone" | "k"> & { setting: Setting }) {
  const Renderer = RENDERERS[setting];
  const { tone, k } = structureFor(palette);
  return (
    <>
      <rect x="0" y="0" width={w} height={floor} fill={palette.far} />
      <rect x="0" y={floor} width={w} height={h - floor} fill={palette.ground} />
      <Renderer w={w} h={h} floor={floor} palette={palette} seed={seed} tone={tone} k={k} />
      <path
        d={`M0,${floor} L${w},${floor}`}
        stroke={palette.line}
        strokeWidth="1.5"
        opacity="0.5"
      />
    </>
  );
}

/**
 * One hard directional mark on the ground: a cast shadow on a lit ground, a
 * pool of light on a dark one. It is what makes the figure sit in the place
 * rather than float in front of it.
 */
export function GroundLight({
  w,
  h,
  floor,
  palette,
  x,
}: {
  w: number;
  h: number;
  floor: number;
  palette: Palette;
  /** Horizontal centre of the figure the mark belongs to. */
  x: number;
}) {
  if (palette.dark) {
    // A pool of light on the ground, not a halo around the figure — it stays
    // low and wide, and well under the figure's feet.
    return (
      <ellipse
        cx={x}
        cy={floor + (h - floor) * 0.3}
        rx={w * 0.16}
        ry={(h - floor) * 0.28}
        fill={palette.form}
        opacity="0.09"
      />
    );
  }

  return (
    <path
      d={`M${x},${floor} L${x + w * 0.26},${h} L${x - w * 0.08},${h} Z`}
      fill={palette.form}
      opacity="0.12"
    />
  );
}
