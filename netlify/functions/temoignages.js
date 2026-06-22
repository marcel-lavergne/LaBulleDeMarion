/* ═══════════════════════════════════════════════════════════════
   Fonction PUBLIQUE — /.netlify/functions/temoignages
   • GET  → liste des témoignages VALIDÉS (les seuls visibles)
   • POST → dépôt d'un témoignage par un visiteur (statut « en attente »,
            invisible tant que tu ne l'as pas validé dans /admin)
═══════════════════════════════════════════════════════════════ */

import { readAll, writeAll, json } from "./_data.js";

export default async (req) => {
  if (req.method === "GET") {
    const all = await readAll();
    const visibles = all
      .filter((t) => t.approved)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(({ id, text, author, detail }) => ({ id, text, author, detail }));
    return json(visibles);
  }

  if (req.method === "POST") {
    let body = null;
    try { body = await req.json(); } catch { /* ignore */ }

    const author = (body?.author || "").toString().trim();
    const text   = (body?.text   || "").toString().trim();
    const detail = (body?.detail || "").toString().trim();

    if (!author || !text) {
      return json({ error: "Le nom et le témoignage sont obligatoires." }, 400);
    }

    const all = await readAll();
    all.push({
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author: author.slice(0, 120),
      detail: detail.slice(0, 160),
      text: text.slice(0, 2000),
      approved: false,            // ← en attente de validation
      createdAt: Date.now(),
    });
    await writeAll(all);

    return json({ ok: true }, 201);
  }

  return json({ error: "Méthode non autorisée." }, 405);
};
