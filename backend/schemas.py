# backend/schemas.py
from pydantic import BaseModel
from typing import Optional

class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeOut(RecipeBase):
    id: int
    user_id: int
    class Config:
        orm_mode = True
