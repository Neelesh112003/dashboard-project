import { useState, useEffect, useCallback } from "react";
import {
  Plus, X, Printer, Download, CheckCircle, Eye, Edit2, Trash2,
  Users, Search, Filter, Loader2, User, AlertCircle, ArrowLeft
} from "lucide-react";

// ─── API CONFIG ────────────────────────────────────────────────────────────
const BASE_URL = "/api/v1"; // adjust to your backend base URL

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

const api = {
  getCustomers:    ()           => apiFetch("/customers"),
  createCustomer:  (body)       => apiFetch("/customers", { method: "POST",   body: JSON.stringify(body) }),
  updateCustomer:  (id, body)   => apiFetch(`/customers/${id}`, { method: "PUT",    body: JSON.stringify(body) }),
  deleteCustomer:  (id)         => apiFetch(`/customers/${id}`, { method: "DELETE" }),
};

// ─── FIELD MAPPING ──────────────────────────────────────────────────────────
function toPayload(form) {
  return {
    customer_code:               form.customerCode,
    party_name:                  form.partyName,
    customer_name:               form.customerName,
    company_name:                form.companyName,
    category:                    form.category,
    type:                        form.type,
    industry:                    form.industry,
    sector:                      form.sector,
    status:                      form.status || "active",
    gstin:                       form.gstin,
    license_number:              form.licenseNumber,
    website:                     form.website,
    address:                     form.address,
    city:                        form.city,
    state:                       form.state,
    country:                     form.country,
    pincode:                     form.pincode,
    contact:                     form.contact,
    email:                       form.email,
    whatsapp:                    form.whatsapp,
    contact_person_name:         form.contactPersonName,
    contact_person_designation:  form.contactPersonDesignation,
    contact_person_contact:      form.contactPersonContact,
    contact_person_email:        form.contactPersonEmail,
    contact_person_whatsapp:     form.contactPersonWhatsapp,
    customer_details:            form.customerDetails,
    remarks:                     form.remarks,
  };
}

function fromApi(c) {
  // Normalize API response → local shape
  return {
    id:                       c.id,
    code:                     c.customer_code || c.code || "",
    customerCode:             c.customer_code || c.code || "",
    partyName:                c.party_name    || c.partyName    || "",
    customerName:             c.customer_name || c.customerName || "",
    companyName:              c.company_name  || c.companyName  || "",
    category:                 c.category      || "",
    type:                     c.type          || "",
    industry:                 c.industry      || "",
    sector:                   c.sector        || "",
    status:                   c.status        ? (c.status.charAt(0).toUpperCase() + c.status.slice(1)) : "Active",
    gstin:                    c.gstin         || "",
    licenseNumber:            c.license_number || c.licenseNumber || "",
    website:                  c.website       || "",
    address:                  c.address       || "",
    city:                     c.city          || "",
    state:                    c.state         || "",
    country:                  c.country       || "",
    pincode:                  c.pincode       || "",
    contact:                  c.contact       || "",
    email:                    c.email         || "",
    whatsapp:                 c.whatsapp      || "",
    contactPersonName:        c.contact_person_name         || c.contactPersonName        || "",
    contactPersonDesignation: c.contact_person_designation  || c.contactPersonDesignation || "",
    contactPersonContact:     c.contact_person_contact      || c.contactPersonContact     || "",
    contactPersonEmail:       c.contact_person_email        || c.contactPersonEmail       || "",
    contactPersonWhatsapp:    c.contact_person_whatsapp     || c.contactPersonWhatsapp    || "",
    customerDetails:          c.customer_details || c.customerDetails || "",
    remarks:                  c.remarks || "",
    createdAt:                c.created_at || c.createdAt || "",
    updatedAt:                c.updated_at || c.updatedAt || "",
  };
}

// ─── FORM INIT ─────────────────────────────────────────────────────────────
const INIT_FORM = {
  customerCode:"", partyName:"", customerName:"", companyName:"",
  category:"", type:"", industry:"", sector:"", status:"Active",
  gstin:"", licenseNumber:"", website:"",
  address:"", city:"", state:"", country:"India", pincode:"",
  contact:"", email:"", whatsapp:"",
  contactPersonName:"", contactPersonDesignation:"", contactPersonContact:"",
  contactPersonEmail:"", contactPersonWhatsapp:"",
  customerDetails:"", remarks:"",
};

// ─── VALIDATION (all optional, only format checks) ─────────────────────────
function validate(field, value) {
  const v = (value || "").trim();
  switch (field) {
    case "email":
    case "contactPersonEmail":
      return v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Invalid email" : "";
    case "contact":
    case "contactPersonContact":
      return v && !/^\+?\d[\d\s\-]{7,14}$/.test(v) ? "Invalid phone" : "";
    case "whatsapp":
    case "contactPersonWhatsapp":
      return v && !/^\+?\d[\d\s\-]{9,14}$/.test(v) ? "Invalid WhatsApp number" : "";
    case "gstin":
      return v && v.length !== 15 ? `${v.length}/15 characters` : "";
    case "pincode":
      return v && !/^\d{6}$/.test(v) ? "Must be 6 digits" : "";
    case "website":
      return v && !/^(https?:\/\/)?([\w\-]+\.)+[\w]{2,}(\/.*)?$/.test(v) ? "Invalid URL" : "";
    default:
      return "";
  }
}

// ─── STATUS / CATEGORY STYLES ──────────────────────────────────────────────
const STATUS_META = {
  Active:   { color:"#1e7e34", bg:"rgba(68,168,62,0.10)", dot:"#44a83e" },
  Inactive: { color:"#6b7280", bg:"rgba(107,114,128,0.10)", dot:"#9ca3af" },
};

// ─── SHARED STYLE HELPERS ──────────────────────────────────────────────────
const inputStyle = (touched, error) => ({
  width:"100%", boxSizing:"border-box", borderRadius:8, fontSize:13,
  padding:"9px 12px", outline:"none", fontFamily:"inherit",
  border:`1px solid ${touched && error ? "#f87171" : touched ? "#44a83e" : "#e2e8f0"}`,
  backgroundColor: touched && error ? "#fff5f5" : touched ? "#f0fdf4" : "#f8fafc",
  color:"#1e293b", transition:"border-color 0.15s",
});

const taStyle = (touched, error) => ({ ...inputStyle(touched, error), padding:"9px 12px", resize:"vertical", minHeight:70 });

function Field({ label, error, touched, hint, children }) {
  return (
    <div>
      <label style={{ display:"block", marginBottom:5, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:"#94a3b8" }}>
        {label}
      </label>
      {children}
      {touched && error && (
        <p style={{ marginTop:4, fontSize:11, color:"#ef4444", display:"flex", alignItems:"center", gap:3 }}>
          <AlertCircle style={{ width:10, height:10 }} />{error}
        </p>
      )}
      {!(touched && error) && hint && <p style={{ marginTop:4, fontSize:11, color:"#94a3b8" }}>{hint}</p>}
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <p style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:"#94a3b8", margin:"0 0 14px", paddingBottom:8, borderBottom:"1px solid #f1f5f9" }}>
      {title}
    </p>
  );
}

const grid = { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:14 };

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMER FORM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function CustomerForm({ initialValues = INIT_FORM, onSave, onCancel, isEdit = false, loading: extLoading }) {
  const [form, setForm]       = useState(initialValues);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (field, raw) => {
    const val = field === "gstin" ? raw.toUpperCase() : raw;
    setForm(f => ({ ...f, [field]: val }));
    if (touched[field]) setErrors(e => ({ ...e, [field]: validate(field, val) }));
  };

  const blur = field => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(e => ({ ...e, [field]: validate(field, form[field]) }));
  };

  const inp = field => ({
    value: form[field] || "",
    onChange: e => set(field, e.target.value),
    onBlur: () => blur(field),
    style: inputStyle(touched[field], errors[field]),
  });

  const submit = async () => {
    // Only format validations (all optional)
    const ne = {};
    Object.keys(form).forEach(k => (ne[k] = validate(k, form[k])));
    const hasErr = Object.values(ne).some(Boolean);
    if (hasErr) {
      setErrors(ne);
      setTouched(Object.fromEntries(Object.keys(form).map(k => [k, true])));
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      await onSave(form);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor:"#fff", borderRadius:14, border:"1px solid #e2e8f0", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", overflow:"hidden" }}>
      {/* Form Header */}
      <div style={{ padding:"18px 24px", background:"linear-gradient(135deg,#3a3c44,#2d2f36)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:10, backgroundColor:"rgba(68,168,62,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <User style={{ width:18, height:18, color:"#44a83e" }} />
          </div>
          <div>
            <h2 style={{ margin:0, fontSize:15, fontWeight:700, color:"#f5f5f5" }}>{isEdit ? "Edit Customer" : "Add New Customer"}</h2>
            <p style={{ margin:0, fontSize:11, color:"rgba(245,245,245,0.5)" }}>All fields are optional — fill what's available</p>
          </div>
        </div>
        <button onClick={onCancel} style={{ width:32, height:32, borderRadius:8, border:"none", background:"rgba(255,255,255,0.08)", color:"#f5f5f5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <X style={{ width:16, height:16 }} />
        </button>
      </div>

      <div style={{ padding:24, display:"flex", flexDirection:"column", gap:24 }}>
        {apiError && (
          <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 14px", borderRadius:10, border:"1px solid #fecaca", backgroundColor:"#fff5f5", fontSize:13, color:"#dc2626" }}>
            <AlertCircle style={{ width:16, height:16, marginTop:1, flexShrink:0 }} />
            <span>{apiError}</span>
          </div>
        )}

        {/* Customer Details */}
        <div>
          <SectionTitle title="Customer Details" />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={grid}>
              <Field label="Customer Code" error={errors.customerCode} touched={touched.customerCode} hint="e.g. CUST-001">
                <input placeholder="CUST-001" maxLength={20} {...inp("customerCode")} />
              </Field>
              <Field label="Party Name" error={errors.partyName} touched={touched.partyName}>
                <input placeholder="Party / Billing name" maxLength={80} {...inp("partyName")} />
              </Field>
            </div>
            <div style={grid}>
              <Field label="Customer Name" error={errors.customerName} touched={touched.customerName}>
                <input placeholder="Customer display name" maxLength={80} {...inp("customerName")} />
              </Field>
              <Field label="Company Name" error={errors.companyName} touched={touched.companyName}>
                <input placeholder="Company / Organization" maxLength={80} {...inp("companyName")} />
              </Field>
            </div>
            <div style={grid}>
              <Field label="Category" error={errors.category} touched={touched.category} hint="e.g. Electronics Retail, Wholesale">
                <input placeholder="Category" maxLength={60} {...inp("category")} />
              </Field>
              <Field label="Type" error={errors.type} touched={touched.type} hint="e.g. Retailer, Distributor">
                <input placeholder="Type" maxLength={40} {...inp("type")} />
              </Field>
              <Field label="Status" error={errors.status} touched={touched.status} hint="Active or Inactive">
                <input placeholder="Active" maxLength={20} {...inp("status")} />
              </Field>
            </div>
            <div style={grid}>
              <Field label="GSTIN" error={errors.gstin} touched={touched.gstin} hint="15-char GST ID">
                <input placeholder="27AABCU9603R1ZX" maxLength={15} {...inp("gstin")} />
              </Field>
              <Field label="License Number" error={errors.licenseNumber} touched={touched.licenseNumber}>
                <input placeholder="License / Registration no." {...inp("licenseNumber")} />
              </Field>
              <Field label="Website" error={errors.website} touched={touched.website}>
                <input placeholder="https://example.com" {...inp("website")} />
              </Field>
            </div>
          </div>
        </div>

        {/* Classification */}
        <div>
          <SectionTitle title="Classification" />
          <div style={grid}>
            <Field label="Industry" error={errors.industry} touched={touched.industry} hint="e.g. Electronics, FMCG">
              <input placeholder="Industry" maxLength={60} {...inp("industry")} />
            </Field>
            <Field label="Sector" error={errors.sector} touched={touched.sector} hint="e.g. Private, Government">
              <input placeholder="Sector" maxLength={40} {...inp("sector")} />
            </Field>
          </div>
        </div>

        {/* Address */}
        <div>
          <SectionTitle title="Address" />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Field label="Address" error={errors.address} touched={touched.address}>
              <textarea placeholder="Full street / plot address" maxLength={250} rows={2}
                value={form.address || ""} onChange={e => set("address", e.target.value)} onBlur={() => blur("address")}
                style={taStyle(touched.address, errors.address)} />
            </Field>
            <div style={grid}>
              <Field label="City" error={errors.city} touched={touched.city}>
                <input placeholder="e.g. Mumbai" maxLength={40} {...inp("city")} />
              </Field>
              <Field label="State" error={errors.state} touched={touched.state}>
                <input placeholder="e.g. Maharashtra" maxLength={40} {...inp("state")} />
              </Field>
              <Field label="Pincode" error={errors.pincode} touched={touched.pincode} hint="6 digits">
                <input placeholder="400001" maxLength={6} {...inp("pincode")} />
              </Field>
              <Field label="Country" error={errors.country} touched={touched.country}>
                <input placeholder="India" maxLength={60} {...inp("country")} />
              </Field>
            </div>
          </div>
        </div>

        {/* Primary Contact */}
        <div>
          <SectionTitle title="Primary Contact" />
          <div style={grid}>
            <Field label="Contact Number" error={errors.contact} touched={touched.contact}>
              <input placeholder="+91 98765 43210" maxLength={15} {...inp("contact")} />
            </Field>
            <Field label="Email" error={errors.email} touched={touched.email}>
              <input placeholder="name@company.com" maxLength={80} {...inp("email")} />
            </Field>
            <Field label="WhatsApp" error={errors.whatsapp} touched={touched.whatsapp}>
              <input placeholder="+91 98765 43210" maxLength={15} {...inp("whatsapp")} />
            </Field>
          </div>
        </div>

        {/* Contact Person */}
        <div>
          <SectionTitle title="Contact Person" />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={grid}>
              <Field label="Name" error={errors.contactPersonName} touched={touched.contactPersonName}>
                <input placeholder="Full name" maxLength={60} {...inp("contactPersonName")} />
              </Field>
              <Field label="Designation" error={errors.contactPersonDesignation} touched={touched.contactPersonDesignation} hint="e.g. Manager, Director">
                <input placeholder="Designation" maxLength={60} {...inp("contactPersonDesignation")} />
              </Field>
            </div>
            <div style={grid}>
              <Field label="Contact" error={errors.contactPersonContact} touched={touched.contactPersonContact}>
                <input placeholder="+91 98765 43210" maxLength={15} {...inp("contactPersonContact")} />
              </Field>
              <Field label="Email" error={errors.contactPersonEmail} touched={touched.contactPersonEmail}>
                <input placeholder="person@company.com" maxLength={80} {...inp("contactPersonEmail")} />
              </Field>
              <Field label="WhatsApp" error={errors.contactPersonWhatsapp} touched={touched.contactPersonWhatsapp}>
                <input placeholder="+91 98765 43210" maxLength={15} {...inp("contactPersonWhatsapp")} />
              </Field>
            </div>
          </div>
        </div>

        {/* Additional */}
        <div>
          <SectionTitle title="Additional Details" />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Field label="Customer Details" error={errors.customerDetails} touched={touched.customerDetails}>
              <textarea placeholder="Any additional details..." maxLength={500} rows={2}
                value={form.customerDetails || ""} onChange={e => set("customerDetails", e.target.value)} onBlur={() => blur("customerDetails")}
                style={taStyle(touched.customerDetails, errors.customerDetails)} />
            </Field>
            <Field label="Remarks" error={errors.remarks} touched={touched.remarks}>
              <textarea placeholder="Internal remarks..." maxLength={300} rows={2}
                value={form.remarks || ""} onChange={e => set("remarks", e.target.value)} onBlur={() => blur("remarks")}
                style={taStyle(touched.remarks, errors.remarks)} />
            </Field>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:10, paddingTop:8, borderTop:"1px solid #f1f5f9" }}>
          <button onClick={onCancel} disabled={loading}
            style={{ padding:"9px 20px", borderRadius:9, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:500, color:"#475569", cursor:"pointer" }}>
            Cancel
          </button>
          <button onClick={submit} disabled={loading}
            style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 24px", borderRadius:9, border:"none", background:"#44a83e", color:"#fff", fontSize:13, fontWeight:700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1 }}>
            {loading ? <><Loader2 style={{ width:14, height:14, animation:"spin 1s linear infinite" }} />Saving…</> : isEdit ? "Update Customer" : "Save Customer"}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INVOICE / VIEW MODAL
// ═══════════════════════════════════════════════════════════════════════════
function CustomerInvoice({ customer, onClose }) {
  const createdAt = new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" });
  const registrationNo = `REG-${String(customer.id || Date.now()).slice(-6)}`;

  const Row = ({ label, value, mono }) => {
    if (!value) return null;
    return (
      <div>
        <p style={{ margin:0, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:"#94a3b8", marginBottom:2 }}>{label}</p>
        <p style={{ margin:0, fontSize:13, color:"#334155", fontWeight:500,
          fontFamily: mono ? "monospace" : "inherit",
          background: mono ? "#f1f5f9" : "transparent",
          display: mono ? "inline-block" : "block",
          padding: mono ? "2px 8px" : 0, borderRadius: mono ? 5 : 0 }}>{value}</p>
      </div>
    );
  };

  const InvSection = ({ title, children }) => (
    <>
      <p style={{ margin:"0 0 10px", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:"#9ca3af", paddingBottom:6, borderBottom:"1px solid #f1f5f9" }}>{title}</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(170px, 1fr))", gap:"10px 20px", marginBottom:18 }}>{children}</div>
    </>
  );

  const handlePrint = () => {
    const body = document.getElementById("cust-inv-print")?.innerHTML || "";
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Customer Card — ${customer.code}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',sans-serif;padding:32px;color:#1e293b;}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 20px;margin-bottom:18px;}
      .lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;margin-bottom:2px;}
      .val{font-size:13px;color:#334155;font-weight:500;}
      .mono{font-family:monospace;background:#f1f5f9;padding:2px 7px;border-radius:4px;}
      .sec{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;padding-bottom:6px;border-bottom:1px solid #f1f5f9;margin:0 0 10px;}
      .hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:3px solid #44a83e;margin-bottom:20px;}
      .brand{font-size:22px;font-weight:800;color:#1e293b;}.brand span{color:#44a83e;}
      .meta{display:flex;gap:24px;flex-wrap:wrap;background:#f8fafc;border-radius:10px;padding:14px 18px;margin-bottom:22px;}
      .ml{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;}
      .mv{font-size:12px;font-weight:600;color:#1e293b;margin-top:2px;}
      </style></head><body>${body}</body></html>`);
    win.document.close(); win.focus(); win.print(); win.close();
  };

  const handleDownload = () => {
    const lines = [
      "CUSTOMER REGISTRATION CARD",
      "═══════════════════════════════════════════",
      `Registration No  : ${registrationNo}`,
      `Date             : ${createdAt}`,
      `Status           : ${customer.status || "Active"}`,
      "",
      "── CUSTOMER DETAILS ──",
      `Code             : ${customer.code || "—"}`,
      `Party Name       : ${customer.partyName || "—"}`,
      `Customer Name    : ${customer.customerName || "—"}`,
      `Company Name     : ${customer.companyName || "—"}`,
      `Category         : ${customer.category || "—"}`,
      `Type             : ${customer.type || "—"}`,
      `GSTIN            : ${customer.gstin || "—"}`,
      `License No       : ${customer.licenseNumber || "—"}`,
      `Website          : ${customer.website || "—"}`,
      "",
      "── ADDRESS ──",
      `Address          : ${customer.address || "—"}`,
      `City             : ${customer.city || "—"}`,
      `State            : ${customer.state || "—"}`,
      `Pincode          : ${customer.pincode || "—"}`,
      `Country          : ${customer.country || "—"}`,
      "",
      "── CONTACT ──",
      `Contact          : ${customer.contact || "—"}`,
      `Email            : ${customer.email || "—"}`,
      `WhatsApp         : ${customer.whatsapp || "—"}`,
      "",
      "── CONTACT PERSON ──",
      `Name             : ${customer.contactPersonName || "—"}`,
      `Designation      : ${customer.contactPersonDesignation || "—"}`,
      `Contact          : ${customer.contactPersonContact || "—"}`,
      `Email            : ${customer.contactPersonEmail || "—"}`,
      "",
      "── CLASSIFICATION ──",
      `Industry         : ${customer.industry || "—"}`,
      `Sector           : ${customer.sector || "—"}`,
      "",
      "── ADDITIONAL ──",
      `Details          : ${customer.customerDetails || "—"}`,
      `Remarks          : ${customer.remarks || "—"}`,
      "",
      "═══════════════════════════════════════════",
      "Generated by Customer Management System",
      new Date().toLocaleString("en-IN"),
    ];
    const blob = new Blob([lines.join("\n")], { type:"text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `customer-${customer.code || "card"}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backgroundColor:"rgba(0,0,0,0.65)", backdropFilter:"blur(6px)" }}
      onClick={onClose}>
      <div style={{ width:"100%", maxWidth:700, maxHeight:"92vh", borderRadius:16, overflow:"hidden", boxShadow:"0 24px 64px rgba(0,0,0,0.4)", display:"flex", flexDirection:"column", backgroundColor:"#fff" }}
        onClick={e => e.stopPropagation()}>

        {/* Top bar */}
        <div style={{ padding:"16px 24px", background:"#44a83e", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <CheckCircle style={{ width:22, height:22, color:"#fff" }} />
            <div>
              <p style={{ margin:0, fontSize:15, fontWeight:700, color:"#fff" }}>Customer Details</p>
              <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.7)" }}>{customer.partyName || customer.code || "—"}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, border:"none", background:"rgba(255,255,255,0.15)", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>
            <X style={{ width:16, height:16 }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
          <div id="cust-inv-print">

            {/* Invoice Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", paddingBottom:16, borderBottom:"2px solid #f1f5f9", marginBottom:16 }}>
              <div>
                <p style={{ margin:0, fontSize:22, fontWeight:800, color:"#1e293b" }}>Customer<span style={{ color:"#44a83e" }}>Card</span></p>
                <p style={{ margin:"2px 0 0", fontSize:11, color:"#94a3b8" }}>Customer Registration Document</p>
              </div>
              <span style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:8, padding:"4px 12px", fontSize:11, fontWeight:700, color:"#1e7e34" }}>✓ {customer.status || "Active"}</span>
            </div>

            {/* Meta strip */}
            <div style={{ display:"flex", gap:24, flexWrap:"wrap", background:"#f8fafc", borderRadius:10, padding:"12px 18px", marginBottom:22 }}>
              {[
                { label:"Registration No", value:registrationNo },
                { label:"Customer Code",   value:customer.code  },
                { label:"Date",            value:createdAt      },
                { label:"Status",          value:customer.status || "Active" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ margin:0, fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#9ca3af" }}>{label}</p>
                  <p style={{ margin:"2px 0 0", fontSize:12, fontWeight:700, color:"#1e293b" }}>{value || "—"}</p>
                </div>
              ))}
            </div>

            <InvSection title="Customer Details">
              <Row label="Party Name"      value={customer.partyName}    />
              <Row label="Customer Name"   value={customer.customerName} />
              <Row label="Company Name"    value={customer.companyName}  />
              <Row label="Category"        value={customer.category}     />
              <Row label="Type"            value={customer.type}         />
              <Row label="GSTIN"           value={customer.gstin}        mono />
              <Row label="License Number"  value={customer.licenseNumber}/>
              <Row label="Website"         value={customer.website}      />
            </InvSection>

            <InvSection title="Address">
              <Row label="Address" value={customer.address} />
              <Row label="City"    value={customer.city}    />
              <Row label="State"   value={customer.state}   />
              <Row label="Pincode" value={customer.pincode} mono />
              <Row label="Country" value={customer.country} />
            </InvSection>

            <InvSection title="Contact">
              <Row label="Contact Number" value={customer.contact}  />
              <Row label="Email"          value={customer.email}    />
              <Row label="WhatsApp"       value={customer.whatsapp} />
            </InvSection>

            {(customer.contactPersonName || customer.contactPersonDesignation) && (
              <InvSection title="Contact Person">
                <Row label="Name"        value={customer.contactPersonName}        />
                <Row label="Designation" value={customer.contactPersonDesignation} />
                <Row label="Contact"     value={customer.contactPersonContact}     />
                <Row label="Email"       value={customer.contactPersonEmail}       />
                <Row label="WhatsApp"    value={customer.contactPersonWhatsapp}    />
              </InvSection>
            )}

            <InvSection title="Classification">
              <Row label="Industry" value={customer.industry} />
              <Row label="Sector"   value={customer.sector}   />
            </InvSection>

            {(customer.customerDetails || customer.remarks) && (
              <InvSection title="Additional">
                <Row label="Details" value={customer.customerDetails} />
                <Row label="Remarks" value={customer.remarks}         />
              </InvSection>
            )}

            <div style={{ marginTop:16, paddingTop:12, borderTop:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between" }}>
              <p style={{ margin:0, fontSize:10, color:"#cbd5e1" }}>Generated by Customer Management System</p>
              <p style={{ margin:0, fontSize:10, color:"#cbd5e1" }}>{new Date().toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:"14px 24px", borderTop:"1px solid #f1f5f9", display:"flex", justifyContent:"flex-end", gap:10, flexShrink:0, backgroundColor:"#fafafa" }}>
          <button onClick={onClose}
            style={{ padding:"9px 20px", borderRadius:9, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:500, color:"#475569", cursor:"pointer" }}>
            Close
          </button>
          <button onClick={handleDownload}
            style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"9px 18px", borderRadius:9, border:"1px solid #bae6fd", background:"#f0f9ff", fontSize:13, fontWeight:600, color:"#0369a1", cursor:"pointer" }}>
            <Download style={{ width:14, height:14 }} /> Download
          </button>
          <button onClick={handlePrint}
            style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"9px 18px", borderRadius:9, border:"none", background:"#44a83e", fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer" }}>
            <Printer style={{ width:14, height:14 }} /> Print
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMER LIST
// ═══════════════════════════════════════════════════════════════════════════
const COLS = ["Code", "Party Name", "Category", "City", "Contact", "Status", "Actions"];

function CustomerList({ customers, loading, onView, onEdit, onDelete, onDownload }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = customers.filter(c => {
    const text = search.toLowerCase();
    const matchSearch = (c.partyName||"").toLowerCase().includes(text) ||
      (c.companyName||"").toLowerCase().includes(text) || (c.code||"").toLowerCase().includes(text);
    const matchStatus = statusFilter ? c.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  if (!customers.length && !loading) return (
    <div style={{ textAlign:"center", padding:"56px 0", color:"#9ca3af", fontSize:14 }}>
      <Users style={{ width:40, height:40, color:"#e2e8f0", display:"block", margin:"0 auto 12px" }} />
      No customers yet. Click <strong>Add Customer</strong> to get started.
    </div>
  );

  const ActionBtn = ({ onClick, icon: Icon, label, color = "#475569", border = "#e2e8f0", hoverBg = "#f8fafc" }) => {
    const [hover, setHover] = useState(false);
    return (
      <button onClick={onClick}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        title={label}
        style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"5px 9px", borderRadius:7, border:`1px solid ${border}`, background: hover ? hoverBg : "#fff", fontSize:11, fontWeight:600, color, cursor:"pointer", transition:"all 0.15s" }}>
        <Icon style={{ width:12, height:12 }} />
        {label}
      </button>
    );
  };

  return (
    <div style={{ borderRadius:14, border:"1px solid #e2e8f0", backgroundColor:"#fff", overflow:"hidden", boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div style={{ padding:"16px 22px", backgroundColor:"#3a3c44" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, backgroundColor:"rgba(245,245,245,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Users style={{ width:17, height:17, color:"#f5f5f5" }} />
            </div>
            <div>
              <h2 style={{ fontSize:15, fontWeight:700, color:"#f5f5f5", margin:0 }}>Customer List</h2>
              <p style={{ fontSize:11, color:"rgba(245,245,245,0.5)", margin:0 }}>{customers.length} customer{customers.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ position:"relative" }}>
              <Search style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", width:13, height:13, color:"#9ca3af" }} />
              <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding:"7px 12px 7px 28px", borderRadius:8, border:"1px solid #4b5563", background:"transparent", color:"#fff", fontSize:12, outline:"none", width:150 }} />
            </div>
            <button onClick={() => setShowFilter(v => !v)}
              style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 12px", borderRadius:8, border:"1px solid #4b5563", background: showFilter ? "#4b5563" : "transparent", color:"#fff", fontSize:12, cursor:"pointer" }}>
              <Filter style={{ width:13, height:13 }} /> Filter
            </button>
          </div>
        </div>

        {showFilter && (
          <div style={{ marginTop:12, padding:"12px 14px", borderRadius:10, background:"#f8fafc", border:"1px solid #e2e8f0", display:"flex", gap:14 }}>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", color:"#9ca3af", display:"block", marginBottom:5 }}>Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ width:"100%", padding:"7px 10px", borderRadius:7, border:"1px solid #e2e8f0", fontSize:12, background:"#fff" }}>
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"40px 0", color:"#94a3b8", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          <Loader2 style={{ width:18, height:18, animation:"spin 1s linear infinite" }} /> Loading customers…
          <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ backgroundColor:"#f1f5f9", borderBottom:"1px solid #e2e8f0" }}>
                {COLS.map(c => (
                  <th key={c} style={{ padding:"11px 16px", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", color:"#94a3b8", textAlign:"left", whiteSpace:"nowrap" }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:"center", padding:"36px 0", color:"#9ca3af", fontSize:13 }}>No customers match your search.</td></tr>
              ) : filtered.map(c => {
                const sm = STATUS_META[c.status] || STATUS_META["Inactive"];
                return (
                  <tr key={c.id}
                    style={{ borderBottom:"1px solid #f8fafc" }}
                    onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"11px 16px" }}>
                      <span style={{ fontFamily:"monospace", fontSize:11, color:"#64748b", backgroundColor:"#f1f5f9", padding:"2px 8px", borderRadius:6 }}>{c.code || "—"}</span>
                    </td>
                    <td style={{ padding:"11px 16px", minWidth:180 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:32, height:32, borderRadius:"50%", background:"#3a3c44", display:"flex", alignItems:"center", justifyContent:"center", color:"#f5f5f5", fontSize:13, fontWeight:700, flexShrink:0 }}>
                          {(c.partyName||c.customerName||"?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin:0, fontWeight:600, color:"#1e293b", whiteSpace:"nowrap", fontSize:13 }}>{c.partyName || c.customerName || "—"}</p>
                          <p style={{ margin:0, fontSize:11, color:"#94a3b8" }}>{c.companyName || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"11px 16px", fontSize:12, color:"#475569" }}>{c.category || "—"}</td>
                    <td style={{ padding:"11px 16px", fontSize:12, color:"#475569" }}>{c.city || "—"}</td>
                    <td style={{ padding:"11px 16px" }}>
                      <p style={{ margin:0, fontSize:12, color:"#475569" }}>{c.contact || "—"}</p>
                      <p style={{ margin:0, fontSize:11, color:"#94a3b8" }}>{c.email || ""}</p>
                    </td>
                    <td style={{ padding:"11px 16px" }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:700, backgroundColor:sm.bg, color:sm.color }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", backgroundColor:sm.dot }} />{c.status || "—"}
                      </span>
                    </td>
                    <td style={{ padding:"11px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <ActionBtn onClick={() => onView(c)}     icon={Eye}     label="View"     color="#0369a1" border="#bae6fd" hoverBg="#f0f9ff" />
                        <ActionBtn onClick={() => onEdit(c)}     icon={Edit2}   label="Edit"     color="#d97706" border="#fde68a" hoverBg="#fffbeb" />
                        <ActionBtn onClick={() => onDownload(c)} icon={Download} label="Download" color="#475569" border="#e2e8f0" hoverBg="#f8fafc" />
                        <ActionBtn onClick={() => onDelete(c.id)} icon={Trash2} label="Delete"   color="#ef4444" border="#fecaca" hoverBg="#fff5f5" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function CustomerPage() {
  const [customers, setCustomers]     = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError]     = useState("");
  const [mode, setMode]               = useState("list"); // "list" | "add" | "edit"
  const [editTarget, setEditTarget]   = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);

  // ── FETCH ALL ──────────────────────────────────────────────────────────
  const fetchCustomers = useCallback(async () => {
    setLoadingList(true);
    setListError("");
    try {
      const data = await api.getCustomers();
      // Support both { data: [] } and [] responses
      const list = Array.isArray(data) ? data : (data.data || []);
      setCustomers(list.map(fromApi));
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  // ── CREATE ─────────────────────────────────────────────────────────────
  const handleCreate = async (form) => {
    const result = await api.createCustomer(toPayload(form));
    const created = fromApi(result.data || result);
    setCustomers(prev => [created, ...prev]);
    setMode("list");
    setViewCustomer(created); // show invoice after create
  };

  // ── UPDATE ─────────────────────────────────────────────────────────────
  const handleUpdate = async (form) => {
    const result = await api.updateCustomer(editTarget.id, toPayload(form));
    const updated = fromApi(result.data || result);
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditTarget(null);
    setMode("list");
  };

  // ── DELETE ─────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer? This cannot be undone.")) return;
    try {
      await api.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  // ── DOWNLOAD (single customer .txt) ──────────────────────────────────
  const handleDownload = (c) => {
    const lines = [
      "CUSTOMER REGISTRATION CARD",
      "═══════════════════════════════════════════",
      `Code             : ${c.code || "—"}`,
      `Party Name       : ${c.partyName || "—"}`,
      `Company Name     : ${c.companyName || "—"}`,
      `Category         : ${c.category || "—"}`,
      `Type             : ${c.type || "—"}`,
      `Status           : ${c.status || "—"}`,
      "",
      "── ADDRESS ──",
      `City             : ${c.city || "—"}`,
      `State            : ${c.state || "—"}`,
      `Pincode          : ${c.pincode || "—"}`,
      `Country          : ${c.country || "—"}`,
      "",
      "── CONTACT ──",
      `Contact          : ${c.contact || "—"}`,
      `Email            : ${c.email || "—"}`,
      `WhatsApp         : ${c.whatsapp || "—"}`,
      "",
      "═══════════════════════════════════════════",
      "Generated by Customer Management System",
      new Date().toLocaleString("en-IN"),
    ];
    const blob = new Blob([lines.join("\n")], { type:"text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `customer-${c.code || c.id}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#f8fafc", padding:24 }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexDirection:"column", gap:20 }}>

        {/* Page Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div>
            {mode !== "list" && (
              <button onClick={() => { setMode("list"); setEditTarget(null); }}
                style={{ display:"inline-flex", alignItems:"center", gap:5, marginBottom:6, padding:"4px 10px", borderRadius:7, border:"1px solid #e2e8f0", background:"#fff", fontSize:12, color:"#64748b", cursor:"pointer" }}>
                <ArrowLeft style={{ width:12, height:12 }} /> Back to list
              </button>
            )}
            <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:"#0f172a" }}>Customers</h1>
            <p style={{ margin:0, fontSize:13, color:"#64748b", marginTop:2 }}>Manage your customer master list</p>
          </div>
          {mode === "list" && (
            <button onClick={() => setMode("add")}
              style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:10, border:"none", fontSize:13, fontWeight:700, cursor:"pointer", backgroundColor:"#44a83e", color:"#fff" }}>
              <Plus style={{ width:16, height:16 }} /> Add Customer
            </button>
          )}
        </div>

        {/* Backend error banner */}
        {listError && (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:10, border:"1px solid #fecaca", background:"#fff5f5", fontSize:13, color:"#dc2626" }}>
            <AlertCircle style={{ width:16, height:16, flexShrink:0 }} />
            <span>Failed to load customers: {listError}</span>
            <button onClick={fetchCustomers} style={{ marginLeft:"auto", padding:"4px 12px", borderRadius:7, border:"1px solid #fecaca", background:"#fff", fontSize:12, color:"#dc2626", cursor:"pointer" }}>Retry</button>
          </div>
        )}

        {/* ADD / EDIT FORM */}
        {mode === "add" && (
          <CustomerForm
            initialValues={INIT_FORM}
            onSave={handleCreate}
            onCancel={() => setMode("list")}
            isEdit={false}
          />
        )}

        {mode === "edit" && editTarget && (
          <CustomerForm
            key={editTarget.id}
            initialValues={editTarget}
            onSave={handleUpdate}
            onCancel={() => { setMode("list"); setEditTarget(null); }}
            isEdit={true}
          />
        )}

        {/* CUSTOMER LIST */}
        {mode === "list" && (
          <CustomerList
            customers={customers}
            loading={loadingList}
            onView={c => setViewCustomer(c)}
            onEdit={c => { setEditTarget(c); setMode("edit"); }}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        )}
      </div>

      {/* VIEW / INVOICE MODAL */}
      {viewCustomer && (
        <CustomerInvoice
          customer={viewCustomer}
          onClose={() => setViewCustomer(null)}
        />
      )}
    </div>
  );
}