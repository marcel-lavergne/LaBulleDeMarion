/* ─────────────────────────────────────────────
   Footer — La Bulle de Marion
───────────────────────────────────────────── */

import Logo   from "../ui/Logo.jsx";
import { idToPath } from "../../config/routes.js";
import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  { id: "home",           label: "Accueil" },
  { id: "apropos",        label: "À propos" },
  { id: "soins",          label: "Les soins" },
  { id: "accompagnement", label: "L'accompagnement" },
  { id: "temoignages",    label: "Témoignages" },
  { id: "contact",        label: "Contact" },
];

export default function Footer({ navigate }) {
  const handleNav = (e, id) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(id);
  };

  return (
    <footer className={styles.footer}>

      <a
        href={idToPath("home")}
        className={styles.logo}
        onClick={(e) => handleNav(e, "home")}
        aria-label="Retour à l'accueil"
      >
        <Logo size="sm" light />
      </a>

      <span className={styles.copyright}>
        © 2026 La Bulle de Marion · Tous droits réservés
      </span>

      <ul className={styles.links} role="list">
        {FOOTER_LINKS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={idToPath(id)}
              className={styles.link}
              onClick={(e) => handleNav(e, id)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

    </footer>
  );
}
