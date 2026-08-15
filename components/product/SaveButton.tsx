"use client";

import { useWishlist } from "@/components/commerce/WishlistProvider";
import { HeartIcon } from "@/components/ui/icons";

type Props = {
  productId: string;
  productName: string;
  className?: string;
};

export default function SaveButton({ productId, productName, className = "" }: Props) {
  const { has, toggle, ready } = useWishlist();
  const saved = ready && has(productId);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={saved}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-60 ${className}`}
    >
      <HeartIcon filled={saved} />
      <span className="visually-hidden">
        {saved ? `Remove ${productName} from saved items` : `Save ${productName}`}
      </span>
    </button>
  );
}
