---
description: Audit de la configuration CORS pour les origines trop permissives, l'abus de credentials et les lacunes de preflight
argument-hint: "[fichier serveur ou configuration framework]"
---
Auditez la configuration CORS (Cross-Origin Resource Sharing) dans `$ARGUMENTS` (par défaut : scannez tous les points d'entrée du serveur, les fichiers de middleware et les configurations du framework) pour les erreurs de configuration qui permettent les attaques cross-origin.

**1. Localisez la configuration CORS**

Trouvez tous les endroits où les en-têtes CORS sont définis :
- Express/Node : middleware `cors()`, `res.setHeader('Access-Control-Allow-Origin', ...)` manuel
- Django : `CORS_ALLOWED_ORIGINS`, `CORS_ALLOW_ALL_ORIGINS`, paramètres `django-cors-headers`
- FastAPI/Starlette : paramètres `CORSMiddleware`
- Spring : `@CrossOrigin`, `WebMvcConfigurer.addCorsMappings`
- Nginx/Apache : directives `add_header Access-Control-Allow-Origin`
- Configurations de couche CDN ou API Gateway

**2. Vérifiez l'origine wildcard avec credentials**

L'erreur de configuration la plus critique :
- Est-ce que `Access-Control-Allow-Origin: *` est combinée avec `Access-Control-Allow-Credentials: true` ?
- Les navigateurs bloquent cette combinaison, mais certains frameworks la misconfigent silencieusement — vérifiez les en-têtes de réponse réels quand les credentials sont présents.

**3. Vérifiez la réflexion d'origine**

- Est-ce que le serveur réfléchit l'en-tête `Origin` de la requête directement dans `Access-Control-Allow-Origin` sans validation ?
- Schéma à trouver : code qui lit `request.headers.origin` ou `$_SERVER['HTTP_ORIGIN']` et l'affiche dans l'en-tête de réponse.
- Cela rend chaque origine de confiance — équivalent à `*` mais contourne la restriction des credentials.

**4. Validez la liste des origines autorisées**

- La liste des origines autorisées est-elle une correspondance exacte (comparaison de chaîne) ou une correspondance regex/préfixe ?
- Correspondance de préfixe faible : `origin.startsWith('https://example.com')` autorise `https://example.com.attacker.com`
- Correspondance de suffixe faible : `origin.endsWith('example.com')` autorise `https://attackerexample.com`
- Les origines `null` sont-elles autorisées ? (déclenchées par les iframes sandboxées et `file://` — presque jamais approprié)

**5. Vérifiez la gestion du preflight**

- Les requêtes preflight `OPTIONS` sont-elles traitées et retournent-elles les `Access-Control-Allow-Methods` et `Access-Control-Allow-Headers` corrects ?
- Les points de terminaison sensibles (changement d'état, authentifiés) sont-ils protégés même si le preflight est contourné (par exemple, les requêtes simples avec `Content-Type: text/plain`) ?

**6. Vérifiez les en-têtes exposés**

- Est-ce que `Access-Control-Expose-Headers` inclut des en-têtes qui divulguent des infos sensibles (par exemple, noms de services internes, jetons de session, ID utilisateur) ?

**7. Vérifiez la configuration par route vs globale**

- Y a-t-il une configuration globale trop permissive qui devrait être resserrée par route, mais les surcharges par route sont manquantes sur les points de terminaison sensibles ?

**Format de sortie** :
```
## Audit CORS

### Résultats
[SEVERITÉ] [fichier:ligne ou clé config] — description
Scénario d'attaque : ce qu'un attaquant peut faire depuis une origine malveillante
Correction : changement de configuration exact

### Origines actuellement autorisées
[Listez chaque origine configurée et si elle est appropriée]

### Configuration recommandée
[Collez un extrait de configuration corrigée pour le framework utilisé]
```

Sévérité : Critique (réflexion d'origine ou wildcard+credentials), Élevée (regex trop large), Moyenne (origine null, en-têtes exposés excessifs), Basse (lacunes de preflight sur les routes non sensibles).
