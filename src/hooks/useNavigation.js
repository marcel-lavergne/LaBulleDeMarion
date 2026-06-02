/* ─────────────────────────────────────────────
   useNavigation — La Bulle de Marion
   Navigation SPA avec effet rideau ET vraies URLs :
   1. Le rideau terracotta descend
   2. La page change (invisible) + l'URL et le titre se mettent à jour
   3. Le rideau remonte
   4. La nouvelle page se révèle
   Gère aussi les boutons Précédent / Suivant du navigateur.
───────────────────────────────────────────── */

import { useState, useCallback, useRef, useEffect } from "react";
import { pathToId, idToPath, metaFor, SITE_URL } from "../config/routes.js";

const CURTAIN_DURATION = 380; // ms — doit correspondre à --curtain-duration dans globals.css
const FADE_DELAY       = 80;  // ms entre la fin du rideau et le fadeIn du contenu

/** Met à jour le titre, la meta description et le lien canonique de la page */
function applyMeta(id) {
  if (typeof document === "undefined") return;
  const meta = metaFor(id);

  document.title = meta.title;

  let desc = document.querySelector('meta[name="description"]');
  if (!desc) {
    desc = document.createElement("meta");
    desc.setAttribute("name", "description");
    document.head.appendChild(desc);
  }
  desc.setAttribute("content", meta.description);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", SITE_URL + idToPath(id));
}

export function useNavigation() {
  const initial =
    typeof window !== "undefined" ? pathToId(window.location.pathname) : "home";

  const [currentPage,   setCurrentPage]   = useState(initial);
  const [displayedPage, setDisplayedPage] = useState(initial);
  const [pagePhase,     setPagePhase]     = useState("visible"); // "entering" | "visible"
  const [curtainClass,  setCurtainClass]  = useState(null);       // null | "in" | "out"

  const timers = useRef([]);
  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
  };
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /**
   * @param {string} targetPage  – id de la page cible
   * @param {object} [opts]
   * @param {boolean} [opts.push=true] – false quand l'URL a déjà changé
   *                                     (boutons précédent/suivant)
   */
  const navigate = useCallback(
    (targetPage, { push = true } = {}) => {
      if (targetPage === currentPage) return;

      clearTimers();

      // Met à jour l'URL (sauf si le navigateur l'a déjà fait via précédent/suivant)
      if (push && typeof window !== "undefined") {
        window.history.pushState({ page: targetPage }, "", idToPath(targetPage));
      }

      // Étape 1 — le rideau descend
      setCurtainClass("in");

      // Étape 2 — contenu swappé + URL/titre mis à jour pendant que le rideau couvre tout
      schedule(() => {
        setDisplayedPage(targetPage);
        setCurrentPage(targetPage);
        setPagePhase("entering");
        applyMeta(targetPage);
      }, CURTAIN_DURATION);

      // Étape 3 — le rideau remonte
      schedule(() => setCurtainClass("out"), CURTAIN_DURATION + 40);

      // Étape 4 — le contenu se révèle en fondu
      schedule(() => setPagePhase("visible"), CURTAIN_DURATION + FADE_DELAY + 60);

      // Étape 5 — nettoyage de la classe rideau
      schedule(() => setCurtainClass(null), CURTAIN_DURATION * 2 + 100);
    },
    [currentPage]
  );

  // Boutons Précédent / Suivant du navigateur
  useEffect(() => {
    const onPop = () => navigate(pathToId(window.location.pathname), { push: false });
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [navigate]);

  // Au premier chargement : applique le titre/description de la page d'arrivée
  useEffect(() => {
    applyMeta(initial);
    if (typeof window !== "undefined") {
      window.history.replaceState({ page: initial }, "", idToPath(initial));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { currentPage, displayedPage, pagePhase, curtainClass, navigate };
}
