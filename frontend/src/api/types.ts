export interface PessoaCreate {
  nome: string
  idade: number
  altura: number
}

export interface PessoaResponse {
  id: number
  nome: string
  idade: number
  altura: number
  created_at?: string
}

export interface PessoaComUltimoPeso extends PessoaResponse {
  ultimo_peso: number | null
  ultimo_imc: number | null
  data_ultimo_peso: string | null
}

export interface RegistroPesoCreate {
  peso: number
  data?: string
}

export interface RegistroPesoResponse {
  id: number
  pessoa_id: number
  peso: number
  data: string
  imc: number | null
}

export interface EvolucaoPeso {
  data: string
  peso: number
  imc: number | null
}
