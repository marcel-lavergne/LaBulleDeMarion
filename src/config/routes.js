/* ═══════════════════════════════════════════════════════════════
   ROUTES — La Bulle de Marion
   Une URL, un titre et une description par page (pour le référencement).
   Pour modifier une adresse ou un texte SEO : c'est ici, en un seul endroit.
═══════════════════════════════════════════════════════════════ */

export const SITE_URL = "https://labulledemarion.netlify.app";

export const ROUTES = [
  {
    id: "home",
    path: "/",
    title: "La Bulle de Marion — Massage prénatal, postnatal & bébé à domicile",
    description:
      "Massages prénatals, postnatals et bébé, rituel rebozo et serrage du bassin, à domicile en région parisienne. Un accompagnement périnatal tout en douceur.",
  },
  {
    id: "apropos",
    path: "/a-propos",
    title: "À propos — Marion, praticienne périnatale | La Bulle de Marion",
    description:
      "Découvrez Marion et sa démarche d'accompagnement périnatal en douceur, à domicile en région parisienne.",
  },
  {
    id: "soins",
    path: "/soins",
    title: "Les soins — massages, rituel rebozo, serrage du bassin | La Bulle de Marion",
    description:
      "Massages prénatals, postnatals et bébé, rituel rebozo, serrage du bassin, bains enveloppés. Détail des soins et tarifs, à domicile en région parisienne.",
  },
  {
    id: "accompagnement",
    path: "/accompagnement",
    title: "L'accompagnement périnatal | La Bulle de Marion",
    description:
      "Un accompagnement périnatal personnalisé et bienveillant, de la grossesse aux premiers mois de bébé, à domicile en région parisienne.",
  },
  {
    id: "temoignages",
    path: "/temoignages",
    title: "Témoignages des familles | La Bulle de Marion",
    description:
      "Les retours des familles accompagnées par La Bulle de Marion lors de leurs soins prénatals, postnatals et bébé.",
  },
  {
    id: "contact",
    path: "/contact",
    title: "Contact — prendre contact | La Bulle de Marion",
    description:
      "Contactez Marion pour un soin à domicile en région parisienne : téléphone, email et formulaire de contact.",
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
