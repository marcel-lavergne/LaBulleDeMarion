/* ─────────────────────────────────────────────
   Page — Contact
   Infos personnelles + formulaire (prénom, email, message)
   Envoi des mails via EmailJS (voir src/config/email.js)
───────────────────────────────────────────── */

import { useState } from "react";
import emailjs from "@emailjs/browser";
import Button from "../components/ui/Button.jsx";
import {
  CONTACT_EMAIL,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_CONFIGURED,
} from "../config/email.js";
import styles from "./Contact.module.css";

const INITIAL_FORM = { prenom: "", email: "", message: "" };

/* États possibles de l'envoi */
const STATUS = {
  IDLE:    "idle",
  SENDING: "sending",
  SENT:    "sent",
  ERROR:   "error",
};

export default function Contact() {
  const [form, setForm]     = useState(INITIAL_FORM);
  const [status, setStatus] = useState(STATUS.IDLE);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si les clés EmailJS ne sont pas encore renseignées, on prévient.
    if (!EMAILJS_CONFIGURED) {
      setStatus(STATUS.ERROR);
      return;
    }

    setStatus(STATUS.SENDING);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email:   CONTACT_EMAIL,   // destinataire (voir config/email.js)
          from_name:  form.prenom,
          from_email: form.email,
          reply_to:   form.email,
          message:    form.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setStatus(STATUS.SENT);
      setForm(INITIAL_FORM);
      setTimeout(() => setStatus(STATUS.IDLE), 5000);
    } catch (err) {
      console.error("Échec de l'envoi du message :", err);
      setStatus(STATUS.ERROR);
    }
  };

  const sending = status === STATUS.SENDING;

  return (
    <div>

      {/* ── En-tête ── */}
      <div className={styles.header}>
        <p className="reveal reveal--1 label-section" style={{ marginBottom: ".8rem" }}>
          Me contacter
        </p>
        <h1 className="reveal reveal--2 title-display" style={{ fontSize: "clamp(2.2rem,4vw,3.8rem)" }}>
          Prenons contact
        </h1>
        <p className="reveal reveal--3 body-light" style={{ marginTop: "1rem", maxWidth: 480 }}>
          N'hésitez pas à me contacter pour toute question sur les soins,
          les disponibilités ou pour en savoir plus sur mon approche.
        </p>
      </div>

      <div className={styles.layout}>

        {/* ── Infos personnelles ── */}
        <div className={styles.info}>

          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Téléphone</p>
            <a href="tel:0615930164" className={styles.infoValue}>
              06 15 93 01 64
            </a>
          </div>

          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Email</p>
            <a href="mailto:contact@labulledemarion.fr" className={styles.infoValue}>
              contact@labulledemarion.fr
            </a>
          </div>

          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Zone d'intervention</p>
            <p className={styles.infoValue}>À domicile — Essonne (91), Hauts-de-Seine (92), Val-de-Marne (94)</p>
            <p style={{ fontSize: ".82rem", marginTop: ".45rem", opacity: .8, fontWeight: 300, lineHeight: 1.6 }}>
              Dans un rayon de 15 km autour de Massy. Au-delà, un supplément
              kilométrique de 0,15 €/km s'applique.
            </p>
          </div>

          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Site</p>
            <p className={styles.infoValue}>labulledemarion.fr</p>
          </div>

          <div className={styles.infoNote}>
            <p>
              Je me déplace directement à votre domicile pour vous offrir
              un moment de douceur dans votre environnement.
            </p>
          </div>

        </div>

        {/* ── Formulaire ── */}
        <div className={styles.formCol}>

          <h2 className="title-display" style={{ fontSize: "1.7rem", marginBottom: "2rem" }}>
            Une question ?
          </h2>

          {status === STATUS.SENT ? (
            <div className={styles.success}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>
                Message envoyé ✓
              </p>
              <p style={{ fontSize: ".82rem", marginTop: ".5rem", opacity: .75, fontWeight: 300 }}>
                Je vous répondrai très bientôt.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              <div className="field" style={{ marginBottom: "1rem" }}>
                <label>Prénom *</label>
                <input
                  required
                  placeholder="Marie"
                  value={form.prenom}
                  onChange={set("prenom")}
                  disabled={sending}
                />
              </div>

              <div className="field" style={{ marginBottom: "1rem" }}>
                <label>Email *</label>
                <input
                  type="email"
                  required
                  placeholder="marie@exemple.fr"
                  value={form.email}
                  onChange={set("email")}
                  disabled={sending}
                />
              </div>

              <div className="field" style={{ marginBottom: "1.5rem" }}>
                <label>Votre message *</label>
                <textarea
                  required
                  placeholder="Posez-moi votre question…"
                  value={form.message}
                  onChange={set("message")}
                  disabled={sending}
                  style={{ minHeight: "140px" }}
                />
              </div>

              {status === STATUS.ERROR && (
                <p className={styles.error}>
                  {EMAILJS_CONFIGURED
                    ? "L'envoi a échoué. Réessayez ou écrivez directement à contact@labulledemarion.fr."
                    : "L'envoi de mails n'est pas encore configuré (clés EmailJS manquantes dans src/config/email.js)."}
                </p>
              )}

              <Button type="submit" variant="fill" fullWidth>
                {sending ? "Envoi en cours…" : "Envoyer"}
              </Button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
