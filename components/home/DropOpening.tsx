import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import Scene, { SceneLayer } from "@/components/motion/Scene";
import SplitLines from "@/components/motion/SplitLines";
import Magnetic from "@/components/motion/Magnetic";
import WornList from "@/components/campaign/WornList";
import { campaignFor } from "@/lib/catalog/campaign";
import { CURRENT_DROP } from "@/lib/catalog/drops";
import { listProducts, runStatus } from "@/lib/catalog/queries";
import { formatDate } from "@/lib/format";

/**
 * THE OPENING SHOT — one picture, the whole screen, and the line over it.
 *
 * This replaces a split composition in which the type held the left half of
 * the page and the photograph was masked into the right. That version existed
 * to avoid a scrim: on a light ground, dimming a photograph so ink can sit on
 * it is a tax the whole composition pays. It was the right answer for a page
 * that opened as a document.
 *
 * The site does not open as a document any more. It opens as a frame, and a
 * frame that takes half the screen is a picture on a page rather than a shot.
 * So the scrim comes back, and it is paid for deliberately:
 *
 * - **Two anchored bands, not a flat wash.** The bands are attached to the
 *   blocks they protect — one under the metadata at the top, one under the
 *   statement and the ledger at the foot. A flat wash across the whole frame
 *   dims the middle third, which is the part of the picture with the subject
 *   in it and the part no type ever sits on.
 * - **The bands are the only dimming.** The header's own gradient on this
 *   route is the top band's upper reach, not a fourth layer.
 *
 * THE CAMERA. The picture is pushed in as the page scrolls while the type
 * drifts up faster than it does. That difference is what reads as depth: the
 * frame is not moving, the camera is. The scale sits on the picture's own
 * wrapper, so it composites and never repaints.
 *
 * WHAT IS NOT ANIMATED, and why. The h1 is the largest paint on the site's
 * most visited route. It is never hidden, never inside a pinned scene and
 * never waiting on GSAP — SplitLines renders it as ordinary text and enhances
 * it once the library arrives. The run ledger keeps its CSS draw rather than
 * being tied to scroll: mid-scroll a scrubbed bar shows a proportion the
 * inventory does not claim, and this bar's whole argument is that it can only
 * draw what the data already says.
 */
export default function DropOpening() {
  const pieces = listProducts({ drop: CURRENT_DROP.id });
  const made = pieces.reduce((sum, product) => sum + product.runSize, 0);
  const remaining = pieces.reduce(
    (sum, product) => sum + runStatus(product).remaining,
    0,
  );
  // The share of the run that is gone. Guarded because an empty drop is a real
  // state — the catalogue ships placeholder and a drop with nothing in it would
  // otherwise divide by zero and render NaN into a transform.
  const taken = made > 0 ? (made - remaining) / made : 0;

  const released =
    CURRENT_DROP.status === "released" && CURRENT_DROP.releasedAt
      ? `Released ${formatDate(CURRENT_DROP.releasedAt)}`
      : "In development";

  const hero = campaignFor(CURRENT_DROP.id)?.hero;
  const frame = hero?.image ?? CURRENT_DROP.cover;

  return (
    <Scene
      as="section"
      className="on-dark relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden"
      scrub
      start="top top"
      end="bottom top"
      steps={[
        // The push-in. Slow, and it never returns — a camera settling into the
        // scene rather than a zoom that breathes.
        { at: 0, layer: "picture", to: { scale: 1.12 } },
        // The type leaves faster than the picture does. Eight per cent of its
        // own height: enough to separate the planes, not enough to read as the
        // words sliding off the screen.
        { at: 0, layer: "type", to: { yPercent: -8 } },
        { at: 0, layer: "record", to: { yPercent: -18 } },
      ]}
    >
      {/* THE PICTURE. Behind everything and inert: every way into the shop
          from this screen is a real link in front of it. */}
      <SceneLayer
        name="picture"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <ImageSlot image={frame} fill priority sizes="100vw" />
      </SceneLayer>

      {/* THE TOP BAND. Anchored to the record row and the header above it,
          ending before the subject. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38svh] bg-gradient-to-b from-black/70 via-black/35 to-transparent"
      />

      {/* THE FOOT BAND. Taller, because it carries the statement, the ledger
          and two controls rather than one line of metadata. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[62svh] bg-gradient-to-t from-black/80 via-black/50 to-transparent"
      />

      {/* The record of the release, stated once, at the head of the frame. */}
      <SceneLayer
        name="record"
        className="page-frame relative pt-[calc(var(--header-h)+2.5rem)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-rule pt-4">
          <p className="type-meta text-ink-on-dark-muted">
            {CURRENT_DROP.name}
            <span aria-hidden="true"> · </span>
            <span className="num">{pieces.length}</span>{" "}
            {pieces.length === 1 ? "piece" : "pieces"}
          </p>
          <p className="type-meta flex items-center gap-5 text-ink-on-dark-muted">
            {released}
            {/* The trim mark. One, on the opening screen only — the site's
                single admission that it is laid out as printed matter rather
                than as a page. */}
            <span className="mark-registration" aria-hidden="true" />
          </p>
        </div>
      </SceneLayer>

      <SceneLayer name="type" className="page-frame relative pb-14 md:pb-20">
        {/* THE RUNG IS CHOSEN FOR THE FRAME, NOT A COLUMN. The type has the
            whole screen now rather than half of it, so display-1 fits at every
            width and the old rung-down at `md` went with the split. */}
        <SplitLines
          as="h1"
          text={CURRENT_DROP.statement}
          className="type-display-1 max-w-[13ch] text-balance"
        />

        <Reveal className="mt-10 max-w-xl md:mt-12">
          <div className="flex items-baseline justify-between gap-6">
            <p className="type-meta">
              <span className="num">{made}</span> made
            </p>
            <p className="type-meta">
              <span className="num">{remaining}</span> left
            </p>
          </div>
          <div
            aria-hidden="true"
            className="run-ledger mt-3"
            style={{ "--run-taken": taken } as React.CSSProperties}
          />
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Magnetic>
            <Link
              href={`/shop?drop=${CURRENT_DROP.slug}`}
              className="btn btn-inverse"
            >
              Shop the drop
            </Link>
          </Magnetic>
          <Link href="/drop" className="link-rule link-rule-reveal">
            About this drop
          </Link>
        </div>

        {/* The way into the shop from the picture rather than from the
            buttons: what is actually being worn in the frame. */}
        {hero ? (
          <div className="mt-12 max-w-md">
            <WornList
              slugs={hero.wearing}
              frameId={hero.id}
              variant="rail"
              onDark
            />
          </div>
        ) : null}
      </SceneLayer>
    </Scene>
  );
}
