# Copia el monorepo local a los clones de Azure DevOps.
# No hace git add / commit / push: eso lo hace el usuario.
#
# Uso (desde cualquier sitio):
#   powershell -ExecutionPolicy Bypass -File .\scripts\sync-azure-repos.ps1
#
# Parámetros opcionales:
#   -AzureRoot  carpeta que contiene salto-usecase-marketplace-api y -ui

[CmdletBinding()]
param(
    [string] $AzureRoot = "D:\Dario\Documents\Multiplica\unacem",
    [string] $SourceRoot = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not $SourceRoot) {
    $SourceRoot = Split-Path -Parent $PSScriptRoot
}

$ApiDest = Join-Path $AzureRoot "salto-usecase-marketplace-api"
$UiDest = Join-Path $AzureRoot "salto-usecase-marketplace-ui"
$BackendSrc = Join-Path $SourceRoot "backend"
$FrontendSrc = Join-Path $SourceRoot "frontend"
$DocsSrc = Join-Path $SourceRoot "docs"

function Assert-Dir {
    param([string] $Path, [string] $Label)
    if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
        throw "No existe $Label : $Path"
    }
}

function Invoke-Robocopy {
    param(
        [string] $From,
        [string] $To,
        [string[]] $ExcludeDirs,
        [string[]] $ExcludeFiles
    )
    if (-not (Test-Path -LiteralPath $To)) {
        New-Item -ItemType Directory -Path $To | Out-Null
    }
    $args = @(
        $From, $To, "/E", "/NFL", "/NDL", "/NJH", "/NJS", "/NP", "/R:1", "/W:1"
    )
    if ($ExcludeDirs.Count -gt 0) {
        $args += "/XD"
        $args += $ExcludeDirs
    }
    if ($ExcludeFiles.Count -gt 0) {
        $args += "/XF"
        $args += $ExcludeFiles
    }
    & robocopy @args | Out-Null
    $code = $LASTEXITCODE
    # 0-7 = copiado / extra / mismatch; >=8 error
    if ($code -ge 8) {
        throw "robocopy falló ($code) de $From a $To"
    }
}

function Save-PlatformFiles {
    param([string] $Dest)
    $readme = Join-Path $Dest "README.md"
    $decisions = Join-Path $Dest "docs\decisions"
    $bundle = Join-Path $Dest ".azure-platform-backup"
    if (Test-Path -LiteralPath $bundle) {
        Remove-Item -LiteralPath $bundle -Recurse -Force
    }
    New-Item -ItemType Directory -Path $bundle | Out-Null
    if (Test-Path -LiteralPath $readme) {
        Copy-Item -LiteralPath $readme -Destination (Join-Path $bundle "README.md")
    }
    if (Test-Path -LiteralPath $decisions) {
        Copy-Item -LiteralPath $decisions -Destination (Join-Path $bundle "decisions") -Recurse
    }
}

function Restore-PlatformFiles {
    param([string] $Dest)
    $bundle = Join-Path $Dest ".azure-platform-backup"
    $readmeBak = Join-Path $bundle "README.md"
    $decisionsBak = Join-Path $bundle "decisions"
    $readme = Join-Path $Dest "README.md"
    $decisions = Join-Path $Dest "docs\decisions"
    if (Test-Path -LiteralPath $readmeBak) {
        Copy-Item -LiteralPath $readmeBak -Destination $readme -Force
    }
    if (Test-Path -LiteralPath $decisionsBak) {
        if (Test-Path -LiteralPath $decisions) {
            Remove-Item -LiteralPath $decisions -Recurse -Force
        }
        New-Item -ItemType Directory -Path (Split-Path $decisions) -Force | Out-Null
        Copy-Item -LiteralPath $decisionsBak -Destination $decisions -Recurse
    }
    Remove-Item -LiteralPath $bundle -Recurse -Force
}

Assert-Dir $SourceRoot "monorepo"
Assert-Dir $BackendSrc "backend"
Assert-Dir $FrontendSrc "frontend"
Assert-Dir $ApiDest "clone API (clona el repo de Azure en AzureRoot)"
Assert-Dir $UiDest "clone UI"
if (-not (Test-Path -LiteralPath (Join-Path $ApiDest ".git"))) {
    throw "El destino API no es un clone git: $ApiDest"
}
if (-not (Test-Path -LiteralPath (Join-Path $UiDest ".git"))) {
    throw "El destino UI no es un clone git: $UiDest"
}

$commonXd = @(".git", ".venv", "__pycache__", ".cursor", ".vercel")
$frontXd = $commonXd + @("node_modules", ".next", "coverage", ".turbo", "dist")
$excludeFiles = @(".env", ".env.local", "*.pyc")

Write-Host "API  $BackendSrc  ->  $ApiDest"
Save-PlatformFiles -Dest $ApiDest
Invoke-Robocopy -From $BackendSrc -To $ApiDest -ExcludeDirs $commonXd -ExcludeFiles $excludeFiles
if (Test-Path -LiteralPath $DocsSrc) {
    $docsCodigo = Join-Path $ApiDest "docs\codigo"
    Invoke-Robocopy -From $DocsSrc -To $docsCodigo -ExcludeDirs @() -ExcludeFiles @()
}
Restore-PlatformFiles -Dest $ApiDest

Write-Host "UI   $FrontendSrc  ->  $UiDest"
Save-PlatformFiles -Dest $UiDest
Invoke-Robocopy -From $FrontendSrc -To $UiDest -ExcludeDirs $frontXd -ExcludeFiles $excludeFiles
Restore-PlatformFiles -Dest $UiDest

$layoutApi = @"
# Layout del código (no es la plantilla src/)

FastAPI vive en ``app/`` (Uvicorn: ``app.main:app``). Migraciones: ``alembic upgrade head``.
Python 3.11+, PostgreSQL 16 (no Azure SQL). Ver ``docs/codigo/``.
"@
Set-Content -LiteralPath (Join-Path $ApiDest "docs\LAYOUT.md") -Value $layoutApi -Encoding utf8

$layoutUi = @"
# Layout del código (Next.js)

La raíz de este repo es el proyecto Next.js (``package.json``). No hay carpeta ``frontend/``.
Node 20+. Variables: ``BACKEND_API_URL``, ``REVALIDATE_SECRET`` (``.env.example``).
"@
Set-Content -LiteralPath (Join-Path $UiDest "docs\LAYOUT.md") -Value $layoutUi -Encoding utf8

Write-Host ""
Write-Host "Listo. Revisa git status en cada clone y haz commit/push tú."
Write-Host "  cd $ApiDest"
Write-Host "  cd $UiDest"
