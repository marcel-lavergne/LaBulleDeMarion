/* ═══════════════════════════════════════════════════════════════
   Fonction ADMIN — /.netlify/functions/admin-cartes
   Suivi des cartes cadeaux. Protégée par le même mot de passe que
   les témoignages (en-tête x-admin-password = ADMIN_PASSWORD).

   • GET  → toutes les cartes (les plus récentes d'abord)
   • PUT  → { numero, action, ... } :
       "utiliser"  → carte « soin » : marquée comme utilisée
       "deduire"   → carte « montant » : { montant } retiré du solde
       "annuler"   → annule la dernière utilisation (erreur de clic)
       "prolonger" → { date: "AAAA-MM-JJ" } nouvelle date de fin
   • POST → { numero, action: "renvoyer" } : renvoie la carte par mail
═══════════════════════════════════════════════════════════════ */

import { toutesLesCartes, lireCarte, ecrireCarte, motDePasseAdminOk, json } from "./_cartes.js";
import { renvoyerCarte } from "./_mails.js";

export default async (req) => {
  if (!motDePasseAdminOk(req)) return json({ erreur: "Non autorisé." }, 401);

  if (req.method === "GET") return json(await toutesLesCartes());

  let body = null;
  try { body = await req.json(); } catch { /* ignore */ }
  const carte = body?.numero ? await lireCarte(body.numero) : null;
  if (!carte) return json({ erreur: "Carte introuvable." }, 404);

  /* ── Renvoyer la carte par mail ── */
  if (req.method === "POST" && body.action === "renvoyer") {
    try {
      await renvoyerCarte(carte);
      return json({ ok: true });
    } catch (err) {
      console.error("Renvoi impossible :", err.message);
      return json({ erreur: "Le mail n'a pas pu partir." }, 502);
    }
  }

  if (req.method !== "PUT") return json({ erreur: "Méthode non autorisée." }, 405);

  const maintenant = new Date().toISOString();
  const note = String(body.note || "").trim().slice(0, 200);

  switch (body.action) {
    case "utiliser": {
      if (carte.statut === "utilisee") return json({ erreur: "Carte déjà utilisée." }, 400);
      carte.utilisations.push({ date: maintenant, montant: carte.type === "montant" ? carte.solde : null, note });
      if (carte.type === "montant") carte.solde = 0;
      carte.statut = "utilisee";
      break;
    }
    case "deduire": {
      const montant = Number(body.montant);
      if (carte.type !== "montant") return json({ erreur: "Réservé aux cartes « montant libre »." }, 400);
      if (!Number.isFinite(montant) || montant <= 0 || montant > carte.solde) {
        return json({ erreur: `Montant entre 0 et ${carte.solde} €.` }, 400);
      }
      carte.solde = Math.round((carte.solde - montant) * 100) / 100;
      carte.utilisations.push({ date: maintenant, montant, note });
      carte.statut = carte.solde === 0 ? "utilisee" : "valide";
      break;
    }
    case "annuler": {
      const derniere = carte.utilisations.pop();
      if (!derniere) return json({ erreur: "Rien à annuler." }, 400);
      if (carte.type === "montant" && derniere.montant) {
        carte.solde = Math.round((carte.solde + derniere.montant) * 100) / 100;
      }
      carte.statut = "valide";
      break;
    }
    case "prolonger": {
      const date = new Date(`${body.date}T12:00:00Z`); // midi : même jour partout
      if (Number.isNaN(date.getTime())) return json({ erreur: "Date invalide." }, 400);
      carte.expireLe = date.toISOString();
      break;
    }
    default:
      return json({ erreur: "Action inconnue." }, 400);
  }

  carte.modifieLe = maintenant;
  await ecrireCarte(carte);
  return json(carte);
};
