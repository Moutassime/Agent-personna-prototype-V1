# Politique de Sécurité

## Versions Supportées

| Version | Support          |
| ------- | ---------------- |
| 1.0.x   | :white_check_mark: |

## Signaler une Vulnérabilité

Si vous découvrez une vulnérabilité de sécurité dans Persona Builder, merci de nous la signaler de manière responsable.

### Comment Signaler

1. **NE PAS** créer d'issue publique sur GitHub
2. Envoyez un email à: [mseiv20@domain.com]
3. Incluez:
   - Description détaillée de la vulnérabilité
   - Steps pour reproduire
   - Impact potentiel
   - Version affectée

### Ce que nous ferons

- Accusé de réception sous 48h
- Évaluation de la criticité
- Développement d'un patch si nécessaire
- Publication d'un fix avec crédit (si souhaité)
- Publication d'un security advisory

## Bonnes Pratiques de Sécurité

### Pour les Développeurs

1. **Variables d'Environnement**
   - Ne jamais committer de fichiers `.env.local`
   - Utiliser `.env.local.example` comme template
   - Stocker les clés API uniquement côté serveur

2. **API Keys**
   - Les clés API doivent rester dans les variables d'environnement
   - Utiliser `NEXT_PUBLIC_` uniquement pour les données non sensibles
   - Rotation régulière des clés

3. **Dépendances**
   - Audit régulier: `npm audit`
   - Mise à jour des dépendances: `npm update`
   - Vérification des CVE connues

### Pour les Utilisateurs

1. **Configuration**
   - Ne partagez jamais vos clés API
   - Utilisez des clés avec scope limité
   - Activez la 2FA sur vos comptes provider (OpenAI, Anthropic)

2. **Déploiement**
   - Utilisez HTTPS en production
   - Configurez les CORS appropriés
   - Activez les rate limits si nécessaire

3. **Monitoring**
   - Surveillez l'usage de votre API
   - Alertes sur les pics inhabituels
   - Logs d'accès réguliers

## Sécurité de l'Application

### Mesures Implémentées

- **Validation des Inputs**: Tous les inputs utilisateur sont validés
- **Timeout Requests**: Limite de 5 minutes sur les requêtes LLM
- **Error Handling**: Pas de leak d'informations sensibles dans les erreurs
- **Dependencies**: Audit régulier avec npm audit
- **TypeScript**: Type safety pour réduire les bugs

### API Rate Limiting

L'application n'implémente pas de rate limiting par défaut. En production, considérez:

\`\`\`typescript
// Exemple avec Vercel
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
})
\`\`\`

### Protection des Données

- Aucune donnée utilisateur n'est stockée par défaut
- Les personas générés restent dans le navigateur
- Pas de tracking externe (sauf Vercel Analytics si déployé)

## Mises à Jour de Sécurité

Surveillez les releases et security advisories:
- GitHub: Activez les notifications
- npm: `npm audit` régulièrement
- Dépendances: Dependabot activé

## Contact

Pour toute question de sécurité: [votre-email@domain.com]

Merci de contribuer à la sécurité de Persona Builder !
