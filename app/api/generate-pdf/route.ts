import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { persona, target, offer } = await request.json()

    // Créer le PDF
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - 2 * margin
    let yPosition = 20

    // Fonction pour ajouter du texte avec retour à la ligne automatique
    const addText = (text: string, fontSize = 10, isBold = false) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        yPosition = 20
      }
      doc.setFontSize(fontSize)
      if (isBold) {
        doc.setFont("helvetica", "bold")
      } else {
        doc.setFont("helvetica", "normal")
      }
      const lines = doc.splitTextToSize(text, contentWidth)
      doc.text(lines, margin, yPosition)
      yPosition += lines.length * (fontSize * 0.5) + 5
    }

    const addSection = (title: string) => {
      yPosition += 10
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      doc.setFillColor(139, 92, 246)
      doc.rect(margin, yPosition - 5, contentWidth, 10, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text(title, margin + 5, yPosition + 2)
      doc.setTextColor(0, 0, 0)
      yPosition += 15
    }

    // En-tête du document
    doc.setFillColor(139, 92, 246)
    doc.rect(0, 0, pageWidth, 40, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text(persona.nom_persona || "Persona Marketing", pageWidth / 2, 20, { align: "center" })
    doc.setFontSize(14)
    doc.text(persona.role_titre || "", pageWidth / 2, 30, { align: "center" })
    doc.setTextColor(0, 0, 0)
    yPosition = 50

    // Caractéristique clé
    if (persona.caracteristique_cle) {
      doc.setFillColor(240, 240, 255)
      doc.rect(margin, yPosition, contentWidth, 20, "F")
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      const keyLines = doc.splitTextToSize(persona.caracteristique_cle, contentWidth - 10)
      doc.text(keyLines, margin + 5, yPosition + 7)
      yPosition += 30
    }

    // Aperçu
    if (persona.apercu) {
      addSection("APERÇU DU PERSONA")
      addText(persona.apercu, 10)
    }

    // Démographie
    if (persona.demographie) {
      addSection("DÉMOGRAPHIE")
      if (persona.demographie.tranche_age) addText(`Âge: ${persona.demographie.tranche_age}`, 10, true)
      if (persona.demographie.localisation) addText(`Localisation: ${persona.demographie.localisation}`, 10)
      if (persona.demographie.formation) addText(`Formation: ${persona.demographie.formation}`, 10)
      if (persona.demographie.taille_entreprise) addText(`Entreprise: ${persona.demographie.taille_entreprise}`, 10)
      if (persona.demographie.experience) addText(`Expérience: ${persona.demographie.experience}`, 10)
      if (persona.demographie.etape_carriere) addText(`Carrière: ${persona.demographie.etape_carriere}`, 10)
    }

    // Psychographie
    if (persona.psychographie) {
      addSection("PSYCHOGRAPHIE")
      if (persona.psychographie.valeurs_fondamentales) {
        addText("Valeurs Fondamentales:", 11, true)
        persona.psychographie.valeurs_fondamentales.forEach((val: any) => {
          addText(`• ${val.valeur}: ${val.description}`, 10)
        })
      }
      if (persona.psychographie.traits_personnalite) {
        addText("Traits de Personnalité:", 11, true)
        persona.psychographie.traits_personnalite.forEach((trait: any) => {
          addText(`• ${trait.trait}: ${trait.description}`, 10)
        })
      }
    }

    // Objectifs & Aspirations
    if (persona.objectifs_aspirations) {
      addSection("OBJECTIFS & ASPIRATIONS")
      if (persona.objectifs_aspirations.objectifs_professionnels) {
        addText("Objectifs Professionnels:", 11, true)
        persona.objectifs_aspirations.objectifs_professionnels.forEach((obj: string) => {
          addText(`• ${obj}`, 10)
        })
      }
      if (persona.objectifs_aspirations.objectifs_personnels) {
        addText("Objectifs Personnels:", 11, true)
        persona.objectifs_aspirations.objectifs_personnels.forEach((obj: string) => {
          addText(`• ${obj}`, 10)
        })
      }
      if (persona.objectifs_aspirations.indicateurs_succes) {
        addText("Indicateurs de Succès:", 11, true)
        addText(persona.objectifs_aspirations.indicateurs_succes.join(", "), 10)
      }
    }

    // Pain Points
    if (persona.pain_points) {
      addSection("POINTS DE DOULEUR & DÉFIS")
      persona.pain_points.forEach((pain: any, idx: number) => {
        addText(`Frustration ${idx + 1}: ${pain.frustration}`, 11, true)
        if (pain.impact) addText(`Impact: ${pain.impact}`, 10)
        if (pain.solution_actuelle) addText(`Solution actuelle: ${pain.solution_actuelle}`, 10)
        if (pain.cout_emotionnel) addText(`Coût émotionnel: ${pain.cout_emotionnel}`, 10)
        yPosition += 5
      })
      if (persona.ce_qui_empeche_dormir) {
        addText(`Ce qui l'empêche de dormir: "${persona.ce_qui_empeche_dormir}"`, 10, true)
      }
    }

    // Motivations
    if (persona.motivations) {
      addSection("MOTIVATIONS & MOTEURS")
      if (persona.motivations.principaux_moteurs) {
        addText("Principaux Moteurs:", 11, true)
        persona.motivations.principaux_moteurs.forEach((moteur: any) => {
          addText(`• ${moteur.moteur}: ${moteur.description}`, 10)
        })
      }
      if (persona.motivations.moteurs_decision) {
        addText("Moteurs de Décision:", 11, true)
        persona.motivations.moteurs_decision.forEach((moteur: string) => {
          addText(`• ${moteur}`, 10)
        })
      }
    }

    // Craintes & Objections
    if (persona.craintes_objections) {
      addSection("CRAINTES & OBJECTIONS")
      if (persona.craintes_objections.craintes) {
        addText("Craintes:", 11, true)
        persona.craintes_objections.craintes.forEach((crainte: string) => {
          addText(`• ${crainte}`, 10)
        })
      }
      if (persona.craintes_objections.objections_courantes) {
        addText("Objections Courantes:", 11, true)
        persona.craintes_objections.objections_courantes.forEach((objection: string) => {
          addText(`• ${objection}`, 10)
        })
      }
    }

    // Contexte de Travail
    if (persona.contexte_travail) {
      addSection("CONTEXTE DE TRAVAIL")
      if (persona.contexte_travail.responsabilites) {
        addText("Responsabilités Quotidiennes:", 11, true)
        persona.contexte_travail.responsabilites.forEach((resp: string) => {
          addText(`• ${resp}`, 10)
        })
      }
      if (persona.contexte_travail.outils_technologies) {
        addText("Outils & Technologies:", 11, true)
        addText(persona.contexte_travail.outils_technologies.join(", "), 10)
      }
      if (persona.contexte_travail.kpis) {
        addText("KPIs:", 11, true)
        persona.contexte_travail.kpis.forEach((kpi: string) => {
          addText(`• ${kpi}`, 10)
        })
      }
    }

    // Jobs-to-be-Done
    if (persona.jobs_to_be_done) {
      addSection("JOBS-TO-BE-DONE")
      if (persona.jobs_to_be_done.jobs_fonctionnels) {
        addText("Jobs Fonctionnels:", 11, true)
        persona.jobs_to_be_done.jobs_fonctionnels.forEach((job: string) => {
          addText(`• ${job}`, 10)
        })
      }
      if (persona.jobs_to_be_done.jobs_emotionnels) {
        addText("Jobs Émotionnels:", 11, true)
        persona.jobs_to_be_done.jobs_emotionnels.forEach((job: string) => {
          addText(`• ${job}`, 10)
        })
      }
      if (persona.jobs_to_be_done.jobs_sociaux) {
        addText("Jobs Sociaux:", 11, true)
        persona.jobs_to_be_done.jobs_sociaux.forEach((job: string) => {
          addText(`• ${job}`, 10)
        })
      }
    }

    // Parcours d'Achat
    if (persona.parcours_achat) {
      addSection("PARCOURS D'ACHAT")
      if (persona.parcours_achat.awareness) {
        addText("Étape de Conscience (Awareness):", 11, true)
        addText(JSON.stringify(persona.parcours_achat.awareness, null, 2), 9)
      }
      if (persona.parcours_achat.consideration) {
        addText("Étape de Considération:", 11, true)
        addText(JSON.stringify(persona.parcours_achat.consideration, null, 2), 9)
      }
      if (persona.parcours_achat.decision) {
        addText("Étape de Décision:", 11, true)
        addText(JSON.stringify(persona.parcours_achat.decision, null, 2), 9)
      }
    }

    // Canaux & Préférences
    if (persona.canaux_preferences) {
      addSection("CANAUX & PRÉFÉRENCES DE CONTENU")
      if (persona.canaux_preferences.canaux_principaux) {
        addText("Canaux Principaux:", 11, true)
        persona.canaux_preferences.canaux_principaux.forEach((canal: any) => {
          const canalText = typeof canal === "string" ? canal : canal.canal
          addText(`• ${canalText}`, 10)
        })
      }
      if (persona.canaux_preferences.types_contenu_preferes) {
        addText("Types de Contenu Préférés:", 11, true)
        persona.canaux_preferences.types_contenu_preferes.forEach((type: string) => {
          addText(`• ${type}`, 10)
        })
      }
    }

    // Messages qui Résonnent
    if (persona.messages_resonnent) {
      addSection("MESSAGES QUI RÉSONNENT")
      if (persona.messages_resonnent.langage_utilise) {
        addText("Langage:", 11, true)
        addText(persona.messages_resonnent.langage_utilise.join(", "), 10)
      }
      if (persona.messages_resonnent.themes_porteurs) {
        addText("Thèmes Porteurs:", 11, true)
        persona.messages_resonnent.themes_porteurs.forEach((theme: any) => {
          addText(`• ${theme.theme}: ${theme.message}`, 10)
        })
      }
    }

    // Guide d'Activation
    if (persona.guide_activation) {
      addSection("GUIDE D'ACTIVATION")
      if (persona.guide_activation.comment_atteindre) {
        addText("Comment l'Atteindre:", 11, true)
        persona.guide_activation.comment_atteindre.forEach((methode: string) => {
          addText(`• ${methode}`, 10)
        })
      }
      if (persona.guide_activation.messages_cles) {
        addText("Messages Clés:", 11, true)
        persona.guide_activation.messages_cles.forEach((msg: string) => {
          addText(`• ${msg}`, 10)
        })
      }
    }

    // Résumé
    if (persona.resume) {
      addSection("RÉSUMÉ DU PERSONA")
      if (persona.resume.description_une_phrase) {
        addText("Description:", 11, true)
        addText(persona.resume.description_une_phrase, 10)
      }
      if (persona.resume.meilleure_facon_convaincre) {
        addText("Comment le Convaincre:", 11, true)
        addText(persona.resume.meilleure_facon_convaincre, 10)
      }
      if (persona.resume.ce_qui_rend_unique) {
        addText("Ce qui le Rend Unique:", 11, true)
        addText(persona.resume.ce_qui_rend_unique, 10)
      }
    }

    // Pied de page sur chaque page
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`Persona Builder - ${new Date().toLocaleDateString("fr-FR")}`, margin, pageHeight - 10)
      doc.text(`Page ${i}/${totalPages}`, pageWidth - margin, pageHeight - 10, { align: "right" })
    }

    // Générer le PDF en buffer
    const pdfBuffer = doc.output("arraybuffer")

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="persona-${target.slice(0, 30).replace(/\s+/g, "-")}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Erreur génération PDF:", error)
    return NextResponse.json({ error: "Erreur lors de la génération du PDF" }, { status: 500 })
  }
}
