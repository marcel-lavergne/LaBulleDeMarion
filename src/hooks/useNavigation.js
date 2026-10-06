import { useState, useCallback, useRef, useEffect } from "react";
import { SITE_URL, pathToId, idToPath, metaFor } from "../config/routes.js";
import { trackPage } from "../config/analytics.js";

const CURTAIN_DURATION = 380; // ms — doit correspondre à --curtain-duration dans globals.css
const FADE_DELAY       = 80;  // ms entre la fin du rideau et le fadeIn du contenu

function pageFromLocation() {
  return pathToId(window.location.pathname);
}

function buildUrl(page, anchor) {
  const path = idToPath(page);
  return anchor ? `${path}#${anchor}` : path;
}

function setAttr(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/* Titre, description et adresse canonique propres à la page affichée */
function applyMeta(page) {
  const meta = metaFor(page);
  const url  = SITE_URL + (meta.noindex ? "/" : meta.path);
  document.title = meta.title;
  setAttr('meta[name="description"]',         "content", meta.description);
  setAttr('link[rel="canonical"]',            "href",    url);
  setAttr('meta[property="og:title"]',        "content", meta.title);
  setAttr('meta[property="og:description"]',  "content", meta.description);
  setAttr('meta[property="og:url"]',          "content", url);
  setAttr('meta[name="twitter:title"]',       "content", meta.title);
  setAttr('meta[name="twitter:description"]', "content", meta.description);
  setAttr('meta[name="robots"]', "content", meta.noindex ? "noindex, follow" : "index, follow");
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

  useEffect(() => {
    // état initial posé sur la 1re entrée d'historique
       window.history.replaceState(
      { page: currentRef.current, anchor: null },
      "",
      window.location.pathname + window.location.search + window.location.hash
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
  useEffect(() => {
    applyMeta(currentPage);
    trackPage(metaFor(currentPage).title);
  }, [currentPage]);
  return { currentPage, displayedPage, pagePhase, curtainClass, navigate };
}
