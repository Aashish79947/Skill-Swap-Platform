import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  // FIX: Do not return the entire user object (which includes password hash)
  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  // ... (existing imports and code)
  res.json({ token });
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { skillsWanted, name } = req.body;

    // Build update object
    const updateData = {};
    if (skillsWanted) updateData.skillsWanted = skillsWanted;
    if (name) updateData.name = name;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
