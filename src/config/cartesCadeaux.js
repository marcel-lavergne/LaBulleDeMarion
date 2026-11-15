/* ═══════════════════════════════════════════════════════════════
   CONFIGURATION — CARTES CADEAUX
   Toutes les règles des cartes cadeaux, en un seul endroit.
═══════════════════════════════════════════════════════════════ */

/* Montant libre : bornes en euros (nombres entiers) */
export const MONTANT_MIN = 30;
export const MONTANT_MAX = 500;


/* Durée de validité d'une carte, en mois */
export const VALIDITE_MOIS = 6;

/* Longueur maximale du petit mot écrit sur la carte */
export const MESSAGE_MAX = 200;

/* "220€" → 220  (les prix du site sont stockés en texte) */
export function prixEnNombre(prix) {
  return parseInt(String(prix).replace(/[^\d]/g, ""), 10);
}
