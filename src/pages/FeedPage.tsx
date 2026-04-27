import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import RecipeCard from "../components/RecipeCard";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";
import type { Recipe } from "../types";

const CATEGORIES = ["All", "Vegan", "Breakfast", "Lunch", "Dinner", "Dessert", "Healthy"];

interface FeedPageProps {
  recipes: Recipe[];
  loading: boolean;
  savedRecipes: Recipe[];
  likedRecipeIds: Set<string>; // New: Set of IDs the user has liked
  onSave: (recipe: Recipe) => void;
  onLike: (recipeId: string) => void; // New: Function to toggle likes
}

const FeedPage = ({ recipes, loading, savedRecipes, likedRecipeIds, onSave, onLike }: FeedPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const recipeListRef = useRef<HTMLDivElement>(null);

  const scrollToRecipes = () => {
    recipeListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = activeFilter === "All" || recipe.category === activeFilter;
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.chef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
          <div className="inline-block px-4 py-1.5 mb-6 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">
            Premium Culinary Collection
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[0.9] tracking-tighter">
            Feed your <span className="text-rose-500">passion.</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12 leading-relaxed">
            Discover the most vibrant recipe collections from elite chefs around the world. Designed for the modern foodie.
          </p>
          <button 
            onClick={scrollToRecipes}
            className="group flex items-center gap-3 bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-rose-500/20"
          >
            Explore Recipes
            <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </section>

      <div ref={recipeListRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-zinc-900">
        <main>
          <div className="flex flex-col gap-10 mb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div>
                <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">Latest Cravings</h3>
                <div className="h-1 w-20 bg-rose-500 rounded-full"></div>
              </div>
              <div className="w-full md:max-w-md">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <FilterBar categories={CATEGORIES} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest whitespace-nowrap">
                {!loading ? `${filteredRecipes.length} Masterpieces` : 'Searching...'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            ) : filteredRecipes.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 animate-in fade-in zoom-in-95 duration-300">
                 <p className="text-2xl font-bold text-zinc-400 mb-2">No recipes found.</p>
                 <p className="text-zinc-600">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              filteredRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  isSaved={savedRecipes.some(r => r.id === recipe.id)}
                  isLiked={likedRecipeIds.has(recipe.id)} // Derive liked status
                  onSave={onSave}
                  onLike={onLike} // Pass handler
                />
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default FeedPage;
