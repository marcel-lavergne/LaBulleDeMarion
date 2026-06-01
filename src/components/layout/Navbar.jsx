/* ─────────────────────────────────────────────
   Navbar — La Bulle de Marion
   Structure exacte de la maquette charte :
   [Logo]   [À propos · Les soins · L'accompagnement · Témoignages]   [contact]
───────────────────────────────────────────── */

import Logo   from "../ui/Logo.jsx";
import Button from "../ui/Button.jsx";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { id: "apropos",       label: "À propos" },
  { id: "soins",         label: "Les soins" },
  { id: "accompagnement", label: "L'accompagnement" },
  { id: "temoignages",   label: "Témoignages" },
];

/**
 * @param {object} props
 * @param {string}   props.currentPage  – id de la page active
 * @param {function} props.navigate     – fn(pageId: string) => void
 * @param {boolean}  props.scrolled     – true dès que l'utilisateur a scrollé
 */
export default function Navbar({ currentPage, navigate, scrolled }) {
  return (
    <nav className={`${styles.navbar} ${scrolled ? styles["navbar--scrolled"] : ""}`}>

      {/* ── Logo ── */}
      <button
        className={styles.logo}
        onClick={() => navigate("home")}
        aria-label="Accueil — La Bulle de Marion"
      >
        <Logo size="md" />
      </button>

      {/* ── Liens centraux ── */}
      <ul className={styles.links} role="list">
        {NAV_LINKS.map(({ id, label }) => (
          <li key={id}>
            <button
              className={`${styles.link} ${currentPage === id ? styles["link--active"] : ""}`}
              onClick={() => navigate(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      {/* ── Bouton Contact ── */}
      <Button variant="fill" size="sm" onClick={() => navigate("contact")}>
        contact
      </Button>

    </nav>
  );
}
