// Import the Search icon from the lucide-react library
import { Search } from "lucide-react";

// Define the properties expected by the SearchBar component
interface SearchBarProps {
  // The current text value of the search input field
  value: string;
  // A function to call when the input text changes, passing the new value up to the parent
  onChange: (value: string) => void;
}

// Define the SearchBar component using an arrow function
const SearchBar = ({ value, onChange }: SearchBarProps) => {
  // Return the JSX for the search bar UI
  return (
    // Relative container div for the input and the floating icon
    <div className="relative w-full group">
      {/* Absolute container to position the search icon inside the input field */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-rose-500 transition-colors">
        {/* The Search icon itself, sized at 20px */}
        <Search size={20} />
      </div>
      {/* The main text input field */}
      <input
        // Type defined as text for general character input
        type="text"
        // Helpful placeholder text displayed when the input is empty
        placeholder="Search for meals or chefs..."
        // Bind the input value to the 'value' prop passed from the parent component
        value={value}
        // Event handler that captures user typing and updates the search query in the parent state
        onChange={(e) => onChange(e.target.value)}
        // Extensive CSS classes for width, background color, borders, padding, focus states, and transitions
        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-3.5 pl-12 pr-6 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all font-medium"
      />
    </div>
  );
};

// Export the SearchBar component so it can be used in the main App file
export default SearchBar;

