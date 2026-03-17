# FitTrack

Sistema de controle de peso com cadastro de pessoas, registro de peso, cálculo de IMC e gráfico de evolução.

## Projeto de Software — 3 camadas

O projeto atende à disciplina com as três camadas:

| Camada | Tecnologia | Onde no projeto |
|--------|------------|------------------|
| **Front-end** | Next.js (App Router) + TypeScript + Recharts | `app/`, `components/`, `app/globals.css` |
| **Back-end** | Lógica em Node (lib) + API Supabase | `lib/data.ts`, `lib/supabase.ts` — chamadas ao banco via cliente Supabase |
| **Banco de dados** | PostgreSQL (Supabase) | `supabase/migrations/` — tabelas e trigger de IMC |

O código está comentado nos arquivos principais; as migrações SQL devem ser executadas na ordem descrita em **supabase/migrations/README.md**.

## Stack atual (v2)

- **Next.js** (App Router) + TypeScript — frontend e única aplicação
- **Supabase** — banco PostgreSQL (tabelas `pessoas`, `registros_peso`) e trigger de IMC
- **Recharts** — gráfico de evolução do peso

A lógica de negócio do antigo backend Python está em **lib/data.ts** e no trigger de IMC em **supabase/migrations**. Código legado em `_legacy/` e `frontend/` (Vite) só como referência.

## Estrutura

```
fittrack/
├── app/                      # Next.js App Router (frontend)
│   ├── layout.tsx
│   ├── page.tsx              # Dashboard
│   ├── globals.css
│   ├── pessoas/page.tsx      # CRUD de pessoas
│   ├── pesagens/page.tsx     # CRUD de pesagens
│   └── pessoa/[id]/page.tsx  # Detalhe + gráfico + registrar peso
├── components/                # Layout, sidebar e managers (CRUD)
├── lib/
│   ├── supabase.ts           # Cliente Supabase
│   ├── types.ts              # Tipos (Pessoa, RegistroPeso, etc.)
│   └── data.ts               # Lógica de dados (listar/criar pessoas, peso, IMC)
├── supabase/migrations/      # Schema, trigger IMC e regras de validação do banco
├── .env.local.example
├── _legacy/                  # Referência (não usado na stack atual)
│   ├── backend-python/       # FastAPI + SQLite
│   └── programa.py           # Script console antigo
└── frontend/                 # Legado Vite/React (referência)
```

## Setup rápido AC1 (Git + Supabase + GitHub CLI)

Para configurar tudo de uma vez (Git, Supabase, GitHub):

```powershell
npm run setup
```

Ou execute manualmente: `.\scripts\setup-ac1.ps1`

**Pré-requisitos:** Git, Supabase CLI (`npm i -g supabase`), GitHub CLI (`gh`).  
Detalhes e checklist da entrega em **AC1_ENTREGA.md**.

---

## Como rodar

### 1. Banco de dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. **Opção A — Supabase CLI (recomendado):** `supabase login` → `supabase link --project-ref SEU_PROJECT_ID` → `supabase db push` (ou `npm run db:push`)
3. **Opção B — Manual:** No SQL Editor, execute na ordem os arquivos em `supabase/migrations/` (ver `supabase/migrations/README.md`)
4. Em **Settings > API**, copie a **Project URL** e a **anon public** key para `.env.local`.

### Rotas do sistema

- `/` — Dashboard gerencial
- `/pessoas` — CRUD completo de pessoas
- `/pesagens` — CRUD completo de pesagens
- `/pessoa/[id]` — Detalhes da pessoa + gráfico de evolução

### 2. App Next.js

```bash
npm install
cp .env.local.example .env.local
# Edite .env.local e preencha:
#   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key

npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Build para produção

```bash
npm run build
npm start
```

---

## Git e GitHub

### Inicializar repositório (se ainda não tiver)

```bash
git init
git add .
git commit -m "Migração Next.js + Supabase"
```

### Enviar para o GitHub

1. Crie um repositório novo no GitHub (vazio, sem README).
2. Na pasta do projeto:

```bash
git remote add origin https://github.com/SEU_USUARIO/fittrack.git
git branch -M main
git push -u origin main
```

---

## Vercel (deploy)

1. Acesse [vercel.com](https://vercel.com) e conecte sua conta ao GitHub.
2. **Add New Project** e importe o repositório `fittrack`.
3. Em **Environment Variables** (Production e Preview), adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL do projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = chave anon do Supabase
4. Deploy: a cada push em `main` será gerado um novo deploy. O site ficará em `https://seu-projeto.vercel.app`.

---

## GitHub Board (Projects)

1. No repositório no GitHub: aba **Projects** → **New project** (Board ou Table).
2. Crie colunas, por exemplo: **Backlog**, **To Do**, **In Progress**, **Done**.
3. Sugestão de issues para rastrear a migração ou próximas melhorias:
   - Migrar UI para Next.js
   - Configurar Supabase e schema
   - Substituir API por Supabase
   - Configurar deploy Vercel
   - Documentar setup no README
   - (Opcional) Autenticação com Supabase Auth
   - (Opcional) RLS por usuário

Labels sugeridos: `migration`, `frontend`, `devops`. Milestone: **v2 Next + Supabase**.

---

## Versão anterior (FastAPI + Vite)

### Backend legado (referência)

```bash
cd _legacy/backend-python
python -m venv venv
# Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (referência)

```bash
cd frontend
npm install
npm run dev
```

Interface em http://localhost:5173 (proxy para API em :8000).
