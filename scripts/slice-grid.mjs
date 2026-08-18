/**
 * Slice a contact sheet into the stand-in frames it holds.
 *
 * The generator produces ONE image containing every frame, edge to edge, in a
 * uniform grid. This cuts exact cells in reading order (left to right, top to
 * bottom) and writes them as `cell-01.jpg` … `cell-NN.jpg`. Placing them under
 * the names `FillerImage.tsx` resolves to is a separate step — the mapping is
 * a decision, the cutting is arithmetic, and keeping them apart means a
 * mis-assignment can be fixed without re-cutting.
 *
 * `--inset N` trims N pixels off every cut edge, for when the generator adds a
 * hairline border or a seam between cells despite being told not to.
 *
 *   node scripts/slice-grid.mjs <grid.png> --cols 4 --rows 4 [--inset 6] [--out DIR]
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const src = args.find((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));

const cols = Number(flag("cols", 4));
const rows = Number(flag("rows", 4));
const inset = Number(flag("inset", 0));
const outDir = flag("out", "public/filler");
// `--name flat` writes flat-1.jpg … flat-4.jpg, the names `FillerImage.tsx`
// resolves to. Without it the cells come out numbered, for a sheet whose
// mapping is not one-scene-per-grid.
const name = flag("name", "cell");

if (!src || !existsSync(src)) {
  console.error("usage: node scripts/slice-grid.mjs <grid.png> --cols N --rows N [--inset N] [--out DIR]");
  process.exit(1);
}

const [W, H] = execFileSync("ffprobe", [
  "-v", "error", "-select_streams", "v:0",
  "-show_entries", "stream=width,height", "-of", "csv=p=0", src,
]).toString().trim().split(",").map(Number);

// Floor the cell size and derive positions from the exact fraction, so a
// canvas whose dimensions do not divide evenly drifts by at most a pixel per
// cell instead of accumulating the remainder into the last column.
const cw = Math.floor(W / cols);
const ch = Math.floor(H / rows);

mkdirSync(outDir, { recursive: true });

let n = 0;
for (let r = 0; r < rows; r += 1) {
  for (let c = 0; c < cols; c += 1) {
    n += 1;
    const x = Math.round((W / cols) * c) + inset;
    const y = Math.round((H / rows) * r) + inset;
    const dest = join(outDir, `${name}-${n}.jpg`);
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error", "-i", src,
      "-vf", `crop=${cw - inset * 2}:${ch - inset * 2}:${x}:${y}`,
      "-q:v", "2", dest,
    ]);
  }
}

console.log(`${src} (${W}x${H}) -> ${n} cells of ${cw - inset * 2}x${ch - inset * 2} in ${outDir}`);
