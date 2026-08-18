/**
 * Fetch the stand-in photography.
 *
 * The stand-ins that were here were desaturated to a monochrome palette before
 * they were committed, so the colour was not recoverable by regrading them —
 * a greyscale JPEG has no hue to restore. This pulls fresh CC0 photographs
 * from Openverse, in colour, at the seven scene types `FillerImage.tsx`
 * resolves to, and writes `public/filler/<scene>-<n>.jpg`.
 *
 * CC0 only, and photographs only. `license=cc0` means no attribution is
 * legally required, but `scripts/filler-credits.json` records where every
 * frame came from anyway — a label that prints its run sizes should be able to
 * say where its placeholder pictures came from too.
 *
 * TEMPORARY, like the stand-ins themselves. Delete this, the credits file and
 * `FillerImage.tsx` when the real photography lands.
 *
 *   node scripts/fetch-filler.mjs           # fill in anything missing
 *   node scripts/fetch-filler.mjs --force   # refetch everything
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const DIR = "public/filler";
const POOL = 4;
const FORCE = process.argv.includes("--force");

/**
 * One query per scene, written to return people and cloth rather than
 * products. The scene names are `FillerImage.tsx`'s, and the frame a slot gets
 * is chosen from its `kind` and `crop` — so these have to keep meaning what
 * that file thinks they mean.
 */
const SCENES = {
  flat: ["folded clothing", "shirt flat lay", "garment on table"],
  worn: ["person wearing hoodie", "man wearing jacket", "person in sweater"],
  scene: ["person standing architecture", "man standing building", "person concrete wall"],
  street: ["person walking street", "man walking city", "pedestrian street"],
  campaign: ["fashion model", "woman coat outdoors", "man coat outdoors", "person landscape wide", "couple walking outdoors"],
  portrait: ["portrait person natural light", "headshot man", "portrait face"],
  detail: ["fabric texture macro", "textile weave close up", "denim texture"],
};

const API = "https://api.openverse.org/v1/images/";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Anonymous Openverse throttles hard: `page_size` above 20 is a 401 rather
 * than a clamp, and a burst of queries starts returning 403. So the ceiling is
 * respected, requests are spaced, and a throttle is retried with backoff
 * instead of aborting the run — a half-filled pool would leave some slots
 * pointing at files that do not exist.
 */
async function candidates(query, attempt = 0) {
  const url = new URL(API);
  url.searchParams.set("q", query);
  url.searchParams.set("license", "cc0,pdm");
  url.searchParams.set("category", "photograph");
  url.searchParams.set("size", "large");
  url.searchParams.set("mature", "false");
  url.searchParams.set("page_size", "20");

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (res.status === 403 || res.status === 429) {
    if (attempt >= 4) {
      console.warn(`! throttled on "${query}" — skipping`);
      return [];
    }
    await sleep(4000 * 2 ** attempt);
    return candidates(query, attempt + 1);
  }
  if (!res.ok) {
    console.warn(`! Openverse ${res.status} for "${query}" — skipping`);
    return [];
  }
  const body = await res.json();
  await sleep(1200);
  return body.results ?? [];
}

/**
 * Downloaded through ffmpeg rather than written straight to disk: it re-encodes
 * to a consistent JPEG, caps the long edge at 1600px, and fails loudly on
 * anything that is not actually an image. A 404 HTML page saved as `.jpg` is
 * the classic way a scraper like this silently poisons an asset folder.
 */
function grab(src, dest) {
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-i", src,
    "-vf", "scale='min(1600,iw)':'min(1600,ih)':force_original_aspect_ratio=decrease",
    "-q:v", "4",
    dest,
  ], { timeout: 60_000 });
}

mkdirSync(DIR, { recursive: true });
const credits = [];
let fetched = 0;

for (const [scene, queries] of Object.entries(SCENES)) {
  let n = 0;

  // Several queries per scene, drained in order. One query rarely returns four
  // usable large photographs once the dead URLs and the non-images are gone.
  const pool = [];
  for (const query of queries) {
    pool.push(...(await candidates(query)));
    if (pool.length >= 16) break;
  }

  const seen = new Set();
  for (const item of pool) {
    if (n >= POOL) break;
    if (!item.url || seen.has(item.url)) continue;
    seen.add(item.url);
    const dest = join(DIR, `${scene}-${n + 1}.jpg`);
    if (!FORCE && existsSync(dest)) {
      n += 1;
      continue;
    }
    const src = item.url;
    try {
      grab(src, dest);
    } catch {
      // A dead or non-image URL just means the next candidate gets the slot.
      rmSync(dest, { force: true });
      continue;
    }
    credits.push({
      file: `${scene}-${n + 1}.jpg`,
      title: item.title ?? null,
      creator: item.creator ?? null,
      license: item.license ?? "cc0",
      source: item.foreign_landing_url ?? item.url,
    });
    n += 1;
    fetched += 1;
  }

  if (n < POOL) {
    console.warn(`! ${scene}: only ${n}/${POOL} frames — widen the query`);
  } else {
    console.log(`  ${scene}: ${n}/${POOL}`);
  }
}

if (credits.length > 0) {
  writeFileSync("scripts/filler-credits.json", JSON.stringify(credits, null, 2) + "\n");
}
console.log(`Fetched ${fetched} stand-in frames.`);
