import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { publicPaths } from "../dist/ssr/entry-server.js";

for (const route of publicPaths) {
  test(`complete static HTML and metadata: ${route}`, async () => {
    const html = await readFile(`dist/public${route === "/" ? "" : route}/index.html`, "utf8");
    assert.match(html, /<h1\b/);
    assert.equal((html.match(/<title\b/g) || []).length, 1);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(html.includes(`https://landonco.co${route === "/" ? "/" : route}`));
    assert.match(html, /property="og:title"/);
    assert.match(html, /data-prerender-pending/);
    assert.ok(!html.includes('<div id="root"></div>'));
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
      await access(`dist/public${match[1]}`);
    }
    if (route === "/pricing" || route === "/brand") assert.match(html, /noindex/);
  });
}

test("private pages keep an empty client-rendered shell and do not enter the prerender list", async () => {
  assert.ok(!publicPaths.some(path => /^\/(admin|dashboard|project)\b/.test(path)));
  const html = await readFile("dist/public/app-shell.html", "utf8");
  assert.ok(html.includes('<div id="root"></div>'));
});

test("unlisted routes stay out of the sitemap", async () => {
  const sitemap = await readFile("client/public/sitemap.xml", "utf8");
  assert.ok(!/<loc>[^<]*\/pricing\/?<\/loc>/.test(sitemap));
  assert.ok(!/<loc>[^<]*\/brand\/?<\/loc>/.test(sitemap));
});