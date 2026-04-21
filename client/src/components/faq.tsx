import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Where are you located and who do you work with?",
    a: "Landon & Co. is based in Texas and serves small businesses across the South Texas triangle — San Antonio, Corpus Christi, and Victoria — as well as clients nationwide. Most of our work is delivered remotely with regular video and on-site visits when helpful.",
  },
  {
    q: "How much does a small business website cost?",
    a: "Most of our marketing sites land between $1,000 and $5,000 depending on page count, custom design, and integrations. E-commerce and web apps run higher. We'll quote a fixed price after a short discovery call so there are no surprises.",
  },
  {
    q: "How long does a typical project take?",
    a: "A focused marketing site is usually 2–4 weeks from kickoff to launch. E-commerce stores and custom web apps run 4–10 weeks. We'll lock the timeline before we start so you know exactly what to expect.",
  },
  {
    q: "Do you handle hosting, domains, and ongoing maintenance?",
    a: "Yes. We can register your domain, set up fast managed hosting, and keep the site updated with monthly care plans that cover updates, backups, monitoring, and small content changes.",
  },
  {
    q: "Can you help with SEO and getting found locally?",
    a: "Absolutely. Every site we build ships with on-page SEO, structured data, fast Core Web Vitals scores, and city-level local SEO setup so your business shows up for searches in San Antonio, Corpus Christi, Victoria, and the surrounding South Texas market.",
  },
  {
    q: "Do you redesign existing websites or only build new ones?",
    a: "Both. A redesign is often the fastest way to lift conversions when you already have content and traffic. We'll audit your current site first and tell you whether a redesign or a from-scratch rebuild makes more sense.",
  },
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const FAQ = () => {
  return (
    <section id="faq" className="relative section-padding bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl mb-12"
        >
          <p className="eyebrow mb-4">Frequently asked</p>
          <h2 className="heading-xl text-white mb-5">
            Answers to the questions we hear most.
          </h2>
          <p className="body-md">
            Still have questions? Email us at{" "}
            <a
              href="mailto:info@landonco.co"
              className="text-white underline underline-offset-4 hover:text-white/80"
            >
              info@landonco.co
            </a>
            .
          </p>
        </motion.div>

        <div className="max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="surface-card px-5 border-0"
              >
                <AccordionTrigger className="text-white text-left text-base font-medium hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 text-sm leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
