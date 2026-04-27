import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Heart, 
  Bookmark, 
  Loader2, 
  ChefHat, 
  Clock, 
  BarChart3,
  ExternalLink
} from "lucide-react";
import type { Recipe } from "../types";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRecipes = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Fetching recipes along with counts from both join tables
      const { data, error: fetchError } = await supabase
        .from("recipes")
        .select(`
          *,
          likes(count),
          saved_recipes(count)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      if (data) {
        const formatted = data.map((r: any) => ({
          ...r,
          likes_count: r.likes[0]?.count || 0,
          saves_count: r.saved_recipes[0]?.count || 0
        }));
        setRecipes(formatted);
      }
    } catch (err: any) {
      console.error("Dashboard Fetch Error:", err);
      setError("Failed to load your kitchen stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRecipes();
  }, [user]);

  const handleDelete = async (recipeId: string, title: string) => {
    const confirmed = window.confirm(`Delete "${title}"? This action cannot be undone.`);
    if (confirmed) {
      try {
        const { error: deleteError } = await supabase
          .from("recipes")
          .delete()
          .eq("id", recipeId);

        if (deleteError) throw deleteError;
        
        // Optimistically update local state
        setRecipes(prev => prev.filter(r => r.id !== recipeId));
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete recipe.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-zinc-500 bg-zinc-950">
        <Loader2 className="animate-spin mb-4 text-rose-500" size={48} />
        <p className="font-bold tracking-widest uppercase text-xs">Opening your kitchen...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-500 text-[10px] font-black uppercase tracking-widest mb-4">
              <ChefHat size={12} /> Executive Chef Dashboard
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              My <span className="text-zinc-500">Kitchen.</span>
            </h1>
            <p className="text-zinc-500 font-medium mt-4 max-w-md">
              Manage your published masterpieces and track their impact on the community.
            </p>
          </div>

          <Link 
            to="/create"
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-rose-500/10"
          >
            <Plus size={18} />
            Create New Recipe
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm font-bold mb-8">
            {error}
          </div>
        )}

        {/* Recipes Grid */}
        {recipes.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-zinc-900 rounded-[3rem]">
             <Utensils className="mx-auto mb-6 text-zinc-800" size={64} />
             <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-700">Kitchen is Empty</h2>
             <p className="text-zinc-500 mb-8 font-medium">You haven't published any recipes yet.</p>
             <Link to="/create" className="text-rose-500 font-bold uppercase tracking-widest text-[10px] hover:underline underline-offset-8">
               Start your first masterpiece
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map(recipe => (
              <div 
                key={recipe.id}
                className="group bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden transition-all hover:border-zinc-700"
              >
                {/* Thumbnail */}
                <div className="relative h-48">
                   <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" />
                   <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-100 border border-zinc-700">
                     {recipe.category}
                   </div>
                </div>

                <div className="p-8">
                   <h3 className="text-xl font-bold mb-2 uppercase tracking-tight line-clamp-1">{recipe.title}</h3>
                   <div className="flex items-center gap-3 text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">
                     <Clock size={14} /> {recipe.cook_time}
                   </div>

                   {/* Stats Bar */}
                   <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-zinc-950/50 border border-zinc-800/50 p-3 rounded-2xl flex flex-col items-center">
                       <Heart size={14} className="text-rose-500 mb-1" fill="currentColor" />
                       <span className="text-sm font-black">{recipe.likes_count}</span>
                       <span className="text-[8px] uppercase tracking-tighter text-zinc-500">Likes</span>
                     </div>
                     <div className="bg-zinc-950/50 border border-zinc-800/50 p-3 rounded-2xl flex flex-col items-center">
                       <Bookmark size={14} className="text-amber-500 mb-1" fill="currentColor" />
                       <span className="text-sm font-black text-white">{recipe.saves_count}</span>
                       <span className="text-[8px] uppercase tracking-tighter text-zinc-500">Saves</span>
                     </div>
                   </div>

                   {/* Controls */}
                   <div className="grid grid-cols-2 gap-3">
                     <Link 
                       to={`/recipe/${recipe.id}/edit`}
                       className="flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-[9px] hover:bg-zinc-700 hover:text-white transition-all"
                     >
                       <Edit3 size={14} /> Edit
                     </Link>
                     <button 
                       onClick={() => handleDelete(recipe.id, recipe.title)}
                       className="flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/5 text-rose-500/50 border border-rose-500/10 font-bold uppercase tracking-widest text-[9px] hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                     >
                       <Trash2 size={14} /> Delete
                     </button>
                     <Link 
                       to={`/recipe/${recipe.id}`}
                       className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-950 text-zinc-500 font-bold uppercase tracking-widest text-[9px] hover:text-zinc-100 transition-all border border-zinc-800"
                     >
                       <ExternalLink size={14} /> View Public Page
                     </Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Internal icon for empty state
const Utensils = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

export default DashboardPage;
