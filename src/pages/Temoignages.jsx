import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { TEMOIGNAGES } from "../data/temoignages.js";
import Button from "../components/ui/Button.jsx";
import {
  CONTACT_EMAIL,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_CONFIGURED,
} from "../config/email.js";
import styles from "./Temoignages.module.css";
import feuillage from "../assets/feuillage-square.jpg";

const API = "/.netlify/functions/temoignages";

/* Initiale affichée dans la pastille, déduite automatiquement de l'auteur */
function initialeDe(auteur) {
  const ignore = new Set(["de", "du", "des", "d", "le", "la", "les", "et", "maman", "papa", "parents"]);
  const mots = (auteur || "")
    .replace(/['']/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((m) => !ignore.has(m.toLowerCase()));
  return (mots[0] || auteur || "?").charAt(0).toUpperCase();
}

const INITIAL_FORM = { author: "", detail: "", text: "" };
const STATUS = { IDLE: "idle", SENDING: "sending", SENT: "sent", ERROR: "error" };

export default function Temoignages({ navigate }) {
  /* Liste affichée : témoignages validés, chargés depuis le serveur.
     En attendant (ou en cas d'indisponibilité), on montre la liste de secours. */
  const [list, setList]     = useState(TEMOIGNAGES);
  const [showForm, setShow] = useState(false);
  const [form, setForm]     = useState(INITIAL_FORM);
  const [status, setStatus] = useState(STATUS.IDLE);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const sending = status === STATUS.SENDING;

  useEffect(() => {
    let actif = true;
    fetch(API)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => { if (actif && Array.isArray(data) && data.length) setList(data); })
      .catch(() => { /* on garde la liste de secours */ });
    return () => { actif = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(STATUS.SENDING);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("post failed");

      // Notification e-mail (optionnelle, sans blocage) pour t'avertir.
      if (EMAILJS_CONFIGURED) {
        emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email:   CONTACT_EMAIL,
            from_name:  form.author || "Témoignage",
            from_email: CONTACT_EMAIL,
            reply_to:   CONTACT_EMAIL,
            message:    `NOUVEAU TÉMOIGNAGE EN ATTENTE (à valider dans /admin)\n\nAuteur : ${form.author}\nSoin : ${form.detail || "—"}\n\n${form.text}`,
          },
          { publicKey: EMAILJS_PUBLIC_KEY }
        ).catch(() => { /* peu importe si la notif échoue */ });
      }

      setForm(INITIAL_FORM);
      setShow(false);
      setStatus(STATUS.SENT);
      setTimeout(() => setStatus(STATUS.IDLE), 8000);
    } catch (err) {
      console.error("Échec de l'envoi du témoignage :", err);
      setStatus(STATUS.ERROR);
    }
  };

  return (
    <div>
      <div className={styles.header} style={{ backgroundImage: `url(${feuillage})` }}>
        <p className="reveal reveal--1 label-section" style={{ marginBottom: ".8rem", position: "relative" }}>Ils me font confiance</p>
        <h1 className="reveal reveal--2 title-display" style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", position: "relative" }}>Témoignages</h1>
      </div>

      <div className={styles.section}>

        {/* ── Inviter à laisser un témoignage ── */}
        <div className={styles.lead}>
          {status === STATUS.SENT && (
            <p className={styles.thanks}>
              Merci ! Votre témoignage a bien été envoyé. Il sera publié après validation. ✓
            </p>
          )}
          {!showForm && (
            <Button variant="fill" onClick={() => { setShow(true); setStatus(STATUS.IDLE); }}>
              Laisser un témoignage
            </Button>
          )}
        </div>

        {/* ── Formulaire ── */}
        {showForm && (
          <form className={styles.formWrap} onSubmit={handleSubmit}>
            <div className="field" style={{ marginBottom: "1rem" }}>
              <label>Votre nom *</label>
              <input
                required
                placeholder="Maman de Léa"
                value={form.author}
                onChange={set("author")}
                disabled={sending}
              />
            </div>

            <div className="field" style={{ marginBottom: "1rem" }}>
              <label>Soin reçu</label>
              <input
                placeholder="Bain enveloppé · bébé de 3 semaines"
                value={form.detail}
                onChange={set("detail")}
                disabled={sending}
              />
            </div>

            <div className="field" style={{ marginBottom: "1.2rem" }}>
              <label>Votre témoignage *</label>
              <textarea
                required
                placeholder="Partagez votre expérience…"
                value={form.text}
                onChange={set("text")}
                disabled={sending}
                style={{ minHeight: "130px" }}
              />
            </div>

            {status === STATUS.ERROR && (
              <p className={styles.error}>
                L'envoi a échoué. Réessayez, ou écrivez à {CONTACT_EMAIL}.
              </p>
            )}

            <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
              <Button type="submit" variant="fill">
                {sending ? "Envoi…" : "Envoyer mon témoignage"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setShow(false); setStatus(STATUS.IDLE); }}>
                Annuler
              </Button>
            </div>
          </form>
        )}

        {/* ── Liste des témoignages ── */}
        <div className={styles.grid}>
          {list.map((t, i) => (
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
