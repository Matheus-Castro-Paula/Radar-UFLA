#!/bin/sh
# Comando do serviço "testes" do docker-compose.test.yml.
# Chamado via "sh": no bind mount do Windows a permissão de execução se perde.
set -e

node tests/ambiente/banco.js preparar
node tests/ambiente/verificar.js --evidencia

if [ -f node_modules/jest/bin/jest.js ]; then
  node tests/ambiente/gerar-evidencias.js
else
  echo ">> Jest ainda não está instalado: só o ambiente foi verificado."
fi
