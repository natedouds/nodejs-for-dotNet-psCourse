FOR /F "tokens=5" %%P IN ('
    netstat -noa ^| findstr /r /c:":3000 .*LISTENING"
') DO taskkill /F /PID %%P
