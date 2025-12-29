import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reviewee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        trade: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TradeRequest",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

// Prevent multiple reviews for the same trade by the same reviewer
reviewSchema.index({ reviewer: 1, trade: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
