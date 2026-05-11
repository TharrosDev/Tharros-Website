import AnimatedSection from "./AnimatedSection";

export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="py-24 md:py-28 px-6 md:px-12 relative overflow-hidden bg-bg">
      <div className="max-w-4xl mx-auto text-center relative">
        <AnimatedSection variant="scale-in">
          <p className="section-label mb-6">
            Ready to stop missing leads?
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-text mb-6 leading-tight">
            Let&apos;s build something{" "}
            <span className="accent-text">that works for you</span>
          </h2>
          <p className="text-subdued text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Book a free 30-minute call. We&apos;ll listen to your business, identify
            the best use case, and give you a clear sense of what&apos;s possible —
            no obligation.
          </p>
          <a
            href="mailto:magnus.abdelnour@gmail.com?subject=I%27d%20like%20to%20talk%20about%20an%20AI%20agent"
            className="primary-button px-8 md:px-10 py-4 md:py-5 text-base md:text-lg mb-5"
          >
            Book a free consult
          </a>
          <p className="text-subdued text-sm mb-16 md:mb-20">
            Or email directly:{" "}
            <a
              href="mailto:magnus.abdelnour@gmail.com"
              className="text-accent-3 hover:underline transition-colors"
            >
              magnus.abdelnour@gmail.com
            </a>
          </p>

          <div className="subtle-divider mb-6" />
          <div className="text-subdued text-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <span>&copy; {year} Tharros. Ottawa, Ontario, Canada.</span>
            <span className="text-muted text-xs">AI agents for small businesses that need to move fast.</span>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
