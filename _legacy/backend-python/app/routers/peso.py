from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/pessoas", tags=["peso"])


@router.post("/{pessoa_id}/peso", response_model=schemas.RegistroPesoResponse)
def registrar_peso(
    pessoa_id: int,
    body: schemas.RegistroPesoCreate,
    db: Session = Depends(get_db),
):
    registro = crud.criar_registro_peso(
        db, pessoa_id, body.peso, body.data
    )
    if not registro:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada")
    return registro


@router.get("/{pessoa_id}/peso", response_model=List[schemas.EvolucaoPeso])
def historico_peso(pessoa_id: int, db: Session = Depends(get_db)):
    historico = crud.listar_historico_peso(db, pessoa_id)
    if not historico and crud.obter_pessoa(db, pessoa_id) is None:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada")
    return [
        schemas.EvolucaoPeso(data=d, peso=peso, imc=imc)
        for d, peso, imc in historico
    ]
