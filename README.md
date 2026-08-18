# portal-defesa-civil-web

Frontend Next.js 15 do Portal de Ensino — Defesa Civil.

## Como rodar

```bash
cd portal-defesa-civil-web
pnpm install
pnpm dev
```

Abre em `http://localhost:3000`. A API precisa estar em `http://localhost:3001/api/v1`
(`NEXT_PUBLIC_API_URL` no `.env.local`).

Rotas placeholder: `/login`, `/registro`, `/verificar-email`, `/biblioteca`,
`/curso/[slug]`, `/questoes`, `/estudar`, `/praticar`, `/desempenho`.

## Como testar

```bash
pnpm exec tsc --noEmit
pnpm lint
```
