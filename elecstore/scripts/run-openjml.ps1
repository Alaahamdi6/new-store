# Helper script to run OpenJML on the example
Set-StrictMode -Version Latest

$openjmlPath = "C:\Users\User\Desktop\OpenJML-21-0.19\OpenJML21\openjml"

if (-not (Test-Path $openjmlPath)) {
    Write-Host "OpenJML not found at $openjmlPath" -ForegroundColor Yellow
    exit 1
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$src = Join-Path $projectRoot "src\main\java"

Write-Host "Running OpenJML on all Java sources..."
& $openjmlPath -quiet -esc -classpath "$projectRoot\target\classes" -sourcepath $src (Get-ChildItem -Path $src -Filter "*.java" -Recurse | ForEach-Object { $_.FullName })

Write-Host "OpenJML verification complete"
