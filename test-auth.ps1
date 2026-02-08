$token = '8835b3a97a4e85b05a1415b4c3cea477bbce3b5f2164b6853048050161bb0869'
$result = Invoke-RestMethod -Uri http://localhost:5000/add-friend -Method Post -ContentType 'application/json' -Headers @{Authorization="Bearer $token"} -Body (ConvertTo-Json @{username='VANSH_TANWAR18'})
$result | ConvertTo-Json -Depth 5
