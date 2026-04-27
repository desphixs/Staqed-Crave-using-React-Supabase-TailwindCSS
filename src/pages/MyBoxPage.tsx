import { useState, useEffect } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../types";

interface MyBoxPageProps {
  likedRecipeIds: Set<string>;
  onLike: (recipeId: string) => void;
  // We still take syncSave to update the parent's Set so the Feed knows we unsaved here
  syncSave: (recipeId: string, isSaved: boolean) => void;
}

const MyBoxPage = ({ likedRecipeIds, onLike, syncSave }: MyBoxPageProps) => {
  const { user } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // FETCH WITH JOIN: Get the save record AND the recipe data in one go
        const { data, error } = await supabase
          .from("saved_recipes")
          .select(`
            recipe_id,
            recipes (*, likes(count))
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          // Format the joined data into our clean Recipe objects
          const formatted = data.map((item: any) => ({
            ...item.recipes,
            likes_count: item.recipes.likes[0]?.count || 0
          }));
          setSavedRecipes(formatted);
        }
      } catch (err) {
        console.error("Error fetching box:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, [user]);

  const handleUnsave = async (recipe: Recipe) => {
    if (!user) return;

    // 1. Optimistic Update: Remove from local list immediately
    setSavedRecipes(prev => prev.filter(r => r.id !== recipe.id));
    
    // 2. Sync with Parent: Tell App.tsx to remove it from the global Set
    syncSave(recipe.id, false);

    // 3. Database Update
    try {
      await supabase
        .from("saved_recipes")
        .delete()
        .match({ user_id: user.id, recipe_id: recipe.id });
    } catch (err) {
      console.error("Error unsaving:", err);
      // Rollback if needed...
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-zinc-500">
        <Loader2 size={40} className="animate-spin mb-4 text-rose-500" />
        <p className="font-medium animate-pulse">Opening your recipe box...</p>
      </div>
    );
  }

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
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-500">
            <Bookmark size={32} />
          </div>
          <p className="text-2xl font-bold text-zinc-400 mb-2">Your box is empty.</p>
          <p className="text-zinc-600 mb-8 max-w-md mx-auto small text-sm">Go explore the feed and bookmark your favorite recipes to see them here.</p>
          <Link 
            to="/"
            className="inline-block bg-zinc-100 text-zinc-900 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95"
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
              onSave={() => handleUnsave(recipe)}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBoxPage;
