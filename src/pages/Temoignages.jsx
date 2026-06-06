import { TEMOIGNAGES } from "../data/temoignages.js";
import Button from "../components/ui/Button.jsx";
import styles from "./Temoignages.module.css";
import feuillage from "../assets/feuillage-square.jpg";

/* Initiale affichée dans la pastille, déduite automatiquement de l'auteur
   (on ignore les mots de liaison : "Maman de Loely" -> L, "Papa d'Andréa" -> A) */
function initialeDe(auteur) {
  const ignore = new Set(["de", "du", "des", "d", "le", "la", "les", "et", "maman", "papa", "parents"]);
  const mots = auteur
    .replace(/['']/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((m) => !ignore.has(m.toLowerCase()));
  return (mots[0] || auteur).charAt(0).toUpperCase();
}

export default function Temoignages({ navigate }) {
  return (
    <div>
      <div className={styles.header} style={{ backgroundImage: `url(${feuillage})` }}>
        <p className="reveal reveal--1 label-section" style={{ marginBottom: ".8rem", position: "relative" }}>Ils me font confiance</p>
        <h1 className="reveal reveal--2 title-display" style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", position: "relative" }}>Témoignages</h1>
      </div>

      <div className={styles.section}>
        <div className={styles.grid}>
          {TEMOIGNAGES.map((t, i) => (
            <div key={t.id} className={`reveal reveal--${Math.min(i + 3, 5)} ${styles.card}`}>
              <div className={styles.head}>
                <div className={styles.badge}>{initialeDe(t.author)}</div>
                <div>
                  <div className={styles.name}>{t.author}</div>
                  <div className={styles.detail}>{t.detail}</div>
                </div>
              </div>
              <p className={styles.text}>{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "3.5rem", background: "var(--color-cream)" }}>
        <Button variant="fill" onClick={() => navigate("contact")}>Prendre rendez-vous</Button>
      </div>
    </div>
  );
}
