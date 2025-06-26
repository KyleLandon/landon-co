import { useEffect } from "react";
import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Portfolio from "@/components/portfolio";
import Services from "@/components/services";
import About from "@/components/about";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    document.title = "Landon & Co. - Web Design & Development for Local Businesses";
    
    const metaDescription = document.createElement("meta");
    metaDescription.name = "description";
    metaDescription.content = "Professional web design and development services for local businesses. Creating modern, responsive websites that drive results and grow your business.";
    document.head.appendChild(metaDescription);

    const ogTitle = document.createElement("meta");
    ogTitle.property = "og:title";
    ogTitle.content = "Landon & Co. - Web Design & Development";
    document.head.appendChild(ogTitle);

    const ogDescription = document.createElement("meta");
    ogDescription.property = "og:description";
    ogDescription.content = "Professional web design and development services for local businesses. Creating modern, responsive websites that drive results.";
    document.head.appendChild(ogDescription);

    return () => {
      document.head.removeChild(metaDescription);
      document.head.removeChild(ogTitle);
      document.head.removeChild(ogDescription);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--dark-primary)] text-[var(--text-primary)]">
      <Navigation />
      <main>
        <Hero />
        <Portfolio />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
