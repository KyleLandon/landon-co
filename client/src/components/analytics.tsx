import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-TBXZCLRL5C";
const CLARITY_PROJECT_ID = ""; // paste Microsoft Clarity Project ID here when you have it

function isProduction() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    host === "landonco.co" ||
    host === "www.landonco.co" ||
    host.endsWith(".replit.app")
  );
}

export default function Analytics() {
  useEffect(() => {
    if (!isProduction()) return;

    if (GA_MEASUREMENT_ID && !document.getElementById("ga4-script")) {
      const script = document.createElement("script");
      script.id = "ga4-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      const inline = document.createElement("script");
      inline.id = "ga4-inline";
      inline.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
      `;
      document.head.appendChild(inline);
    }

    if (CLARITY_PROJECT_ID && !document.getElementById("clarity-script")) {
      const script = document.createElement("script");
      script.id = "clarity-script";
      script.text = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
