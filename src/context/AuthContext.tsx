import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";


// Define the shape of our Auth Context
interface AuthContextType {
  // The current user object, or null if not logged in
  user: User | null;
  // A boolean to track if the initial auth check is still in progress
  loading: boolean;
}

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The AuthProvider component that wraps our app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial check: Get current session when the component mounts
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    // 2. Listen for auth changes (login, logout, token refresh)
    // The callback inside onAuthStateChange will fire whenever the user's status changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Clean up the subscription when the provider is unmounted
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Pass the user and loading state down to all child components
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access the Auth Context from any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Throw an error if useAuth is used outside of an AuthProvider
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
