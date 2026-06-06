import Button from "../components/ui/Button.jsx";
import { IconFlower, IconDrops, IconFeet } from "../components/ui/BrandIcons.jsx";
import styles from "./Apropos.module.css";
import aproposImg from "../assets/apropos.jpg";

const PILIERS = [
  { icon: <IconFeet  size={40} color="#faf3e9" />, title: "L'humain",     mots: ["Écoute","Présence","Bienveillance"], bg: "var(--color-terra)" },
  { icon: <IconDrops size={40} color="#faf3e9" />, title: "L'émotion",    mots: ["Douceur","Apaisement","Lien"],      bg: "var(--color-rouge)" },
  { icon: <IconFlower size={40} color="#faf3e9" />, title: "L'engagement", mots: ["Confiance","Sécurité","Accompagnement"], bg: "var(--color-rose)" },
];

export default function Apropos({ navigate }) {
  return (
    <div>
      <section className={styles.split}>
        <div className={styles.image}>
          <img
            src={aproposImg}
            alt="Marion tenant délicatement la tête d'un nouveau-né"
          />
        </div>
        <div className={styles.content}>
          <p className="reveal reveal--1 label-section" style={{ marginBottom: "1.2rem" }}>À propos</p>
          <h1 className="reveal reveal--2 title-display" style={{ fontSize: "clamp(2.2rem,3.2vw,3.4rem)", marginBottom: "2rem" }}>Marion Lefort</h1>
          {[
            "Je suis Marion Lefort, et j'ai travaillé durant 18 ans à l'hôpital Necker Enfants Malades en cardio-pédiatrique en tant qu'infirmière. J'ai accompagné avec rigueur, délicatesse et une grande implication les nourrissons, les enfants et leurs familles dans des moments d'une grande intensité émotionnelle.",
            "Cette expérience a façonné une approche du soin profondément humaine, où chaque détail compte et où l'attention portée à l'autre est essentielle.",
            "Aujourd'hui, j'ai choisi de poursuivre cette vocation sous une forme différente — en me tournant vers un accompagnement centré sur le bien-être pré et post-natal, ainsi que sur les bébés.",
            "J'ai sélectionné uniquement des produits 100% français, naturels, vegan et profondément éthiques pour le respect de votre peau, celle de votre bébé et de notre environnement.",
          ].map((p, i) => (
            <p key={i} className={`reveal reveal--${Math.min(i + 3, 5)} body-light`} style={{ marginBottom: "1rem", maxWidth: 460 }}>{p}</p>
          ))}
          <div className={styles.devises}>
            {["Prendre soin, avec exigence.", "Accueillir, avec délicatesse.", "Transmettre, avec cœur."].map(d => (
              <p key={d} className={styles.devise}>{d}</p>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.pillarsSection}>
        <p className="label-section" style={{ textAlign: "center", marginBottom: ".8rem" }}>Mon approche</p>
        <h2 className="title-display" style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)", textAlign: "center", marginBottom: "3rem" }}>Les trois piliers</h2>
        <div className={styles.pillarsGrid}>
          {PILIERS.map(p => (
            <div key={p.title} className={styles.pillarCard} style={{ background: p.bg }}>
              {p.icon}
              <p className={styles.pillarTitle}>{p.title}</p>
              {p.mots.map(m => <p key={m} className={styles.pillarMot}>{m}</p>)}
            </div>
          ))}
        </div>
      </section>

      <div style={{ textAlign: "center", padding: "3.5rem", background: "var(--color-lin)", display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Button variant="fill"    onClick={() => navigate("soins")}>Découvrir mes soins</Button>
        <Button variant="outline" onClick={() => navigate("contact")}>Me contacter</Button>
      </div>
    </div>
  );
}
