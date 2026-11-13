/* ═══════════════════════════════════════════════════════════════
   Fonction PUBLIQUE — /.netlify/functions/carte-cadeau-pdf?n=…&t=…
   Le lien « Télécharger la carte » des mails. Renvoie le PDF de la
   carte si le numéro (n) ET le jeton secret (t) correspondent.
═══════════════════════════════════════════════════════════════ */

import { lireCarte, egalSecurise } from "./_cartes.js";
import { genererPdf } from "./_pdf.js";

export default async (req) => {
  const params = new URL(req.url).searchParams;
  const numero = (params.get("n") || "").toUpperCase();
  const jeton  = params.get("t") || "";

  const carte = /^BDM-[A-Z0-9]{6}$/.test(numero) ? await lireCarte(numero) : null;
  if (!carte || !egalSecurise(jeton, carte.jeton)) {
    return new Response("Carte introuvable. Vérifiez le lien reçu par e-mail.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const pdf = await genererPdf(carte);
  return new Response(pdf, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="carte-cadeau-${carte.numero}.pdf"`,
      "cache-control": "private, no-store",
    },
  });
};
