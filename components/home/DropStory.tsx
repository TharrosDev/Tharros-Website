import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ImageSlot from "@/components/media/ImageSlot";
import { CURRENT_DROP } from "@/lib/catalog/drops";
import { listProducts } from "@/lib/catalog/queries";
import { formatDate } from "@/lib/format";

export default function DropStory() {
  const pieces = listProducts({ drop: CURRENT_DROP.id });

  return (
    <section className="rhythm-default">
      <div className="page-frame grid gap-x-6 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow border-t border-ink pt-4">
            <span className="num">05</span>
            <span>The Drop</span>
          </p>
          <h2 className="type-display-2 mt-8">{CURRENT_DROP.name}</h2>
          <p className="type-meta mt-4 text-ink-faint">
            {CURRENT_DROP.releasedAt ? formatDate(CURRENT_DROP.releasedAt) : "In development"}
            <span className="mx-3" aria-hidden="true">
              /
            </span>
            <span className="num">{pieces.length}</span> pieces
          </p>

          <div className="mt-8 space-y-5">
            {CURRENT_DROP.body.map((paragraph) => (
              <p key={paragraph} className="type-body text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <Link href={`/shop?drop=${CURRENT_DROP.slug}`} className="btn btn-outline mt-10">
            View the drop
          </Link>
        </div>

        <Reveal className="lg:col-span-6 lg:col-start-7">
          <ImageSlot
            image={CURRENT_DROP.cover}
            ratio="editorial"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
