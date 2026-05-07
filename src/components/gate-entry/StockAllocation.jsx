import { useState } from "react";
import { Package, MapPin, Eye, Edit2, Save, X, AlertCircle, CheckCircle } from "lucide-react";

// Dummy Stock Data
const DUMMY_STOCKS = [
  {
    id: 1,
    grnNumber: "GRN-24101501",
    poNumber: "PO-2024-001",
    productName: "Microcontroller Unit",
    hsn: "8542.31",
    totalQty: 500,
    allocatedQty: 0,
    units: "Pcs",
    warehouseLocation: "A-01",
    receiveDate: "2024-10-15",
    status: "Pending Allocation",
  },
  {
    id: 2,
    grnNumber: "GRN-24101502",
    poNumber: "PO-2024-001",
    productName: "Capacitor 100uF",
    hsn: "8532.24",
    totalQty: 1000,
    allocatedQty: 300,
    units: "Pcs",
    warehouseLocation: "B-02",
    receiveDate: "2024-10-15",
    status: "Partially Allocated",
  },
  {
    id: 3,
    grnNumber: "GRN-24101503",
    poNumber: "PO-2024-002",
    productName: "PCB Board Single Layer",
    hsn: "8534.31",
    totalQty: 250,
    allocatedQty: 250,
    units: "Pcs",
    warehouseLocation: "C-03",
    receiveDate: "2024-10-18",
    status: "Fully Allocated",
  },
];

const WAREHOUSE_LOCATIONS = [
  "A-01", "A-02", "A-03", "B-01", "B-02", "B-03", "C-01", "C-02", "C-03", "D-01", "D-02", "D-03"
];

export default function StockAllocation() {
  const [stocks, setStocks] = useState(DUMMY_STOCKS);
  const [editingId, setEditingId] = useState(null);
  const [allocations, setAllocations] = useState({});
  const [locations, setLocations] = useState({});
  const [viewDetails, setViewDetails] = useState(null);
  const [errors, setErrors] = useState({});

  const handleEdit = (stock) => {
    setEditingId(stock.id);
    setAllocations(prev => ({ ...prev, [stock.id]: stock.allocatedQty }));
    setLocations(prev => ({ ...prev, [stock.id]: stock.warehouseLocation }));
  };

  const validateAllocation = (id, qty) => {
    const stock = stocks.find(s => s.id === id);
    if (!stock) return "";
    
    const allocation = parseInt(qty) || 0;
    if (allocation < 0) return "Quantity cannot be negative";
    if (allocation > stock.totalQty) return `Cannot exceed total quantity (${stock.totalQty})`;
    return "";
  };

  const handleSaveAllocation = (id) => {
    const qty = allocations[id];
    const err = validateAllocation(id, qty);
    
    if (err) {
      setErrors(prev => ({ ...prev, [id]: err }));
      return;
    }

    const stock = stocks.find(s => s.id === id);
    const newQty = parseInt(qty) || 0;
    const newStatus = newQty === 0 ? "Pending Allocation" : newQty === stock.totalQty ? "Fully Allocated" : "Partially Allocated";

    setStocks(prev => prev.map(s => 
      s.id === id 
        ? { ...s, allocatedQty: newQty, warehouseLocation: locations[id] || s.warehouseLocation, status: newStatus }
        : s
    ));

    setEditingId(null);
    setErrors({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setAllocations({});
    setLocations({});
    setErrors({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending Allocation":
        return { bg: "rgba(249,115,22,0.1)", color: "#c2410c", dot: "#ea580c" };
      case "Partially Allocated":
        return { bg: "rgba(59,130,246,0.1)", color: "#1e40af", dot: "#2563eb" };
      case "Fully Allocated":
        return { bg: "rgba(45,110,42,0.1)", color: "#2d6e2a", dot: "#2d6e2a" };
      default:
        return { bg: "rgba(107,114,128,0.1)", color: "#6b7280", dot: "#9ca3af" };
    }
  };

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "#1e293b" }}>
          Stock Allocation
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
          Allocate received stock to warehouse locations
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 32,
      }}>
        {[
          { label: "Total Items", value: stocks.length, color: "#3b82f6" },
          { label: "Pending", value: stocks.filter(s => s.status === "Pending Allocation").length, color: "#ea580c" },
          { label: "Partially Allocated", value: stocks.filter(s => s.status === "Partially Allocated").length, color: "#2563eb" },
          { label: "Fully Allocated", value: stocks.filter(s => s.status === "Fully Allocated").length, color: "#2d6e2a" },
        ].map((card, idx) => (
          <div key={idx} style={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: 20,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              backgroundColor: `${card.color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Package style={{ width: 24, height: 24, color: card.color }} />
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "#64748b" }}>
                {card.label}
              </p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1e293b" }}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Table */}
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
                Total Qty
              </th>
              <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", textAlign: "center" }}>
                Allocated
              </th>
              <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", textAlign: "left" }}>
                Location
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
            {stocks.map((stock) => {
              const statusColor = getStatusColor(stock.status);
              const isEditing = editingId === stock.id;

              return (
                <tr key={stock.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: isEditing ? "#f8fafc" : "inherit" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#1e293b", fontFamily: "monospace" }}>
                        {stock.grnNumber}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                        {stock.productName}
                      </p>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, backgroundColor: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 4 }}>
                      {stock.hsn}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#334155", textAlign: "center" }}>
                    {stock.totalQty} {stock.units}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max={stock.totalQty}
                        value={allocations[stock.id] || 0}
                        onChange={(e) => {
                          setAllocations(prev => ({ ...prev, [stock.id]: e.target.value }));
                          setErrors(prev => ({ ...prev, [stock.id]: "" }));
                        }}
                        style={{
                          width: 80,
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1px solid " + (errors[stock.id] ? "#f87171" : "#e2e8f0"),
                          backgroundColor: errors[stock.id] ? "#fff5f5" : "#fff",
                          fontSize: 13,
                          textAlign: "center",
                          outline: "none",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                        {stock.allocatedQty} {stock.units}
                      </span>
                    )}
                    {errors[stock.id] && (
                      <p style={{ margin: "4px 0 0", fontSize: 10, color: "#ef4444" }}>
                        {errors[stock.id]}
                      </p>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {isEditing ? (
                      <select
                        value={locations[stock.id] || stock.warehouseLocation}
                        onChange={(e) => setLocations(prev => ({ ...prev, [stock.id]: e.target.value }))}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                          fontSize: 13,
                          outline: "none",
                          minWidth: 120,
                        }}
                      >
                        {WAREHOUSE_LOCATIONS.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", backgroundColor: "#f1f5f9", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#475569" }}>
                        <MapPin style={{ width: 14, height: 14 }} />
                        {stock.warehouseLocation}
                      </span>
                    )}
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
                      {stock.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveAllocation(stock.id)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              border: "none",
                              backgroundColor: "#44a83e",
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Save style={{ width: 12, height: 12 }} />
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
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
                            <X style={{ width: 12, height: 12 }} />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(stock)}
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
                            <Edit2 style={{ width: 12, height: 12 }} />
                            Edit
                          </button>
                          <button
                            onClick={() => setViewDetails(stock)}
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
              maxWidth: 500,
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
                Stock Details
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
                { label: "PO Number", value: viewDetails.poNumber, mono: true },
                { label: "Total Quantity", value: `${viewDetails.totalQty} ${viewDetails.units}` },
                { label: "Allocated Quantity", value: `${viewDetails.allocatedQty} ${viewDetails.units}` },
                { label: "Available Quantity", value: `${viewDetails.totalQty - viewDetails.allocatedQty} ${viewDetails.units}` },
                { label: "Warehouse Location", value: viewDetails.warehouseLocation },
                { label: "Receive Date", value: new Date(viewDetails.receiveDate).toLocaleDateString() },
                { label: "Status", value: viewDetails.status, status: true },
              ].map((field, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "#64748b" }}>
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
                      backgroundColor: getStatusColor(field.value).bg,
                      color: getStatusColor(field.value).color,
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: getStatusColor(field.value).dot }} />
                      {field.value}
                    </span>
                  ) : (
                    <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>
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