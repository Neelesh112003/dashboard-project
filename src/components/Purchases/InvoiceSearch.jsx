import { useState } from "react";
import { Search, FileText, ChevronRight, Hash, Building2, Calendar, Package, AlertCircle } from "lucide-react";

// ── Mock PO database (in real app this comes from your PO store/API) ──────────
const MOCK_PO_DATABASE = [
  {
    poNumber: "PO-448291",
    poCode: "POC-8291",
    poDate: "2025-04-10",
    expectedDeliveryDate: "2025-04-25",
    supplier: {
      partyName: "Ravi Enterprises",
      companyName: "Ravi Electronics Pvt Ltd",
      code: "VND-001",
      address: "123 Electronics Park, Thane",
      city: "Mumbai",
      country: "India",
      gstin: "27AABCU9603R1ZX",
      paymentTerms: "Net 30",
      pincode: "400093",
      email: "rajesh@ravielectronics.com",
    },
    items: [
      { id: 1, productName: "Arduino Uno R3",     poCode: "ARD-UNO-R3",  hsn: "85340000", quantity: "10", unitPrice: "450",  unit: "Pcs" },
      { id: 2, productName: "DHT22 Sensor",        poCode: "SEN-DHT22",   hsn: "90189000", quantity: "20", unitPrice: "280",  unit: "Pcs" },
      { id: 3, productName: "10K Resistor Pack",   poCode: "RES-10K-PKT", hsn: "85334000", quantity: "15", unitPrice: "35",   unit: "Box" },
    ],
    subtotal: 11625,
    discountPercent: 5,
    discountAmount: 581.25,
    cgst: 558.09, cgstPercent: 5,
    sgst: 558.09, sgstPercent: 5,
    igst: 0,      igstPercent: 0,
    totalTax: 1116.18,
    finalTotal: 12159.93,
    total: 12159.93,
  },
  {
    poNumber: "PO-773412",
    poCode: "POC-3412",
    poDate: "2025-04-18",
    expectedDeliveryDate: "2025-05-05",
    supplier: {
      partyName: "Bharat PCB",
      companyName: "Bharat PCB Works",
      code: "VND-002",
      address: "456 Industrial Complex, Whitefield",
      city: "Bangalore",
      country: "India",
      gstin: "29AAACB1234K1ZP",
      paymentTerms: "Net 15",
      pincode: "560001",
      email: "suresh@bharatpcb.com",
    },
    items: [
      { id: 1, productName: "PCB Prototype Board", poCode: "PCB-PROTO-SM",  hsn: "85340090", quantity: "50", unitPrice: "95",  unit: "Pcs" },
      { id: 2, productName: "OLED Display 0.96\"", poCode: "DISP-OLED096", hsn: "90131000", quantity: "30", unitPrice: "320", unit: "Pcs" },
    ],
    subtotal: 14350,
    discountPercent: 0,
    discountAmount: 0,
    cgst: 1291.5, cgstPercent: 9,
    sgst: 1291.5, sgstPercent: 9,
    igst: 0,      igstPercent: 0,
    totalTax: 2583,
    finalTotal: 16933,
    total: 16933,
  },
  {
    poNumber: "PO-102938",
    poCode: "POC-2938",
    poDate: "2025-04-22",
    expectedDeliveryDate: "2025-05-10",
    supplier: {
      partyName: "Shree Packaging Co.",
      companyName: "Shree Packaging Solutions",
      code: "VND-003",
      address: "789 Business Park, Okhla",
      city: "Delhi",
      country: "India",
      gstin: "07AAACB5678M1ZQ",
      paymentTerms: "Net 45",
      pincode: "110001",
      email: "info@shreepackaging.com",
    },
    items: [
      { id: 1, productName: "Bubble Wrap Roll",  poCode: "PKG-BWR-50M", hsn: "39211990", quantity: "100", unitPrice: "850", unit: "Meter" },
      { id: 2, productName: "Corrugated Box A4", poCode: "PKG-BOX-A4",  hsn: "48191000", quantity: "500", unitPrice: "22",  unit: "Pcs" },
    ],
    subtotal: 96000,
    discountPercent: 2,
    discountAmount: 1920,
    cgst: 0,       cgstPercent: 0,
    sgst: 0,       sgstPercent: 0,
    igst: 8643.6,  igstPercent: 9,
    totalTax: 8643.6,
    finalTotal: 102723.6,
    total: 102723.6,
  },
  {
    poNumber: "PO-556677",
    poCode: "POC-6677",
    poDate: "2025-04-28",
    expectedDeliveryDate: "2025-05-15",
    supplier: {
      partyName: "Global Tech Supplies",
      companyName: "Global Tech Supplies Ltd",
      code: "VND-004",
      address: "321 Tech Hub, Taramani",
      city: "Chennai",
      country: "India",
      gstin: "33AAACD9012N1ZR",
      paymentTerms: "Net 30",
      pincode: "600001",
      email: "sales@globaltech.com",
    },
    items: [
      { id: 1, productName: "Raspberry Pi 4B 4GB", poCode: "RPI-4B-4G",   hsn: "84713000", quantity: "8",  unitPrice: "4200", unit: "Pcs" },
      { id: 2, productName: "Servo Motor SG90",    poCode: "MOT-SG90",    hsn: "85013200", quantity: "25", unitPrice: "175",  unit: "Pcs" },
      { id: 3, productName: "9V DC Adapter",       poCode: "PSU-9V-DC",   hsn: "85044000", quantity: "15", unitPrice: "199",  unit: "Pcs" },
    ],
    subtotal: 42160,
    discountPercent: 3,
    discountAmount: 1264.8,
    cgst: 2044.76, cgstPercent: 5,
    sgst: 2044.76, sgstPercent: 5,
    igst: 0,       igstPercent: 0,
    totalTax: 4089.52,
    finalTotal: 44984.72,
    total: 44984.72,
  },
];

export default function InvoiceSearch({ onSelectPO }) {
  const [poQuery, setPoQuery]         = useState("");
  const [supplierQuery, setSupplierQuery] = useState("");
  const [results, setResults]         = useState([]);
  const [searched, setSearched]       = useState(false);
  const [selectedPO, setSelectedPO]   = useState(null);
  const [loading, setLoading]         = useState(false);

  const handleSearch = () => {
    const poQ  = poQuery.trim().toLowerCase();
    const supQ = supplierQuery.trim().toLowerCase();
    if (!poQ && !supQ) return;

    const filtered = MOCK_PO_DATABASE.filter(po => {
      const matchPO  = poQ  ? po.poNumber.toLowerCase().includes(poQ) : true;
      const matchSup = supQ ? po.supplier.partyName.toLowerCase().includes(supQ) : true;
      return matchPO && matchSup;
    });

    setResults(filtered);
    setSearched(true);
    setSelectedPO(null);
  };

  const handleClear = () => {
    setPoQuery(""); setSupplierQuery("");
    setResults([]); setSearched(false); setSelectedPO(null);
  };

  const handleProceed = () => {
    if (!selectedPO) return;
    setLoading(true);
    setTimeout(() => { onSelectPO(selectedPO); setLoading(false); }, 500);
  };

  // ── styles ──
  const s = {
    label: { display: "block", marginBottom: 7, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#3a3c44" },
    input: { width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", backgroundColor: "#f5f5f5" },
  };

  return (
    <div style={{ padding: 36 }}>

      {/* Page intro */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 20, backgroundColor: "#f0fdf4", border: "1px solid #b9f0b4", marginBottom: 12 }}>
          <FileText size={13} style={{ color: "#44a83e" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#44a83e", textTransform: "uppercase", letterSpacing: "0.06em" }}>New Invoice</span>
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "#30333e" }}>Link a Purchase Order</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#3a3c44", lineHeight: 1.6 }}>
          Search by PO Number, Supplier Name, or both — then select a PO to auto-fill the invoice details.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ backgroundColor: "#f5f5f5", borderRadius: 14, border: "1px solid #e2e8f0", padding: 24, marginBottom: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 16, alignItems: "flex-end" }}>

          {/* PO Number */}
          <div>
            <label style={s.label}>
              <Hash size={11} style={{ display: "inline", marginRight: 4 }} />
              PO Number
            </label>
            <input
              type="text"
              placeholder="e.g. PO-448291"
              value={poQuery}
              onChange={(e) => setPoQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={s.input}
              onFocus={(e) => e.target.style.borderColor = "#44a83e"}
              onBlur={(e)  => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          {/* Supplier Name */}
          <div>
            <label style={s.label}>
              <Building2 size={11} style={{ display: "inline", marginRight: 4 }} />
              Supplier Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ravi Enterprises"
              value={supplierQuery}
              onChange={(e) => setSupplierQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={s.input}
              onFocus={(e) => e.target.style.borderColor = "#44a83e"}
              onBlur={(e)  => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleSearch}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 10, border: "none", backgroundColor: "#30333e", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              <Search size={15} /> Search
            </button>
            {searched && (
              <button onClick={handleClear}
                style={{ padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", backgroundColor: "#fff", color: "#3a3c44", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                Clear
              </button>
            )}
          </div>
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 11, color: "#888" }}>
          💡 You can search by either field or combine both for a precise match. Press Enter to search.
        </p>
      </div>

      {/* Results */}
      {searched && results.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 24px", backgroundColor: "#fff8f8", border: "1px dashed #fca5a5", borderRadius: 14 }}>
          <AlertCircle size={36} style={{ color: "#fca5a5", margin: "0 auto 12px" }} />
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#30333e", marginBottom: 6 }}>No Purchase Orders Found</h3>
          <p style={{ margin: 0, fontSize: 13, color: "#3a3c44" }}>Try a different PO number or supplier name.</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#30333e" }}>
              Found <span style={{ color: "#44a83e" }}>{results.length}</span> Purchase Order{results.length !== 1 ? "s" : ""}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#888" }}>Click a row to select</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {results.map((po) => {
              const isSelected = selectedPO?.poNumber === po.poNumber;
              return (
                <div key={po.poNumber}
                  onClick={() => setSelectedPO(isSelected ? null : po)}
                  style={{
                    padding: "18px 22px",
                    borderRadius: 12,
                    border: isSelected ? "2px solid #44a83e" : "1.5px solid #e2e8f0",
                    backgroundColor: isSelected ? "#f0fdf4" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.18s",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr 1fr 1fr auto",
                    gap: 20,
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = "#86efac"; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = "#e2e8f0"; }}>

                  {/* Select indicator */}
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: isSelected ? "6px solid #44a83e" : "2px solid #cbd5e1", transition: "all 0.15s" }} />

                  {/* PO Info */}
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#30333e", fontFamily: "monospace" }}>{po.poNumber}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "#888" }}>Code: {po.poCode}</p>
                  </div>

                  {/* Supplier */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <Building2 size={12} style={{ color: "#888" }} />
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#30333e" }}>{po.supplier.partyName}</p>
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{po.supplier.city} · {po.supplier.paymentTerms}</p>
                  </div>

                  {/* Date + Items */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <Calendar size={12} style={{ color: "#888" }} />
                      <p style={{ margin: 0, fontSize: 12, color: "#3a3c44" }}>{po.poDate}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Package size={12} style={{ color: "#888" }} />
                      <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{po.items.length} item{po.items.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  {/* Total */}
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: isSelected ? "#44a83e" : "#30333e" }}>
                      ₹ {Number(po.finalTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 10, color: "#888", textTransform: "uppercase", fontWeight: 600 }}>Total Value</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PO Detail Preview */}
          {selectedPO && (
            <div style={{ backgroundColor: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 14, padding: 24, marginBottom: 24 }}>
              <p style={{ margin: "0 0 16px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#16a34a", letterSpacing: "0.06em" }}>
                ✓ Selected PO Preview
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {[
                  ["PO Number",    selectedPO.poNumber, true],
                  ["Supplier",     selectedPO.supplier.partyName],
                  ["PO Date",      selectedPO.poDate],
                  ["Delivery",     selectedPO.expectedDeliveryDate],
                  ["Items",        `${selectedPO.items.length} line items`],
                  ["Subtotal",     `₹ ${selectedPO.subtotal?.toFixed(2)}`],
                  ["Tax",          `₹ ${selectedPO.totalTax?.toFixed(2)}`],
                  ["Total",        `₹ ${selectedPO.finalTotal?.toFixed(2)}`],
                ].map(([label, val, mono]) => (
                  <div key={label}>
                    <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#16a34a", letterSpacing: "0.05em" }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#30333e", ...(mono && { fontFamily: "monospace", fontSize: 12 }) }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proceed Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleProceed} disabled={!selectedPO || loading}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 32px", borderRadius: 12, border: "none",
                backgroundColor: selectedPO ? "#30333e" : "#e2e8f0",
                color: selectedPO ? "#fff" : "#888",
                fontSize: 14, fontWeight: 700, cursor: selectedPO ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}>
              {loading ? "Loading..." : "Create Invoice from this PO"}
              {!loading && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* Empty State (before search) */}
      {!searched && (
        <div style={{ textAlign: "center", padding: "52px 24px", backgroundColor: "#f5f5f5", borderRadius: 14, border: "1.5px dashed #e2e8f0" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Search size={32} style={{ color: "#888" }} />
          </div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#30333e", marginBottom: 8 }}>Search for a Purchase Order</h3>
          <p style={{ margin: 0, fontSize: 13, color: "#3a3c44", maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
            Enter a PO number, supplier name, or both above and click <strong>Search</strong> to find matching purchase orders.
          </p>
        </div>
      )}
    </div>
  );
}