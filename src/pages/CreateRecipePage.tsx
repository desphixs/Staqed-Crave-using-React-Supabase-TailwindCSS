import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, Loader2, Sparkles, Image as ImageIcon, Utensils } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';

const CATEGORIES = ["Healthy", "Breakfast", "Vegan", "Dessert", "Lunch", "Dinner"];

const CreateRecipePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    chef: "",
    category: "Healthy",
    cookTime: "",
    imageUrl: ""
  });
  const [steps, setSteps] = useState<string | undefined>("## Ingredients\n\n- \n\n## Instructions\n\n1. ");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !formData.chef) {
      setFormData(prev => ({ ...prev, chef: user.email?.split('@')[0] || "Mystery Chef" }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title || !formData.chef || !steps || !formData.imageUrl) {
      setError("Please fill in all required fields to publish your masterpiece.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from("recipes")
        .insert({
          title: formData.title,
          chef: formData.chef,
          category: formData.category,
          cook_time: formData.cookTime,
          image_url: formData.imageUrl,
          steps: steps,
          user_id: user.id
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        navigate(`/recipe/${data.id}`);
      }
    } catch (err: any) {
      console.error("Insert Error:", err);
      setError(err.message || "Failed to create recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-rose-500 transition-colors font-bold uppercase tracking-widest text-[10px] mb-8"
        >
          <ChevronLeft size={16} /> Discard & Go Back
        </button>

        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-500 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={12} /> Share your talent
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">Create <span className="text-rose-500">Magic.</span></h1>
          <p className="text-zinc-500 font-medium">Draft your next culinary masterpiece and share it with the Crave community.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Recipe Title</label>
              <input 
                type="text"
                placeholder="e.g. Midnight Truffle Burger"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500 transition-colors"
                value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Chef Name</label>
              <input 
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500 transition-colors"
                value={formData.chef}
                onChange={e => setFormData(p => ({ ...p, chef: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Category</label>
              <select 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500 transition-colors appearance-none"
                value={formData.category}
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Cook Time</label>
              <input 
                type="text"
                placeholder="e.g. 25 MINS"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-500 transition-colors"
                value={formData.cookTime}
                onChange={e => setFormData(p => ({ ...p, cookTime: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Image URL</label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600">
                  <ImageIcon size={18} />
                </div>
                <input 
                  type="text"
                  placeholder="Paste URL from Unsplash..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-rose-500 transition-colors"
                  value={formData.imageUrl}
                  onChange={e => setFormData(p => ({ ...p, imageUrl: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Markdown Editor */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Execution Steps (Markdown)</label>
            <div data-color-mode="dark" className="rounded-2xl overflow-hidden border border-zinc-800">
              <MDEditor
                value={steps}
                onChange={setSteps}
                preview="edit"
                height={400}
                className="bg-zinc-900"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-rose-500/10"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Utensils size={18} />
                Publish Recipe
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipePage;
