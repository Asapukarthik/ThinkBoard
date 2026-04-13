import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, Navigate } from "react-router";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { register, isLoading, user } = useAuthStore();

  if (user) return <Navigate to="/" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent z-10 relative py-12 px-6">
      <div className="w-full max-w-2xl bg-glass backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col items-center p-8 sm:p-12">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block hover:scale-105 transition-transform duration-500 mb-6">
            <h1 className="text-5xl font-bold text-primary tracking-tight">
              Think<span className="text-accent">Board</span>
            </h1>
          </Link>
          <p className="text-lg text-base-content/70 font-medium">Let's get you started! 🚀</p>
          <p className="text-sm text-base-content/50 mt-3">Create your account to manage your study notes</p>
        </div>

        <form className="w-full space-y-5 max-w-md" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <label className="label px-0">
              <span className="label-text font-bold text-base text-base-content">Full Name</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="input w-full bg-white/5 border border-base-300 focus:border-primary focus:bg-white/10 text-base-content transition-all duration-700 rounded-xl h-12 px-4 font-medium placeholder:text-base-content/40"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="label px-0">
              <span className="label-text font-bold text-base text-base-content">Email Address</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input w-full bg-white/5 border border-base-300 focus:border-primary focus:bg-white/10 text-base-content transition-all duration-700 rounded-xl h-12 px-4 font-medium placeholder:text-base-content/40"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <p className="text-xs text-base-content/50 font-medium">At least 6 characters</p>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-full h-12 rounded-xl font-bold uppercase tracking-wide text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-none mt-4" 
            disabled={isLoading}
          >
            {isLoading ? <span className="loading loading-spinner loading-sm" /> : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-base-content/60 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:text-accent underline transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
