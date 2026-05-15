import { Trash2, X } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
}) {
  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* MODAL */}
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-[#0d1528]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-[#162033]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                {title}
              </h2>
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-[#11182b]"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {message}
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-[#162033]">
          
          {/* CANCEL */}
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300 dark:hover:bg-[#11182b]"
          >
            Cancel
          </button>

          {/* DELETE */}
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}