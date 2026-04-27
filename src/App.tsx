import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";
import BoxPage from "./pages/BoxPage";
import ProtectedRoute from "./components/ProtectedRoute";
import type { Recipe } from "./types";

const App = () => {
  // State for the full list of recipes from the database
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // State for tracked saved recipes
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  // State to track if the data is currently being fetched
  const [loading, setLoading] = useState(true);

  // Fetch all recipes from Supabase on component mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        // Query the 'recipes' table, ordering by the newest first
        const { data, error } = await supabase
          .from("recipes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Handler for Saving/Unsaving recipes
  const handleSave = (recipe: Recipe) => {
    const isAlreadySaved = savedRecipes.some((r) => r.id === recipe.id);
    if (isAlreadySaved) {
      setSavedRecipes(savedRecipes.filter((r) => r.id !== recipe.id));
    } else {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500/30">
      {/* Global Navigation */}
      <Navbar />
      
      {/* Route Definitions */}
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <FeedPage 
              recipes={recipes} 
              loading={loading} 
              savedRecipes={savedRecipes} 
              onSave={handleSave} 
            />
          } 
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route 
          path="/box" 
          element={
            <ProtectedRoute>
              <BoxPage savedRecipes={savedRecipes} onSave={handleSave} />
            </ProtectedRoute>
          } 
        />
      </Routes>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;