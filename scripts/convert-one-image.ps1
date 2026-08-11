Add-Type -AssemblyName System.Drawing
$src = 'C:\Users\wesker\.cursor\projects\c-Users-wesker-Documents-GMC-UK\assets\c__Users_wesker_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_bamboo-raised-garden-bed-1-a8f0e70f-1f37-4003-8a3c-cdd2daa46ff6.png'
$dst = 'C:\Users\wesker\Documents\GMC UK\public\images\products\bamboo-raised-garden-bed-1.jpg'
$img = [System.Drawing.Image]::FromFile($src)
$bmp = New-Object System.Drawing.Bitmap $img.Width, $img.Height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$g.DrawImage($img, 0, 0, $img.Width, $img.Height)
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, 90L)
$bmp.Save($dst, $encoder, $params)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Get-Item $dst | Select-Object Name, Length
