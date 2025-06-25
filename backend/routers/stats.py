# backend/routers/stats.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models
from ..dependencies import get_db
from sqlalchemy import func

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("/best-chef")
def get_best_chef(db: Session = Depends(get_db)):
    result = (
        db.query(models.User.email, func.count(models.Recipe.id).label("recipe_count"))
        .join(models.Recipe, models.User.id == models.Recipe.user_id)
        .filter(models.User.role == "chef")
        .group_by(models.User.email)
        .order_by(func.count(models.Recipe.id).desc())
        .first()
    )
    if result:
        return {"email": result[0], "recipes": result[1]}
    return {"email": None, "recipes": 0}

@router.get("/best-recipe")
def get_best_recipe(db: Session = Depends(get_db)):
    # For now, just return the first one (you can later add likes/votes)
    recipe = db.query(models.Recipe).first()
    if recipe:
        return {"title": recipe.title, "description": recipe.description}
    return {"title": None, "description": None}
