# Glabdoul

Site vitrine one-page de Lucas Matthes, vidéaste et réalisateur freelance.

## Structure

- `index.html` — page unique (hero, prestations, matériel, créateurs, contact, footer)
- `css/styles.css` — thème obsidienne, variables CSS en tête de fichier
- `js/main.js` — menu mobile, navbar au scroll, ancre active, animations, formulaire
- `.github/workflows/deploy.yml` — déploiement GitHub Pages

## Configuration manuelle

- **Formulaire** : dans `js/main.js`, renseignez `FORM_ENDPOINT` et `FORM_FIELD_IDS` (URL `formResponse` de votre Google Form + IDs `entry.XXXXXX`). Tant que `FORM_ENDPOINT` est `null`, le formulaire bascule sur un fallback `mailto`.
- **Tarifs** : sur chaque carte de prestation, passez `data-price-visible="true"` et modifiez `data-price`.
- **Showreel** : dans `index.html`, section hero, remplacez le placeholder par un embed YouTube/Vimeo ou un fichier `/videos/showreel.mp4`.
- **og:image** : ajoutez `/images/og-cover.webp` (1200×630) et décommentez la balise correspondante.

## Déploiement GitHub Pages

1. Poussez ce dépôt sur GitHub (branche `main`).
2. Dans **Settings > Pages**, choisissez **Source : GitHub Actions**.
3. Le workflow `deploy.yml` publie le site à chaque push sur `main`.
