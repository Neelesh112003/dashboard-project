import { useRef } from "react";
import { Image, FileBadge, CheckCircle, X } from "lucide-react";

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#f5f5f5]/50";

function UploadArea({ label, optional, accept, file, onFile, onClear, icon, hint, drag, onDragOver, onDragLeave, onDrop }) {
  const ref = useRef();
  return (
    <div>
      <label className={labelClass}>
        {label} {optional && <span className="normal-case text-slate-400">(optional)</span>}
      </label>
      <div
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        onClick={() => ref.current.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 transition-all ${
          drag
            ? "border-[#44a83e] bg-[#ccf0ca]/30"
            : "border-slate-200 bg-[#f5f5f5] hover:border-[#44a83e] dark:border-[#162033] dark:bg-[#0d1528]"
        }`}>
        <input ref={ref} type="file" accept={accept} className="hidden"
          onChange={(e) => onFile(e.target.files[0])} />
        {file ? (
          <div className="flex items-center gap-2 text-sm text-[#44a83e]">
            <CheckCircle className="h-4 w-4" />
            <span className="max-w-40 truncate font-medium">{file.name}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); onClear(); }}>
              <X className="h-4 w-4 text-slate-400 hover:text-red-500" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#44a83e]/10">
              {icon}
            </div>
            <p className="text-center text-xs text-slate-500 dark:text-[#f5f5f5]/40">{hint}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductUploads({ productImage, setProductImage, specSheet, setSpecSheet, imageDrag, setImageDrag }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <UploadArea
        label="Product Image" accept="image/*"
        file={productImage} onFile={setProductImage} onClear={() => setProductImage(null)}
        icon={<Image className="h-5 w-5 text-[#44a83e]" />}
        hint={<><span className="font-semibold text-[#44a83e]">Click to upload</span> or drag & drop<br />PNG, JPG, WEBP</>}
        drag={imageDrag}
        onDragOver={(e) => { e.preventDefault(); setImageDrag(true); }}
        onDragLeave={() => setImageDrag(false)}
        onDrop={(e) => { e.preventDefault(); setImageDrag(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) setProductImage(f); }}
      />
      <UploadArea
        label="Specification Sheet" optional accept=".pdf"
        file={specSheet} onFile={setSpecSheet} onClear={() => setSpecSheet(null)}
        icon={<FileBadge className="h-5 w-5 text-[#44a83e]" />}
        hint={<><span className="font-semibold text-[#44a83e]">Click to upload</span> PDF only<br />Max 10MB</>}
      />
    </div>
  );
}