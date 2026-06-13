---
name: chaos-engineering
description: "Chaos engineering : concevoir des expériences d'injection d'erreurs, identifier le rayon d'impact, définir l'état stable, utiliser Chaos Monkey / Gremlin / Litmus — construire la résilience"
---

# Compétence Chaos Engineering

## Quand l'activer
- Valider la résilience du système avant un grand lancement
- Tester si les disjoncteurs et les basculements fonctionnent réellement
- Identifier les dépendances inconnues et les points de défaillance uniques
- Configurer une pratique de chaos engineering à partir de zéro
- Concevoir une expérience spécifique d'injection d'erreur

## Quand NE PAS l'utiliser
- Systèmes de production sans observabilité existante
- Systèmes sans capacité de rétablissement
- Environnements réglementés sans approbation explicite
- En remplacement de tests de charge

## Instructions

### Conception d'expérience chaos

```
Concevoir une expérience chaos pour [système/service].

Système : [décrire l'architecture]
Hypothèse : [que croyez-vous qu'il se passera quand X échoue?]
Cible : [quel composant casser]
État stable : [comment mesurer "le système est sain"?]

Modèle d'expérience chaos :

1. Hypothèse: "Quand [composant X] échoue, [le système répondra avec Y] car [nous avons disjoncteur Z]."

2. Définition de l'état stable (mesurer AVANT injection d'erreur):
   - Métrique 1: [ex. p99 latence API < 200ms]
   - Métrique 2: [ex. taux d'erreur < 0.1%]
   - Métrique 3: [ex. tous les health checks verts]

3. Erreur à injecter:
   - Quoi: [tuer processus / ajouter latence / perdre paquets / remplir disque]
   - Où: [pod spécifique / host / AZ / dépendance]
   - Rayon d'impact: [instance unique / toutes dans 1 AZ / service entier]

4. Période d'observation: [5 minutes pour commencer]

5. Déclencheur de rétablissement:
   - Arrêter si: [métrique X dépasse Y seuil]
   - Méthode de rétablissement: [commande exacte ou action]

6. Analyse:
   - Le système a-t-il regagné l'état stable en [X minutes]?
   - Les utilisateurs ont-ils été impactés? Pendant combien de temps?
   - L'alerte a-t-elle déclenché? C'était le bon alerte?

7. Action si hypothèse était fausse:
   - [corriger l'écart — ajouter disjoncteur, améliorer basculement, ajouter redondance]

Concevoir une expérience spécifique pour mon système.
```

### Scénarios de défaillance courants

Défaillances réseau, de ressources, de dépendances, Kubernetes-spécifiques. Utiliser LitmusChaos, Chaos Mesh, AWS FIS, Gremlin.

### Évaluation du rayon d'impact

Analyse des consommateurs directs, indirects, impact externe. Chemin de récupération. Évaluation du risque.

### Planification de game day

Agenda de game day pour [équipe], préparation, exercices d'exécution, débrief.

---
