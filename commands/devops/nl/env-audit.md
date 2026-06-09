---
description: Controleer het gebruik van omgevingsvariabelen in de codebase op beveiligings- en hygiëneproblemen
argument-hint: "[path or file glob to scan]"
---
Controleer het gebruik van omgevingsvariabelen in: $ARGUMENTS (standaard: geheel project)

Scan alle bronbestanden, configuratiebestanden, Dockerfiles, compose-bestanden, CI/CD-definities en implementatiemanifesten.

Rapporteer bevindingen in deze categorieën:

**1. Secrets die risico lopen**
- Hardcoded credentials, tokens, API-sleutels of wachtwoorden in bestanden die door git worden bijgehouden
- `.env`-bestanden die niet in .gitignore staan
- Secrets die rechtstreeks in shell `run:`-stappen in CI worden geïnterpoleerd (injectierisico)
- Docker `ARG`/`ENV`-instructies die secrets in afbeeldingslagen bakken

**2. Ontbrekende variabelen**
- Variabelen waarnaar in code wordt verwezen (process.env.X, os.environ["X"], os.Getenv("X"), enz.) die geen overeenkomstig item hebben in `.env.example`, `docker-compose.yml`, Kubernetes Secret/ConfigMap of gedocumenteerde standaardwaarden
- Vereiste variabelen zonder fallback die een runtimefout/crash zouden veroorzaken als ze niet zijn ingesteld

**3. Ongebruikte variabelen**
- Variabelen die zijn gedeclareerd in `.env`, `.env.example`, Compose of manifesten maar nooit in code worden gelezen

**4. Inconsistenties**
- Variabelennamen die verschillen tussen omgevingen (bijv. `DATABASE_URL` in compose versus `DB_URL` in k8s)
- Variabelen met standaardwaarden in één omgeving maar vereist in een andere
- Gedupliceerde declaraties in meerdere bestanden met mogelijk verschillende waarden

**5. Hygiëne**
- Niet-standaard naming (moet `SCREAMING_SNAKE_CASE` zijn)
- Variabelen die gevoelige gegevens bevatten maar niet zijn gemarkeerd als `sensitive` in Terraform of `type: kubernetes.io/Opaque` in k8s Secrets
- `.env`-bestanden committed met echte waarden

Uitvoerindeling:
- Groepeer bevindingen per bovenstaande categorie
- Voor elke bevinding: bestandspad + regelnummer, ernst (`critical` / `warning` / `info`) en eenregelige herstel
- Eindig met een samenvattingstelling per ernst en een geprioriteerde fixlijst (kritieke items eerst)

Druk bestandsinhoud niet woordelijk af — citeer locaties en citeer alleen de relevante regel.
