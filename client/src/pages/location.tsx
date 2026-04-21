import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import PageLayout from "@/components/page-layout";
import SEO from "@/components/seo";
import { Button } from "@/components/ui/button";
import type { LocationConfig } from "@/lib/location-configs";

export function LocationPage({ config }: { config: LocationConfig }) {
  const title = `Web Design in ${config.city}, ${config.state}`;
  const description = `Custom web design and development for ${config.city}, ${config.state} small businesses. Modern websites, branding, e-commerce, and automation from Landon & Co.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    serviceType: "Web Design",
    provider: { "@id": "https://landonco.co/#business" },
    areaServed: {
      "@type": "City",
      name: config.city,
      containedInPlace: { "@type": "State", name: "Texas" },
    },
    description,
  };

  return (
    <PageLayout>
      <SEO
        title={title}
        description={description}
        path={`/${config.slug}`}
        jsonLd={jsonLd}
      />

      <section className="section-padding bg-black">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <p className="eyebrow mb-4">{config.city}, {config.state}</p>
            <h1 className="heading-display text-white mb-6 text-balance">
              Web design built for{" "}
              <span className="text-gradient">{config.city}</span> businesses
              ready to grow.
            </h1>
            <p className="body-lg mb-10 text-balance">{config.intro}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/#contact">
                <Button className="btn-primary">
                  Start a project
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" className="btn-secondary border-0">
                  See recent work
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-black border-t border-white/10">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-4">The local market</p>
            <h2 className="heading-xl text-white mb-5">
              We know how {config.city} buys.
            </h2>
            <p className="body-md">{config.market}</p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="surface-card p-6">
              <p className="eyebrow mb-3">Neighborhoods served</p>
              <ul className="space-y-2 text-sm text-white/80">
                {config.neighborhoods.map((n) => (
                  <li key={n} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-white/50" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card p-6">
              <p className="eyebrow mb-3">Industries we build for</p>
              <ul className="space-y-2 text-sm text-white/80">
                {config.industries.map((n) => (
                  <li key={n} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-white/50" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-black border-t border-white/10">
        <div className="container-custom">
          <div className="surface-card p-10 text-center max-w-3xl mx-auto">
            <p className="eyebrow mb-4">Get a quote</p>
            <h2 className="heading-xl text-white mb-5">
              Ready to upgrade your {config.city} website?
            </h2>
            <p className="body-md mb-8">
              Tell us about your business and we&rsquo;ll come back with a fixed
              price and timeline within 24 hours.
            </p>
            <Link href="/#contact">
              <Button className="btn-primary">
                Start a project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

