import Message from "../models/message.js";
import TradeRequest from "../models/tradeRequest.js";
import Notification from "../models/notification.js";
import mongoose from "mongoose";

// Get all conversations (inbox)
export const getConversations = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { receiver: userId }],
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$trade",
                    latest_message: { $first: "$text" },
                    timestamp: { $first: "$createdAt" },
                    sender: { $first: "$sender" },
                    receiver: { $first: "$receiver" },
                },
            },
            {
                $addFields: {
                    partner_id: {
                        $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "partner_id",
                    foreignField: "_id",
                    as: "partner",
                },
            },
            { $unwind: "$partner" },
            {
                $project: {
                    conversation_key: "$_id",
                    latest_message: 1,
                    timestamp: 1,
                    partner_email: "$partner.email",
                },
            },
        ]);

        res.json({ conversations });
    } catch (err) {
        console.error("Conversation load error:", err);
        res.status(500).json({ message: "Failed to load conversations" });
    }
};

// Get chat history for a trade
export const getChatHistory = async (req, res) => {
    try {
        const { tradeId } = req.params;

        const trade = await TradeRequest.findById(tradeId);
        if (!trade || trade.status !== "accepted") {
            return res.status(403).json({ message: "Invalid trade" });
        }

        const messages = await Message.find({ trade: tradeId })
            .populate("sender", "email")
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Failed to load chat" });
    }
};

// Send a message (requires io instance)
export const sendMessage = async (req, res, io) => {
    try {
        const { tradeId, text } = req.body;

        const trade = await TradeRequest.findById(tradeId);
        if (!trade || trade.status !== "accepted") {
            return res.status(403).json({ message: "Invalid trade" });
        }

        const receiver =
            trade.sender.toString() === req.user.id ? trade.receiver : trade.sender;

        const message = await Message.create({
            trade: tradeId,
            sender: req.user.id,
            receiver,
            text,
        });

        const populated = await message.populate("sender", "email");

        // Real-time message event for the trade room
        io.to(tradeId).emit("receive_message", populated);

        // CREATE NOTIFICATION FOR RECEIVER
        const notification = await Notification.create({
            user: receiver,
            message: `New message from ${populated.sender.email}`,
            type: "new_message",
            link: `/messages/${tradeId}`, // Assuming structure, though current messages use index/params
        });

        // EMIT TO RECEIVER'S PRIVATE ROOM
        io.to(`user_${receiver}`).emit("new_notification", notification);

        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: "Failed to send message" });
    }
};
