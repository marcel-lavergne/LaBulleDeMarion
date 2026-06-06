/* ─────────────────────────────────────────────
   App — La Bulle de Marion
   Orchestre : navigation, rideau, layout global
───────────────────────────────────────────── */

import { useRef, useEffect } from "react";

import { useNavigation } from "./hooks/useNavigation.js";
import { useScrolled }   from "./hooks/useScrolled.js";

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";

import Home           from "./pages/Home.jsx";
import Apropos        from "./pages/Apropos.jsx";
import Soins          from "./pages/Soins.jsx";
import Accompagnement from "./pages/Accompagnement.jsx";
import Temoignages    from "./pages/Temoignages.jsx";
import Contact        from "./pages/Contact.jsx";

import "./styles/globals.css";

/* Décalage pour l'ancrage = hauteur de la navbar (--navbar-height: 68px) + une marge */
const ANCHOR_OFFSET = 68 + 16;

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

  /* À chaque changement de page : on défile vers l'ancre demandée, sinon tout en haut */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const anchorId = anchorRef.current;
    if (anchorId) {
      anchorRef.current = null;
      // on attend que la nouvelle page soit rendue avant de mesurer
      requestAnimationFrame(() => {
        const target = document.getElementById(anchorId);
        if (target) {
          const delta = target.getBoundingClientRect().top - container.getBoundingClientRect().top;
          container.scrollTop += delta - ANCHOR_OFFSET;
        } else {
          container.scrollTop = 0;
        }
      });
    } else {
      container.scrollTop = 0;
    }
  }, [displayedPage]);

  const PageComponent = PAGE_MAP[displayedPage] ?? Home;

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
          <div className={wrapperClass} key={displayedPage}>
            <PageComponent navigate={navigate} />
          </div>
        </main>

        <Footer navigate={navigate} />
      </div>
    </>
  );
}
