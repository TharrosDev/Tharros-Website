import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { INFORMATION } from "@/lib/site";

/**
 * The rest of the information, from inside the information.
 *
 * These eight routes are one sequence and used to behave like eight unrelated
 * pages: shipping did not link returns, returns did not link the refund policy
 * that restates it, and the FAQ restated both and linked neither. The only way
 * across was the footer, every time.
 *
 * It is a ledger rather than a nav bar — the same mono index the set now shares,
 * so the page you are on has a place in a numbered run you can see the shape of.
 */
export default function InfoFooter({ current }: { current: string }) {
  const rest = INFORMATION.filter((entry) => entry.href !== current);

  return (
    <div className="page-frame rhythm-tight">
      <Reveal className="rule-draw pt-4">
        <p className="eyebrow">The rest of it</p>
      </Reveal>
      <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((entry, i) => (
          <Reveal as="li" key={entry.href} delay={Math.min(i, 4) * 50}>
            <Link
              href={entry.href}
              className="flex items-baseline gap-4 border-b border-rule py-4 transition-opacity hover:opacity-60"
            >
              <span className="num type-meta text-ink-faint">{entry.index}</span>
              <span className="type-body-sm">{entry.name}</span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
