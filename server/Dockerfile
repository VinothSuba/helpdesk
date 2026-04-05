FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock* ./
COPY server/package.json server/
COPY shared/package.json shared/
RUN bun install --frozen-lockfile || bun install

COPY shared/ shared/
COPY server/ server/

EXPOSE 3001
CMD ["bun", "run", "--filter", "server", "start"]
