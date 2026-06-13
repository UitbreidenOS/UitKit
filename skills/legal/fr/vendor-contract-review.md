---
name: vendor-contract-review
description: "Examen des contrats fournisseurs : identifier les clauses risquées dans les contrats SaaS, services et marchés publics — plafonds de responsabilité, indemnisation, traitement des données, droits de résiliation et pièges de renouvellement automatique"
---

# Compétence d'examen des contrats fournisseurs

## Quand l'activer
- Examen d'un contrat avant signature avec un nouveau fournisseur
- Identification de clauses défavorables dans les accords SaaS ou logiciels
- Examen d'un accord de services, MSA ou SOW pour votre entreprise
- Vérification d'un renouvellement avant renouvellement automatique d'une grande dépense
- Signalement des risques de traitement des données et de responsabilité dans les contrats fournisseurs

## Quand NE PAS l'utiliser
- Négociation de vos propres contrats clients (priorités de risque différentes)
- Contrats d'emploi — cadre juridique différent
- Accords immobiliers ou biens physiques — hors de portée
- Contrats nécessitant une analyse de conformité réglementaire (FDA, bancaire) — nécessite un conseil juridique qualifié
- Remplacement d'un avocat pour les contrats enjeux (> 500 K$ ou exposition importante en responsabilité)

## Instructions

### Examen standard des contrats fournisseurs

```
Examinez ce contrat fournisseur et signalez les clauses risquées.

Type de contrat : [Abonnement SaaS / Services professionnels / MSA + SOW / Marchés publics / NDA]
Fournisseur : [nom]
Valeur annuelle : $[X]
Durée : [X mois / annuel]
Renouvellement : [automatique / manuel]
Votre rôle : [acheteur recevant le service]

Examinez ces clauses par ordre de priorité :

1. PLAFOND DE RESPONSABILITÉ (priorité maximale):
   - Quelle est la responsabilité maximale du fournisseur envers vous?
   - Signal d'alerte : plafond égal ou inférieur à 1× frais mensuels
   - Standard : 12× frais mensuels (1 an de valeur contrat)
   - Meilleur : illimité pour faute volontaire, fraude, décès/blessure, violation PI, violation de données

2. INDEMNISATION:
   - Qui indemnise qui et pour quoi?
   - Signal d'alerte : vous indemnisez le fournisseur pour votre "mauvaise utilisation" (trop large)
   - Standard : indemnisation mutuelle pour violation PI, négligence
   - À surveiller : les exclusions d'indemnisation qui annulent votre protection

3. DONNÉES ET CONFIDENTIALITÉ:
   - Qui possède les données que vous saisissez ou générez?
   - Y a-t-il une DPA (accord de traitement des données) annexée ou référencée?
   - Signal d'alerte : le fournisseur peut utiliser vos données pour amélioration de produit sans consentement
   - RGPD / CCPA : si vous traitez des données personnelles EU/CA, DPA est légalement obligatoire
   - À surveiller : droits de retour/suppression des données à la résiliation

4. DROITS DE RÉSILIATION:
   - Pouvez-vous résilier pour convenance (sans cause)?
   - Délai de préavis requis pour résilier : [X jours]
   - Signal d'alerte : pas de résiliation pour convenance / résiliation nécessite 90+ jours de préavis
   - Droit de résilier pour manquement matériel : combien de temps pour remédier?

5. RENOUVELLEMENT AUTOMATIQUE:
   - Le contrat se renouvelle-t-il automatiquement?
   - Combien de temps à l'avance devez-vous donner un avis d'annulation? [X jours]
   - Signal d'alerte : renouvellement automatique avec fenêtre de notification > 60 jours (facile à manquer)
   - Meilleure pratique : rappel calendrier à 90 jours avant la date de renouvellement

6. TARIFICATION ET AUGMENTATIONS DE PRIX:
   - Le fournisseur peut-il augmenter le prix au renouvellement?
   - Plafond sur les augmentations annuelles? [X%]
   - Signal d'alerte : augmentations de prix illimitées au renouvellement

7. SLA ET CRÉDITS DE SERVICE:
   - Quel disponibilité est garantie? [X%]
   - Quels sont les recours en cas de violation SLA?
   - Signal d'alerte : les crédits SLA sont votre seul recours (plafonne votre récupération)
   - À surveiller : crédits seulement, pas de droit de résiliation pour violations SLA répétées

8. PROPRIÉTÉ INTELLECTUELLE:
   - Qui possède le produit du travail ou les personnalisations?
   - Signal d'alerte : le fournisseur conserve la PI pour les travaux que vous avez payés
   - Standard : vous possédez les travaux personnalisés ; le fournisseur conserve sa PI préexistante

Signalez chaque clause comme : VERT (favorable) / JAUNE (à négocier) / ROUGE (rejeter ou escalader vers juridique)
```

### Examen spécifique des clauses SaaS

```
Examinez cet accord SaaS pour les risques logiciels courants.

Produit SaaS du fournisseur : [décrire]
Utilisateurs : [X sièges / illimité]
Données stockées dans le produit : [décrire sensibilité — PII / financières / propriétaires]

Clauses spécifiques SaaS à vérifier :

POLITIQUE D'UTILISATION ACCEPTABLE (AUP):
- Quels usages sont interdits?
- Signal d'alerte : droits de suspension larges "à la discrétion du fournisseur"
- À surveiller : AUP vague qui pourrait affecter votre cas d'utilisation légitime

PORTABILITÉ DES DONNÉES ET EXPORT:
- Pouvez-vous exporter vos données à tout moment?
- Dans quel format? (CSV/JSON lisible par machine est standard)
- Que deviennent les données après résiliation? Une fenêtre de 30 jours pour l'export est standard.
- Signal d'alerte : pas d'export de données / format propriétaire / données supprimées à la résiliation sans délai de grâce

DISPONIBILITÉ ET MAINTENANCE:
- La maintenance programmée compte-t-elle par rapport au SLA de disponibilité?
- Combien de notification pour les temps d'arrêt planifiés?
- Maintenance d'urgence : quel est le processus?

SOUS-PROCESSEURS ET SERVICES TIERS:
- Le fournisseur utilise-t-il des sous-processeurs qui toucheront vos données?
- Sont-ils listés? Pouvez-vous vous opposer aux nouveaux?
- Exigence RGPD : doit notifier les clients des changements de sous-processeur

OBLIGATIONS DE SÉCURITÉ:
- À quelles normes de sécurité le fournisseur s'engage-t-il? (SOC 2, ISO 27001)
- Notification d'incident : combien de temps pour vous notifier d'une violation?
- Standard : 72 heures (exigence RGPD) ; à surveiller : > 72 heures ou pas d'engagement

CHANGEMENTS DE SERVICE:
- Le fournisseur peut-il modifier les fonctionnalités ou supprimer des fonctionnalités?
- Notification requise pour les modifications matérielles? (30-90 jours est standard)
- Signal d'alerte : le fournisseur peut modifier le service unilatéralement sans notification

Résultat : liste des clauses signalées + demandes de négociation recommandées pour chaque clause ROUGE/JAUNE.
```

### Guide de négociation de contrats

```
Construire une stratégie de négociation pour [contrat].

Valeur du contrat : $[X/an]
Effet de levier du fournisseur : [haut / moyen / bas — y a-t-il des alternatives?]
Votre effet de levier : [haut / moyen / bas — taille de votre dépense par rapport au fournisseur]
Clauses gagnantes obligatoires : [lisez les 2-3 plus importantes à corriger]
Souhaitable : [lisez les demandes secondaires]

Guide de négociation :

Priorisez : choisissez vos 3 combats, abandonnez le reste.
Les fournisseurs s'attendent à la négociation — ils n'abandonneront pas un accord matériel pour des demandes raisonnables.

Pour chaque clause ROUGE :

Clause : [nom]
Problème : [ce que dit le langage actuel, pourquoi c'est défavorable]
Votre demande : [le changement de langage spécifique que vous voulez]
Votre plan B : [langage minimum acceptable s'ils poussent]
Justification : [pourquoi c'est une demande commerciale raisonnable]

Tactiques d'escalade :
- Engagement multi-ans : "Nous signerons 3 ans si vous corrigez le plafond de responsabilité"
- Engagement de volume : "Nous augmenterons à 500 sièges si vous corrigez la portabilité des données"
- Urgence chronologique : "Nous avons besoin de ceci résolu par [date] pour procéder"
- Compétition : "Le contrat de votre concurrent inclut déjà cette protection"

Voie d'escalade :
- Niveau 1 : corrections standard d'un AE
- Niveau 2 : négociation juridique à juridique
- Niveau 3 : escalade executive (seulement pour les accords stratégiques)

Générez le guide de négociation pour mes corrections spécifiques.
```

### Liste de contrôle du contrat

```
Générez une liste de contrôle d'examen des contrats fournisseurs pour [entreprise/équipe].

Cas d'utilisation : [tous les nouveaux fournisseurs / fournisseurs au-dessus de $X dépense / outils SaaS seulement]
Tolérance au risque : [conservatrice / modérée / démarrage standard]

Liste de contrôle d'examen rapide (pour contrats < 50 K$/an):
□ Plafond de responsabilité ≥ 12 mois de frais?
□ Délai de préavis de renouvellement automatique ≤ 60 jours?
□ Droits d'export de données inclus?
□ Résiliation pour convenance disponible avec ≤ 30 jours de préavis?
□ Aucune clause d'attribution PI inhabituelle?
→ Si tout vert : signer. Si rouge : escalader.

Liste de contrôle d'examen complet (contrats > 50 K$/an ou impliquant données sensibles):
□ Plafond de responsabilité et exclusions examinés
□ Étendue de l'indemnisation comprise
□ DPA annexée (si traitement de données personnelles)
□ SLA examiné et les recours sont adéquats
□ Droits de résiliation (pour cause et convenance)
□ Conditions de renouvellement automatique calendrisées
□ Clause d'escalade de prix examinée
□ Droits de portabilité et suppression des données confirmés
□ Exigences de certification de sécurité respectées
□ Le droit gouvernant et la juridiction sont acceptables
→ Examen juridique interne requis pour les éléments ROUGES

Générez la liste de contrôle spécifique pour le processus d'examen des contrats de mon entreprise.
```

## Exemple

**Utilisateur :** Un nouveau fournisseur SaaS nous a envoyé un contrat. Dépense annuelle : 84 K$. Leur plafond de responsabilité est "un mois de frais payés." Se renouvelle automatiquement avec 90 jours de notification requise. Aucune DPA annexée bien que nous stockerons les adresses e-mail des clients. Sur quoi dois-je demander des corrections?

**Corrections prioritaires de Claude :**

Trois problèmes gagnants obligatoires avant signature :

**1. Plafond de responsabilité (ROUGE — rejeter tel que rédigé):**
Actuel : 1 mois de frais = 7 000 $ responsabilité maximale (vous payez 84 K$/an)
Votre demande : "Minimum 12 mois de frais payés dans les 12 mois précédents (84 000 $)"
Plan B : "6 mois de frais (42 000 $) avec exclusions illimitées pour violation de données et fraude"
Pourquoi ils accepteront : C'est une demande standard de l'industrie. Tout fournisseur réputé passera de 1 mois.

**2. Avis de renouvellement automatique (JAUNE — à négocier):**
Actuel : fenêtre de 90 jours — facile à manquer, surtout si la personne qui a signé parte
Votre demande : "60 jours ou moins"
Plan B : "90 jours est acceptable si le contrat inclut un rappel écrit du fournisseur à 120 jours"
Correctif pratique : Définissez un rappel calendrier récurrent immédiatement pour [date renouvellement - 100 jours] indépendamment de ce qui est dans le contrat.

**3. DPA / confidentialité des données (ROUGE — requis, pas optionnel):**
Actuel : Aucune DPA annexée, mais vous traiterez les adresses e-mail des clients (données personnelles)
Votre demande : "Exécutez la DPA standard du fournisseur avant mise en ligne, comme avenant à cet accord"
Pourquoi non-négociable : Si vous êtes soumis au RGPD ou CCPA, vous êtes légalement obligé d'avoir une DPA avec tout processeur traitant les données personnelles. La plupart des fournisseurs ont une DPA standard — il suffit de la demander. S'ils n'en ont pas, c'est un signal d'alerte sur leurs pratiques de données.

**Ce à laisser tomber :** Crédits SLA, clauses IP (en supposant pas de développement personnalisé) et droit gouvernant sont moins prioritaires à ce niveau de dépense.

---
