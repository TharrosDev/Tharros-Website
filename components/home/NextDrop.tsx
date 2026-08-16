import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { NEXT_DROP } from "@/lib/catalog/drops";

/**
 * What is coming, stated without a date — because there isn't one.
 *
 * This closes the page on the drop it opened with, so the whole home page is
 * bracketed by the release cycle rather than by a hero and a social grid. If
 * there is no drop in development the section does not render at all; an empty
 * "coming soon" would be exactly the invented anticipation the content rules
 * forbid.
 */
export default function NextDrop() {
  if (!NEXT_DROP) return null;

  return (
    <section className="on-dark rhythm-default">
      <div className="page-frame">
        <Reveal className="rule-draw flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-4">
          <p className="eyebrow">
            <span className="num text-signal-on-dark">{NEXT_DROP.index}</span>
            <span>{NEXT_DROP.name}</span>
          </p>
          <p className="type-meta text-ink-on-dark-faint">In development</p>
        </Reveal>

        <h2 className="type-display-2 mt-10 max-w-[16ch]">{NEXT_DROP.statement}</h2>

        <div className="mt-10 grid gap-x-12 gap-y-6 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-6">
            {NEXT_DROP.body.map((paragraph) => (
              <p key={paragraph} className="type-body text-ink-on-dark-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="type-meta text-ink-on-dark-faint">
              No release date is published until there is one.
            </p>
            <Link href="/drop" className="btn btn-outline-on-dark mt-8">
              Follow the build
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
