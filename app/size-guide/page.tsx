import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import InfoFooter from "@/components/layout/InfoFooter";
import PendingNotice from "@/components/ui/PendingNotice";
import { informationIndex } from "@/lib/site";
import {
  formatMeasurement,
  MEASUREMENT_UNIT,
  MODEL_FIT_NOTE,
  SIZE_TABLES,
} from "@/lib/catalog/sizing";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "THARROS garment measurements and fit notes for tops and bottoms.",
  alternates: { canonical: "/size-guide" },
};

/** How to take the measurement the column names, so the table is readable
 *  before it is populated. Authored from the column list, not invented data. */
const HOW_TO: Record<string, string> = {
  Chest: "Across the garment one inch below the armhole, doubled.",
  "Body length": "From the highest point of the shoulder straight down to the hem.",
  Sleeve: "From the shoulder seam to the end of the cuff.",
  Shoulder: "Seam to seam across the back.",
  Waist: "Across the top of the waistband, doubled.",
  Inseam: "From the crotch seam to the leg opening.",
  "Leg opening": "Across the hem of the leg, doubled.",
  Rise: "From the crotch seam to the top of the waistband at the front.",
};

export default function SizeGuidePage() {
  const tables = Object.values(SIZE_TABLES);
  // Pending is derived, not declared. When the spec sheet lands and the values
  // stop being null, this page stops calling itself pending — with no edit.
  const pending = tables.every((table) =>
    table.rows.every((row) => row.values.every((value) => value === null)),
  );

  return (
    <>
      <PageIntro
        index={informationIndex("/size-guide")}
        label="Information"
        title="Size guide"
        lead={`All measurements are taken flat on the garment, in ${MEASUREMENT_UNIT}.`}
        crumbs={[{ name: "Home", href: "/" }]}
      />

      <div className="page-frame rhythm-tight space-y-16">
        {/* The pending state, stated before the empty tables rather than in a
            paragraph underneath both of them, and drawn the way this site draws
            every other pending thing: a framed, stamped block that reads as
            waiting rather than as broken. Two tables of forty-eight em dashes
            with the explanation at the bottom is where this page was. */}
        {pending ? (
          <PendingNotice
            label="Measurements pending"
            title="The numbers come off the production samples, not off a chart."
          >
            <p className="type-body text-ink-muted">
              Each piece is measured from the sample that was actually made, and
              those measurements are published here before the next drop. Nothing
              is going in this table until then.
            </p>
            <p className="type-body text-ink-muted">
              In the meantime, every product page carries the fit notes for that
              piece — how it is cut and how it is meant to sit.{" "}
              <Link href="/shop" className="link-rule">
                Browse the drop
              </Link>
              .
            </p>
          </PendingNotice>
        ) : null}

        {tables.map((table) => (
          <section key={table.key}>
            <h2 className="type-display-4 border-b border-ink pb-4">{table.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <caption className="visually-hidden">
                  {table.title} — garment measurements in {MEASUREMENT_UNIT}
                  {pending ? ", not yet published" : ""}
                </caption>
                <thead>
                  <tr className="border-b border-rule-strong">
                    <th scope="col" className="type-meta py-4 pr-4">
                      Size
                    </th>
                    {table.columns.map((column) => (
                      <th key={column} scope="col" className="type-meta py-4 pr-4">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr key={row.size} className="border-b border-rule">
                      <th scope="row" className="num type-mono-3 py-4 pr-4 font-medium">
                        {row.size}
                      </th>
                      {row.values.map((value, index) => (
                        <td
                          key={`${row.size}-${table.columns[index]}`}
                          className="num type-mono-3 py-4 pr-4 text-ink-faint"
                        >
                          {formatMeasurement(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* What each column means. A measurement table nobody can reproduce
                is only half a size guide, and this half does not depend on the
                spec sheet arriving. */}
            <dl className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {table.columns.map((column) => (
                <div key={column} className="flex gap-4 border-t border-rule pt-3">
                  <dt className="type-meta w-28 shrink-0 text-ink-faint">{column}</dt>
                  <dd className="type-body-sm text-ink-muted">
                    {HOW_TO[column] ?? "Measured flat across the garment."}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        {MODEL_FIT_NOTE ? (
          <p className="type-body text-ink-muted">{MODEL_FIT_NOTE}</p>
        ) : null}
      </div>

      <InfoFooter current="/size-guide" />
    </>
  );
}
