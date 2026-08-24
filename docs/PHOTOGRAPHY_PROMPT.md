# Photography generation — master prompts

The image slots on this site are declared in data and render as stand-ins until a `src`
is filled in (see `components/media/ImageSlot.tsx`). These are the prompts used to
generate the real frames, one paste per session.

The home hero (`CMP-001-HERO`, `public/hero-drop-001.png`) is done and is the reference
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

**Session 2 — product frames (27 images).** Not written yet: three frames per piece
(front flat, detail, on-body) across the nine products in `lib/catalog/products.ts`.

---

## Session 1 prompt — paste everything below this line

You are my art director and image generator for a photography set. Read this whole brief,
confirm in two lines that you have it, then generate **image 1 only** and stop. After that,
every time I say `next` you generate the next image in the queue and stop again. Never
generate two images in one turn. Never skip ahead. If I say `again`, regenerate the current
image with a different take rather than moving on.

### The brand

THARROS is a small independent streetwear label. It designs, patterns and samples in-house
and releases numbered drops of a few pieces in short runs. The line is "Small runs.
Original ideas." It is not a department store and not a hype brand. The tone is quiet
confidence: a small label that knows what it made.

### The visual system — this is the part that matters most

Every frame must look like it came from the same day, the same photographer and the same
camera as the others.

- **Light.** Soft directional daylight, as if from a large window or an overcast sky just
  out of frame. One source. Gentle falloff, no hard rim light, no studio strobe look, no
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

- **Arc Hoodie** — black heavyweight brushed-back fleece, double-layer hood, tight ribbed
  cuffs and hem so the body holds volume. An abstract arc shape runs low across the back.
- **Core Tee** — washed black heavyweight cotton jersey, boxy through the chest and
  shoulder, shortened body, ribbed collar. No visible graphic.
- **Work Jacket** — faded black cotton canvas, four patch pockets on the front, corozo
  buttons, slightly worn.
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

**5. `drop-002-cover.png`** — Landscape 1536×1024. A close, quiet detail of work in
progress: black cotton canvas partly cut, a tailor's chalk line across it, a few pins.
Shot from directly above on a pale worn work table. No hands, no face. This stands for a
drop that is still being sampled, so it should look unfinished. Rendered in an upright
frame on `/drop`, so the middle of the picture is what survives — keep the chalk line and
the pins near the centre.

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

**8. `nav-archive.png`** — Portrait 1024×1536. A very close study of cloth: the ribbed cuff
and sleeve seam of a black heavyweight fleece, raking daylight across it so the texture of
the knit and the stitch line are the whole subject. No garment shape, no person. Safe area:
crops to 3:4.

**9. `nav-about.png`** — Portrait 1024×1536. A figure seen small and from behind, walking
away down an empty street of plain low buildings, wearing the Work Jacket. Overcast. The
street is most of the frame. Safe area: crops to a tall 2:3.

**10. `abt-01.png`** — Landscape 1536×1024. A work table seen from above: paper pattern
pieces weighted flat, a part-sewn black sample garment, a folded length of cotton canvas, a
tape measure. Ordinary, in use, not styled. Soft daylight from the left. **This one is
cropped hardest — a 21:9 letterbox on desktop and a 4:5 upright on mobile.** So: fill the
frame edge to edge with table, and keep the three or four things that matter clustered in
the middle third, both horizontally and vertically.

**11. `abt-02.png`** — Landscape 1536×1024. Two figures on a quiet street outside a plain
industrial door, one in the Work Jacket and one in the Arc Hoodie, standing still, not
looking at the camera. This is the label's own page, so it should feel like the place the
work happens rather than a campaign. Safe area: crops to 16:9 on desktop and 4:5 on mobile
— keep both figures inside the centre half of the width.

**12. `prc-01.png`** — Landscape 1536×1024. A single paper pattern piece and a part-sewn
black sample on a worn work table, shot low and along the surface rather than from above,
so the table runs out of focus into the background. Quieter and closer than image 10 — the
two must not look like the same photograph. **Also cropped to 21:9 on desktop and 4:5 on
mobile**, so keep the subject in the middle third both ways.

Confirm you have the brief, then generate image 1.
