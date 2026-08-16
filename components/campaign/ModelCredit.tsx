import { getModel } from "@/lib/catalog/models";

/**
 * Who is in the frame.
 *
 * Renders nothing when the register is empty, which is every frame today. Ids
 * that do not resolve are dropped rather than printed raw — a frame crediting
 * "model-02" to nobody is worse than a frame crediting no one.
 */
export default function ModelCredit({
  modelIds,
  onDark = false,
}: {
  modelIds?: string[];
  onDark?: boolean;
}) {
  const models = (modelIds ?? [])
    .map((id) => getModel(id))
    .filter((model) => model !== undefined);

  if (models.length === 0) return null;

  return (
    <p className={`type-meta ${onDark ? "text-ink-on-dark-faint" : "text-ink-faint"}`}>
      {models.length > 1 ? "Models" : "Model"}{" "}
      <span className={onDark ? "text-ink-on-dark" : "text-ink"}>
        {models.map((model) => model.name).join(", ")}
      </span>
    </p>
  );
}
