import Skill from "../models/skill.js";

// Create a new skill
export const createSkill = async (req, res) => {
    const { title, description, category } = req.body;

    if (!category) {
        return res.status(400).json({ message: "Category is required" });
    }

    const skill = await Skill.create({
        title,
        description,
        category,
        user: req.user.id,
    });

    res.status(201).json(skill);
};

// Get current user's skills
export const getMySkills = async (req, res) => {
    try {
        const skills = await Skill.find({ user: req.user.id });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch skills" });
    }
};

// Get marketplace skills (others' skills)
export const getMarketplace = async (req, res) => {
    const skills = await Skill.find({
        user: { $ne: req.user.id },
    }).populate("user", "name email");

    res.json(skills);
};

// Update a skill
export const updateSkill = async (req, res) => {
    const { title, description, category } = req.body;

    const skill = await Skill.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { title, description, category },
        { new: true }
    );

    if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
    }

    res.json(skill);
};

// Delete a skill
export const deleteSkill = async (req, res) => {
    try {
        await Skill.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        res.json({ message: "Skill removed" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete skill" });
    }
};
