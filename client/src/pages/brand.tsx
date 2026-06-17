import PageLayout from "@/components/page-layout";
import SEO from "@/components/seo";
import { Link } from "wouter";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";

type LogoFile = {
  label: string;
  href: string;
  filename: string;
  background: "light" | "dark";
  note?: string;
};

const LOGO_FILES: LogoFile[] = [
  {
    label: "Primary · White (SVG)",
    href: "/brand/landon-co-logo-white.svg",
    filename: "landon-co-logo-white.svg",
    background: "dark",
    note: "Vector master. Scales to any size with no quality loss. Preferred.",
  },
  {
    label: "Primary · Black (SVG)",
    href: "/brand/landon-co-logo-black.svg",
    filename: "landon-co-logo-black.svg",
    background: "light",
    note: "Vector master for light backgrounds. Preferred.",
  },
  {
    label: "Primary · White",
    href: "/brand/landon-co-logo-white.webp",
    filename: "landon-co-logo-white.webp",
    background: "dark",
    note: "Use on black or dark photography. Source format.",
  },
  {
    label: "Primary · White (PNG)",
    href: "/brand/landon-co-logo-white.png",
    filename: "landon-co-logo-white.png",
    background: "dark",
    note: "Universal format. Use anywhere webp is unsupported.",
  },
  {
    label: "Primary · Black",
    href: "/brand/landon-co-logo-black.webp",
    filename: "landon-co-logo-black.webp",
    background: "light",
    note: "Use on white or light backgrounds.",
  },
  {
    label: "Primary · Black (PNG)",
    href: "/brand/landon-co-logo-black.png",
    filename: "landon-co-logo-black.png",
    background: "light",
    note: "Universal format. Use anywhere webp is unsupported.",
  },
];

const EMAIL_SIGNATURE_FILES: LogoFile[] = [
  {
    label: "Black · 120px display",
    href: "/brand/landon-co-logo-black-120.png",
    filename: "landon-co-logo-black-120.png",
    background: "light",
    note: "Default Gmail signature size (240px @ 2x retina).",
  },
  {
    label: "Black · 200px display",
    href: "/brand/landon-co-logo-black-200.png",
    filename: "landon-co-logo-black-200.png",
    background: "light",
    note: "Larger / more prominent placement (400px @ 2x).",
  },
  {
    label: "White · 120px display",
    href: "/brand/landon-co-logo-white-120.png",
    filename: "landon-co-logo-white-120.png",
    background: "dark",
    note: "For dark-themed signatures.",
  },
  {
    label: "White · 200px display",
    href: "/brand/landon-co-logo-white-200.png",
    filename: "landon-co-logo-white-200.png",
    background: "dark",
    note: "Larger dark-theme signature.",
  },
];

type Color = {
  name: string;
  hex: string;
  hsl: string;
  usage: string;
  text: "light" | "dark";
};

const CORE_COLORS: Color[] = [
  {
    name: "Black",
    hex: "#0A0A0A",
    hsl: "hsl(0, 0%, 4%)",
    usage: "Primary background. Hero canvas.",
    text: "light",
  },
  {
    name: "Elevated",
    hex: "#121212",
    hsl: "hsl(0, 0%, 7%)",
    usage: "Sections, panels, raised surfaces.",
    text: "light",
  },
  {
    name: "Card",
    hex: "#171717",
    hsl: "hsl(0, 0%, 9%)",
    usage: "Cards, project tiles, modal surfaces.",
    text: "light",
  },
  {
    name: "White",
    hex: "#FAFAFA",
    hsl: "hsl(0, 0%, 98%)",
    usage: "Primary text. Logo. CTA buttons.",
    text: "dark",
  },
  {
    name: "Text Secondary",
    hex: "#B3B3B3",
    hsl: "hsl(0, 0%, 70%)",
    usage: "Body copy, descriptions.",
    text: "dark",
  },
  {
    name: "Text Muted",
    hex: "#737373",
    hsl: "hsl(0, 0%, 45%)",
    usage: "Eyebrows, captions, metadata.",
    text: "light",
  },
  {
    name: "Border",
    hex: "#242424",
    hsl: "hsl(0, 0%, 14%)",
    usage: "Default border / divider.",
    text: "light",
  },
  {
    name: "Border Strong",
    hex: "#383838",
    hsl: "hsl(0, 0%, 22%)",
    usage: "Hover state, active borders.",
    text: "light",
  },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          /* noop */
        }
      }}
      className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
      aria-label={`Copy ${value}`}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" /> Copied
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" /> {value}
        </>
      )}
    </button>
  );
}

function LogoCard({ logo }: { logo: LogoFile }) {
  return (
    <div className="surface-card overflow-hidden">
      <div
        className={`aspect-[16/10] flex items-center justify-center p-10 ${
          logo.background === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        <img
          src={logo.href}
          alt={logo.label}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-white text-sm font-medium">{logo.label}</p>
          {logo.note && (
            <p className="text-white/50 text-xs mt-1 leading-relaxed">
              {logo.note}
            </p>
          )}
        </div>
        <a
          href={logo.href}
          download={logo.filename}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/5 text-xs transition-colors"
          aria-label={`Download ${logo.label}`}
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
      </div>
    </div>
  );
}

function ColorSwatch({ color }: { color: Color }) {
  return (
    <div className="surface-card overflow-hidden">
      <div
        className={`aspect-[5/3] flex items-end p-5 ${
          color.text === "dark" ? "text-black/70" : "text-white/70"
        }`}
        style={{ backgroundColor: color.hex }}
      >
        <span className="font-mono text-xs">{color.hex}</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white text-sm font-medium">{color.name}</p>
        </div>
        <p className="text-white/50 text-xs leading-relaxed mb-3">
          {color.usage}
        </p>
        <div className="flex flex-wrap gap-3">
          <CopyButton value={color.hex} />
          <CopyButton value={color.hsl} />
        </div>
      </div>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-16 border-t border-white/10 first:border-t-0 first:pt-0">
      <div className="max-w-2xl mb-10">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="heading-lg text-white mb-3">{title}</h2>
        {description && <p className="body-md">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function BrandPage() {
  return (
    <PageLayout>
      <SEO
        title="Brand Kit | Landon & Co."
        description="Internal brand kit — logos, color palette, typography, and usage guidelines for Landon & Co."
        path="/brand"
        noindex
      />

      <div className="bg-black">
        <div className="container-custom max-w-5xl py-10">
          <Link
            href="/"
            className="text-white/60 text-sm hover:text-white transition-colors inline-block"
          >
            ← Back home
          </Link>
        </div>

        <div className="container-custom max-w-5xl pb-10">
          <p className="eyebrow mb-4">Brand kit · v1</p>
          <h1 className="heading-display text-white mb-5 text-balance">
            Landon &amp; Co. brand guidelines.
          </h1>
          <p className="body-lg max-w-2xl">
            Everything in one place — logos, colors, typography, voice, and how
            to keep our brand consistent across web, print, social, and signage.
          </p>
          <p className="text-white/40 text-xs mt-6 font-mono">
            Internal reference. Not indexed by search engines.
          </p>
        </div>

        <div className="container-custom max-w-5xl pb-32">
          {/* Brand story */}
          <Section
            eyebrow="01 · The brand"
            title="Who we are."
            description="A small, founder-led web and branding studio for South Texas — San Antonio, Corpus Christi, and Victoria. We build fast, modern websites for small and local businesses and pair them with branding, SEO, and local marketing that actually drives leads."
          >
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { k: "Founded", v: "2024" },
                { k: "Based", v: "South Texas" },
                { k: "Founder", v: "Kyle Landon" },
              ].map((item) => (
                <div
                  key={item.k}
                  className="surface-card p-5"
                >
                  <p className="eyebrow mb-2">{item.k}</p>
                  <p className="text-white text-base">{item.v}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Logos */}
          <Section
            eyebrow="02 · Logos"
            title="Primary logo."
            description="The hand-painted brushstroke wordmark is the heart of the brand. Always preserve clear space around it equal to the height of the 'L'. Never re-color, outline, recreate, or stretch it."
          >
            <div className="grid sm:grid-cols-2 gap-5">
              {LOGO_FILES.map((logo) => (
                <LogoCard key={logo.href} logo={logo} />
              ))}
            </div>
          </Section>

          {/* Email signature */}
          <Section
            eyebrow="03 · Email signature"
            title="Pre-sized for email."
            description="Drop-in PNGs ready for Gmail, Apple Mail, Outlook. PNG is used for universal email-client support. Use the 120px versions as your default; 200px when the logo is the only image in your signature."
          >
            <div className="grid sm:grid-cols-2 gap-5">
              {EMAIL_SIGNATURE_FILES.map((logo) => (
                <LogoCard key={logo.href} logo={logo} />
              ))}
            </div>
          </Section>

          {/* Logo usage */}
          <Section
            eyebrow="04 · Logo usage"
            title="Do's & don'ts."
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="surface-card p-6">
                <p className="text-white text-sm font-medium mb-3">Do</p>
                <ul className="text-white/70 text-sm space-y-2 leading-relaxed">
                  <li>· Use white logo on dark backgrounds</li>
                  <li>· Use black logo on light backgrounds</li>
                  <li>· Maintain clear space around the wordmark</li>
                  <li>· Use approved file formats only</li>
                  <li>· Preserve the hand-painted texture</li>
                </ul>
              </div>
              <div className="surface-card p-6">
                <p className="text-white text-sm font-medium mb-3">Don't</p>
                <ul className="text-white/70 text-sm space-y-2 leading-relaxed">
                  <li>· Stretch, skew, or rotate the logo</li>
                  <li>· Add drop shadows, glows, or strokes</li>
                  <li>· Re-color in any brand-foreign color</li>
                  <li>· Place on busy or low-contrast backgrounds</li>
                  <li>· Re-create the wordmark in another font</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Colors */}
          <Section
            eyebrow="05 · Color"
            title="Palette."
            description="Disciplined, monochromatic. Black anchors everything; white provides contrast and emphasis. Click any value to copy."
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CORE_COLORS.map((c) => (
                <ColorSwatch key={c.hex} color={c} />
              ))}
            </div>
          </Section>

          {/* Typography */}
          <Section
            eyebrow="06 · Typography"
            title="Type system."
            description="Two typefaces. Inter does all the heavy lifting; JetBrains Mono handles eyebrows and metadata."
          >
            <div className="space-y-5">
              <div className="surface-card p-8">
                <div className="flex items-baseline justify-between mb-5">
                  <p className="text-white text-sm font-medium">
                    Inter — primary
                  </p>
                  <a
                    href="https://fonts.google.com/specimen/Inter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Google Fonts ↗
                  </a>
                </div>
                <p
                  className="text-white text-6xl md:text-7xl font-bold tracking-tight leading-none mb-2"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Aa
                </p>
                <p
                  className="text-white/60 text-sm mb-6"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  300 · 400 · 500 · 600 · 700 · 800
                </p>
                <div className="space-y-3">
                  <p className="heading-display text-white">
                    Display heading.
                  </p>
                  <p className="heading-xl text-white">Section heading.</p>
                  <p className="heading-md text-white">Sub heading.</p>
                  <p className="body-md max-w-xl">
                    Body copy. Used for descriptions, paragraphs, and
                    long-form. Comfortable line-height, balanced wrap, slightly
                    muted color for hierarchy.
                  </p>
                </div>
              </div>

              <div className="surface-card p-8">
                <div className="flex items-baseline justify-between mb-5">
                  <p className="text-white text-sm font-medium">
                    JetBrains Mono — accent
                  </p>
                  <a
                    href="https://fonts.google.com/specimen/JetBrains+Mono"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Google Fonts ↗
                  </a>
                </div>
                <p
                  className="text-white text-6xl md:text-7xl font-medium tracking-tight leading-none mb-6"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Aa
                </p>
                <div className="space-y-3">
                  <p className="eyebrow">Used for eyebrows like this</p>
                  <p
                    className="text-white/70 text-xs"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    metadata · timestamps · captions · footer notes
                  </p>
                </div>
              </div>

              <div className="surface-card p-8">
                <p className="text-white text-sm font-medium mb-2">
                  Fallback — Helvetica Neue / Arial
                </p>
                <p className="text-white/60 text-sm mb-5 leading-relaxed">
                  When Inter isn't available (older devices, email clients,
                  PDFs, signage software), use{" "}
                  <span className="text-white">Helvetica Neue</span>,{" "}
                  <span className="text-white">Helvetica</span>, or{" "}
                  <span className="text-white">Arial</span>. They share Inter's
                  geometric, neutral character and ship with virtually every
                  operating system, so the brand reads consistently
                  everywhere.
                </p>
                <div className="grid sm:grid-cols-3 gap-3 mb-6">
                  {["Helvetica Neue", "Helvetica", "Arial"].map((f) => (
                    <div
                      key={f}
                      className="rounded-lg border border-white/10 p-4"
                    >
                      <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-2">
                        {f}
                      </p>
                      <p
                        className="text-white text-3xl font-bold leading-none mb-1"
                        style={{ fontFamily: `${f}, sans-serif` }}
                      >
                        Aa
                      </p>
                      <p
                        className="text-white/70 text-sm"
                        style={{ fontFamily: `${f}, sans-serif` }}
                      >
                        Landon &amp; Co.
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-white/50 text-xs mb-2">
                  Use case quick reference
                </p>
                <ul className="text-white/70 text-sm space-y-1.5 leading-relaxed">
                  <li>
                    <span className="text-white">Email signature ·</span>{" "}
                    Helvetica Neue, Arial
                  </li>
                  <li>
                    <span className="text-white">Microsoft Word / Docs ·</span>{" "}
                    Arial
                  </li>
                  <li>
                    <span className="text-white">Print / vehicle wrap ·</span>{" "}
                    Helvetica Neue Bold
                  </li>
                  <li>
                    <span className="text-white">Slide decks ·</span> Arial or
                    Helvetica
                  </li>
                </ul>
              </div>

              <div className="surface-card p-6">
                <p className="text-white/50 text-xs mb-3">
                  Web stack (full fallback chain)
                </p>
                <CopyButton value="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;" />
              </div>
            </div>
          </Section>

          {/* Buttons */}
          <Section
            eyebrow="07 · UI"
            title="Buttons & components."
            description="Pill-shaped, soft transitions, micro-scale on click. Three variants — primary, secondary, ghost."
          >
            <div className="surface-card p-8 flex flex-wrap items-center gap-4">
              <button type="button" className="btn-primary">
                Primary action
              </button>
              <button type="button" className="btn-secondary">
                Secondary action
              </button>
              <button type="button" className="btn-ghost">
                Ghost link →
              </button>
            </div>
          </Section>

          {/* Voice */}
          <Section
            eyebrow="08 · Voice"
            title="How we sound."
            description="Direct. Confident. Human. We talk to small business owners, not other agencies."
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="surface-card p-6">
                <p className="text-white text-sm font-medium mb-3">We are</p>
                <ul className="text-white/70 text-sm space-y-2 leading-relaxed">
                  <li>· Plain-spoken &amp; jargon-free</li>
                  <li>· Confident, not arrogant</li>
                  <li>· Specific (numbers, places, names)</li>
                  <li>· Warm, with a bit of dry humor</li>
                  <li>· Local — proudly South Texas</li>
                </ul>
              </div>
              <div className="surface-card p-6">
                <p className="text-white text-sm font-medium mb-3">We are not</p>
                <ul className="text-white/70 text-sm space-y-2 leading-relaxed">
                  <li>· Buzzword-y or "agency-speak"</li>
                  <li>· Salesy or pushy</li>
                  <li>· Vague (no "synergy", "solutions")</li>
                  <li>· Stiff or corporate</li>
                  <li>· Anonymous — there's a real person behind this</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Tagline / Boilerplate */}
          <Section
            eyebrow="09 · Boilerplate"
            title="Approved copy."
            description="Drop these into bios, pitches, directory listings, and press."
          >
            <div className="space-y-4">
              <div className="surface-card p-6">
                <p className="text-white/50 text-xs mb-3">
                  One-liner (tagline)
                </p>
                <p className="text-white text-lg">
                  Modern websites for South Texas small businesses.
                </p>
              </div>
              <div className="surface-card p-6">
                <p className="text-white/50 text-xs mb-3">Short bio (50 words)</p>
                <p className="text-white text-base leading-relaxed">
                  Landon &amp; Co. is a small web design and branding studio
                  serving San Antonio, Corpus Christi, and Victoria, Texas. We
                  build fast, modern websites for small and local businesses —
                  paired with branding, SEO, and local marketing that actually
                  brings customers in.
                </p>
              </div>
              <div className="surface-card p-6">
                <p className="text-white/50 text-xs mb-3">
                  Long bio (100 words)
                </p>
                <p className="text-white text-base leading-relaxed">
                  Landon &amp; Co. is a founder-led web design and branding
                  studio based in South Texas, serving the San Antonio, Corpus
                  Christi, and Victoria triangle. We build fast, modern,
                  conversion-focused websites for small and local businesses —
                  restaurants, contractors, service companies, and independent
                  brands. Every project pairs design with the local marketing
                  fundamentals that actually move the needle: branding, SEO,
                  Google Business Profile optimization, and analytics. No
                  templates. No outsourcing. Direct work with the founder, fair
                  pricing, real results.
                </p>
              </div>
            </div>
          </Section>

          {/* Contact */}
          <Section
            eyebrow="10 · Contact"
            title="Brand questions?"
          >
            <div className="surface-card p-8">
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                For partnership, press, or brand-usage requests, reach out
                directly.
              </p>
              <Link
                href="/#contact"
                className="btn-primary"
              >
                Get in touch
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </PageLayout>
  );
}
