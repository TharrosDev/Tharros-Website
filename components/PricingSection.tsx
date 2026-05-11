"use client";

import AnimatedSection from "./AnimatedSection";

const pricingFactors = [
  {
    icon: "🧩",
    title: "Solution Complexity",
    description: "Whether you need a simple website concierge or a deep integration that talks to your CRM and booking software."
  },
  {
    icon: "📚",
    title: "Knowledge Depth",
    description: "The volume of training data required—from a single service list to an entire library of technical manuals."
  },
  {
    icon: "🔄",
    title: "Channel Support",
    description: "Deploying to your website, SMS, WhatsApp, or all of them at once with unified intelligence."
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto relative">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <AnimatedSection>
            <p className="section-label mb-4">Investment</p>
            <h2 className="text-3xl md:text-5xl font-bold text-text mb-6 leading-tight">
              Bespoke Pricing for <span className="accent-text">Bespoke Results</span>
            </h2>
            <p className="text-subdued text-base md:text-lg mb-8 leading-relaxed">
              We don&apos;t believe in generic monthly subscriptions that charge you for features you never use. 
              Our pricing is as custom as the agents we build—tailored strictly to the value they provide your business.
            </p>
            
            <div className="bg-surface/50 border border-border p-6 rounded-2xl mb-8">
              <p className="text-text font-semibold mb-2 flex items-center gap-2">
                <span className="text-accent-3">●</span> Why no fixed price?
              </p>
              <p className="text-subdued text-sm leading-relaxed">
                Because an AI agent for a boutique law firm is fundamentally different from one for a high-volume plumbing contractor. 
                We provide a firm, no-obligation quote immediately following our initial consultation.
              </p>
            </div>

            <a
              href="mailto:Magnus.Abdelnour@gmail.com?subject=I%27d%20like%20to%20request%20a%20quote"
              className="primary-button px-8 py-4 text-base"
            >
              Request your custom quote
            </a>
          </AnimatedSection>

          <div className="space-y-4">
            {pricingFactors.map((factor, i) => (
              <AnimatedSection key={factor.title} delay={i * 0.1} variant="scale-in">
                <div className="clean-card p-6 flex gap-5 group">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-surface border border-border flex items-center justify-center text-xl group-hover:bg-accent-3/5 group-hover:border-accent-3/20 transition-colors">
                    {factor.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text mb-1">{factor.title}</h3>
                    <p className="text-subdued text-sm leading-relaxed">{factor.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
