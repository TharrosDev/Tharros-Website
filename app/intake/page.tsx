import IntakeAgent from "@/components/IntakeAgent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intake Agent | Tharros",
  description: "Converse with our intake agent to explain your business needs and start your automation journey.",
};

export default function IntakePage() {
  return <IntakeAgent />;
}
