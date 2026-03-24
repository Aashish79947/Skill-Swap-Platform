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
                                className="glass-card rounded-[2rem] p-8 flex flex-col justify-between h-full group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-2 border-white/60"
                            >
                                {/* Decorative gradient blob */}
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-sky-400/20 to-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                                <div className="relative">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-sky-500 text-xl font-bold group-hover:scale-110 transition-transform duration-500">
                                            {user.name ? user.name.charAt(0) : user.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-right">
                                            <h3 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-sky-600 transition-colors">
                                                {user.name || "User"}
                                            </h3>
                                            <p className="text-gray-500 text-sm leading-relaxed truncate w-32 ml-auto">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm font-medium text-gray-700 mb-4">
                                        Offers skills you want:
                                    </p>

                                    <div className="space-y-6">
                                        {user.skills_offered.map((skill, index) => (
                                            <div key={skill._id} className={`flex flex-col ${index !== 0 ? 'pt-6 border-t border-gray-100' : ''}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-sky-600 transition-colors line-clamp-2">
                                                        {skill.title}
                                                    </h4>
                                                    <span className="text-xs font-bold px-4 py-1.5 rounded-full capitalize border bg-gray-50 text-gray-600 border-gray-200">
                                                        {skill.category}
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                                                    {skill.description}
                                                </p>

                                                <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-5">
                                                    <div className="flex items-center -space-x-2">
                                                        {[1, 2, 3].map((i) => (
                                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                                                                {String.fromCharCode(64 + i)}
                                                            </div>
                                                        ))}
                                                        <span className="pl-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:inline-block">Experts</span>
                                                    </div>

                                                    <button
                                                        onClick={() => handleConnect(skill._id)}
                                                        disabled={sendingId === skill._id || requestedIds.has(skill._id)}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm ${requestedIds.has(skill._id)
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                                                : sendingId === skill._id
                                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
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
