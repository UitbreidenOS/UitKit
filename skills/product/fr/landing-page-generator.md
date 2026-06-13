---
name: landing-page-generator
description: "Générateur de pages d'accueil : générer des pages d'accueil hautement convertibles en tant que composants TSX Next.js/React avec Tailwind CSS — sections hero, tableaux de tarification, grilles de fonctionnalités, FAQ, témoignages et métadonnées SEO"
---

# Compétence Générateur de Page d'Accueil

## Quand l'activer
- Construire une nouvelle page d'accueil marketing ou produit à partir de zéro
- Convertir une présentation conceptuelle en code Next.js/React fonctionnel
- Créer une page de lancement produit, page de campagne ou page de capture de leads
- Construire une page de tarification ou des sections de comparaison de fonctionnalités
- Générer des variantes de test A/B pour une page d'accueil

## Quand ne pas l'utiliser
- Applications web complexes (utiliser les compétences d'échafaudage de projets)
- Sites de contenu ou de blog (utiliser une approche basée sur un CMS)
- Tableaux de bord internes (mauvais public et modèles)

## Instructions

### Génération de page complète

```
Générez une page d'accueil pour [produit].

Produit : [nom et description en une ligne]
Public cible : [qui visite cette page]
CTA principal : [ce que vous voulez qu'ils fassent — s'inscrire / démo / acheter / télécharger]
Propositions de valeur clés : [3-5 choses les plus importantes à communiquer]
Tarification : [niveaux ou « contacter les ventes »]
Ton : [professionnel / startup / amical / audacieux / minimal]
Stack : [Next.js 15 App Router / React + Vite]

Générez une page d'accueil complète avec ces sections :

1. Section hero
2. Preuve sociale (logos ou statistiques)
3. Fonctionnalités / avantages
4. Tarification (le cas échéant)
5. FAQ
6. Section CTA
7. Pied de page

RÉSULTAT : Composant TSX complet avec classes Tailwind CSS.
Cible : LCP < 1s, CLS < 0.1, responsive mobile-first.

Structure d'exemple :
// app/page.tsx (Next.js) ou src/App.tsx (React)
import { HeroSection } from '@/components/landing/HeroSection'
import { SocialProof } from '@/components/landing/SocialProof'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FaqSection } from '@/components/landing/FaqSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
```

### Variantes de section hero

```
Générez une section hero pour [produit].

Variante : [centrée / écran divisé / vidéo-bg / minimal / audacieux]
Titre : [titre principal — ou générer à partir de la description du produit]
Sous-titre : [texte de soutien]
CTA : [texte du bouton primaire + URL / texte du bouton secondaire]
Visuel : [capture d'écran / illustration / vidéo / aucun]

HERO CENTRÉ (plus courant pour SaaS) :
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        {/* Badge d'annonce */}
        <div className="mb-8 flex justify-center">
          <span className="rounded-full bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-600 ring-1 ring-orange-200">
            Nouveau — v2.0 maintenant disponible
          </span>
        </div>
        
        {/* Titre */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Construisez plus rapidement avec{' '}
          <span className="text-orange-500">des flux de travail</span> alimentés par l'IA
        </h1>
        
        {/* Sous-titre */}
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Arrêtez d'écrire du boilerplate. Commencez à livrer des fonctionnalités. La boîte à outils que les ingénieurs seniors utilisent pour se déplacer 3x plus vite avec Claude Code.
        </p>
        
        {/* CTA */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/signup"
            className="rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            Commencer gratuitement
          </a>
          <a href="/demo" className="text-sm font-semibold leading-6 text-gray-900">
            Regarder la démo <span aria-hidden="true">→</span>
          </a>
        </div>
        
        {/* Chiffres de preuve sociale */}
        <div className="mt-10 flex items-center justify-center gap-x-8 text-sm text-gray-500">
          <span>★★★★★ 4.9/5</span>
          <span>10,000+ développeurs</span>
          <span>Pas de carte de crédit requise</span>
        </div>
      </div>
    </section>
  )
}

HERO ÉCRAN DIVISÉ (produit + copie côte à côte) :
Générez une variante écran divisé avec image/capture d'écran sur le côté droit.

Générez le hero pour mon produit avec la variante appropriée.
```

### Section Tarification

```
Générez une section de tarification pour [produit].

Niveaux : [liste — Gratuit / Pro $X / Entreprise]
Facturation : [bascule mensuel/annuel ? oui/non]
Le plus populaire : [quel niveau mettre en évidence]
Fonctionnalités par niveau : [liste pour chacun]

COMPOSANT TABLEAU DE TARIFICATION :
const tiers = [
  {
    name: 'Starter',
    price: { monthly: 0, annual: 0 },
    description: 'Parfait pour les individus et les petits projets',
    features: [
      '5 projets',
      '10,000 appels API/mois',
      'Analytique basique',
      'Support email',
    ],
    cta: 'Commencer gratuitement',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: { monthly: 49, annual: 39 },
    description: 'Pour les équipes en croissance qui ont besoin de plus de puissance',
    features: [
      'Projets illimités',
      '100,000 appels API/mois',
      'Analytique avancée',
      'Support prioritaire',
      'Intégrations personnalisées',
      'Collaboration en équipe',
    ],
    cta: 'Commencer l\'essai gratuit',
    href: '/signup?plan=pro',
    highlighted: true,  // Le plus populaire
  },
  {
    name: 'Entreprise',
    price: { monthly: null, annual: null },  // Contacter les ventes
    description: 'Prix personnalisés pour les grandes organisations',
    features: [
      'Tout en Pro',
      'Appels API illimités',
      'Garantie SLA',
      'Support dédié',
      'SSO/SAML',
      'Contrats personnalisés',
    ],
    cta: 'Contacter les ventes',
    href: '/contact',
    highlighted: false,
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)
  
  return (
    <section id="pricing" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tarification simple et transparente
          </h2>
          
          {/* Bascule Annuel/Mensuel */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className={annual ? 'text-gray-500' : 'font-semibold'}>Mensuel</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${annual ? 'bg-orange-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${annual ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={annual ? 'font-semibold' : 'text-gray-500'}>
              Annuel <span className="text-orange-500 text-sm">(économisez 20%)</span>
            </span>
          </div>
        </div>
        
        {/* Cartes de tarification */}
        <div className="mt-16 grid max-w-lg grid-cols-1 gap-6 mx-auto lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 ${tier.highlighted ? 'bg-orange-500 text-white ring-2 ring-orange-500' : 'bg-white ring-1 ring-gray-200'}`}
            >
              {/* ... contenu du niveau */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

Générez la section de tarification pour mes niveaux.
```

### Métadonnées SEO

```
Générez les métadonnées SEO pour [page d'accueil].

Page : [URL / nom de la section]
Produit : [nom]
Mots-clés cibles : [mot-clé principal / mots-clés secondaires]
Image OG : [chemin ou description]

// app/page.tsx (Next.js App Router)
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claudient — Compétences, Agents & Plugins pour Claude Code',
  description: 'Le système de connaissances alimenté par la communauté pour Claude Code. 150+ compétences, 22 agents et hooks pour développeurs, équipes GTM et propriétaires d\'entreprises.',
  keywords: ['claude code', 'productivité IA', 'outils pour développeurs', 'compétences claude'],

  openGraph: {
    title: 'Claudient — Compétences & Agents pour Claude Code',
    description: '150+ compétences dans 15 catégories. Installer avec : npx claudient add all',
    url: 'https://claudient.dev',
    siteName: 'Claudient',
    images: [{ url: '/social-preview.png', width: 1280, height: 640 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claudient — Compétences & Agents pour Claude Code',
    description: '150+ compétences dans 15 catégories.',
    images: ['/social-preview.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://claudient.dev',
  },
}

Générez les métadonnées SEO pour ma page d'accueil.
```

## Exemple

**Utilisateur :** Je lance un outil SaaS B2B qui automatise la réconciliation des factures pour les équipes comptables. J'ai besoin d'une page d'accueil. Générez le hero et la messagerie clé.

**Résultat de Claude :**

**Options de titre (testez celles-ci) :**

Option A (Pain-first) : « Arrêtez de chasser les factures manuellement. Réconciliez en minutes, pas en jours. »
Option B (Outcome-first) : « Réconciliation de factures qui s'exécute réellement toute seule. »
Option C (Time-specific) : « Votre équipe comptable passe 40+ heures/mois sur les factures. Nous réduisons cela à 4. »

**Recommandé : Option C** (plus spécifique, plus crédible)

**Sous-titre :**
« Connectez votre logiciel comptable une fois. Notre IA fait correspondre les factures aux commandes, signale les divergences et surface les exceptions — afin que votre équipe examine les décisions, pas les données. »

**CTA :**
Principal : « Commencer l'essai gratuit » (14 jours, pas de carte de crédit)
Secondaire : « Voir comment ça marche →» (lien de démo vidéo)

**Chiffres de preuve sociale à mettre sous CTA :**
- « 500+ équipes comptables » ou quel que soit votre chiffre réel
- « Moyenne 38 heures économisées par mois » (à partir des données clients)
- « Certifié SOC 2 Type II » (si vous l'avez)

```tsx
// Hero pour SaaS de réconciliation de factures
<section className="bg-white py-24">
  <div className="max-w-2xl mx-auto text-center px-6">
    <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
      Certifié SOC 2 · 500+ équipes comptables
    </span>
    <h1 className="mt-6 text-5xl font-bold text-gray-900">
      Votre équipe comptable passe{' '}
      <span className="text-blue-600">40+ heures</span>{' '}
      sur les factures. Nous réduisons cela à 4.
    </h1>
    <p className="mt-6 text-xl text-gray-600">
      Connectez votre logiciel comptable une fois. Notre IA fait correspondre 
      les factures aux commandes, signale les divergences et surface les exceptions automatiquement.
    </p>
    <div className="mt-10 flex gap-4 justify-center">
      <a href="/trial" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700">
        Commencer l'essai gratuit
      </a>
      <a href="/demo" className="text-blue-600 font-semibold px-8 py-4 flex items-center gap-2">
        Regarder démo 3 min →
      </a>
    </div>
  </div>
</section>
```

---
