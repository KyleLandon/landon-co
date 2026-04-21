import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import PageLayout from "@/components/page-layout";
import SEO from "@/components/seo";
import { Button } from "@/components/ui/button";
import type { ServiceConfig } from "@/lib/service-configs";

export function ServicePage({ config }: { config: ServiceConfig }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: config.name,
    serviceType: config.name,
    provider: { "@id": "https://landonco.co/#business" },
    areaServed: ["San Antonio, TX", "Corpus Christi, TX", "Victoria, TX"],
    description: config.description,
  };

  return (
    <PageLayout>
      <SEO
        title={config.title}
        description={config.description}
        path={`/services/${config.slug}`}
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
            <p className="eyebrow mb-4">Service</p>
            <h1 className="heading-display text-white mb-6 text-balance">
              {config.name}
            </h1>
            <p className="body-lg mb-10 text-balance">{config.intro}</p>
            <Link href="/#contact">
              <Button className="btn-primary">
                Start a project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-black border-t border-white/10">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="surface-card p-8">
            <p className="eyebrow mb-4">What you get</p>
            <ul className="space-y-3 text-sm text-white/80">
              {config.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-8">
            <p className="eyebrow mb-4">Why it matters</p>
            <ul className="space-y-3 text-sm text-white/80">
              {config.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding bg-black border-t border-white/10">
        <div className="container-custom">
          <p className="eyebrow mb-4">How we work</p>
          <h2 className="heading-xl text-white mb-10">A clear process from kickoff to launch.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {config.process.map((p, i) => (
              <div key={p.title} className="surface-card p-6">
                <div className="text-white/40 text-xs font-mono mb-3">
                  0{i + 1}
                </div>
                <h3 className="text-white font-semibold mb-2">{p.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-black border-t border-white/10">
        <div className="container-custom">
          <div className="surface-card p-10 text-center max-w-3xl mx-auto">
            <h2 className="heading-xl text-white mb-5">
              Ready to talk about your {config.name.toLowerCase()} project?
            </h2>
            <p className="body-md mb-8">
              We&rsquo;ll send back a fixed quote and timeline within 24 hours.
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
