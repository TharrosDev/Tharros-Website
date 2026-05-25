import type { Metadata } from "next";
import SectionEyebrow from "@/components/SectionEyebrow";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Tharros collects, uses, and protects your personal information. Compliant with PIPEDA.",
  alternates: {
    canonical: "/privacy",
  },
};

const UPDATED = "May 25, 2026";
const EMAIL = "tharrosdev@gmail.com";

export default function PrivacyPage() {
  return (
    <main>
      {/* Header band */}
      <div className="bg-[color:var(--surface)] pt-28 md:pt-32 pb-[var(--rhythm-tight)]">
        <div className="page-frame">
          <SectionEyebrow numeral="§ —" label="Legal" />
          <h1 className="type-display-2 mt-6 max-w-[22ch]">Privacy Policy</h1>
          <p className="type-lead text-[color:var(--ink-muted)] mt-6 max-w-[62ch]">
            How Tharros collects, uses, and protects your personal information.
            This policy applies to tharros.ca and all Tharros services.
          </p>
          <p className="num text-xs text-[color:var(--ink-faint)] mt-5">
            Last updated: {UPDATED}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[color:var(--surface)] pb-[var(--rhythm-breath)]">
        <div className="page-frame">
          <div className="max-w-[65ch]">

            <Section heading="Who we are">
              <p>
                Tharros is a website and AI agent studio based in Ottawa, Ontario, Canada. We build
                websites and AI agents for small businesses and trades in the Ottawa–Gatineau
                National Capital Region.
              </p>
              <p className="mt-4">
                Questions about this policy: <a href={`mailto:${EMAIL}`} className="text-[color:var(--accent)] underline underline-offset-2">{EMAIL}</a>.
              </p>
            </Section>

            <Section heading="Information we collect">
              <h3 className="type-meta text-[color:var(--ink)] mt-6 mb-2">Information you provide</h3>
              <p>
                When you complete the discovery brief at tharros.ca/brief, we collect the
                information you enter: your name, email address, phone number, business name, service
                area, project description, goals, and any files you upload. We also record which
                questions you answered in the brief wizard.
              </p>

              <h3 className="type-meta text-[color:var(--ink)] mt-8 mb-2">Analytics data</h3>
              <p>
                We use Google Analytics to understand how visitors use our site. Google Analytics
                collects your IP address, browser type, device type, pages visited, time on page, and
                approximate location. This data is aggregated and not tied to a specific identity.
                We also use Vercel Analytics for site performance monitoring.
              </p>

              <h3 className="type-meta text-[color:var(--ink)] mt-8 mb-2">Browser storage</h3>
              <p>
                Our site uses your browser&apos;s local storage to save your progress through the
                discovery brief so you don&apos;t lose your work if you navigate away. The chat demo
                on the homepage uses local storage to limit usage to 3 questions per visitor and
                maintain your conversation session. This data stays on your device; it is not sent to
                our servers.
              </p>
            </Section>

            <Section heading="How we use your information">
              <p>We use the information you provide to:</p>
              <ul className="mt-4 space-y-2 pl-0">
                {[
                  "Respond to your inquiry and scope your project",
                  "Prepare and send a proposal",
                  "Communicate with you about your build and ongoing support",
                  "Fulfill the terms of any retainer or service agreement",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="num text-[color:var(--accent)] mt-[0.2em] shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                We use analytics data to understand which pages are most useful and to improve the
                site. We do not sell, rent, or share your personal information with third parties for
                marketing purposes.
              </p>
            </Section>

            <Section heading="Third-party services">
              <p className="mb-8">
                To operate our site and services, we work with the following providers. Each handles
                your data under their own privacy policy.
              </p>
              <div className="border-t border-[color:var(--rule)] overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[color:var(--rule)]">
                      <th className="type-meta text-left py-3 pr-6 text-[color:var(--ink-faint)] font-normal">Provider</th>
                      <th className="type-meta text-left py-3 pr-6 text-[color:var(--ink-faint)] font-normal">Purpose</th>
                      <th className="type-meta text-left py-3 text-[color:var(--ink-faint)] font-normal">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Supabase", "Database and file storage for brief submissions", "USA (SOC 2)"],
                      ["Zapier", "Forwards brief submissions to our inbox", "USA"],
                      ["Google Analytics", "Site analytics", "USA"],
                      ["Vercel Analytics", "Performance monitoring", "USA"],
                      ["Relevance AI", "Powers the AI chat demo on the homepage", "USA / Australia"],
                    ].map(([provider, purpose, location]) => (
                      <tr key={provider} className="border-b border-[color:var(--rule)]">
                        <td className="py-4 pr-6 text-[color:var(--ink)] font-medium">{provider}</td>
                        <td className="py-4 pr-6 text-[color:var(--ink-muted)]">{purpose}</td>
                        <td className="py-4 text-[color:var(--ink-muted)] whitespace-nowrap">{location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section heading="Cookies and analytics">
              <p>
                Google Analytics sets cookies in your browser to track sessions and returning visits.
                These cookies include <code className="num text-sm bg-[color:var(--surface-dark)] text-[color:var(--ink-on-dark)] px-1.5 py-0.5 rounded-sm">_ga</code>, <code className="num text-sm bg-[color:var(--surface-dark)] text-[color:var(--ink-on-dark)] px-1.5 py-0.5 rounded-sm">_gid</code>, and related identifiers.
              </p>
              <p className="mt-4">
                You can opt out of Google Analytics tracking by installing the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--accent)] underline underline-offset-2"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>{" "}
                or by adjusting your browser&apos;s cookie settings. Our site does not set any other
                cookies.
              </p>
            </Section>

            <Section heading="Data retention">
              <p>
                Brief submissions and uploaded files are retained for as long as we have an active
                engagement with you or your business. If your project concludes with no ongoing
                retainer, we delete your submission data within 90 days of project close, or upon
                request.
              </p>
              <p className="mt-4">
                Analytics data is retained according to Google&apos;s standard data retention settings.
              </p>
            </Section>

            <Section heading="Your rights under PIPEDA">
              <p>
                Tharros operates under Canada&apos;s Personal Information Protection and Electronic
                Documents Act (PIPEDA). You have the right to:
              </p>
              <ul className="mt-4 space-y-2 pl-0">
                {[
                  "Access the personal information we hold about you",
                  "Correct inaccurate or incomplete information",
                  "Withdraw your consent to our collection and use of your information (note: this may limit our ability to complete or support your project)",
                  "Request deletion of your information",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="num text-[color:var(--accent)] mt-[0.2em] shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                To exercise any of these rights, email us at{" "}
                <a href={`mailto:${EMAIL}`} className="text-[color:var(--accent)] underline underline-offset-2">
                  {EMAIL}
                </a>
                . We will respond within 30 days.
              </p>
              <p className="mt-4">
                If you have a concern about how we handle your personal information, you may also
                contact the Office of the Privacy Commissioner of Canada at{" "}
                <a
                  href="https://www.priv.gc.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--accent)] underline underline-offset-2"
                >
                  priv.gc.ca
                </a>
                .
              </p>
            </Section>

            <Section heading="Changes to this policy">
              <p>
                We may update this policy from time to time. The &quot;Last updated&quot; date at the
                top of the page reflects the most recent revision. Continued use of the site after an
                update constitutes acceptance of the revised policy.
              </p>
            </Section>

          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[color:var(--rule)] pt-10 pb-10 type-body text-[color:var(--ink-muted)]">
      <h2 className="type-display-3 text-[color:var(--ink)] mb-5">{heading}</h2>
      {children}
    </section>
  );
}
