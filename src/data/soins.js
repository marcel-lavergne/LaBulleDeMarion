/* ─────────────────────────────────────────────
   Data — Soins
   Source : Site_internet_la_bulle_de_marion.docx
   Les images sont importées puis associées à chaque soin.
───────────────────────────────────────────── */

import imgRebozo       from "../assets/soin-rebozo.jpg";
import imgPrenatal     from "../assets/soin-massage-prenatal.jpg";
import imgPostnatal    from "../assets/soin-massage-postnatal.jpg";
import imgBassin       from "../assets/soin-serrage-bassin.jpg";
import imgBainEnv      from "../assets/soin-bain-enveloppe.jpg";
import imgBainThera    from "../assets/soin-bain-therapeutique.jpg";
import imgMassageBebe  from "../assets/soin-massage-bebe.jpg";
import imgAtelier      from "../assets/soin-atelier-bebe.jpg";
import imgVentre       from "../assets/soin-maux-ventre.jpg";
import imgEnfant from "../assets/soin-massage-enfant.jpg";

export const SOINS = [
  {
    id: "rebozo",
    icon: "flower",
    image: imgRebozo,
    name: "Rituel Rebozo",
    duration: "3h00",
    price: "200€",
    cible: "Femme",
    color: "terra",
    description:
      "Soin d'origine mexicaine traditionnellement proposé aux femmes après l'accouchement, mais pouvant convenir lors de périodes de transition, de fatigue physique et émotionnelle. Comprend un temps d'échange, un massage du corps entier, un moment de sudation avec méditation et le soin Rebozo.",
    apporte: [
      "Profonde détente physique et mentale",
      "Sensation de recentrage et de relâchement",
      "Un temps pour déposer les émotions",
      "Soulagement des tensions corporelles",
      "Accompagnement symbolique des changements de vie",
    ],
    contrindications:
      "Césarienne (attendre 6 semaines), fièvre, maladie cardiaque (pacemaker), grossesse avant 3 mois, varices et problème circulatoire grave.",
  },
  {
    id: "prenatal",
    icon: "drops",
    image: imgPrenatal,
    name: "Massage femme enceinte",
    duration: "1h30",
    price: "80€",
    cible: "Femme enceinte",
    color: "rose",
    description:
      "Un temps d'échange suivi d'un massage d'1h30 pour relâcher les tensions, se reconnecter à son corps et à son bébé dans une ambiance apaisante et sécurisante. Disponible à partir de juillet.",
    apporte: [
      "Détente physique et mentale",
      "Reconnexion au corps",
      "Apaisement et relaxation",
      "Renforcement du lien mère-bébé",
    ],
    contrindications: null,
  },
  {
    id: "postnatal",
    icon: "feet",
    image: imgPostnatal,
    name: "Massage post-natal",
    duration: "2h",
    price: "110€",
    cible: "Post-partum",
    color: "rouge",
    description:
      "Un temps d'échange et un massage d'1h30 pour aider la jeune maman à se reconnecter à elle-même, soulager les tensions corporelles et retrouver un moment de détente profonde.",
    apporte: [
      "Un moment pour soi",
      "Reconnexion à soi",
      "Détente physique et mentale",
      "Soulagement des tensions corporelles",
    ],
    contrindications: null,
  },
  {
    id: "bassin",
    icon: "clover",
    image: imgBassin,
    name: "Serrage du bassin",
    duration: "1h15",
    price: "70€",
    cible: "Post-partum",
    color: "terra",
    description:
      "Comprend un massage du dos et de la tête, puis le serrage du bassin avec le tissu Rebozo. Apporte une sensation de recentrage, de relâchement et un soutien enveloppant.",
    apporte: [
      "Profonde détente physique et mentale",
      "Sensation de recentrage",
      "Soulagement des tensions corporelles",
      "Soutien du bassin par le tissu Rebozo",
    ],
    contrindications:"Césarienne (attendre 6 semaines), fièvre, maladie cardiaque (pacemaker), grossesse avant 3 mois, varices et problème circulatoire grave.",
  },
  {
    id: "bain-enveloppe",
    icon: "drops",
    image: imgBainEnv,
    name: "Bain enveloppé",
    duration: "1h30",
    price: "90€",
    cible: "Bébé",
    color: "rose",
    description:
      "Soin pouvant être accompagné par les parents. Apaise et relaxe bébé, améliore le sommeil et renforce le lien parent-enfant. Aide à la transition après la naissance.",
    apporte: [
      "Apaisement et relaxation",
      "Réduction du stress et de l'anxiété",
      "Améliore le sommeil",
      "Renforce le lien parent-enfant",
      "Aide à la transition après la naissance",
    ],
    contrindications:
      "Perte de poids ou mauvaise prise de poids, bébé malade. Avis médical impératif par la suite.",
  },
  {
    id: "bain-therapeutique",
    icon: "flower",
    image: imgBainThera,
    name: "Thérapeutique bain bébé",
    certif: "Certifié par Sonia Krief",
    duration: "1h30",
    price: "100€",
    cible: "Bébé",
    color: "rouge",
    description:
      "Bain enveloppé effectué par Marion elle-même. Offre les mêmes bénéfices profonds dans un cadre thérapeutique et sécurisant.",
    apporte: [
      "Apaisement et relaxation",
      "Réduction du stress et de l'anxiété",
      "Améliore le sommeil",
      "Renforce le lien parent-enfant",
    ],
    contrindications:
      "Perte de poids ou mauvaise prise de poids, bébé malade. Avis médical impératif par la suite.",
  },
  {
    id: "massage-bebe-accompagnement",
    icon: "feet",
    image: imgMassageBebe,
    name: "Accompagnement massage bébé",
    duration: "3 séances d'1h",
    price: "150€",
    cible: "Bébé",
    color: "terra",
    description:
      "Parcours de 3 séances pour apprendre le massage bébé. Renforce le lien d'attachement, apaise l'inconfort et développe la confiance parentale.",
    apporte: [
      "Renforcement du lien d'attachement",
      "Apaisement et détente",
      "Soulagement de certains inconforts",
      "Favorise le sommeil",
      "Développe la confiance parentale",
    ],
    contrindications: null,
  },
  {
    id: "atelier-decouverte",
    icon: "clover",
    image: imgAtelier,
    name: "Atelier découverte massage bébé",
    duration: "1h",
    price: "55€",
    cible: "Bébé",
    color: "rose",
    description:
      "Séance d'initiation au massage bébé pour les parents souhaitant découvrir cette pratique douce et bienveillante.",
    apporte: [
      "Renforcement du lien d'attachement",
      "Apaisement et détente",
      "Stimulation du développement corporel",
      "Développe la confiance parentale",
    ],
    contrindications: null,
  },
  {
    id: "maux-de-ventre",
    icon: "drops",
    image: imgVentre,
    name: "Massage spécial maux de ventre",
    duration: "1h",
    price: "55€",
    cible: "Bébé",
    color: "rouge",
    description:
      "Massage ciblé du ventre pour soulager l'inconfort digestif, favoriser le sommeil et soutenir le système digestif de bébé.",
    apporte: [
      "Apaisement et détente",
      "Soulagement de l'inconfort digestif",
      "Favorise le sommeil",
      "Soutient le système digestif",
      "Offre un moment de plaisir partagé",
    ],
    contrindications: null,
  },
  {
  id: "massage-enfant",
  icon: "feet",
  image: imgEnfant,
  name: "Massage enfant",
  duration: "1h",
  price: "55€",
  cible: "6 à 14 ans",
  color: "terra",
  description:
    "Comprend un temps d'échange et de préparation, puis un massage de 45 minutes : tout le corps ou seulement certaines parties, selon le choix de l'enfant. La présence d'un adulte est obligatoire durant tout le soin.",
  apporte: [
    "Relaxation et apaisement",
    "Améliore le sommeil",
    "Réduit le stress",
    "Libère les tensions du quotidien",
  ],
  contrindications: null,
},
];
