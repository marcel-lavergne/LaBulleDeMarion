/* ═══════════════════════════════════════════════════════════════
   Témoignages — accès au stockage (Netlify Blobs)
   Source de vérité des témoignages une fois en ligne.
   Le fichier src/data/temoignages.js ne sert plus que de secours
   d'affichage si jamais ces fonctions sont indisponibles.
═══════════════════════════════════════════════════════════════ */

import { getStore } from "@netlify/blobs";

const STORE_NAME = "temoignages";
const KEY = "collection"; // tout est rangé dans UNE seule entrée JSON (lecture/écriture par clé = fiable)

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
  // Cohérence FORTE : une écriture est immédiatement visible en lecture
  // (lectures un peu plus lentes, mais plus de décalage « en retard »).
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

/* Lit la liste complète depuis l'entrée unique « collection ».
   Si elle n'existe pas encore, on l'initialise UNE fois — sans jamais
   réécrire par-dessus ensuite (donc les modifications sont préservées). */
export async function readAll() {
  const s = store();

  const existing = await s.get(KEY, { type: "json" });
  if (Array.isArray(existing)) return existing;

  // Première initialisation : on récupère d'éventuels témoignages déjà
  // stockés par l'ancienne version (une entrée par clé) pour ne rien perdre.
  let initial = [];
  try {
    const { blobs } = await s.list();
    const legacy = (
      await Promise.all(
        blobs
          .filter((b) => b.key !== KEY)
          .map((b) => s.get(b.key, { type: "json" }).catch(() => null))
      )
    ).filter((t) => t && t.id && t.text);
    initial = legacy;
  } catch {
    /* listing indisponible : on partira du seed */
  }

  // Complète avec les témoignages d'origine manquants (sans écraser les existants)
  const ids = new Set(initial.map((t) => t.id));
  for (const t of SEED) if (!ids.has(t.id)) initial.push(t);
  if (initial.length === 0) initial = [...SEED];

  await s.setJSON(KEY, initial);
  return initial;
}

/* Écrit la liste complète (remplace l'entrée unique). */
export async function writeAll(list) {
  await store().setJSON(KEY, list);
}

/* Réponse JSON courte */
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
