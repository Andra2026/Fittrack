# Código legado (referência)

Esta pasta contém o backend FastAPI (Python) e o script de console que foram substituídos pela stack **Next.js + Supabase**.

- **backend-python/** — API REST com SQLite; a lógica de negócio (pessoas, registro de peso, IMC) foi migrada para `lib/data.ts` e para o trigger SQL em `supabase/migrations/`.
- **programa.py** — Script antigo de cadastro por terminal.

O app em produção usa apenas a raiz do projeto (Next.js + Supabase). Para rodar o backend legado: `cd backend-python && pip install -r requirements.txt && uvicorn app.main:app --reload`.
