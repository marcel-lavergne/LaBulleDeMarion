/* ─────────────────────────────────────────────
   ErrorBoundary — filet de sécurité
   Si une page plante, on affiche un écran doux
   au lieu d'une page blanche. (Doit être un composant
   de classe : c'est une exigence de React.)
───────────────────────────────────────────── */

import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Trace discrète en console, utile pour le débogage
    console.error("Erreur capturée par ErrorBoundary :", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    if (typeof this.props.navigate === "function") this.props.navigate("home");
    else window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 6vw",
          gap: "1rem",
          background: "var(--color-lin)",
        }}
      >
        <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "var(--color-terra)" }}>
          Oups, une petite bulle a éclaté
        </p>
        <p style={{ color: "var(--color-muted)", maxWidth: 460, fontWeight: 300, lineHeight: 1.7 }}>
          Une erreur inattendue s'est produite sur cette page. Vous pouvez revenir à
          l'accueil et reprendre votre navigation en toute douceur.
        </p>
        <button
          onClick={this.handleReset}
          style={{
            marginTop: ".6rem",
            border: "none",
            cursor: "pointer",
            padding: ".85rem 1.9rem",
            borderRadius: "999px",
            background: "var(--color-terra)",
            color: "var(--color-lin)",
            fontSize: ".8rem",
            letterSpacing: ".05em",
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }
}
