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
  /** Hold the scene still while its timeline plays out. */
  pin?: boolean;
  /**
   * Tie the timeline to the scrollbar. A number is the lag in seconds; `true`
   * snaps directly. Off means the scene plays once on entry.
   */
  scrub?: boolean | number;
  /** ScrollTrigger start, e.g. "top top" or "top 70%". */
  start?: string;
  /** ScrollTrigger end. With `pin`, this is how long the scene is held. */
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
  pin = false,
  scrub = SCRUB,
  start = pin ? "top top" : "top 80%",
  end = pin ? "+=100%" : "bottom top",
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

      // A pinned scene is built twice: held on a wide screen, and scrubbed
      // without the hold below that. See QUERY.wide — a phone's viewport
      // changes height as the browser chrome collapses, so a pin there is a
      // section measured against a moving ruler. The choreography is identical
      // either way; only the hold is conditional.
      const build = (holding: boolean) => () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: node,
            start: holding ? start : "top 80%",
            end: holding ? end : "bottom top",
            pin: holding,
            // Pinning without this leaves a 1px seam where the spacer rounds.
            anticipatePin: holding ? 1 : 0,
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

      if (pin) {
        media.add(`${QUERY.motion} and ${QUERY.wide}`, build(true));
        media.add(`${QUERY.motion} and ${QUERY.narrow}`, build(false));
      } else {
        media.add(QUERY.motion, build(false));
      }

      // Still. Every layer is placed at the state it ends on, so the
      // composition is the one the scene was designed around — just without
      // the travel between. Never an empty or half-built screen.
      media.add(QUERY.reduced, () => {
        for (const step of steps) {
          const targets = layer(step.layer);
          if (targets.length === 0 || !step.to) continue;
          const rest = { ...step.to };
          delete rest.duration;
          gsap.set(targets, rest);
        }
      });
    },
    [steps, pin, scrub, start, end],
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
