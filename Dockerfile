# Build the site with the server-backed admin, serve it with the dependency-free Node server.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV VITE_BASE=/ VITE_ADMIN_MODE=server
# Public URL for OG/canonical/sitemap: docker compose build --build-arg VITE_SITE_URL=https://<domain>/
ARG VITE_SITE_URL
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8080 DATA_DIR=/data DIST_DIR=/app/dist
COPY server/server.mjs ./server.mjs
COPY --from=build /app/dist ./dist
RUN mkdir -p /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 8080
HEALTHCHECK CMD wget -qO- http://127.0.0.1:8080/api/session >/dev/null || exit 1
CMD ["node", "server.mjs"]
