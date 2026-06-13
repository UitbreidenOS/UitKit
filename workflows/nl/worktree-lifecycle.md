# Worktree-levenscyclus

Volledige vier-opdrachtenwerkflow voor beheer van parallel Claude Code-werk met git worktrees. Elke worktree is een geïsoleerde werkdirectory op zijn eigen branch — meerdere Claude-sessies kunnen tegelijkertijd worden uitgevoerd zonder op elkaar te trappen.

---

## Wanneer te gebruiken

- Meerdere Claude Code-sessies in parallelle uitvoering op dezelfde repo
- Isolering experimenteel werk van stabiele main branch
- Revisie van ander branch-werk zonder uw actieve sessie te verstoren
- Elke werkflow waar u schone branchafscheiding wilt zonder overhead van meerdere repo-klonen

---

## Commando's

### Init — creëer worktree uit taakbeschrijving

**Input:** taakbeschrijving (vrij tekst)

**Stappen:**
1. Leid kebab-case branchnaam af van taakbeschrijving (verwijder artikelen, join betekenisvolle woorden met `-`, max 5 woorden)
2. Uitvoeren:
   ```bash
   git worktree add -b {branch} .worktrees/{branch} main
   ```
3. Maak `.worktree-task.md` in nieuwe worktree:
   ```markdown
   # Taak
   {originale taakbeschrijving}

   ## Branch
   {branch}

   ## Gemaakt
   {ISO-timestamp}
   ```
4. Voer startcommando uit:
   ```bash
   cd .worktrees/{branch} && claude
   ```

**Voorbeeld:**
```
Init: "Stripe-webhookverwerking voor abonnementgebeurtenissen toevoegen"
Branch: add-stripe-webhook-subscription
Worktree: .worktrees/add-stripe-webhook-subscription
```

---

### Check — status van alle actieve worktrees

**Stappen:**
1. Voer `git worktree list --porcelain` uit en parseer uitvoer
2. Voor elke worktree (exclusief main):
   - Branchnaam en HEAD-commit-hash + bericht
   - Of `.worktree-task.md` bestaat (geeft actieve beheerde taak aan)
   - `git diff --stat {main}...{branch}` — bestanden gewijzigd sinds branchtcreatie
3. Voer compacte tabel uit:

```
Branch                              Laatste commit           Taakbestand  Bestanden gewijzigd
add-stripe-webhook-subscription     abc1234 add webhook     ja           3 bestanden (+180/-0)
refactor-auth-middleware            def5678 wip             ja           7 bestanden (+92/-61)
hotfix-null-pointer                 ghi9012 fix null        nee          1 bestand  (+3/-1)
```

---

### Deliver — commit, push en creëer PR van worktree

**Vereenvoudiging:** `.worktree-task.md` moet in huidige directory bestaan (bevestigt u in beheerde worktree bent, niet main).

**Stappen:**
1. Lees taakbeschrijving van `.worktree-task.md`
2. Verwijder `.worktree-task.md` — het is werkartifact, geen projectcode en mag niet in PR-diff verschijnen
3. Stage alle wijzigingen: `git add -A`
4. Bepaal conventieel committype uit diff:
   - Alleen nieuwe bestanden → `feat:`
   - Verwijderingen en wijzigingen → `fix:` of `refactor:`
   - Alleen config/tooling → `chore:`
5. Leid commit-bericht af van taakbeschrijving (imperatiefvorm, ≤72 tekens)
6. Commit: `git commit -m "{type}: {message}"`
7. Push: `git push -u origin {branch}`
8. Creëer PR:
   ```bash
   gh pr create --title "{type}: {message}" --body "{task description}"
   ```
9. Voer PR-URL uit

---

### Cleanup — verwijder samengevoegde worktrees

**Stappen:**
1. Zet alle beheerde worktrees op lijst: `git worktree list`
2. Voor elke branch, controleer of deze naar main is samengevoegd: `git branch --merged main`
3. Rapporteer wat zou worden verwijderd (altijd dit tonen voor actie)

**Vlaggen:**
- `--dry-run` — zet samengevoegde worktrees en branches op lijst, onderneem geen actie
- `--force-all` — vraag bevestiging aan, verwijder alle samengevoegde worktrees:
  ```bash
  git worktree remove .worktrees/{branch}
  git branch -d {branch}
  ```

**Dry-run-uitvoer:**
```
Zou verwijderen:
  .worktrees/add-stripe-webhook-subscription  (samengevoegd naar main bij abc1234)
  .worktrees/hotfix-null-pointer              (samengevoegd naar main bij def5678)

Voer met --force-all uit om te verwijderen.
```

---

## Directorytoepassingen

```
.worktrees/           # alle beheerde worktrees leven hier
  {branch-name}/      # één directory per worktree
    .worktree-task.md # gecreëerd door Init, verwijderd door Deliver
```

Voeg `.worktrees/` toe aan `.gitignore` — deze directories zijn lokale bestandssysteemtoestand, geen gevolgd inhoud.

---

## Notities

- `.worktree-task.md` is enig signaal dat worktree door deze workflow wordt beheerd. Handmatig gemaakte worktrees (zonder Init) tonen "geen taakbestand" in Check-uitvoer en worden overgeslagen door Cleanup tenzij `--force-all` wordt doorgegeven.
- Voer nooit `git worktree remove` op worktree uit met niet-gecommiteerde wijzigingen tenzij u van plan bent ze weg te gooien. Check toont altijd diff-statistieken voor vernietigende actie.
- Worktrees delen dezelfde `.git`-directory als main repo. Operaties zoals `git fetch` en `git log` in elke worktree zien alle branches.

---
