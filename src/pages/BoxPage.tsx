import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../types";

interface BoxPageProps {
  savedRecipes: Recipe[];
  likedRecipeIds: Set<string>;
  onSave: (recipe: Recipe) => void;
  onLike: (recipeId: string) => void;
}

const BoxPage = ({ savedRecipes, likedRecipeIds, onSave, onLike }: BoxPageProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[70vh]">
      <header className="mb-16">
        <div className="flex items-center gap-4 mb-4">
           <div className="p-3 bg-amber-500 text-zinc-900 rounded-2xl">
              <Bookmark size={24} fill="currentColor" />
           </div>
           <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">My Recipe Box</h1>
        </div>
        <p className="text-zinc-500 text-lg max-w-2xl font-medium">
          Your curated collection of saved culinary masterpieces. Ready for your next kitchen adventure.
        </p>
      </header>

      {savedRecipes.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-500">
            <Bookmark size={32} />
          </div>
          <p className="text-2xl font-bold text-zinc-400 mb-2">Your box is empty.</p>
          <p className="text-zinc-600 mb-8 max-w-md mx-auto small">Go explore the feed and bookmark your favorite recipes to see them here.</p>
          <Link 
            to="/"
            className="inline-block bg-zinc-100 text-zinc-900 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
          >
            Back to Feed
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {savedRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              isSaved={true}
              isLiked={likedRecipeIds.has(recipe.id)}
              onSave={onSave}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoxPage;
