# Photography generation — master prompts

The image slots on this site are declared in data and render as stand-ins until a `src`
is filled in (see `components/media/ImageSlot.tsx`). These are the prompts used to
generate the real frames, one paste per session.

The home hero (`CMP-001-HERO`, `public/photography/cmp-001-hero.jpg`) is done and is the reference
for everything else: warm plaster wall, soft directional daylight, ungraded warm
neutrals, no props, no styling noise.

**Session 1 — site furniture (12 images).** Paste the block below into ChatGPT, then say
`next` for each image. Save each file to `public/photography/`.

The generator returns PNG, which is the wrong container for a photograph: the twelve came
to 27MB. They are converted on the way in — `sharp(...).jpeg({quality: 86, mozjpeg: true,
chromaSubsampling: '4:4:4'})`, which took the set to 2MB with no visible difference — and
the `src` values point at `.jpg`. `sharp` is already present as a Next dependency, so this
needs nothing installed.

`DROP-001-COVER` is wired into the data but nothing renders it today: `DropOpening` reads
it only when a drop has no campaign hero, and Drop 001 has one. It is generated so the
slot is filled, not because a page is waiting on it.

**Session 2 — product frames (9 images).** Three frames per piece across the three
products in `lib/catalog/products.ts`. The prompt is at the bottom of this file.

Every product slot on the site is still a stand-in — that is 18 declared frames and three
pieces nobody can actually see. This is the session that matters most, and it is why
`lib/catalog/photography.test.ts` names the pending pieces rather than counting them: the
list empties one product at a time, and the test says which are left.

**Which three, and why those three.** `lib/catalog/images.ts` ranks frames
`model -> lifestyle -> campaign -> detail -> back -> front`, and the ladder is built to
degrade correctly for a garment with three photographs instead of six. Three shots cover
every consumer of that ladder: `-04` is what `heroImage` picks for the gallery and the
card, `-01` is what `thumbnailImage` picks for the bag, the search results and the archive
row (thumbnails deliberately invert the ladder), and `-03` is what `detailImages` needs so
the piece can be proved rather than described. `-02`, `-05` and `-06` are Session 3 and the
site reads correctly without them.

---

## Session 1 prompt — paste everything below this line

You are my art director and image generator for a photography set. Read this whole brief,
confirm in two lines that you have it, then generate **image 1 only** and stop. After that,
every time I say `next` you generate the next image in the queue and stop again. Never
generate two images in one turn. Never skip ahead. If I say `again`, regenerate the current
image with a different take rather than moving on.

### The brand

THARROS is a small independent streetwear label: heavyweight cloth, wide silhouettes and
restrained graphics, released in numbered drops of a few pieces in short runs. The line is
"Small runs. Original ideas." It is not a department store and not a hype brand. The tone
is quiet confidence: a small label that knows what its clothes look like.

**Photograph the clothes and the people in them. Not the making of them.** Three frames in
the original set were work-table studies — pattern paper, chalk lines, pins, a part-sewn
sample — and they are no longer used anywhere on the site, because the site no longer
tells the story of its own manufacture. Nothing in the queue below asks for a workshop
again. If a frame's subject is a process rather than a garment or a person, it does not
belong in this set.

### The visual system — this is the part that matters most

Every frame must look like it came from the same day, the same photographer and the same
camera as the others.

- **Light.** Soft directional daylight, as if from a large window or an overcast sky just
  out of frame. One source. Gentle falloff, no hard rim light, no strobe look, no
  colour gels.
- **Colour.** Warm neutrals only — plaster, bone, ash, concrete, faded black, off-white.
  Ungraded and natural, not filtered, not teal-and-orange, not desaturated to grey. The
  clothing is the darkest thing in the frame. No bright accent colours anywhere.
- **Surfaces.** Plain plaster or concrete walls with fine natural texture. Bare floors.
  Nothing decorative, nothing branded, no signage, no plants, no furniture unless the
  brief names it.
- **Camera.** Full-frame, 35mm to 85mm depending on the shot, shallow but not blurry
  depth of field. Realistic photographic grain. Sharp where it counts.
- **Composition.** Editorial and calm. Generous negative space. The subject is rarely
  centred. Nothing is cropped tight to the edge.
- **People.** When a figure appears: real-looking, unposed, relaxed, neutral expression,
  no eye contact with the camera unless the brief says so, hair plain, no visible makeup
  styling, no jewellery, no watches. Different people across frames is fine; they should
  all look like they belong in the same world.
- **Absolutely no text of any kind in the image.** No logos, no wordmarks, no lettering
  on garments, no signage, no watermarks, no captions. Graphics on clothing are abstract
  shapes only.

### The garments — these are real pieces and must be described accurately

**Session 1 is already shot, and it is a record rather than a queue.** Some of its frames
were briefed around the Work Jacket, which has since left the catalogue. Those briefs are
kept as written because they describe photographs that exist; do not re-shoot them, and do
not read the Work Jacket back into the catalogue from them.

- **Arc Hoodie** — black heavyweight brushed-back fleece, double-layer hood, tight ribbed
  cuffs and hem so the body holds volume. An abstract arc shape runs low across the back.
- **Core Tee** — washed black heavyweight cotton jersey, boxy through the chest and
  shoulder, shortened body, ribbed collar. No visible graphic.
- **Utility Cargo Pant** — black cotton twill, reinforced stitching, drawcord at the hem.

### Output rules for every image

- Generate at the **native size named in the brief for that image** — do not substitute.
- **Respect the safe area named for that image.** Each frame gets cropped on the site,
  sometimes hard, so keep the subject inside the area named and leave the rest as
  background. A frame that fills the whole canvas edge-to-edge will lose its subject.
- After generating, print one line: the **filename** for that image, and nothing else.
- Photorealistic. No illustration, no 3D render, no collage, no borders, no frames.

### The queue — 12 images

**1. `cmp-001-a.png`** — Portrait 1024×1536. A figure walking past a plain plaster wall in
the Arc Hoodie, caught mid-stride so the fleece moves with them. Three-quarter to full
length. Motion is real but not blurred. Daylight from the side. The site sizes this frame
by its height and derives the width from the shape, so nothing is cropped — compose it as
the finished picture.

**2. `cmp-001-b.png`** — Portrait 1024×1536. A figure standing square against a raw
concrete wall in the Core Tee, arms down, still, full length. The point of the shot is the
boxy silhouette holding its shape rather than draping. Flat even daylight. This is the
sequence's full-height frame: it runs the height of the viewport, uncropped, so the whole
figure is the composition.

**3. `cmp-001-c.png`** — Landscape 1536×1024. A single figure at distance under a concrete
underpass, wearing the Work Jacket and the Utility Cargo Pant. The architecture dominates;
the person is small in the frame and off-centre. End of the day, flat grey daylight, long
empty ground in front of them. Runs wide and uncropped.

**4. `drop-001-cover.png`** — Landscape 1536×1024. Two figures against a long plaster
wall, one in the Arc Hoodie, one in the Work Jacket, standing apart and not interacting.
Unposed, mid-conversation-that-has-stopped. This is the cover image for a released drop —
it should read as a group of clothes existing in a place, not as a fashion advertisement.
Held as the drop's cover, which today is a fallback rather than a rendered frame — see the
note under Session 1 above.

**5. ~~`drop-002-cover.png`~~ — WITHDRAWN.** This was a work table with partly cut canvas,
a chalk line and pins: a picture of a drop being made, standing in for a drop. `/drop` and
the home page preview Drop 002 through the two pieces announced for it instead, and
`Drop.cover` is optional so an unshot release simply carries no cover. Shoot this slot only
when there are garments to photograph.

The four `nav-*` frames are NOT thumbnails. Each one fills a tall panel down the right of
the full-screen menu — roughly half the window wide and its whole height — with the menu's
type crossing it under a scrim. So: one figure, strong separation from the wall, no
clutter, and a little room above the head, because the panel crops from the edges.

**6. `nav-shop.png`** — Portrait 1024×1536. A three-quarter length figure against a plain
bone-coloured wall wearing the Core Tee and the Utility Cargo Pant, standing relaxed,
looking away. Safe area: crops to a tall 2:3.

**7. `nav-drop.png`** — Portrait 1024×1536. Full length figure in the Arc Hoodie, hood
down, standing against a concrete wall in soft daylight, hands in the front pocket. Calmer
and more frontal than image 6 so the two thumbnails do not read as the same picture. Safe
area: crops to a tall 2:3.

**8. `nav-archive.png`** — Portrait 1024×1536. (Keyed to `/releases`; the file name is
kept so nothing has to be re-exported.) A very close study of cloth: the ribbed cuff
and sleeve seam of a black heavyweight fleece, raking daylight across it so the texture of
the knit and the stitch line are the whole subject. No garment shape, no person. Safe area:
crops to 3:4.

**9. `nav-about.png`** — Portrait 1024×1536. A figure seen small and from behind, walking
away down an empty street of plain low buildings, wearing the Work Jacket. Overcast. The
street is most of the frame. Safe area: crops to a tall 2:3.

**10. ~~`abt-01.png`~~ — WITHDRAWN.** A work table from above with pattern pieces, a
part-sewn sample and a tape measure. It opened `/about`, which is now a statement about the
clothes rather than about how they are made, and the page leads on image 11 instead. The
`ABT-01` slot still exists in `lib/catalog/images.ts` and points at image 11's file; a
replacement, if one is ever shot, should be a garment or a figure.

**11. `abt-02.png`** — Landscape 1536×1024. Two figures on a quiet street outside a plain
industrial door, one in the Work Jacket and one in the Arc Hoodie, standing still, not
looking at the camera. This is the label's own page, so it should feel like the place the
work happens rather than a campaign. Safe area: crops to 16:9 on desktop and 4:5 on mobile
— keep both figures inside the centre half of the width.

**12. ~~`prc-01.png`~~ — WITHDRAWN.** A pattern piece and a part-sewn sample on a work
table. It was the picture in the home page's studio band, and that section — the six named
stages of production under a wide workshop frame — no longer exists. Nothing renders this
file.

Confirm you have the brief, then generate image 1.

---

## Session 2 prompt — paste everything below this line

You are my art director and image generator for a photography set. Read this whole brief,
confirm in two lines that you have it, then generate **image 1 only** and stop. After that,
every time I say `next` you generate the next image in the queue and stop again. Never
generate two images in one turn. Never skip ahead. If I say `again`, regenerate the current
image with a different take rather than moving on.

### The set

Three garments, three frames each, nine images. Same world as Session 1: warm
plaster and raw concrete, one soft directional daylight source, warm neutrals only, no
props, no styling noise, no text of any kind anywhere in the image. `cmp-001-hero.jpg` is
the reference for light and grade.

The three frames repeat for every piece, in this order:

- **`-01` front flat.** Square 1024×1024. The garment laid flat and square to the camera on
  a plain warm-neutral surface, shot from directly above, filling most of the frame with an
  even margin. Nothing else in the picture. This is the frame that becomes a 64px thumbnail,
  so the silhouette has to read at that size: shoulders square, sleeves straight, no folds
  that break the outline.
- **`-03` detail.** Portrait 1024×1365 (3:4). One construction detail at close range —
  named per piece below. Shallow depth, the detail sharp and the rest falling off. This is
  the frame that has to prove the garment is made rather than printed.
- **`-04` on-body, full length.** Portrait 1024×1536 (2:3). One person wearing the piece,
  full length, standing, still, not looking at the camera, against plaster or concrete.
  Unposed. No jewellery, no visible makeup. The point of the shot is the silhouette, so the
  whole garment must be inside the frame with room above the head and below the feet.

The same small cast recurs across the set — reuse the two figures from `cmp-001-b` and
`nav-drop` rather than a new face per garment. Bottom halves are the Utility Cargo Pant or
plain black trousers throughout, so the tops read against a constant.

### Output rules for every image

- Generate at the **native size named for that frame type** — do not substitute.
- Keep the subject inside the frame with margin. Every one of these gets cropped by the
  site at some width.
- After generating, print one line: the **filename**, and nothing else.
- Photorealistic. No illustration, no 3D render, no collage, no borders, no frames.

### The three garments

Colour and construction are from `lib/catalog/products.ts` and are not to be embellished.

| Code | Piece | Colour | Made from | Fit | The `-03` detail |
|---|---|---|---|---|---|
| `CORE-TEE` | Core Tee | washed black | heavyweight cotton jersey, ribbed collar, tonal embroidery | boxy, drops at the shoulder | the ribbed collar and the tonal embroidery beside it |
| `ARC-HOODIE` | Arc Hoodie | black | heavyweight brushed-back fleece, double-layer hood, metal-tipped drawcord | relaxed, dropped shoulder | the metal drawcord tip against the double-layer hood edge |
| `CARGO-PANT` | Utility Cargo Pant | black | cotton twill, reinforced bar-tacking, adjustable hem drawcord | wide leg, mid rise, stacks over footwear | a bar-tacked pocket corner, stitching visible |

### The queue — 9 images

Three blocks of three, in catalogue order. For each piece, generate `-01`, then `-03`, then
`-04`, using the frame specifications above and the row for that piece in the table.

1. `core-tee-01.png` · 2. `core-tee-03.png` · 3. `core-tee-04.png`
4. `arc-hoodie-01.png` · 5. `arc-hoodie-03.png` · 6. `arc-hoodie-04.png`
7. `cargo-pant-01.png` · 8. `cargo-pant-03.png` · 9. `cargo-pant-04.png`

Confirm you have the brief, then generate image 1.

### Wiring the results in

Convert on the way in, the same way Session 1 was:

```bash
node -e "require('sharp')('in.png').jpeg({quality:86,mozjpeg:true,chromaSubsampling:'4:4:4'}).toFile('public/photography/out.jpg')"
```

Then add `src` to the matching slot in `shots()` in `lib/catalog/products.ts`, remove that
piece from `PENDING_PHOTOGRAPHY` in `lib/catalog/photography.test.ts`, and run `npm test`.
No layout moves — the slot already holds its ratio.
