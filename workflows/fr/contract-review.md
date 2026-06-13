# Flux de travail de révision des contrats

Un flux de travail reproductible pour examiner, trier et traiter les contrats entrants — de la réception à la signature ou aux annotations, avec une piste d'audit complète. Couvre les NDAs, les accords fournisseurs, les contrats clients et les offres d'emploi.

Ce flux de travail est conçu pour une équipe juridique interne (d'une à quelques personnes). Adaptez les seuils et les règles d'escalade à l'appétit pour le risque et au volume de transactions de votre organisation.

---

## Vue d'ensemble

```
Receipt → Triage → Risk classification → Review → Redline / negotiate → Escalate if needed → Sign-off → File
```

Temps total écoulé par type de contrat :
- NDA (standard) : 10-15 minutes
- NDA (non-standard) : 30-45 minutes
- MSA fournisseur (faible complexité) : 45-60 minutes
- MSA fournisseur (haute complexité) : 2-4 heures + conseil externe
- Contrat client (modèle standard) : 20-30 minutes
- Contrat client (négocié) : 1-2 heures + révision commerciale

---

## Étape 1 — Réception et prise en charge

**Objectif :** Chaque contrat est enregistré, assigné et a une échéance avant que tout travail ne commence.

**Liste de contrôle d'intake :**

```markdown
New Contract Intake — [CONTRACT NAME]

Received from: [name, company, email]
Received date: [date]
Contract type: [NDA / MSA / SOW / employment / lease / other]
Direction: [we are the customer / we are the vendor / mutual]
Commercial context: [deal size, relationship importance, what business decision depends on this]
Signing deadline: [date stated or implied]
Assigned to: [legal team member]
Review deadline: [signing deadline minus 2 days for internal review]
```

**Règle générale de triage :**
- Délai de signature aujourd'hui → tout mettre en attente
- Délai de signature dans 3 jours → réviser aujourd'hui
- Aucun délai indiqué → supposer 5 jours ouvrables ; confirmer avec le demandeur
- Conseil externe nécessaire → signaler et lancer immédiatement ; ne pas attendre la révision interne complète

---

## Étape 2 — Triage rapide (5 minutes)

**Objectif :** Déterminer l'attention que ce contrat nécessite avant d'effectuer une révision complète.

```
/nda-review

Fast triage for: [CONTRACT TYPE]
[Paste contract text]

Give me in 60 seconds:
1. Contract type: [standard template / custom / unusual]
2. Overall complexity: [low / medium / high]
3. Any immediate red flags visible without a full read: [yes / no — describe]
4. Recommended review depth: [5 min skim / 30 min review / full review + counsel]
5. Does this need external counsel? [yes / no / maybe — reason]
```

**Portes de décision :**
- NDA simple, manifestement standard (CDA, MNDA) ? → Révision de 10 minutes avec l'étape 3A
- Accord complexe avec des termes commerciaux personnalisés ? → Révision complète avec l'étape 3B
- Accord réglementé (services financiers, santé, données réglementées) ? → Conseil externe immédiatement

---

## Étape 3A — Révision NDA (voie rapide)

**Objectif :** Examiner le NDA en moins de 15 minutes. La plupart des NDAs passent ou présentent un problème corrigeable.

```
/nda-review

Review this NDA fully.

[Paste NDA text]

Our role: [disclosing / receiving / mutual]
Context: [why we're signing — sales conversation / vendor assessment / partnership / M&A]

Produce:
1. NDA type: mutual / one-way (which direction)
2. Term: [duration of confidentiality obligation]
3. Scope: is the definition of Confidential Information too broad? Too narrow?
4. Standard exclusions present: public information, prior knowledge, independent development, compelled disclosure — yes/no for each
5. Red flags: any unusual provisions, overly broad restrictions, perpetual obligations, non-standard remedies
6. Non-compete or non-solicitation buried in the NDA: yes/no
7. Governing law: where? Is it acceptable?
8. Recommendation: sign as-is / request one change / redline / reject / send to counsel
```

**Problèmes NDA standard à surveiller :**
- La définition des informations confidentielles inclut « toutes les informations partagées » sans exclusions
- Pas d'exclusions standard (domaine public, connaissance préalable, développement indépendant)
- Obligation de confidentialité perpétuelle (la norme du marché est 3-5 ans)
- Nous interdit de recruter leurs employés sans réciprocité
- Juridiction dans un État/pays où les litiges seraient impraticables pour nous
- NDA unilatéral alors qu'un accord mutuel serait plus approprié

---

## Étape 3B — Révision complète du contrat

**Objectif :** Couverture systématique de toutes les dispositions matérielles avec classification ROUGE/JAUNE/VERT.

```
/contract-review

Full contract review for: [CONTRACT TYPE]
[Paste full contract text]

Our role: [customer / vendor / licensor / licensee]
Our concerns: [IP protection / data security / payment terms / liability / termination]
Our company: [size, stage, industry — for context on market standards]
Deal value: $[X] over [term]

Produce a structured review:

RED (blocking — must fix before signing):
For each: [clause name] | [section] | [exact clause language] | [issue] | [impact] | [suggested fix]

YELLOW (negotiate — push back but not a dealbreaker):
For each: [same format]

GREEN (acceptable — standard market terms):
[Brief summary — "payment terms, IP ownership, and governing law are all market standard"]

MISSING CLAUSES:
[List clauses that should be present but are absent]

OVERALL RISK: [HIGH / MEDIUM / LOW]
RECOMMENDATION: [sign / redline and return / reject / send to counsel]
```

**Liste de contrôle universelle — à vérifier pour chaque contrat :**

```typescript
const UNIVERSAL_CONTRACT_CHECKS = [
  // LIABILITY
  'Is liability capped? At what amount? Is the cap adequate for the deal size?',
  'Are consequential damages excluded? Any carve-outs (IP breach, data breach, fraud)?',
  'Is indemnification mutual? Capped? Any uncapped indemnification obligations?',

  // IP
  'Who owns IP created under this agreement? Work for hire?',
  'Are input materials (our data, tools, content) protected?',
  'Any IP license granted? Scope — exclusive/non-exclusive, perpetual, irrevocable?',

  // TERMINATION
  'Can either party terminate for convenience? Notice period?',
  'What happens to our data on termination? Export window? Deletion timeline?',
  'Any termination fees or lock-in beyond notice period?',

  // DATA AND PRIVACY
  'Is personal data involved? Is there a DPA or data processing annex?',
  'Sub-processor restrictions: can they use our data with third parties?',
  'Data breach notification: do they commit to notifying us? Timeframe?',

  // PAYMENT
  'Payment terms: net-30, net-60, or other?',
  'Late payment penalties: interest rate, suspension of service?',
  'Price change provisions: unilateral right to increase pricing?',
  'Auto-renewal: notice period to cancel? Sufficient lead time?',

  // GOVERNING LAW AND DISPUTE RESOLUTION
  'Governing law jurisdiction: is it acceptable? Is it the same for both parties?',
  'Dispute resolution: litigation, arbitration, or mediation first?',
  'Any class action waiver or limitation on remedies?',
]
```

---

## Étape 4 — Produire les annotations (redlines)

**Objectif :** Une version annotée clairement marquée que la contrepartie peut examiner et à laquelle elle peut répondre.

```
/contract-review

Produce a redline for this contract based on these required changes:

RED issues to fix:
[List each RED issue with the proposed replacement language]

YELLOW issues — proposed positions:
[For each YELLOW: our preferred position, acceptable fallback, walk-away point]

Additional missing clauses to add:
[List each missing clause with proposed draft language]

Format output as:
For each change:
- Section reference
- Original language: [exact quote]
- Redlined to: [replacement language]
- Rationale (1 sentence): [why we need this]

This rationale is for internal use — do not include in the document sent to the counterparty.
```

**Posture de négociation par type de problème :**

| Type de problème | Notre demande | Repli acceptable | Ligne rouge |
|---|---|---|---|
| Indemnisation non plafonnée | Plafonnée à 12 mois de frais | Plafonnée à la valeur du deal | Pas de plafond — à corriger impérativement |
| Droit applicable (mauvaise juridiction) | Notre juridiction | Juridiction mutuelle (ex. Angleterre) | Juridiction de la contrepartie si défavorable |
| Propriété intellectuelle sur nos données d'entrée | Exclusion explicite de nos données | « Sauf les matériaux que nous fournissons » | Transfert de notre PI — à corriger impérativement |
| Suppression des données à la résiliation | Délai de 30 jours + certification | Délai de 60 jours | Aucun droit de suppression — nécessite ajout d'un DPA |
| Délai de préavis pour le renouvellement automatique | 60 jours | 30 jours | < 14 jours (préavis insuffisant) |

---

## Étape 5 — Escalade et conseil externe

**Escalader vers un conseil externe lorsque :**
- Tout contrat d'une valeur > [votre seuil, ex. 250 000 $] par an
- Tout accord impliquant des activités réglementées (services financiers, santé, données en tant que service)
- Risque de litige présent (réclamations d'indemnisation, litige de PI)
- Juridiction inconnue (hors de l'expertise de votre équipe)
- Documents de règlement, de fusion-acquisition ou de financement
- Toute disposition sur laquelle vous avez des doutes après utilisation de Claude — toujours escalader l'incertitude

**Brief pour le conseil externe :**

```
External counsel brief for: [CONTRACT NAME]

Business context:
- What we are trying to do: [deal description]
- Why this is important: [commercial importance]
- Signing deadline: [date]
- Our preferred outcome: [sign / negotiate specific points / walk away]

What we've done:
- RED issues identified: [list]
- YELLOW issues identified: [list]
- Our proposed positions: [list]

What we need from counsel:
- [Specific legal questions — e.g. "Is this indemnification clause enforceable in California?"]
- [Risk assessment: "How much exposure does the uncapped indemnification create?"]
- [Redline review: "Are our proposed redlines market standard and reasonable?"]

Budget: [X hours at $Y/hour]
Deadline: [when we need the advice]
```

---

## Étape 6 — Approbation et exécution

**Liste de contrôle avant signature :**

```
Before any contract is signed:
- [ ] All RED issues resolved (either fixed or signed off by authorised person with documented reason)
- [ ] YELLOW issues: either negotiated to acceptable position, or business sponsor accepted the risk in writing
- [ ] Governing law confirmed acceptable
- [ ] Signatories confirmed: do we and the counterparty have the right people signing?
  - Check signatory authority limits (who can bind the company at what dollar amount)
  - Board approval required? (check your authorisation matrix)
- [ ] Execution method: DocuSign / wet ink / notarised — confirmed correct for this jurisdiction and contract type
- [ ] Final version confirmed — no version control confusion
- [ ] Date of signing confirmed — any deferred effective date?
```

**Matrice d'autorité de signature (modèle — à adapter à votre organisation) :**

| Valeur du contrat | Qui peut signer |
|---|---|
| < 10 000 $ | Responsable de département |
| 10 000 $ - 50 000 $ | VP / Directeur |
| 50 000 $ - 250 000 $ | DAF ou PDG |
| > 250 000 $ | PDG + approbation du conseil d'administration |
| Toute cession de PI ou exclusivité | PDG + révision juridique |
| Contrats d'emploi | Directeur RH + PDG |

---

## Étape 7 — Archivage et suivi

**Objectif :** Chaque contrat signé est archivé, consultable et ses dates de renouvellement/résiliation sont suivies.

```
Contract filing record:

Contract name: [company — contract type — date]
Counterparty: [company name, registered address, contact]
Type: [NDA / MSA / SOW / employment / other]
Effective date: [date]
Term: [X years / until terminated]
Auto-renewal: [yes / no — if yes, notice period and next renewal date]
Termination date / notice by: [date]
Value: $[X] [one-time / annual / monthly]
Governing law: [jurisdiction]
Key obligations on us: [2-3 bullets]
Key rights for us: [2-3 bullets]
Filed in: [contract management system / Notion / Google Drive — exact path]
Reviewed by: [legal team member]
```

**Suivi des renouvellements :**
- Définir un rappel calendaire 90 jours avant toute échéance de préavis de renouvellement automatique
- Définir un rappel calendaire 30 jours avant l'expiration du contrat pour la renégociation
- Tout contrat avec un renouvellement dans les 6 prochains mois : réviser les termes actuels et le besoin commercial avant la date de renouvellement

---

## Référence rapide par type de contrat

### NDAs
- Voie rapide : Étape 3A
- Temps de révision cible : 10-15 minutes
- Problème le plus courant : confidentialité perpétuelle + pas d'exclusions standard
- Quand utiliser un conseil externe : si inclut des clauses de non-concurrence, de non-sollicitation ou des dispositions PI inhabituelles pour un NDA

### MSAs fournisseurs (SaaS, services, prestations professionnelles)
- Révision complète : Étapes 3B + 4
- Temps de révision cible : 45-90 minutes
- Problèmes les plus courants : traitement des données (pas de DPA), renouvellement automatique, indemnisation non plafonnée
- Conseil externe : contrats > [seuil] ou service réglementé

### Contrats clients (nous sommes le fournisseur/prestataire)
- Révision variante : comparer à notre modèle standard
- Temps de révision cible : 20-30 minutes pour les proches du modèle ; plus long pour les versions annotées
- Problèmes les plus courants : clients ajoutant des SLAs contraignants, propriété PI sur notre plateforme, demandes de portabilité des données
- Conseil externe : contrats entreprises > [seuil] ou secteur public

### Contrats d'emploi
- Réviser par rapport aux exigences du droit du travail local
- Problèmes les plus courants : applicabilité variable des clauses de non-concurrence selon l'État/le pays, portée de la cession de PI, délais de préavis
- Conseil externe : toujours pour les recrutements senior ; vérification au moins partielle pour les recrutements junior dans de nouvelles juridictions

---

## Liste de contrôle principale de révision des contrats

```markdown
# Contract Review: [CONTRACT NAME — DATE]

**Received:** [date]
**Deadline:** [date]
**Assigned:** [legal team member]
**Status:** [ ] Received | [ ] Triaged | [ ] Reviewed | [ ] Redlined | [ ] Negotiated | [ ] Signed | [ ] Filed

## Triage
- [ ] Contract type identified
- [ ] Signing deadline confirmed
- [ ] External counsel needed: yes / no / TBD
- [ ] Business sponsor identified and briefed

## Review
- [ ] Full /contract-review run
- [ ] RED issues: [number] identified
- [ ] YELLOW issues: [number] identified
- [ ] Missing clauses: [list]

## Redline
- [ ] RED issues: all proposed fixes drafted
- [ ] YELLOW issues: positions documented (ask / fallback / walk-away)
- [ ] Redlined version sent to counterparty
- [ ] Counterparty response received and reviewed

## Sign-off
- [ ] All RED issues resolved or accepted risk documented
- [ ] Signatory authority confirmed
- [ ] Final version confirmed — no further changes
- [ ] Signed by authorised person on our side
- [ ] Countersigned received and confirmed authentic

## Filing
- [ ] Signed copy filed in [location]
- [ ] Contract record created in tracker
- [ ] Renewal/termination calendar reminders set
- [ ] Business team notified of key obligations
```

---
