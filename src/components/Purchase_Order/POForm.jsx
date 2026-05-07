import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, RefreshCw, X } from "lucide-react";
import { createPortal } from "react-dom";

// ── Product catalogue ─────────────────────────────────────────────────────────
const PRODUCT_CATALOGUE = [
  { productName: "Arduino Uno R3",      poCode: "ARD-UNO-R3",   hsn: "85340000", unitPrice: 450,   unit: "Pcs" },
  { productName: "Raspberry Pi 4B 4GB", poCode: "RPI-4B-4G",    hsn: "84713000", unitPrice: 4200,  unit: "Pcs" },
  { productName: "16x2 LCD Display",    poCode: "LCD-16X2",      hsn: "90131000", unitPrice: 120,   unit: "Pcs" },
  { productName: "DHT22 Sensor",        poCode: "SEN-DHT22",     hsn: "90189000", unitPrice: 280,   unit: "Pcs" },
  { productName: "10K Resistor Pack",   poCode: "RES-10K-PKT",   hsn: "85334000", unitPrice: 35,    unit: "Box" },
  { productName: "Jumper Wires (M-M)",  poCode: "WIR-JMP-MM",    hsn: "85444200", unitPrice: 60,    unit: "Pcs" },
  { productName: "9V DC Adapter",       poCode: "PSU-9V-DC",     hsn: "85044000", unitPrice: 199,   unit: "Pcs" },
  { productName: "PCB Prototype Board", poCode: "PCB-PROTO-SM",  hsn: "85340090", unitPrice: 95,    unit: "Pcs" },
  { productName: "Servo Motor SG90",    poCode: "MOT-SG90",      hsn: "85013200", unitPrice: 175,   unit: "Pcs" },
  { productName: "OLED Display 0.96\"", poCode: "DISP-OLED096",  hsn: "90131000", unitPrice: 320,   unit: "Pcs" },
  { productName: "Bubble Wrap Roll",    poCode: "PKG-BWR-50M",   hsn: "39211990", unitPrice: 850,   unit: "Meter" },
  { productName: "Corrugated Box A4",   poCode: "PKG-BOX-A4",    hsn: "48191000", unitPrice: 22,    unit: "Pcs" },
];

const DUMMY_SUPPLIERS = [
  { id: 1, code: "VND-001", partyName: "Ravi Enterprises", companyName: "Ravi Electronics Pvt Ltd", city: "Mumbai", state: "Maharashtra", country: "India", pincode: "400093", gstin: "27AABCU9603R1ZX", contact: "+91 98201 44312", email: "rajesh@ravielectronics.com", contactPersonName: "Rajesh Kumar", paymentTerms: "Net 30", address: "123 Electronics Park, Thane" },
  { id: 2, code: "VND-002", partyName: "Bharat PCB", companyName: "Bharat PCB Works", city: "Bangalore", state: "Karnataka", country: "India", pincode: "560001", gstin: "29AAACB1234K1ZP", contact: "+91 80501 22134", email: "suresh@bharatpcb.com", contactPersonName: "Suresh Patil", paymentTerms: "Net 15", address: "456 Industrial Complex, Whitefield" },
  { id: 3, code: "VND-003", partyName: "Shree Packaging Co.", companyName: "Shree Packaging Solutions", city: "Delhi", state: "Delhi", country: "India", pincode: "110001", gstin: "07AAACB5678M1ZQ", contact: "+91 11 4567 8900", email: "info@shreepackaging.com", contactPersonName: "Amit Singh", paymentTerms: "Net 45", address: "789 Business Park, Okhla" },
  { id: 4, code: "VND-004", partyName: "Global Tech Supplies", companyName: "Global Tech Supplies Ltd", city: "Chennai", state: "Tamil Nadu", country: "India", pincode: "600001", gstin: "33AAACD9012N1ZR", contact: "+91 44 4321 0987", email: "sales@globaltech.com", contactPersonName: "Priya Sharma", paymentTerms: "Net 30", address: "321 Tech Hub, Taramani" },
];

// ── Styles ────────────────────────────────────────────────────────────────────
const labelStyle = {
  display: "block", marginBottom: 6, fontSize: 11,
  fontWeight: 600, textTransform: "uppercase", color: "#64748b",
};
const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: "1px solid #e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box",
};

// ── TaxRow ────────────────────────────────────────────────────────────────────
function TaxRow({ label, percent, setPercent, amount, setAmount, base }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{label}</span>
      <input type="number" value={percent} placeholder="%" style={{ ...inputStyle, padding: "8px 10px" }}
        onChange={(e) => { const p = parseFloat(e.target.value)||0; setPercent(p); setAmount((base*p)/100); }} />
      <input type="number" value={amount} placeholder="₹" style={{ ...inputStyle, padding: "8px 10px" }}
        onChange={(e) => { const a = parseFloat(e.target.value)||0; setAmount(a); setPercent(base ? (a/base)*100 : 0); }} />
    </div>
  );
}

// ── ProductSearch ─────────────────────────────────────────────────────────────
function ProductSearch({ item, idx, errors, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(item.productName || "");
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  useEffect(() => { setQuery(item.productName || ""); }, [item.productName]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const matches = query.trim()
    ? PRODUCT_CATALOGUE.filter(p =>
        p.productName.toLowerCase().includes(query.toLowerCase()) ||
        p.poCode.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = (prod) => {
    setQuery(prod.productName);
    setOpen(false);
    onChange(item.id, { productName: prod.productName, poCode: prod.poCode, hsn: prod.hsn, unitPrice: prod.unitPrice, unit: prod.unit });
  };

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 160 }}>
      <input
        type="text" placeholder="Product name" value={query}
        onChange={(e) => {
          const val = e.target.value; setQuery(val);
          onChange(item.id, { productName: val });
          const rect = e.target.getBoundingClientRect();
          setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
          setOpen(true);
        }}
        onFocus={(e) => {
          const rect = e.target.getBoundingClientRect();
          setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
          if (query) setOpen(true);
        }}
        style={{ ...inputStyle, padding: "8px 12px", border: "1px solid " + (errors[`product_${idx}`] ? "#f87171" : "#e2e8f0"), backgroundColor: errors[`product_${idx}`] ? "#fff5f5" : "#fff" }}
      />
      {errors[`product_${idx}`] && <p style={{ margin: "2px 0 0", fontSize: 10, color: "#ef4444" }}>Required</p>}
      {open && matches.length > 0 && createPortal(
        <div style={{ position: "absolute", top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 9999, backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", maxHeight: 260, overflowY: "auto" }}>
          {matches.map((prod) => (
            <div key={prod.poCode} onMouseDown={() => handleSelect(prod)}
              style={{ padding: "10px 14px", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{prod.productName}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{prod.poCode} · HSN {prod.hsn} · ₹{prod.unitPrice}</div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

// ── ChangeSupplierModal ───────────────────────────────────────────────────────
function ChangeSupplierModal({ onSelect, onClose }) {
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? DUMMY_SUPPLIERS.filter(s =>
        s.partyName.toLowerCase().includes(query.toLowerCase()) ||
        s.companyName.toLowerCase().includes(query.toLowerCase()) ||
        s.code.toLowerCase().includes(query.toLowerCase()))
    : DUMMY_SUPPLIERS;

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}>
      <div style={{ backgroundColor: "#fff", borderRadius: 16, width: "100%", maxWidth: 540, boxShadow: "0 24px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>Change Supplier</h3>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Select a new supplier for this PO</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9" }}>
          <input type="text" placeholder="Search by name, company or code..." value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ ...inputStyle, backgroundColor: "#f8fafc" }} autoFocus />
        </div>

        {/* Supplier List */}
        <div style={{ maxHeight: 360, overflowY: "auto" }}>
          {filtered.map((s) => (
            <button key={s.id} onClick={() => { onSelect(s); onClose(); }}
              style={{ width: "100%", padding: "14px 24px", border: "none", borderBottom: "1px solid #f8fafc", backgroundColor: "transparent", textAlign: "left", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{s.partyName}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: "#64748b" }}>{s.companyName} · {s.code} · {s.city}</p>
                </div>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, backgroundColor: "#f0fdf4", color: "#16a34a", fontWeight: 600 }}>Select</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Main POForm ───────────────────────────────────────────────────────────────
export default function POForm({ supplier, onBack, onSubmit, existingPO, isEdit }) {
  const [poNumber, setPoNumber] = useState(existingPO?.poNumber || `PO-${Date.now().toString().slice(-6)}`);
  const [poDate,   setPoDate]   = useState(existingPO?.poDate   || new Date().toISOString().split("T")[0]);
  const [poCode,   setPoCode]   = useState(existingPO?.poCode   || `POC-${Date.now().toString().slice(-4)}`);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(existingPO?.expectedDeliveryDate || "");

  const [cgstPercent, setCgstPercent] = useState(existingPO?.cgstPercent || 0);
  const [cgstAmount,  setCgstAmount]  = useState(existingPO?.cgst || 0);
  const [sgstPercent, setSgstPercent] = useState(existingPO?.sgstPercent || 0);
  const [sgstAmount,  setSgstAmount]  = useState(existingPO?.sgst || 0);
  const [igstPercent, setIgstPercent] = useState(existingPO?.igstPercent || 0);
  const [igstAmount,  setIgstAmount]  = useState(existingPO?.igst || 0);

  const initSupplier = existingPO?.supplier || supplier;
  const [formData, setFormData] = useState({
    partyName:    initSupplier?.partyName    || "",
    companyName:  initSupplier?.companyName  || "",
    code:         initSupplier?.code         || "",
    address:      initSupplier?.address      || "",
    city:         initSupplier?.city         || "",
    country:      initSupplier?.country      || "",
    gstin:        initSupplier?.gstin        || "",
    paymentTerms: initSupplier?.paymentTerms || "",
    pincode:      initSupplier?.pincode      || "",
    email:        initSupplier?.email        || "",
  });

  const [items, setItems] = useState(existingPO?.items || [{
    id: 1, productName: "", poCode: "", hsn: "", quantity: "", unitPrice: "", unit: "Pcs",
  }]);

  const [discountPercent, setDiscountPercent] = useState(existingPO?.discountPercent || 0);
  const [discountAmount,  setDiscountAmount]  = useState(existingPO?.discountAmount  || 0);

  const [showChangeSupplier, setShowChangeSupplier] = useState(false);
  const [errors,   setErrors]   = useState({});

  // ── Item helpers ──
  const handleAddItem = () => setItems([...items, { id: Date.now(), productName: "", poCode: "", hsn: "", quantity: "", unitPrice: "", unit: "Pcs" }]);
  const handleRemoveItem = (id) => { if (items.length > 1) setItems(items.filter(i => i.id !== id)); };
  const handleItemChange = (id, fieldOrObj, value) => {
    if (typeof fieldOrObj === "object") {
      setItems(items.map(i => i.id === id ? { ...i, ...fieldOrObj } : i));
    } else {
      setItems(items.map(i => i.id === id ? { ...i, [fieldOrObj]: value } : i));
    }
  };

  const calcItemTotal = (item) => (parseFloat(item.quantity)||0) * (parseFloat(item.unitPrice)||0);
  const subtotal = items.reduce((s, i) => s + calcItemTotal(i), 0);
  const finalDiscount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : discountAmount;
  const taxableAmount = subtotal - finalDiscount;
  const totalTax = cgstAmount + sgstAmount + igstAmount;
  const finalTotal = taxableAmount + totalTax;

  const handleChangeSupplier = (newSupplier) => {
    setFormData({
      partyName:    newSupplier.partyName    || "",
      companyName:  newSupplier.companyName  || "",
      code:         newSupplier.code         || "",
      address:      newSupplier.address      || "",
      city:         newSupplier.city         || "",
      country:      newSupplier.country      || "",
      gstin:        newSupplier.gstin        || "",
      paymentTerms: newSupplier.paymentTerms || "",
      pincode:      newSupplier.pincode      || "",
      email:        newSupplier.email        || "",
    });
  };

  const handleSubmitPO = () => {
    const newErrors = {};
    if (!expectedDeliveryDate) newErrors.deliveryDate = "Expected delivery date is required";
    items.forEach((item, idx) => {
      if (!item.productName)                              newErrors[`product_${idx}`] = "Required";
      if (!item.quantity || parseFloat(item.quantity) <= 0) newErrors[`qty_${idx}`]  = "Required";
      if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) newErrors[`price_${idx}`] = "Required";
    });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    const poData = {
      poNumber, poDate, poCode, expectedDeliveryDate,
      supplier: formData, items,
      discountPercent, discountAmount: finalDiscount,
      subtotal, cgst: cgstAmount, cgstPercent,
      sgst: sgstAmount, sgstPercent,
      igst: igstAmount, igstPercent,
      totalTax, finalTotal, total: finalTotal,
      createdAt: new Date().toISOString(),
    };
    onSubmit(poData);
  };

  // ── Main form ──
  return (
    <div style={{ padding: 32 }}>
      {showChangeSupplier && (
        <ChangeSupplierModal
          onSelect={handleChangeSupplier}
          onClose={() => setShowChangeSupplier(false)}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid #e2e8f0", backgroundColor: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft style={{ width: 18, height: 18, color: "#64748b" }} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e293b" }}>
            {isEdit ? "Edit Purchase Order" : "Create Purchase Order"}
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{formData.partyName}</p>
        </div>
        {isEdit && (
          <button onClick={() => setShowChangeSupplier(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#334155", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <RefreshCw size={14} />
            Change Supplier
          </button>
        )}
      </div>

      {/* PO Header Fields */}
      <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20, marginBottom: 32, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
        {[
          { label: "PO Number", value: poNumber, onChange: setPoNumber, type: "text" },
          { label: "PO Code",   value: poCode,   onChange: setPoCode,   type: "text" },
          { label: "PO Date",   value: poDate,   onChange: setPoDate,   type: "date" },
        ].map(f => (
          <div key={f.label}>
            <label style={labelStyle}>{f.label}</label>
            <input type={f.type} value={f.value} onChange={(e) => f.onChange(e.target.value)}
              style={{ ...inputStyle, backgroundColor: "#fff", fontFamily: f.label === "PO Number" ? "monospace" : "inherit" }} />
          </div>
        ))}
        <div>
          <label style={labelStyle}>Expected Delivery Date *</label>
          <input type="date" value={expectedDeliveryDate}
            onChange={(e) => { setExpectedDeliveryDate(e.target.value); setErrors(p => ({ ...p, deliveryDate: "" })); }}
            style={{ ...inputStyle, backgroundColor: errors.deliveryDate ? "#fff5f5" : "#fff", border: "1px solid " + (errors.deliveryDate ? "#f87171" : "#e2e8f0") }} />
          {errors.deliveryDate && <p style={{ margin: "4px 0 0", fontSize: 10, color: "#ef4444" }}>{errors.deliveryDate}</p>}
        </div>
      </div>

      {/* Supplier Details */}
      <div style={{ backgroundColor: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Supplier Details</h3>
          {isEdit && (
            <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, backgroundColor: "#fef9c3", color: "#92400e", fontWeight: 600 }}>
              Click "Change Supplier" in the header to switch supplier
            </span>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {[
            { key: "partyName", label: "Party Name" }, { key: "companyName", label: "Company Name" },
            { key: "code", label: "Code" }, { key: "address", label: "Address" },
            { key: "city", label: "City" }, { key: "country", label: "Country" },
            { key: "gstin", label: "GSTIN" }, { key: "paymentTerms", label: "Payment Terms" },
            { key: "pincode", label: "Pincode" }, { key: "email", label: "Email" },
          ].map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input type="text" value={formData[f.key]}
                onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                style={inputStyle} />
            </div>
          ))}
        </div>
      </div>

      {/* PO Items Table */}
      <div style={{ backgroundColor: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>PO Items</h3>
          <button onClick={handleAddItem} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, border: "none", backgroundColor: "#44a83e", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            <Plus style={{ width: 16, height: 16 }} /> Add Item
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                {["Product Name *", "Product Code *", "HSN Code", "Qty *", "Unit", "Unit Price *", "Total", ""].map(h => (
                  <th key={h} style={{ padding: "12px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 14px", minWidth: 200 }}>
                    <ProductSearch item={item} idx={idx} errors={errors} onChange={handleItemChange} />
                  </td>
                  <td style={{ padding: "10px 14px", minWidth: 140 }}>
                    <input type="text" placeholder="Code" value={item.poCode}
                      onChange={(e) => handleItemChange(item.id, "poCode", e.target.value)}
                      style={{ ...inputStyle, padding: "8px 12px" }} />
                  </td>
                  <td style={{ padding: "10px 14px", minWidth: 120 }}>
                    <input type="text" placeholder="HSN" value={item.hsn}
                      onChange={(e) => handleItemChange(item.id, "hsn", e.target.value)}
                      style={{ ...inputStyle, padding: "8px 12px" }} />
                  </td>
                  <td style={{ padding: "10px 14px", minWidth: 90 }}>
                    <input type="number" placeholder="0" value={item.quantity}
                      onChange={(e) => { handleItemChange(item.id, "quantity", e.target.value); setErrors(p => ({ ...p, [`qty_${idx}`]: "" })); }}
                      style={{ ...inputStyle, padding: "8px 10px", border: "1px solid " + (errors[`qty_${idx}`] ? "#f87171" : "#e2e8f0"), backgroundColor: errors[`qty_${idx}`] ? "#fff5f5" : "#fff" }} />
                    {errors[`qty_${idx}`] && <p style={{ margin: "2px 0 0", fontSize: 10, color: "#ef4444" }}>Required</p>}
                  </td>
                  <td style={{ padding: "10px 14px", minWidth: 90 }}>
                    <select value={item.unit} onChange={(e) => handleItemChange(item.id, "unit", e.target.value)} style={{ ...inputStyle, padding: "8px 10px" }}>
                      {["Pcs", "Kg", "Meter", "Box", "Unit"].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "10px 14px", minWidth: 110 }}>
                    <input type="number" placeholder="0.00" value={item.unitPrice}
                      onChange={(e) => { handleItemChange(item.id, "unitPrice", e.target.value); setErrors(p => ({ ...p, [`price_${idx}`]: "" })); }}
                      style={{ ...inputStyle, padding: "8px 10px", border: "1px solid " + (errors[`price_${idx}`] ? "#f87171" : "#e2e8f0"), backgroundColor: errors[`price_${idx}`] ? "#fff5f5" : "#fff" }} />
                    {errors[`price_${idx}`] && <p style={{ margin: "2px 0 0", fontSize: 10, color: "#ef4444" }}>Required</p>}
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap" }}>
                    ₹ {calcItemTotal(item).toFixed(2)}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <button onClick={() => handleRemoveItem(item.id)} disabled={items.length === 1}
                      style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #fecaca", backgroundColor: items.length === 1 ? "#f8fafc" : "#fff", color: items.length === 1 ? "#cbd5e1" : "#ef4444", cursor: items.length === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <td colSpan={5} style={{ padding: "12px 14px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "#1e293b" }}>Subtotal</td>
                <td style={{ padding: "12px 14px", fontWeight: 700, fontSize: 14, color: "#1e293b", whiteSpace: "nowrap" }}>₹ {subtotal.toFixed(2)}</td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Discount + Tax | Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 24, alignItems: "start" }}>
        <div style={{ backgroundColor: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#1e293b" }}>Discount</h3>
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 700, alignSelf: "center" }}>Discount</span>
            <input type="number" value={discountPercent} placeholder="%"
              onChange={(e) => { const p = parseFloat(e.target.value)||0; setDiscountPercent(p); setDiscountAmount((subtotal*p)/100); }}
              style={inputStyle} />
            <input type="number" value={discountAmount} placeholder="₹"
              onChange={(e) => { const a = parseFloat(e.target.value)||0; setDiscountAmount(a); setDiscountPercent(subtotal ? (a/subtotal)*100 : 0); }}
              style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr", gap: 12, marginBottom: 4 }}>
            {["Tax", "Percent (%)", "Amount (₹)"].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.06em" }}>{h}</span>
            ))}
          </div>
          <TaxRow label="CGST" percent={cgstPercent} setPercent={setCgstPercent} amount={cgstAmount} setAmount={setCgstAmount} base={taxableAmount} />
          <TaxRow label="SGST" percent={sgstPercent} setPercent={setSgstPercent} amount={sgstAmount} setAmount={setSgstAmount} base={taxableAmount} />
          <TaxRow label="IGST" percent={igstPercent} setPercent={setIgstPercent} amount={igstAmount} setAmount={setIgstAmount} base={taxableAmount} />
        </div>

        <div style={{ backgroundColor: "#f0fdf4", borderRadius: 12, border: "2px solid #44a83e", padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#1e7e34" }}>Order Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 13, color: "#1e7e34" }}>
            {[
              ["Subtotal", `₹ ${subtotal.toFixed(2)}`, false],
              ["Discount", `-₹ ${finalDiscount.toFixed(2)}`, true],
              ["Taxable Amount", `₹ ${taxableAmount.toFixed(2)}`, false],
              cgstAmount > 0 ? [`CGST (${cgstPercent}%)`, `₹ ${cgstAmount.toFixed(2)}`, false] : null,
              sgstAmount > 0 ? [`SGST (${sgstPercent}%)`, `₹ ${sgstAmount.toFixed(2)}`, false] : null,
              igstAmount > 0 ? [`IGST (${igstPercent}%)`, `₹ ${igstAmount.toFixed(2)}`, false] : null,
            ].filter(Boolean).map(([label, val, red]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{label}</span>
                <span style={red ? { color: "#ef4444" } : {}}>{val}</span>
              </div>
            ))}
            <div style={{ borderTop: "2px solid #44a83e", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
              <span>Total Payable</span>
              <span>₹ {finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 32 }}>
        <button onClick={onBack} style={{ padding: "12px 28px", borderRadius: 10, border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Cancel
        </button>
        <button onClick={handleSubmitPO} style={{ padding: "12px 32px", borderRadius: 10, border: "none", backgroundColor: "#44a83e", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {isEdit ? "Save Changes" : "Create PO"}
        </button>
      </div>
    </div>
  );
}