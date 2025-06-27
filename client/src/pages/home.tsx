import { useEffect } from "react";
import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import About from "@/components/about";
import Gallery from "@/components/gallery";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import whiteLogo from "@/assets/logo-white.png";

export default function Home() {
  useEffect(() => {
    document.title = "Landon & Co. - Web Design & Development for Local Businesses";
    
    // Add preload for critical resources
    const preloadFont = document.createElement("link");
    preloadFont.rel = "preload";
    preloadFont.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
    preloadFont.as = "style";
    document.head.appendChild(preloadFont);
    
    // Preload critical hero logo
    const preloadLogo = document.createElement("link");
    preloadLogo.rel = "preload";
    preloadLogo.href = whiteLogo;
    preloadLogo.as = "image";
    document.head.appendChild(preloadLogo);
    
    // Ensure viewport is properly set
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
    if (!viewport) {
      const newViewport = document.createElement("meta");
      newViewport.name = "viewport";
      newViewport.content = "width=device-width, initial-scale=1.0";
      document.head.appendChild(newViewport);
    }
    
    const metaDescription = document.createElement("meta");
    metaDescription.name = "description";
    metaDescription.content = "Professional web design and development services for local businesses. Creating modern, responsive websites that drive results and grow your business.";
    document.head.appendChild(metaDescription);

    const ogTitle = document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    ogTitle.content = "Landon & Co. - Web Design & Development";
    document.head.appendChild(ogTitle);

    const ogDescription = document.createElement("meta");
    ogDescription.setAttribute("property", "og:description");
    ogDescription.content = "Professional web design and development services for local businesses. Creating modern, responsive websites that drive results.";
    document.head.appendChild(ogDescription);

    // Add theme color for mobile browsers
    const themeColor = document.createElement("meta");
    themeColor.name = "theme-color";
    themeColor.content = "#000000";
    document.head.appendChild(themeColor);

    // Add DNS prefetch for external domains
    const dnsPrefetch = document.createElement("link");
    dnsPrefetch.rel = "dns-prefetch";
    dnsPrefetch.href = "//fonts.googleapis.com";
    document.head.appendChild(dnsPrefetch);

    const dnsPrefetch2 = document.createElement("link");
    dnsPrefetch2.rel = "dns-prefetch";
    dnsPrefetch2.href = "//images.unsplash.com";
    document.head.appendChild(dnsPrefetch2);

    return () => {
      document.head.removeChild(metaDescription);
      document.head.removeChild(ogTitle);
      document.head.removeChild(ogDescription);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main>
        <Hero />
        <Gallery />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
