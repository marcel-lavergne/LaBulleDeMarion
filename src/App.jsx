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
  const { currentPage, displayedPage, pagePhase, curtainClass, navigate } =
    useNavigation("home");

  /* Référence sur le conteneur scrollable */
  const scrollRef = useRef(null);
  const scrolled  = useScrolled(scrollRef.current, 40);

  /* Le défilement vers une ancre est géré par useNavigation (scrollIntoView).
     Ici on se contente de remonter en haut quand on change de page SANS ancre. */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    if (!window.location.hash) container.scrollTop = 0;
  }, [displayedPage]);

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
              <PageComponent navigate={navigate} />
            </div>
          </ErrorBoundary>
        </main>

        <Footer navigate={navigate} />
      </div>
    </>
  );
}
