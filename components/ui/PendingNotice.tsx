import Reveal from "./Reveal";

/**
 * A designed "not finished yet".
 *
 * The site is honest about its own state everywhere else in a way you can see:
 * an image slot without a photograph draws a framed, stamped, unmistakable
 * pending frame. The pages that admit to being unfinished said so in a sentence
 * — the size guide's underneath two tables of em dashes, the legal drafts' in
 * the lead where it read as a subtitle. This gives that admission the same
 * treatment the missing photography gets.
 */
export default function PendingNotice({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <Reveal className="border border-ash bg-surface-frame p-8 md:p-10">
      <p className="type-meta text-ink-faint">{label}</p>
      <p className="type-display-4 mt-4 max-w-[26ch]">{title}</p>
      {children ? <div className="mt-5 space-y-4">{children}</div> : null}
    </Reveal>
  );
}
