---
name: sdr-call-prep
description: "Préparation pré-appel pour les SDR : briefing de compte, scripts de conversation personnalisés, réponses aux objections, questions de découverte et structure d'appel — générés en moins de 2 minutes"
---

# Compétence de préparation d'appel SDR

## Quand activer
- Vous avez un appel à froid ou un appel de découverte dans les 30 à 60 minutes à venir
- Vous voulez un script de conversation structuré adapté au contexte d'un prospect spécifique
- Vous avez besoin de scripts de gestion des objections prêts avant de décrocher le téléphone
- Préparation d'un compte prioritaire avec besoin de recherche et d'angles rapidement
- Construction d'un modèle de préparation d'appel réutilisable pour votre équipe SDR

## Quand NE PAS utiliser
- Après l'appel — utilisez `/sdr-call-analysis` pour le suivi et le coaching
- Scripts d'appels à froid génériques sans contexte du prospect — ils ne fonctionneront pas
- Appels internes ou bilans de succès client — cadres différents
- Quand vous avez moins de 5 minutes — utilisez plutôt le format de brief rapide ci-dessous

## Instructions

### Prompt complet de préparation d'appel

```
Prepare me for a cold call with [NAME], [TITLE] at [COMPANY].

My product: [what you sell in one line]
My ICP fit signals for this account: [why this company is a fit]
Recent trigger: [funding, exec hire, product launch, hiring spike — or "none identified"]
Call goal: [book a 20-minute discovery / qualify for demo / re-engage cold lead]

Generate:

## 1. Pre-call brief (read this before dialling)
- What [COMPANY] does (1 sentence)
- What [NAME] cares about in their role
- The ONE reason to call them today (trigger or timing)
- The most likely outcome: [will answer / gatekeeper / voicemail]

## 2. Opening (first 15 seconds)
Voicemail version (if no answer):
Live call version (if they pick up):

Rules:
- State name + company in first sentence
- Permission-based opener: "Did I catch you at a bad time?"
- Trigger reference in first 10 seconds
- Do NOT say "How are you?" — wastes time and sounds scripted

## 3. Talk track (if they stay on the line)
Hook: [personalised reason for calling — reference the trigger]
Bridge: [connect their world to your product — 2 sentences]
Discovery questions: [3 open questions to understand their situation]
Pivot to meeting: [how to book the next step]

## 4. Objection handling (top 4 for this prospect)
Based on their role and company:
[Objection 1]: [Response]
[Objection 2]: [Response]
[Objection 3]: [Response]
[Objection 4]: [Response]

## 5. Discovery questions (if they open up)
Goal: understand pain, timeline, stakeholders, budget authority
[5 open-ended questions — not product-led, pain-led]

## 6. Meeting close
How to transition from a positive call to a booked meeting:
[Exact language to use — specific time slots, not "whenever works"]

## 7. Voicemail script (30 seconds max)
[Full voicemail — name, hook, callback ask]
```

### Format de brief rapide (moins de 2 minutes, à utiliser quand le temps manque)

```
Quick call prep for [NAME] at [COMPANY].

Give me:
1. What they do (10 words)
2. Why call them today (1 trigger)
3. Opening line (scripted, not generic)
4. Their #1 likely objection + 1-sentence response
5. Close: exact words to book the meeting
```

### Structure du script de conversation (le cadre A-B-C)

```
A — ANCHOR (why you're calling them specifically)
"I'm calling because I noticed [specific trigger] — that's usually when companies like yours are [relevant pain]."

B — BRIDGE (connect their world to your product)
"We help [their type of company] solve [specific pain] — [outcome in numbers if possible]."

C — CONFIRM (get to yes/no fast)
"Is that something you're thinking about? / Worth 20 minutes to see if there's a fit?"

---

ADVANCED: Add the LOOP opener for cold calls
"Hey [NAME], [YOUR NAME] from [COMPANY]. I know I'm calling out of nowhere — 
do you have 27 seconds for me to explain why I'm calling, and if it doesn't make sense 
you can hang up immediately?"
→ This disarming opener has a 60%+ response rate vs. traditional openers
```

### Banque de questions de découverte (par catégorie de problème)

```
PRODUCTIVITY / TIME:
- "Walk me through how your team currently handles [X] — where does it slow down?"
- "If you could eliminate one manual task your team does every week, what would it be?"

GROWTH / REVENUE:
- "What's getting in the way of [goal] right now?"
- "How many [leads / deals / customers] are you leaving on the table because of [process gap]?"

TEAM / SCALE:
- "How is the team structured to handle [function] today?"
- "When was the last time this process broke at scale?"

COMPETITIVE:
- "What are you using today for [X] — what do you like about it and what's missing?"
- "Have you looked at alternatives in the last 6 months?"

TIMELINE / URGENCY:
- "Is [problem] something you need to solve this quarter, or is it more of a 2027 priority?"
- "What would need to be true for you to move forward in the next 60 days?"

STAKEHOLDERS:
- "Who else would be involved in evaluating something like this?"
- "If this made sense to you, how does a decision like this typically get made?"
```

### Scripts de gestion des objections (optimisés pour la voix — plus courts qu'en email)

```
OBJECTION: "I'm not interested"
→ "Totally fair — can I ask, is it that this isn't relevant, or just not the right time?"
   (If not relevant: clarify. If timing: "When would be better?")

OBJECTION: "We already have a solution"
→ "Good to know. Are you happy with it or is there anything you wish it did better?"
   (Opens a wedge. Don't push — let them answer.)

OBJECTION: "Send me an email"
→ "Happy to — so I send the right thing, what specifically would you want it to cover?"
   (Converts a brush-off into engagement. Then: "Can I follow up with a quick call Thursday?")

OBJECTION: "Now's not a good time"
→ "No problem — when would be better? I can call back in 5 minutes or next week — 
   whatever works better."
   (Offer specific alternatives, not "whenever you want")

OBJECTION: "We don't have budget"
→ "Makes sense — is this a timing issue, or does the problem not have budget attached at all?
   Sometimes we can structure pilots in a way that comes from a different bucket."

OBJECTION: "Who are you again?"
→ "Sorry — [NAME] from [COMPANY]. We [what you do in 10 words]. I'm calling because 
   [trigger]. Does that sound like something worth 20 minutes?"
```

### Formule de messagerie vocale (27 secondes maximum)

```
"Hey [NAME], [YOUR NAME] from [COMPANY].

I'm calling because [specific trigger — e.g. "I saw your team just hired a new VP of Sales"].

We help [their type of company] [outcome — e.g. "book 40% more meetings without adding headcount"].

I'll try you again [specific day/time — e.g. "Thursday at 2pm"], 
or feel free to grab time here: [short Calendly link].

Have a great [day/week], [NAME]."

---

Rules:
- 27 seconds or less — longer voicemails have <5% callback rate
- Use first name twice — beginning and end
- Give them a specific next step (they won't call back unprompted)
- NEVER say "call me back at your earliest convenience"
```

### Matrice d'appels multi-parties prenantes

```
Si vous appelez une entreprise avec plusieurs contacts, préparez-vous pour chacun :

| Contact | Rôle | Sa priorité | Meilleure accroche | Objection principale |
|---|---|---|---|---|
| [Champion] | Utilise le produit | Efficacité / fonctionnalités | Référence pair | « Notre équipe a déjà essayé X » |
| [Acheteur éco.] | CFO/VP | ROI / risque | Données de résultats business | « Pas dans le budget » |
| [Éval. tech.] | CTO/IT | Sécurité / intégration | Adéquation architecture | « Notre stack est différent » |
| [Gardien] | EA/réceptionniste | Protéger le temps du patron | Chaleureux, direct | « C'est à quel sujet ? » |
```

## Exemple

**Utilisateur :** Préparation d'appel pour Marcus Chen, VP des Ventes chez Lattice. Je vends une plateforme de coaching commercial. Ils viennent d'annoncer une série D (175 M$).

**Résultat :**

**Brief pré-appel :**
Lattice est une plateforme RH et de gestion de la performance pour les équipes People. Marcus Chen dirige une organisation commerciale en pleine croissance qui vient de recevoir une injection de financement majeure — ils vont faire évoluer les représentants rapidement. Sa priorité : la rapidité de montée en compétences et la cohérence des performances sur une équipe plus grande.

**Ouverture (appel en direct) :**
« Bonjour Marcus, [Nom] de [Entreprise]. Je sais que j'appelle à froid — avez-vous 30 secondes ? J'ai vu que Lattice vient de boucler la Série D — félicitations. Faire évoluer rapidement une équipe commerciale signifie généralement que la cohérence du coaching devient un vrai problème. C'est exactement ce que nous résolvons. Ça vaut 20 minutes ? »

**Top 3 objections + réponses :**
1. « Nous utilisons Gong » → « Nous nous intégrons en fait à Gong — nous nous posons au-dessus pour les flux de coaching structurés. Est-ce que vous êtes satisfait de la façon dont les représentants montent en compétences aujourd'hui ? »
2. « Pas dans le budget » → « Je comprends — est-ce une priorité T3 du tout, ou pas à l'ordre du jour avant l'année prochaine ? »
3. « Envoyez-moi des infos » → « Avec plaisir — qu'est-ce qui serait le plus utile : des données ROI ou un clip de démo rapide ? Je peux envoyer l'un ou l'autre dans les 5 prochaines minutes. »

**Clôture pour obtenir un rendez-vous :**
« Si tout cela vous parle, j'ai jeudi à 14h ou vendredi à 10h — lequel vous convient le mieux ? »

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
