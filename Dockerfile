# --- Estágio 1: build do Angular (gera o bundle do browser + o servidor SSR) ---
FROM node:22-alpine AS build
WORKDIR /build

# URLs públicas que o NAVEGADOR do visitante usa para falar com as APIs.
# São embutidas no bundle em tempo de build (environment.prod.ts), então
# precisam ser passadas com --build-arg (ou "build.args" no docker-compose).
ARG API_URL=http://localhost:8080
ARG ANALYTICS_URL=http://localhost:8091

# Copia só os manifestos primeiro para cachear o npm ci.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Reescreve as URLs no environment.prod.ts apenas dentro do container de build.
RUN sed -i "s|apiUrl: '.*'|apiUrl: '${API_URL}'|; s|analyticsApiUrl: '.*'|analyticsApiUrl: '${ANALYTICS_URL}'|" src/environments/environment.prod.ts \
 && cat src/environments/environment.prod.ts
RUN npm run build

# --- Estágio 2: runtime Node (o app usa SSR com Express, não é só estático) ---
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=4000

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /build/dist/mork-store ./dist/mork-store

EXPOSE 4000
CMD ["node", "dist/mork-store/server/server.mjs"]
