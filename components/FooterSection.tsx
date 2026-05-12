import AnimatedSection from "./AnimatedSection";
import Magnetic from "./Magnetic";

export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="py-16 md:py-24 px-6 md:px-12 relative overflow-hidden bg-bg">
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
            Set up a free initial consultation. We&apos;ll listen to your business,
            identify the best use case, and give you a clear sense of what&apos;s
            possible, no obligation.
          </p>
          <Magnetic strength={0.2}>
            <a
              href="mailto:Magnus.Abdelnour@gmail.com?subject=I%27d%20like%20to%20talk%20about%20an%20AI%20agent"
              className="primary-button px-8 md:px-10 py-4 md:py-5 text-base md:text-lg mb-5"
            >
              Set up a free consult
            </a>
          </Magnetic>
          <p className="text-subdued text-sm mb-16 md:mb-20">
            Or email directly:{" "}
            <a
              href="mailto:Magnus.Abdelnour@gmail.com"
              className="text-accent-3 hover:underline transition-colors"
            >
              Magnus.Abdelnour@gmail.com
            </a>
          </p>

          <div className="subtle-divider mb-6" />
          <div className="text-subdued text-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <span>&copy; {year} Tharros. Ottawa, Ontario. 🇨🇦 Keep it Canadian.</span>
            <span className="text-muted text-xs">AI agents for small businesses that need to move fast.</span>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
