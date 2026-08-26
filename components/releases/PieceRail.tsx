import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import { RELEASE_STATE_LABEL, type ReleaseEntry } from "@/lib/catalog/releases";
import { thumbnailImage } from "@/lib/catalog/queries";

/**
 * The garments in a release, as pictures.
 *
 * It replaced a ledger of rows — number, name, drop, units made, units left —
 * which read every release as a stock report. What a visitor wants from a
 * release they did not buy is what was in it, and that is a photograph, a name
 * and whether it is gone.
 *
 * `thumbnailImage()` inverts the usual frame ladder because at this size a
 * full-body shot is a smudge.
 */
export default function PieceRail({ entries }: { entries: ReleaseEntry[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {entries.map((entry) => (
        <li key={entry.garmentId}>
          <Link href={`/releases/${entry.ref}`} className="group block">
            <div className="overflow-hidden bg-surface-frame">
              <div className="hover-zoom">
                <ImageSlot
                  image={thumbnailImage(entry.product)}
                  ratio="square"
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
                />
              </div>
            </div>
            <p className="type-body-sm mt-4 leading-tight uppercase">
              {entry.product.name}
            </p>
            <p className="type-meta mt-2 flex flex-wrap items-baseline gap-x-3 text-ink-faint">
              <span>{entry.product.colorway}</span>
              <span className={entry.state === "closed" ? "text-ink" : ""}>
                {RELEASE_STATE_LABEL[entry.state]}
              </span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
