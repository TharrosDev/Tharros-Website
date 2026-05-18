import { permanentRedirect } from "next/navigation";

// /intake is the legacy onboarding URL. The discovery briefing now lives at
// /brief — wired up to the new wizard. NavBar links and Organization JSON-LD
// that still point at /intake will land here and 308 forward.
export default function IntakePage(): never {
  permanentRedirect("/brief");
}
