import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, Navigate } from "react-router"; // Fixed import 

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, user } = useAuthStore();

  if (user) return <Navigate to="/" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent z-10 relative py-12 px-6">
      <div className="w-full max-w-2xl bg-glass backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col items-center p-8 sm:p-12">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block hover:scale-105 transition-transform duration-500 mb-6">
            <h1 className="text-5xl font-bold text-primary tracking-tight">
              Think<span className="text-accent">Board</span>
            </h1>
          </Link>
          <p className="text-lg text-base-content/70 font-medium">Welcome back! 👋</p>
          <p className="text-sm text-base-content/50 mt-3">Sign in to access all your study notes</p>
        </div>

        <form className="w-full space-y-6 max-w-md" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <label className="label px-0">
              <span className="label-text font-bold text-base text-base-content">Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full bg-white/5 border border-base-300 focus:border-primary focus:bg-white/10 text-base-content transition-all duration-700 rounded-xl h-12 px-4 font-medium placeholder:text-base-content/40"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="label px-0">
              <span className="label-text font-bold text-base text-base-content">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full bg-white/5 border border-base-300 focus:border-primary focus:bg-white/10 text-base-content transition-all duration-700 rounded-xl h-12 px-4 font-medium placeholder:text-base-content/40"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-full h-12 rounded-xl font-bold uppercase tracking-wide text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-none" 
            disabled={isLoading}
          >
            {isLoading ? <span className="loading loading-spinner loading-sm" /> : "Sign In"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-base-content/60 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-bold hover:text-accent underline transition-colors">
              Create one →
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-base-300 w-full text-center">
          <p className="text-xs text-base-content/40 font-medium">
            Demo: use <span className="bg-base-200 px-2 py-1 rounded text-base-content font-mono">user@example.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
