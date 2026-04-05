FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock* ./
COPY client/package.json client/
COPY shared/package.json shared/
RUN bun install --frozen-lockfile || bun install

COPY shared/ shared/
COPY client/ client/

EXPOSE 5173
CMD ["bun", "run", "--filter", "client", "dev", "--", "--host"]
