/* ─────────────────────────────────────────────
   Page — Accueil
───────────────────────────────────────────── */

import Button from "../components/ui/Button.jsx";
import styles from "./Home.module.css";

import heroImg     from "../assets/hero-accueil.jpg";
import bandImg     from "../assets/band-prenatal.jpg";
import feuillage   from "../assets/feuillage-large.jpg";
import imgBain     from "../assets/soin-bain-therapeutique.jpg";
import imgMassage  from "../assets/featured-massage-bebe.jpg";
import imgRebozo   from "../assets/featured-rebozo.jpg";

const FEATURED_SOINS = [
  { img: imgBain,    label: "Bain thérapeutique", sub: "2h30 · 115€", page: "soins" },
  { img: imgMassage, label: "Massage bébé",        sub: "1h · 55€",    page: "soins" },
  { img: imgRebozo,  label: "Rituel Rebozo",       sub: "3h30 · 200€", page: "soins" },
];

export default function Home({ navigate }) {
  return (
    <div>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={`${styles.eyebrow} reveal reveal--1 label-section`}>
            Marion Lefort · Infirmière reconvertie
          </p>
          <h1 className={`${styles.heroTitle} reveal reveal--2 title-display`}>
            Un <span className={styles.heroAccent}>accompagnement</span>
            <br />tout en douceur
          </h1>
          <p className={`${styles.heroSubtitle} reveal reveal--3 body-light`}>
            J'accompagne les femmes et les jeunes parents avec douceur et bienveillance
            à travers des soins autour de la grossesse et des premiers mois de vie de bébé.
          </p>
          <div className={`${styles.heroActions} reveal reveal--4`}>
            <Button variant="fill"    onClick={() => navigate("soins")}>Découvrir les soins</Button>
            <Button variant="outline" onClick={() => navigate("contact")}>Prendre contact</Button>
          </div>
        </div>

        <div className={styles.heroImage}>
          <img src={heroImg} alt="Maman tenant son nouveau-né contre elle" />
          <div className={styles.heroBadge}>À domicile · Région parisienne</div>
        </div>
      </section>

      {/* ── Citation ── */}
      <div className={styles.citation} style={{ backgroundImage: `url(${feuillage})` }}>
        <p className={styles.citationText}>
          Après plusieurs années{" "}
          <span className={styles.citationAccent}>auprès des familles</span>,
          j'ai à cœur aujourd'hui d'offrir un accompagnement{" "}
          <span className={styles.citationAccent}>plus doux</span> et{" "}
          <span className={styles.citationAccent}>plus attentif</span>.
        </p>
      </div>

      {/* ── Soins en vedette ── */}
      <div className={styles.featuredGrid}>
        {FEATURED_SOINS.map((s, i) => (
          <button
            key={i}
            className={`${styles.featuredCard} lift`}
            onClick={() => navigate(s.page)}
          >
            <img className={styles.featuredImg} src={s.img} alt={s.label} loading="lazy" />
            <div className={styles.featuredOverlay} />
            <div className={styles.featuredContent}>
              <p className={styles.featuredName}>{s.label}</p>
              <p className={styles.featuredSub}>{s.sub}</p>
              <span className={styles.featuredCta}>découvrir →</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Bannière massage prénatal ── */}
      <div className={styles.prenatalBand}>
        <img src={bandImg} alt="Massage prénatal, mains posées sur le ventre" />
        <div className={styles.prenatalOverlay}>
          <h2 className={styles.prenatalTitle}>Massage prénatal</h2>
          <Button variant="ghost" onClick={() => navigate("contact")}>Réserver ce soin</Button>
        </div>
      </div>

    </div>
  );
}
