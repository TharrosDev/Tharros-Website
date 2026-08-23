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
  // A ruled block on the page surface, not a filled bone panel. Bone is the
  // right idea — it is what a pending image slot is made of — but it is only
  // safe under `--ink`: `--ink-muted` reads 4.15:1 on it and `--ink-faint`
  // 3.66:1, both under AA, and a notice is mostly secondary text. Verified by
  // converting the oklch values to linear sRGB and computing the ratio, because
  // Chromium serialises oklch() as lab() and parsing the computed string lies.
  // Bounded by the measure of the prose it holds, plus its own padding. The
  // three routes that place it full-frame — checkout, the size guide, the legal
  // drafts — drew a 1600px ruled box around a 65ch paragraph on a wide screen,
  // which reads as a box that failed to fill rather than as a notice.
  return (
    <Reveal className="max-w-[calc(var(--measure-body)+5rem)] border border-ink p-8 md:p-10">
      <p className="type-meta text-ink-faint">{label}</p>
      <p className="type-display-4 mt-4 max-w-[26ch]">{title}</p>
      {children ? <div className="mt-5 space-y-4">{children}</div> : null}
    </Reveal>
  );
}
