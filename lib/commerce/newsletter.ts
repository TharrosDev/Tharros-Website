import { CONTACT_EMAIL } from "@/lib/site";

/**
 * THE NEWSLETTER BOUNDARY. One function, four outcomes.
 *
 * The form in `components/layout/Newsletter.tsx` is the finished UI and
 * already renders every one of these states. Connecting a provider means
 * replacing the body of `subscribe` with a POST to it; the form does not
 * change.
 *
 * `handoff` is what happens while no list exists: the address is not stored
 * and no success is claimed, so the signup opens a message to the label
 * instead. It is a state of this function rather than a flag components read.
 */
export type SubscribeResult =
  | { status: "ok" }
  | { status: "duplicate" }
  | { status: "error" }
  | { status: "handoff"; url: string };

export async function subscribe(email: string): Promise<SubscribeResult> {
  return {
    status: "handoff",
    url: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Drop list")}&body=${encodeURIComponent(email)}`,
  };
}
