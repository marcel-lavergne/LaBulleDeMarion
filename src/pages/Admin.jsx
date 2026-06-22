/* ─────────────────────────────────────────────
   Page — Admin (non listée dans le menu)
   Connexion par mot de passe, puis modération des témoignages :
   valider / modifier / supprimer.
   Le mot de passe n'est jamais dans le code : il est vérifié côté
   serveur (fonction admin-temoignages) contre la variable
   d'environnement ADMIN_PASSWORD de Netlify.
───────────────────────────────────────────── */

import { useState, useEffect } from "react";
import Button from "../components/ui/Button.jsx";
import styles from "./Admin.module.css";

const API = "/.netlify/functions/admin-temoignages";

export default function Admin() {
  const [pw, setPw]           = useState(() => sessionStorage.getItem("admin_pw") || "");
  const [authed, setAuthed]   = useState(false);
  const [list, setList]       = useState([]);
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState("");
  const [editId, setEditId]   = useState(null);
  const [draft, setDraft]     = useState({ author: "", detail: "", text: "" });

  const headers = (p = pw) => ({ "content-type": "application/json", "x-admin-password": p });

  const load = async (p = pw) => {
    setBusy(true); setError("");
    try {
      const res = await fetch(API, { headers: headers(p) });
      if (res.status === 401) {
        setAuthed(false);
        setError("Mot de passe incorrect.");
        sessionStorage.removeItem("admin_pw");
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setList(data);
      setAuthed(true);
      sessionStorage.setItem("admin_pw", p);
    } catch {
      setError("Erreur de chargement. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  // Tentative de reconnexion automatique si un mot de passe est déjà en mémoire de session
  useEffect(() => { if (pw) load(pw); /* eslint-disable-next-line */ }, []);

  const login = (e) => { e.preventDefault(); load(pw); };

  const logout = () => {
    sessionStorage.removeItem("admin_pw");
    setAuthed(false); setPw(""); setList([]); setError("");
  };

  const mutate = async (body) => {
    setBusy(true); setError("");
    try {
      const res = await fetch(API, { method: "PUT", headers: headers(), body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setList((l) => l.map((x) => (x.id === updated.id ? updated : x)));
    } catch {
      setError("Action impossible.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (t) => {
    if (!window.confirm(`Supprimer définitivement le témoignage de « ${t.author} » ?`)) return;
    setBusy(true); setError("");
    try {
      const res = await fetch(`${API}?id=${encodeURIComponent(t.id)}`, { method: "DELETE", headers: headers() });
      if (!res.ok) throw new Error();
      setList((l) => l.filter((x) => x.id !== t.id));
    } catch {
      setError("Suppression impossible.");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (t) => { setEditId(t.id); setDraft({ author: t.author, detail: t.detail || "", text: t.text }); };
  const cancelEdit = () => { setEditId(null); };
  const saveEdit = async (t) => { await mutate({ id: t.id, ...draft }); setEditId(null); };
  const setD = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));

  /* ── Écran de connexion ── */
  if (!authed) {
    return (
      <div className={styles.loginWrap}>
        <form className={styles.loginCard} onSubmit={login}>
          <h1 className="title-display" style={{ fontSize: "1.6rem", marginBottom: "1.4rem" }}>Espace administration</h1>
          <div className="field" style={{ marginBottom: "1.2rem" }}>
            <label>Mot de passe</label>
            <input
              type="password"
              autoFocus
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              disabled={busy}
              placeholder="••••••••"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" variant="fill" fullWidth>
            {busy ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </div>
    );
  }

  const enAttente = list.filter((t) => !t.approved);
  const valides   = list.filter((t) => t.approved);

  const renderCard = (t) => (
    <div key={t.id} className={`${styles.row} ${t.approved ? "" : styles["row--pending"]}`}>
      {editId === t.id ? (
        <div className={styles.editBox}>
          <div className="field" style={{ marginBottom: ".7rem" }}>
            <label>Nom</label>
            <input value={draft.author} onChange={setD("author")} />
          </div>
          <div className="field" style={{ marginBottom: ".7rem" }}>
            <label>Soin / détail</label>
            <input value={draft.detail} onChange={setD("detail")} />
          </div>
          <div className="field" style={{ marginBottom: ".9rem" }}>
            <label>Témoignage</label>
            <textarea value={draft.text} onChange={setD("text")} style={{ minHeight: "120px" }} />
          </div>
          <div className={styles.actions}>
            <Button size="sm" variant="fill" onClick={() => saveEdit(t)}>Enregistrer</Button>
            <Button size="sm" variant="ghost" onClick={cancelEdit}>Annuler</Button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.rowHead}>
            <div>
              <span className={styles.rowName}>{t.author}</span>
              {t.detail && <span className={styles.rowDetail}> · {t.detail}</span>}
            </div>
            {!t.approved && <span className={styles.tagPending}>en attente</span>}
          </div>
          <p className={styles.rowText}>{t.text}</p>
          <div className={styles.actions}>
            {t.approved
              ? <Button size="sm" variant="ghost" onClick={() => mutate({ id: t.id, approved: false })}>Masquer</Button>
              : <Button size="sm" variant="fill"  onClick={() => mutate({ id: t.id, approved: true })}>Valider</Button>}
            <Button size="sm" variant="ghost" onClick={() => startEdit(t)}>Modifier</Button>
            <button type="button" className={styles.danger} onClick={() => remove(t)}>Supprimer</button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.topbar}>
        <h1 className="title-display" style={{ fontSize: "1.7rem" }}>Témoignages — administration</h1>
        <div style={{ display: "flex", gap: ".8rem", alignItems: "center" }}>
          <button type="button" className={styles.refresh} onClick={() => load()} disabled={busy}>
            {busy ? "…" : "Rafraîchir"}
          </button>
          <button type="button" className={styles.refresh} onClick={logout}>Se déconnecter</button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <h2 className={styles.sectionTitle}>En attente de validation ({enAttente.length})</h2>
      {enAttente.length === 0
        ? <p className={styles.empty}>Aucun témoignage en attente.</p>
        : enAttente.map(renderCard)}

      <h2 className={styles.sectionTitle} style={{ marginTop: "2.5rem" }}>Publiés ({valides.length})</h2>
      {valides.length === 0
        ? <p className={styles.empty}>Aucun témoignage publié.</p>
        : valides.map(renderCard)}
    </div>
  );
}
