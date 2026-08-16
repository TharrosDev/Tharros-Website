import ImageSlot from "@/components/media/ImageSlot";
import ParallaxNumeral from "@/components/motion/ParallaxNumeral";
import ModelCredit from "./ModelCredit";
import WornList from "./WornList";
import type { CampaignFrame as Frame, Ratio } from "@/lib/catalog/types";

/**
 * One frame of the campaign, with everything it is allowed to say about itself:
 * its index, its line, who is in it, and what they are wearing.
 *
 * `align` decides whether the picture takes the page or shares it. A sequence
 * that alternates left, right and full is what stops a run of frames reading as
 * a gallery — the brief asks for controlled asymmetry, and this is where it
 * lives.
 *
 * Type is set *beside* the image, never over the garment. The only place type
 * sits on top of a picture is the page opener, which handles its own scrim.
 */
export default function CampaignFrame({
  frame,
  align = "left",
  ratio,
  ratioSm,
  priority = false,
  onDark = false,
}: {
  frame: Frame;
  align?: "left" | "right" | "full";
  ratio?: Ratio;
  ratioSm?: Ratio;
  priority?: boolean;
  onDark?: boolean;
}) {
  const muted = onDark ? "text-ink-on-dark-faint" : "text-ink-faint";
  const rule = onDark ? "border-rule-on-dark" : "border-rule";

  const meta = (
    <div className="flex flex-col gap-6">
      <div className={`flex items-baseline gap-4 border-t ${rule} pt-3`}>
        <ParallaxNumeral className={`type-mono-3 ${muted}`}>{frame.index}</ParallaxNumeral>
        {frame.caption ? (
          <p className={`type-body-sm ${onDark ? "text-ink-on-dark" : "text-ink"}`}>
            {frame.caption}
          </p>
        ) : null}
      </div>
      <ModelCredit modelIds={frame.models} onDark={onDark} />
      <WornList
        slugs={frame.wearing}
        frameId={frame.id}
        variant={align === "full" ? "rail" : "stack"}
        onDark={onDark}
      />
    </div>
  );

  if (align === "full") {
    return (
      <figure>
        {/* A full-width frame takes a wide ratio whatever the slot declares: a
            portrait run edge to edge on a desktop is nearly two screens tall,
            and the reader loses the picture scrolling through it. On a phone it
            goes back to a tall frame, where full width is only 390px. */}
        <ImageSlot
          image={frame.image}
          ratio={ratio ?? "campaign"}
          ratioSm={ratioSm ?? "editorial"}
          sizes="100vw"
          priority={priority}
        />
        <figcaption className="page-frame mt-6">
          <div className="max-w-3xl">{meta}</div>
        </figcaption>
      </figure>
    );
  }

  const imageFirst = align === "left";

  return (
    <figure className="grid grid-cols-12 items-start gap-x-8 gap-y-8">
      <div
        className={
          imageFirst
            ? "col-span-12 md:col-span-8"
            : "col-span-12 md:col-span-8 md:col-start-5 md:order-2"
        }
      >
        <ImageSlot
          image={frame.image}
          ratio={ratio}
          ratioSm={ratioSm}
          sizes="(min-width: 768px) 66vw, 100vw"
          priority={priority}
        />
      </div>

      <figcaption
        className={
          imageFirst
            ? "col-span-12 md:col-span-3 md:col-start-10 md:pt-10"
            : "col-span-12 md:col-span-3 md:col-start-1 md:row-start-1 md:pt-10"
        }
      >
        {meta}
      </figcaption>
    </figure>
  );
}
