# Architecture Technique

Documentation de l'architecture de Persona Builder.

## Vue d'Ensemble

Persona Builder est une application Next.js 16 full-stack qui utilise l'IA pour générer des personas marketing détaillés.

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Form UI   │→ │   API Call   │→ │ Persona Display│ │
│  │  (2 inputs) │  │  (fetch)     │  │   (Results)    │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP POST
                         ↓
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (API Routes)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │          /api/generate-persona                    │  │
│  │                                                    │  │
│  │  1. Web Research (LLM Call)                      │  │
│  │     ↓                                             │  │
│  │  2. Context Assembly                              │  │
│  │     ↓                                             │  │
│  │  3. Persona Generation (LLM Call)                │  │
│  │     ↓                                             │  │
│  │  4. JSON Parsing & Return                        │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    LLM PROVIDERS                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Default   │  │   OpenAI    │  │  Anthropic  │    │
│  │  (endpoint) │  │   (GPT-4o)  │  │   (Claude)  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
\`\`\`

## Stack Technique

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **State Management**: React Hooks (useState)

### Backend
- **Runtime**: Next.js API Routes (Edge Runtime)
- **Language**: TypeScript
- **HTTP Client**: Native fetch
- **Timeout**: AbortController (5 min)
- **Error Handling**: Try/catch avec messages français

### LLM Integration
- **Default Provider**: Endpoint pré-configuré
- **Alternative Providers**: OpenAI, Anthropic
- **Model**: Claude Sonnet 4 (via OpenRouter)
- **Temperature**: 0.7 (research), 0.8 (generation)
- **Max Tokens**: 4096

## Flux de Données

### 1. Input Utilisateur
\`\`\`typescript
interface FormData {
  target: string  // Cible marketing
  offer: string   // Offre/produit
}
\`\`\`

### 2. Recherche Web (Étape 1)
\`\`\`typescript
// Prompt de recherche
const webResearchPrompt = `
  Effectue une recherche sur:
  - CIBLE: ${target}
  - OFFRE: ${offer}
  
  Retourne: démographie, psychographie, 
  pain points, tendances actuelles
`

// Appel LLM
const webContext = await callLLM([{
  role: "user",
  content: webResearchPrompt
}])
\`\`\`

### 3. Génération Persona (Étape 2)
\`\`\`typescript
// Prompt structuré avec contexte
const personaPrompt = `
  Contexte: ${webContext}
  Cible: ${target}
  Offre: ${offer}
  
  Génère un JSON structuré avec:
  - demographie
  - profil_professionnel
  - psychographie
  - pain_points
  - objectifs
  - canaux_communication
  - comportement_achat
`

// Génération
const persona = await callLLM([
  { role: "system", content: SYSTEM_PROMPT },
  { role: "user", content: personaPrompt }
])
\`\`\`

### 4. Parsing & Retour
\`\`\`typescript
// Nettoyage markdown
const cleanedJSON = response
  .replace(/\`\`\`json\n?/g, "")
  .replace(/\`\`\`\n?/g, "")
  .trim()

// Parse
const persona = JSON.parse(cleanedJSON)

// Retour
return NextResponse.json({ persona })
\`\`\`

## Structure des Fichiers

\`\`\`
persona-builder/
├── app/
│   ├── api/
│   │   └── generate-persona/
│   │       └── route.ts          # API endpoint principal
│   ├── layout.tsx                 # Layout avec métadonnées
│   ├── page.tsx                   # Page d'accueil (form + résultats)
│   └── globals.css               # Styles globaux + theme
│
├── components/
│   ├── persona-display.tsx       # Affichage structuré du persona
│   └── ui/                        # Composants shadcn/ui
│
├── .github/
│   └── workflows/
│       └── ci.yml                 # Pipeline CI/CD
│
├── public/                        # Assets statiques
│
├── .env.local.example            # Template de configuration
├── .gitignore                     # Fichiers ignorés
├── package.json                   # Dépendances
├── tsconfig.json                  # Configuration TypeScript
├── README.md                      # Documentation principale
├── CONFIGURATION.md               # Guide de configuration
├── DEPLOYMENT.md                  # Guide de déploiement
├── CONTRIBUTING.md                # Guide de contribution
├── ARCHITECTURE.md                # Ce fichier
├── SECURITY.md                    # Politique de sécurité
├── CHANGELOG.md                   # Historique des versions
├── QUICKSTART.md                  # Guide de démarrage rapide
└── LICENSE                        # Licence MIT
\`\`\`

## Composants Clés

### 1. HomePage (`app/page.tsx`)
**Responsabilités:**
- Affichage du formulaire
- Gestion de l'état (loading, error, persona)
- Appel à l'API
- Affichage conditionnel des résultats

**État:**
\`\`\`typescript
const [target, setTarget] = useState("")
const [offer, setOffer] = useState("")
const [loading, setLoading] = useState(false)
const [persona, setPersona] = useState<any | null>(null)
const [error, setError] = useState<string | null>(null)
\`\`\`

### 2. PersonaDisplay (`components/persona-display.tsx`)
**Responsabilités:**
- Affichage structuré du persona
- Actions (copier, télécharger)
- Mise en forme responsive

**Props:**
\`\`\`typescript
interface PersonaDisplayProps {
  persona: any
  target: string
  offer: string
}
\`\`\`

### 3. API Route (`app/api/generate-persona/route.ts`)
**Responsabilités:**
- Validation des inputs
- Recherche web via LLM
- Génération du persona
- Parsing JSON
- Gestion d'erreurs

**Flow:**
\`\`\`typescript
POST /api/generate-persona
  ↓
1. Validate inputs
  ↓
2. Web research (LLM call 1)
  ↓
3. Generate persona (LLM call 2)
  ↓
4. Parse & clean JSON
  ↓
5. Return { persona }
\`\`\`

## Gestion d'Erreurs

### Frontend
\`\`\`typescript
try {
  const response = await fetch("/api/generate-persona", {...})
  if (!response.ok) throw new Error()
  const data = await response.json()
  setPersona(data.persona)
} catch (err) {
  setError("Une erreur est survenue")
}
\`\`\`

### Backend
\`\`\`typescript
try {
  // ... logic
} catch (error) {
  if (error.name === "AbortError") {
    return NextResponse.json(
      { error: "Timeout" }, 
      { status: 408 }
    )
  }
  return NextResponse.json(
    { error: "Erreur serveur" }, 
    { status: 500 }
  )
}
\`\`\`

## Performance

### Optimisations
- **Server Components**: Rendering côté serveur par défaut
- **Timeout**: 5 minutes pour éviter les blocages infinis
- **Streaming**: Possible upgrade vers streaming SSE
- **Caching**: Headers HTTP appropriés

### Métriques Cibles
- Time to First Byte (TTFB): < 200ms
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Génération persona: 60-120s (dépend du LLM)

## Sécurité

### Mesures
- **Input Validation**: Vérification côté serveur
- **Environment Variables**: Secrets stockés hors du code
- **HTTPS**: Obligatoire en production
- **Timeouts**: Protection contre les requêtes infinies
- **Error Messages**: Pas de leak d'infos sensibles

## Évolutivité

### Améliorations Futures
1. **Streaming**: Affichage progressif du persona
2. **Cache**: Redis pour les personas similaires
3. **Queue**: Bull/BullMQ pour les requêtes longues
4. **Database**: PostgreSQL pour historique
5. **Auth**: NextAuth.js pour multi-utilisateurs
6. **Rate Limiting**: Upstash pour la protection

### Architecture Cible
\`\`\`
Load Balancer → Next.js Apps → Redis Cache
                      ↓
                  PostgreSQL
                      ↓
                 LLM Providers
\`\`\`

## Tests

### À Implémenter
\`\`\`typescript
// Unit tests
describe("PersonaDisplay", () => {
  it("should render all sections", () => {...})
})

// Integration tests
describe("API /generate-persona", () => {
  it("should generate valid persona", async () => {...})
})

// E2E tests
describe("Full flow", () => {
  it("should generate persona from form", () => {...})
})
\`\`\`

## Monitoring

### Métriques à Surveiller
- Taux de succès API
- Temps de génération moyen
- Erreurs LLM
- Usage des tokens
- Coûts par requête

### Outils Recommandés
- **Vercel Analytics**: Performance frontend
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: Monitoring infrastructure

## Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les guidelines d'architecture.

---

Dernière mise à jour: 2025-01-XX
