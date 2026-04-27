import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-rose-500/10 rounded-2xl text-rose-500 mb-4">
              <UserPlus size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Join Crave</h1>
            <p className="text-zinc-500 text-sm font-medium">Create your account to start saving masterpieces.</p>
          </div>

          {/* Success State */}
          {success ? (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="flex justify-center">
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
                  <CheckCircle2 size={48} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-100">Check your inbox</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  We've sent a verification link to <span className="text-zinc-200 font-bold">{email}</span>. 
                  Please confirm your email to activate your account.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-block w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold py-3.5 rounded-2xl transition-all"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={18} />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Email Field */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-rose-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/20 transition-all"
                  />
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-rose-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="Create Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          {!success && (
            <div className="mt-8 text-center">
              <p className="text-zinc-500 text-sm font-medium">
                Already have an account?{" "}
                <Link to="/login" className="text-rose-500 hover:text-rose-400 font-bold transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
