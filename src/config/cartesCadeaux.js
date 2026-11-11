/* Montant libre : bornes en euros */
export const MONTANT_MIN = 30;
export const MONTANT_MAX = 500;

/* Boutons de montant rapide */
export const MONTANTS_RAPIDES = [50, 100, 150];

/* Validité d'une carte, en mois */
export const VALIDITE_MOIS = 12;

/* Longueur max du petit mot */
export const MESSAGE_MAX = 200;

/* "220€" → 220 */
export function prixEnNombre(prix) {
  return parseInt(String(prix).replace(/[^\d]/g, ""), 10);
}