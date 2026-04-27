import { useState, useEffect } from "react"; // Importing React hooks for state and lifecycle management
import { useParams, useNavigate } from "react-router-dom"; // Importing hooks for URL parameters and navigation
import { supabase } from "../lib/supabase"; // Importing our configured Supabase client for database operations
import { useAuth } from "../context/AuthContext"; // Importing our custom authentication hook to get the logged-in user
import { ChevronLeft, Loader2, Save, Trash2 } from "lucide-react"; // Importing core icons including Trash for deletion
import MDEditor from '@uiw/react-md-editor'; // Importing the Markdown editor component for rich text editing

// Fixed list of categories matching our database schema
const CATEGORIES = ["Healthy", "Breakfast", "Vegan", "Dessert", "Lunch", "Dinner"];

const EditRecipePage = () => {
  const { id } = useParams(); // Extracting the recipe ID from the URL (e.g., from /recipe/123/edit)
  const { user } = useAuth(); // Accessing the current authenticated user from our AuthContext
  const navigate = useNavigate(); // Hook to programmatically change pages (like a redirect)
  
  // State object to hold all the text-based form fields
  const [formData, setFormData] = useState({
    title: "",
    chef: "",
    category: "Healthy",
    cookTime: "",
    imageUrl: ""
  });
  
  const [steps, setSteps] = useState<string | undefined>(""); // State specifically for the Markdown instructions content
  const [loading, setLoading] = useState(true); // State to show a spinner while we fetch the initial recipe data
  const [saving, setSaving] = useState(false); // State to disable buttons and show a spinner during the update request
  const [error, setError] = useState<string | null>(null); // State to store and display any error messages to the user

  // This effect runs once when the page loads (or when ID/User changes)
  useEffect(() => {
    // Function to download the existing recipe details from Supabase
    const fetchRecipe = async () => {
      try {
        setLoading(true); // Start showing the loading spinner
        
        // Querying Supabase for the specific recipe by its ID
        const { data: recipe, error: fetchError } = await supabase
          .from("recipes")
          .select("*") // Get all columns
          .eq("id", id) // Where the ID matches our URL parameter
          .single(); // Expect exactly one result

        if (fetchError) throw fetchError; // If something went wrong with the database, jump to the catch block

        if (recipe) {
          // SECURITY CHECK: This is critical. We ensure the person editing is the owner.
          if (recipe.user_id !== user?.id) {
            // If the user IDs don't match, they shouldn't be here. Kick them back to the view page.
            navigate(`/recipe/${id}`);
            return;
          }

          // PRE-FILLING: Pour the database data into our form state so the user sees existing info
          setFormData({
            title: recipe.title,
            chef: recipe.chef,
            category: recipe.category,
            cookTime: recipe.cook_time,
            imageUrl: recipe.image_url
          });
          setSteps(recipe.steps); // Fill the Markdown editor with the existing instructions
        }
      } catch (err: any) {
        console.error("Fetch Error:", err); // Log the error for debugging
        setError("Failed to load recipe data."); // Show a user-friendly error message
      } finally {
        setLoading(false); // Stop showing the loading spinner regardless of success or failure
      }
    };

    // Only attempt the fetch if we have an authenticated user to check against
    if (user) fetchRecipe();
  }, [id, user, navigate]); // Dependencies: Re-run if ID, User, or navigate function change

  // Function called when the user clicks 'Save Changes'
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the browser from refreshing the page on form submit
    if (!user) return; // Guard clause: Don't proceed if somehow the user is not logged in

    try {
      setSaving(true); // Show the loading state on the submit button
      setError(null); // Clear any previous errors

      // Sending the updated data to Supabase
      const { error: updateError } = await supabase
        .from("recipes")
        .update({
          title: formData.title,
          chef: formData.chef,
          category: formData.category,
          cook_time: formData.cookTime,
          image_url: formData.imageUrl,
          steps: steps
        })
        .eq("id", id); // IMPORTANT: Target ONLY the recipe we are currently editing

      if (updateError) throw updateError; // If update fails, jump to catch

      // Once saved, send the user back to the detail page to see their changes
      navigate(`/recipe/${id}`);
    } catch (err: any) {
      console.error("Update Error:", err); // Log for debugging
      setError(err.message || "Failed to update recipe."); // Show error in UI
    } finally {
      setSaving(false); // Turn off the loading state on the button
    }
  };

  // Function to handle the deletion of a recipe
  const handleDelete = async () => {
    // Safety first: Always confirm before destructive actions
    const confirmed = window.confirm("Are you absolutely sure? This culinary masterpiece will be lost forever.");
    
    if (confirmed) {
      try {
        setSaving(true); // Reuse the saving state to disable buttons
        // Call Supabase to delete the specific record
        const { error: deleteError } = await supabase
          .from("recipes")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;
        
        // On success, take the user back to the main feed
        navigate("/");
      } catch (err: any) {
        console.error("Delete Error:", err);
        alert("Failed to delete recipe. Please try again.");
        setSaving(false); // Re-enable buttons if it fails
      }
    }
  };

  // If we are still fetching data, show a full-screen loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-zinc-500 bg-zinc-950">
        <Loader2 className="animate-spin mb-4 text-rose-500" size={48} />
        <p className="font-bold tracking-widest uppercase text-xs">Loading Editor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button to go back to the recipe view without saving */}
        <button 
          onClick={() => navigate(`/recipe/${id}`)} 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-rose-500 transition-colors font-bold uppercase tracking-widest text-[10px] mb-8"
        >
          <ChevronLeft size={16} /> Exit Editor
        </button>

        <header className="mb-12">
          {/* Main title of the page */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2">Edit <span className="text-zinc-500">Recipe.</span></h1>
          <p className="text-zinc-500 font-medium">Refining your recipe for the community.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Conditional error message display */}
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm font-bold">
              {error}
            </div>
          )}

          {/* Grid for recipe title and chef display name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Title</label>
              <input 
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500 transition-colors"
                value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Chef Display Name</label>
              <input 
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500 transition-colors"
                value={formData.chef}
                onChange={e => setFormData(p => ({ ...p, chef: e.target.value }))}
              />
            </div>
          </div>

          {/* Grid for category selection, cook time, and image URL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Category</label>
              <select 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500 transition-colors appearance-none"
                value={formData.category}
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
              >
                {/* Mapping through our categories array to create option elements */}
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Cook Time</label>
              <input 
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500 transition-colors"
                value={formData.cookTime}
                onChange={e => setFormData(p => ({ ...p, cookTime: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Photo URL</label>
              <input 
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500 transition-colors"
                value={formData.imageUrl}
                onChange={e => setFormData(p => ({ ...p, imageUrl: e.target.value }))}
              />
            </div>
          </div>

          {/* Input section for the Markdown editor instructions */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Recipe Body (Markdown)</label>
            <div data-color-mode="dark" className="rounded-2xl overflow-hidden border border-zinc-800">
              <MDEditor
                value={steps || ""} // Binding the editor value to our steps state
                onChange={setSteps} // Updating the steps state when the user types
                preview="edit" // Setting the editor to focus on the typing area initially
                height={350} // Fixed height for a balanced UI
                className="bg-zinc-900" // Matching our dark onyx theme
              />
            </div>
          </div>

          {/* Final submit button to trigger the Supabase update */}
          <button 
            type="submit"
            disabled={saving} // Prevent multiple clicks during the save process
            className="w-full bg-zinc-100 hover:bg-white text-zinc-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-white/5"
          >
            {/* Show a spinner while saving, otherwise show the Save icon and text */}
            {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Save Changes</>}
          </button>

          {/* New Delete Button: Visually distinct to signify a destructive action */}
          <button 
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-3 border border-rose-500/20 mt-4"
          >
            <Trash2 size={18} /> Delete Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRecipePage; // Exporting the component for use in our App routes
