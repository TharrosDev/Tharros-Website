# AI Assistant Guidelines for Tharros-Website
**"Keep it Local, Keep it Canadian" 🇨🇦**

## 🛠 Commands

- **Build**: `npm run build`
- **Dev**: `npm run dev`
- **Lint**: `npm run lint`
- **Install**: `npm install`

## 🎨 Design System & Code Style

- ** Philosophy**: "Industrial Executive" — High-stakes precision, minimalist, and command-oriented.
- **Aesthetics**: Avoid "soft" UI. Use sharp corners, industrial motifs (**Scanlines**, **Geometric Grid Overlays**), and high-contrast glassmorphism.
- **Layout Architecture**: 
  - Prefer **Bento Grid** layouts for info-dense sections.
  - Implement **Progressive Hydration** using `components/wrappers` for heavy AI logic.
- **Components**: 
  - Use `motion/react` for weighted animations with `will-change: transform` for GPU acceleration.
  - All heavy interactive engines (Chat, Intake) must use **Dynamic Imports** with `ssr: false`.
  - Use **Tailwind CSS 4.0** utility patterns.
- **Performance**: 
  - Enforce `content-visibility: auto` on non-hero landing sections to optimize mobile TTI.
  - All background animations must be hardware-accelerated.
- **Terminology**: Always use **"Tailored"** or **"Autonomous"**.
- **SEO**: Use the multi-layered JSON-LD suite (LocalBusiness, Organization, Service) for local search dominance.

## 🤖 Agent Logic

- **Integration**: Uses `@relevanceai/sdk`.
- **State Management**: Chat logic is handled within `ChatDemoSection.tsx`.
- **Recommended Questions**: Must always be pulled dynamically from the SDK (`agent.config` or `agent.metadata`).
- **Personality**: High-stakes precision. Professional, decisive, and authoritative.

