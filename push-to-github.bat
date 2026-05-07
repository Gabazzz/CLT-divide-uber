@echo off
set GIT_EXE=C:\Program Files\Git\cmd\git.exe

if not exist "%GIT_EXE%" (
  echo Git nao encontrado em: %GIT_EXE%
  pause
  exit /b 1
)

echo Git encontrado!
"%GIT_EXE%" --version

echo.
echo === Inicializando repositorio ===
"%GIT_EXE%" init

echo.
echo === Configurando remote ===
"%GIT_EXE%" remote remove origin 2>nul
"%GIT_EXE%" remote add origin https://github.com/Gabazzz/CLT-divide-uber.git

echo.
echo === Adicionando arquivos ===
"%GIT_EXE%" add .

echo.
echo === Criando commit ===
"%GIT_EXE%" commit -m "feat: app completo - login, RBAC, perfil, filtro por mes, animacoes neon"

echo.
echo === Fazendo push (vai pedir usuario e senha/token do GitHub) ===
"%GIT_EXE%" branch -M main
"%GIT_EXE%" push -u origin main --force

echo.
echo === Pronto! Codigo enviado! ===
pause
