# Opérations d'organisations à but non lucratif — Structure de projet

> Pour une organisation à but non lucratif gérant des programmes, des collectes de fonds, les relations avec les donateurs, la rédaction de subventions et la conformité — optimisant le cycle complet de la recherche de prospects et des demandes de subvention jusqu'à la prestation des programmes, l'intendance des donateurs et la déclaration 990 de l'IRS.

## Stack

- **Salesforce Nonprofit Success Pack (NPSP)** — CRM de donateurs, suivi des dons, gestion des relations, rapports de campagne
- **Bloomerang** — alternative CRM ; notation de rétention, segmentation des donateurs inactifs, chronologie d'engagement
- **Mailchimp** ou **Constant Contact** — lettres d'information par e-mail, campagnes de segmentation des donateurs, invitations à des événements, séquences d'intendance automatisées
- **QuickBooks Nonprofit** — comptabilité par fonds, suivi des revenus limités/non limités, rapports de dépenses de subvention, exports de préparation 990
- **Google Workspace** (Gmail, Docs, Drive, Sheets, Calendar) — communications internes, documents du conseil, stockage de fichiers partagés
- **Canva** — rapports d'impact, graphiques de médias sociaux, pages de couverture de subvention, matériaux d'événements, conception de rapport annuel
- **Zoom** — réunions du conseil, événements de cultivation des donateurs, prestation de programmes (virtuels), assemblées plénières du personnel
- **DonorSearch** ou **iWave** — recherche de prospects, dépistage de richesse, notation de la capacité philanthropique, classements d'affinité
- **Submittable** ou **Fluxx** — portail de soumission et de gestion des demandes de subvention
- **Claude Code** — rédaction de narratifs de subvention, lettres de remerciement aux donateurs, rédaction de rapports du conseil, génération d'histoires d'impact, assistance à la préparation 990

## Arborescence

```
nonprofit-operations/
├── .claude/
│   ├── CLAUDE.md                                    # Instructions de l'espace de travail — confidentialité des donateurs, délais de subvention, calendrier 990
│   ├── settings.json                                # Serveurs MCP, hooks, permissions
│   └── commands/
│       ├── grant-narrative.md                       # /grant-narrative — rédiger une section de proposition de subvention à partir d'un résumé du bailleur et des données du programme
│       ├── donor-acknowledgment.md                  # /donor-acknowledgment — générer une lettre de remerciement de don conforme à l'IRS
│       ├── impact-story.md                          # /impact-story — rédiger une histoire d'impact du participant à partir des notes d'entrevue du personnel
│       ├── board-report.md                          # /board-report — assembler un rapport mensuel/trimestriel du conseil à partir des données du programme et des finances
│       ├── prospect-profile.md                      # /prospect-profile — synthétiser un profil de prospect de don important à partir des données de recherche
│       ├── grant-report.md                          # /grant-report — rédiger un rapport de progression ou final du bailleur à partir des données de résultats du programme
│       └── donor-segment.md                         # /donor-segment — générer un appel segmenté ou un message d'intendance pour un niveau de donateur
├── programs/
│   ├── README.md                                    # Aperçu des programmes — liste des programmes actifs, directeurs, années fiscales
│   ├── youth-workforce-development/                 # Exemple de dossier de programme — un dossier par programme actif
│   │   ├── logic-model.md                           # Théorie du changement : intrants, activités, extrants, résultats, impact
│   │   ├── activities.md                            # Calendrier des activités, plans de session, aperçu du curriculum, affectations des animateurs
│   │   ├── outcomes-tracking.md                     # Indicateurs de résultats, méthodes de mesure, calendrier de collecte de données, objectifs par rapport aux résultats réels
│   │   ├── participant-data-sop.md                  # POP pour collecter, stocker et protéger les PII des participants — formulaires de consentement, saisie Salesforce, calendrier de rétention
│   │   └── program-budget.md                        # Budget au niveau du programme par catégorie de dépenses — liens aux restrictions de subvention
│   ├── senior-food-assistance/
│   │   ├── logic-model.md
│   │   ├── activities.md
│   │   ├── outcomes-tracking.md
│   │   ├── participant-data-sop.md
│   │   └── program-budget.md
│   ├── financial-literacy-education/
│   │   ├── logic-model.md
│   │   ├── activities.md
│   │   ├── outcomes-tracking.md
│   │   ├── participant-data-sop.md
│   │   └── program-budget.md
│   └── evaluation/
│       ├── evaluation-framework.md                  # Approche d'évaluation à l'échelle de l'organisation — indicateurs communs, normes de données
│       ├── data-collection-tools.md                 # Modèles de sondage, formulaires d'admission, évaluations préalables/postérieures — pas de données de participants réels
│       └── annual-outcomes-report-template.md       # Modèle pour compiler les résultats des programmes croisés dans un rapport annuel destiné aux bailleurs
├── fundraising/
│   ├── donor-segments.md                            # Définitions des segments — grands donateurs (10 000 $ +), intermédiaires (1 000 $ –9 999 $), fonds annuel (<1 000 $), inactifs, nouveaux
│   ├── major-gift-prospects.md                      # Top 25 des prospects de don important — note de capacité, affinité, propriétaire de relation, prochaine étape, montant de la demande
│   ├── event-calendar.md                            # Calendrier des événements de collecte de fonds — gala, tournoi de golf, Giving Tuesday, campagnes entre pairs
│   ├── annual-fund-plan.md                          # Stratégie des fonds annuels — calendrier des appels, mix de canaux, objectifs de dons assortis, objectifs de rétention
│   ├── planned-giving.md                            # Programme de société de legs — langage des legs, ressources en planification successorale, plan d'intendance des membres
│   ├── major-gifts/
│   │   ├── cultivation-moves-template.md            # Modèle de gestion des mouvements — étapes de découverte, culture, sollicitation, intendance
│   │   ├── gift-agreement-template.md               # Modèle d'accord de don important — montant du don, objectif, reconnaissance, obligations de rapport
│   │   ├── solicitation-letter-template.md          # Modèle de lettre de demande de don important — champs de personnalisation, récit du dossier du soutien
│   │   └── stewardship-calendar.md                  # Calendrier annuel des points de contact pour les grands donateurs — appels, visites sur place, rapports, reconnaissance
│   ├── annual-fund/
│   │   ├── direct-mail-appeal-template.md           # Modèle de lettre d'appel en courrier direct — versions d'automne, fin d'année, printemps
│   │   ├── email-appeal-template.md                 # Modèle d'appel par e-mail — variantes de la ligne d'objet, structure de test A/B
│   │   ├── matching-gift-tracker.md                 # Opportunités de dons assortis des entreprises — employeur, ratio de correspondance, date limite, statut
│   │   └── retention-report-template.md             # Modèle d'analyse de rétention des donateurs — comptes nouveaux, conservés, inactifs, réactivés par année
│   └── prospect-research/
│       ├── prospect-research-sop.md                 # POP pour le dépistage DonorSearch/iWave — quand faire, comment enregistrer les résultats dans Salesforce/Bloomerang
│       ├── wealth-screen-criteria.md                # Critères de notation de la capacité et de l'affinité — immobilier, dépôts auprès de la SEC, dons antérieurs, historique philanthropique
│       └── prospect-briefing-template.md            # Modèle de briefing de prospect d'une page — biographie, historique des dons, connexions, demande suggérée
├── grants/
│   ├── grant-calendar.md                            # Calendrier principal des délais de subvention — bailleur, montant, date limite, rédacteur assigné, statut, rapport dû
│   ├── funder-research/
│   │   ├── funder-research-sop.md                   # POP pour rechercher de nouveaux bailleurs — analyse 990, priorités, bénéficiaires antérieurs, évaluation de l'ajustement
│   │   ├── funder-profiles/
│   │   │   ├── smith-family-foundation.md           # Profil du bailleur : priorités, admissibilité, taille moyenne de subvention, subventions antérieures à l'organisation, contact
│   │   │   ├── city-arts-council.md
│   │   │   └── federal-cdbg-program.md
│   │   └── prospect-funders.md                      # Bailleurs en cours d'étude — nom, évaluation de l'ajustement, prochaine action, personnel assigné
│   ├── active-grants/
│   │   ├── README.md                                # Inventaire des subventions actives — bailleur, montant du prix, période, objectif limité, dates de rapport
│   │   ├── smith-family-foundation-fy2025/
│   │   │   ├── grant-agreement.md                   # Montant du prix, restrictions, exigences de rapport, informations de contact
│   │   │   ├── budget-narrative.md                  # Budget approuvé avec récit au niveau des articles — correspond au code de subvention QuickBooks
│   │   │   ├── progress-report-q1.md                # Rapport de progression Q1 narratif — activités, résultats, dépenses
│   │   │   └── final-report-draft.md                # Brouillon de rapport final — récit, finances, leçons apprises
│   │   └── federal-workforce-grant-fy2025/
│   │       ├── grant-agreement.md
│   │       ├── budget-narrative.md
│   │       ├── subrecipient-monitoring-log.md       # Journal de surveillance des sous-bénéficiaires — visites sur place, examens de bureau, conclusions (obligatoire pour les prix fédéraux)
│   │       └── sam-registration-renewal.md          # Liste de contrôle du renouvellement de l'enregistrement SAM.gov et date d'expiration
│   ├── reporting-templates/
│   │   ├── progress-report-template.md              # Rapport de progression intérimaire standard — activités, extrants, résultats, résumé financier
│   │   ├── final-report-template.md                 # Rapport de subvention final — récit, résultats par rapport aux objectifs, comptabilité financière, leçons
│   │   └── budget-variance-report-template.md       # Modèle de rapport d'écart budgétaire par rapport aux bailleurs réels
│   └── past-applications/
│       ├── README.md                                 # Index des candidatures antérieures — bailleur, année, résultat, sections de récit réutilisables
│       ├── youth-workforce-development-narrative.md  # Récit du programme réutilisable pour les demandes de subvention de formation professionnelle des jeunes
│       └── organizational-capacity-narrative.md     # Section récit de capacité organisationnelle et antécédents réutilisables
├── communications/
│   ├── social-calendar.md                           # Calendrier du contenu des médias sociaux — plateforme, date de publication, thème du contenu, campagne, élément graphique
│   ├── annual-report.md                             # Rapport annuel aperçu et liste de contrôle de production — sections de contenu, modèle Canva, plan de distribution
│   ├── newsletter-templates/
│   │   ├── monthly-newsletter-template.md           # Lettre d'information mensuelle aux donateurs — sections : histoire d'impact, mise à jour du programme, événements à venir, demande
│   │   ├── event-invitation-template.md             # E-mail d'invitation à un événement — ligne d'objet, espace réservé au lien RSVP, logistique
│   │   └── year-end-appeal-email-series.md          # Série d'e-mails d'appel de fin d'année — séquence d'appels de 4, heures, CTAs
│   └── impact-stories/
│       ├── impact-story-sop.md                      # POP pour collecter, examiner et publier des histoires de participants — consentement requis, directives de confidentialité
│       ├── story-interview-guide.md                 # Guide du personnel pour mener des entrevues d'histoire des participants — questions ouvertes, formulaire de libération
│       └── published-stories/
│           ├── 2025-maria-workforce-story.md        # Histoire d'impact publiée — anonymisée ou consentie, résultat du programme illustré
│           └── 2025-james-food-assistance-story.md
├── finance/
│   ├── budget-template.md                           # Modèle de budget d'exploitation annuel — par programme, limité par rapport à non limité, résultats de l'année précédente
│   ├── 990-prep-checklist.md                        # Liste de contrôle de préparation du formulaire 990 IRS — dates d'échéance, calendriers requis, données à extraire de QuickBooks
│   ├── audit-prep.md                                # Liste de contrôle de préparation d'audit annuelle — demandes de documents, rapprochements bancaires, confirmations de tirage de subvention
│   ├── grant-expense-tracking.md                    # POP de suivi des dépenses de subvention — codes de subvention QuickBooks, allocations, règles des fonds limités
│   ├── fund-accounting-sop.md                       # POP de comptabilité par fonds — limité par rapport à non limité, libération temporairement limitée, FASB ASC 958
│   └── financial-reports/
│       ├── monthly-financial-report-template.md     # Rapport financier mensuel prêt pour le conseil — budget par rapport aux résultats réels, YTD, résumé narratif
│       └── grant-financial-report-template.md       # Modèle de rapport financier du bailleur — dépenses par ligne budgétaire, solde restant
├── board/
│   ├── board-roster.md                              # Rôle du conseil d'administration — nom, mandat, comité, contact, employeur, statut de don
│   ├── meeting-agendas/
│   │   ├── agenda-template.md                       # Modèle d'ordre du jour standard des réunions du conseil — ordre du jour du consentement, rapports des comités, éléments d'action
│   │   ├── 2025-01-board-agenda.md
│   │   ├── 2025-03-board-agenda.md
│   │   └── 2025-06-board-agenda.md
│   ├── resolutions/
│   │   ├── resolution-template.md                   # Modèle de résolution du conseil — format CONSIDERANT/DÉCIDÉ, enregistrement du vote
│   │   ├── 2025-01-banking-resolution.md
│   │   └── 2025-03-executive-compensation-resolution.md
│   └── committee-charters/
│       ├── finance-committee-charter.md             # Portée du comité des finances, adhésion, cadence des réunions, responsabilités
│       ├── executive-committee-charter.md
│       ├── fundraising-committee-charter.md
│       └── program-committee-charter.md
└── compliance/
    ├── state-registration-tracker.md               # Suivi de l'enregistrement des demandes de sollicitation caritative par état — dates d'expiration, frais de dépôt, agent enregistré
    ├── conflict-of-interest-log.md                 # Journal des divulgations de conflit d'intérêts annuels — conseil et personnel clé, par calendrier de l'IRS 990 L
    ├── document-retention-policy.md                # Calendrier de rétention des documents conforme à l'IRS — catégories, périodes de rétention, journal de destruction
    ├── whistleblower-policy.md                     # Politique de lanceur d'alerte et d'anti-représailles — requis pour la divulgation 990 Partie VI
    └── 990-schedule-checklist/
        ├── schedule-a-checklist.md                 # Test de soutien public — liste de contrôle de calcul 509(a)(1) ou (a)(2)
        ├── schedule-b-checklist.md                 # Contributeurs de l'annexe B — seuil, règles d'anonymisation, exigences de divulgation d'État
        ├── schedule-d-checklist.md                 # Annexe D états financiers supplémentaires — fonds de dotation, fonds limités
        └── schedule-o-checklist.md                 # Annexe O informations supplémentaires — politiques de gouvernance, explication de la rémunération
```

## Fichiers clés expliqués

| Chemin | Objectif |
|---|---|
| `grants/grant-calendar.md` | Calendrier principal des délais de subvention couvrant tous les bailleurs actifs et de pipeline — le fichier le plus critique pour les opérations de subvention ; comprend le nom du bailleur, le montant du prix, la date limite de candidature, le rédacteur assigné, l'état de soumission et les dates d'échéance du rapport |
| `.claude/commands/grant-narrative.md` | Commande slash qui rédige une section de proposition de subvention (déclaration de besoin, description du programme, plan d'évaluation ou durabilité) à partir d'un résumé du bailleur et des données de résultats du programme — réduit le temps du premier brouillon de 4+ heures à moins de 30 minutes |
| `fundraising/major-gift-prospects.md` | Liste des 25 meilleurs prospects de don important avec les évaluations de capacité DonorSearch/iWave, propriétaire de relation, date du dernier contact, prochaine étape de culture et montant de la demande cible — traité comme confidentiel ; jamais partagé en dehors de l'organisation |
| `finance/990-prep-checklist.md` | Liste de contrôle de préparation du formulaire 990 IRS avec date limite de dépôt (4,5 mois après la fin de l'année fiscale, ou 11/15 pour les déclarants de l'année civile), calendriers requis par profil d'organisation, rapports QuickBooks à exécuter et liste de contrôle de transfert CPA |
| `grants/active-grants/README.md` | Inventaire de toutes les subventions actives avec bailleur, montant du prix, période de subvention, objectif limité, code de subvention QuickBooks et dates de rapport à venir — utilisé dans les rapports financiers et du conseil mensuels |
| `programs/[program]/participant-data-sop.md` | POP par programme pour collecter et protéger les informations personnelles identifiables (PII) des participants — définit les exigences de consentement, les procédures de saisie des données Salesforce, les contrôles d'accès et le calendrier de rétention/destruction |
| `board/board-roster.md` | Rôle du conseil d'administration actuel avec expiration du mandat, affectations des comités, statut de don annuel et employeur pour le dépistage des dons assortis — mis à jour après chaque réunion du conseil |
| `fundraising/prospect-research/prospect-briefing-template.md` | Modèle de briefing de prospect de don important d'une page rempli à partir de DonorSearch/iWave — biographie, historique philanthropique, connexion à l'organisation, plage de demande suggérée et stratégie de culture |
| `communications/impact-stories/impact-story-sop.md` | Gouverne la collecte et la publication des histoires des participants — exigences du formulaire de consentement, règles d'anonymisation, flux de travail d'approbation et étapes de production d'éléments Canva |
| `compliance/state-registration-tracker.md` | Suivi de l'enregistrement des demandes de sollicitation caritative pour tous les États où l'organisation sollicite — dates d'expiration, frais de renouvellement, contacts de l'agent enregistré et dates d'échéance de dépôt annuelles |

## Échafaudage rapide

```bash
# Créer la racine de l'espace de travail
mkdir -p nonprofit-operations

# Créer la structure .claude
mkdir -p nonprofit-operations/.claude/commands

# Créer les répertoires des programmes
mkdir -p nonprofit-operations/programs/youth-workforce-development
mkdir -p nonprofit-operations/programs/senior-food-assistance
mkdir -p nonprofit-operations/programs/financial-literacy-education
mkdir -p nonprofit-operations/programs/evaluation

# Créer les répertoires de collecte de fonds
mkdir -p nonprofit-operations/fundraising/major-gifts
mkdir -p nonprofit-operations/fundraising/annual-fund
mkdir -p nonprofit-operations/fundraising/prospect-research

# Créer les répertoires de subventions
mkdir -p nonprofit-operations/grants/funder-research/funder-profiles
mkdir -p nonprofit-operations/grants/active-grants
mkdir -p nonprofit-operations/grants/reporting-templates
mkdir -p nonprofit-operations/grants/past-applications

# Créer les répertoires de communications
mkdir -p nonprofit-operations/communications/newsletter-templates
mkdir -p nonprofit-operations/communications/impact-stories/published-stories

# Créer les répertoires de finances
mkdir -p nonprofit-operations/finance/financial-reports

# Créer les répertoires du conseil
mkdir -p nonprofit-operations/board/meeting-agendas
mkdir -p nonprofit-operations/board/resolutions
mkdir -p nonprofit-operations/board/committee-charters

# Créer les répertoires de conformité
mkdir -p nonprofit-operations/compliance/990-schedule-checklist

# Amorcer le calendrier des subventions avec les en-têtes de colonne
cat > nonprofit-operations/grants/grant-calendar.md << 'EOF'
# Calendrier des délais de subvention

**Mise à jour :** [date]
**Propriétaire :** [nom du gestionnaire des subventions]

| Bailleur | Programme | Montant | Date limite de demande | Rédacteur assigné | Statut | Rapport dû |
|---|---|---|---|---|---|---|
| Smith Family Foundation | Youth Workforce | $50,000 | 2025-09-15 | [nom] | Drafting | 2026-06-30 |
| City Arts Council | Financial Literacy | $15,000 | 2025-10-01 | [nom] | Research | 2026-03-31 |

## À venir (90 prochains jours)
- [remplissage automatique du tableau ci-dessus filtré par date limite]

## Rapport dû (90 prochains jours)
- [remplissage automatique du tableau ci-dessus filtré par date d'échéance du rapport]
EOF

# Amorcer le README des subventions actives
cat > nonprofit-operations/grants/active-grants/README.md << 'EOF'
# Inventaire des subventions actives

| Bailleur | Montant du prix | Période de subvention | Objectif limité | Code de subvention QuickBooks | Rapport suivant dû |
|---|---|---|---|---|---|
| Smith Family Foundation | $50,000 | 7/1/2025–6/30/2026 | Stipends et personnel en formation professionnelle des jeunes | GR-2025-001 | 2026-01-15 |

**Règle :** Chaque subvention active doit avoir son propre sous-dossier nommé [funder-kebab-case]-[fiscal-year].
Le sous-dossier doit contenir : grant-agreement.md, budget-narrative.md et un fichier par rapport de progression/final.
EOF

# Amorcer le README de la politique de confidentialité des donateurs
cat > nonprofit-operations/fundraising/prospect-research/prospect-research-sop.md << 'EOF'
# POP de recherche de prospects

## Politique de confidentialité
Les données de recherche de prospects (notes DonorSearch, scores iWave, estimations de richesse) sont strictement confidentielles.
- NE PAS partager les profils de prospects en dehors du service du développement sans approbation du VP
- NE PAS stocker les données de prospects dans les dossiers Google Drive partagés accessibles au personnel du programme ou aux bénévoles
- Les dossiers de prospects Salesforce/Bloomerang sont accessibles au personnel du développement uniquement — vérifier les permissions des rôles trimestriellement
- Les briefings de prospects imprimés doivent être collectés et détruits après les réunions du conseil ou du comité

## Quand faire un dépistage
- Nouveaux prospects des membres du conseil avant le vote du comité de nomination
- Prospects de don important avec don cumulatif de 5 000 $ +
- Participants à des événements avant la sensibilisation personnelle à des événements de capacité de 10 000 $ +
- Enquêtes de la société de planification successorale

## Traitement
1. Exporter la liste des noms et adresses de Salesforce/Bloomerang au format CSV
2. Télécharger sur le portail de dépistage par lot DonorSearch (Paramètres > Téléchargement par lot)
3. Attendre 24–48 heures pour les résultats
4. Télécharger les résultats et importer les notes dans Salesforce à l'aide de l'intégration DonorSearch ou de la mise à jour manuelle des champs
5. Enregistrer la date de dépistage dans le dossier de prospects
6. Signaler les prospects les mieux classés (Note DS 5+) à l'officier des dons importants pour la préparation du briefing
EOF

# Installer les compétences sans profit
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill data-ml/stakeholder-report
```

## Modèle CLAUDE.md

```markdown
# Opérations d'organisations à but non lucratif — Instructions du code Claude

## Ce que c'est

C'est le répertoire de travail d'une organisation à but non lucratif gérant des programmes, des collectes de fonds, les relations avec les donateurs, la rédaction et la production de subventions, la gouvernance du conseil et la conformité à l'IRS.

RÈGLE DE CONFIDENTIALITÉ DES DONATEURS : Les dossiers des donateurs, les montants des dons, les données de recherche de prospects (notes DonorSearch/iWave, estimations de richesse, notes de capacité) et les intentions de dons de succession sont strictement confidentiels.
N'incluez pas les noms spécifiques des donateurs, les montants des dons ou les cotes de prospects dans aucun fichier qui pourrait être accessible par des bénévoles, des stagiaires ou du personnel du programme. Les fichiers sensibles au développement vivent sous fundraising/major-gift-prospects.md et fundraising/prospect-research/ — traitez-les comme restreints.

RÈGLE DE CONFIDENTIALITÉ DES PARTICIPANTS : Les noms des participants au programme, les informations de contact, les données démographiques et les dossiers de résultats sont des informations personnelles identifiables (PII). Ces données vivent dans Salesforce NPSP ou la base de données du programme — pas dans cet espace de travail. Les modèles utilisent uniquement des espaces réservés entre crochets.

## Stack

- Salesforce Nonprofit Success Pack (NPSP) — CRM de donateurs ; tous les dossiers des donateurs et l'historique des dons vivent ici
- Bloomerang — CRM alternative si utilisée ; notation de rétention, chronologie d'engagement, rapports des donateurs inactifs
- Mailchimp / Constant Contact — campagnes par e-mail, envois de lettre d'information, invitations à des événements, séquences d'appel
- QuickBooks Nonprofit — comptabilité par fonds ; codes de dépenses de subvention, suivi des fonds limités, exports de préparation 990
- Google Workspace — Docs, Drive, Sheets, Calendar pour la collaboration interne et le stockage des documents
- Canva — conception de rapport annuel, graphiques d'histoires d'impact, éléments de médias sociaux, pages de couverture de subvention
- Zoom — réunions du conseil, événements de culture des donateurs, prestation de programmes virtuels
- DonorSearch / iWave — dépistage de la richesse des prospects et notes de capacité philanthropique (équipe de développement uniquement)
- Submittable / Fluxx — portail de soumission des demandes de subvention pour les bailleurs fondations et gouvernementaux

## Calendrier des délais de subvention

Voir grants/grant-calendar.md — c'est la source de vérité unique pour tous les délais de subvention.
Examinez et mettez à jour ce fichier tous les lundi matin. Lorsqu'une nouvelle opportunité de subvention est confirmée :
1. Ajouter une ligne à grant-calendar.md avec bailleur, montant, date limite, rédacteur assigné et date d'échéance du rapport
2. Créer un sous-dossier sous grants/active-grants/ en utilisant la convention de nommage [funder-kebab-case]-[fiscal-year]
3. Ajouter la subvention à grants/active-grants/README.md avec le code de subvention QuickBooks
4. Bloquer la date limite de soumission dans Google Calendar 30 jours et 7 jours après

Délais clés :
- Formulaire 990 de l'IRS : dû 4,5 mois après la fermeture de l'année fiscale (année civile = 15 mai ; avec extension = 15 novembre)
- Enregistrements de demandes de sollicitation caritative d'État : voir compliance/state-registration-tracker.md
- Audit annuel : généralement 3–4 mois après la fermeture de l'année fiscale — voir finance/audit-prep.md

## Calendrier de préparation 990 de l'IRS

- Mois 1 après la fermeture de l'année fiscale : Exécuter les rapports QuickBooks ; rapprocher tous les codes de subvention ; confirmer les soldes des fonds limités
- Mois 2 : Compléter finance/990-prep-checklist.md ; recueillir les données de soutien public de l'annexe A ; enregistrer les divulgations de conflit d'intérêts
- Mois 3 : Fournir le paquet de données QuickBooks et les documents justificatifs aux auditeurs/CPA
- Mois 4 (ou mois 10 avec extension) : Fichier 990 ; post à GuideStar/Candid dans les 30 jours suivant le dépôt

## Tâches courantes et commandes exactes

### Rédiger une section de proposition de subvention
```
/grant-narrative

Bailleur : [nom de la fondation]
Section : [déclaration de besoin / description du programme / plan d'évaluation / durabilité / capacité de l'organisation]
Programme : [nom du programme]
Priorités du bailleur : [coller à partir des directives ou du profil du bailleur dans grants/funder-research/funder-profiles/]
Données sur les résultats : [coller les métriques de résultats pertinentes de programs/[program]/outcomes-tracking.md]
Limite de mots : [nombre]
```

### Générer une lettre de remerciement du donateur
```
/donor-acknowledgment

Type de don : [cash / stock / in-kind / matching gift / notification de don planifiée]
Montant du don : $[montant] (laisser en blanc pour les dons non-cash sans évaluation)
Fonds/objectif : [illimité / [programme] limité]
Type de donateur : [individuel / couple / fondation / entreprise]
Langage IRS requis : [oui — aucun bien ou service fourni / oui — la valeur du billet d'événement était $X]
Notes de personnalisation : [tout contexte spécial — par exemple, don commémoratif, nouveau donateur, membre du conseil]
```

### Rédiger un rapport de progression ou final du bailleur
```
/grant-report

Bailleur : [nom de la fondation]
Type de rapport : [intérimaire / final]
Période de subvention : [dates]
Objectif approuvé : [coller à partir de grants/active-grants/[folder]/grant-agreement.md]
Activités complétées : [coller à partir de programs/[program]/activities.md]
Résultats réalisés par rapport aux objectifs : [coller à partir de programs/[program]/outcomes-tracking.md]
Résumé budgétaire : [dépenses par rapport au budget approuvé — à partir du rapport de dépenses de subvention QuickBooks]
Limite de mots : [nombre]
```

### Créer un profil de prospect de don important
```
/prospect-profile

Nom du prospect : [nom]
Évaluation DonorSearch : [1–10] / Score iWave : [RFM ou estimation de capacité]
Dons antérieurs à l'organisation : [montants et années — à partir de Salesforce/Bloomerang]
Emploi : [employeur, titre]
Connexions du conseil ou de la communauté : [relations connues aux membres du conseil ou au personnel]
Intérêts philanthropiques : [dons connus à d'autres organisations — à partir de données 990 ou DonorSearch]
Plage de demande suggérée : [$X–$Y]
```

### Rédiger une histoire d'impact à partir des notes d'entrevue du personnel
```
/impact-story

Programme : [nom du programme]
Source de l'histoire : [coller les notes d'entrevue du personnel ou les citations clés — utiliser uniquement le prénom du participant ou le pseudonyme]
Statut du consentement : [libération signée en dossier / anonymisée — pas de détails d'identification]
Résultats à mettre en évidence : [quels résultats du programme cette histoire illustre]
Utilisation prévue : [rapport annuel / lettre d'information / demande de subvention / médias sociaux]
Nombre de mots cible : [150–300 / 300–500 / 500–800]
```

### Assembler un rapport du conseil
```
/board-report

Période de rapport : [mois ou trimestre]
Mises à jour du programme : [coller les points saillants des directeurs de programmes — activités, résultats, inscription]
Résumé financier : [coller budget par rapport aux résultats réels du rapport mensuel QuickBooks]
Mise à jour de la collecte de fonds : [YTD levé par rapport à l'objectif, dons importants fermés, événements à venir]
Pipeline de subventions : [coller à partir de grants/grant-calendar.md]
Éléments d'action nécessaires : [décisions ou votes requis à cette réunion]
```

### Générer un message de segmentation des donateurs
```
/donor-segment

Segment : [grands donateurs 10 000 $ + / intermédiaire 1 000 $ –9 999 $ / fonds annuel / inactif 13–24 mois / nouveaux donateurs]
Type de message : [appel de fin d'année / campagne de printemps / invitation à un événement / mise à jour d'impact / intendance]
Thème de la campagne : [description brève de la narration de la campagne]
Demande spécifique : [suggestion de montant du don, montant de mise à niveau ou RSVP de l'événement]
```

## Conventions à suivre

- Le calendrier des subventions (grants/grant-calendar.md) est mis à jour tous les lundis ; ne laissez jamais une date limite passer sans une alerte de 30 jours
- Chaque subvention active a un sous-dossier sous grants/active-grants/ nommé [funder-kebab-case]-[fiscal-year]
- Les codes de subvention QuickBooks suivent le format GR-[YYYY]-[###] — attribuer séquentiellement chaque année fiscale
- Les lettres de remerciement des donateurs doivent inclure le langage IRS 501(c)(3) : aucun bien ou service n'a été fourni en échange (ou indiquer la juste valeur marchande de tout avantage reçu)
- Les histoires d'impact nécessitent un formulaire de libération de participant signé avant la publication — référencer le fichier dans communications/impact-stories/impact-story-sop.md
- Les documents de réunion du conseil sont téléchargés vers le dossier Google Drive du conseil au moins 5 jours avant chaque réunion
- Les briefings de recherche de prospects sont étiquetés CONFIDENTIEL et non enregistrés dans les lecteurs partagés accessibles au personnel non développeur
- Les nouveaux profils de bailleur vont dans grants/funder-research/funder-profiles/ en utilisant la convention de nommage [funder-kebab-case].md
- La préparation 990 commence au mois 1 après la fermeture de l'année fiscale — voir finance/990-prep-checklist.md pour le calendrier complet
```

## Serveurs MCP

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-google-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-oauth-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@salesforce/mcp-server"],
      "env": {
        "SF_LOGIN_URL": "https://login.salesforce.com",
        "SF_USERNAME": "your-salesforce-username",
        "SF_PASSWORD": "your-salesforce-password",
        "SF_SECURITY_TOKEN": "your-salesforce-security-token"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/nonprofit-operations"
      ]
    },
    "mailchimp": {
      "command": "npx",
      "args": ["-y", "@mailchimp/mcp-server"],
      "env": {
        "MAILCHIMP_API_KEY": "your-mailchimp-api-key",
        "MAILCHIMP_SERVER_PREFIX": "us1"
      }
    }
  }
}
```

## Hooks recommandés

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"grants/grant-calendar\"; then echo \"[grants] grant-calendar.md updated — verify all deadlines have Google Calendar events 30 days and 7 days out\"; fi'"
          },
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"grants/active-grants\"; then echo \"[grants] Active grant file updated — confirm the QuickBooks grant code in grants/active-grants/README.md matches finance/grant-expense-tracking.md\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'python3 -c \"\nimport datetime, re\ntry:\n    with open(\\\"grants/grant-calendar.md\\\") as f:\n        content = f.read()\n    today = datetime.date.today()\n    lines = content.split(\\\"\\\\n\\\")\n    warnings = []\n    for line in lines:\n        dates = re.findall(r\\\"(\\\\d{4}-\\\\d{2}-\\\\d{2})\\\", line)\n        for d in dates:\n            delta = (datetime.date.fromisoformat(d) - today).days\n            if 0 < delta <= 30:\n                warnings.append(f\\\"DEADLINE IN {delta} DAYS: {line.strip()}\\\")\n    if warnings:\n        print(\\\"[grant-deadline-alert] \\\" + \\\"\\\\n\\\".join(warnings))\nexcept:\n    pass\n\" 2>/dev/null'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -qE \"fundraising/major-gift-prospects|prospect-research\"; then echo \"[confidentiality] Writing to a donor-confidential file. Confirm this file is not in a Google Drive folder shared with volunteers or program staff before proceeding.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Compétences à installer

```bash
# Rédaction de subventions et rapports
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill data-ml/stakeholder-report

# Communications et collecte de fonds des donateurs
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/lesson-planner

# Gouvernance et conseil
npx claudient add skill productivity/engineering-strategy
npx claudient add skill productivity/doc-site-builder

# Gestion du programme et résultats
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill productivity/interview-scorecard
```

## Connexe

- [Guide des opérations à but non lucratif](../guides/for-nonprofit-operations.md)
- [Flux de travail de rédaction de subventions](../workflows/grant-writing-workflow.md)
- [Flux de travail de l'intendance des donateurs](../workflows/donor-stewardship-workflow.md)
- [Flux de travail de préparation 990 de l'IRS](../workflows/990-prep-workflow.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
