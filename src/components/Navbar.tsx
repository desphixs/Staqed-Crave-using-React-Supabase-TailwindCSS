// Import the useState hook from React for managing the mobile menu open/close state
import { useState } from "react";
// Import icons (Search, Library, Menu, X) from the lucide-react library
import { Search, Library, Menu, X } from "lucide-react";
// Import the Dialog component from Headless UI to handle the mobile overlay menu
import { Dialog } from "@headlessui/react";

// Define the properties expected by the Navbar component
interface NavbarProps {
  // The ID of the currently active view ('feed' or 'box')
  currentView: string;
  // A function to update the view when a navigation link is clicked
  onViewChange: (view: "feed" | "box") => void;
}

// Define the Navbar component using an arrow function
const Navbar = ({ currentView, onViewChange }: NavbarProps) => {
  // state variable to track if the mobile navigation menu is currently open or closed
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Configuration for navigation links: including names, icons, and corresponding view IDs
  const navLinks = [
    { name: "Explore", icon: <Search size={14} />, id: "feed" },
    { name: "My Box", icon: <Library size={14} />, id: "box" },
  ];

  // Return the JSX for the navigation bar
  return (
    // Main navigation element, sticky at the top of the viewport with a blurred background effect
    <nav className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 py-4">
      {/* Centered container for logo and links with flexbox alignment */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo container that resets the view to 'feed' when clicked */}
        <div 
          onClick={() => onViewChange("feed")}
          className="text-2xl font-black tracking-tighter text-rose-500 uppercase cursor-pointer"
        >
          Crave<span className="text-zinc-100">.</span>
        </div>

        {/* Navigation links for desktop screens (hidden on mobile) */}
        <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
          {/* Loop through navLinks and render a button for each */}
          {navLinks.map((link) => (
            <button 
              key={link.id} 
              // Calls the onViewChange function with the link's specific ID
              onClick={() => onViewChange(link.id as "feed" | "box")}
              // Applies active color (rose) if the link matches currentView, otherwise applies hover styles
              className={`flex items-center gap-2 transition-colors ${currentView === link.id ? "text-rose-500" : "hover:text-rose-500"}`}
            >
              {/* Display the icon and the name for each link */}
              {link.icon} {link.name}
            </button>
          ))}
        </div>

        {/* Hamburger menu button for mobile devices (hidden on desktop) */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="text-zinc-400 hover:text-rose-500"
            // Opens the mobile menu when clicked
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Modal overlay powered by Headless UI Dialog component */}
      <Dialog as="div" className="md:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        {/* Full-screen background for the mobile menu */}
        <div className="fixed inset-0 z-50 bg-zinc-950 px-6 py-4">
          {/* Mobile menu header with logo and close button */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-black tracking-tighter text-rose-500 uppercase">
              Crave<span className="text-zinc-100">.</span>
            </div>
            {/* Close button for the mobile menu */}
            <button
              type="button"
              className="text-zinc-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          {/* Main vertical list of mobile navigation links */}
          <div className="mt-12 space-y-6">
            {/* Loop through navLinks for the mobile view */}
            {navLinks.map((link) => (
              <button
                key={link.id}
                // Styles that change color based on whether the link is currently active
                className={`w-full flex items-center gap-4 text-2xl font-black uppercase tracking-tighter transition-colors ${currentView === link.id ? "text-rose-500" : "text-zinc-100"}`}
                onClick={() => {
                  // Switch view, then close the mobile menu
                  onViewChange(link.id as "feed" | "box");
                  setMobileMenuOpen(false);
                }}
              >
                {/* Styled container for the mobile link icon */}
                <div className={`p-3 rounded-2xl ${currentView === link.id ? "bg-rose-500 text-zinc-100" : "bg-zinc-900 text-rose-500"}`}>
                  {link.icon}
                </div>
                {/* Text for the mobile link */}
                {link.name}
              </button>
            ))}
          </div>
        </div>
      </Dialog>
    </nav>
  );
};

// Export the Navbar component as the default export
export default Navbar;

