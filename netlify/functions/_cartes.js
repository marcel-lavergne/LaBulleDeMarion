/* ═══════════════════════════════════════════════════════════════
   Cartes cadeaux — outils partagés par les fonctions serveur
   (stockage, numéros, dates, mots de passe, envoi des mails)
═══════════════════════════════════════════════════════════════ */

import { getStore } from "@netlify/blobs";
import { randomBytes, timingSafeEqual } from "node:crypto";

import { SITE_URL } from "../../src/config/routes.js";
import { VALIDITE_MOIS } from "../../src/config/cartesCadeaux.js";
import {
  CONTACT_EMAIL,
  EMAILJS_SERVICE_ID,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_TEMPLATE_CARTE,
} from "../../src/config/email.js";
import TARIFS from "./_tarifs.json";

/* ── Stockage ──────────────────────────────────────────────────
   Une entrée par carte : « carte/BDM-XXXXXX »
   + une entrée par paiement Stripe : « session/cs_... » → numéro
   (sert à ne jamais créer deux cartes pour le même paiement) */
export function store() {
  return getStore({ name: "cartes-cadeaux", consistency: "strong" });
}

export async function lireCarte(numero) {
  return store().get(`carte/${numero}`, { type: "json" });
}

export async function ecrireCarte(carte) {
  await store().setJSON(`carte/${carte.numero}`, carte);
}

export async function toutesLesCartes() {
  const s = store();
  const { blobs } = await s.list({ prefix: "carte/" });
  const cartes = await Promise.all(blobs.map((b) => s.get(b.key, { type: "json" })));
  return cartes.filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ── Tarifs ────────────────────────────────────────────────────
   _tarifs.json est régénéré à chaque « npm run build » à partir de
   src/data/soins.js et packs.js : le prix vient TOUJOURS du serveur. */
export function trouverTarif(id) {
  return TARIFS[id] ?? null; // { nom, prix } ou null
}

/* ── Numéros et jetons ────────────────────────────────────────── */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans 0/O ni 1/I (lisible au téléphone)

export function genererNumero() {
  const octets = randomBytes(6);
  let code = "";
  for (const o of octets) code += ALPHABET[o % ALPHABET.length];
  return `BDM-${code}`;
}

/* Jeton secret glissé dans le lien du PDF : sans lui, impossible
   de télécharger la carte d'un autre en devinant son numéro. */
export function genererJeton() {
  return randomBytes(16).toString("hex");
}

/* Compare deux textes sans fuite de temps (mots de passe, jetons) */
export function egalSecurise(a, b) {
  const x = Buffer.from(String(a ?? ""));
  const y = Buffer.from(String(b ?? ""));
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
}

export function motDePasseAdminOk(req) {
  return egalSecurise(req.headers.get("x-admin-password"), process.env.ADMIN_PASSWORD);
}

/* ── Dates ─────────────────────────────────────────────────────── */
export function dateFinValidite(depuis = new Date()) {
  const fin = new Date(depuis);
  fin.setMonth(fin.getMonth() + VALIDITE_MOIS);
  return fin;
}

export function dateFr(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });
}

/* Ce qui est écrit sur la carte à la ligne « Soins : » */
export function libelleCarte(carte) {
  return carte.type === "montant" ? `Valeur de ${carte.montant} € (soin au choix)` : carte.offreNom;
}

/* ── Adresses utiles ──────────────────────────────────────────── */
/* URL fournie par Netlify (site en ligne, aperçu ou netlify dev) */
export function urlDuSite() {
  return process.env.URL || SITE_URL;
}

export function lienPdf(carte) {
  return `${urlDuSite()}/.netlify/functions/carte-cadeau-pdf?n=${carte.numero}&t=${carte.jeton}`;
}

/* ── Réponses ──────────────────────────────────────────────────── */
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/* ── Envoi d'un mail via EmailJS (API REST) ───────────────────────
   Un seul modèle EmailJS sert à tous les mails des cartes :
   destinataire, sujet et contenu HTML sont fournis ici.
   Nécessite la clé privée EMAILJS_PRIVATE_KEY (variable Netlify). */
export async function envoyerMail({ to, subject, contenu, replyTo = CONTACT_EMAIL }) {
  const reponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_CARTE,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: { to_email: to, subject, contenu, reply_to: replyTo },
    }),
  });
  if (!reponse.ok) {
    throw new Error(`EmailJS ${reponse.status} : ${await reponse.text()}`);
  }
}

/* Échappe le texte saisi par les clients avant de le mettre dans un mail */
export function esc(texte) {
  return String(texte ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
