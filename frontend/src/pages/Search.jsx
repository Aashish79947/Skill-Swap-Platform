import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getMarketplaceSkills,
  sendTradeRequest,
} from "../services/api";

export default function Search() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [sendingId, setSendingId] = useState(null);

  // ✅ NEW: search state
  const [query, setQuery] = useState("");

  // ✅ track which skills already have request sent
  const [requestedIds, setRequestedIds] = useState(new Set());

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await getMarketplaceSkills();
      setSkills(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load marketplace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSendRequest = async (skillId) => {
    try {
      setSendingId(skillId);
      await sendTradeRequest({ skillId });

      setRequestedIds((prev) => new Set(prev).add(skillId));
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        "Failed to send trade request"
      );
    } finally {
      setSendingId(null);
    }
  };

  // ✅ FILTER: category + search
  const filteredSkills = skills.filter((s) => {
    const matchCategory = category ? s.category === category : true;
    const matchQuery = s.title
      ?.toLowerCase()
      .includes(query.toLowerCase());

    return matchCategory && matchQuery;
  });

  const categoryIcons = {
    Programming: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    Design: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
    Marketing: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z",
    Writing: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    Music: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Skill Marketplace
          </h1>
          <p className="text-gray-500 mt-2">
            Browse skills shared by others and start a trade
          </p>
        </div>

        {/* ================= SEARCH + FILTER ================= */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search skills (e.g. React, Design, Marketing...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-2 rounded-xl border border-gray-300
                       focus:ring-2 focus:ring-sky-400 outline-none shadow-sm"
          />

          {/* CATEGORY FILTER */}
          <select
            className="px-4 py-2 rounded-xl border border-gray-300
                       focus:ring-2 focus:ring-sky-400 outline-none shadow-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Writing">Writing</option>
            <option value="Business">Business</option>
            <option value="Music">Music</option>
          </select>
        </div>

        {/* ================= CONTENT ================= */}
        {loading ? (
          <p className="text-center text-gray-500">
            Loading marketplace…
          </p>
        ) : filteredSkills.length === 0 ? (
          <p className="text-center text-gray-500">
            No skills match your search.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.map((skill) => {
              const currentIcon = categoryIcons[skill.category] || "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
              return (
                <div
                  key={skill._id}
                  className="glass-card rounded-[2rem] p-8 flex flex-col justify-between h-full group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-2 border-white/60 bg-white"
                >
                  {/* Decorative gradient blob */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-sky-400/20 to-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                  <div className="relative">
                    {/* Header: Icon + Category */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform duration-500">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={currentIcon}></path>
                        </svg>
                      </div>
                      <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-600 border border-sky-100/50">
                        {skill.category || "Uncategorized"}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-sky-600 transition-colors">
                        {skill.title}
                      </h3>

                      {/* USER */}
                      <p className="text-xs text-gray-400 mt-2 font-semibold">
                        Posted by {skill.user?.email || "Unknown"}
                      </p>

                      <p className="mt-4 text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {skill.description || "A wonderful skill waitng to be shared."}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-5">
                      <div className="flex items-center -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                        <span className="pl-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:inline-block">Experts</span>
                      </div>

                      <button
                        onClick={() => handleSendRequest(skill._id)}
                        disabled={
                          sendingId === skill._id ||
                          requestedIds.has(skill._id)
                        }
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${requestedIds.has(skill._id)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                          : sendingId === skill._id
                            ? "bg-sky-50 text-sky-300 cursor-not-allowed shadow-none"
                            : "bg-sky-500 hover:bg-sky-400 text-white hover:shadow-sky-500/25 hover:-translate-y-0.5"
                          }`}
                      >
                        {requestedIds.has(skill._id)
                          ? "Sent"
                          : sendingId === skill._id
                            ? "Sending…"
                            : "Trade Request"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
