import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";

export const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
export const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
export const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

export const clerkAppearance = {
  theme: shadcn,
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#fafafa",
    colorForeground: "#fafafa",
    colorMutedForeground: "#b3b3b3",
    colorDanger: "#f87171",
    colorBackground: "#121212",
    colorInput: "#1c1c1c",
    colorInputForeground: "#fafafa",
    colorNeutral: "#b3b3b3",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: { width: "100%", display: "flex", justifyContent: "center" },
    cardBox: { background: "#121212", width: "440px", maxWidth: "100%", borderRadius: "16px", overflow: "hidden" },
    card: { background: "transparent", border: "0", boxShadow: "none" },
    footer: { background: "transparent", border: "0", boxShadow: "none" },
    headerTitle: { color: "#fafafa" },
    headerSubtitle: { color: "#b3b3b3" },
    socialButtonsBlockButtonText: { color: "#fafafa" },
    formFieldLabel: { color: "#fafafa" },
    footerActionLink: { color: "#fafafa" },
    footerActionText: { color: "#b3b3b3" },
    dividerText: { color: "#b3b3b3" },
    identityPreviewEditButton: { color: "#fafafa" },
    formFieldSuccessText: { color: "#86efac" },
    alertText: { color: "#fafafa" },
    logoBox: { padding: "16px" },
    logoImage: { maxWidth: "180px", maxHeight: "70px" },
    socialButtonsBlockButton: { background: "#1c1c1c", border: "1px solid #444" },
    formButtonPrimary: { background: "#fafafa", color: "#111" },
    formFieldInput: { background: "#1c1c1c", color: "#fafafa", border: "1px solid #444" },
    footerAction: { background: "transparent" },
    dividerLine: { background: "#444" },
    alert: { background: "#292929" },
    otpCodeFieldInput: { background: "#1c1c1c", color: "#fafafa" },
    formFieldRow: { marginBottom: "16px" },
    main: { gap: "20px" },
  },
};