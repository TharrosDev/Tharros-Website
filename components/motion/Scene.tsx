"use client";

import { useRef } from "react";
import { useScene } from "@/lib/motion/use-scene";
import { SCRUB, EASE, DEPTH, type Depth } from "@/lib/motion/config";
import { QUERY } from "@/lib/motion/media";

/**
 * One instruction on a scene's timeline.
 *
 * `at` and `span` are FRACTIONS of the scene, not seconds. A scrubbed scene
 * has no duration of its own — the scroll is the clock — so positions have to
 * be expressed as places in the shot rather than as time. It also means a
 * scene reads the way it was storyboarded:
 *
 *   { at: 0.00, layer: "bg",    to: { scale: 1.12 } }
 *   { at: 0.15, layer: "model", to: { yPercent: -8 } }
 *   { at: 0.30, layer: "type",  to: { clipPath: "inset(0 0 0%)" } }
 */
export type SceneStep = {
  /** Where on the scene this begins. 0 = scene entry, 1 = scene exit. */
  at: number;
  /** How much of the scene it occupies. Defaults to the remainder. */
  span?: number;
  /** The `data-layer` name it addresses. */
  layer: string;
  /** Starting state. See the note on hidden states below. */
  from?: Record<string, unknown>;
  /** Ending state. */
  to?: Record<string, unknown>;
};

type Props = {
  children: React.ReactNode;
  steps: SceneStep[];
  /**
   * Tie the timeline to the scrollbar. A number is the lag in seconds; `true`
   * snaps directly. Off means the scene plays once on entry.
   */
  scrub?: boolean | number;
  /** ScrollTrigger start, e.g. "top top" or "top 70%". */
  start?: string;
  /** ScrollTrigger end. */
  end?: string;
  className?: string;
  as?: "div" | "section" | "figure";
};

/**
 * THE SCENE — a composition whose parts move against each other on scroll.
 *
 * The site's other entrance, `Reveal`, answers "has this arrived yet". A scene
 * answers "where are we in this shot", which is a different question and needs
 * a timeline rather than a boolean.
 *
 * Three things make this safe to use across eighteen routes:
 *
 * 1. **It is declarative.** The choreography is data, so a scene can be read
 *    and re-timed without unpicking an imperative timeline. Forty hand-rolled
 *    timelines is the animation spaghetti this component exists to prevent.
 *
 * 2. **Reduced motion is a branch, not a speed.** `gsap.matchMedia` runs the
 *    reduced context with no ScrollTrigger at all and sets the resting state
 *    directly. Writing a transform and then zeroing it still moves the element
 *    for a frame; not writing one is the only version that is actually still.
 *
 * 3. **It never hides anything.** GSAP arrives on a promise, a frame or two
 *    after paint, so a `from` state that hides content would flash it visible
 *    and then remove it. Author scenes to move content that is already
 *    readable. Where something genuinely must start hidden, declare that in
 *    CSS under `[data-js]` — the mechanism `.reveal` uses — and animate out of
 *    it here.
 *
 * `children` are server-rendered and passed straight through: this is a client
 * leaf, so a scene never drags a page into the client bundle.
 */
export default function Scene({
  children,
  steps,
  scrub = SCRUB,
  start = "top 80%",
  end = "bottom top",
  className = "",
  as = "div",
}: Props) {
  const Tag = as as React.ElementType;
  const root = useRef<HTMLElement>(null);

  useScene(
    root,
    ({ gsap }, node) => {
      const layer = (name: string) =>
        node.querySelectorAll<HTMLElement>(`[data-layer="${name}"]`);

      const media = gsap.matchMedia();

      // NOTHING HERE HOLDS THE PAGE.
      //
      // A scene used to be buildable twice — pinned on a wide screen, scrubbed
      // without the hold below that, because a phone's viewport changes height
      // as the browser chrome collapses and a pin there is a section measured
      // against a moving ruler. The narrow branch is now the only branch: the
      // site does not stop or slow the scroll anywhere, at the owner's
      // direction, so `pin`, the wide/narrow split and the pin budget are all
      // gone with it. What is left is what every phone was already getting.
      const build = () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: node,
            start,
            end,
            scrub,
            invalidateOnRefresh: true,
          },
          defaults: { ease: EASE.scrub },
        });

        for (const step of steps) {
          const targets = layer(step.layer);
          if (targets.length === 0) continue;

          const span = step.span ?? Math.max(0.001, 1 - step.at);
          const vars = { ...(step.to ?? {}), duration: span };

          if (step.from) {
            timeline.fromTo(targets, step.from, vars, step.at);
          } else {
            timeline.to(targets, vars, step.at);
          }
        }

        // Normalised to 1, so `at` and `span` read as fractions of the scene
        // rather than as seconds nobody chose.
        timeline.totalDuration(1);
      };

      media.add(QUERY.motion, build);

      // Still — and still means the state the scene STARTS at, not the one it
      // ends on.
      //
      // This used to place every layer at its `to`, on the reasoning that the
      // end state is "the composition the scene was designed around". For a
      // scrubbed scene that is the wrong end of the timeline: `to` is where a
      // layer sits once the section has been scrolled past, so a reduced-motion
      // visitor was handed the hero as it looks on the way out. On the home
      // page that pushed the release record 18% of its own height off the top
      // of the frame and dropped the h1 on top of it — at 844x390 the record
      // row was clipped away entirely and "DROP 001 · 7 PIECES" rendered behind
      // "WHERE IT". The statement section did the same to its own eyebrow.
      //
      // A pure-travel step (`to` only) moves a layer away from a resting state
      // that is already correct, because scenes are authored on content that
      // reads unaided — so under reduced motion there is nothing to set. A step
      // that declares `from` is the other case: there the resting state is a
      // pre-state the scene settles OUT of, and `to` is where it belongs. Only
      // those are applied.
      //
      // CSS pre-states are handled the same way in `globals.css`, where
      // `.scene-oversize` resolves to `transform: none` under reduced motion.
      media.add(QUERY.reduced, () => {
        for (const step of steps) {
          if (!step.from || !step.to) continue;
          const targets = layer(step.layer);
          if (targets.length === 0) continue;
          const rest = { ...step.to };
          delete rest.duration;
          gsap.set(targets, rest);
        }
      });
    },
    [steps, scrub, start, end],
  );

  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}

/**
 * A named plane inside a scene. `depth` is optional sugar for the commonest
 * case — a layer that simply drifts against the ones around it.
 *
 * The depth ladder is in `lib/motion/config.ts`. It is a ladder rather than a
 * per-section guess because a background that moves 2% and a foreground that
 * moves 16% describes a space, whereas six hand-picked values describe
 * nothing.
 */
export function SceneLayer({
  name,
  depth,
  children,
  className = "",
  style,
  as = "div",
}: {
  name: string;
  depth?: Depth;
  children: React.ReactNode;
  className?: string;
  /**
   * A resting state the scrub settles out of — an over-scale, an offset.
   *
   * Declared here rather than as a step's `from` on purpose. GSAP arrives a
   * frame or two after paint, so a `from` state would render the layer at
   * rest and then jump it into position. Anything the scene animates *away*
   * from has to be true in the served HTML.
   */
  style?: React.CSSProperties;
  as?: "div" | "figure" | "span";
}) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      data-layer={name}
      data-depth={depth}
      className={className}
      style={
        depth
          ? ({ ...style, "--depth": DEPTH[depth] } as React.CSSProperties)
          : style
      }
    >
      {children}
    </Tag>
  );
}
