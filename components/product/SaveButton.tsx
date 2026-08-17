"use client";

import { useWishlist } from "@/components/commerce/WishlistProvider";
import { HeartIcon } from "@/components/ui/icons";

type Props = {
  productId: string;
  productName: string;
  className?: string;
};

/**
 * Square, and a real 44px box. It was a 36px circle — the one rounded shape on
 * a site whose spec rejects them outright, and below the target size the rest
 * of the chrome holds itself to.
 *
 * `aria-pressed` is the confirmation. The saved state is the button's own
 * state, so a separate live region would announce it twice.
 */
export default function SaveButton({ productId, productName, className = "" }: Props) {
  const { has, toggle, ready } = useWishlist();
  const saved = ready && has(productId);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={saved}
      className={`inline-flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60 ${className}`}
    >
      <HeartIcon filled={saved} />
      <span className="visually-hidden">
        {saved ? `Remove ${productName} from saved items` : `Save ${productName}`}
      </span>
    </button>
  );
}
