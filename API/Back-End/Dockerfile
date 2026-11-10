FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

# Pasta das fotos dos anúncios; no Compose vira o volume uploads_data (ADR-08)
RUN mkdir -p /app/uploads

EXPOSE 3000

# Chamado via "sh": no bind mount do Windows a permissão de execução se perde
CMD ["sh", "./docker-entrypoint.sh"]