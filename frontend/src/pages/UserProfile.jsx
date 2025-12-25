import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState({ sent: [] });

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await API.get("/users/me");
        setCurrentUserId(res.data.id);
      } catch (err) {
        console.error("Failed to fetch my profile:", err);
      }
    };
    fetchMyProfile();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/trade/requests");
        console.log("Trade requests (UserProfile):", res.data);
        if (res.data?.sent) setRequests({ sent: res.data.sent });
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUserProfile();
  }, [id]);

  const handleSendRequest = async (receiverId, skillId) => {
    try {
      await API.post("/trade/request", {
        receiver_id: receiverId,
        skill_id: skillId,
      });
      toast.success("Trade request sent successfully!");

      const res = await API.get("/trade/requests");
      if (res.data?.sent) setRequests({ sent: res.data.sent });
    } catch (err) {
      console.error("Failed to send request:", err);
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to send trade request.";
      toast.error(msg);
    }
  };

  const isRequestPending = (receiverId, skillName) => {
    return requests.sent.some(
      (r) =>
        r.receiver_id === receiverId &&
        r.skill === skillName &&
        r.status === "pending"
    );
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">Loading profile...</p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">{error}</p>
    );

  if (!user)
    return (
      <p className="text-center mt-10 text-gray-600">User not found.</p>
    );

  const isMyProfile = currentUserId === user.id;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="max-w-2xl w-full">

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden mb-8">

          {/* Gradient Banner */}
          <div className="h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          </div>

          <div className="px-8 pb-8 text-center relative">
            {/* Avatar (Overlapping) */}
            <div className="relative -mt-16 mb-4">
              <div className="mx-auto w-32 h-32 rounded-full border-4 border-white shadow-md bg-white text-purple-600 flex items-center justify-center text-5xl font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              @{user.username}
            </h1>
            <p className="text-gray-500 font-medium">{user.email}</p>

            {/* Stats Row */}
            {/* Stats Row */}
            <div className="flex justify-center gap-8 mt-6 mb-2 border-t border-gray-100 pt-6">
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-900">{user.skills?.length || 0}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Skills</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-900">0</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Trades</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-900">0.0</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Rating</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800 px-2">
          Skills Offered
        </h2>

        {user.skills?.length ? (
          <div className="grid grid-cols-1 gap-3">
            {user.skills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-blue-600">
                  {skill.name}
                </h3>
                <p className="text-sm text-gray-700 mt-1">
                  {skill.description || "No description"}
                </p>
                <p className="text-xs text-gray-500 mt-1 italic">
                  Category: {skill.category}
                </p>

                {!isMyProfile && (
                  <button
                    disabled={isRequestPending(user.id, skill.name)}
                    onClick={() => handleSendRequest(user.id, skill.id)}
                    className={`mt-3 px-4 py-2 rounded-lg transition ${isRequestPending(user.id, skill.name)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                  >
                    {isRequestPending(user.id, skill.name)
                      ? "Request Sent"
                      : "Send Request"}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No skills found.</p>
        )}
      </div>
    </div>
  );
}
