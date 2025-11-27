param(
    [Parameter(Mandatory=$true)]
    [string]$Url
)

# Strip the brave-redirect: protocol prefix
$cleanUrl = $Url -replace '^brave-redirect:', ''

# Launch Brave with the cleaned URL
$bravePath = "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"

if (Test-Path $bravePath) {
    Start-Process -FilePath $bravePath -ArgumentList $cleanUrl
} else {
    # Fallback to alternative Brave installation path
    $bravePath = "C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe"
    if (Test-Path $bravePath) {
        Start-Process -FilePath $bravePath -ArgumentList $cleanUrl
    } else {
        [System.Windows.Forms.MessageBox]::Show("Brave browser not found", "Error")
    }
}
