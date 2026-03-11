import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSkills, addSkill, updateSkill, getTradeRequests, getMatches } from "../services/api";
import SkillCard from "../components/SkillCard";

export default function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [requestsCount, setRequestsCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [skillsRes, requestsRes, matchesRes] = await Promise.all([
        getSkills(),
        getTradeRequests(),
        getMatches(),
      ]);
      setSkills(skillsRes.data);
      setRequestsCount(requestsRes.data.length);
      setMatchesCount(matchesRes.data.length);
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateSkill(editing._id, form);
        setEditing(null);
      } else {
        await addSkill(form);
      }

      setForm({ title: "", description: "", category: "" });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  const startEdit = (skill) => {
    setEditing(skill);
    setForm({
      title: skill.title,
      description: skill.description,
      category: skill.category,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Dashboard
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Welcome back! Here's what's happening with your skills.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-sky-600 bg-sky-50 px-4 py-2 rounded-full border border-sky-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            System Active
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Skills", value: skills.length, icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4", color: "blue" },
            { label: "Active Requests", value: requestsCount, icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4", color: "indigo" },
            { label: "Total Matches", value: matchesCount, icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", color: "pink" },
            { label: "Profile Views", value: "248", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", color: "cyan" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 rounded-3xl flex items-center gap-4 hover:translate-y-[-4px] transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 border border-${stat.color}-100`}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon}></path></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* ADD / EDIT SKILL FORM */}
          <div className="lg:col-span-1 sticky top-28">
            <div className="glass-card rounded-3xl p-8 border border-white/60 shadow-xl shadow-sky-900/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-200">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editing ? "Refine Skill" : "List a New Skill"}
                </h3>
              </div>

              <form onSubmit={submit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Skill Title</label>
                  <input
                    className="w-full bg-slate-50/50 border border-gray-200 rounded-2xl px-5 py-3
                               focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all placeholder:text-gray-400"
                    placeholder="e.g. Modern React Development"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
                  <div className="relative">
                    <select
                      className="w-full bg-slate-50/50 border border-gray-200 rounded-2xl px-5 py-3 appearance-none
                                 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Writing">Writing</option>
                      <option value="Music">Music</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Description</label>
                  <textarea
                    className="w-full bg-slate-50/50 border border-gray-200 rounded-2xl px-5 py-3
                               focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all resize-none placeholder:text-gray-400"
                    placeholder="Explain what you can teach..."
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700
                               text-white px-6 py-4 rounded-2xl shadow-lg shadow-sky-200
                               font-bold transition-all active:scale-[0.98]"
                  >
                    {editing ? "Update Skill details" : "Publish Skill"}
                  </button>

                  {editing && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(null);
                        setForm({ title: "", description: "", category: "" });
                      }}
                      className="w-full bg-gray-50 hover:bg-gray-100
                                 text-gray-600 px-6 py-3 rounded-2xl
                                 font-semibold transition-all"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* SKILLS GRID */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Your Expertise</h3>
              <div className="h-px flex-grow bg-gray-100 mx-6 hidden sm:block"></div>
              <span className="text-sm font-semibold text-gray-400">{skills.length} Items</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
                <p className="text-gray-400 font-medium">Fetching your skills...</p>
              </div>
            ) : skills.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" className="text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900">No skills yet</h4>
                <p className="text-gray-500 mt-1 max-w-xs mx-auto">
                  Start by adding a skill on the left to begin trading with others.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {skills.map((s) => (
                  <SkillCard
                    key={s._id}
                    skill={s}
                    onEdit={startEdit}
                    onDeleted={fetchDashboardData}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
