"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Target, Package, Zap } from "lucide-react"
import { PersonaDisplay } from "@/components/persona-display"

/**
 * Page principale de l'application Persona Builder
 *
 * Permet aux marketeurs de générer des personas clients détaillés
 * en remplissant simplement deux champs : la cible et l'offre.
 */
export default function HomePage() {
  // États pour gérer les inputs utilisateur
  const [target, setTarget] = useState("")
  const [offer, setOffer] = useState("")
  const [loading, setLoading] = useState(false)
  const [persona, setPersona] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fonction de génération du persona
   * Effectue un appel à l'API backend qui :
   * 1. Recherche des données réelles sur le web
   * 2. Génère un persona structuré avec une IA
   */
  const handleGenerate = async () => {
    // Validation des champs
    if (!target.trim() || !offer.trim()) {
      setError("Veuillez remplir les deux champs")
      return
    }

    setLoading(true)
    setError(null)
    setPersona(null)

    try {
      console.log("[v0] Starting fetch to API...")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 180000) // 3 minutes

      // Appel à l'API de génération
      const response = await fetch("/api/generate-persona", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target, offer }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("[v0] Received response:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Erreur lors de la génération")
      }

      const data = await response.json()

      console.log("[v0] Persona received successfully")

      setPersona(data.persona)
    } catch (err) {
      console.error("[v0] Error in handleGenerate:", err)

      if (err instanceof Error && err.name === "AbortError") {
        setError("La génération a pris trop de temps. Veuillez réessayer.")
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête de l'application */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Persona Builder</span>
          </div>
        </div>
      </header>

      {/* Section Hero avec titre et description */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Propulsé par l'IA
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance leading-tight">
            Créez des personas marketing en 2 minutes
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Automatisez la création de profils clients détaillés basés sur des données réelles. Gagnez des heures de
            recherche.
          </p>
        </div>

        {/* Formulaire principal avec deux champs */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="p-8 shadow-xl border-2">
            <div className="space-y-6">
              {/* Champ Cible Marketing */}
              <div>
                <Label htmlFor="target" className="text-base flex items-center gap-2 mb-3 font-medium">
                  <Target className="w-5 h-5 text-primary" />
                  Cible Marketing
                </Label>
                <Input
                  id="target"
                  placeholder="Ex: DRH dans des PME"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="text-base h-12"
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground mt-2">Décrivez votre audience cible</p>
              </div>

              {/* Champ Offre/Produit */}
              <div>
                <Label htmlFor="offer" className="text-base flex items-center gap-2 mb-3 font-medium">
                  <Package className="w-5 h-5 text-primary" />
                  Offre / Produit
                </Label>
                <Input
                  id="offer"
                  placeholder="Ex: Logiciel de paie automatisé"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  className="text-base h-12"
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground mt-2">Quelle solution proposez-vous ?</p>
              </div>

              {/* Message d'erreur si validation échoue */}
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Bouton de génération */}
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full h-14 text-lg font-semibold"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Générer le Persona
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* État de chargement pendant la génération */}
        {loading && (
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 border-2">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin text-primary" />
                  <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Recherche en cours...</h3>
                  <p className="text-muted-foreground">Analyse des données web et génération du persona détaillé</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Affichage des résultats */}
        {persona && !loading && (
          <div className="max-w-5xl mx-auto">
            <PersonaDisplay persona={persona} target={target} offer={offer} />
          </div>
        )}
      </div>

      {/* Pied de page */}
      <footer className="border-t border-border mt-20 bg-card">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Persona Builder - Automatisez vos recherches marketing avec l'IA</p>
        </div>
      </footer>
    </div>
  )
}
