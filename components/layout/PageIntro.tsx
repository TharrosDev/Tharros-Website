import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import SplitLines from "@/components/motion/SplitLines";

type Props = {
  index: string;
  label: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  /** Tightens the block on dense pages like checkout. */
  compact?: boolean;
  /**
   * Overrides the title step. The shop deliberately opens a rung below the
   * editorial pages: at display-1 its title outsized the brand's own opening
   * headline and pushed the first row of product most of a screen down, on the
   * one page whose job is to show the clothes.
   */
  titleClass?: string;
  /**
   * Set the title a line at a time. Off for the routes whose h1 is the largest
   * paint — the shop's first grid row sits under it — and off where the title
   * is a customer's own search term, which is not a statement and should not
   * perform like one.
   */
  split?: boolean;
};

/**
 * The opening block on every page that does not lead with a hero image. It
 * also carries the clearance for the fixed header, so no page has to remember
 * to add top padding.
 */
export default function PageIntro({
  index,
  label,
  title,
  lead,
  crumbs,
  children,
  compact = false,
  titleClass,
  split = false,
}: Props) {
  return (
    <div
      className={`page-frame ${compact ? "page-top-tight pb-10" : "page-top pb-16 md:pb-20"}`}
    >
      {crumbs && crumbs.length > 0 ? (
        <Breadcrumbs trail={crumbs} current={title} className="mb-8" />
      ) : null}

      <div className="flex items-baseline gap-4 border-t border-ink pt-4">
        <p className="eyebrow">
          <span className="num">{index}</span>
          <span>{label}</span>
        </p>
      </div>

      {/* The measure follows the step. 14ch is a display-1 line; at display-2 or
          display-3 the same value is a hard wrap, which the shop's search view
          hits every time — its title is a quoted query, and a query is as long
          as someone typed. */}
      {(() => {
        // `break-words` because one page title is a customer's own search
        // term. Display type at 6rem with an unbroken 400-character token
        // paints straight out of its column otherwise.
        const headingClass = `${titleClass ?? (compact ? "type-display-3" : "type-display-1")} mt-10 break-words md:mt-12 ${
          titleClass || compact ? "max-w-[22ch]" : "max-w-[14ch]"
        }`;
        return split ? (
          <SplitLines as="h1" text={title} className={headingClass} />
        ) : (
          <h1 className={headingClass}>{title}</h1>
        );
      })()}

      {lead ? <p className="type-lead mt-8">{lead}</p> : null}

      {children}
    </div>
  );
}
