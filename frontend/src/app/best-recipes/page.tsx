'use client';

import { useState, useEffect } from 'react';
import VoteButtons from '@/components/VoteButtons';
import { Recipe } from '../../../types';
import Link from 'next/link';

export default function BestRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    fetchBestRecipes();
  }, []);

  const fetchBestRecipes = async () => {
    try {
      const res = await fetch('http://localhost:8000/recipes/best?limit=20', {
        cache: 'no-store',
      });
      const data: Recipe[] = await res.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching best recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteChange = (recipeId: number, newVoteCount: number) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId
          ? { ...recipe, vote_count: newVoteCount }
          : recipe
      ).sort((a, b) => b.vote_count - a.vote_count) // Re-sort after vote change
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading best recipes...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🏆 Best Recipes</h1>
          <p className="text-gray-600 mt-2">Top-rated recipes by our community</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/recipes"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View All Recipes
          </Link>
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
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No recipes found.</p>
          <Link
            href="/recipess/add"
            className="inline-block mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add First Recipe
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, index) => (
            <div key={recipe.id} className="border rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <h2 className="text-lg font-semibold">{recipe.title}</h2>
                </div>
                <div className="text-sm text-gray-500">
                  {recipe.vote_count} votes
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {recipe.description || "No description available"}
              </p>
              
              <VoteButtons
                recipe={recipe}
                onVoteChange={(newVoteCount) => handleVoteChange(recipe.id, newVoteCount)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 