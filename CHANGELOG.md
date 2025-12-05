# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2025-01-XX

### Ajouté
- Interface utilisateur complète avec formulaire à 2 champs
- Génération automatique de personas via IA (Claude Sonnet 4)
- Recherche web intégrée pour données réelles et actuelles
- Affichage structuré en 8 sections :
  - Démographie
  - Profil professionnel
  - Psychographie
  - Pain Points
  - Objectifs
  - Canaux de communication
  - Comportement d'achat
- Export JSON des personas générés
- Fonction de copie dans le presse-papiers
- Design moderne et responsive avec Tailwind CSS v4
- Support de 3 fournisseurs d'IA :
  - Endpoint par défaut (sans configuration)
  - OpenAI GPT-4
  - Anthropic Claude
- Documentation complète :
  - README.md avec guide complet
  - CONFIGURATION.md pour setup API
  - DEPLOYMENT.md pour déploiement
  - CONTRIBUTING.md pour contributions
- Workflow GitHub Actions pour CI/CD
- License MIT

### Sécurité
- Variables d'environnement protégées
- API keys non exposées côté client
- Validation des inputs utilisateur
- Gestion d'erreurs robuste

## [Unreleased]

### Prévu
- Export PDF des personas
- Système d'authentification
- Historique des personas générés
- Dashboard avec analytics
- Support multi-langues (EN, ES)
- Templates de personas prédéfinis
- Comparaison de plusieurs personas
- API publique

---

[1.0.0]: https://github.com/votre-username/persona-builder/releases/tag/v1.0.0
