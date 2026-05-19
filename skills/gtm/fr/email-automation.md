---
name: email-automation
description: "Multi-step outreach email sequences: personalised touchpoints, reply detection routing, follow-up cadence, meeting booking integration, deliverability patterns"
---

> 🇫🇷 Version française. [English version](../email-automation.md).

# Compétence Automatisation des Emails

## Quand activer
- Conception d'une séquence de prospection à froid (3-5 points de contact)
- Rédaction d'e-mails de suivi qui semblent personnels, pas automatisés
- Configuration de la logique de détection des réponses (intéressé / pas maintenant / désabonnement)
- Intégration des séquences d'e-mails avec la réservation de calendrier (Calendly, Cal.com)
- Révision des modèles de délivrabilité (évitement du spam, réchauffement du domaine)

## Quand NE PAS utiliser
- Envois massifs de newsletters — utilisez directement Mailchimp/Klaviyo
- E-mails transactionnels (reçus, confirmations) — gérés par votre plateforme
- Clients existants qui n'ont pas opté pour la prospection — risque RGPD/CAN-SPAM

## Instructions

### Concevoir une séquence de prospection en 4 étapes

```typescript
// Conception de la séquence :
// Jour 0 : Prospection initiale (personnelle, spécifique)
// Jour 3 : Suivi 1 (ajouter de la valeur — ressource, insight, données)
// Jour 7 : Suivi 2 (angle différent ou canal différent)
// Jour 14 : E-mail de rupture (clôture respectueuse, porte ouverte)

const sequence: EmailStep[] = [
  { day: 0,  subject: '{{personalised_hook}}',    type: 'initial' },
  { day: 3,  subject: 'Re: {{original_subject}}', type: 'followup_value' },
  { day: 7,  subject: 'Re: {{original_subject}}', type: 'followup_angle' },
  { day: 14, subject: 'Closing the loop',          type: 'breakup' },
]
```

### Rédiger chaque type d'e-mail

**Initial (Jour 0) — spécifique, court, humain :**
```
Rédigez l'e-mail du Jour 0 pour une séquence de prospection à froid.
Expéditeur : [nom, entreprise, ce que nous faisons]
Prospect : [nom, titre, entreprise, un élément spécifique à son sujet]
Objectif : réserver un appel de 15 minutes
Longueur maximale : 5-6 phrases
Règles : mentionner quelque chose de spécifique (actualités récentes, post, changement de rôle),
         énoncer la valeur en une phrase, CTA souple ("ouvert à un appel rapide ?")
```

**Suivi 1 (Jour 3) — apporter une valeur authentique :**
```
Rédigez le suivi du Jour 3.
Apportez de la valeur avec : [une étude de cas pertinente / stat / ressource / insight]
Référence : l'e-mail original (restez bref)
CTA : identique au Jour 0, reformulé
Longueur : 4-5 phrases
```

**E-mail de rupture (Jour 14) — clôture gracieuse :**
```
Rédigez l'e-mail de rupture du Jour 14.
Ton : compréhensif, pas passif-agressif
Laissez la porte ouverte : "si le timing change / pertinent plus tard"
Pas de culpabilité, pas de "j'ai essayé de vous contacter X fois"
Longueur : 3 phrases maximum
```

### Logique de gestion des réponses

```typescript
async function handleReply(reply: EmailReply) {
  const intent = await classifyIntent(reply.body)
  // intent: 'interested' | 'not_now' | 'not_interested' | 'question' | 'referral'
  
  switch (intent) {
    case 'interested':
      return bookMeeting(reply.from, reply.threadId)
    case 'not_now':
      return scheduleFutureTouch(reply.from, daysFromNow: 90)
    case 'not_interested':
      return markOptedOut(reply.from)
    case 'referral':
      const referred = extractReferredContact(reply.body)
      return addToSequence(referred)
  }
}
```

### Intégration de la réservation de réunions

```typescript
// Ajouter à chaque e-mail avec CTA — toujours utiliser un lien de réservation direct
const BOOKING_FOOTER = `
If a call sounds useful, here's my calendar: {{calendly_link}}
Or just reply and I'll send over a time that works.
`

// API Cal.com — vérifier la disponibilité avant d'envoyer
const slots = await cal.availability.get({
  username: 'your-username',
  dateFrom: addDays(new Date(), 1),
  dateTo: addDays(new Date(), 7),
})
```

### Règles de délivrabilité

```typescript
const SENDING_RULES = {
  maxPerDay: 50,              // par domaine d'envoi
  minDelayBetweenEmails: 90,  // secondes — éviter les patterns d'envoi en masse
  warmUpNewDomain: true,      // commencer à 10/jour, augmenter de 10% par jour
  spfDkimRequired: true,      // vérifier avant le premier envoi
  unsubscribeLink: true,      // requis pour CAN-SPAM/RGPD
  plainTextVersion: true,     // améliore la délivrabilité
  avoidSpamTriggers: [        // ne jamais utiliser dans les lignes d'objet
    'free', 'guarantee', 'no risk', 'click here',
    'make money', 'earn cash', '!!!',
  ],
}
```

### Modèles de personnalisation qui triplent les taux de réponse

```
// Rechercher avant d'écrire — trouver UNE chose spécifique :
// - Actualités récentes de l'entreprise (financement, lancement produit, recrutement)
// - Post ou commentaire LinkedIn récent
// - Contact mutuel ou parcours commun
// - Changement de rôle dans les 6 derniers mois
// - Concurrent qu'ils viennent de remplacer ou un outil qu'ils ont mentionné

// Mauvais (échange de modèle) : "J'ai remarqué que vous êtes le [Titre] chez [Entreprise]"
// Bon (authentique) : "J'ai vu votre post sur la migration de Postgres vers Neon —
//                     la fonctionnalité de branchement que vous avez mentionnée est exactement pourquoi
//                     nous avons construit [X]"
```

## Exemple

**Contexte :** SaaS B2B vendant un outil de gestion de projet. Le prospect est un VP Engineering qui a récemment posté sur sa difficulté avec la visibilité inter-équipes.

**Jour 0 :**
> Objet : Visibilité inter-équipes sur les grands projets
>
> J'ai vu votre post LinkedIn sur le problème de visibilité entre les squads — nous l'entendons beaucoup de la part des VPs à votre échelle.
>
> Nous avons construit [Produit] spécifiquement pour ça : une vue de la progression de chaque équipe sans la surcharge des réunions de statut. [Entreprise X] a réduit ses syncs hebdomadaires de 4 à 1 après avoir switché.
>
> Ça vaut 15 minutes pour vous montrer comment ça fonctionne ?

**Jour 3 :**
> Objet : Re : Visibilité inter-équipes sur les grands projets
>
> Je vous joins un résumé de 2 minutes de la façon dont [Entreprise X] (à votre échelle) a restructuré sa couche de visibilité — cela pourrait être pertinent au vu de ce que vous avez décrit.
>
> Toujours heureux de vous le présenter en direct si utile — même lien : [calendrier]

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
