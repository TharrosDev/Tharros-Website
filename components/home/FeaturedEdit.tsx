import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";
import { getFeatured } from "@/lib/catalog/queries";

/**
 * Asymmetric on purpose: one piece runs tall on the left, two stack beside it.
 * The grid page handles even rhythm — this slot exists to break it.
 */
export default function FeaturedEdit() {
  const [lead, ...rest] = getFeatured(3);
  if (!lead) return null;

  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="03"
          label="Featured"
          action={{ href: "/shop", label: "Shop all" }}
        />

        <div className="mt-14 grid gap-x-6 gap-y-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <ProductCard
              product={lead}
              sizes="(min-width: 1024px) 40vw, 100vw"
              emphasis
            />
          </Reveal>

          {/* The stack drops below the lead's top edge — the offset is the
              point of the section. */}
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:gap-6 lg:pt-32">
            {rest.map((product, index) => (
              <Reveal key={product.id} delay={120 * (index + 1)}>
                <ProductCard product={product} sizes="(min-width: 1024px) 24vw, 50vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
