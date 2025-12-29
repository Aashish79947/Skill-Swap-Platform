import toast from "react-hot-toast";
import { deleteSkill } from "../services/api";

export default function SkillCard({ skill, onDeleted, onEdit }) {
  const handleDelete = async () => {
    // Custom toast with confirmation
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium text-gray-800">
            Delete <b>{skill.title}</b>?
          </p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete();
              }}
              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  };

  const confirmDelete = async () => {
    const loadingToast = toast.loading("Deleting skill...");
    try {
      await deleteSkill(skill._id);
      toast.success("Skill deleted", { id: loadingToast });
      onDeleted?.();
    } catch (err) {
      toast.error("Could not delete skill", { id: loadingToast });
      console.error(err);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-full group relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

      <div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
          {skill.title}
        </h3>

        {/* Category Badge & Rating */}
        <div className="flex justify-between items-center mt-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
            {skill.category}
          </span>
          {skill.user?.averageRating > 0 && (
            <span className="flex items-center gap-1 text-xs font-semibold text-yellow-600">
              ★ {skill.user.averageRating.toFixed(1)}
              <span className="text-gray-400 font-normal">({skill.user.totalReviews})</span>
            </span>
          )}
        </div>


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
