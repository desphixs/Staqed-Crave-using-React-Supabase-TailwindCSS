import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";
import BoxPage from "./pages/BoxPage";
import ProtectedRoute from "./components/ProtectedRoute";
import type { Recipe } from "./types";

const App = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [likedRecipeIds, setLikedRecipeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // --- POWER QUERY: Fetch recipes AND their real like counts in one go ---
        // We use 'likes(count)' which tells Supabase to look at the likes table 
        // and just return the total number of rows for each recipe.
        const { data, error } = await supabase
          .from("recipes")
          .select("*, likes(count)") 
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          // We transform the data so 'likes_count' is easy to use in our components
          const formattedRecipes = data.map((r: any) => ({
            ...r,
            likes_count: r.likes[0]?.count || 0
          }));
          setRecipes(formattedRecipes);
        }

        if (user) {
          const { data: likesData } = await supabase
            .from("likes")
            .select("recipe_id")
            .eq("user_id", user.id);

          if (likesData) setLikedRecipeIds(new Set(likesData.map(l => l.recipe_id)));
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
    
    // --- OPTIMISTIC UI UPDATE ---
    // We still update the UI immediately so it feels fast
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

    // --- DATABASE PERSISTENCE (Clean & Simple) ---
    try {
      if (isLiked) {
        // Just remove the row. Our query on next refresh will see one less row.
        await supabase.from("likes").delete().match({ user_id: user.id, recipe_id: recipeId });
      } else {
        // Just add the row. Our query on next refresh will see one more row.
        await supabase.from("likes").insert({ user_id: user.id, recipe_id: recipeId });
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      // Rollback logic here if needed...
    }
  };

  const handleSave = (recipe: Recipe) => {
    const isAlreadySaved = savedRecipes.some((r) => r.id === recipe.id);
    if (isAlreadySaved) {
      setSavedRecipes(savedRecipes.filter((r) => r.id !== recipe.id));
    } else {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<FeedPage recipes={recipes} loading={loading} savedRecipes={savedRecipes} likedRecipeIds={likedRecipeIds} onSave={handleSave} onLike={handleLike} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/box" element={<ProtectedRoute><BoxPage savedRecipes={savedRecipes} likedRecipeIds={likedRecipeIds} onSave={handleSave} onLike={handleLike} /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
