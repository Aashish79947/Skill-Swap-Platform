import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @function register
 * @description Registers a new user with hashed password.
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      password: hashed,
      authMethod: 'local'
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ 
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authMethod: user.authMethod
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

/**
 * @function login
 * @description Authenticates user and issues a JWT token.
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Check if user registered with Google
    if (user.authMethod === 'google') {
      return res.status(400).json({ 
        msg: "Please use Google Sign-In for this account" 
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authMethod: user.authMethod,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

/**
 * @function getProfile
 * @description Retrieves current user's profile excluding password.
 * @route GET /api/auth/profile
 * @access Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
};

/**
 * @function updateProfile
 * @description Updates user profile fields (e.g., name, skillsWanted).
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { skillsWanted, name } = req.body;

    // Explicitly build update object for security
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

/**
 * @function googleAuth
 * @description Initiates Google OAuth flow
 * @route GET /api/auth/google
 * @access Public
 */
export const googleAuth = (req, res, next) => {
  // This will be handled by passport middleware
};

/**
 * @function googleCallback
 * @description Handles Google OAuth callback and issues JWT
 * @route GET /api/auth/google/callback
 * @access Public
 */
export const googleCallback = async (req, res) => {
  try {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/auth/error`);
  }
};
