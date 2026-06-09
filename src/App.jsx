/* ─────────────────────────────────────────────
   App — La Bulle de Marion
   Orchestre : navigation, rideau, layout global
───────────────────────────────────────────── */

import { useRef, useEffect } from "react";

import { useNavigation } from "./hooks/useNavigation.js";
import { useScrolled }   from "./hooks/useScrolled.js";

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import Home           from "./pages/Home.jsx";
import Apropos        from "./pages/Apropos.jsx";
import Soins          from "./pages/Soins.jsx";
import Accompagnement from "./pages/Accompagnement.jsx";
import Temoignages    from "./pages/Temoignages.jsx";
import Contact        from "./pages/Contact.jsx";
import NotFound       from "./pages/NotFound.jsx";

import "./styles/globals.css";

/* Décalage de défilement pour ne pas masquer la cible derrière la navbar
   sticky (--navbar-height = 68px) + une légère respiration. */
const ANCHOR_OFFSET = 84;

/* Correspondance id → composant page */
const PAGE_MAP = {
  home:           Home,
  apropos:        Apropos,
  soins:          Soins,
  accompagnement: Accompagnement,
  temoignages:    Temoignages,
  contact:        Contact,
};

export default function App() {
  const { currentPage, displayedPage, pagePhase, curtainClass, navigate, anchorRef } =
    useNavigation("home");

  /* Référence sur le conteneur scrollable */
  const scrollRef = useRef(null);
  const scrolled  = useScrolled(scrollRef.current, 40);

  /* À chaque changement de page : on défile vers l'ancre demandée, sinon tout en haut.
     On attend que la page soit pleinement "visible" (transform posé) ET que les polices
     soient chargées, sinon la mesure de position est faussée et on tombe à côté. */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const anchorId = anchorRef.current;

    // Pas d'ancre → on remonte simplement en haut dès le swap de page
    if (!anchorId) {
      container.scrollTop = 0;
      return;
    }

    // Ancre demandée → on n'agit que lorsque la page est posée (transform à 0)
    if (pagePhase !== "visible") return;
    anchorRef.current = null;

    const scrollToAnchor = () => {
      const target = document.getElementById(anchorId);
      if (!target) {
        container.scrollTop = 0;
        return;
      }
      const delta =
        target.getBoundingClientRect().top - container.getBoundingClientRect().top;
      container.scrollTop += delta - ANCHOR_OFFSET;
    };

    // document.fonts.ready évite le décalage dû au chargement de la police ;
    // le double rAF garantit que le layout est stabilisé avant de mesurer.
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() =>
      requestAnimationFrame(() => requestAnimationFrame(scrollToAnchor))
    );
  }, [displayedPage, pagePhase]);

  /* Page inconnue → page 404 maison */
  const PageComponent = PAGE_MAP[displayedPage] ?? NotFound;

  /* Classe CSS du wrapper de page */
  const wrapperClass = [
    "page-wrapper",
    pagePhase === "entering" ? "page-wrapper--entering" : "",
    pagePhase === "visible"  ? "page-wrapper--visible"  : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* ── Rideau de transition ── */}
      {curtainClass && (
        <div
          className={`page-curtain page-curtain--${curtainClass}`}
          aria-hidden="true"
        />
      )}

      {/* ── Shell scrollable ── */}
      <div
        ref={scrollRef}
        style={{ height: "100vh", overflowY: "auto", position: "relative" }}
      >
        <Navbar
          currentPage={currentPage}
          navigate={navigate}
          scrolled={scrolled}
        />

        <main>
          {/* Filet de sécurité : si une page plante, on affiche l'écran de secours
              au lieu d'une page blanche. La clé réinitialise l'erreur au changement de page. */}
          <ErrorBoundary key={displayedPage} navigate={navigate}>
            <div className={wrapperClass} key={displayedPage}>
              <PageComponent navigate={navigate} anchor={anchorRef.current} />
            </div>
          </ErrorBoundary>
        </main>

        <Footer navigate={navigate} />
      </div>
    </>
  );
}
