import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Services from "@/components/services";
import Gallery from "@/components/gallery";
import About from "@/components/about";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import FAQ, { faqJsonLd } from "@/components/faq";
import SEO from "@/components/seo";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Web Design in San Antonio, Corpus Christi & Victoria, TX | Landon & Co."
        description="Landon & Co. builds modern, high-performing websites, brands, and digital experiences for small businesses across the South Texas triangle — San Antonio, Corpus Christi, and Victoria, TX."
        path="/"
        jsonLd={faqJsonLd}
      />
      <Navigation />
      <main>
        <Hero />
        <div className="section-divider" />
        <Services />
        <div className="section-divider" />
        <Gallery />
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <FAQ />
        <div className="section-divider" />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
