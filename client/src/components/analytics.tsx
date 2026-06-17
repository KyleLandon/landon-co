import { useEffect } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_MEASUREMENT_ID = "G-TBXZCLRL5C";

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", name, params);
  } catch {
    /* noop */
  }
}

export default function Analytics() {
  const [location] = useLocation();

  useEffect(() => {
    // gtag.js is configured with send_page_view:false (see index.html), so this
    // component is the single source of page_view events — it fires once on the
    // initial load and again on every client-side route change in this SPA.
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_path: location,
      page_location: window.location.href,
      page_title: document.title,
      send_to: GA_MEASUREMENT_ID,
    });
  }, [location]);

  return null;
}
