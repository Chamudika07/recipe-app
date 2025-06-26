from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
import models, schemas
from dependencies import get_db, get_current_user

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
    return db.query(models.Recipe).order_by(desc(models.Recipe.vote_count)).all()

@router.get("/best", response_model=list[schemas.RecipeOut])
def get_best_recipes(db: Session = Depends(get_db), limit: int = 10):
    """Get the top recipes by vote count"""
    return db.query(models.Recipe).order_by(desc(models.Recipe.vote_count)).limit(limit).all()

@router.get("/{recipe_id}", response_model=schemas.RecipeOut)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.post("/{recipe_id}/vote")
def vote_recipe(
    recipe_id: int,
    vote: schemas.VoteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check if recipe exists
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    # Check if user has already voted on this recipe
    existing_vote = db.query(models.Vote).filter(
        models.Vote.user_id == current_user.id,
        models.Vote.recipe_id == recipe_id
    ).first()
    
    if existing_vote:
        # Update existing vote
        if existing_vote.vote_type != vote.vote_type:
            # Change vote type
            if existing_vote.vote_type == "upvote" and vote.vote_type == "downvote":
                recipe.vote_count = recipe.vote_count - 2  # Remove upvote, add downvote
            elif existing_vote.vote_type == "downvote" and vote.vote_type == "upvote":
                recipe.vote_count = recipe.vote_count + 2  # Remove downvote, add upvote
            existing_vote.vote_type = vote.vote_type
        else:
            # Same vote type, remove the vote
            if vote.vote_type == "upvote":
                recipe.vote_count = recipe.vote_count - 1
            else:
                recipe.vote_count = recipe.vote_count + 1
            db.delete(existing_vote)
            db.commit()
            return {"message": "Vote removed"}
    else:
        # Create new vote
        new_vote = models.Vote(
            user_id=current_user.id,
            recipe_id=recipe_id,
            vote_type=vote.vote_type
        )
        db.add(new_vote)
        
        # Update recipe vote count
        if vote.vote_type == "upvote":
            recipe.vote_count = recipe.vote_count + 1
        else:
            recipe.vote_count = recipe.vote_count - 1
    
    db.commit()
    db.refresh(recipe)
    
    if existing_vote:
        db.refresh(existing_vote)
        return existing_vote
    else:
        db.refresh(new_vote)
        return new_vote

@router.get("/{recipe_id}/votes")
def get_recipe_votes(recipe_id: int, db: Session = Depends(get_db)):
    """Get vote statistics for a recipe"""
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    upvotes = db.query(models.Vote).filter(
        models.Vote.recipe_id == recipe_id,
        models.Vote.vote_type == "upvote"
    ).count()
    
    downvotes = db.query(models.Vote).filter(
        models.Vote.recipe_id == recipe_id,
        models.Vote.vote_type == "downvote"
    ).count()
    
    return {
        "recipe_id": recipe_id,
        "total_votes": recipe.vote_count,
        "upvotes": upvotes,
        "downvotes": downvotes
    }
