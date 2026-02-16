FROM node:25-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV CLIENT_DIST=/server/client/dist
ENV CONFIG_PATH=/server/config

RUN npm install -g pnpm

# -------------------------
# Build
# -------------------------
FROM base AS build
COPY . .
RUN pnpm install
RUN pnpm --filter client build

RUN pnpm --filter server build

RUN pnpm deploy --filter server --prod /out/server

# -------------------------
# Runtime
# -------------------------
FROM base AS server
WORKDIR /server

# Copy server source
COPY --from=build /out/server .

# Copy built client assets
COPY --from=build /app/apps/client/dist ./client/dist
COPY --from=build /app/config ./config

# Install only prod deps for server
RUN pnpm install --prod

EXPOSE 8001
CMD ["pnpm", "start"]
