import { useState } from "react";
import { Heart, Clock, Bookmark } from "lucide-react";
import type { Recipe } from "../types";

// Properties for the RecipeCard
interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  onSave: (recipe: Recipe) => void;
}

/**
 * The standard card display for a recipe.
 * Now updated to use snake_case properties from the Supabase database.
 */
const RecipeCard = ({ recipe, isSaved, onSave }: RecipeCardProps) => {
  // Local state for the "Like" button (purely visual for now)
  const [liked, setLiked] = useState(false);

  // Toggle the like status
  const handleLike = () => setLiked(!liked);

  // Calculate likes based on base count + local interaction
  const currentLikes = liked ? recipe.likes_count + 1 : recipe.likes_count;

  return (
    <div className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 transition-all hover:border-zinc-700 hover:shadow-2xl hover:shadow-rose-500/10">
      {/* Top Media Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={recipe.image_url} // Changed from imageUrl to image_url
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Floating Category Tag */}
        <div className="absolute top-4 left-4 bg-zinc-950/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-100 border border-zinc-700">
          {recipe.category}
        </div>
        
        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Like Toggle */}
          <button 
            onClick={handleLike}
            className={`p-2.5 backdrop-blur-md rounded-full border transition-all active:scale-95 duration-300 ${
              liked 
                ? "bg-rose-500/20 text-rose-500 border-rose-500/50" 
                : "bg-zinc-950/60 text-zinc-300 border-zinc-700 hover:text-rose-500 hover:bg-rose-500/10"
            }`}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} className={liked ? "animate-pulse" : ""} />
          </button>

          {/* Save Toggle */}
          <button 
            onClick={() => onSave(recipe)}
            className={`p-2.5 backdrop-blur-md rounded-full border transition-all active:scale-95 duration-300 ${
              isSaved 
                ? "bg-amber-500/20 text-amber-500 border-amber-500/50" 
                : "bg-zinc-950/60 text-zinc-300 border-zinc-700 hover:text-amber-500 hover:bg-amber-500/10"
            }`}
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-zinc-100 group-hover:text-rose-100 transition-colors">
              {recipe.title}
            </h3>
            <p className="text-sm text-zinc-500 font-medium italic">by {recipe.chef}</p>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-tight">
            <Clock size={14} className="text-rose-500" />
            {recipe.cook_time} {/* Changed from cookTime to cook_time */}
          </div>
          <div className={`text-xs font-bold uppercase tracking-tight transition-colors duration-300 ${liked ? 'text-rose-500' : 'text-zinc-400'}`}>
            {currentLikes} Likes
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
