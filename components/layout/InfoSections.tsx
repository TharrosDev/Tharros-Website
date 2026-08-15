export type InfoSection = {
  index: string;
  title: string;
  body: string[];
};

/** Shared body layout for the information and legal pages. */
export default function InfoSections({ sections }: { sections: InfoSection[] }) {
  return (
    <div className="page-frame rhythm-tight">
      <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
        {sections.map((section) => (
          <section key={section.index} className="contents">
            <div className="lg:col-span-3">
              <p className="eyebrow border-t border-ink pt-4">
                <span className="num">{section.index}</span>
              </p>
              <h2 className="type-display-4 mt-4">{section.title}</h2>
            </div>
            <div className="space-y-5 lg:col-span-7 lg:col-start-5 lg:pt-4">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="type-body text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
