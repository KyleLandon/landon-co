import PageLayout from "@/components/page-layout";
import SEO from "@/components/seo";
import { Link } from "wouter";

const EFFECTIVE_DATE = "April 21, 2026";

function LegalShell({
  title,
  description,
  path,
  children,
}: {
  title: string;
  description: string;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      <SEO title={title} description={description} path={path} />
      <section className="section-padding bg-black">
        <div className="container-custom max-w-3xl">
          <Link
            href="/"
            className="text-white/60 text-sm hover:text-white transition-colors mb-8 inline-block"
          >
            ← Back home
          </Link>
          <h1 className="heading-display text-white mb-4 text-balance">
            {title.replace(" | Landon & Co.", "")}
          </h1>
          <p className="text-white/50 text-sm mb-10">
            Last updated: {EFFECTIVE_DATE}
          </p>
          <div className="space-y-6 body-md prose-legal">{children}</div>
        </div>
      </section>
    </PageLayout>
  );
}

export function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      description="How Landon & Co. collects, uses, and protects your personal information."
      path="/privacy"
    >
      <p>
        Landon &amp; Co. (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) respects
        your privacy. This Privacy Policy explains how we collect, use, and
        protect information when you visit landonco.co or work with us.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Information we collect
      </h2>
      <p>We collect information in the following ways:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="text-white/90">Information you give us</strong> &mdash;
          such as your name, email, phone number, company name, and project
          details when you fill out our contact or project request form.
        </li>
        <li>
          <strong className="text-white/90">Account information</strong> &mdash; if
          you sign in to a client portal, we store basic profile information
          and any project-related messages, files, contracts, and invoices you
          exchange with us.
        </li>
        <li>
          <strong className="text-white/90">Usage data</strong> &mdash; we use
          Google Analytics 4 to understand which pages are visited, where
          visitors come from, and how the site performs. IP addresses are
          anonymized.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        How we use your information
      </h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>To respond to inquiries and deliver the work you&rsquo;ve hired us for.</li>
        <li>To send project updates, invoices, and contract documents.</li>
        <li>To improve the website and our services.</li>
        <li>To comply with legal obligations.</li>
      </ul>
      <p>
        We do not sell your personal information, and we do not share it with
        third parties for advertising purposes.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Service providers
      </h2>
      <p>
        We use a small number of trusted third-party services to operate our
        business, including Google (Gmail and Analytics), Replit (hosting and
        application infrastructure), and a PostgreSQL database. These providers
        process information only as needed to deliver their service to us and
        are bound by their own privacy commitments.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">Cookies</h2>
      <p>
        We use a small number of essential and analytics cookies. Essential
        cookies keep you signed in to the client portal. Analytics cookies (set
        by Google Analytics) help us measure traffic in aggregate. You can
        disable cookies in your browser settings.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Your rights
      </h2>
      <p>
        You can request a copy of the information we hold about you, ask us to
        correct it, or ask us to delete it. To make a request, email{" "}
        <a
          href="mailto:info@landonco.co"
          className="text-white underline underline-offset-4"
        >
          info@landonco.co
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">Children</h2>
      <p>
        Our services are not directed to children under 13, and we do not
        knowingly collect personal information from children.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Changes to this policy
      </h2>
      <p>
        We may update this policy from time to time. The &ldquo;last
        updated&rdquo; date at the top of this page reflects the most recent
        version.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Contact us
      </h2>
      <p>
        Questions about this policy? Email us at{" "}
        <a
          href="mailto:info@landonco.co"
          className="text-white underline underline-offset-4"
        >
          info@landonco.co
        </a>{" "}
        or call 361-621-5151.
      </p>
    </LegalShell>
  );
}

export function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      description="The terms that govern your use of the Landon & Co. website and services."
      path="/terms"
    >
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
        landonco.co and any services provided by Landon &amp; Co.
        (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;). By using the
        site or hiring us for a project, you agree to these Terms.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Use of the website
      </h2>
      <p>
        You agree to use the site lawfully and not to attempt to disrupt it,
        access areas you&rsquo;re not authorized to access, or use it to
        infringe on anyone&rsquo;s rights.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Project work
      </h2>
      <p>
        Specific project work is governed by a separate written agreement
        (proposal, statement of work, or contract) signed before the project
        begins. That agreement controls scope, timeline, payment, ownership,
        and revisions for that engagement. Where these Terms conflict with a
        signed project agreement, the signed agreement governs.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Intellectual property
      </h2>
      <p>
        The Landon &amp; Co. name, logo, website content, and original
        designs are owned by us. You may not copy or reuse them without
        permission. Work product delivered to a client transfers ownership
        according to the terms of that client&rsquo;s signed agreement.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Third-party services
      </h2>
      <p>
        The site links to and integrates with third-party services. We are not
        responsible for the content or practices of those services.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Disclaimer
      </h2>
      <p>
        The site is provided &ldquo;as is&rdquo; without warranties of any
        kind. To the fullest extent permitted by law, Landon &amp; Co. is not
        liable for any indirect, incidental, or consequential damages arising
        from your use of the site.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Governing law
      </h2>
      <p>
        These Terms are governed by the laws of the State of Texas, without
        regard to its conflict-of-law principles.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Changes to these terms
      </h2>
      <p>
        We may update these Terms from time to time. Continued use of the site
        after changes are posted means you accept the updated Terms.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">
        Contact us
      </h2>
      <p>
        Questions about these Terms? Email{" "}
        <a
          href="mailto:info@landonco.co"
          className="text-white underline underline-offset-4"
        >
          info@landonco.co
        </a>
        .
      </p>
    </LegalShell>
  );
}
