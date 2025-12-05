# Configuration des Fournisseurs LLM

Cette application supporte 3 options pour la génération de personas :

## Option 1 : Endpoint par défaut (Sans configuration)

**Avantages :**
- Aucune clé API requise
- Configuration pré-établie
- Fonctionne immédiatement

**Configuration :**
Aucune configuration nécessaire. L'application fonctionne directement avec un endpoint personnalisé.

---

## Option 2 : OpenAI

**Avantages :**
- Modèles GPT-4 puissants
- Excellente qualité de génération
- Support multilingue robuste

**Configuration :**

1. **Créer un compte OpenAI**
   - Allez sur https://platform.openai.com/signup

2. **Obtenir une clé API**
   - Allez sur https://platform.openai.com/api-keys
   - Cliquez sur "Create new secret key"
   - Copiez la clé (elle commence par `sk-`)

3. **Configurer l'application**
   
   Créez un fichier `.env.local` à la racine du projet :
   \`\`\`bash
   API_PROVIDER=openai
   OPENAI_API_KEY=sk-votre-clé-ici
   OPENAI_MODEL=gpt-4o
   \`\`\`

4. **Modèles disponibles**
   - `gpt-4o` (recommandé)
   - `gpt-4-turbo`
   - `gpt-4`
   - `gpt-3.5-turbo` (plus économique)

5. **Coûts**
   - GPT-4o : ~$5 per 1M input tokens, ~$15 per 1M output tokens
   - Voir https://openai.com/pricing pour les tarifs actuels

---

## Option 3 : Anthropic Claude

**Avantages :**
- Excellente compréhension contextuelle
- Sorties structurées de haute qualité
- Très bon pour l'analyse et la recherche

**Configuration :**

1. **Créer un compte Anthropic**
   - Allez sur https://console.anthropic.com/

2. **Obtenir une clé API**
   - Dans la console, allez sur "API Keys"
   - Cliquez sur "Create Key"
   - Copiez la clé (elle commence par `sk-ant-`)

3. **Configurer l'application**
   
   Créez un fichier `.env.local` à la racine du projet :
   \`\`\`bash
   API_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-votre-clé-ici
   ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
   \`\`\`

4. **Modèles disponibles**
   - `claude-3-5-sonnet-20241022` (recommandé)
   - `claude-3-opus-20240229` (plus puissant)
   - `claude-3-haiku-20240307` (plus rapide)

5. **Coûts**
   - Claude 3.5 Sonnet : ~$3 per 1M input tokens, ~$15 per 1M output tokens
   - Voir https://www.anthropic.com/pricing pour les tarifs actuels

---

## Installation et Démarrage

### 1. Cloner le projet
\`\`\`bash
git clone <votre-repo>
cd persona-builder
\`\`\`

### 2. Installer les dépendances
\`\`\`bash
npm install
\`\`\`

### 3. Configurer les variables d'environnement (optionnel)
\`\`\`bash
# Copiez le fichier d'exemple
cp .env.local.example .env.local

# Éditez .env.local avec vos clés si vous voulez utiliser OpenAI ou Anthropic
nano .env.local  # ou utilisez votre éditeur préféré
\`\`\`

### 4. Lancer l'application en mode développement
\`\`\`bash
npm run dev
\`\`\`

L'application sera accessible sur http://localhost:3000

### 5. Build pour la production
\`\`\`bash
npm run build
npm start
\`\`\`

---

## Comparaison des Fournisseurs

| Critère | Par défaut | OpenAI | Anthropic |
|---------|------------|--------|-----------|
| Configuration | Aucune | Clé API | Clé API |
| Coût | Inclus | Payant | Payant |
| Qualité | Bonne | Excellente | Excellente |
| Vitesse | Moyenne | Rapide | Rapide |
| Recherche web | Intégrée | Bonne | Excellente |

---

## Résolution de Problèmes

### Erreur "API key not found"
- Vérifiez que votre fichier `.env.local` existe à la racine du projet
- Vérifiez que la clé API est correcte (pas d'espaces, guillemets corrects)
- Redémarrez le serveur de développement après modification du `.env.local`

### Erreur "Rate limit exceeded"
- Vous avez dépassé les limites de votre plan API
- Attendez quelques minutes ou passez à un plan supérieur

### Erreur de timeout
- La génération peut prendre 1-2 minutes
- Vérifiez votre connexion internet
- Essayez avec un autre fournisseur

### Les personas ne sont pas en français
- Vérifiez que le SYSTEM_PROMPT dans `app/api/generate-persona/route.ts` contient bien l'instruction de répondre en français

---

## Support

Pour toute question ou problème :
1. Consultez la documentation du fournisseur choisi
2. Vérifiez les logs dans la console du navigateur et du serveur
3. Créez une issue sur le repo GitHub
