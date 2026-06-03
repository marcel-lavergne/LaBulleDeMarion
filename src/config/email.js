/* ═══════════════════════════════════════════════════════════════
   CONFIGURATION E-MAIL  (EmailJS)
   Centralise tout ce qui concerne l'envoi des mails du formulaire.
═══════════════════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────────────────
   📨  DESTINATAIRE DES MESSAGES
   C'est l'adresse qui reçoit les messages envoyés depuis le site.

   👉  POUR CHANGER LE DESTINATAIRE : modifie juste la ligne ci-dessous.

       • Pendant les tests :  "lavergne.marcel@gmail.com"
       • Quand le site sera prêt, remplace par :  "contact@labulledemarion.fr"
─────────────────────────────────────────────────────────────── */
export const CONTACT_EMAIL = "contact@labulledemarion.fr";


/* ───────────────────────────────────────────────────────────────
   🔑  IDENTIFIANTS EMAILJS
   À récupérer sur https://www.emailjs.com (compte gratuit) :

       1. Crée un compte EmailJS.
       2. Onglet "Email Services"  → connecte ta boîte Gmail
          → copie le  Service ID  ci-dessous.
       3. Onglet "Email Templates" → crée un modèle (voir README)
          → copie le  Template ID  ci-dessous.
       4. Onglet "Account" → "General" → API Keys
          → copie la  Public Key  ci-dessous.

   Ces 3 valeurs ne sont pas secrètes (la "Public Key" est faite
   pour être visible côté navigateur), tu peux les laisser ici.
─────────────────────────────────────────────────────────────── */
export const EMAILJS_SERVICE_ID  = "service_jf4652c";
export const EMAILJS_TEMPLATE_ID = "template_6uf0xhe";
export const EMAILJS_PUBLIC_KEY  = "D130WqroRLBnYd3mB";


/* Vrai uniquement quand les 3 clés ont été renseignées.
   Tant que c'est faux, le formulaire affiche un message d'attente
   au lieu d'essayer d'envoyer (utile pendant le développement). */
export const EMAILJS_CONFIGURED =
  EMAILJS_SERVICE_ID  !== "TON_SERVICE_ID"  &&
  EMAILJS_TEMPLATE_ID !== "TON_TEMPLATE_ID" &&
  EMAILJS_PUBLIC_KEY  !== "TA_CLE_PUBLIQUE";
