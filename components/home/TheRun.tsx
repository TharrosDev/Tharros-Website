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
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="01"
          label="The run"
          title="Every piece in the drop."
          action={{ href: "/shop", label: "Shop all" }}
        />
        <div className="section-lead">
          <ProductGrid
            products={products}
            heading={`${CURRENT_DROP.name} pieces`}
            columns={3}
            priorityCount={3}
            specimen
            hang
          />
        </div>
      </div>
    </section>
  );
}
