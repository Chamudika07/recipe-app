from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    role = Column(String)  # "chef" or "visitor"

    recipes = relationship("Recipe", back_populates="owner")
    votes = relationship("Vote", back_populates="user")

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))
    vote_count = Column(Integer, default=0)  # Total vote count

    owner = relationship("User", back_populates="recipes")
    votes = relationship("Vote", back_populates="recipe")

class Vote(Base):
    __tablename__ = "votes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    vote_type = Column(String)  # "upvote" or "downvote"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="votes")
    recipe = relationship("Recipe", back_populates="votes")
