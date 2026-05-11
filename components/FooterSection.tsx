import AnimatedSection from "./AnimatedSection";

export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedSection>
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-6">
            Ready to stop missing leads?
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-text mb-6 leading-tight">
            Let&apos;s build something{" "}
            <span className="text-accent">that works for you</span>
          </h2>
          <p className="text-subdued text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Book a free 30-minute call. We&apos;ll listen to your business, identify
            the best use case, and give you a clear sense of what&apos;s possible —
            no obligation.
          </p>
          <a
            href="mailto:magnus.abdelnour@gmail.com?subject=I%27d%20like%20to%20talk%20about%20an%20AI%20agent"
            className="inline-block px-10 py-5 rounded-full bg-accent text-bg font-bold text-lg hover:brightness-110 active:scale-95 transition-all duration-200 shadow-[0_0_48px_rgba(0,194,255,0.25)] mb-4"
          >
            Book a free consult
          </a>
          <p className="text-subdued text-sm mb-16">
            Or email directly:{" "}
            <a
              href="mailto:magnus.abdelnour@gmail.com"
              className="text-accent hover:underline"
            >
              magnus.abdelnour@gmail.com
            </a>
          </p>

          <div className="border-t border-border pt-8 text-subdued text-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <span>&copy; {year} Tharros. Ottawa, Ontario, Canada.</span>
            <span>AI agents for small businesses that need to move fast.</span>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
