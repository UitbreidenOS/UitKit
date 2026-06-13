# Traceur de Rupture du Registre Général

## Quand activer

Enquête sur une rupture de rapprochement du registre général, variance inexpliquée dans une balance de vérification, désaccord entre grand livre et sous-grand livre, ou une discordance de clôture mensuelle. Utilisez lorsqu'une différence numérique existe entre deux représentations de la même position financière et que la cause première est inconnue.

## Quand NE PAS utiliser

Enregistrement d'écritures de journal ou d'ajustements. Cette compétence ne pose un diagnostic que — un résolveur (humain ou flux séparé) enregistre tous les correctifs après examen. N'utilisez pas cette compétence pour proposer un enregistrement sans approbation d'un comptable qualifié.

## Instructions

Enquête en trois phases :

**Phase 1 — Couche du Registre Général**

Lisez le solde du compte du registre général. Identifiez la période d'information, le code du compte et l'entité. Extrayez le mouvement net et le solde final. Enregistrez la source (système ERP, nom du rapport, date d'exécution).

**Phase 2 — Couche du Sous-Grand Livre**

Extrayez le sous-grand livre correspondant ou l'horaire de support. Additionnez les soldes du sous-grand livre pour la même période et portée de compte. Comparez au solde final du registre général :

```
différence nette = solde du registre général − total du sous-grand livre
```

Si différence nette = 0, aucune rupture n'existe. S'il est non-zéro, procédez à la phase 3.

**Phase 3 — Comparaison des Attributs**

Pour chaque élément de ligne contribuant à la rupture, identifiez l'attribut qui diffère :

- Date (désaccord de cutoff)
- Montant (arrondi, conversion de devises, entrée en double)
- Contrepartie (fournisseur/client mal codifié)
- Devise (taux de change appliqué différemment)
- Centre de coûts ou unité commerciale (erreur d'allocation interentreprises)
- Type de transaction (enregistrement mal classifié)

Format de déclaration de cause première : `"[côté GL] [action] parce que [raison du sous-grand livre]"`

Exemple : `"Débit GL enregistré le 31-05-2026 parce que entrée du sous-grand livre datée 01-06-2026 — désaccord de cutoff"`

**Format de sortie (JSON) :**

```json
{
  "break_amount": 12450.00,
  "currency": "USD",
  "root_cause": "Débit GL enregistré le 31-05-2026 ; entrée du sous-grand livre datée 01-06-2026 (désaccord de cutoff)",
  "owner": "Équipe PA",
  "action": "adjust",
  "action_detail": "Reclasser l'entrée GL à la période juin ; enregistrer écriture d'inversion datée 01-06-2026",
  "verification": "Réexécuter le rapprochement après enregistrement — la rupture devrait se clarifier à zéro"
}
```

**Types d'actions :**

| Type | Signification |
|------|---------|
| `monitor` | Surveiller mais ne prendre aucune action pour le moment — différence est liée au calendrier et devrait s'auto-clarifier |
| `adjust` | Enregistrer une écriture correctrice pour résoudre la rupture |
| `raise-ticket` | Escalade au propriétaire du système en amont — cause première est erreur système ou d'alimentation hors du contrôle de la comptabilité |
| `suppress` | Différence permanente connue — documenter et obtenir approbation ; exclure des futurs rapprochements |

**Barrière de sécurité :** Cette compétence produit un diagnostic et une action recommandée. Tous les écritures de journal proposées doivent être examinés et approuvés par un comptable qualifié avant enregistrement. Ne jamais enregistrer directement à partir de la sortie de cette compétence.

## Exemple

**Entrée :** « Le sous-grand livre PA affiche 45 230 $ en factures impayées mais le compte PA du registre général affiche 57 680 $ pour la même période. Tracez la rupture de 12 450 $ et identifiez la cause première. »

**Sortie attendue :**

```json
{
  "break_amount": 12450.00,
  "currency": "USD",
  "root_cause": "Deux entrées GL totalisant 12 450 $ n'ont aucun enregistrement de sous-grand livre correspondant — probablement des écritures de journal manuelles enregistrées directement sur le compte GL contournant le module PA",
  "owner": "Équipe PA",
  "action": "raise-ticket",
  "action_detail": "Identifier les JE manuels en interrogeant les transactions GL sans référence du sous-grand livre pour la période. Déterminer s'ils sont valides (reclassement) ou erronés (doublon). Escalade au Contrôleur GL pour examen.",
  "verification": "Après résolution, réexécuter le rapprochement PA — la rupture devrait se clarifier à zéro ou être supprimée avec justification documentée"
}
```

---
