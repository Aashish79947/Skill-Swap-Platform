import Skill from "../models/skill.js";

/**
 * @function createSkill
 * @description Create a new skill to offer in the marketplace.
 * @route POST /api/skills
 * @access Private
 */
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

/**
 * @function getMySkills
 * @description Get all skills offered by the current user (Dashboard).
 * @route GET /api/skills/my
 * @access Private
 */
export const getMySkills = async (req, res) => {
    try {
        const skills = await Skill.find({ user: req.user.id });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch skills" });
    }
};

/**
 * @function getMarketplace
 * @description Get all skills offered by OTHER users.
 * @route GET /api/skills/marketplace
 * @access Private
 */
export const getMarketplace = async (req, res) => {
    const skills = await Skill.find({
        user: { $ne: req.user.id },
    }).populate("user", "name email");

    res.json(skills);
};

/**
 * @function updateSkill
 * @description Update details of an existing skill.
 * @route PUT /api/skills/:id
 * @access Private (Owner Only)
 */
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

/**
 * @function deleteSkill
 * @description Remove a skill from the marketplace.
 * @route DELETE /api/skills/:id
 * @access Private (Owner Only)
 */
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
