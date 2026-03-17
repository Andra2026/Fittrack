from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, get_db, Base
from .models import Pessoa, RegistroPeso
from .routers import pessoas, peso

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FitTrack API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pessoas.router)
app.include_router(peso.router)


@app.get("/")
def root():
    return {"message": "FitTrack API", "docs": "/docs"}
