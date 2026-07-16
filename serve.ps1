# Simple PowerShell Static File Server

$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "--------------------------------------------------"
    Write-Host "Stitchwell Local Web Server Running"
    Write-Host "Access URL: http://localhost:$port/"
    Write-Host "Press Ctrl+C to stop the server"
    Write-Host "--------------------------------------------------"
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $url = $request.Url.LocalPath
        if ($url -eq "/") { $url = "/index.html" }
        
        # Convert url to local system path (stripping leading slash)
        $relPath = $url.TrimStart('/')
        
        # Safely combine paths using native .NET path resolver
        $currentDir = (Get-Location).Path
        $path = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($currentDir, $relPath))
        
        # Resolve files relative to current dir
        if (Test-Path $path -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($path)
            
            # Set content-type header
            if ($path.EndsWith(".html")) {
                $response.ContentType = "text/html; charset=utf-8"
            } elseif ($path.EndsWith(".css")) {
                $response.ContentType = "text/css; charset=utf-8"
            } elseif ($path.EndsWith(".js")) {
                $response.ContentType = "application/javascript; charset=utf-8"
            } elseif ($path.EndsWith(".svg")) {
                $response.ContentType = "image/svg+xml; charset=utf-8"
            }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("File Not Found: $url")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} catch {
    Write-Error $_
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
