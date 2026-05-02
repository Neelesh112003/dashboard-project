import { X, Boxes, PackagePlus, Pencil, ArrowRightLeft } from "lucide-react";

const TRANSACTION_META = {
  entry:    { label: "Entry",           color: "#2d6e2a", bg: "rgba(45,110,42,0.12)",   icon: PackagePlus    },
  drawings: { label: "Drawings",        color: "#1d4ed8", bg: "rgba(29,78,216,0.12)",   icon: Pencil         },
  transfer: { label: "Godown Transfer", color: "#7c3aed", bg: "rgba(124,58,237,0.12)",  icon: ArrowRightLeft },
};

const GODOWN_NAMES = {
  "GDN-001": "Main Storage Warehouse",
  "GDN-002": "Raw Material Store",
  "GDN-003": "SMT Component Store",
  "GDN-004": "Scrap Yard",
};

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 dark:border-[#162033] last:border-0 gap-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-right wrap-break-word max-w-[65%]">
        {children}
      </span>
    </div>
  );
}

export default function ViewInventory({ entry, onClose }) {
  if (!entry) return null;

  const isTransfer = entry.transaction === "transfer";
  const txMeta     = TRANSACTION_META[entry.transaction] ?? TRANSACTION_META.entry;
  const TxIcon     = txMeta.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0d1528]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ backgroundColor: "#3a3c44" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(245,245,245,0.15)" }}>
              <Boxes className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">{entry.productName || entry.itemName}</h3>
              <p className="text-xs" style={{ color: "rgba(245,245,245,0.6)" }}>{entry.productCode || "—"}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-1 max-h-[70vh] overflow-y-auto">

          {/* Transaction badge */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-[#162033]">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Transaction</span>
            <span
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: txMeta.bg, color: txMeta.color }}
            >
              <TxIcon className="h-3.5 w-3.5" />
              {txMeta.label}
            </span>
          </div>

          <Row label="Item Name">{entry.itemName || "—"}</Row>
          <Row label="Product Code">{entry.productCode || "—"}</Row>
          <Row label="HSN Code">{entry.productHSN || "—"}</Row>
          <Row label="Product Name">{entry.productName || "—"}</Row>
          <Row label="Alias Name">{entry.productAlias || "—"}</Row>
          <Row label="Quantity">{entry.quantity ? `${entry.quantity} ${entry.unit}` : "—"}</Row>
          <Row label="Rate">
            {entry.rate ? `₹ ${parseFloat(entry.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
          </Row>
          <Row label="Value">
            {entry.value ? `₹ ${parseFloat(entry.value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
          </Row>

          {isTransfer ? (
            <>
              <Row label="From Godown">
                {entry.godownFrom ? `${GODOWN_NAMES[entry.godownFrom] ?? entry.godownFrom} (${entry.godownFrom})` : "—"}
              </Row>
              <Row label="To Godown">
                {entry.godownTo ? `${GODOWN_NAMES[entry.godownTo] ?? entry.godownTo} (${entry.godownTo})` : "—"}
              </Row>
            </>
          ) : (
            <>
              <Row label="Godown">
                {entry.godown ? `${GODOWN_NAMES[entry.godown] ?? entry.godown} (${entry.godown})` : "—"}
              </Row>
              <Row label="Rack">{entry.rack || "—"}</Row>
              <Row label="Section">{entry.section || "—"}</Row>
            </>
          )}

          <Row label="Added On">{entry.addedOn || "—"}</Row>
        </div>
      </div>
    </div>
  );
}