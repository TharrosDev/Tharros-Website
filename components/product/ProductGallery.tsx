"use client";

import { useEffect, useRef, useState } from "react";
import ImageSlot from "@/components/media/ImageSlot";
import Modal from "@/components/ui/Modal";
import { loadMotion } from "@/lib/motion/registry";
import { prefersReducedMotion } from "@/lib/motion/media";
import { DUR, EASE } from "@/lib/motion/config";
import type { ImageSlotData } from "@/lib/catalog/types";

type Props = {
  images: ImageSlotData[];
  productName: string;
};

export default function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  // Latched on first open, so the zoom frame stays out of the document until
  // someone asks for it — and stays in it afterwards, so closing and reopening
  // does not refetch. `Modal` is always mounted for its transition, which meant
  // a 90vw image was being downloaded on every product page for a dialog most
  // visitors never open. Set in the handler rather than an effect, the same way
  // the header latches its search overlay.
  const [zoomUsed, setZoomUsed] = useState(false);
  // The swipe rail had no position indicator at all — no dots, no counter, just
  // a static "Swipe — 4 images". Derived from scroll position in the handler
  // rather than from an effect, so no render cascade.
  const [swiped, setSwiped] = useState(0);

  const total = String(images.length).padStart(2, "0");

  const current = images[active] ?? images[0];

  const mainRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const firstFrame = useRef(true);

  // The main frame is uncovered when the selection changes, rather than being
  // swapped under the visitor. The frame itself never moves — it is a fixed
  // band — so this is a picture being changed inside a window, which is the
  // same idea as the frame wipe everywhere else on the site.
  //
  // Keyed on `active` and driven straight to the node: no state is set here,
  // so changing pictures costs one render for the selection and nothing else.
  //
  // NOT ON FIRST MOUNT. This is a `fromTo` out of a fully clipped state, and
  // GSAP arrives a frame or two after paint — so on load the main frame painted,
  // was clipped away to nothing, and wiped back in. That is the flash the
  // `[data-js]` rule exists to prevent, on the largest paint of every product
  // page. The wipe belongs to *changing* the picture; the first one is simply
  // the picture.
  useEffect(() => {
    if (firstFrame.current) {
      firstFrame.current = false;
      return;
    }

    const node = mainRef.current;
    if (!node || prefersReducedMotion()) return;

    let cancelled = false;
    loadMotion().then(({ gsap }) => {
      if (cancelled || !mainRef.current) return;
      gsap.fromTo(
        node,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: DUR.slow, ease: EASE.expo },
      );
    });

    return () => {
      cancelled = true;
    };
  }, [active]);

  // Left and right move through the rail. A thumbnail list that can only be
  // operated by tabbing to each button in turn is a list, not a control — and
  // roving focus is what a picture chooser is expected to do.
  const onRailKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = (active + step + images.length) % images.length;
    setActive(next);
    railRef.current
      ?.querySelectorAll<HTMLButtonElement>("button")
      [next]?.focus();
  };

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
                {/* `1px` from `md` up is not a lie, it is the truth about a
                    display:none element. This rail is `md:hidden`, but hidden
                    is not unloaded — the browser still picks a candidate from
                    the srcset and fetches it. At 1440 that was six frames at
                    the 1920w candidate, 137 kB of pictures a desktop visitor
                    cannot see. The media condition makes the browser pick the
                    smallest candidate instead. */}
                <ImageSlot
                  image={image}
                  fill
                  sizes="(min-width: 768px) 1px, 100vw"
                  priority={image === images[0]}
                />
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
        <ul
          ref={railRef}
          onKeyDown={onRailKeyDown}
          className="flex w-20 shrink-0 flex-col gap-3"
        >
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
                <ImageSlot
                  image={image}
                  ratio="square"
                  sizes="(max-width: 767px) 1px, 80px"
                />
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
          onClick={() => {
            setZoomUsed(true);
            setZoomed(true);
          }}
          className="hover-zoom relative min-w-0 flex-1 cursor-zoom-in overflow-hidden"
        >
          <div ref={mainRef} className="relative h-[78svh] w-full">
            <ImageSlot
              image={current}
              fill
              sizes="(max-width: 767px) 1px, (min-width: 1024px) min(45vw, 700px), 60vw"
              priority
            />
          </div>
          <span className="visually-hidden">Zoom image of {productName}</span>
        </button>
      </div>

      <Modal open={zoomed} onClose={() => setZoomed(false)} title={productName}>
        {zoomUsed ? (
          <>
            <ImageSlot image={current} sizes="90vw" />
            <p className="type-meta mt-4 text-ink-faint">{current.alt}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
}
