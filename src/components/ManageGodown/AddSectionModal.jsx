import { useState } from "react";
import { X, FolderKanban, CheckCircle } from "lucide-react";

function Field({ label, required, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

export default function AddSectionModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) {
      setError("Section name is required");
      return;
    }

    onAdd?.({
      id: Date.now(),
      name: name.trim(),
      racks: [],
    });

    setName("");
    setError("");
    setSuccessMsg(true);

    setTimeout(() => {
      setSuccessMsg(false);
      onClose?.();
    }, 1200);
  };

  const inputClass = `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 ${
    error ? "border-red-500" : "border-slate-200 dark:border-[#1b2740]"
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0d1528]">
        <div
          className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{
            background: "linear-gradient(135deg, #2f3138 0%, #3a3c44 45%, #4b5563 100%)",
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <FolderKanban className="h-5 w-5 text-white" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Add Section</h2>
            <p className="text-xs text-white/60">
              Create a new storage section for organizing racks
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {successMsg ? (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Section created successfully.
            </div>
          ) : null}

          <div>
            <p className="mb-4 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-[#162033]">
              Section Information
            </p>

            <Field label="Section Name" required error={error}>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Enter section name"
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-slate-100 px-6 py-4 dark:border-[#162033]">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #44a83e 0%, #378f32 50%, #2f7d2b 100%)",
            }}
          >
            <FolderKanban className="h-4 w-4" />
            Add Section
          </button>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#11182b]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}