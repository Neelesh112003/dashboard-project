import {
  Package,
  X,
  Hash,
  Tags,
  Boxes,
  FolderTree,
  Layers3,
  ToggleLeft,
  FileText,
  Shapes,
} from "lucide-react";

export default function ProductViewModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  const details = [
    { label: "Product Code", value: product.productCode, icon: Hash },
    { label: "Product HSN", value: product.productHsn, icon: Hash },
    { label: "Product Name", value: product.productName, icon: Package },
    { label: "Type", value: product.type, icon: Shapes },
    { label: "Category", value: product.category, icon: Tags },
    { label: "Product Group", value: product.productGroup, icon: Boxes },
    { label: "HSN Group Name", value: product.hsnGroupName, icon: FolderTree },
    { label: "HSN Group Code", value: product.hsnGroupCode, icon: Hash },
    { label: "Sub-Type", value: product.subType, icon: Layers3 },
    { label: "Sub-Category", value: product.subCategory, icon: Tags },
    {
      label: "Product Status",
      value: product.productStatus,
      icon: ToggleLeft,
      isStatus: true,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[70vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0d1528] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-5 shrink-0"
          style={{ backgroundColor: "#44a83e" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(245,245,245,0.15)" }}
            >
              <Package className="h-5 w-5 text-white" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#f5f5f5]">
                {product.productName}
              </h3>
              <p className="text-xs text-white/60">Product Details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {details.map(({ label, value, icon: Icon, isStatus }) => (
              <div
                key={label}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-[#162033] dark:bg-[#11182b]"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                  </span>
                </div>

                {isStatus ? (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold ${
                      product.productStatus === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        product.productStatus === "active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    {product.productStatus === "active" ? "Active" : "Inactive"}
                  </span>
                ) : (
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {value || "-"}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-[#162033] dark:bg-[#11182b]">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Product Details
              </h4>
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {product.productDetails || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
