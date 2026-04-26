// Define the structure of the properties that the FilterBar component expects to receive
interface FilterBarProps {
  // A list of category names (strings) to be displayed as filter buttons
  categories: string[];
  // The currently selected category string
  activeFilter: string;
  // A function to call when a category button is clicked, taking the category name as an argument
  onFilterChange: (category: string) => void;
}

// Define the FilterBar component using an arrow function, destructuring props for direct access
const FilterBar = ({ categories, activeFilter, onFilterChange }: FilterBarProps) => {
  // The component returns a div container for the buttons
  return (
    // Flexbox container that allows content to wrap to the next line with spacing between buttons
    <div className="flex flex-wrap gap-3">
      {/* Map through the categories array to create a button for each category */}
      {categories.map((category) => (
        // Each interactive button for a specific category
        <button
          // Unique key for React's reconciliation process to track list items
          key={category}
          // When the button is clicked, trigger the onFilterChange function with the button's category
          onClick={() => onFilterChange(category)}
          // Template literal for dynamic CSS classes based on the active state
          className={`
            /* Base styles for every button: padding, rounded shape, font, and smooth transitions */
            px-6 py-2 rounded-full text-sm font-bold transition-all duration-300
            ${
              // Logic check: if this specific button's category is the one currently active...
              activeFilter === category
                ? // ...apply "active" styles: rose background, white text, shadow, and slight scale up
                  "bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-105"
                : // ...else apply "inactive" styles: dark background, gray text, border, and hover effects
                  "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
            }
          `}
        >
          {/* Display the name of the category inside the button */}
          {category}
        </button>
      ))}
    </div>
  );
};

// Export the FilterBar component so it can be used in other files (like App.tsx)
export default FilterBar;

