---
description: Auditer la configuration CORS pour les origines excessivement permissives, les abus de credentials et les lacunes de preflight
argument-hint: "[server file or framework config]"
---
Auditez la configuration CORS (Cross-Origin Resource Sharing) dans `$ARGUMENTS` (par défaut : scannez tous les points d'entrée du serveur, les fichiers de middleware et les configurations du framework) pour les erreurs de configuration qui permettent les attaques cross-origin.

**1. Localiser la configuration CORS**

Trouvez tous les endroits où les en-têtes CORS sont définis :
- Express/Node : middleware `cors()`, `res.setHeader('Access-Control-Allow-Origin', ...)` manuel
- Django : `CORS_ALLOWED_ORIGINS`, `CORS_ALLOW_ALL_ORIGINS`, paramètres `django-cors-headers`
- FastAPI/Starlette : paramètres `CORSMiddleware`
- Spring : `@CrossOrigin`, `WebMvcConfigurer.addCorsMappings`
- Nginx/Apache : directives `add_header Access-Control-Allow-Origin`
- Configurations au niveau de la couche CDN ou API Gateway

**2. Vérifier wildcard origin avec credentials**

La misconfiguration la plus critique :
- `Access-Control-Allow-Origin: *` combiné avec `Access-Control-Allow-Credentials: true` ?
- Les navigateurs bloquent cette combinaison, mais certains frameworks la configurent silencieusement — vérifiez les en-têtes de réponse réels quand des credentials sont présents.

**3. Vérifier la réflexion d'origine**

- Le serveur réfléchit-il l'en-tête de requête `Origin` directement dans `Access-Control-Allow-Origin` sans validation ?
- Motif à chercher : code qui lit `request.headers.origin` ou `$_SERVER['HTTP_ORIGIN']` et l'affiche dans l'en-tête de réponse.
- Cela rend chaque origine approuvée — équivalent à `*` mais contourne la restriction de credentials.

**4. Valider la liste des origines autorisées**

- La liste des origines autorisées est-elle une correspondance exacte (comparaison de chaîne) ou une correspondance par regex/préfixe ?
- Correspondance de préfixe faible : `origin.startsWith('https://example.com')` permet `https://example.com.attacker.com`
- Correspondance de suffixe faible : `origin.endsWith('example.com')` permet `https://attackerexample.com`
- Les origines `null` sont-elles autorisées ? (déclenchées par les iframes en sandbox et `file://` — presque jamais approprié)

**5. Vérifier la gestion des preflight**

- Les requêtes preflight `OPTIONS` sont-elles gérées et retournent-elles les bonnes valeurs `Access-Control-Allow-Methods` et `Access-Control-Allow-Headers` ?
- Les endpoints sensibles (modification d'état, authentifiés) sont-ils protégés même si le preflight est contourné (par exemple, requêtes simples avec `Content-Type: text/plain`) ?

**6. Vérifier les en-têtes exposés**

- `Access-Control-Expose-Headers` inclut-il des en-têtes qui fuient des informations sensibles (par exemple, noms de services internes, tokens de session, identifiants d'utilisateur) ?

**7. Vérifier la configuration par route vs globale**

- Y a-t-il une configuration permissive globale qui est supposée être resserrée par route, mais les remplacements par route manquent sur les endpoints sensibles ?

**Format de sortie** :
```
## CORS Audit

### Findings
[SEVERITY] [file:line or config key] — description
Attack scenario: what an attacker can do from a malicious origin
Fix: exact configuration change

### Current Allowed Origins
[List each configured origin and whether it's appropriate]

### Recommended Configuration
[Paste a corrected config snippet for the framework in use]
```

Sévérité : Critique (réflexion d'origine ou wildcard+credentials), Élevée (regex excessivement large), Moyen (origine null, en-têtes exposés en excès), Faible (lacunes de preflight sur les routes non sensibles).
