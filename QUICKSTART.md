# Démarrage Rapide

Guide pour lancer Persona Builder en 5 minutes.

## Installation Express

\`\`\`bash
# 1. Cloner le projet
git clone https://github.com/votre-username/persona-builder.git
cd persona-builder

# 2. Installer les dépendances
npm install

# 3. Lancer l'application
npm run dev
\`\`\`

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Première Utilisation

### Étape 1: Remplir le Formulaire
- **Cible**: Décrivez votre audience (ex: "DRH dans des PME")
- **Offre**: Décrivez votre produit/service (ex: "Logiciel de paie automatisé")

### Étape 2: Générer
Cliquez sur "Générer le Persona" et patientez 1-2 minutes.

### Étape 3: Explorer le Résultat
Le persona généré contient:
- Démographie complète
- Profil professionnel
- Psychographie (valeurs, motivations)
- Pain points détaillés
- Objectifs
- Canaux de communication
- Comportement d'achat

### Étape 4: Exporter
- Copiez dans le presse-papiers
- Téléchargez en JSON

## Configuration Avancée (Optionnel)

Par défaut, l'app utilise un endpoint pré-configuré (gratuit, aucune config requise).

Pour utiliser votre propre clé API:

\`\`\`bash
# Créez .env.local
cp .env.local.example .env.local

# Éditez .env.local selon votre provider
\`\`\`

Voir [CONFIGURATION.md](./CONFIGURATION.md) pour plus de détails.

## Commandes Utiles

\`\`\`bash
# Développement
npm run dev

# Build production
npm run build

# Lancer en production
npm run start

# Vérifier le code
npm run lint
\`\`\`

## Déploiement Rapide sur Vercel

\`\`\`bash
# Installez Vercel CLI
npm i -g vercel

# Déployez
vercel
\`\`\`

Ou connectez votre repository GitHub sur [vercel.com](https://vercel.com).

## Exemples de Personas

### Exemple 1: B2B SaaS
- **Cible**: "Directeur Marketing dans des scale-ups tech"
- **Offre**: "Plateforme d'analytics marketing avec IA"

### Exemple 2: E-commerce
- **Cible**: "Femmes actives 30-45 ans soucieuses de leur bien-être"
- **Offre**: "Box mensuelle de produits bio et naturels"

### Exemple 3: Consulting
- **Cible**: "Fondateurs de startups en phase de croissance"
- **Offre**: "Accompagnement en stratégie de levée de fonds"

## Besoin d'Aide ?

- Documentation complète: [README.md](./README.md)
- Configuration: [CONFIGURATION.md](./CONFIGURATION.md)
- Déploiement: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Contribuer: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Issues GitHub: [Ouvrir une issue](https://github.com/votre-username/persona-builder/issues)

Bonne génération de personas !
