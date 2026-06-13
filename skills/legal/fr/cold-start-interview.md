# Entretien Démarrage Zéro — Configuration du Plugin Juridique

## Quand activer

- Première utilisation d'une compétence juridique pour une nouvelle organisation
- La sortie du plugin juridique contient des marqueurs `[PLACEHOLDER]`
- La sortie est trop générique et non spécifique à la pratique
- Intégration d'une nouvelle équipe juridique à Claude Code

**Pourquoi cela compte :** L'entretien de démarrage zéro est le point de levier le plus courant pour la qualité des compétences juridiques. Une sortie générique est presque toujours traçable à un entretien ignoré ou incomplet. Un entretien de 10 à 15 minutes transforme chaque compétence en aval de générique à spécifique à la pratique.

## Quand NE PAS utiliser

- L'entretien est déjà terminé et un profil d'organisation existe — vérifiez `~/.claude/plugins/config/legal/company-profile.md` avant de relancer
- Tâches de recherche juridique ponctuelles où la personnalisation n'est pas nécessaire et aucune décision de playbook ne sera prise

## Instructions

L'entretien recueille quatre catégories d'informations et les écrit dans un profil d'organisation. Travaillez séquentiellement à travers chaque catégorie — ne sautez pas de sections.

---

**1. Contexte de la pratique (qui vous êtes)**

Recueillez :
- Nom de l'organisation et type d'entité : cabinet juridique / équipe juridique interne / département juridique indépendant
- Domaines de pratique traités (contrats commerciaux, droit du travail, propriété intellectuelle, fusions-acquisitions, protection des données, etc.)
- Juridiction(s) où vous pratiquez — spécifiez la loi régissante principale
- Plage de valeur de transaction typique (par exemple, accords de fournisseur de 50 000 $ à 2 millions $)
- Posture de risque : agressive / conforme au marché / conservatrice

---

**2. Structure de l'équipe et escalade**

Recueillez :
- Taille de l'équipe et rôles (assistant juridique → associé → conseil → directeur juridique / associé principal)
- Limites d'autorité en dollars par rôle — ce que chaque rôle peut approuver sans escalade
- Contacts d'escalade : nom et identifiant Slack ou email par niveau d'autorité
- Canal d'escalade préféré : Slack / email / réunion régulière

---

**3. Positions du Playbook (par type de contrat)**

Pour chaque type de contrat traité par l'équipe, documentez :

| Champ | Recueillir |
|-------|---------|
| Côté | Côté ventes ou côté achat |
| Limitation de responsabilité | Plafond préféré (par exemple, 1× honoraires), alternatives acceptables, liste de non-acceptation |
| Indemnisation | Position standard, alternatives acceptables, non-acceptation |
| Loi applicable et juridiction | Préféré, acceptable, non-acceptation |
| Protection des données | Exigences DPA, clauses standard préférées |
| Obstacle rédhibitoire | La clause unique qui nécessite immédiatement une escalade pour ce type de contrat |

Types de contrats typiques à couvrir : accord de fournisseur SaaS, NDA, accord d'emploi, accord de services, accord de traitement des données, accord de partenariat.

---

**4. Systèmes et intégrations**

Recueillez :
- Système CLM utilisé (le cas échéant) et statut d'intégration avec Claude Code
- Localisation du stockage des contrats (lecteur partagé, CLM, archive e-mail)
- Autres outils de la pile juridique avec lesquels Claude Code pourrait avoir besoin d'interagir

---

**Résultat :** Écrivez un profil sur `~/.claude/plugins/config/legal/company-profile.md` (partagé entre toutes les compétences juridiques) et des sous-profils spécifiques à la pratique par type de compétence dans le même répertoire.

Après l'écriture du profil, confirmez quelles compétences juridiques sont maintenant actives et comment elles utiliseront le profil. Toutes les compétences juridiques lisent ce profil avant de traiter tout document.

**Sécurité :** Le profil est stocké localement uniquement. Ne vous envoyez jamais le contenu du profil en dehors du système local.

## Exemple

**Entrée :** « Parcourez-moi l'entretien de démarrage zéro pour notre équipe juridique interne dans une entreprise SaaS de 200 personnes. Nous traitons principalement des accords de fournisseur SaaS, des NDA et des questions d'emploi. Nous sommes du côté acheteur et préférons les positions conservatrices. »

**Comportement attendu :**

La compétence mène l'entretien en quatre catégories comme une conversation structurée, recueillant des réponses à chaque domaine. À la fin, elle écrit :

- `~/.claude/plugins/config/legal/company-profile.md` — identité de l'organisation, structure de l'équipe, contacts d'escalade
- `~/.claude/plugins/config/legal/playbook-saas-vendor.md` — positions pour les accords de fournisseur SaaS
- `~/.claude/plugins/config/legal/playbook-nda.md` — positions pour les NDA
- `~/.claude/plugins/config/legal/playbook-employment.md` — positions pour les questions d'emploi

Puis confirme : « Profil complet. Les compétences Contract Reviewer, Escalation Flagger et Redline Negotiator utiliseront désormais ce profil pour tous les examens. »

---
