# backend/main.py
from fastapi import FastAPI
from backend import models
from backend.database import engine
from backend.routers import user, recipe, stats
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://frontend-b1amn14j8-chamudikas-projects.vercel.app",
        "https://recipe-3bgj948xz-chamudikas-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(recipe.router)
app.include_router(stats.router)

