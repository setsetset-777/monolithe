FROM node:25-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm@10

# -------------------------
# Build
# -------------------------
FROM base AS build
COPY . .
RUN --mount=type=secret,id=GITHUB_TOKEN \
  pnpm config set //npm.pkg.github.com/:_authToken $(cat /run/secrets/GITHUB_TOKEN) && \
  pnpm install
RUN pnpm --filter @monolithe/astro build

RUN pnpm deploy --filter @monolithe/astro --prod /out/front

# -------------------------
# Runtime
# -------------------------
FROM base AS front
WORKDIR /front

# Copy front source
COPY --from=build /out/front .

EXPOSE 8001
CMD ["pnpm", "start"]
