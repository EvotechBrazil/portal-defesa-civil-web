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

Rotas: `/login`, `/registro`, `/verificar-email`, `/biblioteca`,
`/curso/[slug]`, `/curso/[slug]/[pageSlug]`, `/questoes`, `/estudar`,
`/estudar/[sessionId]`, `/praticar`, `/desempenho`.

`/biblioteca` lista o catálogo e matricula. `/curso/[slug]` mostra módulos e
as 4 páginas (`pareto`, `modulos`, `apostila`, `gloss`). `/questoes` é o banco
(109 itens) com filtro por módulo, busca e modos estudo/gabarito.
Markdown sanitizado em `src/components/shared/markdown-view.tsx`.

`/estudar` escolhe Essenciais (43) ou Completo (43+109) e abre uma sessão.
Espaço vira a carta; 1/2/3 marcam difícil/aprendendo/fácil. Com o painel de
fundamentação aberto, marcar não avança — aparece “Próxima carta”.

`/praticar` lista cartas e tentativas recentes. `PracticePanel` (`cardId`)
é a mini-prova: idle → running → done, ou idle → gabarito. Sparkline das
últimas 8, delta em pontos percentuais, alternativa errada em vermelho e
certa em verde. Estudo monta o mesmo painel depois.

## Como testar

```bash
pnpm exec tsc --noEmit
pnpm lint
```
