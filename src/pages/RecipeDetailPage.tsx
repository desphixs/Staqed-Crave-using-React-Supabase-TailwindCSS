import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { Heart, Bookmark, Clock, ChevronLeft, Loader2, ChefHat, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Recipe } from "../types";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch the recipe with its like count
        const { data, error: fetchError } = await supabase
          .from("recipes")
          .select("*, likes(count)")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          const formatted = {
            ...data,
            likes_count: data.likes[0]?.count || 0
          };
          setRecipe(formatted);
          
          // 2. If logged in, check if user likes/saved this specific recipe
          if (user) {
            const [likeCheck, saveCheck] = await Promise.all([
              supabase.from("likes").select("id").match({ user_id: user.id, recipe_id: id }).single(),
              supabase.from("saved_recipes").select("id").match({ user_id: user.id, recipe_id: id }).single()
            ]);
            
            setIsLiked(!!likeCheck.data);
            setIsSaved(!!saveCheck.data);
          }
        }
      } catch (err: any) {
        console.error("Error fetching recipe:", err);
        setError(err.message || "Recipe not found");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const newLikedState = !isLiked;
    // Optimistic UI
    setIsLiked(newLikedState);
    if (recipe) {
      setRecipe({
          ...recipe,
          likes_count: (recipe.likes_count || 0) + (newLikedState ? 1 : -1)
      });
    }

    try {
      if (newLikedState) {
        await supabase.from("likes").insert({ user_id: user.id, recipe_id: id });
      } else {
        await supabase.from("likes").delete().match({ user_id: user.id, recipe_id: id });
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    try {
      if (newSavedState) {
        await supabase.from("saved_recipes").insert({ user_id: user.id, recipe_id: id });
      } else {
        await supabase.from("saved_recipes").delete().match({ user_id: user.id, recipe_id: id });
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-zinc-500 bg-zinc-950">
        <Loader2 className="animate-spin mb-4 text-rose-500" size={48} />
        <p className="font-bold tracking-widest uppercase text-xs">Simmering your dish...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-zinc-500 bg-zinc-950 p-4">
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Oups! Recipe Missing</h2>
        <p className="mb-8 text-zinc-500 font-medium">{error || "We couldn't find the culinary masterpiece you're looking for."}</p>
        <Link to="/" className="bg-rose-500 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs">
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-20">
      {/* Top Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-rose-500 transition-colors font-bold uppercase tracking-widest text-[10px]">
          <ChevronLeft size={16} /> Back to Discover
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Image Hero */}
          <div className="relative group">
             <div className="absolute inset-0 bg-rose-500/10 blur-[100px] rounded-full -z-10 opacity-50"></div>
             <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-zinc-800 shadow-2xl">
               <img 
                 src={recipe.image_url} 
                 alt={recipe.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
             </div>
             <div className="absolute top-6 left-6 bg-zinc-950/80 backdrop-blur-md border border-zinc-700/50 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-500">
               {recipe.category}
             </div>
          </div>

          {/* Right Column: Hero Content & Controls */}
          <div className="flex flex-col h-full">
            <div className="mb-8">
               <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 leading-none">
                 {recipe.title}
               </h1>
               <div className="flex items-center gap-3 text-zinc-500">
                  <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-rose-500">
                    <ChefHat size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest">Master Chef</p>
                    <p className="text-sm font-medium text-zinc-300">{recipe.chef}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl text-center">
                <Clock className="mx-auto mb-2 text-rose-500" size={20} />
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cook Time</p>
                <p className="font-bold">{recipe.cook_time}</p>
              </div>
              <div className={`bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl text-center transition-colors ${isLiked ? 'border-rose-500/50 bg-rose-500/5' : ''}`}>
                <Heart className={`mx-auto mb-2 ${isLiked ? 'text-rose-500' : 'text-zinc-500'}`} size={20} fill={isLiked ? "currentColor" : "none"} />
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Appreciation</p>
                <p className="font-bold">{recipe.likes_count} Likes</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl text-center">
                <div className="mx-auto mb-2 text-zinc-500">
                  <Share2 size={20} />
                </div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Share</p>
                <p className="font-bold text-xs">Recipe Link</p>
              </div>
            </div>

            <div className="flex gap-4 mb-12">
              <button 
                onClick={handleLike}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 ${
                  isLiked 
                    ? "bg-rose-500/20 text-rose-500 border border-rose-500/50" 
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-rose-500/50 hover:text-rose-500"
                }`}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                {isLiked ? "Recipe Liked" : "Like Recipe"}
              </button>
              
              <button 
                onClick={handleSave}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 ${
                  isSaved 
                    ? "bg-amber-500/20 text-amber-500 border border-amber-500/50" 
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-amber-500/50 hover:text-amber-500"
                }`}
              >
                <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                {isSaved ? "Saved to Box" : "Save to Box"}
              </button>
            </div>

            {/* Recipe Content Section */}
            <div className="border-t border-zinc-800 pt-10">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 underline decoration-rose-500 decoration-4 underline-offset-8">
                Execution Steps
              </h2>
              <div className="prose prose-invert prose-zinc max-w-none prose-h3:uppercase prose-h3:tracking-widest prose-h3:text-xs prose-p:text-zinc-400 prose-li:text-zinc-400">
                {recipe.steps ? (
                   <ReactMarkdown>{recipe.steps}</ReactMarkdown>
                ) : (
                  <p className="italic text-zinc-600">The secret instructions for this masterpiece are hidden in the chef's vault.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeDetailPage;
