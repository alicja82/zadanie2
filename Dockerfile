# Etap budowania
FROM node:20-alpine AS builder
LABEL org.opencontainers.image.authors="Alicja Kwiatkowska"

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Etap produkcyjny
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app /app

EXPOSE 3000

RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["node", "server.js"]
