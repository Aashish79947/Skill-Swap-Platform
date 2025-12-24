import React, { useEffect, useState } from "react";
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
      alert("Failed to load marketplace");
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
            {filteredSkills.map((skill) => (
              <div
                key={skill._id}
                className="bg-white rounded-2xl border border-gray-200
                           shadow-sm hover:shadow-md transition p-6 flex flex-col"
              >
                {/* TITLE */}
                <h2 className="text-lg font-semibold text-gray-900">
                  {skill.title}
                </h2>

                {/* CATEGORY BADGE */}
                <span className="inline-block mt-2 w-fit text-xs font-medium
                                 px-3 py-1 rounded-full
                                 bg-sky-100 text-sky-700">
                  {skill.category || "Uncategorized"}
                </span>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-600 mt-3 flex-grow">
                  {skill.description || "No description provided."}
                </p>

                {/* USER */}
                <p className="text-xs text-gray-400 mt-4">
                  Posted by {skill.user?.email || "Unknown"}
                </p>

                {/* ACTION */}
                <button
                  onClick={() => handleSendRequest(skill._id)}
                  disabled={
                    sendingId === skill._id ||
                    requestedIds.has(skill._id)
                  }
                  className={`mt-4 py-2 rounded-lg font-medium transition ${
                    requestedIds.has(skill._id)
                      ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                      : sendingId === skill._id
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {requestedIds.has(skill._id)
                    ? "Request Sent"
                    : sendingId === skill._id
                    ? "Sending…"
                    : "Send Trade Request"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
