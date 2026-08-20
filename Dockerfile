# syntax=docker/dockerfile:1

# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app

RUN npm install -g pnpm@9.15.0

# O Next inlina NEXT_PUBLIC_* no bundle em tempo de BUILD, nao de runtime.
# O Coolify injeta as envs da aplicacao como build ARGs, entao isto chega
# preenchido la; em `docker build` local, passe --build-arg.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package.json pnpm-lock.yaml ./
# --include=dev equivalente: o build precisa das devDependencies (next, tailwind,
# typescript). Nao troque por --prod.
RUN pnpm install --frozen-lockfile

COPY . .

# Falha cedo em vez de publicar um front que aponta para lugar nenhum. Sem isto,
# o erro so aparece no navegador do usuario, como chamada para undefined/api/v1.
RUN test -n "$NEXT_PUBLIC_API_URL" \
  || (echo "ERRO: NEXT_PUBLIC_API_URL vazio no build. Defina a env na aplicacao do Coolify." && exit 1)

RUN pnpm build

# ---------- runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
# Sem isto o servidor do Next escuta em 127.0.0.1 e o container fica inalcancavel.
ENV HOSTNAME=0.0.0.0

# output: "standalone" no next.config.ts e o que faz estes tres COPY bastarem.
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
