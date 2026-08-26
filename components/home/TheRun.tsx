import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/product/ProductGrid";
import { listProducts } from "@/lib/catalog/queries";
import { CURRENT_DROP } from "@/lib/catalog/drops";

/**
 * The clothes, immediately, and at a size worth looking at. Four up: this is
 * the first thing under the hero and the page's whole argument, so each frame
 * gets a quarter of the width. Seven pieces read 4 + 3.
 */
export default function TheRun() {
  const products = listProducts({ drop: CURRENT_DROP.id });

  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="01"
          label={CURRENT_DROP.name}
          title={`${products.length} pieces.`}
          action={{ href: `/shop?drop=${CURRENT_DROP.slug}`, label: "See all" }}
        />
        <div className="section-lead">
          {/* No `priorityCount`. The opening panel is 88–92svh, so the first
              row of this grid is below the fold at every width — and `priority`
              emits a `<link rel=preload>`, which would put four below-the-fold
              frames in the same starting gun as the hero. */}
          <ProductGrid
            products={products}
            heading={`${CURRENT_DROP.name} pieces`}
            columns={4}
          />
        </div>
      </div>
    </section>
  );
}
