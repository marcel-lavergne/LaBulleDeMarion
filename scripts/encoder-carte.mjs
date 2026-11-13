/* ─────────────────────────────────────────────
   Prépare les fichiers de la carte cadeau pour les fonctions serveur.
   Lancé automatiquement par « npm run build ».

   Les fonctions Netlify ne lisent pas facilement des fichiers à côté
   d'elles : on transforme donc le fond de carte (PDF Canva) et les
   polices en texte (base64) dans un module JavaScript importable.

   👉 Pour changer le design de la carte : remplace
      netlify/functions/_ressources/carte-cadeau.pdf (export PDF Canva,
      même format) puis relance « npm run build ».
───────────────────────────────────────────── */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const dossier = resolve(dirname(fileURLToPath(import.meta.url)), "../netlify/functions/_ressources");
const b64 = (nom) => readFileSync(resolve(dossier, nom)).toString("base64");

const contenu = `/* FICHIER GÉNÉRÉ par scripts/encoder-carte.mjs — ne pas modifier à la main */
export const CARTE_PDF = "${b64("carte-cadeau.pdf")}";
export const POPPINS_REGULAR = "${b64("Poppins-Regular.ttf")}";
export const POPPINS_MEDIUM = "${b64("Poppins-Medium.ttf")}";
`;

writeFileSync(resolve(dossier, "fichiers.js"), contenu);
console.log("  carte cadeau  netlify/functions/_ressources/fichiers.js");
