$token = '8835b3a97a4e85b05a1415b4c3cea477bbce3b5f2164b6853048050161bb0869'
$headers = @{Authorization="Bearer $token"}
$result = Invoke-RestMethod -Uri http://localhost:5000/leaderboard -Method Get -Headers $headers
$result | ConvertTo-Json -Depth 5
