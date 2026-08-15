import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/product/ProductGrid";
import Reveal from "@/components/ui/Reveal";
import { listProducts } from "@/lib/catalog/queries";
import { CURRENT_DROP } from "@/lib/catalog/drops";

export default function CurrentDrop() {
  // The whole drop, not a curated slice — it is small enough to show.
  const products = listProducts({ drop: CURRENT_DROP.id });

  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="01"
          label={`${CURRENT_DROP.name} — out now`}
          title="A small run of original pieces."
          action={{ href: "/drop", label: "About this drop" }}
        />
        <Reveal className="mt-14">
          <ProductGrid
            products={products}
            heading={`${CURRENT_DROP.name} pieces`}
            columns={3}
            priorityCount={3}
          />
        </Reveal>
      </div>
    </section>
  );
}
