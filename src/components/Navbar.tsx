import { useState } from "react";
import { Search, Library, Menu, X, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Highlight the active link based on the current URL path
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navLinks = [
    { name: "Explore", icon: <Search size={14} />, path: "/" },
    { name: "My Box", icon: <Library size={14} />, path: "/my-box" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/"
          className="text-2xl font-black tracking-tighter text-rose-500 uppercase flex items-center gap-2"
        >
          Crave<span className="text-zinc-100">.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-2 transition-colors ${isActive(link.path) ? "text-rose-500" : "hover:text-rose-500"}`}
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-zinc-800" />

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-6">
                <Link 
                  to="/dashboard"
                  className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all active:scale-95 flex items-center gap-2"
                >
                  <LayoutDashboard size={14} /> My Kitchen
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
                <Link to="/login" className="text-zinc-400 hover:text-rose-500 transition-colors">Sign In</Link>
                <Link to="/register" className="bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600 transition-all">Register</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="text-zinc-400 hover:text-rose-500"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Modal */}
      <Dialog as="div" className="md:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50 bg-zinc-950 px-6 py-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-black tracking-tighter text-rose-500 uppercase">
              Crave<span className="text-zinc-100">.</span>
            </div>
            <button
              type="button"
              className="text-zinc-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mt-12 space-y-8">
            {/* User Profile Info on Mobile */}
            {user && (
              <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-3xl border border-zinc-800">
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white">
                  <UserIcon size={24} />
                </div>
                <div>
                  <p className="text-zinc-100 font-bold text-sm truncate max-w-[200px]">{user.email}</p>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Chef Member</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`w-full flex items-center gap-4 text-2xl font-black uppercase tracking-tighter transition-colors ${isActive(link.path) ? "text-rose-500" : "text-zinc-100"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`p-3 rounded-2xl ${isActive(link.path) ? "bg-rose-500 text-zinc-100" : "bg-zinc-900 text-rose-500"}`}>
                    {link.icon}
                  </div>
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-8 border-t border-zinc-900 space-y-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-4 text-zinc-100 text-lg font-bold uppercase tracking-widest"
                  >
                    <LayoutDashboard size={20} /> My Kitchen
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 text-zinc-400 text-lg font-bold uppercase tracking-widest pt-4"
                  >
                    <LogOut size={20} /> Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-zinc-400 text-lg font-bold uppercase tracking-widest"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-rose-500 text-white text-center py-4 rounded-2xl font-black uppercase tracking-widest"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </nav>
  );
};

export default Navbar;
