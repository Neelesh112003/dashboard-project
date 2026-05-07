import { useState } from "react";
import { Plus, X, Printer, Download, CheckCircle } from "lucide-react";
import CustomerForm from "../customers/CustomerForm";
import CustomerList from "../customers/CustomersList";

const dummyCustomers = [
  {
    id: 1,
    code: "VND-001",
    partyName: "Ravi Electronics",
    companyName: "Ravi Electronics & Trading Co",
    category: "Electronics Retail",
    type: "Retailer",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400093",
    gstin: "27AABCU9603R1ZX",
    contact: "+91 98201 44312",
    email: "rajesh@ravielectronics.com",
    whatsapp: "+91 98201 44312",
    contactPersonName: "Rajesh Kumar",
    paymentTerms: "Net 30",
    industry: "Electronics",
    sector: "Private",
    website: "https://ravielectronics.com",
    status: "Active",
    rating: 4.5,
    createdAt: new Date("2023-03-12").toISOString(),
    updatedAt: new Date("2024-11-01").toISOString(),
  },
  {
    id: 2,
    code: "VND-002",
    partyName: "Bharat Electronics",
    companyName: "Bharat Electronics Distribution",
    category: "Electronics Distribution",
    type: "Distributor",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    pincode: "560001",
    gstin: "29AAACB1234K1ZP",
    contact: "+91 80501 22134",
    email: "suresh@bharatelectronics.com",
    whatsapp: "+91 80501 22134",
    contactPersonName: "Suresh Patil",
    paymentTerms: "Net 15",
    industry: "Electronics",
    sector: "Private",
    status: "Active",
    rating: 4.1,
    createdAt: new Date("2023-06-20").toISOString(),
    updatedAt: new Date("2024-10-15").toISOString(),
  },
];

/* ─────────── Invoice Modal ─────────── */
function CustomerInvoice({ customer, onClose }) {
  const createdAt = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric"
  });
  const registrationNo = `REG-${Date.now().toString().slice(-6)}`;

  const handlePrint = () => {
    const printContent = document.getElementById("customer-invoice-print");
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Customer Registration — ${customer.code}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 32px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #44a83e; padding-bottom: 20px; margin-bottom: 24px; }
            .brand { font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: -0.5px; }
            .brand span { color: #44a83e; }
            .badge { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: #1e7e34; }
            .meta { display: flex; gap: 32px; background: #f8fafc; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; }
            .meta-item { display: flex; flex-direction: column; gap: 2px; }
            .meta-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; }
            .meta-value { font-size: 13px; font-weight: 600; color: #1e293b; }
            .meta-value.mono { font-family: monospace; background: #e2e8f0; padding: 2px 8px; border-radius: 4px; }
            .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; margin-bottom: 12px; margin-top: 20px; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px 20px; }
            .field-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 2px; }
            .field-value { font-size: 13px; color: #334155; font-weight: 500; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
            .status-active { display: inline-block; background: rgba(45,110,42,0.1); color: #2d6e2a; padding: 2px 10px; border-radius: 6px; font-weight: 600; font-size: 11px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const handleSave = () => {
    const lines = [
      "CUSTOMER REGISTRATION CARD",
      "═══════════════════════════════════════",
      `Registration No : ${registrationNo}`,
      `Date            : ${createdAt}`,
      `Status          : ${customer.status || "Active"}`,
      "",
      "── CUSTOMER DETAILS ──────────────────",
      `Customer Code   : ${customer.code}`,
      `Party Name      : ${customer.partyName}`,
      `Company Name    : ${customer.companyName || "—"}`,
      `Customer Name   : ${customer.customerName || "—"}`,
      `Category        : ${customer.category}`,
      `Type            : ${customer.type || "—"}`,
      `GSTIN           : ${customer.gstin || "—"}`,
      `License No      : ${customer.licenseNumber || "—"}`,
      `Website         : ${customer.website || "—"}`,
      "",
      "── ADDRESS ───────────────────────────",
      `Address         : ${customer.address || "—"}`,
      `City            : ${customer.city || "—"}`,
      `State           : ${customer.state || "—"}`,
      `Pincode         : ${customer.pincode || "—"}`,
      `Country         : ${customer.country || "—"}`,
      "",
      "── CONTACT ───────────────────────────",
      `Contact         : ${customer.contact || "—"}`,
      `Email           : ${customer.email || "—"}`,
      `WhatsApp        : ${customer.whatsapp || "—"}`,
      "",
      "── CONTACT PERSON ────────────────────",
      `Name            : ${customer.contactPersonName || "—"}`,
      `Designation     : ${customer.contactPersonDesignation || "—"}`,
      `Contact         : ${customer.contactPersonContact || "—"}`,
      `Email           : ${customer.contactPersonEmail || "—"}`,
      "",
      "── CLASSIFICATION ────────────────────",
      `Industry        : ${customer.industry || "—"}`,
      `Sector          : ${customer.sector || "—"}`,
      "",
      "═══════════════════════════════════════",
      "Generated by Customer Management System",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customer-${customer.code || "registration"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const Row = ({ label, value, mono }) => {
    if (!value) return null;
    return (
      <div>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8", marginBottom: 2 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 13, color: "#334155", fontWeight: 500, fontFamily: mono ? "monospace" : "inherit", background: mono ? "#f1f5f9" : "transparent", display: mono ? "inline-block" : "block", padding: mono ? "1px 7px" : 0, borderRadius: mono ? 5 : 0 }}>{value}</p>
      </div>
    );
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: 680, maxHeight: "92vh", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div style={{ padding: "16px 24px", backgroundColor: "#44a83e", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle style={{ width: 22, height: 22, color: "#fff" }} />
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>Customer Registered Successfully</p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Registration card ready — save or print</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, border: "none", background: "rgba(255,255,255,0.15)", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          <div id="customer-invoice-print">

            {/* Invoice Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 16, borderBottom: "2px solid #f1f5f9", marginBottom: 16 }}>
              <div>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>
                  Customer<span style={{ color: "#44a83e" }}>Card</span>
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>Customer Registration Document</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ display: "inline-block", backgroundColor: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#1e7e34" }}>
                  ✓ Registered
                </span>
              </div>
            </div>

            {/* Meta strip */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", backgroundColor: "#f8fafc", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
              {[
                { label: "Registration No", value: registrationNo, mono: true },
                { label: "Customer Code", value: customer.code, mono: true },
                { label: "Date", value: createdAt },
                { label: "Status", value: customer.status || "Active" },
              ].map(({ label, value, mono }) => (
                <div key={label}>
                  <p style={{ margin: 0, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>{label}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 600, color: "#1e293b", fontFamily: mono ? "monospace" : "inherit" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Section: Customer Details */}
            <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", paddingBottom: 6, borderBottom: "1px solid #f1f5f9" }}>Customer Details</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px 20px", marginBottom: 18 }}>
              <Row label="Party Name" value={customer.partyName} />
              <Row label="Company Name" value={customer.companyName} />
              <Row label="Customer Name" value={customer.customerName} />
              <Row label="Category" value={customer.category} />
              <Row label="Type" value={customer.type} />
              <Row label="GSTIN" value={customer.gstin} mono />
              <Row label="License Number" value={customer.licenseNumber} />
              <Row label="Website" value={customer.website} />
            </div>

            {/* Section: Address */}
            <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", paddingBottom: 6, borderBottom: "1px solid #f1f5f9" }}>Address</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px 20px", marginBottom: 18 }}>
              <Row label="Address" value={customer.address} />
              <Row label="City" value={customer.city} />
              <Row label="State" value={customer.state} />
              <Row label="Pincode" value={customer.pincode} mono />
              <Row label="Country" value={customer.country} />
            </div>

            {/* Section: Contact */}
            <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", paddingBottom: 6, borderBottom: "1px solid #f1f5f9" }}>Contact</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px 20px", marginBottom: 18 }}>
              <Row label="Contact Number" value={customer.contact} />
              <Row label="Email" value={customer.email} />
              <Row label="WhatsApp" value={customer.whatsapp} />
            </div>

            {/* Section: Contact Person */}
            {(customer.contactPersonName || customer.contactPersonDesignation) && (
              <>
                <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", paddingBottom: 6, borderBottom: "1px solid #f1f5f9" }}>Contact Person</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px 20px", marginBottom: 18 }}>
                  <Row label="Name" value={customer.contactPersonName} />
                  <Row label="Designation" value={customer.contactPersonDesignation} />
                  <Row label="Contact" value={customer.contactPersonContact} />
                  <Row label="Email" value={customer.contactPersonEmail} />
                  <Row label="WhatsApp" value={customer.contactPersonWhatsapp} />
                </div>
              </>
            )}

            {/* Section: Classification */}
            <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", paddingBottom: 6, borderBottom: "1px solid #f1f5f9" }}>Classification</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px 20px", marginBottom: 8 }}>
              <Row label="Industry" value={customer.industry} />
              <Row label="Sector" value={customer.sector} />
            </div>

            {/* Footer */}
            <div style={{ marginTop: 20, paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ margin: 0, fontSize: 10, color: "#cbd5e1" }}>Generated by Customer Management System</p>
              <p style={{ margin: 0, fontSize: 10, color: "#cbd5e1" }}>{new Date().toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0, backgroundColor: "#fafafa" }}>
          <button
            onClick={onClose}
            style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 500, color: "#475569", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 10, border: "1px solid #bae6fd", background: "#f0f9ff", fontSize: 13, fontWeight: 600, color: "#0369a1", cursor: "pointer" }}
          >
            <Download style={{ width: 15, height: 15 }} /> Save
          </button>
          <button
            onClick={handlePrint}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 10, border: "none", background: "#44a83e", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}
          >
            <Printer style={{ width: 15, height: 15 }} /> Print
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Main Page ─────────── */
export default function CustomerPage() {
  const [customers, setCustomers] = useState(dummyCustomers);
  const [showForm, setShowForm] = useState(false);
  const [invoiceCustomer, setInvoiceCustomer] = useState(null); // ← new invoice state

  const handleAdd = (formData) => {
    // ✅ FIX: map customerCode → code so CustomerList's c.code renders correctly
    const customer = {
      ...formData,
      id: Date.now(),
      code: formData.customerCode,          // ← the fix
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCustomers(prev => [customer, ...prev]);
    setShowForm(false);
    setInvoiceCustomer(customer);           // ← show invoice after add
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Customers</h1>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b", marginTop: 2 }}>Manage your customer master list</p>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "9px 18px", borderRadius: 10, border: "none",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              backgroundColor: showForm ? "#3a3c44" : "#44a83e",
              color: "#fff", transition: "background 0.2s",
            }}
          >
            {showForm
              ? <><X style={{ width: 16, height: 16 }} /> Cancel</>
              : <><Plus style={{ width: 16, height: 16 }} /> Add Customer</>
            }
          </button>
        </div>

        {/* ── INLINE FORM ── */}
        {showForm && (
          <div style={{ animation: "slideDown 0.2s ease" }}>
            <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <CustomerForm onAdd={handleAdd} />
          </div>
        )}

        {/* ── CUSTOMER LIST ── */}
        <CustomerList
          customers={customers}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>

      {/* ── INVOICE MODAL ── */}
      {invoiceCustomer && (
        <CustomerInvoice
          customer={invoiceCustomer}
          onClose={() => setInvoiceCustomer(null)}
        />
      )}
    </div>
  );
}