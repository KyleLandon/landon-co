export interface ServiceConfig {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  benefits: string[];
  deliverables: string[];
  process: { title: string; body: string }[];
}

const baseProcess = [
  { title: "Discovery", body: "Short call to understand your business, goals, audience, and budget." },
  { title: "Strategy & quote", body: "Fixed-price scope, timeline, and a clear plan you can approve in writing." },
  { title: "Design & build", body: "Modern, fast, accessible. You see progress in your own client portal." },
  { title: "Launch & care", body: "We handle launch, train your team, and keep things running with optional care plans." },
];

export const WEB_DESIGN: ServiceConfig = {
  slug: "web-design",
  name: "Web Design & Development",
  title: "Web Design & Development for Texas Small Businesses",
  description:
    "Custom web design and development for small businesses in San Antonio, Corpus Christi, and Victoria, TX. Fast, modern, and built to convert.",
  intro:
    "Modern marketing sites and custom builds for businesses that need their website to actually do something — get found, build trust, and bring in real leads.",
  deliverables: [
    "Custom design tailored to your brand",
    "Mobile-first, accessible, fast (90+ PageSpeed)",
    "On-page SEO and structured data",
    "Content management you can actually use",
    "Analytics, contact forms, and lead routing",
    "Hosting setup, domain, SSL, and launch",
  ],
  benefits: [
    "More qualified leads from local search",
    "A site that loads in under 2 seconds on mobile",
    "No more guessing — you own the design files and code",
    "Built to scale as your business grows",
  ],
  process: baseProcess,
};

export const BRANDING: ServiceConfig = {
  slug: "branding",
  name: "Branding & Identity",
  title: "Brand Identity Design for Small Businesses",
  description:
    "Logo design, brand identity, and visual systems for South Texas small businesses. Practical branding that works across web, print, and social.",
  intro:
    "A brand isn’t just a logo — it’s the gut feeling people get when they see your business. We design identities that are memorable, flexible, and built to scale with you.",
  deliverables: [
    "Logo design with full lockup variations",
    "Color, type, and visual system",
    "Brand guidelines (PDF)",
    "Stationery, social, and signage templates",
    "Source files and exports for every use case",
  ],
  benefits: [
    "A consistent look across every customer touchpoint",
    "Standout from local competitors",
    "Faster, cheaper future design work",
    "A brand that grows with you, not against you",
  ],
  process: baseProcess,
};

export const ECOMMERCE: ServiceConfig = {
  slug: "ecommerce",
  name: "E-commerce",
  title: "E-commerce Website Design & Development",
  description:
    "Shopify and custom e-commerce stores built for South Texas brands. Conversion-focused product pages, fast checkout, and clean operations.",
  intro:
    "We build storefronts that are easy to manage, fast to check out, and designed to turn browsers into repeat customers — whether you’re launching your first product or scaling past six figures.",
  deliverables: [
    "Shopify or custom storefront design",
    "Conversion-optimized product and checkout flow",
    "Inventory, shipping, and tax setup",
    "Email and abandoned cart automation",
    "Analytics and performance tracking",
  ],
  benefits: [
    "Higher conversion rate than a stock theme",
    "Faster product page load times",
    "Cleaner order operations for your team",
    "Built-in SEO so you stop relying only on ads",
  ],
  process: baseProcess,
};

export const AUTOMATION: ServiceConfig = {
  slug: "automation",
  name: "Workflow Automation",
  title: "Workflow Automation & IT Consulting for Small Businesses",
  description:
    "Custom workflow automation for South Texas small businesses. Stop doing the same task twice — connect your tools and free up real hours.",
  intro:
    "Most small businesses are losing hours every week to copy-paste work between tools. We map your workflow, plug the leaks, and automate the boring parts so your team can focus on the work that pays.",
  deliverables: [
    "Workflow audit and opportunity map",
    "Custom integrations between your tools",
    "Internal dashboards and reporting",
    "Documentation your team can follow",
    "Ongoing support and improvements",
  ],
  benefits: [
    "Hours back every week per employee",
    "Fewer mistakes from manual data entry",
    "Faster customer response times",
    "Real visibility into what’s actually happening",
  ],
  process: baseProcess,
};
