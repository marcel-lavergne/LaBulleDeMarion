import Button from "../components/ui/Button.jsx";
import styles from "./Accompagnement.module.css";
import accompagnementImg from "../assets/accompagnement.jpg";

export default function Accompagnement({ navigate }) {
  return (
    <div>
      <div className={styles.header}>
        <p className="reveal reveal--1 label-section" style={{ marginBottom: ".8rem" }}>À votre domicile</p>
        <h1 className="reveal reveal--2 title-display" style={{ fontSize: "clamp(2.2rem,4vw,3.8rem)", color: "var(--color-lin)" }}>
          L'accompagnement
        </h1>
        <p className="reveal reveal--3 body-light" style={{ marginTop: "1rem", color: "rgba(250,243,233,.65)", maxWidth: 520 }}>
          Un soin sur-mesure, dans votre environnement familier.
        </p>
      </div>

      <section className={styles.introSection}>
        <p className={styles.introText}>
          Je viens chez vous pour vous offrir une parenthèse de douceur. Chaque geste est mesuré, chaque présence est sincère, et chaque accompagnement est conçu sur-mesure, dans le respect absolu de votre histoire et de celle de votre enfant.
        </p>
        <p className={styles.introText}>
          Mon engagement reste inchangé : offrir un soin d'une grande qualité, dans l'écoute et la bienveillance, pour vous accompagner avec justesse dans ces moments précieux de vie.
        </p>
        <p className={styles.devise}>
          <em>Prendre soin, avec exigence. Accueillir, avec délicatesse. Transmettre, avec cœur.</em>
        </p>
      </section>

      <div className={styles.imageBand}>
        <img src={accompagnementImg} alt="Mains d'adulte tenant la petite main d'un bébé" loading="lazy" />
      </div>

      <section className={styles.valuesGrid}>
        {[
          { titre: "Sur-mesure", texte: "Chaque accompagnement est pensé en fonction de votre histoire, de vos besoins et de ceux de votre enfant." },
          { titre: "À domicile", texte: "Je me déplace en région parisienne pour que vous puissiez recevoir le soin dans votre propre espace, en toute sérénité." },
          { titre: "Bienveillance", texte: "Formée après 18 ans en soins intensifs pédiatriques, j'apporte une présence attentive et un geste professionnel." },
        ].map(({ titre, texte }) => (
          <div key={titre} className={styles.valueCard}>
            <h3 className={styles.valueTitle}>{titre}</h3>
            <p className={styles.valueText}>{texte}</p>
          </div>
        ))}
      </section>

      <div className={styles.cta}>
        <Button variant="fill" onClick={() => navigate("contact")}>Prendre rendez-vous</Button>
        <Button variant="outline" onClick={() => navigate("soins")}>Découvrir les soins</Button>
      </div>
    </div>
  );
}
