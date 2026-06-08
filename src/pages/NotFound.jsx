import styles from "./NotFound.module.css";

export default function NotFound({ navigate }) {
  return (
    <div className={styles.wrap}>
      <p className={styles.code}>404</p>
      <h1 className={`title-display ${styles.title}`}>Cette page s'est envolée</h1>
      <p className={`body-light ${styles.text}`}>
        La page que vous cherchez n'existe pas ou a été déplacée.
        Revenons ensemble à l'accueil.
      </p>
      <button className={styles.button} onClick={() => navigate && navigate("home")}>
        Retour à l'accueil
      </button>
    </div>
  );
}
