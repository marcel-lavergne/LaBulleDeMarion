/* ─────────────────────────────────────────────
   Logo — La Bulle de Marion
   Logo officiel de la charte graphique.

   L'image source est une silhouette transparente ; on
   l'affiche via "mask" pour la colorer selon le contexte :
   terracotta sur fond clair (menu), crème sur fond sombre
   (pied de page). L'API ne change pas : light + size.
───────────────────────────────────────────── */

import logoUrl from "../../assets/logo.png";

const COLOR_TERRA = "#a2381c"; // terracotta (fond clair)
const COLOR_LIN   = "#faf3e9"; // crème (fond sombre)

const RATIO = 2.907; // largeur / hauteur du logo

/**
 * @param {object} props
 * @param {boolean} props.light  – version claire (fond sombre)
 * @param {"sm"|"md"|"lg"} props.size
 */
export default function Logo({ light = false, size = "md" }) {
  const heights = { sm: 40, md: 50, lg: 64 };
  const h = heights[size] ?? heights.md;

  return (
    <span
      role="img"
      aria-label="La Bulle de Marion — Bain enveloppé et thérapeutique, massage prénatal et bébé"
      style={{
        display: "inline-block",
        height: h,
        width: Math.round(h * RATIO),
        backgroundColor: light ? COLOR_LIN : COLOR_TERRA,
        WebkitMaskImage: `url(${logoUrl})`,
        maskImage: `url(${logoUrl})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
