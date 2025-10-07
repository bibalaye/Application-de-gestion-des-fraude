# Script PowerShell de test de l'authentification
# Usage: .\test-auth.ps1

$API_URL = "http://localhost:8080"
$USERNAME = "admin"
$PASSWORD = "password"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Test de l'authentification - Application de gestion des fraudes" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Login avec credentials valides
Write-Host "Test 1: Login avec credentials valides" -ForegroundColor Yellow
$body = @{
    username = $USERNAME
    password = $PASSWORD
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    
    if ($response.data.token) {
        Write-Host "✓ Login réussi" -ForegroundColor Green
        $TOKEN = $response.data.token
        Write-Host "Token: $($TOKEN.Substring(0, [Math]::Min(50, $TOKEN.Length)))..."
    } else {
        Write-Host "✗ Login échoué - Pas de token dans la réponse" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Login échoué - Erreur: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Login avec credentials invalides
Write-Host "Test 2: Login avec credentials invalides" -ForegroundColor Yellow
$invalidBody = @{
    username = "admin"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/auth/login" -Method Post -Body $invalidBody -ContentType "application/json"
    Write-Host "✗ Les credentials invalides ont été acceptés" -ForegroundColor Red
} catch {
    Write-Host "✓ Rejet des credentials invalides" -ForegroundColor Green
}
Write-Host ""

# Test 3: Accès à un endpoint protégé avec token
Write-Host "Test 3: Accès à /api/users avec token" -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $TOKEN"
}

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/users" -Method Get -Headers $headers
    Write-Host "✓ Accès autorisé (HTTP 200)" -ForegroundColor Green
} catch {
    Write-Host "✗ Accès refusé (HTTP $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Red
}
Write-Host ""

# Test 4: Accès à un endpoint protégé sans token
Write-Host "Test 4: Accès à /api/users sans token" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/users" -Method Get
    Write-Host "✗ Accès autorisé alors qu'il devrait être refusé" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "✓ Accès refusé comme attendu (HTTP 401)" -ForegroundColor Green
    } else {
        Write-Host "✗ Code HTTP inattendu: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 5: Accès à un endpoint protégé avec token invalide
Write-Host "Test 5: Accès à /api/users avec token invalide" -ForegroundColor Yellow
$invalidHeaders = @{
    Authorization = "Bearer invalid-token-here"
}

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/users" -Method Get -Headers $invalidHeaders
    Write-Host "✗ Token invalide accepté" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "✓ Token invalide rejeté (HTTP 401)" -ForegroundColor Green
    } else {
        Write-Host "✗ Code HTTP inattendu: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 6: Accès aux rôles
Write-Host "Test 6: Accès à /api/roles avec token" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/roles" -Method Get -Headers $headers
    Write-Host "✓ Accès aux rôles autorisé (HTTP 200)" -ForegroundColor Green
} catch {
    Write-Host "✗ Accès aux rôles refusé (HTTP $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Red
}
Write-Host ""

# Test 7: Accès aux alertes
Write-Host "Test 7: Accès à /api/alerts avec token" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/alerts" -Method Get -Headers $headers
    Write-Host "✓ Accès aux alertes autorisé (HTTP 200)" -ForegroundColor Green
} catch {
    Write-Host "⚠ Accès aux alertes refusé (HTTP $($_.Exception.Response.StatusCode.value__)) - Service peut-être non démarré" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Tests terminés !" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
