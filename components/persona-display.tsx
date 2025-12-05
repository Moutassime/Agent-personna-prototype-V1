"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, User, Target, Heart, AlertCircle, TrendingUp, MessageSquare } from "lucide-react"
import { useState } from "react"

/**
 * Interface pour les props du composant PersonaDisplay
 */
interface PersonaDisplayProps {
  persona: any
  target: string
  offer: string
}

/**
 * Composant d'affichage du persona - RÉSUMÉ VISUEL
 *
 * Affiche les points essentiels du persona sur la page web
 * + Bouton pour télécharger le PDF complet avec TOUS les détails
 */
export function PersonaDisplay({ persona, target, offer }: PersonaDisplayProps) {
  /**
   * Génère et télécharge le PDF complet
   */
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ persona, target, offer }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du PDF")
      }

      // Récupérer le blob PDF
      const blob = await response.blob()

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `persona-${target.slice(0, 30).replace(/\s+/g, "-")}.pdf`
      document.body.appendChild(a)
      a.click()

      // Nettoyage
      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error("Erreur PDF:", error)
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  /**
   * Télécharge le JSON brut
   */
  const handleDownloadJSON = () => {
    const text = JSON.stringify(persona, null, 2)
    const blob = new Blob([text], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `persona-${target.slice(0, 20).replace(/\s+/g, "-")}.json`
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()

    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 100)
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec nom du persona et actions */}
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
          {persona.titre_principal || "Persona Généré"}
        </div>
        <h2 className="text-4xl font-bold">{persona.nom_persona || "Votre Persona"}</h2>
        <p className="text-xl text-muted-foreground">{persona.role_titre}</p>

        {persona.caracteristique_cle && (
          <p className="text-lg font-medium max-w-3xl mx-auto border-l-4 border-primary pl-4 py-2">
            {persona.caracteristique_cle}
          </p>
        )}

        {/* Boutons d'action principaux */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button size="lg" onClick={handleDownloadPDF} className="gap-2" disabled={isGeneratingPDF}>
            <FileText className="w-5 h-5" />
            {isGeneratingPDF ? "Génération en cours..." : "Télécharger le PDF Complet"}
          </Button>
          <Button size="lg" variant="outline" onClick={handleDownloadJSON} className="gap-2 bg-transparent">
            <Download className="w-5 h-5" />
            Télécharger JSON
          </Button>
        </div>
      </div>

      {/* Aperçu */}
      {persona.apercu && (
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-bold mb-3">Aperçu du Persona</h3>
          <p className="text-base leading-relaxed">{persona.apercu}</p>
        </Card>
      )}

      {/* Section Démographie - RÉSUMÉ */}
      <Card className="p-6 border-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Démographie</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Âge</p>
            <p className="text-base">{persona.demographie?.tranche_age || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Formation</p>
            <p className="text-base">{persona.demographie?.formation || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Localisation</p>
            <p className="text-base">{persona.demographie?.localisation || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Expérience</p>
            <p className="text-base">{persona.demographie?.experience || "N/A"}</p>
          </div>
        </div>
      </Card>

      {/* Section Pain Points - TOP 3 */}
      <Card className="p-6 border-2 border-destructive/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="text-xl font-bold">Pain Points Principaux</h3>
        </div>
        <div className="space-y-4">
          {persona.pain_points?.slice(0, 3).map((pain: any, idx: number) => (
            <div key={idx} className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <p className="font-semibold text-destructive mb-2">{pain.frustration}</p>
              <p className="text-sm text-muted-foreground">{pain.impact}</p>
            </div>
          ))}
        </div>
        {persona.ce_qui_empeche_dormir && (
          <div className="mt-4 p-3 bg-destructive/10 rounded border-l-4 border-destructive">
            <p className="text-sm italic">"{persona.ce_qui_empeche_dormir}"</p>
          </div>
        )}
      </Card>

      {/* Section Objectifs */}
      <Card className="p-6 border-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Objectifs & Aspirations</h3>
        </div>
        <div className="space-y-3">
          {persona.objectifs_aspirations?.objectifs_professionnels?.map((obj: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2">
              <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{obj}</span>
            </div>
          ))}
        </div>
        {persona.objectifs_aspirations?.indicateurs_succes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-2">KPIs de Succès</p>
            <div className="flex flex-wrap gap-2">
              {persona.objectifs_aspirations.indicateurs_succes.map((kpi: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {kpi}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Section Psychographie - RÉSUMÉ */}
      <Card className="p-6 border-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Psychographie</h3>
        </div>
        <div className="space-y-4">
          {persona.psychographie?.valeurs_fondamentales && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Valeurs Fondamentales</p>
              <div className="space-y-2">
                {persona.psychographie.valeurs_fondamentales.slice(0, 3).map((val: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                    <div>
                      <span className="font-medium">{val.valeur}:</span>
                      <span className="text-muted-foreground ml-1">{val.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Section Canaux de Communication */}
      <Card className="p-6 border-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Canaux de Communication</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {persona.canaux_preferences?.canaux_principaux?.map((canal: any, idx: number) => (
            <div key={idx} className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
              {canal.canal || canal}
            </div>
          ))}
        </div>
      </Card>

      {/* Section Résumé */}
      {persona.resume && (
        <Card className="p-6 bg-accent/5 border-accent/20 border-2">
          <h3 className="text-xl font-bold mb-4">Résumé</h3>
          <div className="space-y-3">
            {persona.resume.description_une_phrase && (
              <p className="text-base leading-relaxed">{persona.resume.description_une_phrase}</p>
            )}
            {persona.resume.meilleure_facon_convaincre && (
              <div className="p-3 bg-accent/10 rounded">
                <p className="text-sm font-medium mb-1">Comment le convaincre:</p>
                <p className="text-sm">{persona.resume.meilleure_facon_convaincre}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Call to action final */}
      <div className="text-center py-8 space-y-4">
        <p className="text-lg text-muted-foreground">
          Ce résumé montre les points essentiels. Pour accéder à TOUS les détails...
        </p>
        <Button size="lg" onClick={handleDownloadPDF} className="gap-2" disabled={isGeneratingPDF}>
          <FileText className="w-5 h-5" />
          {isGeneratingPDF ? "Génération en cours..." : "Télécharger le PDF Complet (Toutes les Sections)"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Le PDF contient toutes les sections détaillées: Contexte de travail, Jobs-to-be-done, Parcours d'achat,
          Messages qui résonnent, Guide d'activation, et plus encore.
        </p>
      </div>
    </div>
  )
}
