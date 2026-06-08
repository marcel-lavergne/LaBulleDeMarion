/* ─────────────────────────────────────────────
   useNavigation — La Bulle de Marion
   Navigation SPA avec effet rideau + gestion de
   l'URL et de l'historique du navigateur.
   (Le bouton Précédent/Suivant fonctionne enfin.)

   • navigate("soins")
        -> change de page
   • navigate("soins", "rituel-rebozo")
        -> change de page ET défile jusqu'à
           l'élément id="rituel-rebozo"
───────────────────────────────────────────── */

import { useState, useCallback, useRef, useEffect } from "react";

const CURTAIN_DURATION = 380; // ms — doit correspondre à --curtain-duration dans globals.css
const FADE_DELAY       = 80;  // ms entre la fin du rideau et le fadeIn du contenu

/* Correspondance page <-> URL */
const PAGE_TO_PATH = {
  home:        "/",
  apropos:     "/apropos",
  soins:       "/soins",
  packs:       "/packs",
  temoignages: "/temoignages",
  contact:     "/contact",
};
const PATH_TO_PAGE = Object.fromEntries(
  Object.entries(PAGE_TO_PATH).map(([page, path]) => [path, page])
);

/* Quelle page d'après l'URL courante (rechargement / lien direct) */
function pageFromLocation() {
  return PATH_TO_PAGE[window.location.pathname] || "home";
}

/* Construit l'URL d'une page (+ ancre éventuelle) */
function buildUrl(page, anchor) {
  const path = PAGE_TO_PATH[page] || "/";
  return anchor ? `${path}#${anchor}` : path;
}

export function useNavigation(initialPage) {
  // Si App ne passe rien, on déduit la page de départ depuis l'URL
  const startPage = initialPage || pageFromLocation();

  const [currentPage,   setCurrentPage]   = useState(startPage);
  const [displayedPage, setDisplayedPage] = useState(startPage);
  const [pagePhase,     setPagePhase]     = useState("visible");  // "entering" | "visible"
  const [curtainClass,  setCurtainClass]  = useState(null);        // null | "in" | "out"

  const timers        = useRef([]);
  const pendingAnchor = useRef(null);
  const currentRef    = useRef(startPage); // évite les fermetures périmées dans popstate

  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
  };
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const scrollToAnchor = (anchor) => {
    if (!anchor) return;
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* Cœur de la navigation.
     push = true  -> on ajoute une entrée d'historique (clic normal)
     push = false -> on NE ré-empile PAS (déclenché par le bouton retour) */
  const goTo = useCallback((targetPage, { anchor = null, push = true } = {}) => {
    // Déjà sur la page -> on se contente de défiler vers l'ancre
    if (targetPage === currentRef.current) {
      scrollToAnchor(anchor);
      return;
    }

    clearTimers();
    pendingAnchor.current = anchor;
    currentRef.current = targetPage;

    // 1 — le rideau descend
    setCurtainClass("in");

    // 2 — swap du contenu sous le rideau + mise à jour de l'URL
    schedule(() => {
      setDisplayedPage(targetPage);
      setCurrentPage(targetPage);
      setPagePhase("entering");

      if (push) {
        window.history.pushState(
          { page: targetPage, anchor },
          "",
          buildUrl(targetPage, anchor)
        );
      }
    }, CURTAIN_DURATION);

    // 3 — le rideau remonte
    schedule(() => setCurtainClass("out"), CURTAIN_DURATION + 40);

    // 4 — la page se révèle puis on défile vers l'ancre s'il y en a une
    schedule(() => {
      setPagePhase("visible");
      scrollToAnchor(pendingAnchor.current);
      pendingAnchor.current = null;
    }, CURTAIN_DURATION + FADE_DELAY + 60);

    // 5 — nettoyage de la classe rideau
    schedule(() => setCurtainClass(null), CURTAIN_DURATION * 2 + 100);
  }, []);

  /* API publique : navigate("soins") ou navigate("soins", "mon-ancre") */
  const navigate = useCallback(
    (targetPage, anchor = null) => goTo(targetPage, { anchor, push: true }),
    [goTo]
  );

  /* Branche le bouton Précédent / Suivant du navigateur */
  useEffect(() => {
    // état initial posé sur la 1re entrée d'historique
    window.history.replaceState(
      { page: currentRef.current, anchor: null },
      "",
      buildUrl(currentRef.current)
    );

    const onPopState = (e) => {
      const targetPage = e.state?.page || pageFromLocation();
      const anchor     = e.state?.anchor || null;
      goTo(targetPage, { anchor, push: false }); // push:false sinon boucle infinie
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { currentPage, displayedPage, pagePhase, curtainClass, navigate };
}
