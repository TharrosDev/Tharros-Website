import ImageSlot from "@/components/media/ImageSlot";
import { SOCIAL } from "@/lib/site";

const TILES = Array.from({ length: 3 }, (_, index) => ({
  code: `SOC-${String(index + 1).padStart(2, "0")}`,
  alt: `THARROS workroom image ${index + 1}`,
  kind: "lifestyle" as const,
  ratio: "square" as const,
}));

/** Deliberately quiet: a strip at the bottom, not a section that competes. */
export default function SocialGrid() {
  const instagram = SOCIAL[0];

  return (
    <section className="rhythm-tight border-t border-rule">
      <div className="page-frame">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="eyebrow">
            <span className="num">07</span>
            <span>From the workroom</span>
          </p>
          <a
            href={instagram.href}
            target="_blank"
            rel="noreferrer noopener"
            className="link-rule link-rule-reveal"
          >
            Follow the build
          </a>
        </div>

        <ul className="mt-8 grid grid-cols-3 gap-2">
          {TILES.map((tile) => (
            <li key={tile.code}>
              <ImageSlot image={tile} sizes="33vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
