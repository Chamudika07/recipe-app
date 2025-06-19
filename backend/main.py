# main.py
from fastapi import FastAPI
from .database import Base
from backend import models
from .database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Recipe API running!"}
