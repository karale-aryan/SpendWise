$baseUrl = "http://localhost:8080/api"
$username = "testuser"
$password = "password123"

# Login
Write-Host "Logging in..."
$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json -Compress

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

# 1. Set Budget (Small amount to trigger alert)
Write-Host "Setting Budget to 100..."
$budgetBody = @{
    monthlyLimit = 100
    month        = (Get-Date).Month
    year         = (Get-Date).Year
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/budgets" -Method Post -Headers $headers -Body $budgetBody -ContentType "application/json"
    Write-Host "Budget Set."
}
catch {
    Write-Error "Set Budget Failed: $_"
}

# 2. Add Expense > 100
Write-Host "Adding Expense of 200..."
$expenseBody = @{
    amount      = 200
    category    = "Test Alert"
    date        = (Get-Date).ToString("yyyy-MM-dd")
    description = "Trigger Alert"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/expenses" -Method Post -Headers $headers -Body $expenseBody -ContentType "application/json"
    Write-Host "Expense Added. Check logs for Email Alert."
}
catch {
    Write-Error "Add Expense Failed: $_"
}
