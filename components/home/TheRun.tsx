import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/product/ProductGrid";
import { listProducts } from "@/lib/catalog/queries";
import { CURRENT_DROP } from "@/lib/catalog/drops";

/**
 * The whole drop, not a curated slice — it is small enough to show, and
 * showing all of it is the honest move.
 *
 * `specimen` puts each piece's code and run figures under the frame, so the
 * grid reads as a record of what was made rather than as a row of products.
 */
export default function TheRun() {
  const products = listProducts({ drop: CURRENT_DROP.id });

  return (
    /* `relative` so the opening screen's detail frame, which hangs down over
       the top of this section, has a positioned neighbour to sit against
       rather than resolving its stacking against the page root. */
    <section className="relative rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="01"
          label="The run"
          title="Every piece in the drop."
          action={{ href: "/shop", label: "Shop all" }}
        />
        <div className="section-lead">
          {/* No `priorityCount`. The opening panel is `min-h-[100svh]`, so the
              first row of this grid is below the fold at every width — and
              `priority` emits a `<link rel=preload>`, which put three
              below-the-fold frames in the same starting gun as the hero. Four
              images racing means the LCP one gets a quarter of the bandwidth
              instead of all of it. */}
          <ProductGrid
            products={products}
            heading={`${CURRENT_DROP.name} pieces`}
            columns={3}
            specimen
            hang
          />
        </div>
      </div>
    </section>
  );
}
