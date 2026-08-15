"use client";

import Modal from "@/components/ui/Modal";
import {
  formatMeasurement,
  MEASUREMENT_UNIT,
  MODEL_FIT_NOTE,
  SIZE_TABLES,
} from "@/lib/catalog/sizing";

type Props = {
  open: boolean;
  onClose: () => void;
  tableKey: "top" | "bottom";
};

export default function SizeGuideModal({ open, onClose, tableKey }: Props) {
  const table = SIZE_TABLES[tableKey];

  return (
    <Modal open={open} onClose={onClose} title="Size guide">
      <h2 className="type-display-4">{table.title}</h2>
      <p className="type-meta mt-3 text-ink-faint">
        Garment measurements, {MEASUREMENT_UNIT}
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink">
              <th scope="col" className="type-meta py-3 pr-4">
                Size
              </th>
              {table.columns.map((column) => (
                <th key={column} scope="col" className="type-meta py-3 pr-4">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.size} className="border-b border-rule">
                <th scope="row" className="num py-3 pr-4 text-[0.8125rem] font-medium">
                  {row.size}
                </th>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.size}-${table.columns[index]}`}
                    className="num py-3 pr-4 text-[0.8125rem] text-ink-muted"
                  >
                    {formatMeasurement(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="type-body-sm mt-6 text-ink-muted">
        {MODEL_FIT_NOTE ??
          "Measurements are being taken from the production samples and will be published here before the next drop."}
      </p>
    </Modal>
  );
}
