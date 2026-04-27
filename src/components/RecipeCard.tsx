import { Heart, Clock, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import type { Recipe } from "../types";

// Updated properties to accept "Like" status and handler from the parent
interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  isLiked: boolean; // New: Derived from global app state
  onSave: (recipe: Recipe) => void;
  onLike: (recipeId: string) => void; // New: Triggers the persistent Supabase update
}

/**
 * Premium Recipe Card component.
 * Local 'liked' state has been removed to ensure the heart icon accurately
 * reflects the persistent data in our Supabase 'likes' table.
 */
const RecipeCard = ({ recipe, isSaved, isLiked, onSave, onLike }: RecipeCardProps) => {
  return (
    <Link 
      to={`/recipe/${recipe.id}`}
      className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 transition-all hover:border-zinc-700 hover:shadow-2xl hover:shadow-rose-500/10 block"
    >
      {/* Top Media Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={recipe.image_url} 
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-zinc-950/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-100 border border-zinc-700">
          {recipe.category}
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Like Toggle: Now fully driven by global state via props */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLike(recipe.id);
            }}
            className={`p-2.5 backdrop-blur-md rounded-full border transition-all active:scale-95 duration-300 ${
              isLiked 
                ? "bg-rose-500/20 text-rose-500 border-rose-500/50" 
                : "bg-zinc-950/60 text-zinc-300 border-zinc-700 hover:text-rose-500 hover:bg-rose-500/10"
            }`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-pulse" : ""} />
          </button>

          {/* Save Toggle */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSave(recipe);
            }}
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

        <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-tight">
            <Clock size={14} className="text-rose-500" />
            {recipe.cook_time}
          </div>
          {/* Live Like Count: Now updating in real-time as the database changes */}
          <div className={`text-xs font-bold uppercase tracking-tight transition-colors duration-300 ${isLiked ? 'text-rose-500' : 'text-zinc-400'}`}>
            {recipe.likes_count} Likes
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
