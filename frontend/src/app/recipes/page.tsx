// src/app/recipes/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import VoteButtons from '@/components/VoteButtons';
import { Recipe } from '../../../types';
import Link from 'next/link';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBestOnly, setShowBestOnly] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchRecipes = useCallback(async () => {
    try {
      const endpoint = showBestOnly ? '/recipes/best' : '/recipes';
      const res = await fetch(`https://recipe-app-backend-58c0e88c485c.herokuapp.com${endpoint}`, {
        cache: 'no-store',
      });
      const data: Recipe[] = await res.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [showBestOnly]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    fetchRecipes();
  }, [fetchRecipes]);

  const handleVoteChange = (recipeId: number, newVoteCount: number) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId
          ? { ...recipe, vote_count: newVoteCount }
          : recipe
      )
    );
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {showBestOnly ? 'Best Recipes' : 'All Recipes'}
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowBestOnly(!showBestOnly)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showBestOnly ? 'Show All Recipes' : 'Show Best Recipes'}
          </button>
          {!isAuthenticated && (
            <Link
              href="/login"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Login to Vote
            </Link>
          )}
        </div>
      </div>

      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            💡 <strong>Tip:</strong> Login to vote on recipes and help determine the best ones!
          </p>
        </div>
      )}

      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes found.</p>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{recipe.title}</h2>
                  <p className="text-sm text-gray-700 mt-1">
                    {recipe.description || "No description"}
                  </p>
                </div>
                <div className="ml-4">
                  <VoteButtons
                    recipe={recipe}
                    onVoteChange={(newVoteCount) => handleVoteChange(recipe.id, newVoteCount)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
