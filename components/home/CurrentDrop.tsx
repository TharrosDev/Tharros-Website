import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/product/ProductGrid";
import Reveal from "@/components/ui/Reveal";
import { getNewArrivals, getFeatured } from "@/lib/catalog/queries";

export default function CurrentDrop() {
  // Falls back to featured pieces if nothing is flagged new, so the slot is
  // never empty between drops.
  const newArrivals = getNewArrivals(3);
  const products = newArrivals.length >= 3 ? newArrivals : getFeatured(3);

  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="01"
          label="The New Drop"
          title="Available now."
          action={{ href: "/new", label: "View all" }}
        />
        <Reveal className="mt-14">
          <ProductGrid products={products} columns={3} priorityCount={3} />
        </Reveal>
      </div>
    </section>
  );
}
