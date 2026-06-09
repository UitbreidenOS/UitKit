# Règles de Gestion des Dépendances

## S'applique à
Tous les projets — tout langage, tout gestionnaire de paquets (`npm`, `pip`, `cargo`, `go mod`, `maven`, `gem`).

## Règles

1. **Épingler les dépendances directes à des versions exactes ou verrouillées par plage** — `"express": "4.18.2"` et non `"express": "*"`. Pour les bibliothèques, `"~4.18.0"` (correctifs uniquement) est acceptable. Les dépendances transitives non épinglées sont gérées par les fichiers de verrouillage.

2. **Valider les fichiers de verrouillage pour les applications, pas pour les bibliothèques** — `package-lock.json`, `Cargo.lock`, `poetry.lock`, `go.sum` appartiennent au contrôle de source pour les applications déployées. Les fichiers de verrouillage de bibliothèques contraignent inutilement les consommateurs.

3. **Exécuter `npm audit` / `pip-audit` / `cargo audit` en CI** — échouer la construction sur les CVE de gravité haute ou critique. Traiter une dépendance vulnérable comme un test défaillant.

4. **Séparer les dépendances d'exécution des dépendances de développement** — `devDependencies` dans npm, `dev = true` dans Poetry, `[dev-dependencies]` dans Cargo. Les outils de développement ne doivent pas être expédiés dans les images de production.

5. **Examiner chaque nouvelle dépendance avant de l'ajouter** — vérifier : date du dernier commit, téléchargements hebdomadaires, CVE ouvertes, compatibilité des licences. Une dépendance est un engagement de maintenance. Rejeter les paquets abandonnés ou sous-maintenus pour une utilisation en production.

6. **Préférer la bibliothèque standard** — avant d'ajouter une dépendance, vérifier si la stdlib du langage couvre le besoin. Une solution stdlib de 5 lignes vaut mieux qu'un graphe de dépendances transitives de 500 KB pour le formatage des dates.

7. **Mettre à jour les dépendances selon un calendrier, pas seulement en cas de casse** — des PR automatisées hebdomadaires ou bihebdomadaires (Dependabot, Renovate) avec CI réussissant sont routinières. Les mises à jour d'urgence sous pression sans couverture de test sont dangereuses.

8. **Vérification des licences en CI** — utiliser `license-checker`, `pip-licenses`, ou `cargo-deny` pour appliquer les listes blanches de licences. Expédier du code GPL dans un produit propriétaire est un risque juridique, pas un risque technique.

9. **Supprimer les dépendances inutilisées** — `depcheck` (Node), `pip-autoremove`, `cargo machete`. Les paquets inutilisés gonflent la taille de l'image, augmentent la surface d'attaque et compliquent les audits.

10. **Isoler les mises à jour de version majeure comme leur propre PR** — un saut de version majeure est un changement cassant. Le regrouper avec le travail de fonctionnalité rend l'analyse des causes racines impossible en cas de casse.

11. **Vendoriser les dépendances pour les environnements isolés d'air ou hautement réglementés** — `go mod vendor`, npm `--prefer-offline` avec un registre local, ou un proxy Artifactory/Nexus privé. S'appuyer sur les registres publics à l'exécution est un risque de chaîne d'approvisionnement.

12. **Vérifier l'intégrité du paquet** — utiliser `npm ci` plutôt que `npm install` en CI (strict sur le fichier de verrouillage). En Python, vérifier les hachages avec `pip install --require-hashes`. En Go, `go.sum` fournit cela automatiquement.

13. **Ne jamais installer les paquets avec `sudo` dans les environnements d'application** — utiliser des environnements virtuels en espace utilisateur (Python `venv`, Node `node_modules` local au projet). Les installations globales polluent le système et créent des conflits entre les projets.

14. **Surveiller les attaques par confusion de dépendances** — les noms de paquets internes ne doivent pas entrer en collision avec les noms du registre public. Utiliser des paquets à portée (`@myorg/internal-lib`) ou la portée du registre privé pour prévenir les attaques par usurpation d'espace de noms.

15. **Documenter pourquoi une dépendance non évidente existe** — un commentaire `# needed for X because stdlib doesn't support Y` dans `requirements.txt` ou une note de description PR empêche les développeurs futurs de supprimer une dépendance qui semble inutilisée.


---

> **Travaillez avec nous:** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
