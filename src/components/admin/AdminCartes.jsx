/* ─────────────────────────────────────────────
   Admin — suivi des cartes cadeaux
   Qui a payé, pour qui, quel soin, numéro du bon, statut, solde.
   Actions : voir le PDF, marquer utilisée / déduire un montant,
   annuler la dernière utilisation, prolonger, renvoyer le mail.
───────────────────────────────────────────── */

import { useState, useEffect } from "react";
import styles from "./AdminCartes.module.css";

const API = "/.netlify/functions/admin-cartes";
const PDF = "/.netlify/functions/carte-cadeau-pdf";

const dateFr = (iso) => new Date(iso).toLocaleDateString("fr-FR");
const expiree = (c) => c.statut === "valide" && new Date(c.expireLe) < new Date();

/* Statut affiché : utilisée, expirée, entamée (montant libre) ou valide */
function statut(c) {
  if (c.statut === "utilisee") return { texte: "utilisée", classe: styles.badgeGris };
  if (expiree(c))              return { texte: "expirée",  classe: styles.badgeRouge };
  if (c.type === "montant" && c.solde < c.montant) return { texte: "entamée", classe: styles.badgeOr };
  return { texte: "valide", classe: styles.badgeVert };
}

export default function AdminCartes({ headers }) {
  const [cartes, setCartes]   = useState([]);
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState("");
  const [info, setInfo]       = useState("");
  const [recherche, setRech]  = useState("");
  const [filtre, setFiltre]   = useState("toutes");
  const [ouverte, setOuverte] = useState(null);   // numéro de la carte dépliée
  const [saisie, setSaisie]   = useState({ montant: "", note: "", date: "" });

  const charger = async () => {
    setBusy(true); setError("");
    try {
      const res = await fetch(API, { headers: headers() });
      if (!res.ok) throw new Error();
      setCartes(await res.json());
    } catch {
      setError("Impossible de charger les cartes.");
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => { charger(); /* eslint-disable-next-line */ }, []);

  /* Envoie une action au serveur puis remplace la carte modifiée */
  const agir = async (numero, action, extra = {}, methode = "PUT") => {
    setBusy(true); setError(""); setInfo("");
    try {
      const res = await fetch(API, { method: methode, headers: headers(), body: JSON.stringify({ numero, action, ...extra }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erreur || "Action impossible.");
      if (methode === "PUT") setCartes((l) => l.map((c) => (c.numero === numero ? data : c)));
      else setInfo("Carte renvoyée par e-mail ✓");
      setSaisie({ montant: "", note: "", date: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  /* Recherche (numéro, noms, e-mails) + filtre par statut */
  const q = recherche.trim().toLowerCase();
  const visibles = cartes.filter((c) => {
    const texte = [c.numero, c.acheteur.nom, c.acheteur.email, c.beneficiaire.nom, c.beneficiaire.email, c.offreNom]
      .join(" ").toLowerCase();
    if (q && !texte.includes(q)) return false;
    if (filtre === "valides")   return c.statut === "valide" && !expiree(c);
    if (filtre === "utilisees") return c.statut === "utilisee";
    if (filtre === "expirees")  return expiree(c);
    return true;
  });

  const totalVendu = cartes.filter((c) => !c.stripe?.test).reduce((s, c) => s + c.montant, 0);
  const set = (k) => (e) => setSaisie((s) => ({ ...s, [k]: e.target.value }));

  return (
    <div>
      <div className={styles.outils}>
        <input
          className={styles.recherche}
          placeholder="Rechercher : n° du bon, nom, e-mail…"
          value={recherche}
          onChange={(e) => setRech(e.target.value)}
        />
        <select className={styles.filtre} value={filtre} onChange={(e) => setFiltre(e.target.value)}>
          <option value="toutes">Toutes ({cartes.length})</option>
          <option value="valides">Valides</option>
          <option value="utilisees">Utilisées</option>
          <option value="expirees">Expirées</option>
        </select>
        <button type="button" className={styles.lien} onClick={charger} disabled={busy}>
          {busy ? "…" : "Rafraîchir"}
        </button>
      </div>
      <p className={styles.resume}>Total vendu (hors tests) : <strong>{totalVendu} €</strong></p>

      {error && <p className={styles.erreur}>{error}</p>}
      {info && <p className={styles.info}>{info}</p>}
      {visibles.length === 0 && <p className={styles.vide}>Aucune carte.</p>}

      {visibles.map((c) => {
        const s = statut(c);
        const open = ouverte === c.numero;
        return (
          <div key={c.numero} className={styles.carte}>
            {/* ── Résumé (cliquable) ── */}
            <button type="button" className={styles.entete} onClick={() => { setOuverte(open ? null : c.numero); setSaisie({ montant: "", note: "", date: "" }); }}>
              <span className={styles.numero}>{c.numero}</span>
              <span className={`${styles.badge} ${s.classe}`}>{s.texte}</span>
              {c.stripe?.test && <span className={`${styles.badge} ${styles.badgeGris}`}>test</span>}
              <span className={styles.qui}>{c.acheteur.nom} → {c.beneficiaire.nom}</span>
              <span className={styles.prix}>
                {c.type === "montant" ? `${c.solde} / ${c.montant} €` : `${c.montant} €`}
              </span>
            </button>
            <p className={styles.sous}>
              {c.offreNom} · acheté le {dateFr(c.createdAt)} · valable jusqu'au {dateFr(c.expireLe)}
            </p>

            {/* ── Détail ── */}
            {open && (
              <div className={styles.detail}>
                <dl className={styles.infos}>
                  <dt>Acheteur</dt><dd>{c.acheteur.nom} — <a href={`mailto:${c.acheteur.email}`}>{c.acheteur.email}</a></dd>
                  <dt>Bénéficiaire</dt><dd>{c.beneficiaire.nom}{c.beneficiaire.email && <> — <a href={`mailto:${c.beneficiaire.email}`}>{c.beneficiaire.email}</a></>}</dd>
                  <dt>Carte envoyée à</dt><dd>{c.destinataire === "beneficiaire" ? "le bénéficiaire (copie à l'acheteur)" : "l'acheteur"}{!c.mails?.envoyes && " — ⚠ mail non parti"}</dd>
                  {c.message && <><dt>Petit mot</dt><dd><em>« {c.message} »</em></dd></>}
                  <dt>Paiement</dt>
                  <dd>
                    {c.montant} € ·{" "}
                    {c.stripe?.paymentIntent
                      ? <a href={`https://dashboard.stripe.com/${c.stripe.test ? "test/" : ""}payments/${c.stripe.paymentIntent}`} target="_blank" rel="noreferrer">voir dans Stripe</a>
                      : c.stripe?.sessionId}
                  </dd>
                </dl>

                {c.utilisations.length > 0 && (
                  <>
                    <p className={styles.titre}>Utilisations</p>
                    <ul className={styles.histo}>
                      {c.utilisations.map((u, i) => (
                        <li key={i}>{dateFr(u.date)}{u.montant != null && ` — ${u.montant} €`}{u.note && ` — ${u.note}`}</li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Utiliser la carte */}
                {c.statut === "valide" && (
                  <div className={styles.ligneAction}>
                    {c.type === "montant" && (
                      <input type="number" min="1" max={c.solde} placeholder="€" className={styles.petit} value={saisie.montant} onChange={set("montant")} />
                    )}
                    <input placeholder="Note (ex : Rebozo du 12/03)" className={styles.note} value={saisie.note} onChange={set("note")} />
                    {c.type === "montant" && (
                      <button type="button" className={styles.bouton} disabled={busy || !saisie.montant}
                        onClick={() => agir(c.numero, "deduire", { montant: Number(saisie.montant), note: saisie.note })}>
                        Déduire
                      </button>
                    )}
                    <button type="button" className={styles.bouton} disabled={busy}
                      onClick={() => window.confirm(`Marquer ${c.numero} comme entièrement utilisée ?`) && agir(c.numero, "utiliser", { note: saisie.note })}>
                      Marquer utilisée
                    </button>
                  </div>
                )}

                <div className={styles.ligneAction}>
                  <a className={styles.lien} href={`${PDF}?n=${c.numero}&t=${c.jeton}`} target="_blank" rel="noreferrer">Voir le PDF</a>
                  <button type="button" className={styles.lien} disabled={busy}
                    onClick={() => window.confirm("Renvoyer la carte par e-mail ?") && agir(c.numero, "renvoyer", {}, "POST")}>
                    Renvoyer le mail
                  </button>
                  {c.utilisations.length > 0 && (
                    <button type="button" className={styles.lien} disabled={busy}
                      onClick={() => window.confirm("Annuler la dernière utilisation ?") && agir(c.numero, "annuler")}>
                      Annuler la dernière utilisation
                    </button>
                  )}
                  <span className={styles.prolonger}>
                    <input type="date" className={styles.petit} value={saisie.date} onChange={set("date")} />
                    <button type="button" className={styles.lien} disabled={busy || !saisie.date}
                      onClick={() => agir(c.numero, "prolonger", { date: saisie.date })}>
                      Changer la date de fin
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
