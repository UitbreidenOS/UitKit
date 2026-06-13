# Pipeline de pré-révision humaine

Un pipeline séquentiel à trois agents qui prépare une demande de fusion pour révision humaine. Exécute la simplification de code, l'analyse de sécurité et la révision de qualité finale dans l'ordre — chaque agent doit passer avant que le suivant s'exécute. Le résultat est une demande de fusion qui arrive à la révision humaine déjà nettoyée, auditée et annotée.

---

## Quand l'utiliser

- Avant de demander une révision de code à un coéquipier ou de soumettre à main
- Après une session de construction rapide assistée par IA où la vitesse était prioritaire par rapport au polissage
- Toute demande de fusion touchant authentification, paiements ou accès aux données — où une passe de sécurité est non-négociable
- Équipes avec une bande passante de révision humaine limitée qui veulent que l'IA filtre le bruit d'abord

---

## Phases

### Phase 0 — Vérification des prérequis

Avant de générer les agents, vérifiez :

```
Lisez la différence de la demande de fusion (git diff main...HEAD ou la liste des fichiers).

Dites-moi :
1. Combien de fichiers ont changé ?
2. Y a-t-il l'un de ceux-ci présents : authentification, paiements, migrations, secrets, configuration d'environnement ?
3. La différence est-elle en dessous de 500 lignes ? (Si plus de 2000 lignes, recommandez de diviser la demande de fusion d'abord)

Ne procédez pas à la Phase 1 jusqu'à ce que je confirme.
```

Porte : si la différence dépasse 2000 lignes, arrêtez et demandez à l'utilisateur de diviser la demande de fusion. Les grandes différences vainquent le but d'une révision structurée.

---

### Phase 1 — Simplificateur de code

**Agent :** `agents/code-simplifier.md`
**Objectif :** Supprimez la sur-ingénierie, le code mort et la complexité inutile avant que les autres agents ne dépensent de tokens dessus.

```
Générez l'agent code-simplifier.

Portée : [listez les fichiers modifiés]
Tâche : Examinezette différence pour la sur-ingénierie. Identifiez :
  - Les fonctions qui peuvent être remplacées par des appels de la bibliothèque standard
  - Les abstractions qui ajoutent de la complexité sans réutilisation (violations YAGNI)
  - Le code mort ou les blocs commentés introduits dans cette demande de fusion
  - La logique répétée qui devrait être extraite une fois

Pour chaque conclusion : montrez l'avant, le suggestion après, et la raison.
Ne FAITES PAS de changements — produisez uniquement un rapport de conclusions.
```

**Porte :** Examinez les conclusions du simplificateur. Pour chaque conclusion, acceptez ou rejetez-la. Seules les conclusions acceptées sont appliquées avant de passer à la Phase 2. Si le simplificateur n'a rien à simplifier — feu vert, procédez immédiatement.

Appliquez les simplifications acceptées :
```
Appliquez les simplifications acceptées suivantes du rapport de code-simplifier :
[collez les conclusions acceptées]

Faites les changements minimaux requis. N'introduisez pas de nouveaux modèles ou ne refactorisez au-delà de ce qui a été listé.
```

---

### Phase 2 — Auditeur de sécurité

**Agent :** `agents/security-reviewer.md`
**Objectif :** Signalez les vulnérabilités introduites dans la différence de demande de fusion — pas les problèmes préexistants du codebase.

```
Générez l'agent security-reviewer.

Portée : uniquement les fichiers modifiés dans cette demande de fusion — ne vérifiez pas le code préexistant.
Différence : [joignez la différence ou listez les fichiers]

Vérifiez :
  - Les vulnérabilités d'injection (SQL, commande, modèle)
  - Les écarts d'authentification et d'autorisation
  - Les secrets ou identifiants dans le code ou les commentaires
  - La désérialisation non sécurisée ou les modèles équivalents eval
  - La validation d'entrée manquante sur les données contrôlées par l'utilisateur
  - Le contrôle d'accès cassé (escalade de privilèges horizontale ou verticale)

Pour chaque conclusion : gravité (CRITIQUE / HAUTE / MOYENNE / BASSE), fichier + ligne, description, correction.
Les conclusions CRITIQUE et HAUTE bloquent la fusion. Les conclusions MOYENNE et BASSE sont consultatives.
```

**Porte :** Toute conclusion CRITIQUE ou HAUTE bloque la Phase 3. L'utilisateur doit soit corriger le problème, soit accepter explicitement le risque par écrit avant de procéder. Les conclusions BASSE et MOYENNE sont ajoutées à la description de la demande de fusion sous forme de notes consultatives.

---

### Phase 3 — Examinateur de code

**Agent :** `agents/code-reviewer.md`
**Objectif :** Passe de qualité finale — correction de logique, couverture de tests, documentation et prontitude globale.

```
Générez l'agent code-reviewer.

Contexte : Cette différence a déjà passé la simplification et la révision de sécurité.
Concentrez votre révision sur :
  - Correction de logique : le code fait-il ce que la description de la demande de fusion prétend ?
  - Cas limites : quelles entrées ou états pourraient casser ceci ?
  - Couverture de tests : les tests sont-ils significatifs, ou testent-ils les détails de mise en œuvre ?
  - Gestion d'erreurs : les défaillances sont-elles gérées au bon niveau ?
  - Documentation : les nouvelles API publiques ont-elles des chaînes de documentation ou JSDoc ?

Ne relevez pas les problèmes déjà soulevés par les passes de sécurité ou de simplification.
Produisez : un verdict LGTM / NÉCESSITE DU TRAVAIL avec une liste numérotée de problèmes (si quelconques).
```

**Porte :** LGTM → La demande de fusion est prête pour révision humaine. NÉCESSITE DU TRAVAIL → adressez les problèmes et re-exécutez uniquement la Phase 3 (pas besoin de re-exécuter les Phases 1 ou 2 sauf si du nouveau code a été ajouté).

---

### Phase 4 — Emballage de la sortie

Une fois que les trois agents ont passé :

```
Résumez cette demande de fusion pour le examinateur humain.

Incluez :
- Une description d'un paragraphe de ce que cette demande de fusion fait
- Les fichiers modifiés (regroupés par souci : code de fonctionnalité, tests, configuration)
- Les problèmes soulevés et résolus au cours du pipeline
- N'importe quelle note (BASSE/MOYENNE) de sécurité consultative
- Les domaines de révision suggérés pour l'humain

Format comme mise à jour de description de demande de fusion — Je le collerai dans le corps de la demande de fusion GitHub.
```

---

## Exemple

Demande de fusion : "Ajouter la connexion OAuth2 avec Google"

- Phase 0 : 8 fichiers modifiés, logique authentification présente → procédez avec une passe de sécurité obligatoire
- Phase 1 (Simplificateur) : trouvé 2 problèmes — validation de token en ligne qui duplique un utilitaire `validateToken()` existant, et une importation morte. Les deux acceptées et appliquées.
- Phase 2 (Sécurité) : trouvé 1 HAUTE — paramètre d'état non validé dans le rappel OAuth (risque CSRF). L'utilisateur le corrige avant la Phase 3.
- Phase 3 (Examinateur) : LGTM avec 1 consultative — test manquant pour cas token expiré. La consultative est ajoutée à la description de la demande de fusion.
- Phase 4 : Description de la demande de fusion mise à jour avec résumé et note consultative.

L'examinateur humain reçoit une différence qui est déjà simplifiée, vérifiée de sécurité et annotée.

---
