// Import the useState hook (for state management) and useRef hook (for DOM references) from React
import { useState, useRef } from "react";
// Import specific icons (ChevronDown, Heart, Bookmark) from the lucide-react library
import { ChevronDown, Heart, Bookmark } from "lucide-react";
// Import the Navbar component from the components directory
import Navbar from "./components/Navbar";
// Import the RecipeCard component from the components directory
import RecipeCard from "./components/RecipeCard";
// Import the Footer component from the components directory
import Footer from "./components/Footer";
// Import the SearchBar component from the components directory
import SearchBar from "./components/SearchBar";
// Import the FilterBar component from the components directory
import FilterBar from "./components/FilterBar";
// Import the list of recipes data from the data/recipes file
import { RECIPES } from "./data/recipes";
// Import the Recipe type definition from the types file
import type { Recipe } from "./types";

// Define a list of recipe categories including a default "All" category
const CATEGORIES = ["All", "Vegan", "Breakfast", "Lunch", "Dinner", "Dessert", "Healthy"];

// Define the main App component using an arrow function
const App = () => {
  // Create a state variable for the full list of recipes, initialized with the RECIPES data
  const [recipes] = useState<Recipe[]>(RECIPES);
  
  // Create a state variable for the search query text, starting as an empty string
  const [searchQuery, setSearchQuery] = useState("");
  // Create a state variable for the currently active filter category, starting at "All"
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Create a state variable to store the list of recipes the user has saved
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  // Create a state variable to toggle between the main 'feed' view and the 'box' (saved) view
  const [currentView, setCurrentView] = useState<"feed" | "box">("feed");
  
  // Create a reference to the recipe list section in the DOM for scrolling purposes
  const recipeListRef = useRef<HTMLDivElement>(null);

  // Function to smooth scroll the page down to the recipe list section
  const scrollToRecipes = () => {
    // Access the current element of the ref and call scrollIntoView with smooth behavior
    recipeListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Logic to filter the recipes based on the active category and the search query
  const filteredRecipes = recipes.filter((recipe) => {
    // Check if the recipe category matches the active filter or if the filter is set to "All"
    const matchesCategory = activeFilter === "All" || recipe.category === activeFilter;
    // Check if the search query is found in the recipe title or the chef's name (case-insensitive)
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.chef.toLowerCase().includes(searchQuery.toLowerCase());
    // Return true only if both category and search conditions are met
    return matchesCategory && matchesSearch;
  });

  // Handler function to process saving or unsaving a recipe
  const handleSave = (recipe: Recipe) => {
    // Check if the recipe is already in the savedRecipes list by comparing IDs
    const isAlreadySaved = savedRecipes.some((r) => r.id === recipe.id);
    if (isAlreadySaved) {
      // If it is already saved, remove it from the list by filtering out that specific recipe ID
      setSavedRecipes(savedRecipes.filter((r) => r.id !== recipe.id));
    } else {
      // If it is not saved, add it to the list by spreading existing saved recipes and adding the new one
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };

  // The component returns the following JSX for rendering the UI
  return (
    // Main container div with basic layout, background, text colors, and custom selection color
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500/30">
      {/* Render the Navbar and pass the currentView state and its setter as props */}
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      
      {/* Conditional rendering: if currentView is "feed", show the landing page and recipe grid */}
      {currentView === "feed" ? (
        <>
          {/* Hero Section Container for the top part of the landing page */}
          <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
            {/* A decorative blurred circle in the background for visual depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-[120px] rounded-full -z-10"></div>
            
            {/* Inner hero content container */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
              {/* Small badge/tag above the main heading */}
              <div className="inline-block px-4 py-1.5 mb-6 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">
                Premium Culinary Collection
              </div>
              {/* Main powerful heading of the page */}
              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[0.9] tracking-tighter">
                Feed your <span className="text-rose-500">passion.</span>
              </h1>
              {/* Subheading text describing the platform */}
              <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12 leading-relaxed">
                Discover the most vibrant recipe collections from elite chefs around the world. Designed for the modern foodie.
              </p>
              
              {/* Call-to-action button that scrolls to the recipes list when clicked */}
              <button 
                onClick={scrollToRecipes}
                className="group flex items-center gap-3 bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-rose-500/20"
              >
                Explore Recipes
                {/* Icon that points down to indicate more content below */}
                <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </section>

          {/* Main Container for the recipe list section, linked to the ref for scrolling */}
          <div ref={recipeListRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-zinc-900">
            {/* Main semantic element for primary content */}
            <main>
              {/* Header section for the recipe feed with category and search */}
              <div className="flex flex-col gap-10 mb-16">
                {/* Top row with title and search bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                  {/* Left side: Heading for the section */}
                  <div>
                    <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">Latest Cravings</h3>
                    {/* A small colored underline for the heading */}
                    <div className="h-1 w-20 bg-rose-500 rounded-full"></div>
                  </div>

                  {/* Right side: SearchBar component container */}
                  <div className="w-full md:max-w-md">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  </div>
                </div>

                {/* Bottom row with filter categories and result count */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  {/* Category filter bar component */}
                  <FilterBar 
                    categories={CATEGORIES} 
                    activeFilter={activeFilter} 
                    onFilterChange={setActiveFilter} 
                  />
                  {/* Text displaying the number of recipes currently shown after filtering */}
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest whitespace-nowrap">
                    {filteredRecipes.length} Masterpieces
                  </p>
                </div>
              </div>

              {/* Conditional rendering: if NO recipes match the filters, show an empty state message */}
              {filteredRecipes.length === 0 && (
                <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 animate-in fade-in zoom-in-95 duration-300">
                  <p className="text-2xl font-bold text-zinc-400 mb-2">No recipes found.</p>
                  <p className="text-zinc-600">Try adjusting your filters or search keywords.</p>
                </div>
              )}

              {/* Responsive grid for displaying recipe cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* Map over the filteredRecipes array and render a RecipeCard for each recipe */}
                {filteredRecipes.map((recipe) => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    // Pass a boolean prop telling the card if its recipe is saved or not
                    isSaved={savedRecipes.some(r => r.id === recipe.id)}
                    // Pass the handleSave function to manage saving from within the card
                    onSave={handleSave}
                  />
                ))}
              </div>
            </main>
          </div>
        </>
      ) : (
        /* Conditional rendering: if currentView is NOT "feed" (i.e., "box"), show the Saved Recipes view */
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[70vh]">
          {/* Header section for the Recipe Box (saved view) */}
          <header className="mb-16">
            <div className="flex items-center gap-4 mb-4">
               {/* Icon container with background for the saved recipes heading */}
               <div className="p-3 bg-amber-500 text-zinc-900 rounded-2xl">
                  <Bookmark size={24} fill="currentColor" />
               </div>
               {/* Main title for the saved recipes page */}
               <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">My Recipe Box</h1>
            </div>
            {/* Descriptive text for the saved recipes page */}
            <p className="text-zinc-500 text-lg max-w-2xl font-medium">
              Your curated collection of saved culinary masterpieces. Ready for your next kitchen adventure.
            </p>
          </header>

          {/* Conditional rendering: if the list of saved recipes is empty, show an empty box message */}
          {savedRecipes.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
              {/* Big bookmark icon in the center of the empty screen */}
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-500">
                <Bookmark size={32} />
              </div>
              <p className="text-2xl font-bold text-zinc-400 mb-2">Your box is empty.</p>
              <p className="text-zinc-600 mb-8 max-w-md mx-auto small">Go explore the feed and bookmark your favorite recipes to see them here.</p>
              {/* Button to navigate back to the main recipe feed */}
              <button 
                onClick={() => setCurrentView("feed")}
                className="bg-zinc-100 text-zinc-900 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
              >
                Back to Feed
              </button>
            </div>
          ) : (
            // If there ARE saved recipes, show them in a responsive grid with entry animations
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Map over the savedRecipes array and render a RecipeCard for each saved recipe */}
              {savedRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  // Always pass isSaved as true since we are in the saved view
                  isSaved={true}
                  // Pass the handleSave function to allow removing from saved within this view too
                  onSave={handleSave}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Render the global Footer component at the bottom of the page */}
      <Footer />
    </div>
  );
};

// Export the App component as the default export of this file
export default App;