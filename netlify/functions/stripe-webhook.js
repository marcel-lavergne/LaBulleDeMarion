/* ═══════════════════════════════════════════════════════════════
   Fonction APPELÉE PAR STRIPE — /.netlify/functions/stripe-webhook
   Stripe prévient ici quand un paiement est validé. On vérifie que
   le message vient bien de Stripe (signature), puis on :
     1. crée la carte (numéro, date de validité, jeton du PDF)
     2. l'enregistre dans la base (Netlify Blobs)
     3. envoie les mails (carte + copie pour Marion)
   Variables Netlify : STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
                       EMAILJS_PRIVATE_KEY
═══════════════════════════════════════════════════════════════ */

import Stripe from "stripe";
import {
  store, lireCarte, ecrireCarte,
  genererNumero, genererJeton, dateFinValidite, json,
} from "./_cartes.js";
import { envoyerMailsCarte } from "./_mails.js";

export default async (req) => {
  if (req.method !== "POST") return json({ erreur: "Méthode non autorisée." }, 405);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  /* ── 1. Le message vient-il vraiment de Stripe ? ── */
  let event;
  try {
    const corps = await req.text(); // le texte BRUT est indispensable à la vérification
    event = await stripe.webhooks.constructEventAsync(
      corps,
      req.headers.get("stripe-signature"),
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook refusé (signature invalide) :", err.message);
    return json({ erreur: "Signature invalide." }, 400);
  }

  /* On ne s'intéresse qu'aux paiements terminés et encaissés */
  const session = event.data.object;
  const payeMaintenant = event.type === "checkout.session.completed" && session.payment_status === "paid";
  const payePlusTard   = event.type === "checkout.session.async_payment_succeeded";
  if (!payeMaintenant && !payePlusTard) return json({ recu: true });

  try {
    const carte = await carteDuPaiement(session);

    /* ── 3. Les mails (une seule fois par carte) ── */
    if (!carte.mails?.envoyes) {
      await envoyerMailsCarte(carte);
      carte.mails = { envoyes: true, date: new Date().toISOString() };
      await ecrireCarte(carte);
    }
    return json({ recu: true, numero: carte.numero });
  } catch (err) {
    /* Réponse 500 → Stripe réessaiera automatiquement plus tard.
       La carte déjà créée sera retrouvée, rien n'est dupliqué. */
    console.error("Webhook — traitement impossible :", err.message);
    return json({ erreur: "Traitement impossible, réessayer." }, 500);
  }
};

/* ── 2. Retrouve la carte de ce paiement, ou la crée ──────────────
   Stripe peut envoyer le même événement plusieurs fois : la clé
   « session/<id> » garantit une seule carte par paiement. */
async function carteDuPaiement(session) {
  const s = store();
  const cleSession = `session/${session.id}`;

  const dejaLa = await s.get(cleSession, { type: "json" });
  if (dejaLa) {
    const carte = await lireCarte(dejaLa.numero);
    if (carte) return carte;
  }

  /* Numéro unique (on retire au sort tant qu'il est déjà pris) */
  let numero = genererNumero();
  while (await lireCarte(numero)) numero = genererNumero();

  /* Réserve le paiement : si un autre envoi de Stripe est passé
     entre-temps, on reprend SA carte au lieu d'en créer une 2e. */
  const { modified } = await s.setJSON(cleSession, { numero }, { onlyIfNew: true });
  if (!modified) {
    const autre = await s.get(cleSession, { type: "json" });
    const carte = autre && (await lireCarte(autre.numero));
    if (carte) return carte;
    throw new Error("Carte en cours de création par un autre envoi.");
  }

  const m = session.metadata;
  const maintenant = new Date();
  const montant = Math.round(session.amount_total / 100);

  const carte = {
    numero,
    jeton: genererJeton(),
    createdAt: maintenant.toISOString(),
    expireLe: dateFinValidite(maintenant).toISOString(),
    type: m.type,                       // "soin" | "montant"
    offre: m.offre || null,
    offreNom: m.offreNom,
    montant,                            // ce qui a été payé, en euros
    solde: m.type === "montant" ? montant : null, // reste à utiliser (montant libre)
    statut: "valide",                   // "valide" | "utilisee"
    utilisations: [],                   // historique : { date, montant, note }
    acheteur: {
      nom: m.acheteurNom,
      email: session.customer_details?.email || session.customer_email,
    },
    beneficiaire: { nom: m.beneficiaireNom, email: m.beneficiaireEmail || null },
    destinataire: m.destinataire,
    message: m.message || "",
    stripe: {
      sessionId: session.id,
      paymentIntent: session.payment_intent || null,
      test: !session.livemode,           // true = paiement de test
    },
    mails: { envoyes: false },
  };

  await ecrireCarte(carte);
  return carte;
}
