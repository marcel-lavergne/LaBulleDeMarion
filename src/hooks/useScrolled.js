/* ─────────────────────────────────────────────
   useScrolled — La Bulle de Marion
   Retourne true dès que l'utilisateur a scrollé
   au-delà du seuil défini.
───────────────────────────────────────────── */

import { useState, useEffect } from "react";

/**
 * @param {HTMLElement|null} scrollContainer – l'élément scrollable (null = window)
 * @param {number}           threshold       – seuil en pixels (défaut : 40)
 */
export function useScrolled(scrollContainer, threshold = 40) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const target = scrollContainer ?? window;

    const onScroll = () => {
      const y = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      setScrolled(y > threshold);
    };

    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollContainer, threshold]);

  return scrolled;
}
