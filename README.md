# La Bulle de Marion

Site vitrine de Marion Lefort — accompagnement bien-être pré et post-natal, soins bébé.
Application React + Vite (single-page, sans router).

## Lancer le projet

```bash
npm install
npm start
```

Le site s'ouvre sur http://localhost:5173

## Scripts disponibles

| Commande          | Effet                                  |
|-------------------|----------------------------------------|
| `npm start`       | Lance le serveur de développement      |
| `npm run dev`     | Identique à `npm start`                |
| `npm run build`   | Génère la version de production (`dist/`) |
| `npm run preview` | Prévisualise le build de production    |

## Arborescence

```
labulledemarion/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # Point d'entrée React
    ├── App.jsx               # Orchestrateur : navigation + layout
    ├── components/
    │   ├── layout/           # Navbar, Footer
    │   └── ui/               # Button, Logo, BrandIcons
    ├── pages/                # Home, Apropos, Soins, Accompagnement, Temoignages, Contact
    │                         # (chaque page a son .module.css)
    ├── hooks/                # useNavigation (rideau), useScrolled
    ├── data/                 # soins.js, packs.js, temoignages.js
    └── styles/               # tokens.css (palette/typo), globals.css
```

## Pages

- **Accueil** — hero, citation, soins en vedette
- **À propos** — présentation de Marion, les trois piliers
- **Les soins** — onglets : *Les soins* (accordéon) · *Packs* · *Cartes cadeaux*
- **L'accompagnement** — philosophie du soin à domicile
- **Témoignages** — retours clients
- **Contact** — coordonnées + formulaire

## Envoi des e-mails (formulaire de contact)

Le formulaire envoie les messages par e-mail via **EmailJS** (aucun serveur backend
nécessaire). Tout est centralisé dans **`src/config/email.js`**.

### Changer le destinataire des messages

Ouvre `src/config/email.js` et modifie **une seule ligne** :

```js
// Pendant les tests
export const CONTACT_EMAIL = "lavergne.marcel@gmail.com";

// Quand le site sera prêt, remplace par :
export const CONTACT_EMAIL = "contact@labulledemarion.fr";
```

### Configuration EmailJS (à faire une fois)

1. Crée un compte gratuit sur https://www.emailjs.com
2. **Email Services** → connecte ta boîte Gmail → copie le **Service ID**
3. **Email Templates** → crée un modèle, puis :
   - dans le champ **To Email**, mets : `{{to_email}}`
   - dans le corps, utilise les variables : `{{from_name}}`, `{{from_email}}`, `{{message}}`
   - copie le **Template ID**
4. **Account → General → API Keys** → copie la **Public Key**
5. Reporte ces 3 valeurs dans `src/config/email.js` :

```js
export const EMAILJS_SERVICE_ID  = "service_xxxxxxx";
export const EMAILJS_TEMPLATE_ID = "template_xxxxxxx";
export const EMAILJS_PUBLIC_KEY  = "xxxxxxxxxxxxxxx";
```

Tant que ces clés ne sont pas renseignées, le formulaire affiche un message
d'erreur explicite au lieu de tenter un envoi.

> Le quota gratuit d'EmailJS est de 200 e-mails/mois, largement suffisant pour démarrer.

## Charte graphique

- Couleurs : lin `#faf3e9`, crème `#f0e4d0`, bois de rose `#b97f63`, terracotta `#a2381c`, rouge `#813a28`
- Typographies : *Italiana* (titres) + *Poppins* (texte)
