# backend/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeOut(RecipeBase):
    id: int
    user_id: int
    vote_count: int = 0
    class Config:
        orm_mode = True

class VoteBase(BaseModel):
    vote_type: str  # "upvote" or "downvote"

class VoteCreate(VoteBase):
    recipe_id: int

class VoteOut(VoteBase):
    id: int
    user_id: int
    recipe_id: int
    created_at: datetime
    class Config:
        orm_mode = True
