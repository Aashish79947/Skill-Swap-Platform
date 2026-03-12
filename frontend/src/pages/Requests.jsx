import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Requests() {
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();


  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/trade/requests");

      setRequests({
        received: res.data.received || [],
        sent: res.data.sent || [],
      });
    } catch (err) {
      console.error("Failed to fetch requests", err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await API.put(`/trade/requests/${id}/${action}`);
      fetchRequests();
      toast.success(`Request ${action}ed`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} request`);
    }
  };

  const handleComplete = async (id) => {
    try {
      await API.put(`/trade/requests/${id}/complete`);
      fetchRequests();
      toast.success("Trade marked as completed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete trade");
    }
  };

  const handleRate = async () => {
    try {
      await API.post("/reviews", {
        tradeId: selectedTrade._id,
        rating,
        comment,
      });
      toast.success("Review submitted!");
      setShowRateModal(false);
      setComment("");
      setRating(5);
    } catch (err) {
      toast.error(err.message || "Failed to submit review");
    }
  };


  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500 py-10">
        Loading trade requests…
      </p>
    );
  }

  /* ---------- STATUS BADGE ---------- */
  const statusBadge = (status) => {
    if (status === "pending")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (status === "accepted")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "rejected")
      return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  const categoryIcons = {
    Programming: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    Design: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
    Marketing: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z",
    Writing: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    Music: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
  };

  const getIcon = (category) => categoryIcons[category] || "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
        Trade Requests
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ================= RECEIVED ================= */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center">
            Received Requests
          </h2>

          {requests.received.length === 0 ? (
            <p className="text-center text-gray-500">
              No received requests
            </p>
          ) : (
            <div className="space-y-4">
              {requests.received.map((req) => (
                <div
                  key={req._id}
                  className="glass-card rounded-[2rem] p-8 flex flex-col justify-between h-full group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-2 border-white/60"
                >
                  {/* Decorative gradient blob */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-sky-400/20 to-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                  <div className="relative">
                    {/* Header: Icon + Status */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform duration-500">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={getIcon(req.skill?.category)}></path>
                        </svg>
                      </div>
                      <span
                        className={`text-xs font-bold px-4 py-1.5 rounded-full capitalize border ${statusBadge(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-sky-600 transition-colors line-clamp-2">
                        {req.skill?.title || "N/A"}
                      </h3>

                      <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                        From{" "}
                        <Link
                          to={`/profile/${req.sender?._id}`}
                          className="text-sky-600 hover:underline font-medium"
                        >
                          {req.sender?.email}
                        </Link>
                      </p>
                    </div>

                    {/* Footer / Actions */}
                    <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-5">
                      <div className="flex items-center -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                        <span className="pl-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:inline-block">Experts</span>
                      </div>

                      <div className="flex gap-2">
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAction(req._id, "accept")}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-medium transition-all shadow-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAction(req._id, "reject")}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-medium transition-all shadow-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {req.status === "accepted" && (
                          <>
                            <button
                              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-medium transition-all shadow-sm"
                              onClick={() => navigate(`/messages/${req._id}`)}
                            >
                              Message
                            </button>
                            <button
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-medium transition-all shadow-sm"
                              onClick={() => handleComplete(req._id)}
                            >
                              Complete
                            </button>
                          </>
                        )}
                        {req.status === "completed" && (
                          <button
                            className="px-3 py-1.5 border border-sky-600 text-sky-600 hover:bg-sky-50 rounded-xl text-xs font-medium transition-all"
                            onClick={() => {
                              setSelectedTrade(req);
                              setShowRateModal(true);
                            }}
                          >
                            Rate User
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= SENT ================= */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center">
            Sent Requests
          </h2>

          {requests.sent.length === 0 ? (
            <p className="text-center text-gray-500">
              No sent requests
            </p>
          ) : (
            <div className="space-y-4">
              {requests.sent.map((req) => (
                <div
                  key={req._id}
                  className="glass-card rounded-[2rem] p-8 flex flex-col justify-between h-full group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-2 border-white/60"
                >
                  {/* Decorative gradient blob */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-sky-400/20 to-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                  <div className="relative">
                    {/* Header: Icon + Status */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform duration-500">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={getIcon(req.skill?.category)}></path>
                        </svg>
                      </div>
                      <span
                        className={`text-xs font-bold px-4 py-1.5 rounded-full capitalize border ${statusBadge(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-sky-600 transition-colors line-clamp-2">
                        {req.skill?.title || "N/A"}
                      </h3>

                      <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                        To{" "}
                        <Link
                          to={`/profile/${req.receiver?._id}`}
                          className="text-sky-600 hover:underline font-medium"
                        >
                          {req.receiver?.email}
                        </Link>
                      </p>
                    </div>

                    {/* Footer / Actions */}
                    <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-5">
                      <div className="flex items-center -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                        <span className="pl-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:inline-block">Experts</span>
                      </div>

                      <div className="flex gap-2">
                        {req.status === "accepted" && (
                          <>
                            <button
                              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-medium transition-all shadow-sm"
                              onClick={() => navigate(`/messages/${req._id}`)}
                            >
                              Message
                            </button>
                            <button
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-medium transition-all shadow-sm"
                              onClick={() => handleComplete(req._id)}
                            >
                              Complete
                            </button>
                          </>
                        )}
                        {req.status === "completed" && (
                          <button
                            className="px-3 py-1.5 border border-sky-600 text-sky-600 hover:bg-sky-50 rounded-xl text-xs font-medium transition-all"
                            onClick={() => {
                              setSelectedTrade(req);
                              setShowRateModal(true);
                            }}
                          >
                            Rate User
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* RATING MODAL */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl scale-in-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Rate your trade Experience</h3>
            <p className="text-sm text-gray-500 mb-6">
              How was your trade with {selectedTrade?.sender?.email === selectedTrade?.partner_email ? selectedTrade?.receiver?.email : (selectedTrade?.partner_email || "the partner")}?
            </p>

            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl transition ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a comment (optional)"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-400 outline-none h-24 mb-6"
            />

            <div className="flex gap-3">
              <button
                onClick={handleRate}
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 rounded-xl transition"
              >
                Submit Rating
              </button>
              <button
                onClick={() => setShowRateModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
