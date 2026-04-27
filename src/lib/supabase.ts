import { createClient } from "@supabase/supabase-js";

// Fetch the Supabase URL and Anon Key from environment variables
// These are defined in the .env file at the project root
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Throw an error if the environment variables are missing
// This prevents the app from running in a broken state
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Check your .env file.");
}

// Initialize the Supabase client
// This single instance will be shared throughout the entire application
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
