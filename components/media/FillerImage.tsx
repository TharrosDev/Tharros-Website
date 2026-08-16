import type { ImageSlotData, Ratio } from "@/lib/catalog/types";

/**
 * TEMPORARY VISUALISATION AID — delete once real photography lands.
 *
 * Photography does not exist yet, so every image slot on the site renders as an
 * empty frame. That is honest but it makes whole pages hard to read: rhythm,
 * contrast and crop all disappear. This draws a deterministic monochrome stand-in
 * instead — a flat-lay, figure, environment or fabric study, chosen from the
 * slot's own `kind` and `alt` — so the layout can be judged before the shoot.
 *
 * It is deliberately drawn, not photographic, and every frame keeps its asset
 * code and a FILLER mark so nothing here can be mistaken for a real garment
 * photograph. Turning it off is one flag: `FILLER_IMAGES` below.
 */

/** Set to false (or `NEXT_PUBLIC_FILLER_IMAGES=off`) to get the empty frames back. */
export const FILLER_IMAGES = process.env.NEXT_PUBLIC_FILLER_IMAGES !== "off";

const VIEWBOX: Record<Ratio, { w: number; h: number }> = {
  portrait: { w: 300, h: 400 },
  editorial: { w: 320, h: 400 },
  campaign: { w: 640, h: 360 },
  wide: { w: 630, h: 270 },
  square: { w: 400, h: 400 },
};

/** Monochrome only — the clothing supplies the colour, and it is not here yet. */
type Palette = { ground: string; far: string; form: string; line: string; label: string };

const PALETTES: Palette[] = [
  { ground: "#e6e4e0", far: "#d5d2cd", form: "#242424", line: "#a9a5a0", label: "#4a4a4a" },
  { ground: "#dbd8d3", far: "#c6c3bd", form: "#6d6d6d", line: "#9b9792", label: "#41413f" },
  { ground: "#232323", far: "#171717", form: "#d7d4cf", line: "#4a4a4a", label: "#9a9a9a" },
  { ground: "#cfccc7", far: "#bab6b0", form: "#1a1a1a", line: "#94908b", label: "#3d3d3d" },
];

/** Stable across renders and machines — the same slot always draws the same frame. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Every shot of one piece should look like it came from one session, so the
 * palette keys off the family code rather than the individual frame.
 */
function familyOf(code: string): string {
  return code.replace(/-\d+[A-Z]?$/, "");
}

type Garment = "tee" | "hoodie" | "crew" | "pants" | "jacket" | "cap" | "beanie";

/**
 * The slot already says what it holds, in its code and its alt text. Read it
 * rather than adding a filler-only field to the catalog types.
 */
function garmentOf(image: ImageSlotData): Garment {
  const text = `${image.code} ${image.alt}`.toLowerCase();
  if (/hood/.test(text)) return "hoodie";
  if (/crew|sweatshirt/.test(text)) return "crew";
  if (/cargo|pant|trouser/.test(text)) return "pants";
  if (/jacket|jkt|shell|shl/.test(text)) return "jacket";
  if (/beanie|bean/.test(text)) return "beanie";
  if (/cap\b/.test(text)) return "cap";
  if (/jkt/.test(text)) return "jacket";
  return "tee";
}

/** All garments are drawn in one 200 × 240 box and placed by the compositions. */
const GARMENT_PATHS: Record<Garment, string[]> = {
  tee: [
    "M80,44 L62,46 L40,54 L26,100 L54,112 L60,90 L60,228 L140,228 L140,90 L146,112 L174,100 L160,54 L138,46 L120,44 C119,62 81,62 80,44 Z",
  ],
  hoodie: [
    "M80,54 L62,56 L36,66 L20,154 L50,166 L58,126 L58,232 L142,232 L142,126 L150,166 L180,154 L164,66 L138,56 L120,54 C119,76 81,76 80,54 Z",
    "M66,56 C72,20 128,20 134,56 C120,74 80,74 66,56 Z",
    "M72,158 L128,158 L132,190 L68,190 Z",
  ],
  crew: [
    "M80,50 L62,52 L36,62 L20,150 L50,162 L58,122 L58,228 L142,228 L142,122 L150,162 L180,150 L164,62 L138,52 L120,50 C119,70 81,70 80,50 Z",
    "M58,212 L142,212 L142,228 L58,228 Z",
  ],
  pants: [
    "M60,40 L140,40 L148,236 L112,236 L100,124 L88,236 L52,236 Z",
    "M60,40 L140,40 L142,60 L58,60 Z",
  ],
  jacket: [
    "M80,48 L62,50 L34,62 L20,152 L50,164 L58,124 L58,230 L142,230 L142,124 L150,164 L180,152 L166,62 L138,50 L120,48 L100,74 Z",
    "M80,48 L100,74 L120,48 L110,42 L100,60 L90,42 Z",
    "M96,74 L104,74 L104,230 L96,230 Z",
  ],
  cap: [
    "M42,146 C42,88 158,88 158,146 Z",
    "M40,146 C40,160 120,176 182,158 L180,144 Z",
  ],
  beanie: [
    "M54,152 C54,82 146,82 146,152 Z",
    "M50,152 L150,152 L150,188 L50,188 Z",
  ],
};

/**
 * `edge` outlines the parts that sit on top of the body — a hood, a pocket, a
 * placket. Without it they are the same tone as what they lie on and vanish.
 */
function Garment({ garment, fill, edge }: { garment: Garment; fill: string; edge?: string }) {
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

/** A body to hang a garment on. No face, no measurements, no claims. */
function Figure({ tone, opacity = 1 }: { tone: string; opacity?: number }) {
  return (
    <g fill={tone} opacity={opacity}>
      <circle cx="100" cy="24" r="22" />
      <rect x="92" y="42" width="16" height="18" />
      <rect x="76" y="228" width="20" height="86" />
      <rect x="104" y="228" width="20" height="86" />
    </g>
  );
}

type SceneProps = {
  w: number;
  h: number;
  palette: Palette;
  garment: Garment;
  seed: number;
  kind: ImageSlotData["kind"];
};

/** Flat lay: the garment on a surface, lit from one side. */
function FlatLay({ w, h, palette, garment, seed, kind }: SceneProps) {
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
          <Garment garment={garment} fill={palette.form} />
        </g>
        <g transform={`translate(${x} ${y}) scale(${scale})`}>
          <Garment garment={garment} fill={palette.form} edge={palette.ground} />
        </g>
      </g>
    </>
  );
}

/** Worn: a figure in the piece, framed like a studio portrait. */
function Worn({ w, h, palette, garment, seed }: SceneProps) {
  // Alternate a full frame with a closer one, so a pair of shots of the same
  // piece reads as two frames rather than one picture printed twice.
  const close = seed % 2 === 1;
  const headroom = garment === "cap" || garment === "beanie" ? 0.14 : 0.2;
  const scale = Math.min((w * (close ? 0.78 : 0.58)) / 200, (h * (close ? 0.84 : 0.62)) / 240);
  const shift = ((seed % 3) - 1) * w * 0.07;
  const x = (w - 200 * scale) / 2 + shift;
  const y = h * (close ? headroom - 0.08 : headroom);
  const floor = h * (0.78 + (seed % 3) * 0.04);
  const panel = seed % 2 === 0 ? w * 0.62 : 0;

  return (
    <>
      <rect x="0" y="0" width={w} height={floor} fill={palette.far} />
      <rect x="0" y={floor} width={w} height={h - floor} fill={palette.ground} />
      <rect x={panel} y="0" width={w * 0.38} height={floor} fill={palette.ground} opacity="0.35" />
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <Figure tone={palette.form} opacity={0.72} />
        <Garment garment={garment} fill={palette.form} edge={palette.ground} />
      </g>
      <ellipse
        cx={w / 2 + shift}
        cy={floor + h * 0.03}
        rx={w * 0.22}
        ry={h * 0.02}
        fill={palette.line}
        opacity="0.35"
      />
    </>
  );
}

/** Environment: the piece somewhere, at distance. Concrete, light, a long shadow. */
function Scene({ w, h, palette, garment, seed }: SceneProps) {
  const scale = Math.min((w * 0.3) / 200, (h * 0.5) / 240);
  const x = w * (seed % 2 === 0 ? 0.3 : 0.56);
  const y = h * 0.12;
  const floor = h * 0.7;

  return (
    <>
      <rect x="0" y="0" width={w} height={floor} fill={palette.far} />
      <rect x="0" y={floor} width={w} height={h - floor} fill={palette.ground} />
      <rect x={w * 0.06} y={h * 0.08} width={w * 0.2} height={floor - h * 0.08} fill={palette.ground} opacity="0.45" />
      <rect x={w * 0.74} y="0" width={w * 0.26} height={floor} fill={palette.form} opacity="0.08" />
      <path d={`M0,${floor} L${w},${floor}`} stroke={palette.line} strokeWidth="1.5" opacity="0.5" />
      <path
        d={`M${x + 100 * scale},${floor} L${x + 200 * scale + w * 0.12},${h} L${x - w * 0.02},${h} Z`}
        fill={palette.form}
        opacity="0.12"
      />
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <Figure tone={palette.form} opacity={0.72} />
        <Garment garment={garment} fill={palette.form} edge={palette.ground} />
      </g>
    </>
  );
}

/**
 * Detail: close enough to read the cloth. Four studies — a seam, ribbing, a
 * folded stack, a diagonal weave — so a page of detail slots is not one image
 * repeated.
 */
function Detail({ w, h, palette, seed }: SceneProps) {
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

const SCENES = { flat: FlatLay, worn: Worn, scene: Scene, detail: Detail };

function sceneFor(image: ImageSlotData): keyof typeof SCENES {
  if (image.kind === "detail") return "detail";
  if (image.kind === "lifestyle") return "scene";
  if (image.kind === "model") return "worn";
  return "flat";
}

type Props = { image: ImageSlotData; ratio?: Ratio; className?: string };

export default function FillerImage({ image, ratio, className = "" }: Props) {
  const { w, h } = VIEWBOX[ratio ?? image.ratio];
  // Tone follows the family so one piece looks shot in one session; the frame's
  // own code varies the composition so sibling shots are not the same picture.
  const seed = hash(image.code);
  const palette = PALETTES[hash(familyOf(image.code)) % PALETTES.length];
  const garment = garmentOf(image);
  const Composition = SCENES[sceneFor(image)];
  const label = Math.max(9, Math.round(Math.min(w, h) * 0.038));

  // `zoom-target` so a filler frame answers `.hover-zoom` the way a photograph
  // will, and the hover behaviour can be judged now rather than after the shoot.
  return (
    <svg
      role="img"
      aria-label={`${image.alt} — placeholder illustration, photography pending`}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      className={`zoom-target h-full w-full ${className}`}
    >
      <Composition w={w} h={h} palette={palette} garment={garment} seed={seed} kind={image.kind} />
      {/* Kept legible at every size: this is a drawing, not a photograph. */}
      <text
        x={label * 1.4}
        y={h - label * 1.2}
        fill={palette.label}
        fontFamily="ui-monospace, monospace"
        fontSize={label}
        letterSpacing={label * 0.08}
      >
        {image.code}
      </text>
      <text
        x={w - label * 1.4}
        y={h - label * 1.2}
        fill={palette.label}
        fontFamily="ui-monospace, monospace"
        fontSize={label}
        letterSpacing={label * 0.08}
        textAnchor="end"
      >
        FILLER
      </text>
    </svg>
  );
}
