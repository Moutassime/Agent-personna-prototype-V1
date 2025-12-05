# Guide de Déploiement GitHub


Ce guide vous explique comment mettre votre projet Persona Builder sur GitHub et le déployer en production.

## Prérequis

- Un compte GitHub
- Git installé sur votre machine
- Node.js 18+ installé

## Étape 1: Préparer le Projet Localement

1. **Vérifier que tout fonctionne**
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`
   Testez l'application sur http://localhost:3000

2. **Créer le fichier .env.local** (si vous utilisez vos propres clés API)
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   Ajoutez vos clés API si nécessaire. Sinon, l'app fonctionnera avec l'endpoint par défaut.

## Étape 2: Initialiser Git et Pousser sur GitHub

1. **Initialiser le repository Git** (si pas déjà fait)
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit: Persona Builder SaaS"
   \`\`\`

2. **Créer un nouveau repository sur GitHub**
   - Allez sur https://github.com/new
   - Nommez le repository: `persona-builder` (ou autre nom)
   - NE PAS initialiser avec README (vous en avez déjà un)
   - Créez le repository

3. **Lier et pousser le code**
   \`\`\`bash
   git remote add origin https://github.com/VOTRE_USERNAME/persona-builder.git
   git branch -M main
   git push -u origin main
   \`\`\`

## Étape 3: Déployer sur Vercel

### Option A: Déploiement Automatique depuis GitHub

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "Add New Project"
4. Sélectionnez votre repository `persona-builder`
5. Configurez le projet:
   - **Framework Preset**: Next.js (détecté automatiquement)
   - **Root Directory**: `./` (racine)
   - **Build Command**: `npm run build` (par défaut)
6. **Variables d'environnement** (optionnel si vous utilisez vos propres clés):
   - Cliquez sur "Environment Variables"
   - Ajoutez vos clés si nécessaire:
     - `API_PROVIDER` → `openai` ou `anthropic` (si vous changez)
     - `OPENAI_API_KEY` → votre clé OpenAI
     - `ANTHROPIC_API_KEY` → votre clé Anthropic
7. Cliquez sur "Deploy"

### Option B: Déploiement via CLI Vercel

\`\`\`bash
npm i -g vercel
vercel login
vercel
\`\`\`

Suivez les instructions à l'écran.

## Étape 4: Configurer les Variables d'Environnement en Production

Si vous utilisez vos propres clés API:

1. Dans le dashboard Vercel, allez dans votre projet
2. Settings → Environment Variables
3. Ajoutez:
   - `API_PROVIDER` = `openai` ou `anthropic`
   - `OPENAI_API_KEY` = votre clé (si OpenAI)
   - `ANTHROPIC_API_KEY` = votre clé (si Anthropic)
4. Redéployez: Settings → Deployments → Redeploy

## Étape 5: Tester en Production

1. Visitez l'URL fournie par Vercel (ex: https://persona-builder.vercel.app)
2. Testez la génération de persona
3. Vérifiez les logs dans le dashboard Vercel en cas d'erreur

## Configuration du Domaine Personnalisé (Optionnel)

1. Dans Vercel: Settings → Domains
2. Ajoutez votre domaine (ex: persona-builder.com)
3. Suivez les instructions DNS

## Mise à Jour du Code

Après chaque modification:

\`\`\`bash
git add .
git commit -m "Description des changements"
git push origin main
\`\`\`

Vercel redéploiera automatiquement!

## Monitoring et Logs

- **Logs en temps réel**: Dashboard Vercel → votre projet → Logs
- **Analytics**: Dashboard Vercel → votre projet → Analytics
- **Performance**: Lighthouse CI intégré automatiquement

## Dépannage

### Erreur de build
- Vérifiez les logs de build dans Vercel
- Assurez-vous que `package.json` est correct
- Vérifiez que toutes les dépendances sont installées

### Erreur d'API
- Vérifiez vos variables d'environnement
- Consultez les logs de fonction dans Vercel
- Testez localement d'abord avec `npm run dev`

### Timeout
- Les fonctions serverless Vercel ont un timeout de 10s (plan gratuit)
- Si nécessaire, passez à un plan Pro pour 60s de timeout

## Sécurité

- Ne jamais commit `.env.local` (c'est dans `.gitignore`)
- Utilisez les variables d'environnement Vercel pour les secrets
- Activez la protection de branche sur GitHub (Settings → Branches)

## Support

Pour toute question:
- Documentation Next.js: https://nextjs.org/docs
- Documentation Vercel: https://vercel.com/docs
- GitHub Issues: Créez une issue dans votre repository
