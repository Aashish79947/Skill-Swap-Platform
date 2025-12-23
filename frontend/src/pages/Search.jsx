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
      alert("Trade request sent successfully!");
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Failed to send trade request"
      );
    } finally {
      setSendingId(null);
    }
  };

  const filteredSkills = category
    ? skills.filter((s) => s.category === category)
    : skills;

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

        {/* ================= FILTER ================= */}
        <div className="flex justify-center mb-10">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-4 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Filter by category
            </label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-sky-400 outline-none"
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
        </div>

        {/* ================= CONTENT ================= */}
        {loading ? (
          <p className="text-center text-gray-500">
            Loading marketplace…
          </p>
        ) : filteredSkills.length === 0 ? (
          <p className="text-center text-gray-500">
            No skills found for this category.
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
                  disabled={sendingId === skill._id}
                  className={`mt-4 py-2 rounded-lg font-medium transition ${
                    sendingId === skill._id
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {sendingId === skill._id
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
