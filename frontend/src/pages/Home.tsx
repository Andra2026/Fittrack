import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { PessoaComUltimoPeso } from '../api/types'

export default function Home() {
  const [pessoas, setPessoas] = useState<PessoaComUltimoPeso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [altura, setAltura] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.pessoas.list()
      setPessoas(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar pessoas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const i = parseInt(idade, 10)
    const a = parseFloat(altura.replace(',', '.'))
    if (!nome.trim() || isNaN(i) || isNaN(a) || a <= 0) return
    setSubmitting(true)
    try {
      await api.pessoas.create({ nome: nome.trim(), idade: i, altura: a })
      setNome('')
      setIdade('')
      setAltura('')
      setShowForm(false)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.center}>
        <p style={styles.muted}>Carregando...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={styles.top}>
        <h1 style={styles.title}>Pessoas</h1>
        <button
          type="button"
          style={styles.btn}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancelar' : '+ Nova pessoa'}
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            style={styles.input}
            min={1}
            max={150}
            required
          />
          <input
            type="text"
            placeholder="Altura (m), ex: 1.75"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.btnPrimary} disabled={submitting}>
            {submitting ? 'Salvando...' : 'Cadastrar'}
          </button>
        </form>
      )}

      {pessoas.length === 0 && !showForm ? (
        <p style={styles.muted}>Nenhuma pessoa cadastrada. Adicione a primeira acima.</p>
      ) : (
        <ul style={styles.list}>
          {pessoas.map((p) => (
            <li key={p.id} style={styles.card}>
              <Link to={`/pessoa/${p.id}`} style={styles.cardLink}>
                <span style={styles.cardNome}>{p.nome}</span>
                <span style={styles.cardMeta}>
                  {p.idade} anos · {p.altura}m
                  {p.ultimo_peso != null && (
                    <> · Último peso: {p.ultimo_peso} kg</>
                  )}
                  {p.ultimo_imc != null && (
                    <> · IMC: {p.ultimo_imc}</>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  center: { textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { margin: 0, fontSize: '1.5rem', fontWeight: 600 },
  btn: {
    padding: '0.5rem 1rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    fontSize: '0.9rem',
  },
  btnPrimary: {
    padding: '0.6rem 1.2rem',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 'var(--radius)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  error: {
    padding: '0.75rem 1rem',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid var(--danger)',
    borderRadius: 'var(--radius)',
    color: '#fca5a5',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    padding: '1.25rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    marginBottom: '1.5rem',
  },
  input: {
    padding: '0.6rem 0.9rem',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    fontSize: '0.95rem',
    minWidth: 140,
  },
  list: { listStyle: 'none', margin: 0, padding: 0 },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    marginBottom: '0.75rem',
    transition: 'background 0.15s',
  },
  cardLink: {
    display: 'block',
    padding: '1rem 1.25rem',
    color: 'inherit',
    textDecoration: 'none',
  },
  cardLink:hover: { textDecoration: 'none' },
  cardNome: { fontWeight: 600, fontSize: '1.05rem' },
  cardMeta: { display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' },
  muted: { color: 'var(--text-muted)' },
}
