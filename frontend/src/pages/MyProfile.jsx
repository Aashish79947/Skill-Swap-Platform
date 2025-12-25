import React, { useEffect, useState } from "react";
import API from "../services/api";

import { updateProfile } from "../services/api";
import toast from "react-hot-toast";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [wanted, setWanted] = useState("");
  const [updating, setUpdating] = useState(false);

  /* ================================
     LOAD PROFILE
  ================================= */
  const loadProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data);
      if (res.data.skillsWanted) {
        setWanted(res.data.skillsWanted.join(", "));
      }
    } catch (err) {
      console.error("Profile load error:", err);
      setError("Failed to load profile");
    }
  };

  /* ================================
     LOAD USER SKILLS
  ================================= */
  const loadSkills = async () => {
    try {
      const res = await API.get("/skills/my");
      setSkills(res.data);
    } catch (err) {
      console.error("Skills load error:", err);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      // Convert comma-separated string to array
      const skillsArray = wanted.split(",").map((s) => s.trim()).filter(Boolean);
      await updateProfile({ skillsWanted: skillsArray });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadSkills();
  }, []);

  if (error) {
    return (
      <p className="text-red-500 text-center mt-10">
        {error}
      </p>
    );
  }

  if (!user) return null;

  const initial = user.email?.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">

          {/* Avatar */}
          <div className="mx-auto w-20 h-20 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-3xl font-semibold">
            {initial}
          </div>

          {/* Email */}
          <p className="mt-4 text-lg font-medium text-gray-900">
            {user.email}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            SkillSwap Member
          </p>

          {/* WANTED SKILLS UPDATE */}
          <div className="mt-6 max-w-sm mx-auto text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to learn? (comma separated)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Python, Design, Singing"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                value={wanted}
                onChange={(e) => setWanted(e.target.value)}
              />
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* ================= SKILLS SECTION ================= */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            My Skills
          </h3>

          {skills.length === 0 ? (
            <p className="text-center text-gray-500">
              No skills added yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <div
                  key={skill._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition"
                >
                  <h4 className="font-semibold text-gray-900">
                    {skill.title}
                  </h4>

                  <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full bg-sky-100 text-sky-700">
                    {skill.category}
                  </span>

                  <p className="mt-3 text-sm text-gray-600">
                    {skill.description || "No description provided."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
