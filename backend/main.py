# backend/main.py
from fastapi import FastAPI
import models
from database import engine
from routers import user, recipe, stats
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

@app.get("/")
def read_root():
    return {"message": "Recipe App API is running"}

app.include_router(user.router)
app.include_router(recipe.router)
app.include_router(stats.router)

