# AC1 — Entrega (Prazo: 15/03)

## Funcionalidade entregue

**Cadastro e listagem de pessoas** — Front-end (Next.js) + Back-end (lib/data + Supabase) + Banco (PostgreSQL).

- Cadastrar pessoa (nome, idade, altura)
- Listar pessoas com último peso e IMC (quando houver registros)

## Checklist da entrega

- [ ] **Lista dos alunos** (nome completo) no PDF
- [ ] **Link do board** (GitHub Projects, Jira ou Trello)
- [ ] **Link do GitHub** com código fonte
- [ ] **Vídeo** apresentando a funcionalidade do sprint

## Setup rápido (Git + Supabase + GitHub)

### Pré-requisitos

| Ferramenta | Instalação |
|------------|------------|
| **Git** | https://git-scm.com |
| **Supabase CLI** | `npm install -g supabase` |
| **GitHub CLI** | https://cli.github.com |

### Comando único (PowerShell)

```powershell
.\scripts\setup-ac1.ps1
```

O script vai:

1. Verificar Git, Supabase CLI e GitHub CLI
2. Inicializar Git (se ainda não existir)
3. Fazer login no Supabase (`supabase login` — abre o navegador)
4. Vincular ao projeto (você informa o Project ID; terá que informar a senha do banco em Settings > Database)
5. Aplicar migrações no banco (`supabase db push`)
6. Criar `.env.local` a partir do exemplo
7. Opcional: criar repositório no GitHub e dar push

### Passo a passo manual

```bash
# 1. Git
git init
git branch -M main

# 2. Supabase
supabase login
supabase link --project-ref SEU_PROJECT_ID   # ID da URL do dashboard
supabase db push

# 3. Env
cp .env.local.example .env.local
# Edite .env.local com URL e anon key (Settings > API)

# 4. GitHub (se usar gh)
gh auth login
gh repo create fittrack --private --source=. --remote=origin --push

# 5. Rodar app
npm install
npm run dev
```

## Estrutura das 3 camadas (AC1)

| Camada | Tecnologia | Arquivos |
|--------|------------|----------|
| Front-end | Next.js + TypeScript | `app/`, `components/` |
| Back-end | lib + Supabase API | `lib/data.ts`, `lib/supabase.ts` |
| Banco de dados | PostgreSQL (Supabase) | `supabase/migrations/` |
