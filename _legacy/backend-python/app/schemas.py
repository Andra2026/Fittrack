from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel


class PessoaCreate(BaseModel):
    nome: str
    idade: int
    altura: float  # metros


class PessoaResponse(BaseModel):
    id: int
    nome: str
    idade: int
    altura: float
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PessoaComUltimoPeso(PessoaResponse):
    ultimo_peso: Optional[float] = None
    ultimo_imc: Optional[float] = None
    data_ultimo_peso: Optional[date] = None


class RegistroPesoCreate(BaseModel):
    peso: float
    data: Optional[date] = None  # default hoje no backend


class RegistroPesoResponse(BaseModel):
    id: int
    pessoa_id: int
    peso: float
    data: date
    imc: Optional[float] = None

    class Config:
        from_attributes = True


class EvolucaoPeso(BaseModel):
    """Um ponto do gráfico: data + peso (+ imc opcional)."""
    data: date
    peso: float
    imc: Optional[float] = None
