import { useState } from "react";
import { SOINS } from "../data/soins.js";
import { PACKS } from "../data/packs.js";
import { IconFlower, IconDrops, IconClover, IconFeet } from "../components/ui/BrandIcons.jsx";
import Button from "../components/ui/Button.jsx";
import styles from "./Soins.module.css";

const ICON_MAP = {
  flower: IconFlower, drops: IconDrops, clover: IconClover, feet: IconFeet,
};
const COLOR_MAP = {
  terra: "var(--color-terra)", rose: "var(--color-rose)", rouge: "var(--color-rouge)",
};

const TABS = ["soins", "packs", "cadeaux"];
const TAB_LABELS = { soins: "Les soins", packs: "Packs", cadeaux: "Cartes cadeaux" };

export default function Soins({ navigate }) {
  const [openId, setOpenId] = useState(null);
  const [activeTab, setActiveTab] = useState("soins");
  const toggle = (id) => setOpenId(prev => prev === id ? null : id);

  return (
    <div>
      <div className={styles.header}>
        <p className="reveal reveal--1 label-section" style={{ marginBottom: ".8rem" }}>Prestations</p>
        <h1 className="reveal reveal--2 title-display" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>Les soins</h1>
      </div>

      <nav className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles["tab--active"] : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </nav>

      {activeTab === "soins" && (
        <>
          <p className={styles.hint}>Cliquez sur un soin pour en savoir plus</p>
          <div className={styles.grid}>
            {SOINS.map((soin) => {
              const IconComp = ICON_MAP[soin.icon] ?? IconFlower;
              const isOpen   = openId === soin.id;
              return (
                <div key={soin.id} id={soin.id} className={`${styles.card} ${isOpen ? styles["card--open"] : ""}`} onClick={() => toggle(soin.id)}>
                  <div className={styles.cardMedia}>
                    <img className={styles.cardImage} src={soin.image} alt={soin.name} loading="lazy" />
                    <span className={styles.iconBadge} style={{ background: COLOR_MAP[soin.color] }}>
                      <IconComp size={26} color="#faf3e9" />
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardName}>{soin.name}</h3>
                      <span className={styles.cardPrice}>{soin.price}</span>
                    </div>
                    <p className={styles.cardMeta}>{soin.duration} · {soin.cible}</p>
                    <div className={styles.accordion} style={{ maxHeight: isOpen ? "500px" : "0" }}>
                      <p className={styles.desc}>{soin.description}</p>
                      <div className={styles.tags}>
                        {soin.apporte.map(a => <span key={a} className={styles.tag}>{a}</span>)}
                      </div>
                      {soin.contrindications && (
                        <p className={styles.ci}>⚠ Contre-indications : {soin.contrindications}</p>
                      )}
                    </div>
                    <p className={styles.toggle}>{isOpen ? "fermer ↑" : "en savoir plus ↓"}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.cta}>
            <Button variant="fill" onClick={() => navigate("contact")}>Prendre rendez-vous</Button>
          </div>
        </>
      )}

      {activeTab === "packs" && (
        <>
          <div className={styles.packsIntro}>
            <p className="body-light">Économisez en combinant deux soins — composez votre accompagnement idéal.</p>
          </div>
          <div className={styles.packsGrid}>
            {PACKS.map(pack => (
              <div key={pack.id} className={`${styles.packCard} lift`}>
                <p className={styles.packName}>{pack.name}</p>
                <div className={styles.packPricing}>
                  <span className={styles.packPrice}>{pack.price}</span>
                  <span className={styles.packOriginal}>au lieu de {pack.originalPrice}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.cta}>
            <Button variant="fill" onClick={() => navigate("contact")}>Réserver un pack</Button>
          </div>
        </>
      )}

      {activeTab === "cadeaux" && (
        <div className={styles.cadeauSection}>
          <IconClover size={52} color="var(--color-terra)" />
          <h2 className="title-display" style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)", margin: "1.5rem 0 1rem" }}>Cartes cadeaux</h2>
          <p className="body-light" style={{ maxWidth: 480, margin: "0 auto 2rem", textAlign: "center" }}>
            Disponibles pour tous les soins et packs. Idéales pour une naissance, une baby shower ou une fête des mères.
          </p>
          <Button variant="fill" onClick={() => navigate("contact")}>Demander une carte cadeau</Button>
        </div>
      )}
    </div>
  );
}
