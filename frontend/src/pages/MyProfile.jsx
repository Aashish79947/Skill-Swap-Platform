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

  /* ================================
     RUN ON PAGE LOAD
  ================================= */
  useEffect(() => {
    loadProfile();
    loadSkills();
  }, []);

  /* ================================
     UI STATES
  ================================= */
  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!user) return null;

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold">@</div>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <h3 className="text-xl font-semibold mb-4">My Skills</h3>

        {skills.length === 0 ? (
          <p className="text-gray-500">No skills added yet.</p>
        ) : (
          <div className="space-y-3">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="border rounded p-3 bg-gray-50"
              >
                <h4 className="font-semibold">{skill.title}</h4>
                <p className="text-sm text-gray-600">
                  Category: {skill.category}
                </p>
                <p className="text-sm">{skill.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
