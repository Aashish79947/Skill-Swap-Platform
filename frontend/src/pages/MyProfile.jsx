import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");

  /* ================================
     LOAD PROFILE
  ================================= */
  const loadProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data);
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
