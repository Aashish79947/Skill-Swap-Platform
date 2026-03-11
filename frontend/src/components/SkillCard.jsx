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

  const categoryIcons = {
    Programming: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    Design: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
    Marketing: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z",
    Writing: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    Music: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
  };

  const currentIcon = categoryIcons[skill.category] || "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";

  return (
    <div className="glass-card rounded-[2rem] p-8 flex flex-col justify-between h-full group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-2 border-white/60">
      {/* Decorative gradient blob */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-sky-400/20 to-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

      <div className="relative">
        {/* Header: Icon + Category */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform duration-500">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={currentIcon}></path>
            </svg>
          </div>
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-600 border border-sky-100/50">
            {skill.category}
          </span>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-sky-600 transition-colors">
            {skill.title}
          </h3>

          {skill.user?.averageRating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" fill={i < Math.floor(skill.user.averageRating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-bold text-gray-400">
                {skill.user.averageRating.toFixed(1)} ({skill.user.totalReviews})
              </span>
            </div>
          )}

          <p className="mt-4 text-gray-500 text-sm leading-relaxed line-clamp-3">
            {skill.description || "A wonderful skill waitng to be shared."}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-5">
          <div className="flex items-center -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <span className="pl-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experts</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(skill)}
              className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all"
              title="Edit Skill"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Delete Skill"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
