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
  resolveLines,
  subtotalOf,
  MAX_LINE_QUANTITY,
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
  isOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  add: (productId: string, size: Size, quantity?: number) => void;
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

  const add = useCallback((productId: string, size: Size, quantity = 1) => {
    bagStore.set((current) => {
      const existing = current.find(
        (line) => line.productId === productId && line.size === size,
      );
      if (!existing) return [...current, { productId, size, quantity }];
      return current.map((line) =>
        line === existing
          ? { ...line, quantity: Math.min(line.quantity + quantity, MAX_LINE_QUANTITY) }
          : line,
      );
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((productId: string, size: Size, quantity: number) => {
    bagStore.set((current) => {
      if (quantity <= 0) {
        return current.filter(
          (line) => !(line.productId === productId && line.size === size),
        );
      }
      return current.map((line) =>
        line.productId === productId && line.size === size ? { ...line, quantity } : line,
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
      isOpen,
      openBag: () => setIsOpen(true),
      closeBag: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [lines, count, subtotal, ready, isOpen, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
