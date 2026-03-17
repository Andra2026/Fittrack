from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship

from .database import Base


class Pessoa(Base):
    __tablename__ = "pessoas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    idade = Column(Integer, nullable=False)
    altura = Column(Float, nullable=False)  # metros
    created_at = Column(DateTime, default=datetime.utcnow)

    registros_peso = relationship("RegistroPeso", back_populates="pessoa", order_by="RegistroPeso.data")


class RegistroPeso(Base):
    __tablename__ = "registros_peso"

    id = Column(Integer, primary_key=True, index=True)
    pessoa_id = Column(Integer, ForeignKey("pessoas.id"), nullable=False)
    peso = Column(Float, nullable=False)  # kg
    data = Column(Date, nullable=False, default=date.today)
    imc = Column(Float, nullable=True)  # calculado: peso / (altura * altura)

    pessoa = relationship("Pessoa", back_populates="registros_peso")
