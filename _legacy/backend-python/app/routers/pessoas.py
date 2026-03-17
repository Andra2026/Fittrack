from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/pessoas", tags=["pessoas"])


@router.post("", response_model=schemas.PessoaResponse)
def criar_pessoa(pessoa: schemas.PessoaCreate, db: Session = Depends(get_db)):
    return crud.criar_pessoa(db, pessoa)


@router.get("", response_model=List[schemas.PessoaComUltimoPeso])
def listar_pessoas(db: Session = Depends(get_db)):
    pessoas = crud.listar_pessoas(db)
    result = []
    for p in pessoas:
        ultimo = p.registros_peso[-1] if p.registros_peso else None
        result.append(
            schemas.PessoaComUltimoPeso(
                id=p.id,
                nome=p.nome,
                idade=p.idade,
                altura=p.altura,
                created_at=p.created_at,
                ultimo_peso=ultimo.peso if ultimo else None,
                ultimo_imc=ultimo.imc if ultimo else None,
                data_ultimo_peso=ultimo.data if ultimo else None,
            )
        )
    return result


@router.get("/{pessoa_id}", response_model=schemas.PessoaComUltimoPeso)
def obter_pessoa(pessoa_id: int, db: Session = Depends(get_db)):
    p = crud.obter_pessoa(db, pessoa_id)
    if not p:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada")
    ultimo = p.registros_peso[-1] if p.registros_peso else None
    return schemas.PessoaComUltimoPeso(
        id=p.id,
        nome=p.nome,
        idade=p.idade,
        altura=p.altura,
        created_at=p.created_at,
        ultimo_peso=ultimo.peso if ultimo else None,
        ultimo_imc=ultimo.imc if ultimo else None,
        data_ultimo_peso=ultimo.data if ultimo else None,
    )
