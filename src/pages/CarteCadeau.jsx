/* ─────────────────────────────────────────────
   Page — Carte cadeau
   L'acheteur choisit un soin / un pack ou un montant libre,
   remplit les infos de la carte, puis part payer chez Stripe.
   Règles (montants, validité…) : src/config/cartesCadeaux.js
───────────────────────────────────────────── */

import { useState, useEffect } from "react";
import Button from "../components/ui/Button.jsx";
import { SOINS } from "../data/soins.js";
import { PACKS } from "../data/packs.js";
import {
  MONTANT_MIN,
  MONTANT_MAX,
  MONTANTS_RAPIDES,
  VALIDITE_MOIS,
  MESSAGE_MAX,
  prixEnNombre,
} from "../config/cartesCadeaux.js";
import styles from "./CarteCadeau.module.css";

const INITIAL_FORM = {
  type: "soin",              // "soin" (soin ou pack) | "montant" (montant libre)
  offre: "",                 // id du soin ou du pack choisi
  montant: "",               // montant libre en euros
  acheteurNom: "",
  acheteurEmail: "",
  beneficiaireNom: "",
  message: "",
  destinataire: "acheteur",  // qui reçoit la carte : "acheteur" | "beneficiaire"
  beneficiaireEmail: "",
  cgv: false,
};

/* Liste des soins proposés à l'achat : un soin avec plusieurs formules
   (ex. Rituel Rebozo seul / à 4 mains) donne une ligne par formule. */
const OFFRES_SOINS = SOINS.flatMap((s) =>
  s.formules
    ? s.formules.map((f) => ({ ...s, id: f.id, name: `${s.name} — ${f.nom}`, price: f.price }))
    : [s]
);

/* Retrouve un soin ou un pack à partir de son id */
function trouverOffre(id) {
  return OFFRES_SOINS.find((s) => s.id === id) ?? PACKS.find((p) => p.id === id) ?? null;
}

export default function CarteCadeau() {
  const [form, setForm]       = useState(INITIAL_FORM);
  const [erreur, setErreur]   = useState("");
  const [envoi, setEnvoi]     = useState(false);
  const [retour, setRetour]   = useState(null); // "ok" | "annule" (retour de Stripe)

  /* Au retour de Stripe, l'adresse contient ?paiement=ok ou ?paiement=annule */
  useEffect(() => {
    const statut = new URLSearchParams(window.location.search).get("paiement");
    if (statut === "ok" || statut === "annule") setRetour(statut);
  }, []);

  /* Met à jour un champ du formulaire (texte ou case à cocher) */
  const set = (cle) => (e) => {
    const valeur = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [cle]: valeur }));
  };

  /* Montant affiché dans le récapitulatif */
  const offre = trouverOffre(form.offre);
  const total =
    form.type === "soin"
      ? offre ? prixEnNombre(offre.price) : 0
      : parseInt(form.montant, 10) || 0;

  /* Vérifications avant de partir payer */
  function verifier() {
    if (form.type === "soin" && !offre) return "Choisissez un soin ou un pack.";
    if (form.type === "montant") {
      const m = Number(form.montant);
      if (!Number.isInteger(m) || m < MONTANT_MIN || m > MONTANT_MAX) {
        return `Le montant doit être un nombre entier entre ${MONTANT_MIN} € et ${MONTANT_MAX} €.`;
      }
    }
    if (form.destinataire === "beneficiaire" && !form.beneficiaireEmail) {
      return "Indiquez l'adresse e-mail du bénéficiaire.";
    }
    if (!form.cgv) return "Merci d'accepter les conditions d'utilisation de la carte.";
    return "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const probleme = verifier();
    if (probleme) {
      setErreur(probleme);
      return;
    }
    setErreur("");
    setEnvoi(true);

    try {
      /* La fonction serveur recalcule le prix elle-même : on n'envoie
         que le CHOIX (id du soin ou montant), jamais un prix à payer. */
      const reponse = await fetch("/.netlify/functions/creer-paiement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await reponse.json();
      if (!reponse.ok || !data.url) throw new Error(data.erreur || "Réponse inattendue");

      window.location.href = data.url; // direction la page de paiement Stripe
    } catch (err) {
      console.error("Échec de la création du paiement :", err);
      setErreur("Le paiement n'a pas pu démarrer. Réessayez dans un instant ou contactez-moi.");
      setEnvoi(false);
    }
  };

  return (
    <div>

      {/* ── En-tête ── */}
      <div className={styles.header}>
        <p className="reveal reveal--1 label-section" style={{ marginBottom: ".8rem" }}>
          Offrir
        </p>
        <h1 className="reveal reveal--2 title-display" style={{ fontSize: "clamp(2.2rem,4vw,3.8rem)" }}>
          Carte cadeau
        </h1>
        <p className="reveal reveal--3 body-light" style={{ marginTop: "1rem", maxWidth: 520 }}>
          Offrez une parenthèse de douceur : un soin, un pack ou le montant de votre choix.
          La carte est envoyée par e-mail juste après le paiement, prête à être imprimée ou transférée.
        </p>
      </div>

      {/* ── Messages de retour de paiement ── */}
      {retour === "ok" && (
        <div className={styles.bandeauOk}>
          <p className={styles.bandeauTitre}>Merci pour votre commande ✓</p>
          <p>La carte cadeau arrive par e-mail dans quelques minutes. Pensez à vérifier les spams.</p>
        </div>
      )}
      {retour === "annule" && (
        <div className={styles.bandeauAnnule}>
          <p>Le paiement a été annulé, rien n'a été débité. Vous pouvez recommencer ci-dessous.</p>
        </div>
      )}

      <div className={styles.layout}>

        {/* ── Formulaire ── */}
        <form className={styles.formCol} onSubmit={handleSubmit}>

          {/* 1. Ce qu'on offre */}
          <h2 className={styles.etape}>1. Que souhaitez-vous offrir ?</h2>

          <div className={styles.choix}>
            <label className={`${styles.choixItem} ${form.type === "soin" ? styles.choixActif : ""}`}>
              <input type="radio" name="type" value="soin" checked={form.type === "soin"} onChange={set("type")} />
              Un soin ou un pack
            </label>
            <label className={`${styles.choixItem} ${form.type === "montant" ? styles.choixActif : ""}`}>
              <input type="radio" name="type" value="montant" checked={form.type === "montant"} onChange={set("type")} />
              Un montant libre
            </label>
          </div>

          {form.type === "soin" ? (
            <div className="field" style={{ marginBottom: "2rem" }}>
              <label>Soin ou pack *</label>
              <select value={form.offre} onChange={set("offre")} disabled={envoi}>
                <option value="">— Choisir —</option>
                <optgroup label="Soins">
                  {OFFRES_SOINS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — {s.price}</option>
                  ))}
                </optgroup>
                <optgroup label="Packs">
                  {PACKS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — {p.price}</option>
                  ))}
                </optgroup>
              </select>
              {offre?.lieu && <p className={styles.aide}>📍 {offre.lieu}</p>}
            </div>
          ) : (
            <div className="field" style={{ marginBottom: "2rem" }}>
              <label>Montant (de {MONTANT_MIN} € à {MONTANT_MAX} €) *</label>
              <div className={styles.rapides}>
                {MONTANTS_RAPIDES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`${styles.rapide} ${Number(form.montant) === m ? styles.rapideActif : ""}`}
                    onClick={() => setForm((prev) => ({ ...prev, montant: String(m) }))}
                  >
                    {m} €
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={MONTANT_MIN}
                max={MONTANT_MAX}
                step="1"
                inputMode="numeric"
                placeholder="Autre montant"
                value={form.montant}
                onChange={set("montant")}
                disabled={envoi}
              />
            </div>
          )}

          {/* 2. Ce qui sera écrit sur la carte */}
          <h2 className={styles.etape}>2. La carte</h2>

          <div className="field" style={{ marginBottom: "1rem" }}>
            <label>Offert à (prénom et nom du bénéficiaire) *</label>
            <input required placeholder="Camille Martin" value={form.beneficiaireNom} onChange={set("beneficiaireNom")} disabled={envoi} />
          </div>

          <div className="field" style={{ marginBottom: "1rem" }}>
            <label>De la part de *</label>
            <input required placeholder="Marie" value={form.acheteurNom} onChange={set("acheteurNom")} disabled={envoi} />
          </div>

          <div className="field" style={{ marginBottom: "2rem" }}>
            <label>Petit mot (facultatif)</label>
            <textarea
              maxLength={MESSAGE_MAX}
              placeholder="Pour prendre soin de toi…"
              value={form.message}
              onChange={set("message")}
              disabled={envoi}
            />
            <p className={styles.aide}>{form.message.length} / {MESSAGE_MAX} caractères</p>
          </div>

          {/* 3. L'envoi */}
          <h2 className={styles.etape}>3. L'envoi</h2>

          <div className="field" style={{ marginBottom: "1rem" }}>
            <label>Votre e-mail *</label>
            <input type="email" required placeholder="marie@exemple.fr" value={form.acheteurEmail} onChange={set("acheteurEmail")} disabled={envoi} />
          </div>

          <div className={styles.choix}>
            <label className={`${styles.choixItem} ${form.destinataire === "acheteur" ? styles.choixActif : ""}`}>
              <input type="radio" name="destinataire" value="acheteur" checked={form.destinataire === "acheteur"} onChange={set("destinataire")} />
              Je reçois la carte
            </label>
            <label className={`${styles.choixItem} ${form.destinataire === "beneficiaire" ? styles.choixActif : ""}`}>
              <input type="radio" name="destinataire" value="beneficiaire" checked={form.destinataire === "beneficiaire"} onChange={set("destinataire")} />
              Envoyer au bénéficiaire
            </label>
          </div>

          {form.destinataire === "beneficiaire" && (
            <div className="field" style={{ marginBottom: "1rem" }}>
              <label>E-mail du bénéficiaire *</label>
              <input type="email" placeholder="camille@exemple.fr" value={form.beneficiaireEmail} onChange={set("beneficiaireEmail")} disabled={envoi} />
              <p className={styles.aide}>Vous recevrez aussi une copie de la carte.</p>
            </div>
          )}

          <label className={styles.cgv}>
            <input type="checkbox" checked={form.cgv} onChange={set("cgv")} disabled={envoi} />
            <span>J'ai lu et j'accepte les conditions d'utilisation de la carte cadeau (ci-contre).</span>
          </label>

          {erreur && <p className={styles.erreur}>{erreur}</p>}

          <div className={styles.total}>
            <span>Total</span>
            <strong>{total > 0 ? `${total} €` : "—"}</strong>
          </div>

          <Button type="submit" variant="fill" fullWidth>
            {envoi ? "Redirection vers le paiement…" : "Payer et recevoir la carte"}
          </Button>
          <p className={styles.aide} style={{ textAlign: "center", marginTop: ".8rem" }}>
            Paiement sécurisé par carte bancaire via Stripe.
          </p>
        </form>

        {/* ── Conditions ── */}
        <aside className={styles.infoCol}>
          <h2 className={styles.etape}>Conditions d'utilisation</h2>
          <ul className={styles.conditions}>
            <li>Valable <strong>{VALIDITE_MOIS} mois</strong> à compter de la date d'achat.</li>
            <li>Utilisable sur rendez-vous, à domicile ou à la Symphonie des Mains à Massy (le Head Spa se fait uniquement à la Symphonie des Mains).</li>
            <li>Ni remboursable, ni échangeable contre de l'argent, même partiellement.</li>
            <li>Une carte « montant libre » peut servir pour un ou plusieurs soins ; le solde restant reste utilisable jusqu'à la date de fin de validité.</li>
            <li>Si le soin choisi coûte plus que la carte, la différence est réglée le jour du rendez-vous.</li>
            <li>Les contre-indications de chaque soin s'appliquent (voir la page Les soins).</li>
            <li>Droit de rétractation de 14 jours à compter de l'achat, tant que la carte n'a pas été utilisée.</li>
            <li>TVA non applicable, art. 293 B du CGI.</li>
          </ul>
          <p className={styles.aide} style={{ marginTop: "1.5rem" }}>
            Une question avant d'offrir ? Appelez-moi au 07 43 71 41 53.
          </p>
        </aside>

      </div>
    </div>
  );
}
