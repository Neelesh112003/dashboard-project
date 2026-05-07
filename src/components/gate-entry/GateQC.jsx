import { useState } from "react";
import { CheckCircle2, AlertCircle, Eye, Filter, Search, X } from "lucide-react";

// Dummy Quality Check Data
const DUMMY_QC_ITEMS = [
  {
    id: 1,
    grnNumber: "GRN-24101501",
    productName: "Microcontroller Unit",
    hsn: "8542.31",
    receivedQty: 500,
    inspectedQty: 450,
    defectiveQty: 50,
    units: "Pcs",
    qcStatus: "Passed with Defects",
    inspecterName: "Rajesh Kumar",
    inspectionDate: "2024-10-15",
    remarks: "50 units found faulty - thermal issues",
  },
  {
    id: 2,
    grnNumber: "GRN-24101502",
    productName: "Capacitor 100uF",
    hsn: "8532.24",
    receivedQty: 1000,
    inspectedQty: 1000,
    defectiveQty: 0,
    units: "Pcs",
    qcStatus: "Passed",
    inspecterName: "Suresh Patil",
    inspectionDate: "2024-10-15",
    remarks: "All items verified and passed QC",
  },
  {
    id: 3,
    grnNumber: "GRN-24101503",
    productName: "PCB Board Single Layer",
    hsn: "8534.31",
    receivedQty: 250,
    inspectedQty: 0,
    defectiveQty: 0,
    units: "Pcs",
    qcStatus: "Pending",
    inspecterName: "-",
    inspectionDate: "-",
    remarks: "Awaiting quality inspection",
  },
  {
    id: 4,
    grnNumber: "GRN-24101504",
    productName: "Solder Wire Lead Free",
    hsn: "7408.11",
    receivedQty: 100,
    inspectedQty: 100,
    defectiveQty: 10,
    units: "Kg",
    qcStatus: "Rejected",
    inspecterName: "Amit Singh",
    inspectionDate: "2024-10-18",
    remarks: "Quality standards not met - contamination detected",
  },
];

export default function QualityControl() {
  const [qcItems, setQcItems] = useState(DUMMY_QC_ITEMS);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const filteredItems = qcItems.filter(item => {
    const text = searchInput.toLowerCase();
    const matchSearch = 
      item.grnNumber.toLowerCase().includes(text) ||
      item.productName.toLowerCase().includes(text) ||
      item.hsn.includes(text);
    const matchStatus = statusFilter ? item.qcStatus === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const handleEditStart = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleEditSave = () => {
    setQcItems(prev => prev.map(item => 
      item.id === editingId ? editForm : item
    ));
    setEditingId(null);
    setEditForm({});
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const getQCStatusColor = (status) => {
    switch (status) {
      case "Passed":
        return { bg: "rgba(45,110,42,0.1)", color: "#2d6e2a", dot: "#2d6e2a" };
      case "Passed with Defects":
        return { bg: "rgba(249,115,22,0.1)", color: "#c2410c", dot: "#ea580c" };
      case "Rejected":
        return { bg: "rgba(239,68,68,0.1)", color: "#b91c1c", dot: "#dc2626" };
      case "Pending":
        return { bg: "rgba(59,130,246,0.1)", color: "#1e40af", dot: "#2563eb" };
      default:
        return { bg: "rgba(107,114,128,0.1)", color: "#6b7280", dot: "#9ca3af" };
    }
  };

  const getPassPercentage = (inspected, defective) => {
    if (inspected === 0) return 0;
    return Math.round(((inspected - defective) / inspected) * 100);
  };

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "#1e293b" }}>
          Quality Control
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
          Monitor and verify quality of received items
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
        marginBottom: 32,
      }}>
        {[
          { label: "Total Items", value: qcItems.length, color: "#3b82f6" },
          { label: "Passed", value: qcItems.filter(i => i.qcStatus === "Passed").length, color: "#2d6e2a" },
          { label: "Defects Found", value: qcItems.filter(i => i.qcStatus === "Passed with Defects").length, color: "#ea580c" },
          { label: "Rejected", value: qcItems.filter(i => i.qcStatus === "Rejected").length, color: "#dc2626" },
          { label: "Pending", value: qcItems.filter(i => i.qcStatus === "Pending").length, color: "#2563eb" },
        ].map((stat, idx) => (
          <div key={idx} style={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: 16,
          }}>
            <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "#64748b" }}>
              {stat.label}
            </p>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 16,
            height: 16,
            color: "#9ca3af",
          }} />
          <input
            type="text"
            placeholder="Search GRN, Product, HSN..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 12px 12px 40px",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              backgroundColor: "#fff",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            borderRadius: 10,
            border: "1px solid " + (showFilter ? "#44a83e" : "#e2e8f0"),
            backgroundColor: showFilter ? "#f0fdf4" : "#fff",
            color: showFilter ? "#44a83e" : "#475569",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <Filter style={{ width: 16, height: 16 }} />
          Filter
        </button>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: 16,
          marginBottom: 24,
        }}>
          <label style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "#64748b", display: "block", marginBottom: 8 }}>
            QC Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 13,
              outline: "none",
            }}
          >
            <option value="">All Status</option>
            <option value="Passed">Passed</option>
            <option value="Passed with Defects">Passed with Defects</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      )}

      {/* QC Items Table */}
      <div style={{
        overflowX: "auto",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        backgroundColor: "#fff",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", textAlign: "left" }}>
                GRN / Product
              </th>
              <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", textAlign: "left" }}>
                HSN Code
              </th>
              <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", textAlign: "center" }}>
                Received
              </th>
              <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", textAlign: "center" }}>
                Inspected
              </th>
              <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", textAlign: "center" }}>
                Defective
              </th>
              <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", textAlign: "center" }}>
                Pass %
              </th>
              <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", textAlign: "left" }}>
                Status
              </th>
              <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", textAlign: "center" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const statusColor = getQCStatusColor(item.qcStatus);
              const passPercent = getPassPercentage(item.inspectedQty, item.defectiveQty);
              const isEditing = editingId === item.id;

              return (
                <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: isEditing ? "#f8fafc" : "inherit" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#1e293b", fontFamily: "monospace" }}>
                        {item.grnNumber}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                        {item.productName}
                      </p>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, backgroundColor: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 4 }}>
                      {item.hsn}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#334155", textAlign: "center" }}>
                    {item.receivedQty}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#334155", textAlign: "center" }}>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max={item.receivedQty}
                        value={editForm.inspectedQty}
                        onChange={(e) => setEditForm({ ...editForm, inspectedQty: parseInt(e.target.value) || 0 })}
                        style={{
                          width: 70,
                          padding: "6px 8px",
                          borderRadius: 6,
                          border: "1px solid #e2e8f0",
                          fontSize: 13,
                          textAlign: "center",
                          outline: "none",
                        }}
                      />
                    ) : (
                      item.inspectedQty
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#ef4444", textAlign: "center" }}>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max={editForm.inspectedQty}
                        value={editForm.defectiveQty}
                        onChange={(e) => setEditForm({ ...editForm, defectiveQty: parseInt(e.target.value) || 0 })}
                        style={{
                          width: 70,
                          padding: "6px 8px",
                          borderRadius: 6,
                          border: "1px solid #e2e8f0",
                          fontSize: 13,
                          textAlign: "center",
                          outline: "none",
                        }}
                      />
                    ) : (
                      item.defectiveQty
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: `${passPercent === 100 ? "#f0fdf4" : passPercent >= 90 ? "#fef3c7" : "#ffecec"}`,
                      position: "relative",
                    }}>
                      <svg style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }} viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke={passPercent === 100 ? "#2d6e2a" : passPercent >= 90 ? "#c2410c" : "#ef4444"}
                          strokeWidth="2"
                          strokeDasharray={`${passPercent * 1.0064} 100.53`}
                        />
                      </svg>
                      <span style={{ fontSize: 13, fontWeight: 700, color: passPercent === 100 ? "#2d6e2a" : passPercent >= 90 ? "#c2410c" : "#ef4444" }}>
                        {passPercent}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      backgroundColor: statusColor.bg,
                      color: statusColor.color,
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: statusColor.dot }} />
                      {item.qcStatus}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleEditSave}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              border: "none",
                              backgroundColor: "#44a83e",
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleEditCancel}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              border: "1px solid #e2e8f0",
                              backgroundColor: "#fff",
                              color: "#475569",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setViewDetails(item)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              border: "1px solid #e2e8f0",
                              backgroundColor: "#fff",
                              color: "#475569",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Eye style={{ width: 12, height: 12 }} />
                            View
                          </button>
                          <button
                            onClick={() => handleEditStart(item)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              border: "1px solid #e2e8f0",
                              backgroundColor: "#fff",
                              color: "#475569",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {viewDetails && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setViewDetails(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 550,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              backgroundColor: "#fff",
              animation: "slideUp 0.3s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            <div style={{ padding: "20px 24px", backgroundColor: "#44a83e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>
                Quality Control Details
              </h3>
              <button
                onClick={() => setViewDetails(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              {[
                { label: "GRN Number", value: viewDetails.grnNumber, mono: true },
                { label: "Product Name", value: viewDetails.productName },
                { label: "HSN Code", value: viewDetails.hsn, mono: true },
                { label: "Received Quantity", value: `${viewDetails.receivedQty} ${viewDetails.units}` },
                { label: "Inspected Quantity", value: `${viewDetails.inspectedQty} ${viewDetails.units}` },
                { label: "Defective Quantity", value: `${viewDetails.defectiveQty} ${viewDetails.units}` },
                { label: "Pass Percentage", value: `${getPassPercentage(viewDetails.inspectedQty, viewDetails.defectiveQty)}%` },
                { label: "QC Status", value: viewDetails.qcStatus, status: true },
                { label: "Inspector Name", value: viewDetails.inspecterName },
                { label: "Inspection Date", value: viewDetails.inspectionDate === "-" ? "-" : new Date(viewDetails.inspectionDate).toLocaleDateString() },
                { label: "Remarks", value: viewDetails.remarks },
              ].map((field, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "#64748b", marginRight: 12 }}>
                    {field.label}
                  </span>
                  {field.mono ? (
                    <span style={{ fontFamily: "monospace", fontSize: 13, backgroundColor: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 4 }}>
                      {field.value}
                    </span>
                  ) : field.status ? (
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      backgroundColor: getQCStatusColor(field.value).bg,
                      color: getQCStatusColor(field.value).color,
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: getQCStatusColor(field.value).dot }} />
                      {field.value}
                    </span>
                  ) : (
                    <span style={{ fontSize: 13, color: "#334155", fontWeight: 500, textAlign: "right", maxWidth: 250, wordBreak: "break-word" }}>
                      {field.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}