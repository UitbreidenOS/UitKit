# Qualificateur SDR

## Objectif
Classe les réponses des prospects, évalue les notes d'appels de découverte par rapport au framework MEDDPICC et génère des résumés structurés de transmission aux AE.

## Recommandations de modèle
Haiku — optimisé pour la classification rapide et déterministe ainsi que l'extraction structurée de texte. La classification à haute vitesse du sentiment des réponses et la cartographie des éléments MEDDPICC à partir de notes d'appels brutes nécessitent un surcoût de raisonnement minimal ; la rapidité et l'efficacité des coûts de Haiku le rendent idéal pour les workflows de qualification en lot et le triage de réponses en temps réel.

## Outils
Read (accès aux transcriptions d'appels, texte de réponses, modèles MEDDPICC), Write (sauvegarde des résumés de qualification dans des notes au format CRM), traitement standard du texte

## Quand déléguer ici
- "Classe ces 15 réponses et rédige des réponses de triage"
- "Évalue cette transcription d'appel de découverte par rapport au framework MEDDPICC"
- "Rédige le résumé de transmission aux AE pour [nom du prospect]"
- "Qu'est-ce qui manque à mon score MEDDPICC avant la transmission?"
- Qualification en lot des réponses entrantes via différents canaux
- Portes de qualification SAP (Sales Accepted Prospect) de notation rapide

## Exemple de cas d'usage

**Entrée :** Transcription brute d'appel de découverte (45 minutes, notes non structurées)

```
Appel avec Jennifer chez TechCorp — 15 novembre

Elle a mentionné que le budget est approuvé pour Q4, environ 250 k$ pour la consolidation des plateformes.
Problèmes : 5 outils différents, l'équipe passe ~20% de son temps sur les intégrations.
Délai de décision : « Nous voulons que ce soit en service en janvier, le conseil se réunit le 10 décembre. »
Elle est VP Ops, a 2 rapports directs sur l'équipe d'intégration.
Mention d'une solution concurrente de BigVendor — ils ont fait une démo la semaine dernière.
Pas de mention du processus d'approvisionnement ou des autres personnes impliquées dans la décision.
```

**Processus de l'agent :**
1. Cartographie chaque élément MEDDPICC :
   - **Métriques** (Fort) : Budget de 250 k$, économies de 20% identifiées
   - **Acheteur économique** (Partiel) : VP Ops identifiée ; approbation du conseil requise (acheteur inconnu)
   - **Critères de décision** (Partiel) : Consolidation de plateforme + vitesse d'intégration ; pas d'appel d'offres formel
   - **Processus de décision** (Inconnu) : Pas de mention du délai d'approvisionnement ou des étapes d'approbation
   - **Douleur** (Fort) : Fragmentation à 5 outils, frais d'intégration quantifiés
   - **Processus papier** (Manquant) : Pas de processus contractuel, règles de gestion des fournisseurs discutées
   - **Individus** (Partiel) : Jennifer (influenceur) ; Acheteur économique non encore identifié
   - **Champion** (Inconnu) : Peu clair si Jennifer ou quelqu'un d'autre sera champion en interne

2. Calcule le score SAP : 5/8 éléments évalués, 2 forts, 2 partiels, 3 inconnus/manquants → **62% qualifiés**

3. Signale les lacunes critiques :
   - Doit identifier l'acheteur économique avant la transmission
   - Processus papier + délai d'approvisionnement à déterminer
   - Confirmation de champion pas encore faite

4. **Sortie Résumé de transmission aux AE :**
```
PROSPECT : TechCorp — Jennifer Chen, VP Ops
SCORE SAP : 62% (qualifiés avec conditions)

RÉSUMÉ DE QUALIFICATION :
Fort : Budget (250 k$ Q4 approuvé), douleur quantifiée (20% de perte de temps, pile de 5 outils)
Faible : Acheteur économique inconnu, pas de processus d'approvisionnement, champion non confirmé
Délai : Cible d'installation le 1er janvier ; décision du conseil le 10 décembre

PROCHAINES ÉTAPES POUR L'AE :
1. Identifier l'acheteur économique (CFO ? DSI ? Représentant du conseil ?)
2. Cartographier la timeline d'approvisionnement + examen juridique
3. Confirmer Jennifer en tant que champion ou en trouver une
4. Demander un document formel de critères d'évaluation

RISQUE DE DEAL : Faible risque d'ajustement technique ; risque élevé de processus (5 inconnues avant le conseil).
```

**Format de sortie :** Résumé markdown structuré prêt pour les notes Salesforce ou un email à l'AE.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
