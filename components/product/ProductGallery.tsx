"use client";

import { useState } from "react";
import ImageSlot from "@/components/media/ImageSlot";
import Modal from "@/components/ui/Modal";
import type { ImageSlotData } from "@/lib/catalog/types";

type Props = {
  images: ImageSlotData[];
  productName: string;
};

export default function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const current = images[active] ?? images[0];

  return (
    <>
      {/* Mobile: swipe. One image per screen, snapped. */}
      <div className="md:hidden">
        <ul className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
          {images.map((image) => (
            <li key={image.code} className="w-full shrink-0 snap-center">
              <ImageSlot image={image} sizes="100vw" priority={image === images[0]} />
            </li>
          ))}
        </ul>
        <p className="type-meta mt-3 text-ink-faint">
          Swipe — <span className="num">{images.length}</span> images
        </p>
      </div>

      {/* Desktop: thumbnail rail plus a click-to-zoom main frame. */}
      <div className="hidden gap-4 md:flex">
        <ul className="flex w-20 shrink-0 flex-col gap-3">
          {images.map((image, index) => (
            <li key={image.code}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={index === active ? "true" : undefined}
                className={`block w-full transition-opacity ${
                  index === active ? "opacity-100" : "opacity-45 hover:opacity-80"
                }`}
              >
                <ImageSlot image={image} sizes="80px" />
                <span className="visually-hidden">
                  Show image {index + 1} of {productName}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="hover-zoom min-w-0 flex-1 cursor-zoom-in overflow-hidden"
        >
          <ImageSlot image={current} sizes="(min-width: 1024px) 45vw, 60vw" priority />
          <span className="visually-hidden">Zoom image of {productName}</span>
        </button>
      </div>

      <Modal open={zoomed} onClose={() => setZoomed(false)} title={productName}>
        <ImageSlot image={current} sizes="90vw" />
        <p className="type-meta mt-4 text-ink-faint">{current.alt}</p>
      </Modal>
    </>
  );
}
