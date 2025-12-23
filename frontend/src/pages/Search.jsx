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

  // ✅ FIXED: send correct payload
  const handleSendRequest = async (skillId) => {
    try {
      setSendingId(skillId);
      await sendTradeRequest({ skillId }); // ✅ IMPORTANT
      alert("Trade request sent successfully!");
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Skill Marketplace
      </h1>

      {/* CATEGORY FILTER */}
      <div className="flex justify-center mb-8">
        <select
          className="border px-4 py-2 rounded shadow-sm"
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

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : filteredSkills.length === 0 ? (
        <p className="text-center text-gray-500">No skills found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <div
              key={skill._id}
              className="bg-white rounded-2xl shadow p-5 border hover:shadow-md transition"
            >
              {/* TITLE */}
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {skill.title}
              </h2>

              {/* CATEGORY */}
              <p className="text-sm text-gray-600 mb-2">
                Category:{" "}
                <span className="font-semibold text-blue-600">
                  {skill.category || "Not Specified"}
                </span>
              </p>

              {/* DESCRIPTION */}
              <p className="text-gray-600 mb-3">
                {skill.description || "No description provided."}
              </p>

              {/* USER */}
              <p className="text-xs text-gray-400">
                Posted by: {skill.user?.email || "Unknown"}
              </p>

              {/* ACTION */}
              <button
                onClick={() => handleSendRequest(skill._id)}
                disabled={sendingId === skill._id}
                className={`mt-4 px-4 py-2 rounded text-white transition ${
                  sendingId === skill._id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {sendingId === skill._id
                  ? "Sending..."
                  : "Send Trade Request"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
