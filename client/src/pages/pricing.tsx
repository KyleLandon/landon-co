import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/seo";
import "./pricing.css";

const webPackages = [
  {
    name: "The Starter",
    kind: "Single Page",
    price: "$1,500 – $2,500",
    bestFor: "New businesses, solo contractors, landing pages.",
    features: [
      "High-converting landing page",
      "Mobile-responsive",
      "Basic contact form",
      "Google Maps integration",
    ],
  },
  {
    name: "The Lead Machine",
    popular: true,
    kind: "Multi-Page",
    price: "$3,500 – $5,500",
    bestFor: "Established contractors, service companies, professional services.",
    features: [
      "5-8 Pages",
      "On-page SEO",
      "Project galleries",
      "Client testimonials",
      "Advanced lead forms",
    ],
  },
  {
    name: "The Professional",
    kind: "Commerce/Custom",
    price: "$7,500+",
    starting: true,
    bestFor: "Retail boutiques, large restaurants, complex booking needs.",
    features: [
      "E-commerce setup",
      "Third-party integrations (booking/inventory)",
      "Brand identity and custom photography available as separately scoped add-ons",
    ],
  },
];

const carePlans = [
  {
    name: "Website Care",
    price: "$99",
    features: [
      "Secure hosting",
      "SSL certificate",
      "Daily backups",
      "Security and technical updates",
      "Uptime monitoring",
      "Very minor edits only; larger changes quoted separately",
    ],
  },
  {
    name: "Website Care Plus",
    price: "$199",
    features: [
      "Everything in Website Care",
      "Up to 1 hour of edits per month",
      "Priority support",
    ],
  },
];

const growthPlans = [
  {
    name: "Local Growth Plan",
    price: "$699+",
    features: [
      "Website Care included",
      "Local SEO",
      "Google Business Profile management",
      "1 monthly blog/project update",
    ],
  },
  {
    name: "Market Leader",
    price: "$1,500+",
    features: [
      "Full digital marketing: Advanced SEO",
      "Monthly lead reporting",
      "Google Ads management — ad spend billed separately, not included in the monthly fee",
      "4 monthly content pieces",
    ],
  },
];

const services = [
  {
    name: "Logo & Branding Refresh",
    price: "$1,500+",
    starting: true,
    detail: "Brand identity system: typography, colors, vector logo versions. Reference range: $1,500–$3,000+, depending on scope.",
  },
  {
    name: "Professional Copywriting",
    price: "$200",
    unit: "per page",
    detail: "SEO-optimized, conversion-focused",
  },
  {
    name: "Hourly Rate",
    price: "$125",
    unit: "/hr",
    detail: "For non-plan edits",
  },
  {
    name: "Website Audit & Strategy Video",
    price: "$150",
    detail: "Waived if project is signed",
  },
  {
    name: "Business Automation",
    price: "$1,500+",
    starting: true,
    detail: "Custom-scoped workflow automation and integrations.",
  },
  {
    name: "Custom Software / Client Portals",
    price: "$5,000+",
    starting: true,
    detail: "Custom-scoped applications and client portals.",
  },
  {
    name: "Custom Photography",
    price: "Custom quote",
    detail: "Separately scoped add-on; not automatically included in website packages.",
  },
];

const sections = [
  { id: "web-design", number: "01", label: "Web design" },
  { id: "monthly-plans", number: "02", label: "Website care" },
  { id: "growth-plans", number: "03", label: "Growth" },
  { id: "a-la-carte", number: "04", label: "Additional services" },
  { id: "payment-terms", number: "05", label: "Payment terms" },
];

export default function Pricing() {
  return (
    <div className="pricing-reference">
      <SEO
        title="2026 Pricing Reference"
        description="Landon & Co. 2026 price sheet: web design packages, monthly growth and maintenance plans, a-la-carte services, and standard payment terms."
        path="/pricing"
        noindex={true}
      />

      <header className="pricing-topbar">
        <div className="pricing-wrap pricing-topbar-inner">
          <Link href="/" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Landon &amp; Co.
          </Link>
          <span className="pricing-label">Web Design &amp; Marketing</span>
        </div>
      </header>

      <main id="pricing-content">
        <div className="pricing-wrap pricing-intro">
          <p className="pricing-label">2026 / Unlisted reference</p>
          <h1>Pricing reference.</h1>
          <div className="pricing-intro-copy">
            <p>
              Market-Competitive Rates for South Texas Small Businesses
              (Beeville, San Antonio, Corpus Christi, Victoria Triangle)
            </p>
            <p className="mt-2">
              This price sheet is designed to be a starting point. As a founder-led
              studio, our value is in creating sites that convert visitors into
              leads, not just digital business cards.
            </p>
          </div>
          <p className="pricing-access-note">
            Unlisted, not private or secure. Anyone with this link can open this page.
          </p>
        </div>

        <nav className="pricing-nav" aria-label="Pricing sections">
          <div className="pricing-wrap pricing-nav-inner">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                <span aria-hidden="true">{section.number}</span>
                {section.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="pricing-wrap">
          <section
            id="web-design"
            className="pricing-section"
            aria-labelledby="web-design-heading"
          >
            <div className="pricing-section-heading">
              <span className="pricing-label" aria-hidden="true">01</span>
              <h2 id="web-design-heading">Core Web Design Packages</h2>
            </div>
            <p className="pricing-section-copy">
              One-time project fees for design and development.
            </p>
            <div className="pricing-rows">
              {webPackages.map((pkg) => (
                <article key={pkg.name} className={`pricing-row${pkg.popular ? " pricing-row-popular" : ""}`}>
                  <div>
                    {pkg.popular && <span className="pricing-popular">Most Popular</span>}
                    <h3>
                      {pkg.name}
                      <span className="pricing-kind">({pkg.kind})</span>
                    </h3>
                    <p className="pricing-best-for">
                      <strong>Best for:</strong> {pkg.bestFor}
                    </p>
                  </div>
                  <p className="pricing-price">
                    {pkg.starting && <span className="pricing-price-note">Starting at</span>}
                    {pkg.price}
                    <span className="pricing-price-note">One-time investment</span>
                  </p>
                  <ul className="pricing-features" aria-label={`${pkg.name} key features`}>
                    {pkg.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section
            id="monthly-plans"
            className="pricing-section"
            aria-labelledby="monthly-plans-heading"
          >
            <div className="pricing-section-heading">
              <span className="pricing-label" aria-hidden="true">02</span>
              <h2 id="monthly-plans-heading">Website Care</h2>
            </div>
            <p className="pricing-section-copy">
              Keep your website secure, current, and running reliably with ongoing technical care.
            </p>
            <div className="pricing-rows">
              {carePlans.map((plan) => (
                <article key={plan.name} className="pricing-row">
                  <h3>{plan.name}</h3>
                  <p className="pricing-price">
                    {plan.price}
                    <span className="pricing-price-note">/mo</span>
                  </p>
                  <ul className="pricing-features" aria-label={`${plan.name} inclusions`}>
                    {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section id="growth-plans" className="pricing-section" aria-labelledby="growth-plans-heading">
            <div className="pricing-section-heading">
              <span className="pricing-label" aria-hidden="true">03</span>
              <h2 id="growth-plans-heading">Growth &amp; Marketing</h2>
            </div>
            <p className="pricing-section-copy">
              Grow your visibility, keep your content current, and turn more visitors into leads.
              Google Ads spend is separate from the monthly management fee.
            </p>
            <div className="pricing-rows">
              {growthPlans.map((plan) => (
                <article key={plan.name} className="pricing-row">
                  <h3>{plan.name}</h3>
                  <p className="pricing-price">
                    <span className="pricing-price-note">Starting at</span>
                    {plan.price}
                    <span className="pricing-price-note">/mo</span>
                  </p>
                  <ul className="pricing-features" aria-label={`${plan.name} inclusions`}>
                    {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section
            id="a-la-carte"
            className="pricing-section"
            aria-labelledby="a-la-carte-heading"
          >
            <div className="pricing-section-heading">
              <span className="pricing-label" aria-hidden="true">04</span>
              <h2 id="a-la-carte-heading">Additional Services &amp; Add-ons</h2>
            </div>
            <div className="pricing-rows">
              {services.map((service) => (
                <article key={service.name} className="pricing-row pricing-services-row">
                  <h3>{service.name}</h3>
                  <p className="pricing-price">
                    {service.starting && <span className="pricing-price-note">Starting at</span>}
                    {service.price}
                    {service.unit && <span className="pricing-price-note">{service.unit}</span>}
                  </p>
                  <p className="pricing-service-detail">{service.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="payment-terms"
            className="pricing-section"
            aria-labelledby="payment-terms-heading"
          >
            <div className="pricing-section-heading">
              <span className="pricing-label" aria-hidden="true">05</span>
              <h2 id="payment-terms-heading">Standard Payment Terms</h2>
            </div>
            <dl className="pricing-terms">
              <div className="pricing-term">
                <dt>Web Projects</dt>
                <dd>50% Upfront (Deposit to secure start date) / 50% Upon Launch.</dd>
              </div>
              <div className="pricing-term">
                <dt>Monthly Plans</dt>
                <dd>Automatic recurring billing via Stripe on the 1st of every month.</dd>
              </div>
              <div className="pricing-term">
                <dt>Preferred Payment Discount</dt>
                <dd>3% discount for payments made via ACH or check.</dd>
              </div>
            </dl>
          </section>

          <p className="pricing-disclaimer">
            <em>All prices are estimates and subject to change based on project scope.</em>
          </p>
        </div>
      </main>
    </div>
  );
}