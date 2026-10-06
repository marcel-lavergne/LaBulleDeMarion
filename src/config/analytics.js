/* ─────────────────────────────────────────────
   Mesure d'audience — Google Analytics 4
   1. Colle ton ID de mesure ci-dessous (format G-XXXXXXXXXX).
   2. Tant qu'il est vide : aucun bandeau, aucun suivi.
   Google n'est chargé QU'APRÈS acceptation du visiteur.
───────────────────────────────────────────── */

export const GA_ID = "GTM-WQCL479C";

const KEY = "lbm-consent"; // "yes" | "no"
let loaded = false;

export function getConsent() {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setConsent(value) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    /* navigation privée : le choix vaut pour la visite en cours */
  }
  if (value === "yes") loadAnalytics();
}

function loadAnalytics() {
  if (loaded || !GA_ID) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  // send_page_view: false → les pages vues sont envoyées par trackPage()
  window.gtag("config", GA_ID, { send_page_view: false });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  trackPage(document.title);
}

/* Appelé à chaque changement de page (useNavigation) */
export function trackPage(title) {
  if (!GA_ID || typeof window === "undefined") return;
  if (!loaded) {
    if (getConsent() === "yes") loadAnalytics(); // enverra la page courante
    return;
  }
  window.gtag("event", "page_view", {
    page_title: title,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
}
