import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  googleId: { type: String },
  avatar: { type: String },
  authMethod: { 
    type: String, 
    enum: ['local', 'google'], 
    default: 'local' 
  },
  skillsWanted: {
    type: [String],
    default: [],
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
