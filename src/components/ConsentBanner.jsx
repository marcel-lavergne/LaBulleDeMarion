/* ─────────────────────────────────────────────
   Bandeau de consentement — mesure d'audience
   N'apparaît que si un ID GA4 est renseigné et que
   le visiteur n'a pas encore fait son choix.
───────────────────────────────────────────── */

import { useState, useEffect } from "react";

import { GA_ID, getConsent, setConsent } from "../config/analytics.js";
import styles from "./ConsentBanner.module.css";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (GA_ID && !getConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const choose = (value) => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div className={styles.banner} role="dialog" aria-label="Mesure d'audience">
      <p className={styles.text}>
        Ce site utilise Google Analytics pour mesurer sa fréquentation.
        Aucun suivi n'est activé sans votre accord.
      </p>
      <div className={styles.actions}>
        <button className={styles.refuse} onClick={() => choose("no")}>
          Refuser
        </button>
        <button className={styles.accept} onClick={() => choose("yes")}>
          Accepter
        </button>
      </div>
    </div>
  );
}
