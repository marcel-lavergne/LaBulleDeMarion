/* ═══════════════════════════════════════════════════════════════
   Cartes cadeaux — contenu des mails
   • au destinataire choisi (acheteur ou bénéficiaire) : la carte
   • à l'acheteur, si la carte est partie chez le bénéficiaire : confirmation
   • à Marion : la trace de la vente
═══════════════════════════════════════════════════════════════ */

import { CONTACT_EMAIL } from "../../src/config/email.js";
import { envoyerMail, lienPdf, dateFr, libelleCarte, esc } from "./_cartes.js";

const TERRA = "#a2381c";
const TEXTE = "#2e1f14";
const DOUX  = "#6b4f3a";
const FOND  = "#faf3e9";

/* Habillage commun à tous les mails */
function cadre(titre, corps) {
  return `
<div style="background:${FOND};padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:${TEXTE};">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;padding:32px 28px;border-top:4px solid ${TERRA};">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${TERRA};">La Bulle de Marion</p>
    <h1 style="margin:0 0 20px;font-size:24px;font-weight:normal;color:${TERRA};">${titre}</h1>
    ${corps}
    <p style="margin:28px 0 0;font-size:12px;color:${DOUX};line-height:1.6;">
      La Bulle de Marion · 07 43 71 41 53 · ${CONTACT_EMAIL}<br>
      Sur rendez-vous, à domicile ou à la Symphonie des Mains, 8 rue Normandie Niemen, 91300 Massy.
    </p>
  </div>
</div>`;
}

function bouton(url, texte) {
  return `<p style="margin:24px 0;"><a href="${url}" style="display:inline-block;background:${TERRA};color:#ffffff;text-decoration:none;padding:12px 24px;font-size:14px;letter-spacing:1px;">${texte}</a></p>`;
}

function details(carte) {
  const ligne = (label, valeur) =>
    `<tr><td style="padding:6px 12px 6px 0;color:${DOUX};font-size:13px;white-space:nowrap;">${label}</td><td style="padding:6px 0;font-size:14px;">${valeur}</td></tr>`;
  return `
<table style="border-collapse:collapse;margin:8px 0;">
  ${ligne("Offert à", esc(carte.beneficiaire.nom))}
  ${ligne("De la part de", esc(carte.acheteur.nom))}
  ${ligne("Soin", esc(libelleCarte(carte)))}
  ${ligne("Numéro du bon", `<strong>${carte.numero}</strong>`)}
  ${ligne("Valable jusqu'au", dateFr(carte.expireLe))}
</table>`;
}

function petitMot(carte) {
  if (!carte.message) return "";
  return `<p style="margin:16px 0;padding:12px 16px;border-left:3px solid ${TERRA};background:${FOND};font-style:italic;font-size:14px;line-height:1.6;">« ${esc(carte.message)} »<br><span style="font-style:normal;font-size:12px;color:${DOUX};">— ${esc(carte.acheteur.nom)}</span></p>`;
}

const RESERVER = `<p style="font-size:14px;line-height:1.7;">Pour réserver votre soin, contactez Marion au <strong>07 43 71 41 53</strong> ou à <a href="mailto:${CONTACT_EMAIL}" style="color:${TERRA};">${CONTACT_EMAIL}</a> en indiquant le numéro du bon.</p>`;

/* 1. La carte, pour la personne qui doit la recevoir */
function mailCarte(carte) {
  const pourBeneficiaire = carte.destinataire === "beneficiaire";
  const intro = pourBeneficiaire
    ? `<p style="font-size:15px;line-height:1.7;">Bonjour ${esc(carte.beneficiaire.nom)},<br>${esc(carte.acheteur.nom)} vous offre une parenthèse de douceur à La Bulle de Marion.</p>`
    : `<p style="font-size:15px;line-height:1.7;">Bonjour ${esc(carte.acheteur.nom)},<br>merci pour votre commande ! Voici la carte cadeau à imprimer ou à transférer à ${esc(carte.beneficiaire.nom)}.</p>`;
  return {
    to: pourBeneficiaire ? carte.beneficiaire.email : carte.acheteur.email,
    subject: pourBeneficiaire
      ? `${carte.acheteur.nom} vous offre une carte cadeau La Bulle de Marion`
      : `Votre carte cadeau La Bulle de Marion (${carte.numero})`,
    contenu: cadre(
      "Une parenthèse de douceur",
      intro + petitMot(carte) + details(carte) + bouton(lienPdf(carte), "Télécharger la carte (PDF)") + RESERVER +
        `<p style="font-size:12px;color:${DOUX};line-height:1.6;">Carte non remboursable et non échangeable contre de l'argent. Les contre-indications de chaque soin s'appliquent.</p>`
    ),
  };
}

/* 2. Confirmation à l'acheteur quand la carte est partie chez le bénéficiaire */
function mailConfirmationAcheteur(carte) {
  return {
    to: carte.acheteur.email,
    subject: `Votre carte cadeau a été envoyée à ${carte.beneficiaire.nom}`,
    contenu: cadre(
      "Merci pour votre commande",
      `<p style="font-size:15px;line-height:1.7;">Bonjour ${esc(carte.acheteur.nom)},<br>votre carte cadeau vient d'être envoyée à <strong>${esc(carte.beneficiaire.nom)}</strong> (${esc(carte.beneficiaire.email)}). En voici une copie.</p>` +
        details(carte) + bouton(lienPdf(carte), "Voir la carte (PDF)")
    ),
  };
}

/* 3. La trace pour Marion */
function mailMarion(carte) {
  const envoi = carte.destinataire === "beneficiaire"
    ? `au bénéficiaire (${esc(carte.beneficiaire.email)}), copie à l'acheteur`
    : "à l'acheteur";
  return {
    to: CONTACT_EMAIL,
    replyTo: carte.acheteur.email,
    subject: `Nouvelle carte cadeau vendue : ${carte.numero} (${carte.montant} €)`,
    contenu: cadre(
      "Nouvelle carte cadeau",
      details(carte) +
        `<p style="font-size:14px;line-height:1.7;">
          <strong>Payé :</strong> ${carte.montant} € par ${esc(carte.acheteur.nom)} (${esc(carte.acheteur.email)})<br>
          <strong>Envoyée :</strong> ${envoi}<br>
          <strong>Paiement Stripe :</strong> ${esc(carte.stripe.paymentIntent || carte.stripe.sessionId)}
        </p>` +
        petitMot(carte) + bouton(lienPdf(carte), "Voir la carte (PDF)")
    ),
  };
}

/* Renvoie uniquement la carte à son destinataire (bouton de l'admin) */
export async function renvoyerCarte(carte) {
  await envoyerMail(mailCarte(carte));
}

/* Envoie tous les mails d'une carte. Lève une erreur si l'un échoue. */
export async function envoyerMailsCarte(carte) {
  const mails = [mailCarte(carte)];
  if (carte.destinataire === "beneficiaire") mails.push(mailConfirmationAcheteur(carte));
  mails.push(mailMarion(carte));
  for (const m of mails) await envoyerMail(m);
}
