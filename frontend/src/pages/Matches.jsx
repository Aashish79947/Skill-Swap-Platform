import React, { useEffect, useState } from "react";
import { getMatches, sendTradeRequest, getTradeRequests } from "../services/api";
import toast from "react-hot-toast";

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendingId, setSendingId] = useState(null);
    const [requestedIds, setRequestedIds] = useState(new Set());

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const [matchesRes, requestsRes] = await Promise.all([
                getMatches(),
                getTradeRequests()
            ]);

            setMatches(matchesRes.data);

            // Fetch IDs of skills that already have a pending or accepted request sent by the user
            const sentRequests = requestsRes.data.sent || [];
            const ids = new Set(sentRequests.map(req => req.skill?._id).filter(Boolean));
            setRequestedIds(ids);
        } catch (err) {
            toast.error("Failed to load matches");
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (skillId) => {
        try {
            setSendingId(skillId);
            await sendTradeRequest({ skillId });
            toast.success("Request sent!");
            setRequestedIds(prev => new Set(prev).add(skillId));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send request");
        } finally {
            setSendingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Finding your perfect matches...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfect Matches</h1>
                <p className="text-gray-600 mb-10">
                    These people can teach you what you want to learn!
                </p>

                {matches.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <h3 className="text-xl font-medium text-gray-900">No matches yet</h3>
                        <p className="text-gray-500 mt-2 max-w-md mx-auto">
                            Make sure you have updated your profile with skills you want to learn.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {matches.map((user) => (
                            <div
                                key={user._id}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                                            {user.name ? user.name.charAt(0) : user.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {user.name || "User"}
                                            </h3>
                                            <p className="text-xs text-gray-500 truncate w-32">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-gray-700">
                                            Offers skills you want:
                                        </p>
                                        {user.skills_offered.map((skill) => (
                                            <div
                                                key={skill._id}
                                                className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-medium text-gray-900 text-sm">
                                                        {skill.title}
                                                    </span>
                                                    <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                                                        {skill.category}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2">
                                                    {skill.description}
                                                </p>
                                                <button
                                                    onClick={() => handleConnect(skill._id)}
                                                    disabled={sendingId === skill._id || requestedIds.has(skill._id)}
                                                    className={`mt-3 w-full text-xs py-2 rounded-md font-medium transition ${requestedIds.has(skill._id)
                                                        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                                                        : sendingId === skill._id
                                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                            : "bg-sky-500 hover:bg-sky-600 text-white"
                                                        }`}
                                                >
                                                    {requestedIds.has(skill._id)
                                                        ? "Request Sent"
                                                        : sendingId === skill._id
                                                            ? "Sending..."
                                                            : "Request Trade"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
