import React, { useState } from "react";
import toast from "react-hot-toast";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton.jsx";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      toast.error("Please fill all fields before registering.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      });

      toast.success(res.data?.message || "Registered successfully — please login");
      navigate("/login");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        toast.error(detail.map((e) => e.msg).join("\n"));
      } else {
        toast.error(detail || "Registration failed. Please try again.");
      }
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
            Join the Revolution.
          </h2>
          <p className="text-lg text-indigo-100 mb-8 font-light leading-relaxed">
            Create your profile, showcase your talents, and start trading skills today. It's time to unlock a world of possibilities.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition duration-300">
              <h3 className="font-semibold text-xl mb-1">Grow</h3>
              <p className="text-sm text-indigo-200">Expand your skillset rapidly.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition duration-300">
              <h3 className="font-semibold text-xl mb-1">Connect</h3>
              <p className="text-sm text-indigo-200">Network with experts globally.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: REGISTER FORM SECTION */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent text-center mb-6">
            Create Account
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Get started with your free account today.
          </p>

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="johndoe"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50/50 border border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 transition-all outline-none"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>

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

            <button
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 rounded-lg shadow-lg shadow-cyan-500/30 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <GoogleSignInButton />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
