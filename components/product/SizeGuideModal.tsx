"use client";

import Modal from "@/components/ui/Modal";
import {
  formatMeasurement,
  MEASUREMENT_UNIT,
  MODEL_FIT_NOTE,
  SIZE_TABLES,
  type SizeTable,
} from "@/lib/catalog/sizing";

type Props = {
  open: boolean;
  onClose: () => void;
  tableKey: "top" | "bottom";
  /**
   * The fit line for the piece being looked at, from its own fitting. Falls
   * back to `MODEL_FIT_NOTE`, which is the product-free note for `/size-guide`
   * where there is no piece in context. Both are null today.
   */
  fitNote?: string | null;
  /** This piece's own measured table, when it has been measured. */
  piece?: SizeTable | null;
};

export default function SizeGuideModal({
  open,
  onClose,
  tableKey,
  fitNote,
  piece,
}: Props) {
  /**
   * The piece being looked at outranks its category.
   *
   * Someone opens this from a size row, mid-decision, about one garment — and
   * the modal answered with the category's table, which is the average of
   * every top THARROS has cut. When the piece has its own measurements they are
   * the answer; the category table stays reachable on `/size-guide`, where the
   * question really is about the label rather than about this hoodie.
   */
  const table = piece ?? SIZE_TABLES[tableKey];

  return (
    <Modal open={open} onClose={onClose} title="Size guide">
      <h2 className="type-display-4">{table.title}</h2>
      <p className="type-meta mt-3 text-ink-faint">
        {piece ? "This piece, measured flat" : "Garment measurements"},{" "}
        {MEASUREMENT_UNIT}
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
                <th scope="row" className="num type-mono-3 py-3 pr-4 font-medium">
                  {row.size}
                </th>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.size}-${table.columns[index]}`}
                    className="num type-mono-3 py-3 pr-4 text-ink-muted"
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
        {fitNote ??
          MODEL_FIT_NOTE ??
          "Measurements are being taken from the production samples and will be published here before the next drop."}
      </p>
    </Modal>
  );
}
