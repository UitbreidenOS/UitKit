---
description: Auditer la validation des entrées et l'assainissement dans toutes les limites de confiance
argument-hint: "[file, route, or module]"
---
Auditer la validation des entrées et l'assainissement dans `$ARGUMENTS` (par défaut : tous les gestionnaires de requêtes et points d'entrée de données) pour les vulnérabilités d'injection, la confusion de types et l'application manquante des limites.

**1. Localiser toutes les limites de confiance**

Trouvez chaque endroit où les données externes entrent dans l'application :
- Gestionnaires de requêtes HTTP (corps, paramètres de requête, paramètres de chemin, en-têtes, cookies)
- Chargements de fichiers et données de formulaires multipartites
- Gestionnaires de messages WebSocket
- Charges utiles de travaux en arrière-plan (files d'attente, entrées cron)
- Réponses d'API externes traitées comme de confiance
- Variables d'environnement utilisées dans la logique du code

**2. Injection SQL**

- Trouvez toutes les requêtes de base de données. Utilisent-elles des déclarations paramétrées/préparées, ou sont-elles concaténées en chaîne ?
- Vérifiez l'utilisation de l'ORM — y a-t-il des échappatoires de requête brute (`.raw()`, `query()`, `execute()`) avec une entrée non assainie ?
- Recherchez l'injection du second ordre : entrée utilisateur stockée dans la base de données puis utilisée ultérieurement dans une requête brute.

**3. Injection de commande**

- Trouvez tous les usages de `exec`, `spawn`, `system`, `popen`, `subprocess`, `child_process`, `os.system` et équivalents.
- L'entrée fournie par l'utilisateur est-elle interpolée dans les commandes shell ? Même avec échappement, préférez les tableaux d'arguments aux chaînes shell.

**4. Injection de modèle (SSTI)**

- Identifiez les moteurs de template côté serveur utilisés (Jinja2, Twig, Handlebars, Pebble, Velocity).
- Les données contrôlées par l'utilisateur sont-elles rendues à l'intérieur des expressions de template (`{{ }}`, `<%= %>`) ?

**5. Traversée de répertoires**

- Trouvez toutes les opérations de lecture/écriture de fichiers utilisant des noms ou des chemins fournis par l'utilisateur.
- Le chemin résolu est-il validé par rapport à un répertoire de base autorisé (par exemple, `os.path.abspath` + vérification de préfixe) ?

**6. Validation de type et de schéma**

- Chaque objet entrant est-il validé par rapport à un schéma strict avant utilisation ?
- Les entrées numériques sont-elles vérifiées pour les limites ? Les énumérations sont-elles validées par rapport à une liste blanche ?
- Y a-t-il un risque de pollution de prototype (Node.js `Object.assign`, `merge` avec une entrée non fiable) ?

**7. Sortie**

Pour chaque découverte :
```
[SEVERITY] [file:line] — vulnerability type
Input source: where the untrusted data originates
Sink: where it's used unsafely
PoC: minimal payload or request that demonstrates the issue
Fix: specific remediation (parameterize, allowlist, validate schema, etc.)
```

N'essayez pas d'exploiter les découvertes — décrivez simplement le vecteur d'attaque et la correction.
