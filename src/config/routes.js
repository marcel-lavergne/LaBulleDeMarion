/* ═══════════════════════════════════════════════════════════════
   ROUTES — La Bulle de Marion
   Une URL, un titre et une description par page (pour le référencement).
   Pour modifier une adresse ou un texte SEO : c'est ici, en un seul endroit.
═══════════════════════════════════════════════════════════════ */

export const SITE_URL = "https://labulledemarion.fr";

export const ROUTES = [
  {
    id: "home",
    path: "/",
    title: "La Bulle de Marion — Massage prénatal, postnatal & bébé à Massy (91)",
    description:
      "Massage prénatal, postnatal et bébé, bain enveloppé, rituel Rebozo et serrage du bassin, à domicile à Massy et en Essonne (91). Un accompagnement périnatal tout en douceur.",
  },
  {
    id: "apropos",
    path: "/a-propos",
    title: "À propos — Marion, praticienne périnatale à Massy (91) | La Bulle de Marion",
    description:
      "Découvrez Marion et sa démarche d'accompagnement périnatal en douceur, à domicile à Massy et en Essonne (91).",
  },
  {
    id: "soins",
    path: "/soins",
    title: "Soins & massages bébé et femme enceinte à Massy (91) | La Bulle de Marion",
    description:
      "Massage prénatal et postnatal, massage bébé, bain enveloppé et thérapeutique bébé, rituel Rebozo, serrage du bassin. Soins et tarifs, à domicile à Massy et en Essonne (91).",
  },
  {
    id: "accompagnement",
    path: "/accompagnement",
    title: "Accompagnement périnatal à Massy (91) | La Bulle de Marion",
    description:
      "Un accompagnement périnatal personnalisé et bienveillant, de la grossesse aux premiers mois de bébé, à domicile à Massy et en Essonne (91).",
  },
  {
    id: "temoignages",
    path: "/temoignages",
    title: "Témoignages des familles — Massy (91) | La Bulle de Marion",
    description:
      "Les retours des familles accompagnées à Massy et en Essonne (91) lors de leurs soins prénatals, postnatals et bébé.",
  },
  {
    id: "contact",
    path: "/contact",
    title: "Contact & réservation — massages à domicile à Massy (91) | La Bulle de Marion",
    description:
      "Contactez Marion pour un soin à domicile à Massy et en Essonne (91) : téléphone, e-mail et formulaire de contact.",
  },
];

const DEFAULT = ROUTES[0];

/** Nettoie un pathname (supprime les / de fin) */
function clean(pathname) {
  const p = (pathname || "/").replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

/** URL → id de page (ex: "/soins" → "soins") */
export function pathToId(pathname) {
  const match = ROUTES.find((r) => r.path === clean(pathname));
  return match ? match.id : "home";
}

/** id de page → URL (ex: "soins" → "/soins") */
export function idToPath(id) {
  const match = ROUTES.find((r) => r.id === id);
  return match ? match.path : "/";
}

/** id de page → infos SEO (titre + description) */
export function metaFor(id) {
  return ROUTES.find((r) => r.id === id) ?? DEFAULT;
}
