# Scripting PowerShell

## Cuándo activar
- Escribir o revisar scripts de PowerShell para administración de Windows o automatización multiplataforma
- Usar cmdlets, pipelines y manipulación de objetos
- Implementar manejo robusto de errores con try/catch/finally
- Ejecutar comandos en máquinas remotas con Invoke-Command o Enter-PSSession
- Estructurar módulos reutilizables (`.psm1` + `.psd1`)
- Consultar información del sistema con CIM/WMI
- Manejar credenciales y secretos de forma segura

## Cuándo no usar
- Scripting Bash/zsh en Linux/macOS donde PowerShell no está instalado
- Scripts de PowerShell 5.1 solo para Windows cuando la compatibilidad multiplataforma no es explícitamente requerida y la pregunta es sobre características solo de Windows (use la habilidad windows-admin si está disponible)
- Módulos Azure PowerShell o AWS PowerShell — estos están cubiertos por sus respectivas habilidades en la nube

## Instrucciones

### Pipeline y Filtrado

Los pipelines de PowerShell pasan objetos .NET, no cadenas de texto. Los cmdlets posteriores reciben el objeto completo con todas sus propiedades.

```powershell
# Where-Object — filter by property
Get-Process | Where-Object { $_.CPU -gt 100 }
Get-Process | Where-Object CPU -gt 100           # simplified syntax for single condition

# Select-Object — project properties
Get-Process | Select-Object Name, Id, CPU, WorkingSet
Get-Process | Select-Object -First 10
Get-Process | Select-Object -Last 5
Get-Process | Select-Object -Property * -ExcludeProperty Path

# ForEach-Object — transform each object
Get-ChildItem -Filter *.log | ForEach-Object {
    [PSCustomObject]@{
        Name     = $_.Name
        SizeMB   = [math]::Round($_.Length / 1MB, 2)
        LastWrite = $_.LastWriteTime
    }
}

# Sort-Object
Get-Service | Sort-Object Status, DisplayName
Get-Process | Sort-Object WorkingSet -Descending

# Group-Object — group into buckets
Get-Service | Group-Object Status

# Measure-Object — aggregate stats
Get-ChildItem -Recurse -File | Measure-Object -Property Length -Sum -Average -Maximum

# Chained pipeline
Get-Process |
    Where-Object { $_.WorkingSet -gt 100MB } |
    Sort-Object WorkingSet -Descending |
    Select-Object -First 10 -Property Name, Id, @{N='MemoryMB'; E={[math]::Round($_.WorkingSet/1MB,1)}} |
    Format-Table -AutoSize
```

Use `$_` (o `$PSItem`) dentro de bloques de script para referir el objeto pipeline actual.

### Manejo de Errores — try/catch/finally y $ErrorActionPreference

```powershell
# Set default error behavior for the script
$ErrorActionPreference = 'Stop'   # treat all errors as terminating

function Invoke-DatabaseBackup {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string]$ConnectionString,
        [Parameter(Mandatory)] [string]$OutputPath
    )

    $tempPath = "$OutputPath.tmp"

    try {
        Write-Verbose "Starting backup to $tempPath"
        Backup-SqlDatabase -ConnectionString $ConnectionString -OutputPath $tempPath

        # Rename only on success
        Move-Item -Path $tempPath -Destination $OutputPath -Force
        Write-Output "Backup completed: $OutputPath"
    }
    catch [System.Data.SqlClient.SqlException] {
        Write-Error "SQL error during backup: $($_.Exception.Message)"
        throw   # re-throw to caller
    }
    catch {
        Write-Error "Unexpected error: $($_.Exception.GetType().Name) — $($_.Exception.Message)"
        throw
    }
    finally {
        # Runs whether or not an exception was thrown
        if (Test-Path $tempPath) {
            Remove-Item $tempPath -Force -ErrorAction SilentlyContinue
        }
        Write-Verbose "Cleanup complete"
    }
}
```

Variables clave de manejo de errores:

| Variable | Propósito |
|---|---|
| `$ErrorActionPreference` | Acción por defecto: `Stop`, `Continue`, `SilentlyContinue`, `Inquire` |
| `$_` dentro de `catch` | El `ErrorRecord` atrapado |
| `$_.Exception` | La excepción .NET subyacente |
| `$_.InvocationInfo` | Información de posición del script |
| `$Error[0]` | Error más reciente de la sesión |
| `-ErrorAction` parámetro | Anulación por-cmdlet de `$ErrorActionPreference` |
| `-ErrorVariable` parámetro | Capturar errores en una variable nombrada |

```powershell
# Capture non-terminating errors
Get-ChildItem -Path C:\missing -ErrorAction SilentlyContinue -ErrorVariable dirErrors
if ($dirErrors) { Write-Warning "Some paths not found: $dirErrors" }
```

### Ejecución Remota

```powershell
# One-off command on a single remote machine
Invoke-Command -ComputerName server01 -ScriptBlock {
    Get-Service -Name BITS
}

# Multiple computers in parallel
$servers = 'web01', 'web02', 'db01'
Invoke-Command -ComputerName $servers -ScriptBlock {
    [PSCustomObject]@{
        Host   = $env:COMPUTERNAME
        Uptime = (Get-Date) - (gcim Win32_OperatingSystem).LastBootUpTime
    }
}

# Pass local variables with $using: scope
$threshold = 90
Invoke-Command -ComputerName $servers -ScriptBlock {
    $disks = Get-PSDrive -PSProvider FileSystem
    $disks | Where-Object { ($_.Used / ($_.Used + $_.Free)) * 100 -gt $using:threshold }
}

# Persistent session — reuse across multiple Invoke-Command calls
$session = New-PSSession -ComputerName server01
Invoke-Command -Session $session -ScriptBlock { $env:TEMP }
Invoke-Command -Session $session -ScriptBlock { Get-Process }
Remove-PSSession $session

# Interactive remote shell
Enter-PSSession -ComputerName server01
# ... work interactively ...
Exit-PSSession

# PowerShell 7 — SSH transport (cross-platform)
Invoke-Command -HostName ubuntu-server -UserName admin -ScriptBlock { uname -a }
Enter-PSSession -HostName ubuntu-server -UserName admin
```

Habilite remoting en objetivos Windows: `Enable-PSRemoting -Force` (ejecutar como administrador).

### Estructura del Módulo — psm1 + psd1

```
MyModule/
├── MyModule.psd1       # Module manifest
├── MyModule.psm1       # Root module (dot-sources public functions)
├── Public/
│   ├── Get-Widget.ps1
│   ├── New-Widget.ps1
│   └── Remove-Widget.ps1
└── Private/
    ├── Invoke-WidgetApi.ps1
    └── ConvertTo-WidgetDto.ps1
```

```powershell
# MyModule.psm1
$Public  = Get-ChildItem -Path "$PSScriptRoot/Public"  -Filter *.ps1
$Private = Get-ChildItem -Path "$PSScriptRoot/Private" -Filter *.ps1

foreach ($file in $Private) { . $file.FullName }
foreach ($file in $Public)  { . $file.FullName }

Export-ModuleMember -Function $Public.BaseName
```

```powershell
# MyModule.psd1 — generate with New-ModuleManifest, then edit
@{
    ModuleVersion     = '1.2.0'
    GUID              = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    Author            = 'Platform Team'
    Description       = 'Widget management module'
    PowerShellVersion = '7.2'
    RootModule        = 'MyModule.psm1'
    FunctionsToExport = @('Get-Widget', 'New-Widget', 'Remove-Widget')
    CmdletsToExport   = @()
    VariablesToExport = @()
    AliasesToExport   = @()
    RequiredModules   = @()
    PrivateData = @{
        PSData = @{
            Tags       = @('Widgets', 'Automation')
            ProjectUri = 'https://github.com/example/MyModule'
        }
    }
}
```

Instale en ámbito de usuario: `Install-Module MyModule -Scope CurrentUser`
Publique en PSGallery: `Publish-Module -Name MyModule -NuGetApiKey $env:PSGALLERY_KEY`

### Gestión de Credenciales

```powershell
# Prompt for credentials (interactive)
$cred = Get-Credential -UserName "DOMAIN\serviceaccount" -Message "Enter service account password"

# Use credential with a cmdlet
Invoke-Command -ComputerName server01 -Credential $cred -ScriptBlock { whoami }

# Store a secure string from plain text (NEVER in a script in a repo)
$securePass = ConvertTo-SecureString "plaintext" -AsPlainText -Force
$cred = [PSCredential]::new("domain\user", $securePass)

# Save encrypted credential to disk (machine/user-bound, Windows only)
$cred.Password | ConvertFrom-SecureString | Set-Content "$env:APPDATA\service.cred"

# Load it back
$securePass = Get-Content "$env:APPDATA\service.cred" | ConvertTo-SecureString
$cred = [PSCredential]::new("domain\user", $securePass)

# Cross-platform secret storage — use the SecretManagement module
Install-Module Microsoft.PowerShell.SecretManagement
Install-Module Microsoft.PowerShell.SecretStore   # local vault backend

Register-SecretVault -Name LocalVault -ModuleName Microsoft.PowerShell.SecretStore -DefaultVault
Set-Secret -Name "ApiKey" -Secret "my-secret-value"
$key = Get-Secret -Name "ApiKey" -AsPlainText
```

Nunca almacene secretos como texto plano en scripts. Use `SecretManagement` para bóvedas multiplataforma o variables de entorno inyectadas por el sistema CI/CD.

### CIM/WMI para Información del Sistema

Use `Get-CimInstance` (preferido) sobre `Get-WmiObject` (deprecado en PowerShell 7):

```powershell
# OS information
Get-CimInstance -ClassName Win32_OperatingSystem |
    Select-Object Caption, Version, BuildNumber, LastBootUpTime, FreePhysicalMemory

# CPU info
Get-CimInstance -ClassName Win32_Processor |
    Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed

# Disk info
Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DriveType = 3" |
    Select-Object DeviceID,
        @{N='SizeGB'; E={[math]::Round($_.Size/1GB,1)}},
        @{N='FreeGB'; E={[math]::Round($_.FreeSpace/1GB,1)}},
        @{N='UsedPct'; E={[math]::Round(($_.Size - $_.FreeSpace)/$_.Size * 100, 1)}}

# Remote CIM over WS-Man (works without WMI remoting)
Get-CimInstance -ComputerName server01 -ClassName Win32_Service -Filter "State = 'Stopped'"

# Invoke a CIM method
$os = Get-CimInstance Win32_OperatingSystem
Invoke-CimMethod -InputObject $os -MethodName Reboot
```

### Diferencias Multiplataforma de PowerShell 7

| Característica | Windows PowerShell 5.1 | PowerShell 7 |
|---|---|---|
| Plataforma | Solo Windows | Windows, macOS, Linux |
| Runtime .NET | .NET Framework 4.x | .NET 8+ |
| `ConvertFrom-SecureString` (no key) | Machine-bound encryption | Throws — use `-Key` or SecretManagement |
| `Enter-PSSession` SSH | No soportado | Soportado nativamente |
| Ternary operator | No soportado | `$x ? $a : $b` |
| Null coalescing | No soportado | `$x ?? $default`, `$x ??= $default` |
| Pipeline chain operators | No soportado | `command1 && command2`, `command1 \|\| fallback` |
| `ForEach-Object -Parallel` | No soportado | Soportado (use `-ThrottleLimit`) |
| `Out-GridView` | Disponible | Solo Windows (requiere WinForms) |
| COM objects | Soporte completo | Limitado |

```powershell
# PowerShell 7 parallel ForEach-Object
1..10 | ForEach-Object -Parallel {
    Start-Sleep -Milliseconds (Get-Random -Maximum 500)
    "Processed: $_"
} -ThrottleLimit 5

# Check current edition in scripts
if ($PSVersionTable.PSEdition -eq 'Desktop') {
    # Windows PowerShell 5.1 path
} else {
    # PowerShell 7+ path
}
```

## Ejemplo

Un script que audita el uso de disco en una granja de servidores, recopila resultados en paralelo y exporta a CSV:

```powershell
#Requires -Version 7.2
#Requires -Modules Microsoft.PowerShell.SecretManagement

param(
    [Parameter(Mandatory)] [string[]]$Servers,
    [string]$OutputPath = ".\disk-audit-$(Get-Date -Format 'yyyyMMdd-HHmm').csv",
    [int]$ThresholdPercent = 85
)

$ErrorActionPreference = 'Stop'
$adminCred = Get-Secret -Name "ServerAdminCred" -Vault LocalVault

$results = $Servers | ForEach-Object -Parallel {
    $server = $_
    try {
        Invoke-Command -ComputerName $server -Credential $using:adminCred -ScriptBlock {
            Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object {
                [PSCustomObject]@{
                    Server   = $env:COMPUTERNAME
                    Drive    = $_.DeviceID
                    SizeGB   = [math]::Round($_.Size / 1GB, 1)
                    FreeGB   = [math]::Round($_.FreeSpace / 1GB, 1)
                    UsedPct  = [math]::Round(($_.Size - $_.FreeSpace) / $_.Size * 100, 1)
                    Critical = ($_.FreeSpace / $_.Size * 100) -lt (100 - $using:ThresholdPercent)
                }
            }
        } -ErrorAction Stop
    } catch {
        Write-Warning "Failed to query ${server}: $($_.Exception.Message)"
        [PSCustomObject]@{ Server = $server; Drive = 'N/A'; Error = $_.Exception.Message }
    }
} -ThrottleLimit 20

$results | Export-Csv -Path $OutputPath -NoTypeInformation
Write-Output "Report saved to $OutputPath"

$critical = $results | Where-Object Critical
if ($critical) {
    Write-Warning "$($critical.Count) drive(s) above ${ThresholdPercent}% usage:"
    $critical | Format-Table Server, Drive, UsedPct, FreeGB -AutoSize
}
```

Ejecutar: `.\disk-audit.ps1 -Servers web01, web02, db01 -ThresholdPercent 80`

---
