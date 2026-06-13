Claude acheminera les requêtes vers les deux et vous pouvez spécifier lequel prioriser par commande.

---

## Dépannage

**« Les outils Salesforce n'apparaissent pas dans la liste des outils »**
- Vérifiez les identifiants API dans settings.json
- Vérifiez l'accès réseau à votre instance Salesforce
- Vérifiez que le jeton de sécurité est correct (réinitialisez dans Setup si incertain)
- Redémarrez Claude Code

**« Échec de la connexion HubSpot »**
- Vérifiez que la clé API est valide (vérifiez dans HubSpot → Settings)
- Assurez-vous que l'application privée dispose des scopes requis
- Vérifiez l'accès réseau à l'API HubSpot
- Redémarrez Claude Code

**« Les requêtes retournent des résultats vides »**
- Vérifiez que le CRM contient des données dans les champs spécifiés
- Vérifiez les permissions utilisateur (accès en lecture aux objets)
- Utilisez la recherche/rapport natif du CRM pour confirmer que les données existent

---

## Étapes suivantes

1. **Configurez votre CRM :** Suivez `salesforce.md` ou `hubspot.md`
2. **Testez avec `/pipeline-review` :** Fournissez un exemple de pipeline CSV ; Claude récupérera et validera les données du CRM
3. **Intégrez dans le flux de travail hebdomadaire :** Exécutez `/pipeline-review` chaque vendredi avant les mises à jour pour les cadres

---
