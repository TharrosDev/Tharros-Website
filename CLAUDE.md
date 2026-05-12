# AI Assistant Guidelines for Tharros-Website

## 🛠 Commands

- **Build**: `npm run build`
- **Dev**: `npm run dev`
- **Lint**: `npm run lint`
- **Install**: `npm install`

## 🎨 Design System & Code Style

- **Philosophy**: "Confident Executive" — Minimalist, sharp, high-contrast, and industrial. 
- **Aesthetics**: Avoid "bubbly" or "soft" UI. Use sharp corners (`rounded-xl` or smaller), clean borders, and high-quality glassmorphism.
- **Layout Architecture**: 
  - Prefer **Bento Grid** layouts for info-dense sections.
  - Use asymmetric spans (e.g., `md:col-span-8` vs `md:col-span-4`) to create visual hierarchy.
- **Components**: 
  - Use `motion/react` for purposeful, weighted animations (prefer `ease: "circOut"` or `ease: "easeInOut"`).
  - All interactive components (Buttons, Logos) should use the `Magnetic` wrapper for premium feel.
  - Always mark components using Framer Motion with `"use client";`.
- **Formatting**: Standard TypeScript/React patterns. Use Tailwind for all styling.
- **Terminology**: Always use **"Tailored"** instead of "Bespoke".
- **SEO**: All pages must maintain metadata, sitemap, and robots configurations pointing to `tharros.ca`.

## 🤖 Agent Logic

- **Integration**: Uses `@relevanceai/sdk`.
- **State Management**: Chat logic is handled within `ChatDemoSection.tsx`.
- **Recommended Questions**: Must always be pulled dynamically from the SDK (`agent.config` or `agent.metadata`).
- **Personality**: High-stakes precision. Professional, decisive, and authoritative.

