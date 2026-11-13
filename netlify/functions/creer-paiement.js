/* ═══════════════════════════════════════════════════════════════
   Fonction PUBLIQUE — /.netlify/functions/creer-paiement
   Reçoit le formulaire de la page Carte cadeau, vérifie tout,
   RECALCULE le prix côté serveur puis ouvre une page de paiement
   Stripe Checkout. Répond { url } : la page y redirige le client.
   Variable Netlify nécessaire : STRIPE_SECRET_KEY
═══════════════════════════════════════════════════════════════ */

import Stripe from "stripe";
import { MONTANT_MIN, MONTANT_MAX, MESSAGE_MAX } from "../../src/config/cartesCadeaux.js";
import { trouverTarif, json } from "./_cartes.js";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const texte = (v, max) => String(v ?? "").trim().slice(0, max);

export default async (req) => {
  if (req.method !== "POST") return json({ erreur: "Méthode non autorisée." }, 405);

  let f = null;
  try { f = await req.json(); } catch { /* corps illisible */ }
  if (!f) return json({ erreur: "Formulaire illisible." }, 400);

  /* ── 1. Ce qu'on offre, et à quel prix (calculé ICI, jamais reçu du navigateur) ── */
  let prix, libelle;
  if (f.type === "soin") {
    const tarif = trouverTarif(f.offre);
    if (!tarif) return json({ erreur: "Soin ou pack inconnu." }, 400);
    prix = tarif.prix;
    libelle = tarif.nom;
  } else if (f.type === "montant") {
    prix = Number(f.montant);
    if (!Number.isInteger(prix) || prix < MONTANT_MIN || prix > MONTANT_MAX) {
      return json({ erreur: `Montant entre ${MONTANT_MIN} et ${MONTANT_MAX} €.` }, 400);
    }
    libelle = `Montant libre de ${prix} €`;
  } else {
    return json({ erreur: "Type de carte inconnu." }, 400);
  }

  /* ── 2. Les informations de la carte ── */
  const acheteurNom       = texte(f.acheteurNom, 80);
  const acheteurEmail     = texte(f.acheteurEmail, 120);
  const beneficiaireNom   = texte(f.beneficiaireNom, 80);
  const destinataire      = f.destinataire === "beneficiaire" ? "beneficiaire" : "acheteur";
  const beneficiaireEmail = destinataire === "beneficiaire" ? texte(f.beneficiaireEmail, 120) : "";
  const message           = texte(f.message, MESSAGE_MAX);

  if (!acheteurNom || !beneficiaireNom) return json({ erreur: "Les noms sont obligatoires." }, 400);
  if (!EMAIL_OK.test(acheteurEmail)) return json({ erreur: "Votre e-mail n'est pas valide." }, 400);
  if (destinataire === "beneficiaire" && !EMAIL_OK.test(beneficiaireEmail)) {
    return json({ erreur: "L'e-mail du bénéficiaire n'est pas valide." }, 400);
  }
  if (f.cgv !== true) return json({ erreur: "Conditions non acceptées." }, 400);

  /* ── 3. Création de la page de paiement Stripe ── */
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const site = process.env.URL || new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "fr",
      customer_email: acheteurEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: prix * 100, // Stripe compte en centimes
            product_data: {
              name: `Carte cadeau — ${libelle}`,
              description: `Offerte à ${beneficiaireNom}, valable 12 mois`,
            },
          },
        },
      ],
      /* Tout ce qu'il faudra pour fabriquer la carte une fois le paiement validé */
      metadata: {
        type: f.type,
        offre: f.type === "soin" ? f.offre : "",
        offreNom: libelle,
        montant: String(prix),
        acheteurNom,
        beneficiaireNom,
        destinataire,
        beneficiaireEmail,
        message,
      },
      payment_intent_data: {
        description: `Carte cadeau ${libelle} pour ${beneficiaireNom}`,
      },
      success_url: `${site}/carte-cadeau?paiement=ok`,
      cancel_url: `${site}/carte-cadeau?paiement=annule`,
    });

    return json({ url: session.url });
  } catch (err) {
    console.error("Stripe — création de la session impossible :", err.message);
    return json({ erreur: "Le paiement n'a pas pu être créé." }, 500);
  }
};
