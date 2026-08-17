/**
 * Tone and determinism for the stand-in artwork.
 *
 * Monochrome only — the clothing supplies the colour, and it is not here yet.
 * Every choice downstream keys off `hash`, so a slot draws the same frame on
 * every render and on every machine: no `Math.random`, no `Date`, nothing that
 * could differ between the server pass and the client one.
 */

export type Palette = {
  ground: string;
  far: string;
  form: string;
  line: string;
  label: string;
  /** True for the night grounds, so scenes can add a light source instead of a shadow. */
  dark?: boolean;
};

export const PALETTES: Palette[] = [
  { ground: "#e6e4e0", far: "#d5d2cd", form: "#242424", line: "#a9a5a0", label: "#4a4a4a" },
  { ground: "#dbd8d3", far: "#c6c3bd", form: "#6d6d6d", line: "#9b9792", label: "#41413f" },
  { ground: "#232323", far: "#171717", form: "#d7d4cf", line: "#4a4a4a", label: "#9a9a9a", dark: true },
  { ground: "#cfccc7", far: "#bab6b0", form: "#1a1a1a", line: "#94908b", label: "#3d3d3d" },
  // Night. Concrete under sodium light — still monochrome, just a lower key.
  { ground: "#1b1b1c", far: "#101011", form: "#c9c6c1", line: "#3d3d3f", label: "#8f8f8f", dark: true },
  { ground: "#2c2b29", far: "#1d1c1b", form: "#e0ddd8", line: "#514f4c", label: "#a2a09c", dark: true },
];

/** Stable across renders and machines — the same slot always draws the same frame. */
export function hash(input: string): number {
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
export function familyOf(code: string): string {
  return code.replace(/-\d+[A-Z]?$/, "");
}

export function paletteFor(code: string): Palette {
  return PALETTES[hash(familyOf(code)) % PALETTES.length];
}
