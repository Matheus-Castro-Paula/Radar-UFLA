#!/bin/sh
# Issue #42: prepara o banco antes de subir a API.
set -e

echo ">> Aplicando migrations..."
npx sequelize-cli db:migrate

echo ">> Aplicando seeders..."
npx sequelize-cli db:seed:all

echo ">> Subindo a API..."
exec node src/server.js