---
name: remotion
description: "Génération vidéo Remotion : créer des vidéos de démo produit, des notes de version animées et des vidéos explicatives en tant que composants React — rendu en MP4/GIF par programme"
---

# Remotion Skill

## Quand activer
- Créer une vidéo de démo produit à partir du code (pas besoin d'éditeur vidéo)
- Construire des notes de version animées ou des journaux de modifications
- Générer une vidéo explicative pour une fonctionnalité ou un processus
- Créer une vidéo de visualisation de données à partir de données dynamiques
- Automatiser la génération vidéo dans un pipeline CI/CD

## Quand ne PAS utiliser
- Enregistrement d'écran — utiliser Loom ou OBS
- Édition de séquences vidéo existantes — utiliser DaVinci Resolve ou Premiere
- Streaming vidéo en temps réel
- GIF simple — utiliser un outil GIF pour les animations statiques

## Instructions

### Configuration du projet

```bash
# Create a new Remotion project
npm create video@latest

# Or add to existing project
npm install remotion @remotion/cli @remotion/player

# Directory structure
src/
  remotion/
    Root.tsx          ← registers all compositions
    compositions/
      ProductDemo.tsx  ← your video compositions
      ReleaseNotes.tsx
  index.ts

# Preview in browser (hot reload)
npx remotion studio

# Render to MP4
npx remotion render ProductDemo output/demo.mp4

# Render to GIF
npx remotion render ProductDemo output/demo.gif --codec=gif
```

### Vidéo de démo produit

```tsx
Générer une composition de vidéo de démo produit.

Product: [décrire]
Duration: [X secondes]
Scenes: [lister ce qu'il faut montrer]

// src/remotion/compositions/ProductDemo.tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'

export const ProductDemo: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  
  // Scene transitions using frame ranges
  const scene1End = fps * 3    // 0-3s: hero
  const scene2End = fps * 7    // 3-7s: feature 1
  const scene3End = fps * 12   // 7-12s: feature 2
  
  // Fade in animation
  const opacity = spring({
    frame,
    fps,
    config: { damping: 200 },
    from: 0, to: 1,
  })
  
  // Slide in from bottom
  const translateY = interpolate(
    frame,
    [0, 20],
    [50, 0],
    { extrapolateRight: 'clamp' }
  )
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      {frame < scene1End && (
        // Scene 1: Hero
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            opacity,
            transform: `translateY(${translateY}px)`,
            color: 'white',
            fontSize: 72,
            fontWeight: 900,
            fontFamily: 'Arial Black',
          }}>
            Product Name
          </div>
          <div style={{ color: '#f97316', fontSize: 28, marginTop: 16 }}>
            The tagline goes here
          </div>
        </AbsoluteFill>
      )}
      
      {frame >= scene1End && frame < scene2End && (
        // Scene 2: Feature demonstration
        <FeatureScene
          frame={frame - scene1End}
          fps={fps}
          title="Feature One"
          description="This is what it does for the user"
        />
      )}
    </AbsoluteFill>
  )
}

// Register in Root.tsx:
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ProductDemo"
      component={ProductDemo}
      durationInFrames={360}   // 12 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  </>
)

Générer la composition pour mon produit.
```

### Notes de version animées

```tsx
Générer une vidéo de notes de version animées.

Version: [p.ex. v2.0]
Features: [liste des nouvelles fonctionnalités avec descriptions]
Duration: [X secondes par fonctionnalité]

// src/remotion/compositions/ReleaseNotes.tsx
import { AbsoluteFill, Sequence, useCurrentFrame, spring } from 'remotion'

const FEATURES = [
  { title: "Dark Mode", description: "Toggle between light and dark themes", icon: "🌙" },
  { title: "Bulk Export", description: "Export multiple items at once as CSV", icon: "📦" },
  { title: "Team Permissions", description: "Role-based access for every team member", icon: "🔒" },
]

const SECONDS_PER_FEATURE = 4

export const ReleaseNotes: React.FC = () => {
  const frame = useCurrentFrame()
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      {/* Version badge */}
      <div style={{
        position: 'absolute', top: 40, left: 60,
        color: '#f97316', fontSize: 24, fontWeight: 700,
      }}>
        v2.0 Release
      </div>
      
      {FEATURES.map((feature, i) => (
        <Sequence
          key={feature.title}
          from={i * SECONDS_PER_FEATURE * 30}
          durationInFrames={SECONDS_PER_FEATURE * 30}
        >
          <FeatureCard feature={feature} />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

const FeatureCard: React.FC<{ feature: typeof FEATURES[0] }> = ({ feature }) => {
  const frame = useCurrentFrame()
  const opacity = spring({ frame, fps: 30, config: { damping: 100 }, from: 0, to: 1 })
  const scale = spring({ frame, fps: 30, config: { damping: 150 }, from: 0.8, to: 1 })
  
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        opacity, transform: `scale(${scale})`,
        background: '#1e293b', borderRadius: 24, padding: '48px 64px',
        border: '1px solid #334155', maxWidth: 600, textAlign: 'center',
      }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>{feature.icon}</div>
        <div style={{ color: 'white', fontSize: 42, fontWeight: 800, marginBottom: 16 }}>
          {feature.title}
        </div>
        <div style={{ color: '#94a3b8', fontSize: 22, lineHeight: 1.6 }}>
          {feature.description}
        </div>
      </div>
    </AbsoluteFill>
  )
}

Générer pour ma liste de fonctionnalités.
```

### Rendu et export

```bash
# Render as MP4 (high quality)
npx remotion render ReleaseNotes output/release-v2.mp4 \
  --codec=h264 \
  --crf=18 \
  --scale=1

# Render as GIF (for social sharing)
npx remotion render ReleaseNotes output/release-v2.gif \
  --codec=gif \
  --scale=0.5 \
  --every-nth-frame=2

# Render specific time range
npx remotion render ProductDemo output/clip.mp4 \
  --frames=0-90    # first 3 seconds at 30fps

# Render with custom props
npx remotion render ReleaseNotes output/release.mp4 \
  --props='{"version":"2.1","features":["New dashboard","Dark mode"]}'

# Programmatic rendering (in Node.js scripts or CI)
import { renderMedia, selectComposition } from '@remotion/renderer'

const composition = await selectComposition({
  serveUrl: 'http://localhost:3000',
  id: 'ReleaseNotes',
})

await renderMedia({
  composition,
  serveUrl: 'http://localhost:3000',
  codec: 'h264',
  outputLocation: 'output/release.mp4',
})
```

## Exemple

**User:** Créer une vidéo de démo produit de 15 secondes pour un outil SaaS de facturation. Montrer : 1) intro du logo, 2) écran de création de facture, 3) envoyer et suivre, 4) CTA.

**Claude's output:**

```tsx
// 15 seconds = 450 frames at 30fps
// Scene breakdown:
// 0-60 frames (2s): Logo intro with fade in
// 60-210 frames (5s): Create invoice demo
// 210-360 frames (5s): Send & track feature
// 360-450 frames (3s): CTA with animation

export const InvoicingDemo: React.FC = () => {
  const frame = useCurrentFrame()
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#f8fafc' }}>
      <Sequence from={0} durationInFrames={60}>
        <LogoIntro />
      </Sequence>
      <Sequence from={60} durationInFrames={150}>
        <CreateInvoiceScene frame={frame - 60} />
      </Sequence>
      <Sequence from={210} durationInFrames={150}>
        <SendTrackScene frame={frame - 210} />
      </Sequence>
      <Sequence from={360} durationInFrames={90}>
        <CTAScene frame={frame - 360} />
      </Sequence>
    </AbsoluteFill>
  )
}
```

Render: `npx remotion render InvoicingDemo demo.mp4 --fps=30`

---
