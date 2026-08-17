import { GARMENT_PATHS, type Garment } from "./garments";

/**
 * Bodies to hang a garment on.
 *
 * No faces, no measurements, no claims — a silhouette in the same 200 × 240
 * space the garments are drawn in, so a piece registers on a figure the way it
 * does on the flat lay. The pose set exists because a page of one stance reads
 * as a catalogue: the brief asks for walking, sitting, leaning and turning, and
 * the composition is what tells the visitor how a garment moves.
 */

export type Pose = "standing" | "contrapposto" | "walking" | "turned" | "seated";

export const POSES: Pose[] = ["standing", "contrapposto", "walking", "turned", "seated"];

/** Where the head sits for each pose, so the garment's collar still meets a neck. */
const HEAD_X: Record<Pose, number> = {
  standing: 100,
  contrapposto: 104,
  walking: 98,
  turned: 106,
  seated: 100,
};

/**
 * Legs carry the pose. The torso is the garment, so everything that says
 * "walking" or "seated" has to happen below the hem.
 */
function Legs({ pose }: { pose: Pose }) {
  if (pose === "walking") {
    return (
      <>
        <polygon points="74,228 94,228 78,312 58,308" />
        <polygon points="106,228 126,228 142,306 122,312" />
      </>
    );
  }

  if (pose === "seated") {
    return (
      <>
        <polygon points="76,230 78,268 174,258 172,226" />
        <polygon points="146,252 172,248 178,330 152,330" />
      </>
    );
  }

  if (pose === "turned") {
    // Three-quarters away: the far leg is mostly hidden behind the near one.
    return (
      <>
        <rect x="86" y="228" width="17" height="86" />
        <rect x="103" y="228" width="19" height="88" />
      </>
    );
  }

  if (pose === "contrapposto") {
    return (
      <>
        <rect x="78" y="228" width="20" height="86" />
        <polygon points="104,228 124,228 132,314 112,314" />
      </>
    );
  }

  return (
    <>
      <rect x="76" y="228" width="20" height="86" />
      <rect x="104" y="228" width="20" height="86" />
    </>
  );
}

export function Figure({
  pose = "standing",
  tone,
  opacity = 1,
}: {
  pose?: Pose;
  tone: string;
  opacity?: number;
}) {
  const headX = HEAD_X[pose];

  return (
    <g fill={tone} opacity={opacity}>
      <circle cx={headX} cy="24" r="22" />
      <rect x={headX - 8} y="42" width="16" height="18" />
      <Legs pose={pose} />
    </g>
  );
}

/**
 * `edge` outlines the parts that sit on top of the body — a hood, a pocket, a
 * placket. Without it they are the same tone as what they lie on and vanish.
 */
export function GarmentShape({
  garment,
  fill,
  edge,
}: {
  garment: Garment;
  fill: string;
  edge?: string;
}) {
  return (
    <g fill={fill}>
      {GARMENT_PATHS[garment].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={i === 0 || !edge ? "none" : edge}
          strokeWidth="3"
          strokeOpacity="0.45"
        />
      ))}
    </g>
  );
}

/**
 * Where a garment sits once someone is wearing it.
 *
 * The garment paths are all drawn in one 200 × 240 box, which is right for a
 * flat lay and wrong for a body: worn straight, a pair of trousers lands on the
 * chest and a cap floats in front of the ribs. Each bottom and each hat gets
 * placed against the figure it belongs on.
 */
const WORN_TRANSFORM: Partial<Record<Garment, { x: number; y: number; scale: number }>> = {
  pants: { x: 42, y: 196, scale: 0.58 },
  cap: { x: 50, y: -46, scale: 0.5 },
  beanie: { x: 50, y: -40, scale: 0.5 },
};

/**
 * A hat or a pair of trousers is worn *with* something. Without a base layer
 * the figure is bare everywhere the piece does not cover — which is how a
 * bottom or an accessory is never actually photographed.
 */
const NEEDS_BASE_LAYER: Garment[] = ["cap", "beanie", "pants"];

/** A figure in a piece: the body, then the garment on it, in the right place. */
export function WornBody({
  garment,
  pose,
  form,
  ground,
  figureOpacity = 0.72,
}: {
  garment: Garment;
  pose: Pose;
  form: string;
  ground: string;
  figureOpacity?: number;
}) {
  const placement = WORN_TRANSFORM[garment];

  return (
    <>
      <Figure pose={pose} tone={form} opacity={figureOpacity} />
      {NEEDS_BASE_LAYER.includes(garment) ? (
        <GarmentShape garment="tee" fill={form} edge={ground} />
      ) : null}
      {placement ? (
        <g transform={`translate(${placement.x} ${placement.y}) scale(${placement.scale})`}>
          <GarmentShape garment={garment} fill={form} edge={ground} />
        </g>
      ) : (
        <GarmentShape garment={garment} fill={form} edge={ground} />
      )}
    </>
  );
}
