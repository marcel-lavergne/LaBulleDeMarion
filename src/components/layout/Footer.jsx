/* ─────────────────────────────────────────────
   Footer — La Bulle de Marion
───────────────────────────────────────────── */

import Logo   from "../ui/Logo.jsx";
import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  { id: "home",          label: "Accueil" },
  { id: "apropos",       label: "À propos" },
  { id: "soins",         label: "Les soins" },
  { id: "accompagnement", label: "L'accompagnement" },
  { id: "temoignages",   label: "Témoignages" },
  { id: "contact",       label: "Contact" },
];

export default function Footer({ navigate }) {
  return (
    <footer className={styles.footer}>

      <button
        className={styles.logo}
        onClick={() => navigate("home")}
        aria-label="Retour à l'accueil"
      >
        <Logo size="sm" light />
      </button>

      <span className={styles.copyright}>
        © 2025 La Bulle de Marion · Tous droits réservés
      </span>

      <ul className={styles.links} role="list">
        {FOOTER_LINKS.map(({ id, label }) => (
          <li key={id}>
            <button className={styles.link} onClick={() => navigate(id)}>
              {label}
            </button>
          </li>
        ))}
      </ul>

    </footer>
  );
}
