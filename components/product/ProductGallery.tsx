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
  // The swipe rail had no position indicator at all — no dots, no counter, just
  // a static "Swipe — 4 images". Derived from scroll position in the handler
  // rather than from an effect, so no render cascade.
  const [swiped, setSwiped] = useState(0);

  const total = String(images.length).padStart(2, "0");

  const current = images[active] ?? images[0];

  return (
    <>
      {/* Mobile: swipe. One image per screen, snapped. */}
      <div className="md:hidden">
        <ul
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(event) => {
            const rail = event.currentTarget;
            setSwiped(Math.round(rail.scrollLeft / rail.clientWidth));
          }}
        >
          {/* One band, whatever shape the frame is. A gallery now holds a
              2:3 figure, a 1:1 flat lay and a 3:4 detail, and letting each
              slide take its own height made a horizontal snap rail change
              height under the thumb mid-swipe. The band is the constant; the
              photograph covers it. */}
          {images.map((image) => (
            <li key={image.code} className="w-full shrink-0 snap-center">
              <div className="relative h-[72svh] w-full overflow-hidden">
                <ImageSlot image={image} fill sizes="100vw" priority={image === images[0]} />
              </div>
            </li>
          ))}
        </ul>
        {/* No live region. The counter is driven by `onScroll`, so announcing it
            meant one swipe produced a burst of announcements — a screen reader
            reading "01 of 06, 02 of 06, 03 of 06" through a single gesture is
            noise, not status. Each slide carries its own alt text, which is the
            content; this is the visual affordance for it. */}
        <p className="type-meta mt-3 flex items-center gap-3 text-ink-faint">
          <span>
            <span className="num text-ink">
              {String(Math.min(swiped + 1, images.length)).padStart(2, "0")}
            </span>
            <span className="num" aria-hidden="true">
              {" / "}
              {total}
            </span>
            <span className="visually-hidden"> of {total} images</span>
          </span>
          <span className="h-px flex-1 bg-rule" aria-hidden="true" />
          <span>Swipe</span>
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
                // The active frame is marked with a rule, not with opacity. On
                // a site whose entire language is hairlines, signalling state
                // by fading everything else was the one place that forgot it.
                className={`block w-full border p-0.5 transition-colors ${
                  index === active
                    ? "border-ink"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <ImageSlot image={image} ratio="square" sizes="80px" />
                <span className="visually-hidden">
                  Show image {index + 1} of {productName}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* The main frame is a fixed band for the same reason. Switching from
            the figure to the flat lay used to resize the frame, which moved the
            thumbnail rail beside it and the record column next to that — the
            whole page nudged every time someone looked at another picture. */}
        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="hover-zoom relative min-w-0 flex-1 cursor-zoom-in overflow-hidden"
        >
          <div className="relative h-[78svh] w-full">
            <ImageSlot
              image={current}
              fill
              sizes="(min-width: 1024px) 45vw, 60vw"
              priority
            />
          </div>
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
