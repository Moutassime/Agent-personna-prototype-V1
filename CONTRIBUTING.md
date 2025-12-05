# Guide de Contribution

Merci de votre intérêt pour contribuer à Persona Builder!

## Structure du Projet

\`\`\`
persona-builder/
├── app/
│   ├── api/
│   │   └── generate-persona/
│   │       └── route.ts          # API route pour génération
│   ├── page.tsx                  # Page principale
│   ├── layout.tsx                # Layout racine
│   └── globals.css               # Styles globaux
├── components/
│   ├── ui/                       # Composants shadcn/ui
│   └── persona-display.tsx       # Composant d'affichage persona
├── .env.local.example            # Template variables d'environnement
├── .gitignore                    # Fichiers ignorés par Git
├── README.md                     # Documentation principale
├── CONFIGURATION.md              # Guide de configuration API
├── DEPLOYMENT.md                 # Guide de déploiement
└── package.json                  # Dépendances
\`\`\`

## Prérequis pour Développer

- Node.js 18 ou supérieur
- npm ou yarn
- Un éditeur de code (VS Code recommandé)

## Installation Locale

1. **Cloner le repository**
   \`\`\`bash
   git clone https://github.com/VOTRE_USERNAME/persona-builder.git
   cd persona-builder
   \`\`\`

2. **Installer les dépendances**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configurer les variables d'environnement** (optionnel)
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   L'app fonctionne sans configuration grâce à l'endpoint par défaut.

4. **Lancer le serveur de développement**
   \`\`\`bash
   npm run dev
   \`\`\`
   Ouvrez http://localhost:3000

## Workflow de Contribution

1. **Créer une branche**
   \`\`\`bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   \`\`\`

2. **Développer et tester**
   - Écrivez du code propre et commenté
   - Testez localement
   - Vérifiez qu'il n'y a pas d'erreurs

3. **Commit avec un message descriptif**
   \`\`\`bash
   git add .
   git commit -m "feat: ajout de [fonctionnalité]"
   \`\`\`

   Conventions de commit:
   - `feat:` nouvelle fonctionnalité
   - `fix:` correction de bug
   - `docs:` mise à jour documentation
   - `style:` formatage, style
   - `refactor:` refactoring code
   - `test:` ajout de tests
   - `chore:` maintenance

4. **Pousser la branche**
   \`\`\`bash
   git push origin feature/ma-nouvelle-fonctionnalite
   \`\`\`

5. **Créer une Pull Request**
   - Allez sur GitHub
   - Cliquez sur "Compare & pull request"
   - Décrivez vos changements en détail
   - Attendez la revue de code

## Standards de Code

### TypeScript
- Utilisez TypeScript strict
- Définissez les types/interfaces pour toutes les données
- Évitez `any` sauf si absolument nécessaire

### React
- Utilisez les hooks modernes (useState, useEffect, etc.)
- Composants fonctionnels uniquement
- Nommage: PascalCase pour les composants

### Style
- Utilisez Tailwind CSS
- Suivez les conventions de design existantes
- Responsive first (mobile → desktop)

### Commentaires
- Commentez les fonctions complexes
- Utilisez JSDoc pour les fonctions publiques
- Expliquez le "pourquoi", pas le "quoi"

## Tests

Avant de créer une PR:
1. Testez manuellement toutes les fonctionnalités affectées
2. Vérifiez qu'il n'y a pas d'erreurs console
3. Testez sur mobile et desktop
4. Vérifiez que le build passe: `npm run build`

## Idées de Contributions

### Fonctionnalités
- Export PDF des personas
- Historique des personas générés
- Système d'authentification utilisateur
- Comparaison de plusieurs personas
- Templates de personas prédéfinis
- Support multi-langues

### Améliorations
- Tests unitaires et e2e
- Amélioration de l'UI/UX
- Optimisation des performances
- Documentation API
- Thème sombre/clair

### Bugs
- Consultez les Issues GitHub
- Signalez les bugs que vous trouvez
- Proposez des solutions

## Code Review

Les PRs seront examinées selon:
- Qualité du code
- Respect des standards
- Tests effectués
- Documentation mise à jour
- Pas de régression

## Questions?

- Ouvrez une Discussion GitHub
- Créez une Issue pour les bugs
- Consultez la documentation existante

Merci de contribuer à Persona Builder! 🚀
