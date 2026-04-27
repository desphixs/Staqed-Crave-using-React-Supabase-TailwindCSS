import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";
import MyBoxPage from "./pages/MyBoxPage";
import ProtectedRoute from "./components/ProtectedRoute";
import type { Recipe } from "./types";

const App = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const [likedRecipeIds, setLikedRecipeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch recipes and like counts
        const { data, error } = await supabase
          .from("recipes")
          .select("*, likes(count)") 
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedRecipes = data.map((r: any) => ({
            ...r,
            likes_count: r.likes[0]?.count || 0
          }));
          setRecipes(formattedRecipes);
        }

        if (user) {
          // Fetch likes
          const { data: likesData } = await supabase
            .from("likes")
            .select("recipe_id")
            .eq("user_id", user.id);

          if (likesData) setLikedRecipeIds(new Set(likesData.map(l => l.recipe_id)));

          // Fetch saved recipes
          const { data: savesData } = await supabase
            .from("saved_recipes")
            .select("recipe_id")
            .eq("user_id", user.id);

          if (savesData) setSavedRecipeIds(new Set(savesData.map(s => s.recipe_id)));
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLike = async (recipeId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const isLiked = likedRecipeIds.has(recipeId);
    
    setLikedRecipeIds(prev => {
      const next = new Set(prev);
      isLiked ? next.delete(recipeId) : next.add(recipeId);
      return next;
    });

    setRecipes(prev => prev.map(r => 
      r.id === recipeId 
        ? { ...r, likes_count: (r.likes_count || 0) + (isLiked ? -1 : 1) }
        : r
    ));

    try {
      if (isLiked) {
        await supabase.from("likes").delete().match({ user_id: user.id, recipe_id: recipeId });
      } else {
        await supabase.from("likes").insert({ user_id: user.id, recipe_id: recipeId });
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleSave = async (recipe: Recipe) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const isSaved = savedRecipeIds.has(recipe.id);
    
    // OPTIMISTIC UPDATE
    setSavedRecipeIds(prev => {
      const next = new Set(prev);
      isSaved ? next.delete(recipe.id) : next.add(recipe.id);
      return next;
    });

    try {
      if (isSaved) {
        await supabase.from("saved_recipes").delete().match({ user_id: user.id, recipe_id: recipe.id });
      } else {
        await supabase.from("saved_recipes").insert({ user_id: user.id, recipe_id: recipe.id });
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  // Helper for MyBoxPage to update global Set when unsaving
  const syncSave = (recipeId: string, isSaved: boolean) => {
    setSavedRecipeIds(prev => {
      const next = new Set(prev);
      isSaved ? next.add(recipeId) : next.delete(recipeId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<FeedPage recipes={recipes} loading={loading} savedRecipeIds={savedRecipeIds} likedRecipeIds={likedRecipeIds} onSave={handleSave} onLike={handleLike} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-box" element={<ProtectedRoute><MyBoxPage likedRecipeIds={likedRecipeIds} onLike={handleLike} syncSave={syncSave} /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
