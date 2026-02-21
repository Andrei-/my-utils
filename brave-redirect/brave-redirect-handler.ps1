param(
    [Parameter(Mandatory=$true)]
    [string]$Url
)

function Close-ChromeActiveTab {
    $chromeWindow = Get-Process -Name chrome -ErrorAction SilentlyContinue |
        Where-Object { $_.MainWindowHandle -ne 0 } |
        Sort-Object StartTime -Descending |
        Select-Object -First 1

    if (-not $chromeWindow) {
        return
    }

    if (-not ("user32" -as [type])) {
        Add-Type -Namespace Win32 -Name User32 -MemberDefinition @'
[DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
'@
    }

    [Win32.User32]::SetForegroundWindow($chromeWindow.MainWindowHandle) | Out-Null
    Start-Sleep -Milliseconds 100

    $shell = New-Object -ComObject WScript.Shell
    $shell.SendKeys('^w')
}

# Strip the brave-redirect: protocol prefix
$cleanUrl = $Url -replace '^brave-redirect:', ''

# Launch Brave with the cleaned URL
$bravePath = "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"

if (Test-Path $bravePath) {
    Close-ChromeActiveTab
    Start-Process -FilePath $bravePath -ArgumentList $cleanUrl
} else {
    # Fallback to alternative Brave installation path
    $bravePath = "C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe"
    if (Test-Path $bravePath) {
        Close-ChromeActiveTab
        Start-Process -FilePath $bravePath -ArgumentList $cleanUrl
    } else {
        [System.Windows.Forms.MessageBox]::Show("Brave browser not found", "Error")
    }
}
