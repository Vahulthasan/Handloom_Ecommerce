Add-Type -AssemblyName System.Drawing

function Zoom-Crop {
    param(
        [string]$Src,
        [string]$Dst,
        [int]$X,
        [int]$Y,
        [int]$W,
        [int]$H
    )
    $srcImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path $Src).Path)
    $dstImg = New-Object System.Drawing.Bitmap(1024, 1024)
    $g = [System.Drawing.Graphics]::FromImage($dstImg)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $srcRect = New-Object System.Drawing.Rectangle($X, $Y, $W, $H)
    $dstRect = New-Object System.Drawing.Rectangle(0, 0, 1024, 1024)
    $g.DrawImage($srcImg, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $srcImg.Dispose()
    $dstImg.Save($Dst, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $dstImg.Dispose()
}

$base = (Get-Location).Path
Zoom-Crop "$base\public\images\bamboo-teardrop-shade.jpg" "$base\public\images\bamboo-teardrop-angle2.jpg" 180 160 660 660
Zoom-Crop "$base\public\images\bamboo-lotus-flared.jpg" "$base\public\images\bamboo-lotus-angle2.jpg" 180 180 660 660
Write-Output "Successfully created angle2 crops."
