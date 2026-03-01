@echo off
echo Installing yt-dlp...

REM Check if yt-dlp is already installed
where yt-dlp >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo yt-dlp is already installed.
    yt-dlp --version
    goto :end
)

echo Downloading yt-dlp...
curl -L -o "%USERPROFILE%\yt-dlp.exe" "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe"

if %ERRORLEVEL% == 0 (
    echo yt-dlp downloaded successfully.
    copy "%USERPROFILE%\yt-dlp.exe" "%PROGRAMFILES%\yt-dlp.exe" 2>nul
    if %ERRORLEVEL% == 0 (
        echo yt-dlp copied to Program Files.
    ) else (
        REM If copying to Program Files fails, add user directory to PATH
        echo Adding yt-dlp to PATH...
        setx PATH "%%PATH%%;%USERPROFILE%"
    )
    echo Verifying installation...
    "%USERPROFILE%\yt-dlp.exe" --version
    echo yt-dlp installation completed!
) else (
    echo Failed to download yt-dlp. Please download manually from:
    echo https://github.com/yt-dlp/yt-dlp/releases/latest
)

:end
pause