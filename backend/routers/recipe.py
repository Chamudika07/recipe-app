from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..dependencies import get_db, get_current_user

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.post("/", response_model=schemas.RecipeOut)
def create_recipe(
    recipe: schemas.RecipeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "chef":
        raise HTTPException(status_code=403, detail="Only chefs can create recipes")
    
    new_recipe = models.Recipe(
        title=recipe.title,
        description=recipe.description,
        user_id=current_user.id
    )
    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)
    return new_recipe

@router.get("/", response_model=list[schemas.RecipeOut])
def get_all_recipes(db: Session = Depends(get_db)):
    return db.query(models.Recipe).all()

@router.get("/{recipe_id}", response_model=schemas.RecipeOut)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe
