$baseUrl = "http://localhost:8080/api"
$username = "testuser"
$password = "password123"

# Login
Write-Host "Logging in..."
$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $response.token
    if (-not $token) { $token = $response.accessToken }
    Write-Host "Login Successful."
}
catch {
    Write-Error "Login failed. $_"
    exit 1
}

$headers = @{
    Authorization = "Bearer $token"
}

# 1. Create Goal
Write-Host "Creating Goal..."
$goalBody = @{
    name          = "Test Goal"
    targetAmount  = 10000
    currentAmount = 0
    deadline      = "2026-12-31"
} | ConvertTo-Json

try {
    $goal = Invoke-RestMethod -Uri "$baseUrl/goals" -Method Post -Headers $headers -Body $goalBody -ContentType "application/json"
    Write-Host "Goal Created: $($goal.id)"
}
catch {
    Write-Error "Create Goal Failed: $_"
    exit 1
}

# 2. Get Goals
Write-Host "Fetching Goals..."
try {
    $goals = Invoke-RestMethod -Uri "$baseUrl/goals" -Method Get -Headers $headers
    Write-Host "Goals count: $($goals.Count)"
}
catch {
    Write-Error "Get Goals Failed: $_"
}

# 3. Update Goal (Add Money)
Write-Host "Updating Goal..."
$goal.currentAmount = 500
$updateBody = $goal | ConvertTo-Json
try {
    $updatedGoal = Invoke-RestMethod -Uri "$baseUrl/goals/$($goal.id)" -Method Put -Headers $headers -Body $updateBody -ContentType "application/json"
    Write-Host "Goal Updated: Current Amount = $($updatedGoal.currentAmount)"
}
catch {
    Write-Error "Update Goal Failed: $_"
}

# 4. Delete Goal
Write-Host "Deleting Goal..."
try {
    Invoke-RestMethod -Uri "$baseUrl/goals/$($goal.id)" -Method Delete -Headers $headers
    Write-Host "Goal Deleted."
}
catch {
    Write-Error "Delete Goal Failed: $_"
}
