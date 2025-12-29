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
      return "bg-yellow-100 text-yellow-700";
    if (status === "accepted")
      return "bg-green-100 text-green-700";
    if (status === "rejected")
      return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

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
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        From{" "}
                        <Link
                          to={`/profile/${req.sender?._id}`}
                          className="text-sky-600 hover:underline font-medium"
                        >
                          {req.sender?.email}
                        </Link>
                      </p>

                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Skill:</span>{" "}
                        {req.skill?.title || "N/A"}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusBadge(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </div>

                  {req.status === "pending" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() =>
                          handleAction(req._id, "accept")
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleAction(req._id, "reject")
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {req.status === "accepted" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                        onClick={() => navigate(`/messages/${req._id}`)}
                      >
                        Message
                      </button>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                        onClick={() => handleComplete(req._id)}
                      >
                        Complete
                      </button>
                    </div>
                  )}

                  {req.status === "completed" && (
                    <button
                      className="mt-4 border border-sky-600 text-sky-600 hover:bg-sky-50 px-4 py-1.5 rounded-lg text-sm font-medium transition"
                      onClick={() => {
                        setSelectedTrade(req);
                        setShowRateModal(true);
                      }}
                    >
                      Rate User
                    </button>
                  )}

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
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        To{" "}
                        <Link
                          to={`/profile/${req.receiver?._id}`}
                          className="text-sky-600 hover:underline font-medium"
                        >
                          {req.receiver?.email}
                        </Link>
                      </p>

                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Skill:</span>{" "}
                        {req.skill?.title || "N/A"}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusBadge(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </div>

                  {req.status === "accepted" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                        onClick={() => navigate(`/messages/${req._id}`)}
                      >
                        Message
                      </button>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                        onClick={() => handleComplete(req._id)}
                      >
                        Complete
                      </button>
                    </div>
                  )}

                  {req.status === "completed" && (
                    <button
                      className="mt-4 border border-sky-600 text-sky-600 hover:bg-sky-50 px-4 py-1.5 rounded-lg text-sm font-medium transition"
                      onClick={() => {
                        setSelectedTrade(req);
                        setShowRateModal(true);
                      }}
                    >
                      Rate User
                    </button>
                  )}

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
