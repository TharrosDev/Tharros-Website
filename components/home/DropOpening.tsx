import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import Scene, { SceneLayer } from "@/components/motion/Scene";
import SplitLines from "@/components/motion/SplitLines";
import Magnetic from "@/components/motion/Magnetic";
import WornList from "@/components/campaign/WornList";
import { campaignFor } from "@/lib/catalog/campaign";
import { CURRENT_DROP } from "@/lib/catalog/drops";
import { listProducts } from "@/lib/catalog/queries";
import { formatDate } from "@/lib/format";

/**
 * THE OPENING SHOT — one picture, most of the screen, and the line over it.
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
 *   statement and the controls at the foot. A flat wash across the whole frame
 *   dims the middle third, which is the part of the picture with the subject
 *   in it and the part no type ever sits on.
 * - **The bands are the only dimming.** The header's own gradient on this
 *   route is the top band's upper reach, not a fourth layer.
 *
 * MOST OF THE SCREEN, NOT ALL OF IT. The frame was `100svh`, which made the
 * home page a splash screen: it ended on the darkest part of its own foot band
 * with nothing below it visible or implied, and the only reason to scroll was
 * the belief that a site normally has more. At `92svh` the paper of `TheRun`
 * and the top of its drawn rule sit under the picture, and the change of
 * surface is the scroll cue. Nothing has to say "scroll".
 *
 * THE FOOT IS TWO ANCHORS, NOT A STACK. The statement, the run figures, the
 * ledger bar, two controls and the worn rail were one left column. Five blocks
 * in a line need a foot band 62svh deep to stay readable, which is two thirds
 * of the photograph dimmed on a site whose thesis is that the clothing supplies
 * the colour. The statement and its controls hold the left; what is in the
 * frame holds the right; and the run figures are gone from here — `runStatus()`
 * prints them under every card in `TheRun` one screen below, and the record row
 * at the top of this frame already says how small the drop is. The band is
 * 44svh now and the picture is visible over half its own height.
 *
 * THE CAMERA. The picture is pushed in as the page scrolls while the type
 * drifts up faster than it does, and the wordmark between them drifts slower
 * than the type. That difference is what reads as depth: the frame is not
 * moving, the camera is. The scale sits on the picture's own wrapper, so it
 * composites and never repaints.
 *
 * WHAT IS NOT ANIMATED, and why. The h1 is the largest paint on the site's
 * most visited route. It is never hidden, never inside a pinned scene and
 * never waiting on GSAP — SplitLines renders it as ordinary text and enhances
 * it once the library arrives. There is no pin anywhere in here, and there is
 * no pin anywhere on the site — `Scene` does not take the prop.
 */
export default function DropOpening() {
  const pieces = listProducts({ drop: CURRENT_DROP.id });

  const released =
    CURRENT_DROP.status === "released" && CURRENT_DROP.releasedAt
      ? `Released ${formatDate(CURRENT_DROP.releasedAt)}`
      : "In development";

  const hero = campaignFor(CURRENT_DROP.id)?.hero;
  const frame = hero?.image ?? CURRENT_DROP.cover;

  return (
    <Scene
      as="section"
      /* `overflow-hidden` clips both the pushed-in picture and the bottom of
         the wordmark, which is the whole job now. It was `overflow-x-clip`
         with a separately clipped inner plate, so that a small detail frame
         could hang past the bottom edge into the section below; that frame is
         gone at the owner's direction and nothing replaces it, so the split is
         gone with it.

         `gap` under `justify-between` is a FLOOR, not a spacing decision: with
         room to spare the two blocks are pushed to the edges and the gap never
         applies, and on a landscape phone — where the record, the headline,
         two controls and the worn list add up to nearly twice the viewport —
         it is the only thing keeping the release record off the top of a 100px
         headline. */
      className="on-dark relative isolate flex min-h-[88svh] flex-col justify-between gap-10 overflow-hidden md:min-h-[92svh]"
      scrub
      start="top top"
      end="bottom top"
      steps={[
        // The push-in. Slow, and it never returns — a camera settling into the
        // scene rather than a zoom that breathes.
        { at: 0, layer: "picture", to: { scale: 1.12 } },
        // Three planes leaving at three rates. The wordmark sits between the
        // picture and the type in the depth stack, so it travels between them.
        { at: 0, layer: "wordmark", to: { yPercent: -4 } },
        // The type leaves faster than the picture does. Eight per cent of its
        // own height: enough to separate the planes, not enough to read as the
        // words sliding off the screen.
        { at: 0, layer: "type", to: { yPercent: -8 } },
        // The release record had a fourth rate, -18, and it was the steepest
        // travel on the smallest text on the screen. Four planes at four rates
        // over a photograph is one plane more than the eye reads as depth, and
        // the one it read least was the row carrying the only figures here.
        // It sits still now: three planes, and the record stays legible for
        // the whole of the scroll it is legible at the top of.
      ]}
    >
      {/* THE PICTURE. Behind everything and inert: every way into the shop
          from this screen is a real link in front of it. */}
      <SceneLayer
        name="picture"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* THE SUBJECT IS AT 62% ACROSS, SO THE CROP HAS TO KNOW THAT.
            `object-cover` takes the centre, and the centre of a 16:9
            photograph is not the centre of the box a phone gives it: at 390
            this frame shows 28% of the picture's width, so centred it kept the
            wall and cut the face off the right edge. Anchoring the crop at the
            subject puts her in the middle of a narrow frame.

            From `lg` the box is wide enough to hold nearly the whole picture,
            and there the default centre is what is wanted — it leaves her at
            62%, which is where the headline stops. */}
        <ImageSlot
          image={frame}
          fill
          priority
          sizes="100vw"
          imageClassName="object-[62%_center] lg:object-center"
        />
      </SceneLayer>

        {/* THE TOP BAND. Anchored to the record row and the header above it,
            ending before the subject.

            `max()` AGAINST A REM FLOOR, because the band is sized by the
            viewport and the row it protects is sized by the header height and a
            type ladder — two rulers that agree on a tall screen and part company
            on a short one. On a landscape phone 38svh is 148px, which puts the
            transparent end of the gradient exactly where the release record sits,
            and the row went unreadable wherever the photograph behind it was
            pale. The floor is roughly twice the row's own depth, so the fade is
            still dark where the text is. Above about 850px tall the viewport
            value is the larger of the two and nothing changes.

            The mid stop is 55% rather than 35%. A band is only as good as the
            level it actually holds where the text is, and at 35% the release
            record measured 1.65:1 against a pale wall — a straight AA failure
            on the site's most visited route, and one that predates this
            composition. The stop moved and the tone moved with it; neither
            alone got the row over 4.5. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[max(20rem,38svh)] bg-gradient-to-b from-black/70 via-black/55 to-transparent"
        />

        {/* THE FOOT BAND. Taller, because it carries the statement and two
            controls rather than one line of metadata — and floored the same
            way, against the depth of that stack rather than against the screen.
            It was `max(36rem,62svh)` when the run figures and the ledger bar
            were part of the stack; they are not, and a band kept at the old
            depth would be dimming a photograph to protect text that is no
            longer under it. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[max(24rem,44svh)] bg-gradient-to-t from-black/80 via-black/55 to-transparent"
        />

        {/* THE NAME, CUT BY THE EDGE IT SITS ON.

            Decorative — the accessible wordmark is the header's, and this one
            is `aria-hidden` rather than a second announcement of the same
            string. It sits behind the content and the section clips it, so the
            bottom of the letterforms is cut: an incomplete shape is the
            strongest "there is more below this" the composition can make,
            because the eye finishes the letter somewhere the page has to
            continue to.

            NOT MASKED AROUND THE SUBJECT. That treatment needs a photograph
            whose subject is in a known place, and every frame here is a
            stand-in that will be replaced. A crop against a straight edge holds
            at every width with one rule.

            The tone is low because this is a watermark in the picture and not a
            headline — at full strength it out-weighs the h1, which is the one
            thing in the frame that has to be read first. */}
        <SceneLayer
          name="wordmark"
          className="page-frame absolute inset-x-0 bottom-0 hidden translate-y-[58%] md:block"
        >
          {/* SIZED TO THE FRAME, NOT OFF THE LADDER. `type-colossal` tops out
              at 22rem, which at most widths is wider than the frame it sits in
              — the name broke across two lines behind the headline, which is
              mush rather than a watermark. Seven capitals of Archivo at this
              weight and tracking measure 4.9em, so the size is the frame's own
              inner width over that. Measured rather than estimated — the first
              pass guessed 4.35em and clipped the T and the S off the name at
              every width above `md`. `nowrap` keeps a future miscalculation a
              clip rather than a wrap.

              LEFT, AND SHORT OF THE FULL FRAME. It starts at the same gutter
              the headline does, so the whole composition hangs off one edge,
              and it stops well before the other one — which keeps the right of
              the photograph, the side the subject is on, clear of type. The
              size was originally cut to this to clear a detail frame in the
              bottom-right corner; that frame is gone, and the measure is kept
              because the composition reads better left-weighted than it did
              spanning the frame. */}
          <p
            aria-hidden="true"
            className="type-colossal whitespace-nowrap text-[min(13.5vw,13.5rem)] text-ink-on-dark/10"
          >
            Tharros
          </p>
      </SceneLayer>

      {/* The record of the release, stated once, at the head of the frame. */}
      <div className="page-frame relative pt-[calc(var(--header-h)+2.5rem)]">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-rule pt-4">
          <p className="type-meta text-ink-on-dark/90">
            {CURRENT_DROP.name}
            <span aria-hidden="true"> · </span>
            <span className="num">{pieces.length}</span>{" "}
            {pieces.length === 1 ? "piece" : "pieces"}
          </p>
          <p className="type-meta flex items-center gap-5 text-ink-on-dark/90">
            {released}
            {/* The trim mark. One, on the opening screen only — the site's
                single admission that it is laid out as printed matter rather
                than as a page. */}
            <span className="mark-registration" aria-hidden="true" />
          </p>
        </div>
      </div>

      <SceneLayer name="type" className="page-frame relative pb-14 md:pb-20">
        {/* ONE ANCHOR, ON THE LEFT: the statement, the two controls and what is
            in the picture, stacked against the gutter the rest of the page is
            already aligned to. The right of the frame stays photograph.

            This column used to be bounded to `calc(100% - 20rem)` to hold it
            off a detail frame in the bottom-right. That frame is gone, and the
            reservation went with it — every block in here carries its own
            measure (`13ch` on the headline, `max-w-md` on the worn list), so
            the bound was doing nothing except describing a neighbour that no
            longer exists. */}
        <div>
          {/* THE RUNG IS CHOSEN FOR THE FRAME, NOT A COLUMN. The type has the
              whole screen now rather than half of it, so display-1 fits at
              every width and the old rung-down at `md` went with the split. */}
          <SplitLines
            as="h1"
            text={CURRENT_DROP.statement}
            className="type-display-1 max-w-[13ch] text-balance"
          />

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 md:mt-12">
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
            <div className="mt-10 max-w-md md:mt-12">
              <WornList
                slugs={hero.wearing}
                frameId={hero.id}
                variant="rail"
                onDark
              />
            </div>
          ) : null}
        </div>
      </SceneLayer>

    </Scene>
  );
}
