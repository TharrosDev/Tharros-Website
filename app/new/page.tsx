import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import ProductGrid from "@/components/product/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import { getNewArrivals, listProducts, resolveAvailability } from "@/lib/catalog/queries";
import { CURRENT_COLLECTION } from "@/lib/catalog/collections";

export const metadata: Metadata = {
  title: "The New Drop",
  description:
    "The latest THARROS release. New pieces from Collection 01, available now.",
  alternates: { canonical: "/new" },
};

export default function NewDropPage() {
  const released = getNewArrivals().filter(
    (product) => resolveAvailability(product) !== "coming-soon",
  );
  const upcoming = listProducts({ sort: "newest" }).filter(
    (product) => resolveAvailability(product) === "coming-soon",
  );

  return (
    <>
      <PageIntro
        index="01"
        label={`${CURRENT_COLLECTION.name} — ${CURRENT_COLLECTION.season}`}
        title="The new drop"
        lead="Available now. Pieces are made in limited runs and are not restocked on a schedule."
      />

      <div className="page-frame rhythm-tight">
        {released.length > 0 ? (
          <ProductGrid
            products={released}
            heading="New arrivals"
            columns={3}
            priorityCount={3}
          />
        ) : (
          <div className="border-t border-rule py-16">
            <p className="type-display-3 uppercase">Between drops.</p>
            <p className="type-body mt-4 text-ink-muted">
              Nothing new is out right now.
            </p>
            <Link href="/shop" className="btn btn-solid mt-8">
              Shop the collection
            </Link>
          </div>
        )}
      </div>

      {upcoming.length > 0 ? (
        <section className="rhythm-default">
          <div className="page-frame">
            <SectionHeading
              index="02"
              label="Coming soon"
              title="Next out."
            />
            <div className="mt-12">
              <ProductGrid products={upcoming} columns={4} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
