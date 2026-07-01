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

# Chat
Write-Host "Sending Chat Message..."
$chatBody = @{
    messages = @(
        @{ role = "user"; content = "Hello AI" }
    )
} | ConvertTo-Json -Depth 5

try {
    $chatResponse = Invoke-RestMethod -Uri "$baseUrl/ai/chat" -Method Post -Headers $headers -Body $chatBody -ContentType "application/json"
    Write-Host "Chat Response Received:"
    $chatResponse | ConvertTo-Json
}
catch {
    Write-Error "Chat Failed: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "Error Body: $body"
    }
}
