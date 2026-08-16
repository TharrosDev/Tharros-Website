import type { Crop, ImageKind } from "@/lib/catalog/types";
import { Architecture, GroundLight, settingFor, type Setting } from "./architecture";
import { Figure, GarmentShape, POSES, WornBody, type Pose } from "./figures";
import type { Garment } from "./garments";
import { hash, type Palette } from "./palettes";

/**
 * The compositions.
 *
 * Each one answers a different question the brief asks of photography: what is
 * it (FlatLay), what does it look like on a person (Worn), how does it move
 * (Street), where does it belong (Scene, Campaign), what is it made of
 * (Detail), and what does it look like up close on a body (Portrait).
 */

export type SceneProps = {
  w: number;
  h: number;
  palette: Palette;
  garment: Garment;
  seed: number;
  kind: ImageKind;
  crop?: Crop;
  family: string;
};

/** The figure's local box runs from the crown to the sole. */
const FIGURE_H = 320;

function poseFor(seed: number, crop?: Crop): Pose {
  if (crop === "walking") return "walking";
  return POSES[hash(`${seed}-pose`) % POSES.length];
}

/** Flat lay: the garment on a surface, lit from one side. */
export function FlatLay({ w, h, palette, garment, seed, kind }: SceneProps) {
  const scale = Math.min((w * 0.66) / 200, (h * 0.78) / 240);
  const x = (w - 200 * scale) / 2;
  const y = (h - 240 * scale) / 2;
  const band = h * (0.16 + (seed % 5) * 0.03);
  const drop = scale * 5;
  // The back view is the same garment turned over, so the frame mirrors.
  const face = kind === "back" ? `translate(${w} 0) scale(-1 1)` : "";

  return (
    <>
      <rect x="0" y="0" width={w} height={band} fill={palette.far} />
      <rect x="0" y={band} width={w} height={h - band} fill={palette.ground} />
      <rect x="0" y={band - 1} width={w} height="2" fill={palette.line} opacity="0.2" />
      <g transform={face}>
        {/* One soft copy behind the garment reads as the shadow it casts. */}
        <g transform={`translate(${x + drop} ${y + drop}) scale(${scale})`} opacity="0.1">
          <GarmentShape garment={garment} fill={palette.form} />
        </g>
        <g transform={`translate(${x} ${y}) scale(${scale})`}>
          <GarmentShape garment={garment} fill={palette.form} edge={palette.ground} />
        </g>
      </g>
    </>
  );
}

/**
 * Worn: a person in the piece, framed like a fitting.
 *
 * Studio rather than street — that is what separates a `model` slot from a
 * `lifestyle` one, and the PDP needs one frame where nothing competes with the
 * silhouette. The pose still varies, because a page of identical stances is
 * the catalogue look the brief asks to avoid.
 */
export function Worn({ w, h, palette, garment, seed, crop }: SceneProps) {
  const pose = poseFor(seed, crop);
  const threeQuarter = crop === "three-quarter";
  const floor = h * (threeQuarter ? 1.16 : 0.88);
  const top = h * (threeQuarter ? 0.05 : 0.08);
  const scale = Math.min(
    (floor - top) / FIGURE_H,
    (w * (threeQuarter ? 0.74 : 0.6)) / 200,
  );
  const shift = ((seed % 3) - 1) * w * 0.06;
  const x = (w - 200 * scale) / 2 + shift;
  const backdrop = h * (0.82 + (seed % 3) * 0.03);
  const panel = seed % 2 === 0 ? w * 0.58 : 0;

  return (
    <>
      <rect x="0" y="0" width={w} height={backdrop} fill={palette.far} />
      <rect x="0" y={backdrop} width={w} height={h - backdrop} fill={palette.ground} />
      {/* A single seam of tone behind the figure, so the frame has a light
          direction without the backdrop becoming a subject of its own. */}
      <rect x={panel} y="0" width={w * 0.42} height={backdrop} fill={palette.ground} opacity="0.35" />
      <rect x="0" y={backdrop - 1} width={w} height="2" fill={palette.line} opacity="0.3" />
      <g transform={`translate(${x} ${top}) scale(${scale})`}>
        <WornBody garment={garment} pose={pose} form={palette.form} ground={palette.ground} />
      </g>
      {!threeQuarter ? (
        <ellipse
          cx={w / 2 + shift}
          cy={backdrop + h * 0.025}
          rx={w * 0.2}
          ry={h * 0.016}
          fill={palette.line}
          opacity="0.35"
        />
      ) : null}
    </>
  );
}

/** Environment: the piece somewhere, at distance. The place is half the picture. */
export function Scene({ w, h, palette, garment, seed, crop, family }: SceneProps) {
  const setting: Setting = settingFor(family);
  const pose = poseFor(seed, crop);
  const floor = h * 0.72;
  const scale = Math.min((w * 0.3) / 200, (h * 0.56) / FIGURE_H);
  const x = w * (seed % 2 === 0 ? 0.28 : 0.54);
  const y = floor - FIGURE_H * scale;

  return (
    <>
      <Architecture setting={setting} w={w} h={h} floor={floor} palette={palette} seed={seed} />
      <GroundLight w={w} h={h} floor={floor} palette={palette} x={x + 100 * scale} />
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <WornBody garment={garment} pose={pose} form={palette.form} ground={palette.ground} />
      </g>
    </>
  );
}

/**
 * Street: mid-stride, with one ghosted silhouette behind.
 *
 * The ghost is the honest way to draw movement in a still frame — it reads as
 * a long exposure rather than pretending to be a video still.
 */
export function Street({ w, h, palette, garment, seed, family }: SceneProps) {
  const setting: Setting = settingFor(family);
  const floor = h * 0.8;
  const scale = Math.min((w * 0.46) / 200, (h * 0.78) / FIGURE_H);
  const x = w * (seed % 2 === 0 ? 0.3 : 0.44);
  const y = floor - FIGURE_H * scale;
  const trail = w * 0.16;

  return (
    <>
      <Architecture setting={setting} w={w} h={h} floor={floor} palette={palette} seed={seed} />
      <GroundLight w={w} h={h} floor={floor} palette={palette} x={x + 100 * scale} />
      <g transform={`translate(${x - trail} ${y}) scale(${scale})`} opacity="0.16">
        <Figure pose="walking" tone={palette.form} />
        <GarmentShape garment={garment} fill={palette.form} />
      </g>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <WornBody garment={garment} pose="walking" form={palette.form} ground={palette.ground} />
      </g>
    </>
  );
}

/**
 * Campaign: the frame that leads a page.
 *
 * The figure is small and off-centre and most of the frame is the place it
 * stands in — partly because that is what a campaign photograph looks like,
 * and partly because type is set over these, and it needs somewhere to go.
 */
export function Campaign({ w, h, palette, garment, seed, crop, family }: SceneProps) {
  // Campaign frames are one-offs rather than a run of shots of one piece, so
  // the setting varies per frame — otherwise every hero on the site is the same
  // building.
  const setting: Setting = settingFor(`${family}-${seed}`);
  const pose = poseFor(seed, crop);
  const floor = h * 0.82;
  const scale = Math.min((w * 0.3) / 200, (h * 0.72) / FIGURE_H);
  // Off to one side: type is set over these, and it needs somewhere to go.
  const x = w * (seed % 2 === 0 ? 0.6 : 0.16);
  const y = floor - FIGURE_H * scale;

  return (
    <>
      <Architecture setting={setting} w={w} h={h} floor={floor} palette={palette} seed={seed} />
      <GroundLight w={w} h={h} floor={floor} palette={palette} x={x + 100 * scale} />
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <WornBody garment={garment} pose={pose} form={palette.form} ground={palette.ground} />
      </g>
    </>
  );
}

/**
 * Portrait: close enough that the frame is shoulders and chest.
 *
 * The garment box is scaled past the viewBox and the outer `svg` clips it, so
 * the crop is a real crop of the same drawing rather than a second illustration
 * that happens to be zoomed in.
 */
export function Portrait({ w, h, palette, garment, seed }: SceneProps) {
  // Collar, shoulder and chest. The frame sits low enough that the head is
  // cropped by the top edge rather than centred in it — a featureless circle
  // filling a third of the picture is a mannequin, and the point of a close
  // frame is the cloth, not the person's outline.
  const scale = Math.max(w / 152, h / 148);
  const x = (w - 200 * scale) / 2 + ((seed % 3) - 1) * w * 0.06;
  const y = -h * 0.12;
  const backdrop = h * (0.52 + (seed % 3) * 0.08);

  return (
    <>
      <rect x="0" y="0" width={w} height={backdrop} fill={palette.far} />
      <rect x="0" y={backdrop} width={w} height={h - backdrop} fill={palette.ground} opacity="0.55" />
      <rect x="0" y={backdrop - 1} width={w} height="2" fill={palette.line} opacity="0.25" />
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <WornBody garment={garment} pose="standing" form={palette.form} ground={palette.ground} />
      </g>
    </>
  );
}

/**
 * Detail: close enough to read the cloth. Four studies — a seam, ribbing, a
 * folded stack, a diagonal weave — so a page of detail slots is not one image
 * repeated.
 */
export function Detail({ w, h, palette, seed }: SceneProps) {
  // A second pass over the code spreads the four studies more evenly than
  // reusing the palette seed, which tends to clump.
  const study = hash(`${seed}-study`) % 4;
  const dark = palette.form;

  if (study === 0) {
    // A seam running across the frame, stitched, cloth falling away below it.
    const seam = h * (0.38 + (seed % 3) * 0.07);
    const curve = (offset: number) =>
      `M0,${seam + offset} C${w * 0.34},${seam + offset - h * 0.07} ${w * 0.68},${seam + offset + h * 0.08} ${w},${seam + offset - h * 0.02}`;
    return (
      <>
        <rect x="0" y="0" width={w} height={h} fill={palette.ground} />
        <path d={`${curve(h * 0.02)} L${w},${h} L0,${h} Z`} fill={dark} opacity="0.55" />
        <path d={curve(0)} fill="none" stroke={dark} strokeWidth={Math.max(2.5, h * 0.014)} />
        <path
          d={curve(-h * 0.05)}
          fill="none"
          stroke={dark}
          strokeWidth="2"
          strokeDasharray={`${h * 0.03} ${h * 0.025}`}
          opacity="0.8"
        />
        <path d={`M0,0 L${w},0 L${w},${h * 0.1} L0,${h * 0.16} Z`} fill={palette.far} opacity="0.7" />
      </>
    );
  }

  if (study === 1) {
    // Ribbing — a cuff or a collar, filling the frame.
    const step = h * 0.08;
    const count = Math.ceil(h / step) + 1;
    return (
      <>
        <rect x="0" y="0" width={w} height={h} fill={dark} opacity="0.88" />
        <g fill={palette.ground} opacity="0.22">
          {Array.from({ length: count }, (_, i) => (
            <rect key={i} x="0" y={i * step} width={w} height={step * 0.34} />
          ))}
        </g>
        <rect x="0" y={h * 0.62} width={w} height={h * 0.38} fill={palette.ground} opacity="0.9" />
        <rect x="0" y={h * 0.62} width={w} height={h * 0.012} fill={dark} opacity="0.5" />
      </>
    );
  }

  if (study === 2) {
    // Folded cloth, stacked — the flattest, most graphic of the four.
    const bands = 4 + (seed % 3);
    const gap = h / (bands + 1);
    return (
      <>
        <rect x="0" y="0" width={w} height={h} fill={palette.far} />
        {Array.from({ length: bands }, (_, i) => (
          <g key={i}>
            <rect
              x={w * (0.06 + (i % 2) * 0.03)}
              y={gap * (i + 0.4)}
              width={w * (0.82 - (i % 2) * 0.06)}
              height={gap * 0.72}
              fill={dark}
              opacity={0.78 - i * 0.1}
            />
            <rect
              x={w * (0.06 + (i % 2) * 0.03)}
              y={gap * (i + 0.4) + gap * 0.72}
              width={w * (0.82 - (i % 2) * 0.06)}
              height={gap * 0.08}
              fill={dark}
              opacity="0.25"
            />
          </g>
        ))}
      </>
    );
  }

  // Weave, magnified: the cloth itself and nothing else.
  // Proportional so a wide hero is not drawn at thumbnail density.
  const step = Math.round(((w + h) / 2) * (0.03 + (seed % 3) * 0.014));
  const lines = Math.ceil((w + h) / step);
  return (
    <>
      <rect x="0" y="0" width={w} height={h} fill={palette.ground} />
      <g stroke={dark} strokeWidth="1.5" opacity="0.34">
        {Array.from({ length: lines }, (_, i) => (
          <line key={i} x1={i * step - h} y1="0" x2={i * step} y2={h} />
        ))}
      </g>
      <g stroke={dark} strokeWidth="1" opacity="0.18">
        {Array.from({ length: lines }, (_, i) => (
          <line key={i} x1={i * step} y1="0" x2={i * step - h} y2={h} />
        ))}
      </g>
      <path d={`M0,${h * 0.72} L${w},${h * 0.52} L${w},${h} L0,${h} Z`} fill={dark} opacity="0.5" />
    </>
  );
}
