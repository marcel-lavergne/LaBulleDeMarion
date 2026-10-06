/* ─────────────────────────────────────────────
   Pré-rendu — La Bulle de Marion
   Lancé par « npm run build », après les deux builds Vite.
   Écrit un fichier HTML complet par page dans dist/ :
     /            → index.html
     /soins       → soins.html      (Netlify le sert sur /soins)
     adresse inconnue → 404.html    (vrai code 404)
     /admin       → admin.html      (coquille vide, non indexée)
───────────────────────────────────────────── */

import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

const { render, ROUTES, SITE_URL, metaFor, SOINS } = await import(
  pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href
);

const template = readFileSync(resolve(dist, "index.html"), "utf8");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/* Remplace le contenu d'une balise du <head> (erreur si elle est introuvable) */
function swap(html, regex, replacement) {
  if (!regex.test(html)) throw new Error(`Balise introuvable dans index.html : ${regex}`);
  return html.replace(regex, replacement);
}

function withMeta(html, meta) {
  const url = SITE_URL + (meta.noindex ? "/" : meta.path);
  const t = esc(meta.title);
  const d = esc(meta.description);
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`);
  html = swap(html, /(<meta\s+name="description"\s+content=")[^"]*"/, `$1${d}"`);
  html = swap(html, /(<link\s+rel="canonical"\s+href=")[^"]*"/, `$1${url}"`);
  html = swap(html, /(<meta\s+property="og:title"\s+content=")[^"]*"/, `$1${t}"`);
  html = swap(html, /(<meta\s+property="og:description"\s+content=")[^"]*"/, `$1${d}"`);
  html = swap(html, /(<meta\s+property="og:url"\s+content=")[^"]*"/, `$1${url}"`);
  html = swap(html, /(<meta\s+name="twitter:title"\s+content=")[^"]*"/, `$1${t}"`);
  html = swap(html, /(<meta\s+name="twitter:description"\s+content=")[^"]*"/, `$1${d}"`);
  html = swap(
    html,
    /(<meta\s+name="robots"\s+content=")[^"]*"/,
    `$1${meta.noindex ? "noindex, follow" : "index, follow"}"`
  );
  return html;
}

/* Données structurées propres à certaines pages */
const BUSINESS = { "@type": "HealthAndBeautyBusiness", name: "La Bulle de Marion", url: SITE_URL + "/" };

function jsonLdFor(id) {
  if (id === "soins") {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Soins et tarifs — La Bulle de Marion",
      itemListElement: SOINS.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: s.name,
          description: s.description,
          provider: BUSINESS,
          areaServed: "Massy et Essonne (91)",
          offers: {
            "@type": "Offer",
            price: String(s.price).replace(/[^\d.,]/g, "").replace(",", "."),
            priceCurrency: "EUR",
            url: SITE_URL + "/soins",
          },
        },
      })),
    };
  }
  if (id === "apropos") {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Marion Lefort",
      jobTitle: "Praticienne en périnatalité",
      worksFor: BUSINESS,
      url: SITE_URL + "/a-propos",
      workLocation: { "@type": "Place", name: "Massy (91), Essonne" },
    };
  }
  return null;
}

function page(id, { body = true } = {}) {
  let html = withMeta(template, metaFor(id));
  const ld = jsonLdFor(id);
  if (ld) {
    const json = JSON.stringify(ld).replace(/</g, "\\u003c");
    html = html.replace("</head>", `  <script type="application/ld+json">${json}</script>\n  </head>`);
  }
  if (body) {
    html = swap(html, /<div id="root"><\/div>/, `<div id="root">${render(id)}</div>`);
  }
  return html;
}

const out = [];
for (const r of ROUTES) {
  const file = r.path === "/" ? "index.html" : `${r.path.slice(1)}.html`;
  out.push([file, page(r.id)]);
}
out.push(["404.html", page("notfound")]);
out.push(["admin.html", page("admin", { body: false })]);

for (const [file, html] of out) {
  writeFileSync(resolve(dist, file), html);
  console.log(`  pré-rendu  dist/${file}`);
}

rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
