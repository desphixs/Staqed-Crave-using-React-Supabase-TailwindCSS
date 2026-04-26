// Define the Footer component using an arrow function
const Footer = () => {
  // Return the JSX structure for the footer
  return (
    // Footer element with a top border, background color, and padding
    <footer className="border-t border-zinc-800 bg-zinc-950 py-12">
      {/* Maximum width container to center the footer content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flexbox container to arrange items vertically on small screens and horizontally on medium+ screens */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Copyright container */}
          <div className="text-center md:text-left">
            {/* The main brand name with styled text and uppercase formatting */}
            <div className="text-xl font-black tracking-tighter text-rose-500 uppercase mb-2">
              Crave<span className="text-zinc-100">.</span>
            </div>
            {/* Copyright text including a dynamic year generation */}
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} Crave Inc. All rights reserved.
            </p>
          </div>

          {/* Links container with uppercase small text and wide letter spacing */}
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            {/* Individual navigation links with hover color changes */}
            <a href="#" className="hover:text-rose-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-rose-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-rose-500 transition-colors">About</a>
          </div>

          {/* Social Media icons container */}
          <div className="flex gap-6 text-zinc-500">
            {/* Link wrapper for the Instagram icon */}
            <a href="#" className="hover:text-rose-500 transition-colors">
              {/* Instagram SVG icon definition */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            {/* Link wrapper for the Twitter icon */}
            <a href="#" className="hover:text-rose-500 transition-colors">
              {/* Twitter SVG icon definition */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            {/* Link wrapper for the Website icon */}
            <a href="#" className="hover:text-rose-500 transition-colors">
              {/* Website/Globe SVG icon definition */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Export the Footer component for use in other parts of the application
export default Footer;

