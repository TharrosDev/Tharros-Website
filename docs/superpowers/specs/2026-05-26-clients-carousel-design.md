# Clients Page Carousel — Design Spec
Date: 2026-05-26

## Problem
The clients page uses a CSS grid to display 3 client cards + 1 placeholder. With a small and growing card count, a carousel better suits the layout and matches the kinetic energy of the homepage WorkReel.

## Approach
Replace `ClientsGallery`'s grid with an **Embla Carousel** (JS-driven, single row, auto-play + manual controls). Card content and styling (`ClientCard`, `PlaceholderCard`) remain unchanged.

## Libraries
- `embla-carousel-react` — viewport/track management, loop, drag
- `embla-carousel-autoplay` — auto-scroll plugin (delay 4000ms, pause on hover, resume after)

## Behavior
- Loop: infinite (`loop: true`)
- Auto-play: 4s delay, pauses on `stopOnMouseEnter`, resumes after interaction
- Reduced motion: `useReducedMotion()` → autoplay plugin disabled, loop still enabled
- Drag: native Embla touch/mouse drag
- Controls: prev/next arrow buttons below the carousel track, styled in site mono tokens

## Card sizing
- Mobile: `calc(100% - 1.5rem)` — one card visible, next card peeks
- sm (640px+): `44%` — two cards visible
- lg (1024px+): `30%` — three cards visible

## Components changed
- `components/ClientsSection.tsx` — `ClientsGallery` function replaced; `CarouselControls` added

## Out of scope
- Dot indicators
- Slide count display
- Featured card grid-span (removed implicitly; description paragraph kept on card index 0)
