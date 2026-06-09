/* ═══════════════════════════════════════════════════════════════
   Témoignages — accès au stockage (Netlify Blobs)
   Source de vérité des témoignages une fois en ligne.
   Le fichier src/data/temoignages.js ne sert plus que de secours
   d'affichage si jamais ces fonctions sont indisponibles.
═══════════════════════════════════════════════════════════════ */

import { getStore } from "@netlify/blobs";

const STORE_NAME = "temoignages";

/* Amorçage : la 1re fois (stockage vide), on importe les témoignages
   existants, déjà validés. createdAt décroissant pour conserver l'ordre. */
const SEED = [
  {
    id: "t-1",
    text: "Marion est venue à notre domicile pour le bain enveloppé de notre fille de 3 semaines. Elle a pris le temps de discuter avec nous du déroulement de la séance — un temps d'échange important avec toute notre petite famille avant le bain. Marion s'est montrée douce et patiente, elle s'est adaptée aux réactions de notre fille, qui n'appréciait pas du tout les bains, afin qu'elle puisse en profiter au moins un peu. Nous avons apprécié ce moment enveloppé de douceur pour notre fille. Marion nous a aussi montré des gestes que nous avons pu reproduire par la suite, pour rendre les bains plus apaisants. Un grand merci à Marion pour cette belle expérience !",
    author: "Maman de Loely",
    detail: "Bain enveloppé · bébé de 23 jours",
    approved: true,
    createdAt: 4,
  },
  {
    id: "t-2",
    text: "Marion est une professionnelle douce, bienveillante et à l'écoute. Le bain thérapeutique de notre nouveau-né s'est très bien déroulé et nous avons beaucoup apprécié ce moment. Elle a également pris le temps d'échanger avec nous avant le bain, ce qui nous a permis d'être rassurés et en confiance. Son contact avec les parents est très agréable et professionnel. Je la recommande sans hésitation.",
    author: "Papa d'Andréa",
    detail: "Bain thérapeutique · 3 semaines",
    approved: true,
    createdAt: 3,
  },
  {
    id: "t-3",
    text: "Un immense merci pour ce merveilleux massage ! Ce fut un vrai moment de détente et de bien-être, du début à la fin. Une expérience absolument géniale, un moment hors du temps qui m'a permis de me détendre complètement. Votre douceur et votre attention ont rendu cette expérience vraiment exceptionnelle. Je suis repartie légère, apaisée, et avec une seule envie : revenir ! Je recommande les yeux fermés.",
    author: "Marion",
    detail: "Massage",
    approved: true,
    createdAt: 2,
  },
  {
    id: "t-4",
    text: "Excellent moment de détente. Le massage était très agréable et réalisé avec beaucoup de soin. Merci !",
    author: "Michelle",
    detail: "Massage",
    approved: true,
    createdAt: 1,
  },
];

export function store() {
  return getStore(STORE_NAME);
}

/* Lit tous les témoignages. Amorce le stockage s'il est vide. */
export async function readAll() {
  const s = store();
  const { blobs } = await s.list();

  if (!blobs || blobs.length === 0) {
    await Promise.all(SEED.map((t) => s.setJSON(t.id, t)));
    return [...SEED];
  }

  const items = await Promise.all(
    blobs.map((b) => s.get(b.key, { type: "json" }).catch(() => null))
  );
  return items.filter(Boolean);
}

/* Réponse JSON courte */
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
