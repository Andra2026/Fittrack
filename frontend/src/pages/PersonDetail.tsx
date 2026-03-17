import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { api } from '../api/client'
import type { PessoaComUltimoPeso, EvolucaoPeso } from '../api/types'

function formatDate(s: string) {
  return new Date(s + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

export default function PersonDetail() {
  const { id } = useParams<{ id: string }>()
  const [pessoa, setPessoa] = useState<PessoaComUltimoPeso | null>(null)
  const [historico, setHistorico] = useState<EvolucaoPeso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [peso, setPeso] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const [p, h] = await Promise.all([
        api.pessoas.get(Number(id)),
        api.peso.historico(Number(id)),
      ])
      setPessoa(p)
      setHistorico(h)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const p = parseFloat(peso.replace(',', '.'))
    if (!id || isNaN(p) || p <= 0) return
    setSubmitting(true)
    try {
      await api.peso.registrar(Number(id), p)
      setPeso('')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar peso')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !pessoa) {
    return (
      <div style={styles.center}>
        {error ? (
          <p style={styles.error}>{error}</p>
        ) : (
          <p style={styles.muted}>Carregando...</p>
        )}
      </div>
    )
  }

  const chartData = historico.map((x) => ({
    data: formatDate(x.data),
    peso: x.peso,
    imc: x.imc ?? 0,
  }))

  return (
    <div>
      <Link to="/" style={styles.back}>← Voltar</Link>

      <h1 style={styles.title}>{pessoa.nome}</h1>
      <p style={styles.meta}>
        {pessoa.idade} anos · {pessoa.altura} m
        {pessoa.ultimo_peso != null && (
          <> · Último peso: <strong>{pessoa.ultimo_peso} kg</strong></>
        )}
        {pessoa.ultimo_imc != null && (
          <> · IMC: <strong>{pessoa.ultimo_imc}</strong></>
        )}
      </p>

      {error && (
        <div style={styles.errorBox}>{error}</div>
      )}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Registrar peso</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Peso (kg), ex: 72.5"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.btnPrimary} disabled={submitting}>
            {submitting ? 'Salvando...' : 'Registrar'}
          </button>
        </form>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Evolução do peso</h2>
        {historico.length === 0 ? (
          <p style={styles.muted}>Nenhum registro ainda. Adicione um peso acima.</p>
        ) : (
          <div style={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="data" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                  }}
                  labelStyle={{ color: 'var(--text)' }}
                  formatter={(value: number) => [value, '']}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="peso"
                  name="Peso (kg)"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--accent)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  center: { textAlign: 'center', padding: '2rem' },
  back: { color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' },
  title: { margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: 600 },
  meta: { color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' },
  errorBox: {
    padding: '0.75rem 1rem',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid var(--danger)',
    borderRadius: 'var(--radius)',
    color: '#fca5a5',
    marginBottom: '1rem',
  },
  section: { marginBottom: '2rem' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' },
  form: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  input: {
    padding: '0.6rem 0.9rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    fontSize: '0.95rem',
    minWidth: 180,
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
  chartWrap: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1rem',
  },
  muted: { color: 'var(--text-muted)' },
  error: { color: 'var(--danger)' },
}
