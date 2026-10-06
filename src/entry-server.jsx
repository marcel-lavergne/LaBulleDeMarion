/* ─────────────────────────────────────────────
   Entrée « serveur » — utilisée UNIQUEMENT au build
   par scripts/prerender.mjs pour écrire le HTML de
   chaque page (lisible sans JavaScript).
───────────────────────────────────────────── */

import { StrictMode } from "react";
import { renderToString } from "react-dom/server";

import App from "./App.jsx";

export { ROUTES, SITE_URL, metaFor } from "./config/routes.js";
export { SOINS } from "./data/soins.js";

export function render(pageId) {
  return renderToString(
    <StrictMode>
      <App initialPage={pageId} />
    </StrictMode>
  );
}
