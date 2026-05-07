import { useState } from "react";
import { User, CheckCircle, AlertCircle } from "lucide-react";

const EXISTING_CODES = ["CUST-001", "CUST-002", "CUST-003", "CUST-004", "CUST-005"];
const EXISTING_GSTINS = ["27AABCU9603R1ZX", "29AAACB1234K1ZP", "24AAACS5678M1ZQ"];
const EXISTING_PARTY_NAMES = ["Ravi Electronics", "Bharat Electronics", "Shree Retail Co."];

const CATEGORIES = ["Electronics Retail", "Electronics Distribution", "Wholesale", "E-commerce", "Corporate"];
const TYPES = ["Retailer", "Distributor", "Wholesaler", "Corporate", "Individual"];
const STATUSES = ["Active", "Inactive"];
const INDUSTRIES = ["Electronics", "Automotive", "Pharmaceuticals", "FMCG", "Textiles", "Construction", "IT & Technology", "Other"];
const SECTORS = ["Private", "Public", "Government", "Semi-Government", "NGO"];
const DESIGNATIONS = ["Manager", "Executive", "Director", "Owner", "Coordinator", "Supervisor", "Other"];
const INDIAN_STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh"];

const INIT = {
  // Customer Details
  customerCode: "",
  customerName: "",
  partyName: "",
  companyName: "",
  category: "",
  type: "",
  industry: "",
  sector: "",
  status: "Active",
  gstin: "",
  licenseNumber: "",
  website: "",
  
  // Address
  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  
  // Primary Contact
  contact: "",
  email: "",
  whatsapp: "",
  
  // Contact Person 1
  contactPersonName: "",
  contactPersonDesignation: "",
  contactPersonContact: "",
  contactPersonEmail: "",
  contactPersonWhatsapp: "",
  
  // Additional Details
  customerDetails: "",
};

function validate(field, value) {
  const v = (value || "").trim();
  switch (field) {
    case "customerCode":
      if (!v) return "Required";
      if (!/^CUST-\d{3}$/.test(v)) return "Format must be CUST-000";
      if (EXISTING_CODES.includes(v)) return "Code already exists";
      return "";
    case "partyName":
      if (!v) return "Required";
      if (v.length < 2) return "Minimum 2 characters";
      if (EXISTING_PARTY_NAMES.includes(v)) return "Party name already exists";
      return "";
    case "companyName":
      if (v.length > 0 && v.length < 2) return "Minimum 2 characters";
      return "";
    case "category":
      if (!v) return "Required";
      return "";
    case "email":
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email address";
      return "";
    case "contact":
      if (v && !/^\+?\d[\d\s\-]{8,14}$/.test(v)) return "Invalid phone number";
      return "";
    case "whatsapp":
      if (v && !/^\+?91?\d{10}$/.test(v.replace(/\s/g, ""))) return "+91 followed by 10 digits";
      return "";
    case "gstin":
      if (v && v.length !== 15) return `${v.length}/15 characters`;
      return "";
    case "pincode":
      if (v && !/^\d{6}$/.test(v)) return "Must be exactly 6 digits";
      return "";
    case "website":
      if (v && !/^(https?:\/\/)?([\w\-]+\.)+[\w]{2,}(\/.*)?$/.test(v)) return "Invalid website URL";
      return "";
    case "contactPersonEmail":
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email address";
      return "";
    case "contactPersonContact":
      if (v && !/^\+?\d[\d\s\-]{8,14}$/.test(v)) return "Invalid phone number";
      return "";
    case "contactPersonWhatsapp":
      if (v && !/^\+?91?\d{10}$/.test(v.replace(/\s/g, ""))) return "+91 followed by 10 digits";
      return "";
    default:
      return "";
  }
}

function Field({ label, required, error, touched, hint, children }) {
  const showErr = touched && !!error;
  const showOk = touched && !error;
  return (
    <div>
      <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9ca3af" }}>
        {label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        {children}
        {(showErr || showOk) && (
          <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" }}>
            {showOk && <CheckCircle style={{ width: 14, height: 14, color: "#44a83e" }} />}
            {showErr && <AlertCircle style={{ width: 14, height: 14, color: "#ef4444" }} />}
          </span>
        )}
      </div>
      {showErr && (
        <p style={{ marginTop: 4, fontSize: 11, color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}>
          <AlertCircle style={{ width: 11, height: 11, flexShrink: 0 }} />{error}
        </p>
      )}
      {!showErr && hint && <p style={{ marginTop: 4, fontSize: 11, color: "#9ca3af" }}>{hint}</p>}
    </div>
  );
}
function iStyle(touched, error) {
  const base = {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 10,
    border: "1px solid",
    fontSize: 13,
    padding: "8px 34px 8px 12px",
    outline: "none",
    transition: "border-color 0.15s, background 0.15s",
    
    backgroundColor: "#f5f5f5",  // ✅ UPDATED
    color: "#000",               // ✅ UPDATED
    
    fontFamily: "inherit",
  };

  if (touched && error)
    return {
      ...base,
      borderColor: "#f87171",
      backgroundColor: "#fff5f5", // keep error highlight
      color: "#000",
    };

  if (touched && !error)
    return {
      ...base,
      borderColor: "#44a83e",
      backgroundColor: "#f0fdf4", // keep success highlight
      color: "#000",
    };

  return {
    ...base,
    borderColor: "#e2e8f0",
  };
}

const Section = ({ title }) => (
  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #f1f5f9", marginTop: 0 }}>
    {title}
  </p>
);

const gridAuto = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14
};

export default function CustomerForm({ onAdd }) {
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);

  const set = (field, raw) => {
    const val = field === "gstin" ? raw.toUpperCase() : raw;
    setForm(f => ({ ...f, [field]: val }));
    if (touched[field]) setErrors(e => ({ ...e, [field]: validate(field, val) }));
  };

  const blur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(e => ({ ...e, [field]: validate(field, form[field]) }));
  };

  const inp = (field) => ({
    value: form[field], 
    onChange: e => set(field, e.target.value), 
    onBlur: () => blur(field), 
    style: iStyle(touched[field], errors[field])
  });

  const sel = (field) => ({
    value: form[field], 
    onChange: e => set(field, e.target.value), 
    style: iStyle(touched[field], errors[field])
  });

const taStyle = (field) => ({
  ...iStyle(touched[field], errors[field]),
  padding: "8px 12px",
  fontFamily: "inherit",
  backgroundColor: "#f5f5f5", 
  color: "#000",          
});
  const submit = () => {
    const keys = Object.keys(form);
    const ne = {};
    keys.forEach(k => ne[k] = validate(k, form[k]));
    const hasErr = Object.values(ne).some(e => e);
    if (hasErr) { 
      setErrors(ne); 
      keys.forEach(k => setTouched(t => ({ ...t, [k]: true }))); 
      return; 
    }
    onAdd(form);
    setSuccess(true); 
    setTimeout(() => setSuccess(false), 3000);
    setForm(INIT); 
    setErrors({}); 
    setTouched({});
  };

  const reset = () => {
    setForm(INIT); 
    setErrors({}); 
    setTouched({});
  };

  if (success) {
    return (
      <div style={{ padding: 24, backgroundColor: "#f0fdf4", borderRadius: 12, border: "1px solid #86efac", textAlign: "center" }}>
        <CheckCircle style={{ width: 40, height: 40, color: "#44a83e", margin: "0 auto 12px" }} />
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1e7e34" }}>Customer Added Successfully</h3>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#4b7c59" }}>New customer has been registered</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, backgroundColor: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User style={{ width: 22, height: 22, color: "#44a83e" }} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1e293b" }}>Add New Customer</h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>Register a new customer in the system</p>
          </div>
        </div>

        {/* ── CUSTOMER DETAILS SECTION ── */}
        <div>
          <Section title="Customer Details" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={gridAuto}>
              <Field label="Customer Code" required error={errors.customerCode} touched={touched.customerCode} hint="Format: CUST-000">
                <input placeholder="CUST-001" maxLength={8} {...inp("customerCode")} />
              </Field>
              <Field label="Party Name" required error={errors.partyName} touched={touched.partyName}>
                <input placeholder="Customer party name" maxLength={80} {...inp("partyName")} />
              </Field>
            </div>
            <div style={gridAuto}>
              <Field label="Customer Name" error={errors.customerName} touched={touched.customerName}>
                <input placeholder="Customer name" maxLength={80} {...inp("customerName")} />
              </Field>
              <Field label="Company Name" error={errors.companyName} touched={touched.companyName}>
                <input placeholder="Company / Organization name" maxLength={80} {...inp("companyName")} />
              </Field>
            </div>
            <div style={gridAuto}>
              <Field label="Category" required error={errors.category} touched={touched.category}>
                <select {...sel("category")}>
                  <option value="">— select —</option>
                  {CATEGORIES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Type" error={errors.type} touched={touched.type}>
                <select {...sel("type")}>
                  <option value="">— select —</option>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="GSTIN" error={errors.gstin} touched={touched.gstin} hint="15-char GST identification">
                <input placeholder="27AABCU9603R1ZX" maxLength={15} {...inp("gstin")} />
              </Field>
            </div>
            <div style={gridAuto}>
              <Field label="License Number" error={errors.licenseNumber} touched={touched.licenseNumber}>
                <input placeholder="License / registration no." {...inp("licenseNumber")} />
              </Field>
              <Field label="Website" error={errors.website} touched={touched.website} hint="https://example.com">
                <input placeholder="https://customer.com" {...inp("website")} />
              </Field>
            </div>
          </div>
        </div>

        {/* ── CLASSIFICATION ── */}
        <div>
          <Section title="Classification" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={gridAuto}>
              <Field label="Industry" error={errors.industry} touched={touched.industry}>
                <select {...sel("industry")}>
                  <option value="">— select —</option>
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </Field>
              <Field label="Sector" error={errors.sector} touched={touched.sector}>
                <select {...sel("sector")}>
                  <option value="">— select —</option>
                  {SECTORS.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Status" error={errors.status} touched={touched.status}>
                <select {...sel("status")}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
          </div>
        </div>

        {/* ── ADDRESS ── */}
        <div>
          <Section title="Address" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Address" error={errors.address} touched={touched.address}>
              <textarea placeholder="Full street / plot address..." maxLength={250} rows={2}
                value={form.address} onChange={e => set("address", e.target.value)} onBlur={() => blur("address")}
                style={taStyle("address")} />
            </Field>
            <div style={gridAuto}>
              <Field label="City" error={errors.city} touched={touched.city}>
                <input placeholder="e.g. Mumbai" maxLength={40} {...inp("city")} />
              </Field>
              <Field label="State" error={errors.state} touched={touched.state}>
                <select {...sel("state")}>
                  <option value="">— select —</option>
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Pincode" error={errors.pincode} touched={touched.pincode} hint="6-digit code">
                <input placeholder="400001" maxLength={6} {...inp("pincode")} />
              </Field>
            </div>
            <div style={gridAuto}>
              <Field label="Country" error={errors.country} touched={touched.country}>
                <input placeholder="India" maxLength={60} {...inp("country")} />
              </Field>
            </div>
          </div>
        </div>

        {/* ── PRIMARY CONTACT ── */}
        <div>
          <Section title="Primary Contact" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={gridAuto}>
              <Field label="Contact Number" error={errors.contact} touched={touched.contact}>
                <input placeholder="+91 98765 43210" maxLength={15} {...inp("contact")} />
              </Field>
              <Field label="Email" error={errors.email} touched={touched.email}>
                <input placeholder="name@company.com" maxLength={80} {...inp("email")} />
              </Field>
              <Field label="WhatsApp" error={errors.whatsapp} touched={touched.whatsapp} hint="+91 followed by 10 digits">
                <input placeholder="+91 98765 43210" maxLength={14} {...inp("whatsapp")} />
              </Field>
            </div>
          </div>
        </div>

        {/* ── CONTACT PERSON DETAILS ── */}
        <div>
          <Section title="Contact Person Details" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={gridAuto}>
              <Field label="Contact Person Name" error={errors.contactPersonName} touched={touched.contactPersonName}>
                <input placeholder="Full name" maxLength={60} {...inp("contactPersonName")} />
              </Field>
              <Field label="Designation" error={errors.contactPersonDesignation} touched={touched.contactPersonDesignation}>
                <select {...sel("contactPersonDesignation")}>
                  <option value="">— select —</option>
                  {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                </select>
              </Field>
            </div>
            <div style={gridAuto}>
              <Field label="Contact" error={errors.contactPersonContact} touched={touched.contactPersonContact}>
                <input placeholder="+91 98765 43210" maxLength={15} {...inp("contactPersonContact")} />
              </Field>
              <Field label="Email" error={errors.contactPersonEmail} touched={touched.contactPersonEmail}>
                <input placeholder="person@company.com" maxLength={80} {...inp("contactPersonEmail")} />
              </Field>
              <Field label="WhatsApp" error={errors.contactPersonWhatsapp} touched={touched.contactPersonWhatsapp}>
                <input placeholder="+91 98765 43210" maxLength={14} {...inp("contactPersonWhatsapp")} />
              </Field>
            </div>
          </div>
        </div>

        {/* ── ADDITIONAL DETAILS ── */}
        <div>
          <Section title="Additional Details" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Customer Details" error={errors.customerDetails} touched={touched.customerDetails}>
              <textarea placeholder="Any additional details about this customer..." maxLength={500} rows={2}
                value={form.customerDetails} onChange={e => set("customerDetails", e.target.value)} onBlur={() => blur("customerDetails")}
                style={taStyle("customerDetails")} />
            </Field>
          </div>
        </div>

        {/* ── ACTIONS ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
          <button onClick={reset}
            style={{ borderRadius: 10, border: "1px solid #e2e8f0", padding: "9px 20px", fontSize: 13, fontWeight: 500, color: "#475569", backgroundColor: "#fff", cursor: "pointer" }}>
            Reset
          </button>
          <button onClick={submit}
            style={{ borderRadius: 10, padding: "9px 24px", fontSize: 13, fontWeight: 600, color: "#fff", backgroundColor: "#44a83e", border: "none", cursor: "pointer" }}>
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
}