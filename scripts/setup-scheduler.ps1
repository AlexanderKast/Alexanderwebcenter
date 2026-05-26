# setup-scheduler.ps1
# Crea la tarea en Windows Task Scheduler para el briefing semanal dominical.
# Ejecutar UNA SOLA VEZ como Administrador.
#
# Uso: powershell -ExecutionPolicy Bypass -File scripts\setup-scheduler.ps1

$TaskName   = "AlexanderCast-NewsBreifing"
$ScriptPath = "F:\Descargas\davies-personal-portfolio-html-template-2025-11-16-16-03-47-utc\davies-mainfiles\scripts\news-briefing.py"
$WorkDir    = "F:\Descargas\davies-personal-portfolio-html-template-2025-11-16-16-03-47-utc\davies-mainfiles"
$PythonExe  = (Get-Command python -ErrorAction SilentlyContinue).Source

if (-not $PythonExe) {
    Write-Host "ERROR: Python no encontrado en PATH. Instala Python 3.10+ primero." -ForegroundColor Red
    exit 1
}

Write-Host "Python encontrado: $PythonExe" -ForegroundColor Green

# Eliminar tarea anterior si existe
$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existing) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "Tarea anterior eliminada." -ForegroundColor Yellow
}

# Trigger: cada domingo a las 9:00am
$trigger = New-ScheduledTaskTrigger `
    -Weekly `
    -DaysOfWeek Sunday `
    -At "09:00AM"

# Acción: python scripts/news-briefing.py
$action = New-ScheduledTaskAction `
    -Execute $PythonExe `
    -Argument "`"$ScriptPath`"" `
    -WorkingDirectory $WorkDir

# Configuración: ejecutar si se perdió (cuando el PC estaba apagado)
$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1) `
    -MultipleInstances IgnoreNew

# Registrar la tarea
Register-ScheduledTask `
    -TaskName $TaskName `
    -Trigger $trigger `
    -Action $action `
    -Settings $settings `
    -Description "Briefing semanal de noticias para Alexander Cast (NewsCatcher)" `
    -RunLevel Limited `
    -Force | Out-Null

Write-Host ""
Write-Host "✅ Tarea creada exitosamente:" -ForegroundColor Green
Write-Host "   Nombre : $TaskName"
Write-Host "   Horario: Domingos 9:00am"
Write-Host "   Script : $ScriptPath"
Write-Host "   Nota   : Si el PC estaba apagado, corre al encenderse"
Write-Host ""
Write-Host "Para verificar: Get-ScheduledTask -TaskName '$TaskName'"
Write-Host "Para correr ahora: Start-ScheduledTask -TaskName '$TaskName'"
