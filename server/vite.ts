import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger, type ServerOptions } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions: ServerOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const resolvedConfig = await (typeof viteConfig === "function"
    ? viteConfig({ command: "serve", mode: "development", isSsrBuild: false })
    : viteConfig);
  const vite = await createViteServer({
    ...resolvedConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      let page = await vite.transformIndexHtml(url, template);
      const { render, publicPaths } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const pathname = new URL(url, "http://internal").pathname.replace(/\/$/, "") || "/";
      if (publicPaths.includes(pathname)) {
        const { body, head } = render(pathname);
        page = page.replace(/<title>[\s\S]*?<\/title>/gi, "")
          .replace(/<meta\b[^>]*(?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/gi, "")
          .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, "")
          .replace("<html", '<html data-prerender-pending')
          .replace("</head>", `${head}\n<style>html[data-prerender-pending] #root [style*="opacity:0"],html[data-prerender-pending] #root [style*="opacity: 0;"]{opacity:1!important;transform:none!important}</style></head>`)
          .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
      }
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const pathname = req.path.replace(/\/$/, "") || "/";
    // Only serve files contained in the public output directory.
    const file = path.resolve(distPath, `.${pathname}`, "index.html");
    if (file.startsWith(`${distPath}/`) && fs.existsSync(file)) {
      return res.sendFile(file);
    }
    next();
  });
  app.use(express.static(distPath));

  // Private routes use the original empty shell, not the pre-rendered homepage.
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "app-shell.html"));
  });
}
