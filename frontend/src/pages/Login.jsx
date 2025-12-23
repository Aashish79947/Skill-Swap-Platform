import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        
        {/* BRAND */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Skill<span className="text-sky-500">Swap</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to continue
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email address"
            className="w-full border border-gray-300 rounded-lg px-4 py-2
                       focus:ring-2 focus:ring-sky-400 focus:border-sky-400
                       outline-none"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            required
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2
                       focus:ring-2 focus:ring-sky-400 focus:border-sky-400
                       outline-none"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600
                       text-white py-2.5 rounded-lg font-medium
                       transition disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-sky-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
