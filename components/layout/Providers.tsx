"use client";

import { CartProvider } from "@/components/commerce/CartProvider";
import { WishlistProvider } from "@/components/commerce/WishlistProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
}
