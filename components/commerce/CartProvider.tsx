"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  countOf,
  purchasableCeiling,
  resolveLines,
  subtotalOf,
  type CartLine,
  type ResolvedLine,
} from "@/lib/commerce/cart";
import { createPersistentStore } from "@/lib/persistent-store";
import { useHydrated } from "@/lib/hooks";
import type { Size } from "@/lib/catalog/types";

const bagStore = createPersistentStore<CartLine[]>("tharros:bag:v1", [], (raw) => {
  if (!Array.isArray(raw)) return null;
  return raw.filter(
    (line): line is CartLine =>
      typeof line === "object" &&
      line !== null &&
      typeof (line as CartLine).productId === "string" &&
      typeof (line as CartLine).size === "string" &&
      typeof (line as CartLine).quantity === "number",
  );
});

type CartContextValue = {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  /** False until hydration, so nothing renders a count it cannot know yet. */
  ready: boolean;
  /**
   * True when the stored bag no longer matches what can actually be bought —
   * `resolveLines` drops a line whose variant went to zero and clamps a
   * quantity above remaining inventory. Both used to happen in silence, so a
   * returning visitor could lose a piece from their bag with no notice, on a
   * site whose whole position is that it tells you the truth about stock.
   */
  adjusted: boolean;
  isOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  /** `open: false` adds without seizing the screen — see the grid quick-add. */
  add: (
    productId: string,
    size: Size,
    quantity?: number,
    options?: { open?: boolean },
  ) => void;
  setQuantity: (productId: string, size: Size, quantity: number) => void;
  remove: (productId: string, size: Size) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const rawLines = useSyncExternalStore(
    bagStore.subscribe,
    bagStore.get,
    bagStore.getServer,
  );
  const ready = useHydrated();

  const [isOpen, setIsOpen] = useState(false);

  // Stock and prices are re-read from the catalog on every render, so a bag
  // restored from storage can never hold something unsellable.
  const lines = useMemo(() => resolveLines(rawLines), [rawLines]);
  const count = useMemo(() => countOf(lines), [lines]);
  const subtotal = useMemo(() => subtotalOf(lines), [lines]);

  const adjusted = useMemo(() => {
    const requested = rawLines.reduce((sum, line) => sum + line.quantity, 0);
    const resolved = lines.reduce((sum, line) => sum + line.quantity, 0);
    return rawLines.length !== lines.length || requested !== resolved;
  }, [rawLines, lines]);

  const add = useCallback((
    productId: string,
    size: Size,
    quantity = 1,
    options?: { open?: boolean },
  ) => {
    bagStore.set((current) => {
      // Clamp to what is actually on the shelf, not just to the per-line cap.
      // `resolveLines` already clamps what is *displayed*, so an over-count was
      // invisible — but it was still written to storage, and it would have come
      // back the moment stock was replenished.
      const ceiling = purchasableCeiling(productId, size);
      if (ceiling <= 0) return current;

      const existing = current.find(
        (line) => line.productId === productId && line.size === size,
      );
      if (!existing) {
        return [...current, { productId, size, quantity: Math.min(quantity, ceiling) }];
      }
      return current.map((line) =>
        line === existing
          ? { ...line, quantity: Math.min(line.quantity + quantity, ceiling) }
          : line,
      );
    });
    if (options?.open !== false) setIsOpen(true);
  }, []);

  const setQuantity = useCallback((productId: string, size: Size, quantity: number) => {
    bagStore.set((current) => {
      // Stepping to zero removes the line, and so does a size that can no
      // longer be bought at all. Everything else is held to the same ceiling
      // `add` uses: the stepper's `max` is display state, and this is storage.
      const next = Math.min(quantity, purchasableCeiling(productId, size));
      if (next <= 0) {
        return current.filter(
          (line) => !(line.productId === productId && line.size === size),
        );
      }
      return current.map((line) =>
        line.productId === productId && line.size === size
          ? { ...line, quantity: next }
          : line,
      );
    });
  }, []);

  const remove = useCallback((productId: string, size: Size) => {
    bagStore.set((current) =>
      current.filter((line) => !(line.productId === productId && line.size === size)),
    );
  }, []);

  const clear = useCallback(() => bagStore.set([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      subtotal,
      ready,
      adjusted,
      isOpen,
      openBag: () => setIsOpen(true),
      closeBag: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [lines, count, subtotal, ready, adjusted, isOpen, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
