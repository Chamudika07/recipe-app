'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import { Recipe, VoteStats } from '../../types';

interface VoteButtonsProps {
  recipe: Recipe;
  onVoteChange: (newVoteCount: number) => void;
}

export default function VoteButtons({ recipe, onVoteChange }: VoteButtonsProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [voteStats, setVoteStats] = useState<VoteStats | null>(null);

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      const response = await axios.post(`/recipes/${recipe.id}/vote`, {
        vote_type: voteType,
        recipe_id: recipe.id
      });
      
      // Update the recipe's vote count
      if (response.data.vote_type === 'upvote') {
        onVoteChange(recipe.vote_count + 1);
      } else {
        onVoteChange(recipe.vote_count - 1);
      }
      
      // Fetch updated vote stats
      const statsResponse = await axios.get(`/recipes/${recipe.id}/votes`);
      setVoteStats(statsResponse.data);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleVote('upvote')}
        disabled={isVoting}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        👍 Upvote
      </button>
      
      <span className="font-semibold text-lg">{recipe.vote_count}</span>
      
      <button
        onClick={() => handleVote('downvote')}
        disabled={isVoting}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        👎 Downvote
      </button>
      
      {voteStats && (
        <div className="text-sm text-gray-600 ml-4">
          <span className="text-green-600">+{voteStats.upvotes}</span>
          <span className="mx-1">/</span>
          <span className="text-red-600">-{voteStats.downvotes}</span>
        </div>
      )}
    </div>
  );
} 