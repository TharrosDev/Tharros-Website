import Wordmark from "@/components/ui/Wordmark";
import { CURRENT_DROP } from "@/lib/catalog/drops";

/**
 * THE OPENING TITLE — the label's name, the drop it is on, and then the site.
 *
 * It is armed by the head script in `app/layout.tsx`, not by React: three
 * conditions have to hold — the home page, the first view of this session, and
 * no stated preference for less motion — and checking them before first paint
 * is what stops a repeat visit flashing a curtain that an effect then removes.
 * Without `[data-entry]` on the root, none of the CSS below applies and this
 * markup is inert.
 *
 * IT IS CSS, NOT GSAP, AND THAT IS THE POINT. A timed opening is exactly what
 * keyframes are for, and a sequence driven by a library that arrives on a
 * promise is a sequence that can fail to arrive — leaving a full-bleed plane
 * over the site with nothing left to lift it. The animation ends in
 * `visibility: hidden` with `animation-fill-mode: forwards`, so the screen
 * clears whether or not a single line of JavaScript runs.
 *
 * IT DOES NOT DELAY THE LARGEST PAINT. The hero renders underneath it at full
 * priority and its preload is unaffected; this plane is painted on top of a
 * page that has already loaded, not in front of one that has not. Nothing here
 * waits on a network request — the wordmark is type and the numeral is a
 * string from the catalog.
 *
 * It states the real drop number rather than a spinner, which is the same rule
 * the rest of the site follows: say something true, or say nothing.
 *
 * `aria-hidden` and `inert`: it is never in the tab order and never announced.
 * A screen-reader user gets the page immediately, which is the correct
 * experience rather than a degraded one.
 */
export default function EntrySequence() {
  return (
    <div className="entry on-dark" aria-hidden="true" inert>
      <div className="entry-mark">
        <Wordmark className="type-display-3" label={false} />
        <p className="type-meta mt-4 text-ink-on-dark-muted">
          <span className="num text-signal-on-dark">{CURRENT_DROP.index}</span>
          <span className="ml-4">{CURRENT_DROP.name}</span>
        </p>
      </div>
    </div>
  );
}
