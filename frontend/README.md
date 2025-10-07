# Application de gestion des fraudes – Frontend

## Fonctionnalités principales

- Authentification et gestion des utilisateurs
- Ingestion de fichiers de transactions (CSV, JSON)
- Analyse et scoring des transactions pour la détection de fraude
- Affichage du nombre de transactions traitées et d'alertes générées
- Expérience utilisateur moderne et professionnelle

## Améliorations UI/UX récentes

La page d'ingestion des transactions a été entièrement repensée pour offrir une expérience utilisateur digne des grandes plateformes de traitement de données :

- **Interface moderne** basée sur Angular Material (`mat-card`, `mat-divider`, `mat-badge`, `mat-icon`, `mat-progress-bar`, etc.)
- **Upload de fichier** avec feedback immédiat (nom, icône, validation visuelle)
- **Aperçu des premières lignes** du fichier importé pour rassurer l'utilisateur
- **Bouton d'action clair** avec icône et effet de chargement
- **Barre de progression** visible pendant le traitement
- **Messages de succès/erreur** stylisés et explicites
- **Résumé des résultats** avec badges colorés pour le nombre de transactions traitées et d'alertes générées
- **Message d'aperçu** indiquant la présence ou non de transactions suspectes
- **Responsive** et accessible (contrastes, labels, disposition fluide)

## Modules Angular Material utilisés

Pour bénéficier de cette interface, les modules suivants sont importés dans le composant d'ingestion :

- `MatCardModule`
- `MatDividerModule`
- `MatBadgeModule`
- `MatIconModule`
- `MatButtonModule`
- `MatInputModule`
- `MatProgressSpinnerModule`
- `MatProgressBarModule`

## Exemple d'expérience utilisateur

1. L'utilisateur sélectionne un fichier de transactions (CSV ou JSON).
2. Un aperçu des premières lignes s'affiche.
3. Il lance le traitement : une barre de progression apparaît.
4. À la fin, il voit le nombre de transactions traitées, le nombre d'alertes générées, et un message synthétique sur la détection de fraudes.

## Personnalisation

Le style et les messages peuvent être adaptés facilement dans les fichiers `ingestion.component.html` et `ingestion.component.scss`.

---

Pour toute question ou suggestion d'amélioration, n'hésitez pas à ouvrir une issue ou à contacter l'équipe projet.
