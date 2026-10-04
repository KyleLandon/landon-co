import { readFile, writeFile, mkdir } from "node:fs/promises";
import { render, publicPaths } from "../dist/ssr/entry-server.js";

const template = await readFile("dist/public/index.html", "utf8");
const manifest = JSON.parse(await readFile("dist/public/.vite/manifest.json", "utf8"));
const css = new Set();
const visited = new Set();
function collectStyles(key) {
  if (visited.has(key)) return;
  visited.add(key);
  const chunk = manifest[key];
  if (!chunk) throw new Error(`Missing public bundle in build manifest: ${key}`);
  for (const file of chunk.css || []) css.add(file);
  for (const dependency of chunk.imports || []) collectStyles(dependency);
}
collectStyles("src/public-app.tsx");
const styleLinks = [...css].filter(file => !template.includes(`/${file}`))
  .map(file => `<link rel="stylesheet" href="/${file}">`).join("\n");
// Keep a CSR shell exclusively for private routes and 404s.
await writeFile("dist/public/app-shell.html", template);
const cleanTemplate = template
  .replace(/<title>[\s\S]*?<\/title>/gi, "")
  .replace(/<meta\b[^>]*(?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/gi, "")
  .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, "");
const visibility = `<style>html[data-prerender-pending] #root [style*="opacity:0"],html[data-prerender-pending] #root [style*="opacity: 0;"]{opacity:1!important;transform:none!important}</style>`;

for (const path of publicPaths) {
  const { body, head } = render(path);
  if (!body || !head.includes("<title")) throw new Error(`Incomplete prerender: ${path}`);
  const html = cleanTemplate.replace("<html", '<html data-prerender-pending')
    .replace("</head>", `${head}\n${styleLinks}\n${visibility}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  const directory = path === "/" ? "dist/public" : `dist/public${path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
}
console.log(`Pre-rendered ${publicPaths.length} public pages.`);