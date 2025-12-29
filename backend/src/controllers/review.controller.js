import Review from "../models/review.js";
import TradeRequest from "../models/tradeRequest.js";
import User from "../models/User.js";

export const createReview = async (req, res) => {
    try {
        const { tradeId, rating, comment } = req.body;
        const reviewerId = req.user.id;

        const trade = await TradeRequest.findById(tradeId);
        if (!trade) {
            return res.status(404).json({ message: "Trade not found" });
        }

        if (trade.status !== "completed") {
            return res.status(400).json({ message: "Can only rate completed trades" });
        }

        // Determine if the reviewer is the sender or receiver
        let revieweeId;
        if (trade.sender.toString() === reviewerId) {
            revieweeId = trade.receiver;
        } else if (trade.receiver.toString() === reviewerId) {
            revieweeId = trade.sender;
        } else {
            return res.status(403).json({ message: "You were not part of this trade" });
        }

        const review = await Review.create({
            reviewer: reviewerId,
            reviewee: revieweeId,
            trade: tradeId,
            rating,
            comment,
        });

        // Update user stats
        const allReviews = await Review.find({ reviewee: revieweeId });
        const totalRating = allReviews.reduce((acc, r) => acc + r.rating, 0);
        await User.findByIdAndUpdate(revieweeId, {
            averageRating: totalRating / allReviews.length,
            totalReviews: allReviews.length,
        });

        res.status(201).json(review);

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "You have already reviewed this trade" });
        }
        res.status(500).json({ message: "Failed to create review" });
    }
};

export const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await Review.find({ reviewee: userId })
            .populate("reviewer", "name email")
            .sort({ createdAt: -1 });

        // Calculate average rating
        const stats = await Review.aggregate([
            { $match: { reviewee: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$reviewee",
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                },
            },
        ]);

        res.json({
            reviews,
            stats: stats[0] || { averageRating: 0, totalReviews: 0 },
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};

import mongoose from "mongoose";
