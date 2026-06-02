# Notes — SEO, version mobile & routage par page

Récapitulatif des optimisations apportées (les photos restent celles en place).

## 🔗 Routage par page (URLs réelles) — NOUVEAU

Avant, tout le site vivait sur une seule adresse. Désormais chaque page a sa
propre URL :

| Page             | Adresse            |
|------------------|--------------------|
| Accueil          | /                  |
| À propos         | /a-propos          |
| Les soins        | /soins             |
| L'accompagnement | /accompagnement    |
| Témoignages      | /temoignages       |
| Contact          | /contact           |

- L'animation du rideau est CONSERVÉE : le routage a été ajouté par-dessus.
- Les boutons Précédent / Suivant du navigateur fonctionnent.
- Chaque page a son propre titre et sa propre description (centralisés dans
  src/config/routes.js).
- Les liens navbar/footer sont de vrais liens <a href> : Google peut les
  suivre, et tu peux les ouvrir dans un nouvel onglet.
- public/_redirects dit à Netlify de servir l'app sur toutes les URLs (sinon
  /soins renverrait une 404 au rafraîchissement).
- sitemap.xml liste les 6 pages.

## 🔍 SEO

- index.html : titre optimisé, meta description, Open Graph + Twitter Card
  (aperçu au partage WhatsApp / Instagram / Facebook), lien canonique, theme.
- Favicon aux couleurs de la marque + image de partage og-image.jpg.
- Données structurées « entreprise locale » (nom, téléphone, email, zone,
  services).
- robots.txt + sitemap.xml.

## 📱 Version mobile

- Menu burger dans la navbar (affichage ordinateur inchangé).
- Mise à l'échelle douce du texte sur petits écrans.
- Hero d'accueil, footer et grilles adaptés au mobile.

## ⚠️ À penser

- Les adresses pointent vers labulledemarion.netlify.app. Quand tu activeras
  labulledemarion.fr, remplace cette adresse dans : src/config/routes.js
  (constante SITE_URL), index.html, public/robots.txt et public/sitemap.xml.
- Le site reste rendu côté navigateur (Google sait lire le JS ; pour un
  référencement maximal, on pourrait passer au pré-rendu statique plus tard).

## 🚀 Déploiement

Ton site Netlify se redéploie depuis GitHub : pousse ces changements
(commit + push) et Netlify s'occupe du reste.
