import { useState } from "react";
import { Package, CheckCircle, AlertCircle, Upload } from "lucide-react";

// ── Existing data for duplicate checks ───────────────────────────────────────
const EXISTING_CODES        = ["VND-001","VND-002","VND-003","VND-004","VND-005","VND-006","VND-007","VND-008"];
const EXISTING_GSTINS       = ["27AABCU9603R1ZX","29AAACB1234K1ZP","24AAACS5678M1ZQ","06AAACgrid345N1ZR","33AAACA9012P1ZS","23AAACI3456Q1ZT","09AAACP7890R1ZU","19AAACF4567S1ZV"];
const EXISTING_PARTY_NAMES  = ["Ravi Electronics Pvt Ltd","Bharat PCB Works","Shree Packaging Co."];
const EXISTING_SUPPLIER_NAMES = ["Ravi Enterprises","Bharat PCB","Shree Packaging"];

// ── Dropdown options ──────────────────────────────────────────────────────────
const CATEGORIES   = ["Electronic components","PCB & substrates","Packaging material","Mechanical parts","Consumables"];
const TYPES        = ["Manufacturer","Trader","Distributor","Importer","Service Provider"];
const STATUSES     = ["Active","Inactive"];
const INDUSTRIES   = ["Electronics","Automotive","Pharmaceuticals","FMCG","Textiles","Construction","IT & Technology","Other"];
const SECTORS      = ["Private","Public","Government","Semi-Government","NGO"];
const DESIGNATIONS = ["Manager","Director","Owner","Purchase Head","Sales Executive","Account Manager","Engineer","Other"];
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh","Other",
];

// ── Initial form state — exactly the required fields ─────────────────────────
const INIT = {
  // Identity
  supplierName: "", partyName: "", companyName: "", code: "",
  category: "", type: "", industry: "", sector: "",
  gstin: "", licenseNumber: "", website: "",
  status: "Active",
  // Address
  address: "", city: "", state: "", country: "India", pincode: "",
  // Supplier contact
  contact: "", email: "", whatsapp: "",
  // Contact person
  contactPersonName: "", contactPersonContact: "", contactPersonEmail: "",
  contactPersonWhatsapp: "", contactPersonDesignation: "",
  // Details
  details: "",
};

// ── Validation ────────────────────────────────────────────────────────────────
function validate(field, value, existingCodes = EXISTING_CODES, existingPartyNames = EXISTING_PARTY_NAMES) {
  const v = (value || "").trim();
  switch (field) {
    case "supplierName":
      if (!v) return "Required";
      if (v.length < 2) return "Minimum 2 characters";
      if (EXISTING_SUPPLIER_NAMES.includes(v)) return "Supplier name already exists";
      return "";
    case "partyName":
      if (!v) return "Required";
      if (v.length < 2) return "Minimum 2 characters";
      if (existingPartyNames.includes(v)) return "Party name already exists";
      return "";
    case "code":
      if (!v) return "Required";
      if (!/^VND-\d{3}$/.test(v)) return "Format must be VND-000";
      if (existingCodes.includes(v)) return "Code already exists";
      return "";
    case "category":
      if (!v) return "Required";
      return "";
    case "gstin":
      if (!v) return "";
      if (v.length !== 15) return `${v.length}/15 characters`;
      if (!/^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/.test(v)) return "Invalid GSTIN format";
      if (EXISTING_GSTINS.includes(v)) return "GSTIN already registered";
      return "";
    case "email":
      if (!v) return "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email address";
      return "";
    case "contactPersonEmail":
      if (!v) return "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email address";
      return "";
    case "contact":
      if (!v) return "";
      if (!/^\+?\d[\d\s\-]{8,14}$/.test(v)) return "Invalid phone number";
      return "";
    case "contactPersonContact":
      if (!v) return "";
      if (!/^\+?\d[\d\s\-]{8,14}$/.test(v)) return "Invalid phone number";
      return "";
    case "whatsapp":
      if (!v) return "";
      if (!/^\+?91?\d{10}$/.test(v.replace(/\s/g, ""))) return "+91 followed by 10 digits";
      return "";
    case "contactPersonWhatsapp":
      if (!v) return "";
      if (!/^\+?91?\d{10}$/.test(v.replace(/\s/g, ""))) return "+91 followed by 10 digits";
      return "";
    case "pincode":
      if (!v) return "";
      if (!/^\d{6}$/.test(v)) return "Must be exactly 6 digits";
      return "";
    case "website":
      if (!v) return "";
      if (!/^(https?:\/\/)?([\w\-]+\.)+[\w]{2,}(\/.*)?$/.test(v)) return "Invalid website URL";
      return "";
    default:
      return "";
  }
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, required, error, touched, hint, children }) {
  const showErr = touched && !!error;
  const showOk  = touched && !error;
  return (
    <div>
      <label style={{ display:"block", marginBottom:6, fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", color:"#9ca3af" }}>
        {label}{required && <span style={{ color:"#ef4444", marginLeft:3 }}>*</span>}
      </label>
      <div style={{ position:"relative" }}>
        {children}
        {(showErr || showOk) && (
          <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", display:"flex" }}>
            {showOk  && <CheckCircle style={{ width:14, height:14, color:"#44a83e" }} />}
            {showErr && <AlertCircle style={{ width:14, height:14, color:"#ef4444" }} />}
          </span>
        )}
      </div>
      {showErr && (
        <p style={{ marginTop:4, fontSize:11, color:"#ef4444", display:"flex", alignItems:"center", gap:4 }}>
          <AlertCircle style={{ width:11, height:11, flexShrink:0 }} />{error}
        </p>
      )}
      {!showErr && hint && <p style={{ marginTop:4, fontSize:11, color:"#9ca3af" }}>{hint}</p>}
    </div>
  );
}

function iStyle(touched, error) {
  const base = {
    width:"100%", boxSizing:"border-box", borderRadius:10, border:"1px solid",
    fontSize:13, padding:"8px 34px 8px 12px", outline:"none",
    transition:"border-color 0.15s, background 0.15s",
    backgroundColor:"#f5f5f5", color:"#000", fontFamily:"inherit",
  };
  if (touched && error)  return { ...base, borderColor:"#f87171", backgroundColor:"#fff5f5", color:"#000" };
  if (touched && !error) return { ...base, borderColor:"#44a83e", backgroundColor:"#f0fdf4", color:"#000" };
  return { ...base, borderColor:"#e2e8f0" };
}

const Section = ({ title }) => (
  <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"#9ca3af", marginBottom:12, paddingBottom:8, borderBottom:"1px solid #f1f5f9", marginTop:0 }}>
    {title}
  </p>
);

const grid = { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:14 };

// ── Main component ────────────────────────────────────────────────────────────
export default function SupplierForm({ onAdd, existingCodes, existingPartyNames }) {
  const [form,    setForm]    = useState(INIT);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);

  const usedCodes       = existingCodes       || EXISTING_CODES;
  const usedPartyNames  = existingPartyNames  || EXISTING_PARTY_NAMES;

  const set = (field, raw) => {
    const val = field === "gstin" ? raw.toUpperCase() : raw;
    setForm(f => ({ ...f, [field]: val }));
    if (touched[field]) setErrors(e => ({ ...e, [field]: validate(field, val, usedCodes, usedPartyNames) }));
  };
  const blur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(e => ({ ...e, [field]: validate(field, form[field], usedCodes, usedPartyNames) }));
  };
  const inp = (field) => ({
    value: form[field],
    onChange: (e) => set(field, e.target.value),
    onBlur: () => blur(field),
    style: iStyle(touched[field], errors[field]),
  });
  const sel = (field) => ({ ...inp(field), style: { ...iStyle(touched[field], errors[field]), appearance:"auto" } });

  const taStyle = (field) => ({
    ...iStyle(touched[field], errors[field]),
    padding:"8px 12px", resize:"vertical", minHeight:64,
    fontFamily:"inherit", color:"#000",
  });

  const REQUIRED = ["supplierName", "partyName", "code", "category"];

  const submit = () => {
    const all = Object.keys(INIT);
    const nt  = Object.fromEntries(all.map(f => [f, true]));
    const ne  = Object.fromEntries(all.map(f => [f, validate(f, form[f], usedCodes, usedPartyNames)]));
    setTouched(nt); setErrors(ne);
    for (const field of REQUIRED) {
      if (!form[field] || validate(field, form[field], usedCodes, usedPartyNames)) return;
    }
    const now = new Date().toISOString();
    onAdd?.({ ...form, id: Date.now(), createdAt: now, updatedAt: now });
    setForm(INIT); setErrors({}); setTouched({});
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const reset = () => { setForm(INIT); setErrors({}); setTouched({}); setSuccess(false); };

  const importFromExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type:"array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json  = XLSX.utils.sheet_to_json(sheet);
      json.forEach(row => onAdd?.({
        id: Date.now() + Math.random(),
        supplierName: row.SupplierName || "",
        code:         row.Code         || "",
        partyName:    row.PartyName    || "",
        companyName:  row.Company      || "",
        category:     row.Category     || "",
        type:         row.Type         || "",
        city:         row.City         || "",
        contact:      row.Contact      || "",
        email:        row.Email        || "",
        status:       row.Status       || "Active",
      }));
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ borderRadius:16, border:"1px solid #e2e8f0", backgroundColor:"#fff", overflow:"hidden", boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>

      {/* Header */}
      <div style={{ padding:"18px 24px", backgroundColor:"#3a3c44", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:9, backgroundColor:"rgba(245,245,245,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Package style={{ width:18, height:18, color:"#f5f5f5" }} />
        </div>
        <div>
          <h2 style={{ fontSize:16, fontWeight:600, color:"#f5f5f5", margin:0 }}>Add New Supplier</h2>
          <p style={{ fontSize:12, color:"rgba(245,245,245,0.55)", margin:0 }}>Fill required fields to register a vendor</p>
        </div>
        <input type="file" accept=".xlsx" id="importFile" onChange={importFromExcel} style={{ display:"none" }} />
        <button onClick={() => document.getElementById("importFile").click()}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:8, border:"1px solid #4b5563", background:"#3a3c44", color:"#fff", fontSize:12, cursor:"pointer", marginLeft:"auto" }}>
          <Upload style={{ width:14, height:14 }} /> Import File
        </button>
      </div>

      {/* Body */}
      <div style={{ padding:24, display:"flex", flexDirection:"column", gap:28 }}>

        {success && (
          <div style={{ display:"flex", alignItems:"center", gap:8, borderRadius:10, padding:"10px 14px", fontSize:13, fontWeight:500, backgroundColor:"rgba(68,168,62,0.1)", color:"#2d6e2a", border:"1px solid rgba(68,168,62,0.25)" }}>
            <CheckCircle style={{ width:15, height:15, flexShrink:0 }} />
            Supplier registered successfully!
          </div>
        )}

        {/* ── IDENTITY ── */}
        <div>
          <Section title="Identity" />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* Row 1: Supplier Name + Party Name */}
            <div style={grid}>
              <Field label="Supplier Name" required error={errors.supplierName} touched={touched.supplierName} hint="Must be unique">
                <input placeholder="e.g. Ravi Enterprises" maxLength={100} {...inp("supplierName")} />
              </Field>
              <Field label="Party Name" required error={errors.partyName} touched={touched.partyName} hint="Must be unique">
                <input placeholder="e.g. Ravi Enterprises (Legal)" maxLength={100} {...inp("partyName")} />
              </Field>
            </div>

            {/* Row 2: Company Name + Supplier Code */}
            <div style={grid}>
              <Field label="Company Name" error={errors.companyName} touched={touched.companyName}>
                <input placeholder="Registered company name" maxLength={100} {...inp("companyName")} />
              </Field>
              <Field label="Supplier Code" required error={errors.code} touched={touched.code} hint="Format: VND-001">
                <input placeholder="VND-009" maxLength={8} {...inp("code")} />
              </Field>
            </div>

            {/* Row 3: Category + Type */}
            <div style={grid}>
              <Field label="Category" required error={errors.category} touched={touched.category}>
                <select {...sel("category")}>
                  <option value="">— select —</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Type" error={errors.type} touched={touched.type}>
                <select {...sel("type")}>
                  <option value="">— select —</option>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>

            {/* Row 4: Industry + Sector + Status */}
            <div style={grid}>
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
              <Field label="Supplier Status" error={errors.status} touched={touched.status}>
                <select {...sel("status")}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            {/* Row 5: GSTIN + License + Website */}
            <div style={grid}>
              <Field label="GSTIN" error={errors.gstin} touched={touched.gstin} hint="15-char GST identification number">
                <input placeholder="27AABCU9603R1ZX" maxLength={15} {...inp("gstin")} />
              </Field>
              <Field label="License Number" error={errors.licenseNumber} touched={touched.licenseNumber}>
                <input placeholder="License / registration no." {...inp("licenseNumber")} />
              </Field>
              <Field label="Website" error={errors.website} touched={touched.website} hint="https://example.com">
                <input placeholder="https://supplier.com" {...inp("website")} />
              </Field>
            </div>
          </div>
        </div>

        {/* ── ADDRESS ── */}
        <div>
          <Section title="Address" />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Field label="Address" error={errors.address} touched={touched.address}>
              <textarea placeholder="Full street / plot address..." maxLength={250} rows={2}
                value={form.address} onChange={e => set("address", e.target.value)} onBlur={() => blur("address")}
                style={taStyle("address")} />
            </Field>
            <div style={grid}>
              <Field label="City" error={errors.city} touched={touched.city}>
                <input placeholder="e.g. Mumbai" maxLength={40} {...inp("city")} />
              </Field>
              <Field label="State" error={errors.state} touched={touched.state}>
                <select {...sel("state")}>
                  <option value="">— select —</option>
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Country" error={errors.country} touched={touched.country}>
                <input placeholder="India" maxLength={60} {...inp("country")} />
              </Field>
              <Field label="Pincode" error={errors.pincode} touched={touched.pincode} hint="6-digit code">
                <input placeholder="400001" maxLength={6} {...inp("pincode")} />
              </Field>
            </div>
          </div>
        </div>

        {/* ── SUPPLIER CONTACT ── */}
        <div>
          <Section title="Supplier Contact" />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={grid}>
              <Field label="Contact Number" error={errors.contact} touched={touched.contact}>
                <input placeholder="+91 98765 43210" maxLength={15} {...inp("contact")} />
              </Field>
              <Field label="Email" error={errors.email} touched={touched.email}>
                <input placeholder="info@company.com" maxLength={80} {...inp("email")} />
              </Field>
              <Field label="WhatsApp" error={errors.whatsapp} touched={touched.whatsapp} hint="+91 followed by 10 digits">
                <input placeholder="+91 98765 43210" maxLength={14} {...inp("whatsapp")} />
              </Field>
            </div>
          </div>
        </div>

        {/* ── CONTACT PERSON ── */}
        <div>
          <Section title="Contact Person" />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={grid}>
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
            <div style={grid}>
              <Field label="Contact Person Contact" error={errors.contactPersonContact} touched={touched.contactPersonContact}>
                <input placeholder="+91 98765 43210" maxLength={15} {...inp("contactPersonContact")} />
              </Field>
              <Field label="Contact Person Email" error={errors.contactPersonEmail} touched={touched.contactPersonEmail}>
                <input placeholder="person@company.com" maxLength={80} {...inp("contactPersonEmail")} />
              </Field>
              <Field label="Contact Person WhatsApp" error={errors.contactPersonWhatsapp} touched={touched.contactPersonWhatsapp} hint="+91 followed by 10 digits">
                <input placeholder="+91 98765 43210" maxLength={14} {...inp("contactPersonWhatsapp")} />
              </Field>
            </div>
          </div>
        </div>

        {/* ── SUPPLIER DETAILS ── */}
        <div>
          <Section title="Supplier Details" />
          <Field label="Details" error={errors.details} touched={touched.details}>
            <textarea placeholder="Any additional details about this supplier..." maxLength={500} rows={3}
              value={form.details} onChange={e => set("details", e.target.value)} onBlur={() => blur("details")}
              style={taStyle("details")} />
          </Field>
        </div>

        {/* ── ACTIONS ── */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:10, paddingTop:8, borderTop:"1px solid #f1f5f9" }}>
          <button onClick={reset}
            style={{ borderRadius:10, border:"1px solid #e2e8f0", padding:"9px 20px", fontSize:13, fontWeight:500, color:"#3a3c44", backgroundColor:"#fff", cursor:"pointer" }}>
            Reset
          </button>
          <button onClick={submit}
            style={{ borderRadius:10, padding:"9px 24px", fontSize:13, fontWeight:600, color:"#fff", backgroundColor:"#44a83e", border:"none", cursor:"pointer" }}>
            Save Supplier
          </button>
        </div>
      </div>
    </div>
  );
}