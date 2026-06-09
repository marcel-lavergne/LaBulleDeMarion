/* ═══════════════════════════════════════════════════════════════
   Fonction ADMIN — /.netlify/functions/admin-temoignages
   Protégée par mot de passe (en-tête x-admin-password), comparé au
   secret ADMIN_PASSWORD défini dans les variables d'environnement
   Netlify (jamais présent dans le code envoyé au navigateur).

   • GET    → TOUS les témoignages (validés + en attente)
   • PUT    → modifier / valider un témoignage  (corps JSON : { id, ... })
   • DELETE → supprimer un témoignage           (?id=...)
═══════════════════════════════════════════════════════════════ */

import { readAll, store, json } from "./_data.js";

/* Comparaison à temps constant (évite les attaques par mesure de durée) */
function passwordOk(req) {
  const given = req.headers.get("x-admin-password") || "";
  const real  = process.env.ADMIN_PASSWORD || "";
  if (!real || given.length !== real.length) return false;
  let diff = 0;
  for (let i = 0; i < real.length; i++) diff |= given.charCodeAt(i) ^ real.charCodeAt(i);
  return diff === 0;
}

export default async (req) => {
  if (!passwordOk(req)) return json({ error: "Non autorisé." }, 401);

  const s = store();

  if (req.method === "GET") {
    const all = await readAll();
    all.sort((a, b) => b.createdAt - a.createdAt);
    return json(all);
  }

  if (req.method === "PUT") {
    let body = null;
    try { body = await req.json(); } catch { /* ignore */ }
    if (!body?.id) return json({ error: "id manquant." }, 400);

    const current = await s.get(body.id, { type: "json" });
    if (!current) return json({ error: "Témoignage introuvable." }, 404);

    const updated = {
      ...current,
      author:   body.author   !== undefined ? body.author.toString().slice(0, 120) : current.author,
      detail:   body.detail   !== undefined ? body.detail.toString().slice(0, 160) : current.detail,
      text:     body.text     !== undefined ? body.text.toString().slice(0, 2000)  : current.text,
      approved: body.approved !== undefined ? !!body.approved : current.approved,
    };

    await s.setJSON(body.id, updated);
    return json(updated);
  }

  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return json({ error: "id manquant." }, 400);
    await s.delete(id);
    return json({ ok: true });
  }

  return json({ error: "Méthode non autorisée." }, 405);
};
