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

# Analyze
Write-Host "Calling AI Analyze..."
try {
    $analysis = Invoke-RestMethod -Uri "$baseUrl/ai/analyze" -Method Post -Headers $headers
    Write-Host "AI Response Received:"
    $analysis | ConvertTo-Json -Depth 5
}
catch {
    Write-Error "AI Analysis Failed: $_"
    # Print response body if available
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "Error Body: $body"
    }
}
