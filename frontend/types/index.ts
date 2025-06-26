export interface Recipe {
  id: number;
  title: string;
  description?: string;
  user_id: number;
  vote_count: number;
}

export interface Vote {
  id: number;
  user_id: number;
  recipe_id: number;
  vote_type: 'upvote' | 'downvote';
  created_at: string;
}

export interface VoteStats {
  recipe_id: number;
  total_votes: number;
  upvotes: number;
  downvotes: number;
} 