import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";
import BoxPage from "./pages/BoxPage";
import ProtectedRoute from "./components/ProtectedRoute";
import type { Recipe } from "./types";

const App = () => {
  // Global state for saved recipes (to be replaced by Supabase in the next task)
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

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
          element={<FeedPage savedRecipes={savedRecipes} onSave={handleSave} />} 
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