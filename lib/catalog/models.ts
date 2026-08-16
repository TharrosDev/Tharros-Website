/**
 * PEOPLE, NOT MEASUREMENTS.
 *
 * This file ships empty, and that is the point. Every value in it comes from a
 * real fitting with a real person who agreed to be credited — a height is
 * measured or it is absent, a size worn is the size that person actually wore.
 * Nothing here may be estimated, averaged, or filled in to make a component
 * look finished, and no component may synthesise a value that is null. See
 * CLAUDE.md: the storefront does not fabricate model measurements.
 *
 * The components that read this (`OnBody`, `ModelCredit`) render nothing at all
 * when it is empty, which is the honest state until a shoot has happened.
 */

export type ModelProfile = {
  id: string;
  /** Name or working alias, as the person agreed to be credited. */
  name: string;
  /** Centimetres, measured. `null` until it has been. */
  heightCm: number | null;
  /** One line in the person's own register. Only if they said it. */
  note?: string;
};

export const MODELS: ModelProfile[] = [];

export function getModel(id: string): ModelProfile | undefined {
  return MODELS.find((model) => model.id === id);
}
