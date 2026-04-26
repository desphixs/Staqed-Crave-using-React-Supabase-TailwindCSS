// Import the useState hook from React to manage component-specific state
import { useState } from "react";
// Import icons (Heart, Clock, Bookmark) from the lucide-react library
import { Heart, Clock, Bookmark } from "lucide-react";
// Import the Recipe type definition from the types file to ensure data type safety
import type { Recipe } from "../types";

// Define the properties that the RecipeCard component expects to receive
interface RecipeCardProps {
  // A single recipe object conforming to the Recipe interface
  recipe: Recipe;
  // A boolean indicating if the recipe is currently saved in the user's collection
  isSaved: boolean;
  // A callback function to trigger when the "Save" (bookmark) button is clicked
  onSave: (recipe: Recipe) => void;
}

// Define the RecipeCard component using an arrow function
const RecipeCard = ({ recipe, isSaved, onSave }: RecipeCardProps) => {
  // state variable 'liked' to track if the current user has liked this specific card locally
  const [liked, setLiked] = useState(false);

  // Function to toggle the local 'liked' state between true and false
  const handleLike = () => {
    // Set the liked state to the opposite of its current value
    setLiked(!liked);
  };

  // Logic to calculate the current number of likes to display
  // If the user liked it locally, we add 1 to the actual recipe's base likes count
  const currentLikes = liked ? recipe.likes + 1 : recipe.likes;

  // The component returns the following JSX for the card's visual structure
  return (
    // Main card container with rounded corners, overflow hidden, and hover effects for scaling and shadowing
    <div className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 transition-all hover:border-zinc-700 hover:shadow-2xl hover:shadow-rose-500/10">
      {/* Top section of the card reserved for the image and floating badges/buttons */}
      <div className="relative h-64 overflow-hidden">
        {/* Main recipe image with a zoom effect on card hover */}
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category badge positioned at the top left of the image */}
        <div className="absolute top-4 left-4 bg-zinc-950/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-100 border border-zinc-700">
          {recipe.category}
        </div>
        
        {/* Container for action buttons (Like and Save) at the top right of the image */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Like Button: changes appearance based on the 'liked' state */}
          <button 
            onClick={handleLike}
            className={`
              /* Base styling for the action buttons */
              p-2.5 backdrop-blur-md rounded-full border transition-all 
              active:scale-95 duration-300
              ${
                // Conditional styling based on whether the recipe is liked
                liked 
                  ? "bg-rose-500/20 text-rose-500 border-rose-500/50" 
                  : "bg-zinc-950/60 text-zinc-300 border-zinc-700 hover:text-rose-500 hover:bg-rose-500/10"
              }
            `}
          >
            {/* Heart icon with dynamic fill and animation when liked */}
            <Heart 
              size={18} 
              fill={liked ? "currentColor" : "none"} 
              className={liked ? "animate-pulse" : ""}
            />
          </button>

          {/* Bookmark (Save) Button: triggers the parent (Lifted State) onSave function */}
          <button 
            onClick={() => onSave(recipe)}
            className={`
              /* Base styling for the action buttons */
              p-2.5 backdrop-blur-md rounded-full border transition-all 
              active:scale-95 duration-300
              ${
                 // Conditional styling based on whether the recipe is in the saved list (passed as prop)
                isSaved 
                  ? "bg-amber-500/20 text-amber-500 border-amber-500/50" 
                  : "bg-zinc-950/60 text-zinc-300 border-zinc-700 hover:text-amber-500 hover:bg-amber-500/10"
              }
            `}
          >
            {/* Bookmark icon with dynamic fill based on it being saved */}
            <Bookmark 
              size={18} 
              fill={isSaved ? "currentColor" : "none"} 
            />
          </button>
        </div>
      </div>

      {/* Content section of the card containing text information */}
      <div className="p-6">
        {/* Title and Chef name area */}
        <div className="flex justify-between items-start mb-4">
          <div>
            {/* The recipe title with an subtle color change highlight on card hover */}
            <h3 className="text-xl font-bold text-zinc-100 group-hover:text-rose-100 transition-colors">
              {recipe.title}
            </h3>
            {/* The chef's name credit */}
            <p className="text-sm text-zinc-500 font-medium italic">by {recipe.chef}</p>
          </div>
        </div>

        {/* Footer info section displaying cooking time and like count */}
        <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
          {/* Cooking time indicator with a clock icon */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-tight">
            <Clock size={14} className="text-rose-500" />
            {recipe.cookTime}
          </div>
          {/* Likes indicator showing the calculated currentLikes count */}
          <div className={`text-xs font-bold uppercase tracking-tight transition-colors duration-300 ${liked ? 'text-rose-500' : 'text-zinc-400'}`}>
            {currentLikes} Likes
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the RecipeCard component to be used in App.tsx or other grids
export default RecipeCard;

