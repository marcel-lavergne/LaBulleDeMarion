/* ─────────────────────────────────────────────
   Page — Accueil
───────────────────────────────────────────── */

import Button from "../components/ui/Button.jsx";
import styles from "./Home.module.css";
import { IconDrops, IconFeet, IconFlower, IconClover } from "../components/ui/BrandIcons.jsx";
import { SOINS } from "../data/soins.js";
import heroImg   from "../assets/hero-accueil.jpg";
import bandImg   from "../assets/band-prenatal.jpg";
import feuillage from "../assets/feuillage-large.jpg";

/* Soins mis en avant : reliés à un soin par son id.
   L'image, le prix et la durée sont tous récupérés depuis data/soins.js
   → les photos restent automatiquement identiques à la page Soins.
   Au clic, on défile jusqu'au soin correspondant. */
const FEATURED_SOINS = [
  { id: "bain-therapeutique",          label: "Bain thérapeutique" },
  { id: "massage-bebe-accompagnement", label: "Massage bébé" },
  { id: "rebozo",                      label: "Rituel Rebozo" },
];

export default function Home({ navigate }) {
  return (
    <div>

  {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          {/* Formes décoratives terracotta */}
          <div className={styles.blobTop}>
            <IconClover size={56} color="var(--color-terra)" />
          </div>
          <div className={styles.blobBottom}>
            <IconClover size={44} color="var(--color-terra)" />
          </div>
          <img
            src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=900&q=80&fit=crop"
            alt="Mains tenant délicatement les pieds d'un bébé"
          />
        </div>

        <div className={styles.heroText}>
          <h1 className={`${styles.heroTitle} reveal reveal--2 title-display`}>
            Un <span className={styles.heroAccent}>accompagnement</span>
            <br />tout en douceur
          </h1>
          <p className={`${styles.heroSubtitle} reveal reveal--3 body-light`}>
            J'accompagne les femmes et les jeunes parents avec douceur et bienveillance
            à travers des soins autour de la grossesse et des premiers mois de vie de bébé.
            Chaque accompagnement est pensé comme un moment de pause, de réconfort et de
            connexion, dans un cadre rassurant et apaisant.
          </p>
          <p className={`${styles.heroSubtitle} reveal reveal--3 body-light`}>
            Mon approche s'appuie sur l'écoute, la présence et le respect du rythme de
            chacun, afin de créer un espace où parents et bébés peuvent se détendre, se
            retrouver et se sentir en confiance.
          </p>
          <div className={`${styles.heroActions} reveal reveal--4`}>
            <Button variant="fill" onClick={() => navigate("soins")}>Découvrez mes soins</Button>
          </div>
        </div>
      </section>

      {/* ── Citation ── */}
      <div className={styles.citation} style={{ backgroundImage: `url(${feuillage})` }}>
        <p className={styles.citationText}>
          Après plusieurs années{" "} <span className={styles.citationAccent}>auprès des familles</span> en tant qu'infirmière, 
          <span className={styles.citationAccent}>{" "}j'ai à coeur{" "}</span>
           aujourd'hui d'offrir un accompagnement{" "}
          <span className={styles.citationAccent}>plus doux</span> et{" "}
          <span className={styles.citationAccent}>plus attentif</span>.
        </p>
      </div>

      {/* ── Soins en vedette ── */}
      <div className={styles.featuredGrid}>
        {FEATURED_SOINS.map((f) => {
          const soin = SOINS.find((s) => s.id === f.id);
          if (!soin) return null;
          const sub = `${soin.duration} · ${soin.price}`;
          return (
            <button
              key={f.id}
              className={`${styles.featuredCard} lift`}
              onClick={() => navigate("soins", f.id)}
            >
              <img className={styles.featuredImg} src={soin.image} alt={f.label} loading="lazy" />
              <div className={styles.featuredOverlay} />
              <div className={styles.featuredContent}>
                <p className={styles.featuredName}>{f.label}</p>
                <p className={styles.featuredSub}>{sub}</p>
                <span className={styles.featuredCta}>découvrir →</span>
              </div>
            </button>
          );
        })}
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
