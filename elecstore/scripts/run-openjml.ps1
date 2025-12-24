# Helper script to run OpenJML on the example
Set-StrictMode -Version Latest

$openjml = Get-Command openjml -ErrorAction SilentlyContinue
if (-not $openjml) {
    Write-Host "openjml not found in PATH. Please install OpenJML (https://openjml.org) and ensure 'openjml' is on PATH." -ForegroundColor Yellow
    exit 1
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$src = Join-Path $projectRoot "src\main\java"

Write-Host "Running OpenJML on example file..."
openjml -quiet -esc -classpath "$projectRoot\target\classes" -sourcepath $src "$src\electronics\elecstore\example\JmlExample.java"
