import { TEMOIGNAGES } from "../data/temoignages.js";
import Button from "../components/ui/Button.jsx";
import styles from "./Temoignages.module.css";
import feuillage from "../assets/feuillage-square.jpg";

export default function Temoignages({ navigate }) {
  return (
    <div>
      <div className={styles.header} style={{ backgroundImage: `url(${feuillage})` }}>
        <p className="reveal reveal--1 label-section" style={{ marginBottom: ".8rem", position: "relative" }}>Ils me font confiance</p>
        <h1 className="reveal reveal--2 title-display" style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", position: "relative" }}>Témoignages</h1>
      </div>

      <div className={styles.grid}>
        {TEMOIGNAGES.map((t, i) => (
          <div key={t.id} className={`reveal reveal--${i + 3} ${styles.card}`}>
            <p className={styles.quote}>"</p>
            <p className={styles.text}>{t.text}</p>
            <div className={styles.author}>
              <p className={styles.authorName}>{t.author}</p>
              <p className={styles.authorDetail}>{t.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "3.5rem", background: "var(--color-cream)" }}>
        <Button variant="fill" onClick={() => navigate("contact")}>Prendre contact</Button>
      </div>
    </div>
  );
}
