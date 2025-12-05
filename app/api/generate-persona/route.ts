import { type NextRequest, NextResponse } from "next/server"

/**
 * Prompt système pour l'IA
 * Définit la structure du persona avec toutes les sections détaillées
 */
const SYSTEM_PROMPT = `Tu es un expert en marketing et en création de personas clients. 

Tu dois créer un persona détaillé et le retourner en JSON avec cette structure:

{
  "nom_persona": "Nom fictif du persona",
  "titre_principal": "Titre court et accrocheur",
  "role_titre": "Rôle professionnel exact",
  "caracteristique_cle": "Une phrase décrivant le défi principal",
  "apercu": "Paragraphe décrivant la personnalité et les besoins",
  "demographie": {
    "tranche_age": "ex: 28-38 ans",
    "localisation": "Lieu principal",
    "formation": "Niveau de formation",
    "taille_entreprise": "Type et taille",
    "experience": "Années d'expérience",
    "etape_carriere": "Niveau actuel"
  },
  "psychographie": {
    "valeurs_fondamentales": [{"valeur": "nom", "description": "détail"}],
    "traits_personnalite": [{"trait": "nom", "description": "détail"}]
  },
  "objectifs_aspirations": {
    "objectifs_professionnels": ["Objectif 1", "Objectif 2"],
    "indicateurs_succes": ["KPI 1", "KPI 2"]
  },
  "pain_points": [
    {"frustration": "Titre", "impact": "Impact", "solution_actuelle": "Ce qu'il fait", "cout_emotionnel": "Ressenti"}
  ],
  "ce_qui_empeche_dormir": "Citation des préoccupations",
  "motivations_moteurs": {
    "principaux_moteurs": [{"moteur": "nom", "description": "détail"}]
  },
  "canaux_preferences": {
    "canaux_principaux": [{"canal": "Nom", "usage": "Comment"}]
  },
  "resume": {
    "description_une_phrase": "Résumé complet",
    "meilleure_facon_convaincre": "Comment le convaincre"
  }
}

Réponds UNIQUEMENT avec le JSON valide, sans markdown ni texte supplémentaire.`

// Configuration du provider d'API (par défaut: default)
const API_PROVIDER = process.env.API_PROVIDER || "default"

/**
 * Fonction générique pour appeler différents LLM
 */
async function callLLM(messages: any[], temperature = 0.7) {
  if (API_PROVIDER === "openai") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4",
        messages,
        temperature,
        max_tokens: 16000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    return await response.json()
  } else if (API_PROVIDER === "anthropic") {
    const systemMessage = messages.find((m: any) => m.role === "system")
    const userMessages = messages.filter((m: any) => m.role !== "system")

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-2",
        max_tokens: 16000,
        system: systemMessage?.content || "",
        messages: userMessages,
        temperature,
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      choices: [
        {
          message: {
            role: "assistant",
            content: data.content[0].text,
          },
        },
      ],
    }
  } else {
    const response = await fetch("https://llm.blackbox.ai/chat/completions", {
      method: "POST",
      headers: {
        customerId: "cus_TWzHCP4ZFn6xBn",
        "Content-Type": "application/json",
        Authorization: "Bearer xxx",
      },
      body: JSON.stringify({
        model: "openrouter/claude-sonnet-4",
        messages,
        temperature,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return await response.json()
  }
}

/**
 * Route API POST /api/generate-persona
 */
export async function POST(request: NextRequest) {
  try {
    const { target, offer } = await request.json()

    if (!target || !offer) {
      return NextResponse.json({ error: "Cible et offre sont requis" }, { status: 400 })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 90000)

    try {
      const webResearchPrompt = `Recherche rapide sur le profil: ${target} pour le produit: ${offer}

Fournis une synthèse concise avec: démographie, contexte pro, pain points, objectifs, comportement d'achat.`

      console.log("[v0] Starting web research...")

      const webResearchData = await callLLM(
        [
          {
            role: "user",
            content: webResearchPrompt,
          },
        ],
        0.7,
      )

      console.log("[v0] Web research completed")

      const webContext = webResearchData.choices[0]?.message?.content || "Pas de contexte disponible"

      const userPrompt = `Contexte:
${webContext}

Crée un persona détaillé en JSON pour:
CIBLE: ${target}
OFFRE: ${offer}

Retourne UNIQUEMENT le JSON complet, sans markdown.`

      console.log("[v0] Starting persona generation...")

      const personaData = await callLLM(
        [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        0.8,
      )

      console.log("[v0] Persona generation completed")

      clearTimeout(timeoutId)

      let personaContent = personaData.choices[0]?.message?.content

      try {
        personaContent = personaContent
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim()

        const persona = JSON.parse(personaContent)

        console.log("[v0] Persona parsed successfully")

        return NextResponse.json({ persona })
      } catch (parseError) {
        console.error("[v0] Error parsing persona JSON:", parseError)
        console.error("[v0] Raw content:", personaContent?.substring(0, 500))
        return NextResponse.json(
          {
            error: "Erreur lors du parsing du persona",
            details: "Le format de réponse n'était pas valide",
          },
          { status: 500 },
        )
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }
  } catch (error) {
    console.error("[v0] Error generating persona:", error)

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          error: "La génération a pris trop de temps. Veuillez réessayer.",
        },
        { status: 408 },
      )
    }

    return NextResponse.json(
      {
        error: "Erreur lors de la génération du persona. Veuillez réessayer.",
      },
      { status: 500 },
    )
  }
}
