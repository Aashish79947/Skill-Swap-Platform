import TradeRequest from "../models/tradeRequest.js";
import Skill from "../models/skill.js";

// Send a trade request
export const sendRequest = async (req, res) => {
    const { skillId } = req.body;

    if (!skillId) {
        return res.status(400).json({ message: "Skill ID is required" });
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
    }

    // ❌ cannot trade with yourself
    if (skill.user.toString() === req.user.id) {
        return res.status(400).json({ message: "You cannot trade with yourself" });
    }

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

    res.status(201).json(request);
};

// Get sent and received requests
export const getRequests = async (req, res) => {
    const userId = req.user.id;

    const sent = await TradeRequest.find({ sender: userId })
        .populate("receiver", "email")
        .populate("skill", "title category");

    const received = await TradeRequest.find({ receiver: userId })
        .populate("sender", "email")
        .populate("skill", "title category");

    res.json({ sent, received });
};

// Accept a trade request
export const acceptRequest = async (req, res) => {
    const request = await TradeRequest.findById(req.params.id);

    if (!request) {
        return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = "accepted";
    await request.save();

    res.json({ message: "Trade accepted" });
};

// Reject a trade request
export const rejectRequest = async (req, res) => {
    const request = await TradeRequest.findById(req.params.id);

    if (!request) {
        return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Trade rejected" });
};
