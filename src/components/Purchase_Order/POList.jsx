import { Trash2, Download, Pencil, Eye, FileText } from "lucide-react";
import { useState }     from "react";
import jsPDF            from "jspdf";
import POForm           from "../Purchase_Order/POForm";
import POInvoice        from "../Purchase_Order/POInvoice";

export default function POList({ poList = [], setPoList }) {
  const [viewPO,    setViewPO]    = useState(null);
  const [editingPO, setEditingPO] = useState(null);

  const handleDelete = (id) => setPoList(prev => prev.filter(po => po.id !== id));

  const handleDownload = (po) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("PURCHASE ORDER", 20, 20);
    doc.setFontSize(12);
    doc.text(`PO Number: ${po.poNumber}`,                              20, 38);
    doc.text(`PO Code:   ${po.poCode || "-"}`,                         20, 48);
    doc.text(`Supplier:  ${po.supplier?.partyName || "-"}`,            20, 58);
    doc.text(`Date:      ${po.poDate || "-"}`,                         20, 68);
    doc.text(`Status:    ${po.status}`,                                20, 78);
    doc.text(`CGST:      ₹ ${(po.cgst || 0).toFixed(2)}`,             20, 90);
    doc.text(`SGST:      ₹ ${(po.sgst || 0).toFixed(2)}`,             20, 100);
    doc.text(`IGST:      ₹ ${(po.igst || 0).toFixed(2)}`,             20, 110);
    doc.text(`Total:     ₹ ${Number(po.finalTotal || po.total || 0).toFixed(2)}`, 20, 120);
    doc.save(`${po.poNumber}.pdf`);
  };

  const handleEditSubmit = (updatedPO) => {
    setPoList(prev => prev.map(p =>
      p.id === editingPO.id ? { ...p, ...updatedPO, status: p.status } : p
    ));
    setEditingPO(null);
  };

  /* ── Edit mode ── */
  if (editingPO) {
    return (
      <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <POForm
          supplier={editingPO.supplier}
          existingPO={editingPO}
          isEdit={true}
          onBack={() => setEditingPO(null)}
          onSubmit={handleEditSubmit}
        />
      </div>
    );
  }

  /* ── List view ── */
  return (
    <>
      {/* Invoice modal for view */}
      {viewPO && <POInvoice po={viewPO} onClose={() => setViewPO(null)} />}

      <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e293b" }}>Purchase Orders</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>
              {poList.length} order{poList.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                {["PO Number", "PO Code", "Supplier", "Date", "Total (₹)", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", fontSize: 11, textAlign: "left", color: "#64748b", fontWeight: 700, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {poList.map((po) => (
                <tr key={po.id} style={{ borderBottom: "1px solid #f1f5f9" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafbff"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>

                  <td style={{ padding: "14px 14px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, backgroundColor: "#f1f5f9", padding: "3px 8px", borderRadius: 6 }}>
                      {po.poNumber}
                    </span>
                  </td>

                  <td style={{ padding: "14px 14px", fontSize: 13, color: "#64748b" }}>{po.poCode || "—"}</td>

                  <td style={{ padding: "14px 14px", fontSize: 13, color: "#1e293b", fontWeight: 500 }}>
                    {po.supplier?.partyName || "—"}
                  </td>

                  <td style={{ padding: "14px 14px", fontSize: 13, color: "#64748b" }}>{po.poDate || "—"}</td>

                  <td style={{ padding: "14px 14px", fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                    ₹ {Number(po.finalTotal || po.total || 0).toFixed(2)}
                  </td>

                  <td style={{ padding: "14px 14px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      backgroundColor: po.status === "Completed" ? "#dcfce7" : po.status === "Cancelled" ? "#fee2e2" : "#fef9c3",
                      color: po.status === "Completed" ? "#166534" : po.status === "Cancelled" ? "#991b1b" : "#92400e",
                    }}>
                      {po.status}
                    </span>
                  </td>

                  <td style={{ padding: "14px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {/* View Invoice */}
                      <button onClick={() => setViewPO(po)} title="View Invoice"
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#3b82f6", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Eye size={13} />
                      </button>
                      {/* Edit */}
                      <button onClick={() => setEditingPO(po)} title="Edit PO"
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Pencil size={13} />
                      </button>
                      {/* Download PDF */}
                      <button onClick={() => handleDownload(po)} title="Download PDF"
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Download size={13} />
                      </button>
                      {/* Delete */}
                      <button onClick={() => handleDelete(po.id)} title="Delete"
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #fecaca", background: "#fff5f5", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {poList.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 60, color: "#94a3b8", fontSize: 14 }}>
                    <FileText size={40} style={{ margin: "0 auto 12px", display: "block", color: "#e2e8f0" }} />
                    No Purchase Orders found. Create one from the "Create PO" tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}