# Workflows Vision et Multimodaux dans Claude Code

Claude peut analyser les images, PDFs, screenshots, et schémas comme inputs première-classe aux côtés du texte. Ce guide couvre comment obtenir du contenu visuel dans Claude Code, ce que Claude peut extraire de celui-ci, et les workflows end-to-end qui combinent la vision avec la génération de code et les fixes automatisés.

---

## Que Claude peut voir

Claude supporte quatre formats d'image :

| Format | Notes |
|---|---|
| PNG | Sans perte. Meilleur pour les screenshots, schémas, captures d'interface |
| JPEG / JPG | Avec perte. Acceptable pour les photos; évitez pour les images texte-riche |
| GIF | Frame statique seulement — Claude lit le premier frame, pas l'animation |
| WebP | Supporté. Variantes sans perte et avec perte |

**Les PDFs** sont traités comme des images — chaque page est rendue et analysée visuellement. Claude ne parse pas les flux de texte PDF; il lit ce qui est visible sur la page rendue. Cela signifie qu'il peut traiter les PDFs scannés, les documents manuscrits, et les PDFs contenu mixte de la même manière que les images.

**Les screenshots** sont le input multimodal le plus courant dans les workflows Claude Code. Ils ne requièrent aucune conversion de format — glissez depuis n'importe quel outil de screenshot, ou piped depuis un script de capture.

Claude ne peut pas traiter :
- Les fichiers vidéo (aucune extraction de frame, aucune analyse de mouvement)
- Les flux caméra en temps réel
- L'audio intégré dans les fichiers média
- Les frames d'animation GIF au-delà de la première

---

## Passer des images à Claude Code

### Glisser-déposer dans le terminal

Dans les terminaux qui supportent le rendu d'image (iTerm2, Ghostty, Warp, Kitty), glissez un fichier image depuis Finder directement dans la fenêtre du terminal où Claude fonctionne. L'image est attachée au tour actuel.

```
# macOS — glissez n'importe quel fichier depuis Finder dans la session du terminal Claude Code
# L'image apparaît comme une pièce jointe avant votre message tapé
```

### Coller depuis le presse-papiers

Claude Code lit les images du presse-papiers quand vous collez (`Cmd+V` sur macOS, `Ctrl+V` sur Linux). Après avoir pris un screenshot avec `Cmd+Shift+4` (macOS sélection screenshot) ou `PrintScreen`, collez directement dans le terminal Claude Code. L'image est capturée depuis le presse-papiers et attachée au message actuel.

```bash
# Capturez une région et collez-la dans Claude
# macOS: Cmd+Shift+4 → sélectionnez région → Cmd+V dans terminal Claude
```

### Référencer un chemin de fichier

Fournissez un chemin de fichier absolu dans votre message et Claude Code lit le fichier :

```
Analysez l'image à /tmp/error-screenshot.png. Quelle est la cause première de l'erreur affichée ?
```

Cela fonctionne sans glisser-déposer dans les terminaux qui ne rendent pas les images — Claude Code lit le fichier depuis le disque quand un chemin est fourni.

### Input programmé via API

Lors de l'appel de l'API Claude directement, les images sont passées comme blocs de contenu structuré. Deux types de source sont supportés :

**Base64 (inline) :**
```json
{
  "role": "user",
  "content": [
    {
      "type": "image",
      "source": {
        "type": "base64",
        "media_type": "image/png",
        "data": "<base64-encoded-bytes>"
      }
    },
    {
      "type": "text",
      "text": "Quels composants UI sont visibles dans ce screenshot ?"
    }
  ]
}
```

**URL (fetch distant) :**
```json
{
  "role": "user",
  "content": [
    {
      "type": "image",
      "source": {
        "type": "url",
        "url": "https://example.com/diagram.png"
      }
    },
    {
      "type": "text",
      "text": "Convertissez ce schéma d'architecture en Terraform."
    }
  ]
}
```

Utilisez base64 pour les images qui ne sont pas publiquement accessibles (fichiers locaux, screenshots internes, artefacts CI). Utilisez URL source pour les images déjà hébergées et atteignables depuis les serveurs d'Anthropic. Ne passez pas les URLs internes privées comme URL source — elles échoueront silencieusement ou retourneront une erreur de fetch.

**Helper Python pour l'encodage base64 :**
```python
import anthropic
import base64
from pathlib import Path

def image_to_message(path: str, prompt: str) -> dict:
    data = base64.standard_b64encode(Path(path).read_bytes()).decode("utf-8")
    ext = Path(path).suffix.lstrip(".")
    media_type = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg",
                  "gif": "image/gif", "webp": "image/webp"}[ext]
    return {
        "role": "user",
        "content": [
            {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": data}},
            {"type": "text", "text": prompt}
        ]
    }

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[image_to_message("/tmp/screenshot.png", "Identifiez tous les champs de forme visibles.")]
)
```

---

## Limites de taille d'image et contraintes

| Contrainte | Valeur |
|---|---|
| Taille max de fichier | 5 MB par image |
| Dimension max recommandée | 1568 × 1568 px |
| Dimension max absolue | ~8000 px sur le long bord (downscaledé en interne) |
| Images max par requête | 20 (API); pas de limite imposée dans les sessions Claude Code |

Les images plus grandes que 1568 × 1568 px sont downscalédées avant traitement. Le modèle voit la version downscalédée, pas l'original. Pour les images avec du texte dense (reçus, tables de données, schémas techniques), gardez la résolution proche de 1568 px sur le long bord pour préserver la lisibilité. Envoyer un screenshot 4K ne s'améliore pas la précision — cela augmente juste la taille de la charge utile base64 et le temps de transfert réseau.

Downscalez avant d'envoyer quand les images dépassent la limite :

```bash
# macOS ImageMagick — redimensionnez pour s'adapter dans 1568x1568, préserver le ratio d'aspect
magick input.png -resize '1568x1568>' output.png

# Ou avec sips (pas d'install requis sur macOS)
sips --resampleHeightWidthMax 1568 input.png --out output.png
```

---

## Coût en tokens des images

Les images n'ont pas un coût de variable tokens qui s'adapter avec le nombre de pixels. Le coût est approximativement fixe par image indépendant de la résolution (dans la plage supportée) :

| Modèle | Coût par image (approx.) |
|---|---|
| Claude Haiku | ~1500 tokens |
| Claude Sonnet | ~1500–1600 tokens |
| Claude Opus | ~1600–2000 tokens |

Une miniature de 200 × 200 px coûte approximativement la même chose qu'un schéma de 1568 × 1568 px. Cela signifie :
- Ne pas envoyer plusieurs petites cultures quand une image complète est plus claire
- Ne pas supposer que les images plus petites sont moins chères
- Pour les workflows multi-image (par ex., 10 screenshots), estimez ~15,000–20,000 tokens de surcharge d'image avant n'importe quel texte

Les PDFs coûtent approximativement 1500–2000 tokens par page rendue, utilisant le même modèle de coût fixe.

---

## Cas d'usage 1 : Revue UI/UX et audit d'accessibilité

Collez un screenshot de n'importe quel UI et demandez à Claude d'identifier les problèmes d'accessibilité, les problèmes de layout, ou les incohérences de conception.

**Motif de prompt :**
```
Je colle un screenshot de notre page de connexion.

1. Listez toutes les violations WCAG 2.1 AA que vous pouvez identifier — concentrez-vous sur le contraste des couleurs, les labels manquants, et les indicateurs de focus au clavier.
2. Pour chaque violation, citez le critère de succès WCAG spécifique (par ex., 1.4.3 Contrast Minimum).
3. Suggérez la change minimale de code qui corrige chaque problème.
```

**Ce que cela attrape sans navigateur :** labels manquants sur les boutons icône, texte faible contraste sur images de fond, champs de forme sans association de label visible, cibles tactiles plus petites que 44 × 44 px, texte de placeholder utilisé comme substitut de label.

Pour la revue systématique, capturez les screenshots à plusieurs largeurs de viewport et passez-les dans un seul tour :

```python
viewports = [375, 768, 1280]  # mobile, tablet, desktop
screenshots = [f"/tmp/ui-{w}.png" for w in viewports]

content = []
for path in screenshots:
    data = base64.standard_b64encode(Path(path).read_bytes()).decode("utf-8")
    content.append({"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": data}})

content.append({"type": "text", "text": "Comparez ces trois screenshots de viewport. Identifiez les breaks de layout et les problèmes d'accessibilité à chaque largeur. Groupez les trouvailles par viewport."})
```

---

## Cas d'usage 2 : OCR — Extraction de texte depuis les images

Claude extrait le texte depuis les documents scannés, les photos de tableaux blancs, les reçus, les cartes de visite, et les notes manuscrites. Contrairement aux outils OCR traditionnels, Claude comprend le contexte — il peut extraire les données structurées depuis les layouts visuels non-structurés.

**Reçus et factures :**
```
Extrayez tous les articles de ligne de ce reçu. Retournez un array JSON avec les champs :
- description (string)
- quantity (number)
- unit_price (number)
- total (number)

Incluez aussi : vendor_name, date, subtotal, tax, total_amount.
```

**Notes de tableau blanc :**
```
Transcrivez tout ce qui est écrit sur ce tableau blanc. Préservez la structure — si les éléments sont dans une liste, formatez-les comme une liste. S'il y a des schémas avec des labels, décrivez le schéma et extrayez les labels.
```

**Formes manuscrites :**
```
Extrayez toutes les valeurs remplies de ce formulaire. Retournez un mapping clé-valeur où la clé est le label de champ imprimé sur le formulaire et la valeur est ce qui a été écrit dedans.
```

Limitations : Claude ne peut pas de manière fiable lire le texte plus petit qu'approximativement 8–10pt équivalent à 1568 px de résolution. Les filigranes, le texte qui se chevauche, et les scans fortement dégradés réduisent la précision. Pour les tâches OCR critiques (documents légaux, enregistrements financiers), validez les valeurs extraites contre les motifs attendus.

---

## Cas d'usage 3 : Diagramme-vers-code — Schémas d'architecture vers infrastructure

Passez un schéma d'architecture (dessiné à la main, export Lucidchart, ou photo de tableau blanc) et demandez à Claude de générer le code d'infrastructure correspondant.

**Prompt :**
```
Ceci est un schéma d'architecture pour notre application. Générez un module Terraform qui provision chaque ressource affichée. 

Exigences :
- Utilisez le fournisseur AWS
- Utilisez les variables pour les valeurs spécifiques à l'environnement (région, types d'instance, blocs CIDR)
- Ajoutez les outputs pour tous les IDs de ressource et ARNs que les modules downstream aurait besoin
- Suivez la convention de nommage montrée dans les labels du schéma
```

**Ce que Claude déduit des schémas :**
- Les limites VPC et les layouts de subnet
- Les relations load balancer → target group → instance
- Les configurations de réplique de base de données
- Les limites de security group (lignes pointillées ou code couleur)
- Les noms de service et types d'instance si labelés

Pour les schémas complexes avec des éléments qui se chevauchent, ajoutez un hint de prompt : "Concentrez-vous sur les flèches solides — elles représentent le flux de trafic réseau. Les lignes pointillées représentent l'accès de gestion."

---

## Cas d'usage 4 : Débogage d'erreur depuis les screenshots d'UI

Quand un bug se manifeste visuellement (layout inattendu, un état cassé, une modale d'erreur), prenez-le en screenshot et passez-le à Claude avec le code pertinent.

**Prompt :**
```
Ce screenshot montre l'état d'erreur que nos utilisateurs voient quand le checkout échoue. 

Donné ce screenshot et le error handler ci-dessous, identifiez :
1. Qu'est-ce qui a déclenché cet état
2. Pourquoi le message d'erreur est coupé en bas
3. Quel changement CSS ou state management corrige le débordement

[paste error handler code]
```

Claude corèle ce qu'il voit dans le screenshot (texte tronqué, éléments mal-alignés, couleur de fond inattendue) avec le code que vous fournis. C'est plus rapide que de décrire le visual bug en paroles — montrer n'est pas ambigu.

**Pour les erreurs console :** Si la console DevTools du navigateur est visible dans le screenshot, Claude lit les messages d'erreur, les numéros de ligne, et la stack trace depuis l'image.

---

## Cas d'usage 5 : Implémentation de conception — Screenshot Figma vers composant

Prenez un screenshot d'un frame Figma (ou n'importe quel mockup de conception) et générez le composant correspondant.

**Prompt :**
```
Ceci est un screenshot d'une conception Figma pour un composant de pricing card.

Générez un composant React qui correspond cette conception exactement. Exigences :
- Utilisez Tailwind CSS pour les styles
- Le composant accepte ces props : plan (string), price (number), features (string[]), isPopular (boolean)
- Le badge "Popular" devrait seulement apparaître quand isPopular est true
- Correspondent les font weights, spacing, et border radius visibles dans le screenshot
- Le bouton CTA devrait utiliser la couleur primaire montrée
```

**Itérer sur la sortie :**
```
Le texte du bouton est trop petit — dans le screenshot il parait être approximativement 16px, correspondant la taille du texte du corps. Mettez à jour le composant.
```

Claude ne peut pas extraire les valeurs hex de couleur depuis les screenshots de manière fiable — la perception de couleur depuis les screenshots dépend de la calibration du moniteur et des artefacts de compression. Pour les couleurs précises, copiez-les depuis Figma directement et collez-les dans le prompt : "La couleur primaire est #6366F1."

---

## Cas d'usage 6 : Extraction de données de graphe et graphique

Claude peut lire les valeurs depuis les graphiques en barres, graphiques en ligne, graphiques en pie, et tables de données affichés comme images — utile quand les données sous-jacentes ne sont pas accessibles.

**Prompt :**
```
Extrayez tous les points de données de ce graphique en barres. Retournez un array JSON où chaque élément a :
- label (la catégorie axe-x)
- value (la valeur axe-y numérique)

Estimez les valeurs aussi précisément que possible depuis les hauteurs de barre relatives à l'axe-y scale. Incluez votre niveau de confiance (high/medium/low) pour chaque valeur.
```

**Pour les graphiques en ligne avec plusieurs séries :**
```
Ce graphique en ligne montre trois métriques au fil du temps. Pour chaque série :
1. Identifiez le nom de la série (depuis la légende)
2. Extrayez la valeur approximative à chaque tick d'axe-x labelé
3. Identifiez tous les points de crossover entre les séries
```

Limitations : Claude estime les valeurs par proportion visuelle. Sur un graphique avec axe-y de 0 à 1,000,000, la précision se dégrade pour les valeurs qui sont proches. Pour l'extraction de données haute-précision, demandez les données sous-jacentes de la source — l'extraction visuelle depuis les graphiques est un fallback quand la source n'est pas disponible.

---

## Combiner vision avec MCP : Workflow screenshot Playwright

Le motif multimodal le plus puissant dans Claude Code combine Playwright MCP (qui prend les screenshots programmés) avec les capacités vision de Claude pour créer une boucle test-et-fix en circuit fermé.

### Setup

Installez et configurez Playwright MCP :

```bash
npm install -g @playwright/mcp
```

Ajoutez à `.claude/settings.json` :
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp", "--browser", "chromium"]
    }
  }
}
```

### Le motif en circuit fermé

```
1. Naviguez à http://localhost:3000/checkout
2. Prenez un screenshot avec Playwright MCP
3. Analysez le screenshot : identifiez n'importe quelles régressions visuelles comparées au layout attendu décrit ci-dessous
4. Si des régressions sont trouvées, lisez les fichiers de composant pertinents et corrigez-les
5. Prenez un deuxième screenshot après votre fix
6. Confirmez que la régression est résolue en comparant les screenshots avant et après

Layout attendu: grille trois-colonnes de cartes de produit, chaque avec image sur le dessus, titre au-dessous, prix en bold en bas-gauche, bouton Add to Cart en bas-droit.
```

Claude Code exécute ceci de manière autonome :
- Playwright MCP navigue le navigateur et capture les screenshots
- Claude analyse chaque screenshot
- Claude lit les fichiers source, fait les éditions, et re-screenshot pour vérifier

### Exemple de navigation multi-étapes

```
Utilisant Playwright MCP :
1. Ouvrez http://localhost:3000
2. Screenshot l'accueil — décrivez ce que vous voyez
3. Cliquez le lien "Sign In"
4. Screenshot le formulaire de sign-in — listez chaque champ de forme présent
5. Remplissez email: test@example.com, password: testpass123
6. Cliquez Submit
7. Screenshot le résultat — est-ce que la connexion a réussi ou échoué ? Quel erreur, si n'importe quel, est montré ?
```

---

## Traitement PDF

Claude traite les PDFs page par page, en traitant chaque page comme une image rendue.

**PDF single-page :**
```python
with open("invoice.pdf", "rb") as f:
    data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": data
                }
            },
            {"type": "text", "text": "Extrayez tous les articles de ligne et les totaux de cette facture."}
        ]
    }]
)
```

**PDFs multi-page :** Claude traite toutes les pages par défaut. Pour les PDFs longs où seulement des pages spécifiques sont pertinentes, spécifiez la plage dans le prompt : "Concentrez-vous sur les pages 3–7. Ignorez l'appendice."

Le coût en tokens s'adapter avec le nombre de page — un PDF de 20 pages coûte approximativement 20× le taux d'une image seule (~30,000–40,000 tokens pour le PDF seul). Pour les gros PDFs, extrayez les pages pertinentes avant d'envoyer :

```bash
# Extrayez les pages 3-7 d'un PDF (requiert pdftk ou ghostscript)
pdftk input.pdf cat 3-7 output extracted.pdf

# Ou avec ghostscript
gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -dFirstPage=3 -dLastPage=7 \
   -sOutputFile=extracted.pdf input.pdf
```

---

## Limitations

| Limitation | Détail |
|---|---|
| Pas de vidéo | Claude ne peut pas traiter les fichiers vidéo ou extraire des frames depuis la vidéo |
| Pas de caméra en temps réel | Il n'y a pas de capacité de flux caméra live — les screenshots sont toujours des captures statiques |
| Texte minuscule | Le texte plus petit qu'approximativement 8–10pt équivalent à la résolution supportée est non-fiable |
| Couleurs exactes | Les valeurs hex de couleur extraites depuis les screenshots sont des estimations, pas exactes |
| Interface complexe qui se chevauchent | Les UIs denses avec des éléments qui se chevauchent ou les effets de transparence réduisent la précision d'identification |
| Qualité handwriting | Handwriting fortement dégradée, scripts non-Latinos, ou formes de lettre inhabituelles dégradent la précision OCR |
| Précision de graphe | Les valeurs numériques lues depuis les graphiques sont des approximations basées sur la proportion visuelle |
| Contenu animé | Les GIFs sont lus comme un single frame statique |

---

## Motifs de prompt pour les tâches vision

Utilisez ceux-ci comme templates de départ, en ajustant le format de sortie pour votre downstream use.

**Description générale :**
```
Décrivez ce que vous voyez dans cette image. Soyez spécifique — listez les composants UI, le contenu de texte, les couleurs, la structure de layout, et l'état visible (erreur, loading, vide, actif).
```

**Extraction de texte :**
```
Extrayez tout le texte visible dans cette image. Préservez l'ordre de lecture. Utilisez le formatage markdown pour refléter la hiérarchie visuelle — titres comme ##, listes comme bullet points, bold où le texte parait en bold.
```

**Inventaire de composant :**
```
Identifiez chaque composant UI dans ce screenshot. Pour chaque composant, fournissez :
- Type de composant (button, input, modal, card, etc.)
- Texte visible ou label
- Position approximée (top-left, center, bottom-right, etc.)
- État apparent (active, disabled, selected, error)
```

**Extraction de données structurées :**
```
Extrayez les données montrées dans ce [table/chart/form] comme JSON. Utilisez les headers de colonne comme clés. Incluez toutes les lignes visibles.
```

**Génération de code depuis visuel :**
```
Implémentez cette conception comme [composant React / HTML+CSS / SwiftUI view]. Correspondent exactement la structure visuelle. Utilisez [Tailwind / inline styles / CSS modules] pour les styles. Le composant devrait être auto-contenu avec aucune dépendance externe au-delà du système de styles spécifié.
```

**Comparaison de diff :**
```
Je vous donne deux screenshots — avant et après un changement. Listez chaque différence visuelle que vous pouvez identifier, peu importe comment petite. Groupez les différences par catégorie : layout, couleur, typographie, contenu, spacing.
```

---

## Exemple de workflow complet : Screenshot vers changement de code

Ce exemple end-to-end prend un screenshot de bug report et produit un commit fix.

**Setup :** Un utilisateur rapporte qu'un badge de notification chevauche l'avatar dans l'header sur mobile.

**Étape 1 — Capture et analyse :**
```
J'ai un screenshot d'un bug mobile header à /tmp/header-bug.png.

Décrivez exactement ce que vous voyez — où est le badge de notification relativement à l'avatar ? Quel est le chevauchement ?
```

Claude répond : "Le badge de notification (cercle rouge, top-right de l'avatar) est positionné à `top: -4px; right: -4px` mais le conteneur d'avatar a `overflow: hidden`, coupant le badge."

**Étape 2 — Localiser la source :**
```
Basé sur cette analyse, trouvez le composant d'avatar dans ce codebase. Cherchez un composant qui rend un avatar circulaire avec un overlay de badge de notification.
```

Claude recherche et trouve `src/components/Avatar/Avatar.tsx`.

**Étape 3 — Générez le fix :**
```
Lisez Avatar.tsx et corrigez le problème de débordement. Le badge devrait être complètement visible — ne le coupez pas. Préservez tous les types de prop existants et le comportement.
```

Claude édite le fichier, en changeant `overflow: hidden` sur le conteneur à `overflow: visible` et en ajustant le wrapper parent pour traiter le clipping de border-radius séparément.

**Étape 4 — Vérifiez :**
```
Utilisant Playwright MCP, naviguez à http://localhost:3000 à largeur de viewport 375px et faites un screenshot du header. Est-ce que le badge parait complètement visible et non-coupé ?
```

Claude prend le screenshot, l'analyse, et confirme le fix ou itère.

---

## Tableau de décision

| Tâche | Approche |
|---|---|
| Screenshot de bug UI → cause première | Collez screenshot, décrivez le comportement attendu, demandez le code fix |
| Mockup Figma → composant | Screenshot le frame Figma, spécifiez le framework et système de styling |
| PDF scanné → données structurées | Encodage base64, utilisez le bloc de contenu document, spécifiez le schéma de sortie |
| Schéma d'architecture → Terraform | Screenshot le schéma, demandez la sortie IaC spécifique au fournisseur |
| Graphique → CSV | Screenshot le graphique, demandez JSON/CSV avec niveaux de confiance |
| Régression visuelle automatisée | Playwright MCP screenshot → analyse de Claude → boucle d'édition automatisée |
| PDF gros (10+ pages) | Extrayez les pages pertinentes avant d'envoyer; estimez ~1500 tokens/page |
| États d'UI multiples | Envoyez tous les screenshots dans un tour; demandez à Claude de comparer à travers eux |

---
