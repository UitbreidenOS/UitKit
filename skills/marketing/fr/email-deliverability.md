---
name: email-deliverability
description: "Audit de délivrabilité email : vérification SPF/DKIM/DMARC, analyse des déclencheurs de spam, hygiène de liste, stratégie de montée en charge"
---

# Compétence Délivrabilité Email

## Quand l'activer
- Les taux d'ouverture chutent de manière inattendue (> 20% de baisse semaine après semaine)
- Une campagne atterrit dans le dossier spam ou promotions au lieu de la boîte de réception
- Vous configurez un nouveau domaine d'envoi et avez besoin de configurer l'authentification
- Vous n'avez jamais audité votre infrastructure d'envoi et n'êtes pas sûr qu'elle soit correctement configurée
- Lancement d'une nouvelle plateforme email ou d'une nouvelle adresse IP nécessitant un plan de montée en charge
- Vous observez des taux de rebond élevés (> 2%) ou des taux de plaintes spam (> 0,1%)

## Quand NE PAS utiliser
- Rédaction d'emails — utiliser les compétences `/email-sequence` ou `/email-campaign`
- Décisions de stratégie de campagne — cette compétence concerne l'infrastructure et l'hygiène, pas la messagerie
- Gestion des données CRM — utiliser votre outil CRM ; cette compétence diagnostique la santé des envois
- Emails transactionnels ponctuels que vous contrôlez de bout en bout (réinitialisations de mot de passe, reçus) — se concentrer sur les envois marketing

## Instructions

### Audit complet de délivrabilité

```
Effectuer un audit de délivrabilité sur ma configuration d'envoi email.

Ma configuration :
- Plateforme email : [Mailchimp / Klaviyo / HubSpot / SendGrid / Postmark / autre]
- Domaine d'envoi : [ex. newsletter.masociete.com ou masociete.com]
- Volume d'envoi mensuel : [X emails/mois]
- Taille de liste : [X abonnés]
- Ancienneté de la liste : [quelle est l'ancienneté du segment le plus ancien ?]
- Taux d'ouverture moyen (3 derniers mois) : [X%]
- Taux de clic moyen : [X%]
- Taux de rebond : [X%]
- Taux de plainte spam : [X%] (trouver dans les analytics de votre plateforme)
- Placement en boîte de réception actuel : [boîte de réception / promotions / spam — ou inconnu]

Effectuer un diagnostic dans ces domaines :

## 1. Authentification (SPF / DKIM / DMARC)
Vérifier ces enregistrements pour [DOMAINE] :
SPF : vérifier que l'enregistrement TXT inclut les serveurs de votre plateforme d'envoi
DKIM : vérifier que les enregistrements CNAME ou TXT de votre plateforme sont actifs
DMARC : vérifier qu'une politique DMARC existe et ce qu'elle fait (none / quarantine / reject)

Ce que chacun signifie :
- SPF manquant → classification spam facile, certains fournisseurs rejettent purement
- DKIM manquant → pas de signature cryptographique → traité comme courrier non signé/non vérifié
- DMARC manquant → usurpation de domaine triviale → les fournisseurs pénalisent le domaine

Politique DMARC de départ recommandée :
v=DMARC1; p=none; rua=mailto:dmarc-reports@votredomaine.com; pct=100

Passer à p=quarantine après 30 jours de rapports propres, puis p=reject après 60 jours.

## 2. Configuration du domaine d'envoi
- Envoyez-vous depuis un sous-domaine (newsletter.societe.com) ou le domaine racine ?
  Recommandation : sous-domaine pour le marketing, domaine racine pour le transactionnel — pools de réputation séparés
- L'adresse d'expéditeur correspond-elle au domaine authentifié ?
- Le Reply-To est-il différent du From ? (pas un problème, mais à noter)
- L'IP d'envoi a-t-elle un DNS inverse (enregistrement PTR) ?

## 3. Analyse du contenu
Coller ci-dessous le HTML et la version texte d'un email récent et je vais analyser :
- Mots déclencheurs de spam dans la ligne d'objet et le corps
- Ratio texte/image (< 20% de texte = probablement dossier promotions)
- Domaines de liens — utilisez-vous un domaine de suivi de clics personnalisé ?
- Texte alternatif sur les images (manquant = signal spam)
- Présence du lien de désinscription (légalement obligatoire, améliore la délivrabilité)
- En-tête List-Unsubscribe (doit être présent dans les en-têtes)
- Adresse physique dans le pied de page (exigence CAN-SPAM)

## 4. Hygiène de liste
Fournir la répartition de votre liste :
- Total des abonnés : [X]
- N'a jamais ouvert en 90 jours : [X] → candidat à la suppression
- N'a jamais ouvert en 180 jours : [X] → mise en veille / ré-engagement nécessaire
- Rebonds durs : [X] → à supprimer immédiatement
- Rebonds doux (3+ fois) : [X] → à supprimer
- Désabonnements non honorés dans les 10 jours : [X] → risque juridique, corriger immédiatement

## 5. Segmentation par engagement
Le facteur de délivrabilité le plus important en 2024+ est l'engagement.
Gmail et Apple Mail filtrent principalement selon que les destinataires interagissent.

Segmenter votre liste :
- Très engagé : a ouvert ou cliqué dans les 30 derniers jours → Envoi priorité 1
- Engagé : a ouvert dans les 90 derniers jours → Envoi standard
- Peu engagé : dernière ouverture il y a 90-180 jours → Campagne de ré-engagement avant inclusion
- Inactif : aucune ouverture depuis 180+ jours → Séquence de mise en veille, puis suppression

Ne jamais envoyer aux abonnés inactifs mélangés avec des abonnés engagés.
Le taux de plaintes et de non-engagement des segments inactifs pénalise la réputation de l'ensemble de votre domaine.

## 6. Résumé du score de délivrabilité
| Zone | Statut | Action requise |
|---|---|---|
| SPF | ✓ / ✗ | [corriger si manquant] |
| DKIM | ✓ / ✗ | [corriger si manquant] |
| DMARC | ✓ / none / reject | [définir la politique] |
| Isolation de sous-domaine | ✓ / ✗ | [séparer si nécessaire] |
| Hygiène de liste | Propre / Problèmes | [décrire les problèmes] |
| Segments d'engagement | Segmenté / Non segmenté | [action] |
| Indicateurs de contenu | [N problèmes trouvés] | [liste] |

Santé globale : Verte / Orange / Rouge
Actions prioritaires classées par impact : [liste numérotée]
```

### Guide de configuration des enregistrements DNS

```
Générer les enregistrements DNS exacts à configurer pour [PLATEFORME D'ENVOI] sur le domaine [DOMAINE].

Plateforme : [Mailchimp / Klaviyo / SendGrid / Postmark / HubSpot / autre]
Domaine d'envoi : [votredomaine.com ou sous-domaine]
Fournisseur DNS actuel : [Cloudflare / Route53 / GoDaddy / Namecheap / autre]

Générer :

## Enregistrement SPF
Type : TXT
Hôte : @ (ou sous-domaine)
Valeur : [déclaration include spécifique à la plateforme]
Exemple : "v=spf1 include:sendgrid.net include:_spf.google.com ~all"
TTL : 3600

Note : un seul enregistrement SPF par domaine/sous-domaine. Si vous en avez déjà un, ajouter le nouvel include à celui-ci — ne pas créer un second enregistrement TXT.

## Enregistrements DKIM
[La plateforme fournit ces enregistrements — lister les enregistrements CNAME ou TXT avec hôte et valeur]
Type : CNAME ou TXT (spécifique à la plateforme)
TTL : 3600

## Enregistrement DMARC
Type : TXT
Hôte : _dmarc.[domaine]
Valeur : v=DMARC1; p=none; rua=mailto:dmarc@[domaine]; pct=100
Commencer avec p=none. Examiner les rapports pendant 30 jours. Passer à p=quarantine, puis p=reject.

## Enregistrement BIMI (optionnel — logo de marque dans la boîte de réception)
Nécessite DMARC avec p=quarantine ou p=reject en premier.
Type : TXT
Hôte : default._bimi.[domaine]
Valeur : v=BIMI1; l=https://[domaine]/logo.svg; a=;

## Étapes de vérification après propagation DNS (24-48 heures)
Tester SPF : utiliser le vérificateur d'enregistrement SPF MXToolbox
Tester DKIM : envoyer un email de test et vérifier les en-têtes dans Gmail (Afficher la source)
Tester DMARC : vérifier [domaine] sur dmarcanalyzer.com
Tester la délivrabilité : envoyer à mail-tester.com pour obtenir un score sur 10
```

### Scanner de mots déclencheurs de spam

```
Analyser cet email pour les déclencheurs de spam.

Ligne d'objet : [coller]
Texte de prévisualisation : [coller]
Corps de l'email : [coller le texte brut ou HTML]

Vérifier :
1. Mots spam classiques dans l'objet (à éviter entièrement) :
   - Financier : "argent gratuit", "revenus garantis", "sans risque", "gagner €", "cash"
   - Abus d'urgence : "agissez maintenant", "offre limitée!!!", "dépêchez-vous", "ne ratez pas ça"
   - Trop promotionnel : "meilleur prix", "acheter maintenant", "réduction", "prix le plus bas"
   - Modèles de phishing : "cliquez ici", "vérifiez votre", "confirmez votre compte"
   - MAJUSCULES EXCESSIVES ET POINTS D'EXCLAMATION!!!

2. Problèmes de contenu dans le corps :
   - Ratio image/texte : images sans texte alternatif + peu de texte = promotion/spam
   - Liens vers des domaines suspects ou des domaines de suivi non liés
   - Lien de désinscription manquant ou caché
   - Aucune adresse physique dans le pied de page

3. Longueur et ponctuation de la ligne d'objet :
   - Longueur optimale : 30-50 caractères
   - Éviter : 3+ marques de ponctuation, 3+ emojis à la suite
   - Éviter : lignes d'objet entièrement en minuscules ou EN MAJUSCULES

4. Problèmes HTML :
   - Styles inline uniquement (le CSS externe peut être supprimé)
   - HTML propre — pas copié-collé depuis Word (Word intègre des balises cachées)
   - Version texte seul présente (HTML sans sauvegarde texte brut = signal spam)

Résultat :
- Score de risque spam : Faible / Moyen / Élevé
- Déclencheurs spécifiques trouvés et quelle règle ils enfreignent
- Ligne d'objet révisée (si nécessaire)
- Top 3 des corrections de corps
```

### Calendrier de montée en charge pour un nouveau domaine

```
Construire un calendrier de montée en charge pour un nouveau domaine ou IP d'envoi.

Domaine/IP : [nouveau domaine d'envoi ou adresse IP]
Volume d'envoi cible : [X emails/mois à pleine capacité]
Qualité de liste de départ : [opt-in vérifié, double opt-in, ou importé/inconnu]
Plateforme : [nom de l'ESP]

Principes de montée en charge :
1. Commencer avec vos abonnés les plus engagés (ouvertures et clics récents) — ils signalent un engagement positif
2. Monter lentement — doubler ou tripler trop vite déclenche les filtres spam
3. Surveiller le taux de rebond et le taux de plaintes quotidiennement pendant la montée en charge
4. Ne jamais envoyer à une liste froide/inactive pendant la montée en charge — ruine la réputation du domaine dès le premier jour
5. Les envois quotidiens réguliers sont plus efficaces que les envois importants irréguliers

Calendrier de montée en charge :

Semaine 1 :
- Volume quotidien : 50 emails
- Envoyer à : Abonnés les plus engagés (7 derniers jours)
- Seuil de rebond : < 1%
- Seuil de plaintes : < 0,05%

Semaine 2 :
- Volume quotidien : 200 emails
- Envoyer à : Engagés (30 derniers jours)
- Seuils : identiques

Semaine 3 :
- Volume quotidien : 500 emails
- Envoyer à : Engagés (60 derniers jours)

Semaine 4 :
- Volume quotidien : 1 000-2 000 emails
- Envoyer à : Engagés (90 derniers jours)

Mois 2 :
- Monter à 10% du volume cible
- Commencer à inclure les modérément engagés (180 derniers jours)

Mois 3+ :
- Volume plein, tous les abonnés vérifiés
- Inactifs > 180 jours : campagne de mise en veille avant inclusion

Si le taux de rebond dépasse 2% ou le taux de plaintes dépasse 0,1% à n'importe quelle étape :
ARRÊTER la montée en charge. Diagnostiquer. Nettoyer la liste. Reprendre depuis le palier de volume précédent.

Générer mon calendrier hebdomadaire spécifique du [DATE DE DÉBUT] pour atteindre [VOLUME CIBLE] d'ici [DATE CIBLE].
```

### Procédure standard d'hygiène de liste

```
Générer une procédure standard d'hygiène de liste pour [PLATEFORME].

Liste actuelle : [X abonnés]
Problèmes actuels : [rebonds élevés / faible taux d'ouverture / plaintes spam / tout ce qui précède]

Checklist d'hygiène (à effectuer mensuellement) :

1. Supprimer immédiatement les rebonds durs
   Définition : l'adresse email n'existe pas ou est définitivement non délivrable
   Action : automatiquement supprimé par la plupart des plateformes — vérifier que votre plateforme le fait

2. Supprimer l'accumulation de rebonds doux
   Définition : 3+ rebonds doux en 90 jours (boîte pleine, problème serveur temporaire)
   Action : déplacer vers la liste de suppression, re-vérifier via un service de vérification d'emails

3. Supprimer les plaignants spam
   Définition : l'abonné a cliqué sur "marquer comme spam" (signalé via la boucle de rétroaction)
   Action : supprimer immédiatement, ne pas réabonner même s'ils le demandent poliment

4. Mettre en veille les abonnés inactifs (trimestriellement)
   Définition : aucune ouverture d'email en 180 jours
   Processus :
   a. Envoyer une campagne de ré-engagement de 3 emails sur 2 semaines
   b. Suivre qui ouvre ou clique — restaurer dans la liste active
   c. Après 3 emails sans engagement : supprimer définitivement
   d. Ne pas renvoyer aux contacts supprimés — respecter leur désinscription implicite

5. Vérifier les nouvelles importations de liste
   Avant d'envoyer à une liste importée (salon, achetée, anciennes données CRM) :
   - Passer par un service de vérification d'emails (NeverBounce, ZeroBounce, BriteVerify)
   - Supprimer les adresses inconnues/risquées (> 5% de risque = ne pas envoyer du tout)
   - Confirmation de double opt-in avant ajout aux envois marketing

Résultat : calendrier d'hygiène mensuel et modèle d'email pour la séquence de ré-engagement.
```

### Référence des métriques clés de délivrabilité

```typescript
interface DeliverabilityHealth {
  // Inbox placement rate (use GlockApps, Litmus, or 250ok to measure)
  inboxPlacementRate: number  // target: > 90%

  // From your ESP dashboard
  openRate: number            // target: > 20% (Gmail/Apple Mail clip post-privacy)
  clickRate: number           // target: > 2%
  bounceRate: number          // alert at > 2%, danger at > 5%
  spamComplaintRate: number   // alert at > 0.08%, danger at > 0.1% (Google threshold)
  unsubscribeRate: number     // alert at > 0.5% per campaign

  // List health
  activeEngagedPercent: number    // subscribers who opened in last 90 days / total
  inactivePercent: number         // no open in 180 days / total
}

const DELIVERABILITY_THRESHOLDS = {
  inboxPlacementRate: { healthy: 0.90, concern: 0.80, critical: 0.70 },
  bounceRate: { healthy: 0.02, concern: 0.05, critical: 0.10 },
  spamComplaintRate: { healthy: 0.0005, concern: 0.001, critical: 0.003 },
  // Note: Google's postmaster tools flag domains at 0.1% complaint rate
  // Apple Mail Privacy Protection (iOS 15+) inflates open rates — do not use open rate alone
}
```

## Exemple

**Utilisateur :** Mes taux d'ouverture sont passés de 32% à 19% en 3 mois. Je n'ai rien changé. Que dois-je vérifier en premier ?

**Framework de diagnostic :**

```
Une chute de 13 points du taux d'ouverture en 3 mois sans changement de contenu pointe vers l'une de ces causes
par ordre de probabilité :

1. Dégradation de liste — les abonnés inactifs se sont accumulés et font baisser l'engagement
   Vérifier : % de votre liste sans ouverture en 90 jours. Si > 30%, c'est votre coupable.
   Correction : supprimer immédiatement le segment inactif, lancer une campagne de ré-engagement

2. Changement de délivrabilité — la réputation du domaine ou de l'IP a changé (courant après un envoi à fort taux de rebond)
   Vérifier : se connecter à Google Postmaster Tools pour votre domaine. Regarder les graphiques de réputation de domaine et
   de taux de spam. Une baisse de réputation de domaine est directement corrélée à la perte de placement en boîte de réception.
   Correction : effectuer un audit complet d'authentification, nettoyer la liste, réduire la fréquence d'envoi pendant 30 jours

3. Accumulation de la protection de confidentialité Apple Mail — si votre liste est principalement des utilisateurs iOS,
   les ouvertures artificiellement gonflées depuis 2021 sont maintenant éliminées à mesure que ces utilisateurs deviennent inactifs.
   Ce n'est pas un vrai problème de délivrabilité — c'est un problème de mesure.
   Correction : passer au taux de clic comme métrique d'engagement principale. Le taux d'ouverture est peu fiable pour iOS.

4. Changement de domaine d'envoi — avez-vous migré vers un nouveau sous-domaine, ESP ou IP sans nouveau préchauffage ?
   Vérifier : en-têtes d'email d'une campagne envoyée. Quelle est l'IP d'envoi réelle ?
   Correction : calendrier de montée en charge pour la nouvelle infrastructure.

Commencer par Google Postmaster Tools — c'est gratuit et indique en 24 heures si Gmail
classe votre domaine comme spam. Cela réduit immédiatement le diagnostic.
```

---
