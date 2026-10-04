export type AnalyticsData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track(name: string, data?: AnalyticsData): void | Promise<unknown>;
    };
  }
}

/** The publishing proxy provides the tracker; development safely does nothing. */
export function trackEvent(name: string, data?: AnalyticsData): void {
  if (typeof window === "undefined") return;
  try {
    const result = window.umami?.track(name, data);
    // Network failures may reject asynchronously, too.
    if (result) void Promise.resolve(result).catch(() => {});
  } catch {
    // Analytics must never break the app.
  }
}