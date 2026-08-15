import type { Metadata } from "next";
import PageIntro from "@/components/layout/PageIntro";
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

export default function SizeGuidePage() {
  return (
    <>
      <PageIntro
        index="01"
        label="Information"
        title="Size guide"
        lead={`All measurements are taken flat on the garment, in ${MEASUREMENT_UNIT}.`}
      />

      <div className="page-frame rhythm-tight space-y-16">
        {Object.values(SIZE_TABLES).map((table) => (
          <section key={table.key}>
            <h2 className="type-display-4 border-b border-ink pb-4">{table.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
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
                      <th scope="row" className="num py-4 pr-4 text-[0.8125rem] font-medium">
                        {row.size}
                      </th>
                      {row.values.map((value, index) => (
                        <td
                          key={`${row.size}-${table.columns[index]}`}
                          className="num py-4 pr-4 text-[0.8125rem] text-ink-muted"
                        >
                          {formatMeasurement(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <p className="type-body max-w-prose text-ink-muted">
          {MODEL_FIT_NOTE ??
            "Measurements are being taken from the production samples and will be published here before the next drop. Until then, size notes on each product page are the best guide."}
        </p>
      </div>
    </>
  );
}
