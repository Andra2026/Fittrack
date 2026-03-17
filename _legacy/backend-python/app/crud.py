from datetime import date
from typing import List, Optional

from sqlalchemy.orm import Session

from . import models, schemas


def _calcular_imc(peso: float, altura: float) -> float:
    return round(peso / (altura * altura), 2)


def criar_pessoa(db: Session, p: schemas.PessoaCreate) -> models.Pessoa:
    pessoa = models.Pessoa(nome=p.nome, idade=p.idade, altura=p.altura)
    db.add(pessoa)
    db.commit()
    db.refresh(pessoa)
    return pessoa


def listar_pessoas(db: Session) -> List[models.Pessoa]:
    return db.query(models.Pessoa).order_by(models.Pessoa.id).all()


def obter_pessoa(db: Session, pessoa_id: int) -> Optional[models.Pessoa]:
    return db.query(models.Pessoa).filter(models.Pessoa.id == pessoa_id).first()


def criar_registro_peso(
    db: Session, pessoa_id: int, peso: float, data_registro: Optional[date] = None
) -> Optional[models.RegistroPeso]:
    pessoa = obter_pessoa(db, pessoa_id)
    if not pessoa:
        return None
    data_registro = data_registro or date.today()
    imc = _calcular_imc(peso, pessoa.altura)
    registro = models.RegistroPeso(
        pessoa_id=pessoa_id, peso=peso, data=data_registro, imc=imc
    )
    db.add(registro)
    db.commit()
    db.refresh(registro)
    return registro


def listar_historico_peso(
    db: Session, pessoa_id: int
) -> List[tuple]:
    """Retorna lista de (data, peso, imc) ordenada por data para o gráfico."""
    pessoa = obter_pessoa(db, pessoa_id)
    if not pessoa:
        return []
    registros = (
        db.query(models.RegistroPeso)
        .filter(models.RegistroPeso.pessoa_id == pessoa_id)
        .order_by(models.RegistroPeso.data)
        .all()
    )
    return [(r.data, r.peso, r.imc) for r in registros]
