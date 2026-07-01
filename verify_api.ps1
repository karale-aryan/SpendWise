$baseUrl = "http://localhost:8080/api"
$username = "verify_user_$(Get-Random)"
$password = "password123"
$email = "$username@example.com"

# 1. Register or Login
Write-Host "Registering user: $username"
$registerBody = @{
    username = $username
    email = $email
    password = $password
    role = "USER"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    $token = $response.token
    if (-not $token) { $token = $response.accessToken }
    Write-Host "Registration Successful. Token acquired."
} catch {
    Write-Host "Registration failed or user exists. Trying login..."
    $loginBody = @{
        username = "testuser"
        password = "password123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        $token = $response.token
        if (-not $token) { $token = $response.accessToken }
        Write-Host "Login Successful. Token acquired."
    } catch {
        Write-Error "Login failed. $_"
        exit 1
    }
}

$headers = @{
    Authorization = "Bearer $token"
}

# 2. Verify Profile
Write-Host "Verifying Profile..."
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/users/me" -Method Get -Headers $headers
    Write-Host "Profile OK: $($profile.username)"
} catch {
    Write-Error "Profile Verification Failed: $_"
}

# 3. Verify Analytics
Write-Host "Verifying Analytics..."
try {
    $analytics = Invoke-RestMethod -Uri "$baseUrl/analytics" -Method Get -Headers $headers
    Write-Host "Analytics OK. Total Spent: $($analytics.totalSpent)"
} catch {
    Write-Error "Analytics Verification Failed: $_"
}

# 4. Verify Recurring Expenses
Write-Host "Verifying Recurring Expenses..."
try {
    $subscriptions = Invoke-RestMethod -Uri "$baseUrl/recurring-expenses" -Method Get -Headers $headers
    Write-Host "Recurring Expenses OK. Count: $($subscriptions.Count)"
    
    # Add one
    $subBody = @{
        description = "Test Sub"
        amount = 100.0
        category = "Subscription"
        frequency = "MONTHLY"
        startDate = (Get-Date).ToString("yyyy-MM-dd")
        nextDueDate = (Get-Date).ToString("yyyy-MM-dd")
    } | ConvertTo-Json
    
    $newSub = Invoke-RestMethod -Uri "$baseUrl/recurring-expenses" -Method Post -Body $subBody -Headers $headers -ContentType "application/json"
    Write-Host "Added Subscription: $($newSub.id)"
} catch {
    Write-Error "Recurring Expenses Verification Failed: $_"
}
