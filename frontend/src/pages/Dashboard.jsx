import React, { useEffect, useState } from "react";
import { getSkills, addSkill, updateSkill } from "../services/api";
import SkillCard from "../components/SkillCard";

export default function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await getSkills();
      setSkills(res.data);
    } catch (err) {
      console.error(err);
      alert("Could not fetch skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateSkill(editing._id, form);
        setEditing(null);
      } else {
        await addSkill(form);
      }

      setForm({ title: "", description: "", category: "" });
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const startEdit = (skill) => {
    setEditing(skill);
    setForm({
      title: skill.title,
      description: skill.description,
      category: skill.category,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">
            My Skills
          </h2>
          <p className="text-gray-500 mt-1">
            Manage the skills you want to trade with others
          </p>
        </div>

        {/* ADD / EDIT SKILL FORM */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editing ? "Edit Skill" : "Add New Skill"}
          </h3>

          <form onSubmit={submit} className="space-y-4">
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-sky-400 outline-none"
              placeholder="Skill title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-sky-400 outline-none"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Writing">Writing</option>
            </select>

            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-sky-400 outline-none resize-none"
              placeholder="Short description about your skill"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            <div className="flex gap-3 pt-2">
              <button
                className="bg-sky-500 hover:bg-sky-600
                           text-white px-5 py-2 rounded-lg
                           font-medium transition"
              >
                {editing ? "Save Changes" : "Add Skill"}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({
                      title: "",
                      description: "",
                      category: "",
                    });
                  }}
                  className="bg-gray-100 hover:bg-gray-200
                             text-gray-700 px-5 py-2 rounded-lg
                             font-medium transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* SKILLS GRID */}
        {loading ? (
          <p className="text-gray-500 text-center">
            Loading skills…
          </p>
        ) : skills.length === 0 ? (
          <p className="text-gray-500 text-center">
            You haven’t added any skills yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((s) => (
              <SkillCard
                key={s._id}
                skill={s}
                onEdit={startEdit}
                onDeleted={fetchSkills}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
