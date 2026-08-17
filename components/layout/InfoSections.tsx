import Reveal from "@/components/ui/Reveal";

export type InfoSection = {
  index: string;
  title: string;
  body: string[];
};

/**
 * Shared body layout for the information and legal pages.
 *
 * Each section is a real `<section>` element carrying its own grid. It used to
 * be `display: contents` so the children could participate in one outer grid —
 * which works visually and removes the landmark from the accessibility tree in
 * several browser/AT pairings, so the sectioning these pages depend on for
 * structure was not reliably exposed.
 *
 * The rule draws itself here for the same reason it does everywhere else: five
 * of the site's routes opened on five static borders, which is the one place
 * the entrance gesture was completely absent.
 */
export default function InfoSections({ sections }: { sections: InfoSection[] }) {
  return (
    <div className="page-frame rhythm-tight">
      <div className="space-y-14">
        {sections.map((section, i) => (
          <section
            key={section.index}
            className="grid gap-x-12 gap-y-6 lg:grid-cols-12"
          >
            {/* `.rule-draw` only draws when it sits on the revealed element
                itself — the selector is `.reveal.rule-draw::before`. On a child
                it is a correct but static rule, which is the bug this file had
                in the first place. */}
            <Reveal className="rule-draw pt-4 lg:col-span-3" delay={i * 60}>
              <p className="eyebrow">
                <span className="num">{section.index}</span>
              </p>
              <h2 className="type-display-4 mt-4">{section.title}</h2>
            </Reveal>
            <Reveal
              className="space-y-5 lg:col-span-7 lg:col-start-5 lg:pt-4"
              delay={i * 60 + 90}
            >
              {section.body.map((paragraph) => (
                <p key={paragraph} className="type-body text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </section>
        ))}
      </div>
    </div>
  );
}
