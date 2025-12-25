import User from "../models/User.js";
import Skill from "../models/skill.js";

// Find "Perfect Matches"
// A match exists if:
// 1. OtherUser offers a skill present in CurrentUser.skillsWanted
// 2. OtherUser wants a skill present in CurrentUser.skillsOffered (optional but better for perfect match)
// Let's start with "They have what I want".

export const findMatches = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get current user's profile and OFFERS
        const currentUser = await User.findById(userId);
        if (!currentUser) return res.status(404).json({ message: "User not found" });

        const myWantedSkills = currentUser.skillsWanted || [];
        if (myWantedSkills.length === 0) {
            return res.json([]); // No desires, no matches
        }

        // Get skills I OFFER
        const myOfferedSkills = await Skill.find({ user: userId });
        const myOfferedTitles = myOfferedSkills.map(s => s.title.toLowerCase());
        const myOfferedCategories = myOfferedSkills.map(s => s.category.toLowerCase());

        // 2. Find Skills offered by OTHERS that match my wanted skills
        // (This part is same: Find Candidates who have what I want)
        const matchConditions = myWantedSkills.map((s) => ({
            $or: [
                { title: { $regex: s, $options: "i" } },
                { category: { $regex: s, $options: "i" } }
            ]
        }));

        const candidates = await Skill.find({
            user: { $ne: userId },
            $or: matchConditions,
        }).populate("user", "name email skillsWanted");

        // 3. Filter Candidates: They MUST want something I offer
        // (Bidirectional Check)
        const matchesMap = new Map();

        candidates.forEach((skill) => {
            const otherUser = skill.user;

            // Check if OtherUser wants any of MY matching skills
            // OtherUser.skillsWanted vs MyOfferedSkills
            const otherUserWants = otherUser.skillsWanted || [];

            const isMutualMatch = otherUserWants.some(wanted => {
                const w = wanted.toLowerCase();
                return myOfferedTitles.some(t => t.includes(w)) ||
                    myOfferedCategories.some(c => c.includes(w));
            });

            if (isMutualMatch) {
                if (!matchesMap.has(otherUser._id.toString())) {
                    matchesMap.set(otherUser._id.toString(), {
                        _id: otherUser._id,
                        name: otherUser.name,
                        email: otherUser.email,
                        skills_offered: [skill],     // What they offer me
                        skills_wanted: otherUserWants // What they want from me
                    });
                } else {
                    matchesMap.get(otherUser._id.toString()).skills_offered.push(skill);
                }
            }
        });

        const matches = Array.from(matchesMap.values());

        res.json(matches);
    } catch (err) {
        console.error("Match error:", err);
        res.status(500).json({ message: "Failed to find matches" });
    }
};
