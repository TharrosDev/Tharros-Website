import ImageSlot from "@/components/media/ImageSlot";
import { SOCIAL } from "@/lib/site";

const TILES = Array.from({ length: 6 }, (_, index) => ({
  code: `SOC-${String(index + 1).padStart(2, "0")}`,
  alt: `THARROS social post ${index + 1}`,
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
            <span>Community</span>
          </p>
          <a
            href={instagram.href}
            target="_blank"
            rel="noreferrer noopener"
            className="link-rule link-rule-reveal"
          >
            Follow Tharros
          </a>
        </div>

        <ul className="mt-8 grid grid-cols-3 gap-2 md:grid-cols-6">
          {TILES.map((tile) => (
            <li key={tile.code}>
              <ImageSlot image={tile} sizes="(min-width: 768px) 16vw, 33vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
