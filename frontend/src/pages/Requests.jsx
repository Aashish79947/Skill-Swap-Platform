import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Requests() {
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
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
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await API.put(`/trade/requests/${id}/${action}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} request`);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Trade Requests
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* RECEIVED */}
        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Received Requests
          </h2>

          {requests.received.length === 0 ? (
            <p className="text-center text-gray-500">
              No received requests
            </p>
          ) : (
            requests.received.map((req) => (
              <div
                key={req._id}
                className="border rounded p-4 mb-3"
              >
                <p>
                  <strong>From:</strong>{" "}
                  <Link
                    to={`/profile/${req.sender?._id}`}
                    className="text-blue-600"
                  >
                    {req.sender?.email}
                  </Link>
                </p>

                <p>
                  <strong>Skill:</strong>{" "}
                  {req.skill?.title || "N/A"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="capitalize">
                    {req.status}
                  </span>
                </p>

                {req.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleAction(req._id, "accept")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(req._id, "reject")}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {req.status === "accepted" && (
                  <button
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() =>
                      navigate(`/messages/${req._id}`) // ✅ FIXED
                    }
                  >
                    Message
                  </button>
                )}
              </div>
            ))
          )}
        </section>

        {/* SENT */}
        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Sent Requests
          </h2>

          {requests.sent.length === 0 ? (
            <p className="text-center text-gray-500">
              No sent requests
            </p>
          ) : (
            requests.sent.map((req) => (
              <div
                key={req._id}
                className="border rounded p-4 mb-3"
              >
                <p>
                  <strong>To:</strong>{" "}
                  <Link
                    to={`/profile/${req.receiver?._id}`}
                    className="text-blue-600"
                  >
                    {req.receiver?.email}
                  </Link>
                </p>

                <p>
                  <strong>Skill:</strong>{" "}
                  {req.skill?.title || "N/A"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="capitalize">
                    {req.status}
                  </span>
                </p>

                {req.status === "accepted" && (
                  <button
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() =>
                      navigate(`/messages/${req._id}`) // ✅ FIXED
                    }
                  >
                    Message
                  </button>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
