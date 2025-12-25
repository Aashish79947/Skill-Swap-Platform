import TradeRequest from "../models/tradeRequest.js";
import Skill from "../models/skill.js";
import Notification from "../models/notification.js";
import User from "../models/User.js";

/**
 * @function sendRequest
 * @description Send a new trade request for a specific skill.
 * @route POST /api/trade/request
 * @access Private
 */
export const sendRequest = async (req, res, io) => {
    const { skillId } = req.body;

    if (!skillId) {
        return res.status(400).json({ message: "Skill ID is required" });
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
    }

    // Prevent self-trading
    if (skill.user.toString() === req.user.id) {
        return res.status(400).json({ message: "You cannot trade with yourself" });
    }

    // Check for existing pending request
    const existing = await TradeRequest.findOne({
        sender: req.user.id,
        receiver: skill.user,
        skill: skillId,
        status: "pending",
    });

    if (existing) {
        return res.status(400).json({ message: "Request already sent" });
    }

    const request = await TradeRequest.create({
        sender: req.user.id,
        receiver: skill.user,
        skill: skillId,
    });

    // CREATE NOTIFICATION FOR RECEIVER
    const senderUser = await User.findById(req.user.id);
    const notification = await Notification.create({
        user: skill.user,
        message: `${senderUser.email} sent you a trade request for "${skill.title}"`,
        type: "trade_request",
        link: "/requests",
    });

    // EMIT TO RECEIVER'S PRIVATE ROOM
    if (io) {
        io.to(`user_${skill.user}`).emit("new_notification", notification);
    }

    res.status(201).json(request);
};

/**
 * @function getRequests
 * @description Get all trade requests (sent and received) for the user.
 * @route GET /api/trade/requests
 * @access Private
 */
export const getRequests = async (req, res) => {
    const userId = req.user.id;

    // Fetch outgoing requests
    const sent = await TradeRequest.find({ sender: userId })
        .populate("receiver", "email")
        .populate("skill", "title category");

    // Fetch incoming requests
    const received = await TradeRequest.find({ receiver: userId })
        .populate("sender", "email")
        .populate("skill", "title category");

    res.json({ sent, received });
};

/**
 * @function acceptRequest
 * @description Accept an incoming trade request.
 * @route PUT /api/trade/requests/:id/accept
 * @access Private (Receiver Only)
 */
export const acceptRequest = async (req, res, io) => {
    const request = await TradeRequest.findById(req.params.id);

    if (!request) {
        return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = "accepted";
    await request.save();

    // CREATE NOTIFICATION FOR SENDER
    const notification = await Notification.create({
        user: request.sender,
        message: `Your trade request for skill was accepted!`,
        type: "trade_accepted",
        link: "/requests",
    });

    // EMIT TO SENDER'S PRIVATE ROOM
    if (io) {
        io.to(`user_${request.sender}`).emit("new_notification", notification);
    }

    res.json({ message: "Trade accepted" });
};

/**
 * @function rejectRequest
 * @description Reject an incoming trade request.
 * @route PUT /api/trade/requests/:id/reject
 * @access Private (Receiver Only)
 */
export const rejectRequest = async (req, res, io) => {
    const request = await TradeRequest.findById(req.params.id);

    if (!request) {
        return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = "rejected";
    await request.save();

    // CREATE NOTIFICATION FOR SENDER
    const notification = await Notification.create({
        user: request.sender,
        message: `Your trade request was rejected.`,
        type: "trade_rejected",
        link: "/requests",
    });

    // EMIT TO SENDER'S PRIVATE ROOM
    if (io) {
        io.to(`user_${request.sender}`).emit("new_notification", notification);
    }

    res.json({ message: "Trade rejected" });
};
