import type {
  EvolucaoPeso,
  PessoaComUltimoPeso,
  PessoaCreate,
  PessoaResponse,
  RegistroPesoResponse,
} from './types'

const API_BASE = import.meta.env.DEV ? '/api' : '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || res.statusText)
  }
  return res.json()
}

export const api = {
  pessoas: {
    list: () => request<PessoaComUltimoPeso[]>('/pessoas'),
    get: (id: number) => request<PessoaComUltimoPeso>(`/pessoas/${id}`),
    create: (data: PessoaCreate) =>
      request<PessoaResponse>('/pessoas', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  peso: {
    historico: (pessoaId: number) =>
      request<EvolucaoPeso[]>(`/pessoas/${pessoaId}/peso`),
    registrar: (pessoaId: number, peso: number, data?: string) =>
      request<RegistroPesoResponse>(`/pessoas/${pessoaId}/peso`, {
        method: 'POST',
        body: JSON.stringify({ peso, ...(data && { data }) }),
      }),
  },
}
