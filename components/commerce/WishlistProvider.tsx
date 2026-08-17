"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { getProductById } from "@/lib/catalog/queries";
import { createPersistentStore } from "@/lib/persistent-store";
import { useHydrated } from "@/lib/hooks";
import type { Product } from "@/lib/catalog/types";

const savedStore = createPersistentStore<string[]>("tharros:saved:v1", [], (raw) =>
  Array.isArray(raw) ? raw.filter((id): id is string => typeof id === "string") : null,
);

type WishlistContextValue = {
  ids: string[];
  products: Product[];
  ready: boolean;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const ids = useSyncExternalStore(
    savedStore.subscribe,
    savedStore.get,
    savedStore.getServer,
  );
  const ready = useHydrated();

  const toggle = useCallback((productId: string) => {
    savedStore.set((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [productId, ...current],
    );
  }, []);

  const remove = useCallback((productId: string) => {
    savedStore.set((current) => current.filter((id) => id !== productId));
  }, []);

  // Ids that no longer resolve to a product are dropped silently. Looked up by
  // id, not slug — a saved list is storage, and storage holds ids.
  const products = useMemo(
    () =>
      ids
        .map((id) => getProductById(id))
        .filter((product): product is Product => product !== undefined),
    [ids],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      products,
      ready,
      has: (productId: string) => ids.includes(productId),
      toggle,
      remove,
    }),
    [ids, products, ready, toggle, remove],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
