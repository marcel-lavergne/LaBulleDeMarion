/* ─────────────────────────────────────────────
   Navbar — La Bulle de Marion
   Desktop : [Logo]  [liens]  [contact]
   Mobile  : [Logo]  [burger] + menu déroulant
   Les liens sont de vrais <a href> (référencement + nouvel onglet).
───────────────────────────────────────────── */

import { useState } from "react";

import Logo   from "../ui/Logo.jsx";
import Button from "../ui/Button.jsx";
import { idToPath } from "../../config/routes.js";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { id: "home",           label: "Accueil" },
  { id: "apropos",        label: "À propos" },
  { id: "soins",          label: "Les soins" },
  { id: "accompagnement", label: "L'accompagnement" },
  { id: "temoignages",    label: "Témoignages" },
];

export default function Navbar({ currentPage, navigate, scrolled }) {
  const [open, setOpen] = useState(false);

  /* Navigue puis referme le menu mobile */
  const go = (id) => {
    navigate(id);
    setOpen(false);
  };

  /* Clic sur un lien : on garde l'animation, mais on laisse le navigateur
     gérer ctrl/cmd-clic (ouverture dans un nouvel onglet). */
  const handleNav = (e, id) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(id);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles["navbar--scrolled"] : ""}`}>

      {/* ── Logo ── */}
      <a
        href={idToPath("home")}
        className={styles.logo}
        onClick={(e) => handleNav(e, "home")}
        aria-label="Accueil — La Bulle de Marion"
      >
        <Logo size="md" />
      </a>

      {/* ── Liens centraux (desktop) ── */}
      <ul className={styles.links} role="list">
        {NAV_LINKS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={idToPath(id)}
              className={`${styles.link} ${currentPage === id ? styles["link--active"] : ""}`}
              onClick={(e) => handleNav(e, id)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* ── Bouton Contact (desktop) ── */}
      <div className={styles.contactDesktop}>
        <Button variant="fill" size="sm" onClick={() => go("contact")}>
          contact
        </Button>
      </div>

      {/* ── Burger (mobile) ── */}
      <button
        className={`${styles.burger} ${open ? styles["burger--open"] : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
      >
        <span></span><span></span><span></span>
      </button>

      {/* ── Menu déroulant (mobile) ── */}
      <div className={`${styles.drawer} ${open ? styles["drawer--open"] : ""}`}>
        {NAV_LINKS.map(({ id, label }) => (
          <a
            key={id}
            href={idToPath(id)}
            className={`${styles.drawerLink} ${currentPage === id ? styles["drawerLink--active"] : ""}`}
            onClick={(e) => handleNav(e, id)}
          >
            {label}
          </a>
        ))}
        <a
          href={idToPath("contact")}
          className={`${styles.drawerLink} ${currentPage === "contact" ? styles["drawerLink--active"] : ""}`}
          onClick={(e) => handleNav(e, "contact")}
        >
          Contact
        </a>
      </div>

    </nav>
  );
}
