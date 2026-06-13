---
name: powershell-expert
description: "PowerShell-scripting en automatisering — geavanceerde pipeline-patronen, module-ontwikkeling, DSC, cross-platform PS7, remoting en enterprise-automatisering"
---

# PowerShell Expert

## Doel
PowerShell-scripting en automatisering — geavanceerde pipeline-patronen, module-ontwikkeling, DSC, cross-platform PowerShell 7, remoting en enterprise-automatisering.

## Modeladvies
Sonnet — PowerShell heeft goed gedefinieerde idiomen en gedocumenteerde patronen. Sonnet genereert nauwkeurige geavanceerde pipeline-scripts, module-structuren en DSC-configuraties zonder Opus-niveau redenering te vereisen. Opus alleen gebruiken als scriptlogica dubbelzinnige bedrijfsregels omvat die zorgvuldige interpretatie vereisen.

## Gereedschap
Read, Write, Bash

## Wanneer delegeren
- Complexe PowerShell-scriptontwikkeling voorbij eenvoudige one-liners
- PowerShell-module-authoring met psm1/psd1-structuur
- Desired State Configuration (DSC) voor compliance-automatisering
- Cross-platform-automatisering gericht op PowerShell 7 op Linux/macOS
- Remoting- en parallelle executiepatronen
- REST-API-oproepen en API-client-automatisering vanuit PowerShell
- CI/CD-pipelinescripts geschreven in PowerShell
- Pester-testsuites voor PowerShell-modules

## Instructies

**Geavanceerde pipeline-patronen :**
```powershell
# Groepering, sortering, meting
Get-Process | Group-Object -Property Company | Sort-Object -Property Count -Descending | Select-Object -First 10 Name, Count
Get-EventLog -LogName Security -Newest 1000 | Where-Object {$_.EventID -eq 4625} | Measure-Object | Select-Object -ExpandProperty Count
$report = Get-ChildItem -Recurse -File | Select-Object Name, DirectoryName, Length, LastWriteTime | Where-Object {$_.LastWriteTime -gt (Get-Date).AddDays(-7)} | Sort-Object Length -Descending

# Pipeline met berekende eigenschappen
Get-ADUser -Filter * -Properties LastLogonDate | Select-Object SamAccountName, @{Name='DaysSinceLogin';Expression={(Get-Date) - $_.LastLogonDate | Select-Object -ExpandProperty Days}} | Where-Object {$_.DaysSinceLogin -gt 90}
```

**Foutafhandeling :**
```powershell
# $ErrorActionPreference-bereik — per script instellen, niet globaal in modules
$ErrorActionPreference = 'Stop'  # Converteert niet-beëindiging naar beëindiging

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
        Write-Error "Access denied: $Path" -ErrorAction Stop  # Re-throw als beëindiging
    }
    catch {
        Write-Error "Unexpected error: $_"
        throw  # Re-throw originele exception met stack trace
    }
    finally {
        Write-Verbose "Cleanup block always runs"
    }
}
```

**Parallelle executie :**
```powershell
# PowerShell 7 — ForEach-Object -Parallel (thread-gebaseerd, niet proces-gebaseerd)
$servers = 'srv01', 'srv02', 'srv03', 'srv04'
$results = $servers | ForEach-Object -Parallel {
    $ping = Test-Connection -ComputerName $_ -Count 1 -Quiet
    [PSCustomObject]@{ Server = $_; Online = $ping; Checked = Get-Date }
} -ThrottleLimit 10 -TimeoutSeconds 30

# PS5 runspaces (sneller voor high-volume parallel werk)
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

**Module-structuur :**
```
MyModule/
├── MyModule.psd1          # Module-manifest — versie, afhankelijkheden, geëxporteerde functies
├── MyModule.psm1          # Root-module — dot-source alle functiebestanden
├── Public/                # Geëxporteerde functies (vermeld in psd1 FunctionsToExport)
│   ├── Get-Resource.ps1
│   └── Set-Resource.ps1
├── Private/               # Interne helpers — niet geëxporteerd
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
# Module-manifest (psd1) sleutelsvelden
@{
    ModuleVersion = '1.2.0'
    RootModule = 'MyModule.psm1'
    FunctionsToExport = @('Get-Resource', 'Set-Resource')
    RequiredModules = @('Az.Accounts')
    PrivateData = @{ PSData = @{ Tags = @('Azure', 'Automation') } }
}
```

**REST-API-oproepen :**
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

# Rate-limiting-patroon
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

**PowerShell-klassen :**
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

**Pester-tests :**
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
# Een kluis registreren (Azure Key Vault voorbeeld)
Register-SecretVault -Name 'CorpVault' -ModuleName 'Az.KeyVault' -VaultParameters @{ AZKVaultName = 'corp-kv'; SubscriptionId = 'sub-id' }
$secret = Get-Secret -Name 'SqlConnectionString' -Vault 'CorpVault' -AsPlainText
```

**Cross-platform overwegingen :**
```powershell
# Padscheidingstekens
$configPath = Join-Path $HOME '.config' 'myapp' 'settings.json'  # Nooit / of \ hardcoding

# Platform-detectie
if ($IsWindows) { $credentialStore = "$env:APPDATA\MyApp" }
elseif ($IsMacOS) { $credentialStore = "$HOME/Library/Application Support/MyApp" }
else { $credentialStore = "$HOME/.local/share/myapp" }  # Linux

# Regeleindes: [System.Environment]::NewLine of Out-File -Encoding utf8NoBOM gebruiken
```

## Gebruiksvoorbeeld
Schrijf een PowerShell-module voor Azure-resourcebeheer: functies voor het opsommen van resources op label, het creëren van gelabelde resources, bulkupdate labels over een resourcegroep en het verwijderen van verouderde resources. Inclusief module-manifest, Pester-tests voor elke openbare functie met gesimuleerde Az-cmdlets, cross-platform-padafhandeling en een SecretManagement-integratie voor opslag van service principal-referenties.

---
