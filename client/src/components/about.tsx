import { motion } from "framer-motion";
import aboutImage from "@/assets/about-image.svg";

const skills = [
  "Web Development",
  "Branding",
  "Workflow Automation",
  "IT Consulting",
  "React",
  "TypeScript",
  "Shopify",
  "Digital Marketing",
];

const About = () => {
  return (
    <section id="about" className="relative section-padding bg-black">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Image / Founder card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5"
          >
            <div className="relative surface-card overflow-hidden p-3">
              <img
                src={aboutImage}
                alt="Kyle Landon, founder of Landon & Co."
                className="w-full h-auto rounded-md grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
                decoding="async"
                width={400}
                height={400}
              />
              <div className="absolute bottom-6 left-6 px-3 py-1.5 bg-black/70 border border-white/10 rounded-full backdrop-blur-sm">
                <span className="text-white text-xs font-medium tracking-wide">
                  Kyle Landon · Founder
                </span>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7"
          >
            <p className="eyebrow mb-4">About</p>
            <h2 className="heading-xl text-white mb-6">
              We don&rsquo;t just build websites &mdash; we build long-term
              partnerships.
            </h2>

            <div className="space-y-5 body-md">
              <p>
                Landon &amp; Co. was founded to help entrepreneurs overcome the
                hurdle of building a digital presence — without breaking the
                bank. Our mission is simple: provide affordable, high-quality
                services that empower hardworking business owners and give
                them a real head start online.
              </p>
              <p>
                We specialize in web development, branding, automation, and
                consulting. Whether you&rsquo;re launching your first site or
                need a digital facelift, we&rsquo;re here to guide you. From
                technical issues to business process inefficiencies, we offer
                custom solutions that help your business run smarter.
              </p>
              <p>
                Kyle Landon, the founder, was raised by an entrepreneur and
                started working in his family&rsquo;s small business at age
                11. That experience shapes how we work with every client we
                take on.
              </p>
            </div>

            {/* Skill chips */}
            <div className="mt-10">
              <p className="eyebrow mb-4">Capabilities</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 text-xs font-medium text-white/80 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-colors"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
