import { useState } from "react";
import { X, Grid, CheckCircle, LayoutGrid } from "lucide-react";

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

export default function AddRackModal({ onAdd, onClose }) {
  const initialForm = {
    name: "",
    rows: 2,
    cols: 4,
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Rack name is required";
    else if (form.name.trim().length < 2) e.name = "Min. 2 characters";

    if (!form.rows || form.rows < 1) e.rows = "Rows must be at least 1";
    if (!form.cols || form.cols < 1) e.cols = "Columns must be at least 1";

    return e;
  };

  const handleAdd = () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const total = form.rows * form.cols;

    const spaces = Array.from({ length: total }).map((_, i) => ({
      id: i + 1,
      code: `S${i + 1}`,
      status: "available",
    }));

    onAdd?.({
      id: Date.now(),
      name: form.name,
      spaces,
    });

    setForm(initialForm);
    setErrors({});
    setSuccessMsg(true);

    setTimeout(() => {
      setSuccessMsg(false);
      onClose?.();
    }, 1200);
  };

  const inp = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 ${
      errors[field] ? "border-red-500" : "border-slate-200 dark:border-[#1b2740]"
    }`;

  const totalSpaces = form.rows * form.cols;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0d1528]">
        <div
          className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{
            background: "linear-gradient(135deg, #2f3138 0%, #3a3c44 45%, #4b5563 100%)",
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Grid className="h-5 w-5 text-white" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Add Rack</h2>
            <p className="text-xs text-white/60">
              Configure rack name, layout, and storage preview
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

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            {successMsg ? (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Rack created successfully.
              </div>
            ) : null}

            <div>
              <p className="mb-4 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-[#162033]">
                Rack Information
              </p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Rack Name" required error={errors.name}>
                  <input
                    type="text"
                    placeholder="Enter rack name"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      setErrors({ ...errors, name: "" });
                    }}
                    className={inp("name")}
                  />
                </Field>

                <Field label="Total Spaces">
                  <div className="flex h-11.5 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-200">
                    {totalSpaces} storage spaces
                  </div>
                </Field>

                <Field label="Rows" required error={errors.rows}>
                  <input
                    type="number"
                    min={1}
                    value={form.rows}
                    onChange={(e) => {
                      setForm({ ...form, rows: Number(e.target.value) });
                      setErrors({ ...errors, rows: "" });
                    }}
                    className={inp("rows")}
                  />
                </Field>

                <Field label="Columns" required error={errors.cols}>
                  <input
                    type="number"
                    min={1}
                    value={form.cols}
                    onChange={(e) => {
                      setForm({ ...form, cols: Number(e.target.value) });
                      setErrors({ ...errors, cols: "" });
                    }}
                    className={inp("cols")}
                  />
                </Field>
              </div>
            </div>

            <div>
              <p className="mb-4 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-[#162033]">
                Rack Preview
              </p>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#1b2740] dark:bg-[#11182b]">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <LayoutGrid className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Space layout preview
                </div>

                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${form.cols}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: totalSpaces }).map((_, i) => (
                    <div
                      key={i}
                      className="flex h-10 items-center justify-center rounded-xl border border-green-200 bg-linear-to-br from-green-50 to-emerald-100 text-xs font-semibold text-green-700 dark:border-green-900/40 dark:from-green-900/20 dark:to-emerald-900/10 dark:text-green-400"
                    >
                      S{i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
            <Grid className="h-4 w-4" />
            Add Rack
          </button>

          <button
            onClick={() => {
              setForm(initialForm);
              setErrors({});
            }}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#11182b]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}