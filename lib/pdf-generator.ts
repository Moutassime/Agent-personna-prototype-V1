import { default as jsPDF } from "jspdf"

/**
 * Génère un PDF complet et détaillé du persona
 * Inspiré du format de l'exemple fourni par l'utilisateur
 *
 * @param persona - Objet persona complet
 * @param target - Cible marketing
 * @param offer - Offre/produit
 */
export async function generatePersonaPDF(persona: any, target: string, offer: string) {
  console.log("[v0] Initialisation de jsPDF")

  try {
    const doc = new jsPDF()
    console.log("[v0] jsPDF initialisé avec succès")

    let yPos = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const maxWidth = pageWidth - 2 * margin

    /**
     * Ajoute une nouvelle page si nécessaire
     */
    const checkPageBreak = (neededSpace = 20) => {
      if (yPos + neededSpace > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage()
        yPos = 20
      }
    }

    /**
     * Ajoute un titre principal
     */
    const addMainTitle = (text: string) => {
      checkPageBreak(30)
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text(text, margin, yPos)
      yPos += 12
    }

    /**
     * Ajoute un sous-titre
     */
    const addSubTitle = (text: string) => {
      checkPageBreak(20)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text(text, margin, yPos)
      yPos += 8
    }

    /**
     * Ajoute un texte normal avec retour à la ligne
     */
    const addText = (text: string, indent = 0) => {
      checkPageBreak(10)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const lines = doc.splitTextToSize(text, maxWidth - indent)
      lines.forEach((line: string) => {
        checkPageBreak(7)
        doc.text(line, margin + indent, yPos)
        yPos += 6
      })
    }

    /**
     * Ajoute un texte en gras
     */
    const addBoldText = (text: string, indent = 0) => {
      checkPageBreak(10)
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      const lines = doc.splitTextToSize(text, maxWidth - indent)
      lines.forEach((line: string) => {
        checkPageBreak(7)
        doc.text(line, margin + indent, yPos)
        yPos += 6
      })
    }

    /**
     * Ajoute une puce
     */
    const addBullet = (text: string) => {
      checkPageBreak(10)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const lines = doc.splitTextToSize(text, maxWidth - 10)
      doc.text("•", margin, yPos)
      lines.forEach((line: string) => {
        checkPageBreak(7)
        doc.text(line, margin + 5, yPos)
        yPos += 6
      })
    }

    /**
     * Ajoute un séparateur
     */
    const addSeparator = () => {
      checkPageBreak(10)
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 8
    }

    // === EN-TÊTE ===
    addMainTitle(persona.nom_persona || "Persona Marketing")
    if (persona.titre_principal) {
      addText(persona.titre_principal)
      yPos += 3
    }

    addBoldText(`RÔLE / TITRE : ${persona.role_titre || ""}`)
    yPos += 3

    if (persona.caracteristique_cle) {
      addBoldText("CARACTÉRISTIQUE CLÉ :")
      addText(persona.caracteristique_cle, 5)
      yPos += 5
    }

    addSeparator()

    // === APERÇU DU PERSONA ===
    addSubTitle("APERÇU DU PERSONA")
    if (persona.apercu) {
      addText(persona.apercu)
    }
    yPos += 5
    addSeparator()

    // === DÉMOGRAPHIE ===
    addSubTitle("DÉMOGRAPHIE")
    if (persona.demographie) {
      const demo = persona.demographie
      if (demo.tranche_age) addText(`Tranche d'âge : ${demo.tranche_age}`)
      if (demo.localisation) addText(`Localisation : ${demo.localisation}`)
      if (demo.formation) addText(`Formation : ${demo.formation}`)
      if (demo.taille_entreprise) addText(`Taille d'entreprise : ${demo.taille_entreprise}`)
      if (demo.experience) addText(`Niveau d'expérience : ${demo.experience}`)
      if (demo.etape_carriere) addText(`Étape de carrière : ${demo.etape_carriere}`)
    }
    yPos += 5
    addSeparator()

    // === PSYCHOGRAPHIE ===
    addSubTitle("PSYCHOGRAPHIE")
    if (persona.psychographie) {
      const psycho = persona.psychographie

      if (psycho.valeurs_fondamentales?.length > 0) {
        addBoldText("Valeurs fondamentales :")
        psycho.valeurs_fondamentales.forEach((val: any) => {
          addBullet(`${val.valeur} : ${val.description || ""}`)
        })
        yPos += 3
      }

      if (psycho.traits_personnalite?.length > 0) {
        addBoldText("Traits de personnalité :")
        psycho.traits_personnalite.forEach((trait: any) => {
          addBullet(`${trait.trait} : ${trait.description || ""}`)
        })
        yPos += 3
      }

      if (psycho.attitudes_croyances?.length > 0) {
        addBoldText("Attitudes et croyances :")
        psycho.attitudes_croyances.forEach((att: any) => {
          addBullet(`Sur ${att.sur} : "${att.croyance}"`)
        })
        yPos += 3
      }

      if (psycho.mode_vie) {
        addBoldText("Modes de vie :")
        addText(psycho.mode_vie, 5)
        yPos += 3
      }

      if (psycho.sources) {
        addText(`Sources : ${psycho.sources}`)
      }
    }
    yPos += 5
    addSeparator()

    // === OBJECTIFS & ASPIRATIONS ===
    addSubTitle("OBJECTIFS & ASPIRATIONS")
    if (persona.objectifs_aspirations) {
      const obj = persona.objectifs_aspirations

      if (obj.objectifs_professionnels?.length > 0) {
        addBoldText("Objectifs professionnels :")
        obj.objectifs_professionnels.forEach((o: string) => addBullet(o))
        yPos += 3
      }

      if (obj.objectifs_personnels) {
        addBoldText("Objectifs personnels :")
        addText(obj.objectifs_personnels, 5)
        yPos += 3
      }

      if (obj.indicateurs_succes?.length > 0) {
        addBoldText("Indicateurs de succès :")
        obj.indicateurs_succes.forEach((kpi: string) => addBullet(kpi))
        yPos += 3
      }

      if (obj.sources) {
        addText(`Sources : ${obj.sources}`)
      }
    }
    yPos += 5
    addSeparator()

    // === POINTS DE DOULEUR & DÉFIS ===
    addSubTitle("POINTS DE DOULEUR & DÉFIS")
    if (persona.pain_points?.length > 0) {
      persona.pain_points.forEach((pain: any, idx: number) => {
        addBoldText(`Frustration n°${idx + 1} : ${pain.frustration}`)
        if (pain.impact) addText(`Impact : ${pain.impact}`, 5)
        if (pain.solution_actuelle) addText(`Solution actuelle : ${pain.solution_actuelle}`, 5)
        if (pain.cout_emotionnel) addText(`Coût émotionnel : ${pain.cout_emotionnel}`, 5)
        yPos += 5
      })
    }

    if (persona.ce_qui_empeche_dormir) {
      addBoldText("Ce qui l'empêche de dormir :")
      addText(`"${persona.ce_qui_empeche_dormir}"`, 5)
      yPos += 3
    }
    yPos += 5
    addSeparator()

    // === MOTIVATIONS & MOTEURS ===
    addSubTitle("MOTIVATIONS & MOTEURS")
    if (persona.motivations_moteurs) {
      const motiv = persona.motivations_moteurs

      if (motiv.principaux_moteurs?.length > 0) {
        addBoldText("Principaux moteurs :")
        motiv.principaux_moteurs.forEach((m: any) => {
          addBullet(`${m.moteur} : ${m.description || ""}`)
        })
        yPos += 3
      }

      if (motiv.moteurs_decision?.length > 0) {
        addBoldText("Moteurs de décision :")
        motiv.moteurs_decision.forEach((m: string) => addBullet(m))
        yPos += 3
      }

      if (motiv.identite_aspirationnelle) {
        addBoldText("Identité aspirationnelle :")
        addText(motiv.identite_aspirationnelle, 5)
        yPos += 3
      }
    }
    yPos += 5
    addSeparator()

    // === CRAINTES & OBJECTIONS ===
    addSubTitle("CRAINTES & OBJECTIONS")
    if (persona.craintes_objections) {
      const craintes = persona.craintes_objections

      if (craintes.craintes?.length > 0) {
        addBoldText("Craintes :")
        craintes.craintes.forEach((c: any) => {
          addBullet(`${c.crainte} : ${c.description || ""}`)
        })
        yPos += 3
      }

      if (craintes.objections_courantes?.length > 0) {
        addBoldText("Objections courantes :")
        craintes.objections_courantes.forEach((o: string) => addBullet(`"${o}"`))
        yPos += 3
      }

      if (craintes.niveau_aversion_risque) {
        addBoldText("Niveau d'aversion au risque :")
        addText(craintes.niveau_aversion_risque, 5)
        yPos += 3
      }
    }
    yPos += 5
    addSeparator()

    // === CONTEXTE DE TRAVAIL ===
    addSubTitle("CONTEXTE DE TRAVAIL")
    if (persona.contexte_travail) {
      const ctx = persona.contexte_travail

      if (ctx.responsabilites_quotidiennes?.length > 0) {
        addBoldText("Responsabilités quotidiennes :")
        ctx.responsabilites_quotidiennes.forEach((r: string) => addBullet(r))
        yPos += 3
      }

      if (ctx.outils_technologies) {
        addBoldText("Outils et technologies qu'il utilise :")
        Object.entries(ctx.outils_technologies).forEach(([cat, outils]: [string, any]) => {
          addText(`${cat} : ${Array.isArray(outils) ? outils.join(", ") : outils}`, 5)
        })
        yPos += 3
      }

      if (ctx.structure_hierarchique) {
        addBoldText("Structure hiérarchique :")
        const struct = ctx.structure_hierarchique
        if (struct.rend_compte_a) addText(`Rend compte à : ${struct.rend_compte_a}`, 5)
        if (struct.gere) addText(`Gère : ${struct.gere}`, 5)
        if (struct.collabore_avec) addText(`Collabore avec : ${struct.collabore_avec}`, 5)
        yPos += 3
      }

      if (ctx.kpis?.length > 0) {
        addBoldText("Indicateurs de performance (KPIs) :")
        ctx.kpis.forEach((kpi: string) => addBullet(kpi))
        yPos += 3
      }

      if (ctx.autorite_decision) {
        addBoldText("Autorité de décision :")
        if (ctx.autorite_decision.budget) addText(`Budget : ${ctx.autorite_decision.budget}`, 5)
        if (ctx.autorite_decision.influence) addText(`Influence : ${ctx.autorite_decision.influence}`, 5)
        yPos += 3
      }
    }
    yPos += 5
    addSeparator()

    // === JOBS-TO-BE-DONE ===
    addSubTitle("JOBS-TO-BE-DONE")
    if (persona.jobs_to_be_done) {
      const jtbd = persona.jobs_to_be_done

      if (jtbd.jobs_fonctionnels?.length > 0) {
        addBoldText("Jobs fonctionnels (la tâche) :")
        jtbd.jobs_fonctionnels.forEach((j: string) => addBullet(j))
        yPos += 3
      }

      if (jtbd.jobs_emotionnels?.length > 0) {
        addBoldText("Jobs émotionnels (ce qu'il veut ressentir) :")
        jtbd.jobs_emotionnels.forEach((j: string) => addBullet(j))
        yPos += 3
      }

      if (jtbd.jobs_sociaux?.length > 0) {
        addBoldText("Jobs sociaux (comment il veut être perçu) :")
        jtbd.jobs_sociaux.forEach((j: string) => addBullet(j))
        yPos += 3
      }
    }
    yPos += 5
    addSeparator()

    // === PARCOURS D'ACHAT ===
    addSubTitle("PARCOURS D'ACHAT")
    if (persona.parcours_achat) {
      const parcours = persona.parcours_achat

      if (parcours.etape_conscience) {
        addBoldText("Étape de Conscience (Awareness) :")
        if (parcours.etape_conscience.declencheurs?.length > 0) {
          addText("Déclencheurs :", 5)
          parcours.etape_conscience.declencheurs.forEach((d: string) => addBullet(d))
        }
        if (parcours.etape_conscience.sources_information?.length > 0) {
          addText("Sources d'information :", 5)
          parcours.etape_conscience.sources_information.forEach((s: string) => addBullet(s))
        }
        yPos += 3
      }

      if (parcours.etape_consideration) {
        addBoldText("Étape de Considération :")
        if (parcours.etape_consideration.comportement)
          addText(`Comportement : ${parcours.etape_consideration.comportement}`, 5)
        if (parcours.etape_consideration.criteres_cles?.length > 0) {
          addText("Critères clés :", 5)
          parcours.etape_consideration.criteres_cles.forEach((c: string) => addBullet(c))
        }
        if (parcours.etape_consideration.comparaison)
          addText(`Comparaison : ${parcours.etape_consideration.comparaison}`, 5)
        yPos += 3
      }

      if (parcours.etape_decision) {
        addBoldText("Étape de Décision :")
        if (parcours.etape_decision.facteurs_finaux?.length > 0) {
          addText("Facteurs finaux :", 5)
          parcours.etape_decision.facteurs_finaux.forEach((f: string) => addBullet(f))
        }
        if (parcours.etape_decision.delai) addText(`Délai : ${parcours.etape_decision.delai}`, 5)
        if (parcours.etape_decision.parties_prenantes)
          addText(`Parties prenantes : ${parcours.etape_decision.parties_prenantes}`, 5)
        yPos += 3
      }

      if (parcours.post_achat?.attentes) {
        addBoldText("Post-Achat :")
        addText(`Attentes : ${parcours.post_achat.attentes}`, 5)
        yPos += 3
      }
    }
    yPos += 5
    addSeparator()

    // === CANAUX & PRÉFÉRENCES DE CONTENU ===
    addSubTitle("CANAUX & PRÉFÉRENCES DE CONTENU")
    if (persona.canaux_preferences) {
      const canaux = persona.canaux_preferences

      if (canaux.canaux_principaux?.length > 0) {
        addBoldText("Canaux principaux :")
        canaux.canaux_principaux.forEach((c: any) => {
          const nom = c.canal || c
          const usage = c.usage || ""
          addBullet(`${nom}${usage ? ` : ${usage}` : ""}`)
        })
        yPos += 3
      }

      if (canaux.types_contenu_preferes?.length > 0) {
        addBoldText("Types de contenu préférés :")
        canaux.types_contenu_preferes.forEach((t: any) => {
          const type = t.type || t
          const exemple = t.exemple || ""
          addBullet(`${type}${exemple ? ` (ex: ${exemple})` : ""}`)
        })
        yPos += 3
      }

      if (canaux.preferences_communication) {
        addBoldText("Préférences de communication :")
        if (canaux.preferences_communication.media) addText(`Média : ${canaux.preferences_communication.media}`, 5)
        if (canaux.preferences_communication.style) addText(`Style : ${canaux.preferences_communication.style}`, 5)
        yPos += 3
      }

      if (canaux.sources_confiance?.length > 0) {
        addBoldText("Sources de confiance :")
        canaux.sources_confiance.forEach((s: string) => addBullet(s))
        yPos += 3
      }
    }
    yPos += 5
    addSeparator()

    // === MESSAGES QUI RÉSONNENT ===
    addSubTitle("MESSAGES QUI RÉSONNENT")
    if (persona.messages_qui_resonnent) {
      const msg = persona.messages_qui_resonnent

      if (msg.langage_utilise?.length > 0) {
        addBoldText("Langage qu'il utilise :")
        addText(msg.langage_utilise.join(", "), 5)
        yPos += 3
      }

      if (msg.themes_porteurs?.length > 0) {
        addBoldText("Thèmes de messages porteurs :")
        msg.themes_porteurs.forEach((t: any) => {
          addBullet(`${t.theme} : "${t.message}"`)
        })
        yPos += 3
      }

      if (msg.preuves_comptent?.length > 0) {
        addBoldText("Preuves qui comptent :")
        msg.preuves_comptent.forEach((p: string) => addBullet(p))
        yPos += 3
      }

      if (msg.surmonter_objections?.length > 0) {
        addBoldText("Comment surmonter les objections :")
        msg.surmonter_objections.forEach((obj: any) => {
          addBullet(`"${obj.objection}" → ${obj.reponse}`)
        })
        yPos += 3
      }
    }
    yPos += 5
    addSeparator()

    // === GUIDE D'ACTIVATION ===
    addSubTitle("GUIDE D'ACTIVATION")
    if (persona.guide_activation) {
      const guide = persona.guide_activation

      if (guide.comment_atteindre?.length > 0) {
        addBoldText("Comment l'atteindre :")
        guide.comment_atteindre.forEach((t: string) => addBullet(t))
        yPos += 3
      }

      if (guide.contenus_creer?.length > 0) {
        addBoldText("Contenus à créer (Lead Magnets) :")
        guide.contenus_creer.forEach((c: string) => addBullet(c))
        yPos += 3
      }

      if (guide.messages_cles?.length > 0) {
        addBoldText("Messages clés à marteler :")
        guide.messages_cles.forEach((m: string) => addBullet(`"${m}"`))
        yPos += 3
      }

      if (guide.strategie_canaux) {
        addBoldText("Stratégie de canaux :")
        if (guide.strategie_canaux.focus_principal)
          addText(`Focus principal : ${guide.strategie_canaux.focus_principal}`, 5)
        if (guide.strategie_canaux.secondaire) addText(`Secondaire : ${guide.strategie_canaux.secondaire}`, 5)
        yPos += 3
      }

      if (guide.idees_campagnes?.length > 0) {
        addBoldText("3 idées de campagnes :")
        guide.idees_campagnes.forEach((camp: any, idx: number) => {
          addBoldText(`${idx + 1}. ${camp.nom}`, 5)
          addText(camp.description, 10)
          yPos += 2
        })
        yPos += 3
      }
    }
    yPos += 5
    addSeparator()

    // === RÉSUMÉ DU PERSONA ===
    addSubTitle("RÉSUMÉ DU PERSONA")
    if (persona.resume) {
      const resume = persona.resume

      if (resume.description_une_phrase) {
        addBoldText("Description en une phrase :")
        addText(resume.description_une_phrase, 5)
        yPos += 3
      }

      if (resume.meilleure_facon_convaincre) {
        addBoldText("La meilleure façon de le convaincre :")
        addText(resume.meilleure_facon_convaincre, 5)
        yPos += 3
      }

      if (resume.ce_qui_rend_unique) {
        addBoldText("Ce qui le rend unique :")
        addText(resume.ce_qui_rend_unique, 5)
        yPos += 3
      }
    }
    yPos += 5
    addSeparator()

    // === SOURCES DE RECHERCHE ===
    if (persona.sources_recherche) {
      addSubTitle("SOURCES DE RECHERCHE")
      addText(persona.sources_recherche)
      yPos += 5
    }

    // === FOOTER ===
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`Persona Builder - Cible: ${target} • Offre: ${offer}`, margin, doc.internal.pageSize.getHeight() - 10)
      doc.text(`Page ${i} / ${totalPages}`, pageWidth - margin - 20, doc.internal.pageSize.getHeight() - 10)
    }

    // Téléchargement
    const fileName = `persona-${persona.nom_persona?.replace(/\s+/g, "-") || "complet"}.pdf`
    console.log("[v0] Sauvegarde du PDF:", fileName)

    doc.save(fileName)

    console.log("[v0] PDF téléchargé avec succès")
  } catch (error) {
    console.error("[v0] Erreur dans generatePersonaPDF:", error)
    throw error
  }
}
