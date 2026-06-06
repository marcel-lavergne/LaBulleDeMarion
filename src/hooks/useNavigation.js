/* ─────────────────────────────────────────────
   useNavigation — La Bulle de Marion
   Gère la navigation SPA avec effet rideau :
   1. Le rideau terracotta descend
   2. La page change (invisible)
   3. Le rideau remonte
   4. La nouvelle page se révèle
   navigate(page, anchorId?) : anchorId facultatif pour défiler
   vers un élément précis de la page cible (ex. un soin).
───────────────────────────────────────────── */

import { useState, useCallback, useRef } from "react";

const CURTAIN_DURATION = 380; // ms — doit correspondre à --curtain-duration dans globals.css
const FADE_DELAY       = 80;  // ms entre la fin du rideau et le fadeIn du contenu

export function useNavigation(initialPage = "home") {
  const [currentPage,  setCurrentPage]  = useState(initialPage);
  const [displayedPage, setDisplayedPage] = useState(initialPage);
  const [pagePhase,    setPagePhase]    = useState("visible");   // "entering" | "visible"
  const [curtainClass, setCurtainClass] = useState(null);         // null | "in" | "out"

  const timers    = useRef([]);
  const anchorRef = useRef(null);   // id de l'élément vers lequel défiler après navigation

  /** Enregistre un timer et le stocke pour nettoyage éventuel */
  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
  };

  /** Annule tous les timers en cours */
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const navigate = useCallback(
    (targetPage, anchorId = null) => {
      if (targetPage === currentPage) return;

      anchorRef.current = anchorId;   // mémorise la cible d'ancrage (lue par App)

      clearTimers();

      // Étape 1 — le rideau descend
      setCurtainClass("in");

      // Étape 2 — contenu swappé pendant que le rideau couvre tout
      schedule(() => {
        setDisplayedPage(targetPage);
        setCurrentPage(targetPage);
        setPagePhase("entering");
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

  return {
    currentPage,
    displayedPage,
    pagePhase,
    curtainClass,
    navigate,
    anchorRef,
  };
}
