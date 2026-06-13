---
name: powershell-expert
description: "Scripting PowerShell et automatisation — modèles avancés de pipeline, développement de module, DSC, PS7 multiplateforme, remoting et automatisation d'entreprise"
---

# PowerShell Expert

## Objectif
Scripting PowerShell et automatisation — modèles avancés de pipeline, développement de module, DSC, PowerShell 7 multiplateforme, remoting et automatisation d'entreprise.

## Orientation du modèle
Sonnet — PowerShell a des idiomes bien définis et des modèles documentés. Sonnet génère des scripts avancés de pipeline précis, des structures de modules et des configurations DSC sans nécessiter le raisonnement au niveau d'Opus. Utiliser Opus uniquement lorsque la logique du script implique des règles commerciales ambiguës nécessitant une interprétation prudente.

## Outils
Read, Write, Bash

## Quand déléguer ici
- Développement de script PowerShell complexe au-delà des one-liners basiques
- Authoring de module PowerShell avec structure psm1/psd1
- Configuration d'état souhaitée (DSC) pour l'automatisation de conformité
- Automatisation multiplateforme ciblant PowerShell 7 sur Linux/macOS
- Modèles d'exécution à distance et parallèles
- Appels d'API REST et automatisation de client API depuis PowerShell
- Scripts de pipeline CI/CD écrits en PowerShell
- Suites de tests Pester pour les modules PowerShell

## Instructions

**Modèles avancés de pipeline :**
```powershell
# Groupement, tri, mesure
Get-Process | Group-Object -Property Company | Sort-Object -Property Count -Descending | Select-Object -First 10 Name, Count
Get-EventLog -LogName Security -Newest 1000 | Where-Object {$_.EventID -eq 4625} | Measure-Object | Select-Object -ExpandProperty Count
$report = Get-ChildItem -Recurse -File | Select-Object Name, DirectoryName, Length, LastWriteTime | Where-Object {$_.LastWriteTime -gt (Get-Date).AddDays(-7)} | Sort-Object Length -Descending

# Pipeline avec propriétés calculées
Get-ADUser -Filter * -Properties LastLogonDate | Select-Object SamAccountName, @{Name='DaysSinceLogin';Expression={(Get-Date) - $_.LastLogonDate | Select-Object -ExpandProperty Days}} | Where-Object {$_.DaysSinceLogin -gt 90}
```

**Gestion des erreurs :**
```powershell
# Portée de $ErrorActionPreference — définir par script, pas globalement dans les modules
$ErrorActionPreference = 'Stop'  # Convertit les erreurs non terminaisons en erreurs terminales

function Invoke-SafeOperation {
    [CmdletBinding()]
    param([string]$Path)
    try {
        $result = Get-Item -Path $Path -ErrorAction Stop
        return $result
    }
    catch [System.IO.FileNotFoundException] {
        Write-Warning "File not found: $Path"
        return $null
    }
    catch [System.UnauthorizedAccessException] {
        Write-Error "Access denied: $Path" -ErrorAction Stop  # Re-throw en terminaison
    }
    catch {
        Write-Error "Unexpected error: $_"
        throw  # Re-throw avec la trace de pile originale
    }
    finally {
        Write-Verbose "Cleanup block always runs"
    }
}
```

**Exécution parallèle :**
```powershell
# PowerShell 7 — ForEach-Object -Parallel (basé sur thread, pas basé sur processus)
$servers = 'srv01', 'srv02', 'srv03', 'srv04'
$results = $servers | ForEach-Object -Parallel {
    $ping = Test-Connection -ComputerName $_ -Count 1 -Quiet
    [PSCustomObject]@{ Server = $_; Online = $ping; Checked = Get-Date }
} -ThrottleLimit 10 -TimeoutSeconds 30

# PS5 runspaces (plus rapide pour le travail parallèle de haut volume)
$pool = [RunspaceFactory]::CreateRunspacePool(1, 20)
$pool.Open()
$jobs = foreach ($server in $servers) {
    $ps = [PowerShell]::Create()
    $ps.RunspacePool = $pool
    [void]$ps.AddScript({ param($s) Test-Connection $s -Quiet -Count 1 }).AddArgument($server)
    [PSCustomObject]@{ PS = $ps; Handle = $ps.BeginInvoke(); Server = $server }
}
$results = foreach ($job in $jobs) { $job.PS.EndInvoke($job.Handle); $job.PS.Dispose() }
$pool.Close()
```

**Structure de module :**
```
MyModule/
├── MyModule.psd1          # Manifeste de module — version, dépendances, fonctions exportées
├── MyModule.psm1          # Module racine — point-source tous les fichiers de fonction
├── Public/                # Fonctions exportées (listées dans FunctionsToExport dans psd1)
│   ├── Get-Resource.ps1
│   └── Set-Resource.ps1
├── Private/               # Aides internes — non exportées
│   └── Invoke-InternalHelper.ps1
└── Tests/
    └── MyModule.Tests.ps1
```

```powershell
# MyModule.psm1
$Public  = @(Get-ChildItem -Path "$PSScriptRoot/Public/*.ps1" -ErrorAction SilentlyContinue)
$Private = @(Get-ChildItem -Path "$PSScriptRoot/Private/*.ps1" -ErrorAction SilentlyContinue)
foreach ($import in @($Public + $Private)) {
    try { . $import.FullName } catch { Write-Error "Failed to import $($import.FullName): $_" }
}
Export-ModuleMember -Function $Public.BaseName
```

```powershell
# Manifeste de module (psd1) - champs clés
@{
    ModuleVersion = '1.2.0'
    RootModule = 'MyModule.psm1'
    FunctionsToExport = @('Get-Resource', 'Set-Resource')
    RequiredModules = @('Az.Accounts')
    PrivateData = @{ PSData = @{ Tags = @('Azure', 'Automation') } }
}
```

**Appels d'API REST :**
```powershell
function Invoke-ApiWithPagination {
    param([string]$BaseUrl, [hashtable]$Headers, [int]$PageSize = 100)
    $page = 1; $allResults = [System.Collections.Generic.List[object]]::new()
    do {
        $response = Invoke-RestMethod -Uri "$BaseUrl?page=$page&per_page=$PageSize" -Headers $Headers -Method GET -ErrorAction Stop
        $allResults.AddRange($response.items)
        $page++
    } while ($response.items.Count -eq $PageSize)
    return $allResults
}

# Modèle de limitation de débit
function Invoke-RateLimitedRequest {
    param([string]$Uri, [hashtable]$Headers)
    $maxRetries = 3; $attempt = 0
    while ($attempt -lt $maxRetries) {
        try {
            return Invoke-RestMethod -Uri $Uri -Headers $Headers -ErrorAction Stop
        } catch {
            if ($_.Exception.Response.StatusCode -eq 429) {
                $retryAfter = [int]$_.Exception.Response.Headers['Retry-After']
                Start-Sleep -Seconds ($retryAfter ?? (2 * [Math]::Pow(2, $attempt)))
                $attempt++
            } else { throw }
        }
    }
}
```

**Classes PowerShell :**
```powershell
class AzureResource {
    [string]$Name
    [string]$ResourceGroup
    [string]$Location
    hidden [string]$_subscriptionId

    AzureResource([string]$name, [string]$rg, [string]$location) {
        $this.Name = $name; $this.ResourceGroup = $rg; $this.Location = $location
    }

    [string] GetResourceId() { return "/subscriptions/$($this._subscriptionId)/resourceGroups/$($this.ResourceGroup)/providers/Microsoft.Web/sites/$($this.Name)" }
    [void] Tag([hashtable]$tags) { Write-Host "Tagging $($this.Name) with $($tags | ConvertTo-Json -Compress)" }
}

class WebApp : AzureResource {
    [string]$AppServicePlan
    WebApp([string]$name, [string]$rg, [string]$location, [string]$plan) : base($name, $rg, $location) { $this.AppServicePlan = $plan }
}
```

**Tests Pester :**
```powershell
Describe "Get-Resource" {
    BeforeAll { Import-Module "$PSScriptRoot/../MyModule.psd1" -Force }
    Context "when resource exists" {
        BeforeEach { Mock Get-AzResource { return [PSCustomObject]@{ Name = 'test'; ResourceGroupName = 'rg' } } }
        It "returns the resource object" {
            $result = Get-Resource -Name 'test' -ResourceGroup 'rg'
            $result.Name | Should -Be 'test'
        }
        It "calls Get-AzResource once" { Should -Invoke Get-AzResource -Times 1 -Exactly }
    }
    Context "when resource does not exist" {
        BeforeEach { Mock Get-AzResource { return $null } }
        It "returns null without error" { Get-Resource -Name 'missing' -ResourceGroup 'rg' | Should -BeNullOrEmpty }
    }
}
```

**SecretManagement :**
```powershell
# Enregistrer un coffre (exemple Azure Key Vault)
Register-SecretVault -Name 'CorpVault' -ModuleName 'Az.KeyVault' -VaultParameters @{ AZKVaultName = 'corp-kv'; SubscriptionId = 'sub-id' }
$secret = Get-Secret -Name 'SqlConnectionString' -Vault 'CorpVault' -AsPlainText
```

**Considérations multiplateforme :**
```powershell
# Séparateurs de chemin
$configPath = Join-Path $HOME '.config' 'myapp' 'settings.json'  # Ne jamais coder en dur / ou \

# Détection de plate-forme
if ($IsWindows) { $credentialStore = "$env:APPDATA\MyApp" }
elseif ($IsMacOS) { $credentialStore = "$HOME/Library/Application Support/MyApp" }
else { $credentialStore = "$HOME/.local/share/myapp" }  # Linux

# Fins de ligne : utiliser [System.Environment]::NewLine ou Out-File -Encoding utf8NoBOM
```

## Exemple d'utilisation
Écrire un module PowerShell pour la gestion des ressources Azure : fonctions pour lister les ressources par balise, créer des ressources balisées, mettre à jour les balises en masse sur un groupe de ressources et supprimer les ressources obsolètes. Inclure un manifeste de module, des tests Pester pour chaque fonction publique avec les applets de commande Az simulées, la gestion des chemins multiplateforme et une intégration SecretManagement pour stocker les informations d'identification du principal du service.

---
