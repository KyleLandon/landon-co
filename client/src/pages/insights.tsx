import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PageLayout from "@/components/page-layout";
import SEO from "@/components/seo";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  city: string;
  date: string;
  body: string[];
}

export const POSTS: Post[] = [
  {
    slug: "small-business-website-cost-san-antonio",
    title: "How much does a small business website really cost in San Antonio?",
    excerpt:
      "A clear, honest breakdown of what San Antonio business owners actually pay for a website in 2026 — and what drives the price up or down.",
    city: "San Antonio",
    date: "2026-04-01",
    body: [
      "If you've gotten quotes anywhere from $300 to $30,000 for a small business website, you're not alone. The price range in San Antonio is wide because the work is wildly different across providers.",
      "Here's a realistic breakdown for 2026: a simple 5-page marketing site from a freelancer typically runs $1,000 to $3,500. A custom-designed site with stronger branding, on-page SEO, and integrations runs $3,500 to $8,000. E-commerce stores and web apps with custom functionality usually start around $7,500 and go up from there.",
      "What drives the price isn't the page count — it's how much custom work goes into the design, how much content you need help writing, and how many third-party tools the site has to talk to. A simple Shopify storefront with stock theme tweaks is far cheaper than a custom-built shop with subscription billing and ERP integration.",
      "The biggest mistake we see San Antonio business owners make is buying the cheapest option, then paying twice when it doesn't rank, doesn't convert, or breaks six months later. Spend a little more up front on something built right, and the site pays for itself the first time it lands a real customer.",
    ],
  },
  {
    slug: "best-website-platform-corpus-christi-restaurant",
    title: "What's the best website platform for a Corpus Christi restaurant?",
    excerpt:
      "Squarespace, Wix, WordPress, or custom — here's how to pick the right platform for a coastal restaurant or bar.",
    city: "Corpus Christi",
    date: "2026-03-15",
    body: [
      "If you run a restaurant on the bayfront, in Flour Bluff, or out on the island, your website has one job: turn a hungry phone search into a reservation, an order, or a walk-in. The platform you pick should make that as easy as possible.",
      "For most Corpus Christi restaurants under $1M in annual revenue, a well-designed Squarespace or Shopify site is the right call. They're cheap to maintain, easy to update menus on, and play nicely with online ordering tools like Toast, Square, and DoorDash.",
      "If you have a multi-location concept, a strong catering or events business, or you're running ticketed events, WordPress or a custom build will pay off fast. You get tighter integration with reservation systems, better SEO control, and the ability to capture data you actually own.",
      "Whatever you pick, make sure the menu is real text on the page — not a PDF or an image. Google can't read PDFs well, and your hungry searcher won't wait for one to load on a slow signal at the beach.",
    ],
  },
  {
    slug: "why-victoria-businesses-need-a-modern-website",
    title: "Why every Victoria, TX business needs a modern website in 2026",
    excerpt:
      "Word of mouth still wins in Victoria — but the search happens online first. Here's why an outdated site is costing you customers.",
    city: "Victoria",
    date: "2026-02-20",
    body: [
      "Victoria runs on relationships. But here's the catch: even when someone is referred to your business by a neighbor or family member, the very first thing they do is Google you. If your site loads slowly, looks like it was built in 2012, or doesn't work on a phone — that referral just leaked.",
      "A modern site doesn't have to be expensive or flashy. It needs to load in under two seconds on a phone, clearly say what you do, show some recent work or reviews, and make it dead simple to call or message you. That's it.",
      "For Victoria businesses competing in trades, oil and gas services, agriculture, healthcare, or hospitality, this matters even more — because your competitors in San Antonio and Corpus Christi are upgrading their sites and starting to show up in your local searches.",
      "If your current site is more than 4 years old, it's almost certainly worth a rebuild. The cost of the rebuild is almost always less than what you're losing in missed leads.",
    ],
  },
  {
    slug: "seo-checklist-south-texas-small-business",
    title: "The South Texas small business SEO checklist (2026 edition)",
    excerpt:
      "A no-fluff SEO checklist for businesses across the San Antonio – Corpus Christi – Victoria triangle.",
    city: "South Texas",
    date: "2026-01-30",
    body: [
      "Most small business SEO advice is written for big-city marketers with big-city budgets. For a business in the South Texas triangle, the playbook is simpler — and getting the basics right will outperform 90% of your local competition.",
      "Start with your Google Business Profile. Claim it, fully fill it out, add real photos, and ask happy customers for reviews on a regular cadence. This is the single biggest local SEO move and it's free.",
      "Make sure your website has a clear page for every service you offer and every city you serve. A single homepage trying to rank for ten things will rank for none. A page called 'Plumbing Services in Victoria, TX' will outrank a generic homepage every time.",
      "Get your name, address, and phone number consistent across every directory you appear in — Yelp, Apple Maps, Bing Places, Facebook, and the local chamber of commerce. Inconsistencies confuse Google and hurt your rankings.",
      "Finally, get your site fast. Compress your images, use a modern host, and ship the lightest pages you can. Google has been ranking on Core Web Vitals for years now, and the gap between a fast site and a slow one only gets bigger.",
    ],
  },
];

export function InsightsIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Landon & Co. Insights",
    url: "https://landonco.co/insights",
    publisher: { "@id": "https://landonco.co/#business" },
  };

  return (
    <PageLayout>
      <SEO
        title="Insights — Web Design, SEO & Small Business Tips for South Texas"
        description="Practical guides on web design, SEO, and small business growth for the San Antonio, Corpus Christi, and Victoria, TX market."
        path="/insights"
        jsonLd={jsonLd}
      />
      <section className="section-padding bg-black">
        <div className="container-custom">
          <p className="eyebrow mb-4">Insights</p>
          <h1 className="heading-display text-white mb-5">
            Notes on web, SEO, and small business growth.
          </h1>
          <p className="body-md max-w-2xl mb-12">
            Real-world guides for businesses across San Antonio, Corpus Christi,
            and Victoria, TX.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {POSTS.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                <Link
                  href={`/insights/${post.slug}`}
                  className="block surface-card hover-lift p-7 group"
                >
                  <p className="eyebrow mb-3">{post.city}</p>
                  <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-white">
                    {post.title}
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-white/80 text-sm font-medium">
                    Read more
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export function InsightsPost({ slug }: { slug: string }) {
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <PageLayout>
        <SEO
          title="Post not found"
          description="The post you're looking for doesn't exist."
          path={`/insights/${slug}`}
          noindex
        />
        <section className="section-padding bg-black">
          <div className="container-custom text-center">
            <h1 className="heading-xl text-white mb-4">Post not found.</h1>
            <Link
              href="/insights"
              className="text-white underline underline-offset-4"
            >
              Back to insights
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: "Kyle Landon" },
    publisher: { "@id": "https://landonco.co/#business" },
    mainEntityOfPage: `https://landonco.co/insights/${post.slug}`,
  };

  return (
    <PageLayout>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/insights/${post.slug}`}
        type="article"
        jsonLd={jsonLd}
      />
      <article className="section-padding bg-black">
        <div className="container-custom max-w-3xl">
          <Link
            href="/insights"
            className="text-white/60 text-sm hover:text-white transition-colors mb-8 inline-block"
          >
            ← All insights
          </Link>
          <p className="eyebrow mb-4">{post.city}</p>
          <h1 className="heading-display text-white mb-6 text-balance">
            {post.title}
          </h1>
          <p className="text-white/50 text-sm mb-10">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="space-y-5 body-md">
            {post.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </article>
    </PageLayout>
  );
}
