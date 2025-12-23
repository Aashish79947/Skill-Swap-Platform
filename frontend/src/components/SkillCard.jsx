import React from "react";
import { deleteSkill } from "../services/api";

export default function SkillCard({ skill, onDeleted, onEdit }) {
  const handleDelete = async () => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await deleteSkill(skill._id);
      onDeleted?.();
    } catch (err) {
      alert("Could not delete skill");
      console.error(err);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      
      {/* Top Accent */}
      <div className="h-1 bg-gradient-to-r from-sky-400 to-blue-600" />

      <div className="p-6 flex flex-col h-full">
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
          {skill.title}
        </h3>

        {/* Category Badge */}
        <span className="mt-2 inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
          {skill.category}
        </span>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 leading-relaxed flex-grow">
          {skill.description || "No description provided."}
        </p>

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => onEdit(skill)}
            className="px-4 py-1.5 text-sm font-medium rounded-lg
                       bg-yellow-400 hover:bg-yellow-500
                       text-gray-900 transition-colors"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-1.5 text-sm font-medium rounded-lg
                       bg-red-500 hover:bg-red-600
                       text-white transition-colors"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
