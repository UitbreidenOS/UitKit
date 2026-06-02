# Claude pour les Administrateurs de Santé

Tout ce dont un Administrateur de Santé ou un Gestionnaire de Cabinet a besoin pour exécuter les communications avec les patients, les SOPs, le suivi de conformité, la planification du personnel et l'administration de la facturation augmentés par l'IA dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes gestionnaire de cabinet, administrateur de clinique ou coordinateur de bureau médical. Votre travail consiste à maintenir le fonctionnement du cabinet — planification des patients, rostering du personnel, facturation, documentation de conformité, communications avec les fournisseurs — pendant que le personnel clinique se concentre sur les soins. Vous avez trop de boucles ouvertes et pas assez d'heures.

**Avant Claude Code :** 45 minutes pour rédiger une politique de communication avec les patients. 30 minutes par mise à jour de SOP. Suivi manuel des factures en attente. Checklists de conformité gérées dans des tableurs. Descriptions de poste rédigées de zéro à chaque recrutement.

**Après :** Modèles de communication avec les patients en 2 minutes. Premiers brouillons de SOP en 5 minutes. Emails de relance de facturation rédigés en 30 secondes. Analyse des lacunes de conformité à partir d'un document de politique en moins d'une minute. Descriptions de poste avec toutes les mentions requises en 3 minutes.

---

## Avertissement important — à lire avant de commencer

Claude Code assiste uniquement avec le **travail administratif**.

- N'utilisez pas Claude Code pour prendre, informer ou suggérer des décisions cliniques de quelque nature que ce soit
- Ne collez pas de données identifiables de patients dans aucun prompt — noms, dates de naissance, numéros NHS/d'assurance, adresses, coordonnées, ou toute combinaison pouvant identifier un individu réel
- Utilisez des noms fictifs (ex. Patient A, M. X) et des références anonymisées dans tous les exemples
- Toutes les sorties doivent être examinées par un humain qualifié avant d'être envoyées aux patients ou utilisées dans des processus réglementés
- Rien dans ce guide ne constitue des conseils juridiques, cliniques ou réglementaires

Claude Code n'est pas une entité couverte par HIPAA et ne doit pas être traité comme faisant partie de votre infrastructure de données conforme. Si vous traitez des données soumises à HIPAA, RGPD ou des cadres équivalents, examinez la politique de gouvernance des données de votre organisation avant d'utiliser tout outil d'IA. En cas de doute, consultez votre Délégué à la Protection des Données ou votre conseil juridique.

---

## Installation en 30 secondes

```bash
# Installer toutes les compétences et agents d'administration de santé
npx claudient add skill ops/dental-practice
npx claudient add skill ops/sop-writer
npx claudient add skill hr/hiring-pipeline
npx claudient add skill hr/job-description
npx claudient add skill compliance/gdpr-expert
npx claudient add skill compliance/privacy-pia

# Ou installer les bundles complets ops, conformité et RH :
npx claudient add skills ops
npx claudient add skills compliance
npx claudient add skills hr
```

---

## Votre stack d'administration de santé Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/dental-practice` | Modèles d'opérations de cabinet — rappels de rendez-vous, lettres de rappel, formulations de formulaires de consentement, scripts de réception | Administration quotidienne de la communication avec les patients |
| `/sop-writer` | Premiers brouillons de SOPs à partir de points clés — formatés, versionnés, prêts pour la revue | Mise à jour ou création de procédures administratives cliniques |
| `/hiring-pipeline` | Workflow de recrutement de bout en bout — offre d'emploi, présélection, questions d'entretien, offre | Recrutement d'administrateurs, de personnel de réception ou de support clinique |
| `/job-description` | Descriptions de poste conformes avec les mentions requises pour les rôles de santé | Toute demande de recrutement |
| `/gdpr-expert` | Questions-réponses sur la conformité RGPD, brouillons de demandes de personnes concernées, revue du calendrier de conservation | Gouvernance des données, demandes de données de patients, revue de politique |
| `/privacy-pia` | Scaffold d'Analyse d'Impact sur la Protection des Données (AIPD) pour les nouveaux systèmes ou changements de processus | Avant l'intégration de tout nouveau logiciel ou flux de données |
| `/invoice-chaser` | Rédiger des emails de relance de factures en retard avec un ton progressif | Relancer des paiements en attente d'assureurs ou de fournisseurs |
| `/expense-audit` | Signaler les anomalies, catégoriser les dépenses, signaler les exceptions de politique | Revue mensuelle des dépenses et des achats |
| `/customer-inquiry` | Modèles de réponse aux demandes de patients — questions de rendez-vous, informations sur les services, plaintes | Rédaction de réponses aux demandes de patients (anonymisées) |
| `/review-response` | Rédiger des réponses professionnelles aux avis de patients en ligne | Gestion des avis Google, NHS Choices ou Trustpilot |

### Agents

| Agent | Modèle | Quand l'invoquer |
|---|---|---|
| `roles/healthcare-admin` | Sonnet | Sessions administratives complètes — planification, communications, coordination de facturation |
| `advisors/general-counsel` | Opus | Questions de conformité, formulation de contrats, gouvernance des données, interprétation réglementaire |
| `advisors/chro-advisor` | Sonnet | RH du personnel — recrutement, procédure disciplinaire, contrats, gestion des absences |

---

## Workflow quotidien

### Matin — revue du programme des patients (15-20 minutes)

**1. Préparation de la journée — ce qui nécessite une attention aujourd'hui**
```
/dental-practice

Priorités administratives d'aujourd'hui :
- Nous avons [N] rendez-vous. Signalez ceux qui nécessitent des appels de confirmation avant le rendez-vous.
- Rédigez un message de rappel le jour même pour les rendez-vous de l'après-midi (modèle anonymisé).
- Toutes les lettres de rappel dues cette semaine — rédigez le modèle pour [type de rappel].

Utilisez des noms fictifs de patients tout au long.
```

**2. Triage des demandes de patients**
```
/customer-inquiry

Rédigez des réponses aux types de demandes suivants reçus ce matin :
1. Patient demandant à reporter — souhaite le premier créneau disponible
2. Patient demandant des informations sur [type de service] et le coût
3. Patient se plaignant des temps d'attente lors de la dernière visite

Gardez toutes les réponses professionnelles, chaleureuses et de moins de 150 mots chacune.
N'incluez aucune information réelle sur les patients — j'ajouterai les noms manuellement avant l'envoi.
```

---

### Milieu de journée — facturation et administration (20-30 minutes)

**3. Relance de factures**
```
/invoice-chaser

Rédigez des emails de relance pour les factures en attente suivantes :
- Facture [réf] : [nom du fournisseur/assureur], due il y a [N] jours, montant [X]
- Facture [réf] : [nom du fournisseur/assureur], due il y a [N] jours, montant [X]

Ton pour 15 jours de retard : rappel poli.
Ton pour 30+ jours de retard : ferme, avec référence aux conditions de paiement.
N'incluez pas de données réelles sur les patients dans les références de factures.
```

**4. Revue des dépenses**
```
/expense-audit

Voici le résumé des dépenses de ce mois par catégorie :
[Collez des données de dépenses anonymisées — sans identifiants de patients]

Signalez tout ce qui semble inhabituel, hors budget ou en dehors de la politique.
Résumez pour le rapport mensuel du gestionnaire de cabinet.
```

---

### Après-midi — conformité et documentation (20-30 minutes)

**5. Mise à jour des SOPs**
```
/sop-writer

J'ai besoin d'un premier brouillon de SOP pour :
[Sujet — ex. "traitement des demandes d'accès aux données de patients"]

Étapes clés que je sais qu'elle doit couvrir :
- [Étape 1]
- [Étape 2]
- [Étape 3]

Format : étapes numérotées, responsable pour chaque étape, fréquence de revue, encadré de version en haut.
Signalez les lacunes où je dois consulter notre DPD ou équipe juridique.
```

**6. Vérification de conformité**
```
/gdpr-expert

Nous prévoyons d'intégrer un nouveau [logiciel/processus] qui traitera [type de données].
Guidez-moi à travers les questions auxquelles je dois répondre avant la validation :
- Avons-nous besoin d'une AIPD ?
- Quels accords de traitement des données avons-nous besoin ?
- À quoi devrait ressembler le calendrier de conservation ?

Pas de données réelles sur les patients — c'est un exercice de planification.
```

---

### Coordination du personnel (selon les besoins)

**7. Recrutement — nouveau poste**
```
/job-description

Poste : [intitulé — ex. Réceptionniste / Coordinateur de cabinet / Secrétaire médical(e)]
Contexte : [cabinet de médecin généraliste / cabinet dentaire / clinique spécialisée]
Horaires : [temps plein / temps partiel]
Responsabilités principales : [liste à puces]
Qualifications requises : [liste]
Mentions requises : vérification des antécédents requise, vérification du droit au travail

Rédigez une description de poste conforme et une courte annonce d'emploi pour NHS Jobs / Indeed.
```

**8. Processus d'entretien**
```
/hiring-pipeline

Nous recrutons pour [poste]. Nous avons [N] candidats à l'étape de présélection.

Rédigez :
1. Un ensemble de questions d'entretien structurées (8-10 questions, basées sur les compétences)
2. Une grille d'évaluation pour chaque question
3. Un modèle standard d'email de refus
4. Un aperçu de la lettre d'offre (j'ajouterai les termes spécifiques avant l'envoi)
```

---

### Hebdomadaire — revue et reporting (vendredi, 30 minutes)

**9. Réponse aux avis en ligne**
```
/review-response

Nous avons reçu l'avis en ligne suivant :
[Collez l'avis — supprimez tout détail pouvant identifier le patient]

Rédigez une réponse professionnelle qui :
- Remercie le rédacteur de l'avis
- Reconnaît la préoccupation sans admettre de responsabilité
- L'invite à contacter le cabinet directement
- Reste en dessous de 100 mots
```

**10. Résumé administratif hebdomadaire**
```
/dental-practice

Rédigez un résumé administratif hebdomadaire pour le directeur du cabinet :
- Rendez-vous cette semaine : [N]
- Plaintes reçues : [N]
- Factures en attente : [N], total [X]
- SOPs mises à jour : [liste]
- Actions de conformité ouvertes : [liste]
- Problèmes de personnel : [description]

Format d'une page. Signalez les éléments nécessitant la validation du directeur.
```

---

## Plan d'intégration sur 30 jours (administrateurs nouveaux à Claude Code)

### Semaine 1 — Installation et orientation
- Installer toutes les compétences via `npx claudient add skills ops compliance hr`
- Lire la section d'avertissement en entier — informez votre équipe de ce qu'il ne faut pas coller dans les prompts
- Exécuter `/sop-writer` sur vos trois procédures les plus utilisées — familiarisez-vous avec la qualité des résultats avant de vous y fier
- Utiliser `/gdpr-expert` pour auditer un processus de données existant que vous gérez
- Rédiger votre premier modèle de communication avec les patients avec `/dental-practice` — comparez avec vos modèles actuels
- Lire la politique de gouvernance des données de votre organisation avant d'utiliser Claude Code pour toute tâche administrative réelle

### Semaine 2 — Communications et facturation
- Utiliser `/customer-inquiry` pour construire une bibliothèque de 10 modèles standard de réponses aux demandes de patients
- Rédiger toutes les relances de factures en retard avec `/invoice-chaser` — comparez le taux de réponse au mois précédent
- Exécuter `/expense-audit` sur les dépenses du mois dernier — présentez les résultats à votre responsable
- Commencer à suivre le temps consacré à l'administration des communications par rapport à votre référence avant Claude Code

### Semaine 3 — Conformité et documentation
- Exécuter `/privacy-pia` sur le prochain changement de système ou de processus dans votre pipeline
- Utiliser `/gdpr-expert` pour répondre à une question de conformité en suspens que votre équipe différait
- Mettre à jour au moins deux SOPs en utilisant `/sop-writer` — soumettre les deux pour revue clinique ou managériale
- Identifier votre tâche administrative récurrente la plus volumineuse et construire un modèle réutilisable pour elle

### Semaine 4 — Personnel et reporting
- Utiliser `/hiring-pipeline` et `/job-description` pour votre prochain poste ouvert — mesurez le temps économisé par rapport à votre recrutement précédent
- Exécuter `/review-response` sur vos cinq derniers avis en ligne sans réponse
- Produire votre rapport administratif mensuel en utilisant Claude Code — comparez le temps avec les mois précédents
- Présenter une amélioration de processus à votre directeur de cabinet, étayée par des données sur le temps économisé

---

## Sensibilisation à HIPAA et gestion des données

Si votre cabinet est soumis à HIPAA (États-Unis), RGPD (Royaume-Uni/UE) ou des cadres équivalents, suivez ces règles sans exception :

- **Ne collez jamais un vrai nom de patient, date de naissance, adresse, numéro de téléphone, email, ou numéro d'assurance/NHS dans aucun prompt**
- Utilisez des placeholders : "Patient A", "M. X", "DDN : [expurgé]", "Réf sinistre : [réf]"
- Traitez Claude Code comme vous le feriez pour tout outil SaaS tiers — ne partagez pas de données que vous ne partageriez pas avec un fournisseur externe sans accord de traitement des données signé
- Conservez un journal des processus administratifs pour lesquels vous utilisez Claude Code — votre DPD peut en avoir besoin pour un registre de traitement
- Si vous recevez une demande d'accès aux données (DAR), utilisez `/gdpr-expert` pour rédiger la checklist de processus, mais gérez les données réelles des patients entièrement en dehors de Claude Code

En cas de doute, construisez et testez votre modèle en utilisant un exemple fictif, puis appliquez-le manuellement aux données réelles dans votre système de gestion du cabinet.

---

## Benchmarks

Suivez ces métriques mensuellement pour démontrer la valeur à votre directeur de cabinet :

| Métrique | Avant Claude Code | Cible avec Claude Code |
|---|---|---|
| Heures administratives économisées par semaine | Référence | 4-8 heures |
| Temps pour rédiger un modèle de communication patient | 30-45 min | Moins de 5 min |
| Temps pour un premier brouillon de SOP | 45-60 min | Moins de 10 min |
| Délai de réponse aux demandes de patients | 24-48 heures | Le jour même |
| Délai de résolution des factures en attente | 14+ jours | 7-10 jours |
| Temps de rédaction de description de poste | 60-90 min | Moins de 15 min |
| Taux de réponse aux avis en ligne | Variable | 100% dans les 5 jours |
| Tâches de conformité effectuées à temps | Suivi manuel | Amélioration de 30% |

Effectuez une mesure de référence en Semaine 1 avant d'utiliser Claude Code à grande échelle. Révisez à 30 et 90 jours.

---

## Ressources

- [Prise en main de Claude Code](../getting-started.md)
- [Compétence rédacteur de SOP](../skills/ops/sop-writer.md)
- [Compétence expert RGPD](../skills/compliance/gdpr-expert.md)
- [Compétence AIPD confidentialité](../skills/compliance/privacy-pia.md)
- [Compétence pipeline de recrutement](../skills/hr/hiring-pipeline.md)
- [Compétence relanceur de factures](../skills/finance/invoice-chaser.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
