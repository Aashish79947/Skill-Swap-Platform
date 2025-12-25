import React, { useState } from "react";
import toast from "react-hot-toast";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT: HERO SECTION */}
      <div className="lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative hidden lg:flex items-center justify-center p-12 overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center text-white max-w-lg">
          <div className="mb-8 inline-block p-4 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
            <h1 className="text-5xl font-extrabold tracking-tight mb-2">
              Skill<span className="text-sky-300">Swap</span>
            </h1>
          </div>
          <h2 className="text-3xl font-bold mb-6 leading-tight">
            Master New Skills by Swapping Yours.
          </h2>
          <p className="text-lg text-indigo-100 mb-8 font-light leading-relaxed">
            Join a thriving community of learners and experts. Exchange knowledge, grow your network, and unlock your potential—all for free.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition duration-300">
              <h3 className="font-semibold text-xl mb-1">Interactive</h3>
              <p className="text-sm text-indigo-200">Real-time chats and potential video sessions.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition duration-300">
              <h3 className="font-semibold text-xl mb-1">Community</h3>
              <p className="text-sm text-indigo-200">Connect with like-minded individuals globally.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: LOGIN FORM SECTION */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent text-center mb-6">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Please enter your details to sign in.
          </p>

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="hello@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50/50 border border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 transition-all outline-none"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50/50 border border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 transition-all outline-none"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-cyan-600 hover:text-cyan-500 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 rounded-lg shadow-lg shadow-cyan-500/30 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
