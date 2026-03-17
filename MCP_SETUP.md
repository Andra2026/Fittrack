# Integração MCP — FitTrack

O projeto usa **MCP (Model Context Protocol)** para conectar as CLIs e fazer alterações direto pelo Cursor.

## Supabase MCP (configurado)

O Supabase MCP está em `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=lcsvndgfbifyhjitlzhb",
      "headers": {}
    }
  }
}
```

### Ferramentas disponíveis

| Ferramenta | Uso |
|------------|-----|
| `apply_migration` | Aplicar DDL (criar tabelas, triggers, etc.) |
| `execute_sql` | Executar SQL (consultas, inserts) |
| `list_migrations` | Listar migrações aplicadas |
| `list_tables` | Listar tabelas do banco |
| `get_project_url` | Obter URL do projeto |
| `get_publishable_keys` | Obter chaves anon/publishable |
| `generate_typescript_types` | Gerar tipos TS do schema |
| `create_branch` / `list_branches` | Branches de migração |

### Exemplo: aplicar migração via MCP

O assistente pode chamar:

```
apply_migration(name: "minha_migracao", query: "CREATE TABLE ...")
```

As migrações AC1 (`create_tables`, `trigger_imc`) já foram aplicadas via MCP.

---

## GitHub MCP (opcional)

Para integrar Git/GitHub via MCP:

1. **Cursor** → Settings → MCP → Add new MCP Server
2. Adicione o **GitHub MCP** (oficial):
   - URL: `https://api.githubcopilot.com/mcp/`
   - Auth: OAuth ou Personal Access Token (scope `repo`)

O GitHub MCP já foi adicionado em `~/.cursor/mcp.json`. Para ativar:

1. Crie um **Personal Access Token** em: https://github.com/settings/tokens  
   - Scopes: `repo`, `read:org` (ou o mínimo necessário)
2. Substitua `COLOQUE_SEU_TOKEN_AQUI` no mcp.json pelo token
3. Reinicie o Cursor para carregar o MCP

---

## Git via terminal

O Git não tem MCP nativo no Cursor. Use o terminal integrado:

```bash
git init
git add .
git commit -m "AC1: cadastro de pessoas"
git remote add origin https://github.com/SEU_USUARIO/fittrack.git
git push -u origin main
```

Ou instale o **Git** (https://git-scm.com) e rode `npm run setup`.
