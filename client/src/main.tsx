import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

const root = document.getElementById("root")!;
const isPrivateRoute = /^\/(?:admin|dashboard|project|sign-in|sign-up)(?:\/|$)/.test(location.pathname)
  || /^\/projects\/[^/]+/.test(location.pathname);

async function start() {
  if (isPrivateRoute) {
    const { default: App } = await import("./App");
    createRoot(root).render(<HelmetProvider><App /></HelmetProvider>);
  } else {
    const { PublicApp } = await import("./public-app");
    const app = <PublicApp />;
    if (root.hasChildNodes()) hydrateRoot(root, app);
    else createRoot(root).render(app);
  }
}

void start();
