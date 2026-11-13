/* ═══════════════════════════════════════════════════════════════
   Cartes cadeaux — fabrication du PDF
   On part du PDF Canva de Marion (les intitulés « Offert à : »…
   y sont déjà) et on écrit les valeurs juste après chaque intitulé.
═══════════════════════════════════════════════════════════════ */

import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { CARTE_PDF, POPPINS_REGULAR, POPPINS_MEDIUM } from "./_ressources/fichiers.js";
import { dateFr, libelleCarte } from "./_cartes.js";

const TEXTE = rgb(0.18, 0.12, 0.08);   // #2e1f14
const TERRA = rgb(0.635, 0.22, 0.11);  // #a2381c

/* Emplacements, en points, mesurés sur le PDF Canva (depuis le bas à gauche
   de la page). x = début du texte, y = ligne d'écriture, max = largeur dispo.
   👉 Si le design Canva change, ce sont ces nombres qu'il faut ajuster. */
const ZONES = {
  offertA:   { x: 70,  y: 64.5, max: 168 },
  dePart:    { x: 89,  y: 53.8, max: 150 },
  soin:      { x: 64,  y: 42.6, max: 176 },
  numero:    { x: 314, y: 63.9, max: 100 },
  validite:  { x: 315, y: 42.6, max: 98  },
};
const TAILLE = 8.5;     // taille normale du texte
const TAILLE_MIN = 5.5; // on réduit jusque-là si le texte est trop long

/* Écrit un texte dans une zone en le réduisant s'il dépasse */
function ecrire(page, police, texte, zone, couleur = TEXTE) {
  const bas = page.getMediaBox().y; // le PDF Canva ne commence pas tout à fait à 0
  let taille = TAILLE;
  while (taille > TAILLE_MIN && police.widthOfTextAtSize(texte, taille) > zone.max) taille -= 0.25;
  /* Encore trop long à la taille minimale : on coupe proprement */
  let t = texte;
  while (police.widthOfTextAtSize(t, taille) > zone.max && t.length > 1) t = t.slice(0, -2) + "…";
  page.drawText(t, { x: zone.x, y: bas + zone.y, size: taille, font: police, color: couleur });
}

/* Remplace les caractères que la police ne sait pas dessiner (émojis…) */
function propre(texte) {
  return String(texte ?? "").replace(/[^ -ɏ–—‘-„…€]/g, "").trim();
}

export async function genererPdf(carte) {
  const pdf = await PDFDocument.load(Buffer.from(CARTE_PDF, "base64"));
  pdf.registerFontkit(fontkit);
  const regular = await pdf.embedFont(Buffer.from(POPPINS_REGULAR, "base64"), { subset: true });
  const medium  = await pdf.embedFont(Buffer.from(POPPINS_MEDIUM, "base64"), { subset: true });

  const page = pdf.getPage(0);
  ecrire(page, regular, propre(carte.beneficiaire.nom), ZONES.offertA);
  ecrire(page, regular, propre(carte.acheteur.nom), ZONES.dePart);
  ecrire(page, regular, propre(libelleCarte(carte)), ZONES.soin);
  ecrire(page, medium, carte.numero, ZONES.numero, TERRA);
  ecrire(page, regular, dateFr(carte.expireLe), ZONES.validite);

  pdf.setTitle(`Carte cadeau La Bulle de Marion — ${carte.numero}`);
  pdf.setAuthor("La Bulle de Marion");
  return pdf.save();
}
