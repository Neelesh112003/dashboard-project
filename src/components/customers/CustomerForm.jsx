import { useState } from "react";
<<<<<<< HEAD
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
=======
import { User, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import api from "../../api/axios"; // FIX: use the shared axios instance (has Bearer-token interceptor)

// FIX: rewritten to use the shared api instance instead of a local import
async function createCustomer(body) {
  try {
    const response = await api.post("/v1/customers", body);
    return response.data;
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Failed to create customer.";
    throw new Error(msg);
  }
}

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Electronics Retail",
  "Electronics Distribution",
  "Wholesale",
  "E-commerce",
  "Corporate",
];
const TYPES = ["Retailer", "Distributor", "Wholesaler", "Corporate", "Individual"];
const STATUSES = ["Active", "Inactive"];
const INDUSTRIES = [
  "Electronics",
  "Automotive",
  "Pharmaceuticals",
  "FMCG",
  "Textiles",
  "Construction",
  "IT & Technology",
  "Other",
];
const SECTORS = ["Private", "Public", "Government", "Semi-Government", "NGO"];
const DESIGNATIONS = [
  "Manager",
  "Executive",
  "Director",
  "Owner",
  "Coordinator",
  "Supervisor",
  "Other",
];
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir",
  "Ladakh","Puducherry","Chandigarh",
];

// ─── INITIAL STATE ──────────────────────────────────────────────────────────
const INIT = {
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
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
<<<<<<< HEAD
  
  // Address
=======
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
<<<<<<< HEAD
  
  // Primary Contact
  contact: "",
  email: "",
  whatsapp: "",
  
  // Contact Person 1
=======
  contact: "",
  email: "",
  whatsapp: "",
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
  contactPersonName: "",
  contactPersonDesignation: "",
  contactPersonContact: "",
  contactPersonEmail: "",
  contactPersonWhatsapp: "",
<<<<<<< HEAD
  
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
=======
  customerDetails: "",
};

// ─── PAYLOAD MAP (form → API snake_case) ───────────────────────────────────
function toPayload(form) {
  return {
    customer_code:              form.customerCode,
    customer_name:              form.customerName,
    party_name:                 form.partyName,
    company_name:               form.companyName,
    category:                   form.category,
    type:                       form.type,
    industry:                   form.industry,
    sector:                     form.sector,
    status:                     form.status.toLowerCase(), // FIX: API expects lowercase
    gstin:                      form.gstin,
    license_number:             form.licenseNumber,
    website:                    form.website,
    address:                    form.address,
    city:                       form.city,
    state:                      form.state,
    country:                    form.country,
    pincode:                    form.pincode,
    contact:                    form.contact,
    email:                      form.email,
    whatsapp:                   form.whatsapp,
    contact_person_name:        form.contactPersonName,
    contact_person_designation: form.contactPersonDesignation,
    contact_person_contact:     form.contactPersonContact,
    contact_person_email:       form.contactPersonEmail,
    contact_person_whatsapp:    form.contactPersonWhatsapp,
    customer_details:           form.customerDetails,
  };
}

// ─── VALIDATION — format only, nothing is required ─────────────────────────
function validate(field, value) {
  const v = (value || "").trim();
  switch (field) {
    case "email":
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email";
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
      return "";
    case "contact":
      if (v && !/^\+?\d[\d\s\-]{8,14}$/.test(v)) return "Invalid phone number";
      return "";
    case "whatsapp":
<<<<<<< HEAD
      if (v && !/^\+?91?\d{10}$/.test(v.replace(/\s/g, ""))) return "+91 followed by 10 digits";
=======
      if (v && !/^\+?91?\d{10}$/.test(v.replace(/\s/g, "")))
        return "+91 followed by 10 digits";
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
      return "";
    case "gstin":
      if (v && v.length !== 15) return `${v.length}/15 characters`;
      return "";
    case "pincode":
      if (v && !/^\d{6}$/.test(v)) return "Must be exactly 6 digits";
      return "";
    case "website":
<<<<<<< HEAD
      if (v && !/^(https?:\/\/)?([\w\-]+\.)+[\w]{2,}(\/.*)?$/.test(v)) return "Invalid website URL";
      return "";
    case "contactPersonEmail":
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email address";
=======
      if (v && !/^(https?:\/\/)?([\w\-]+\.)+[\w]{2,}(\/.*)?$/.test(v))
        return "Invalid URL";
      return "";
    case "contactPersonEmail":
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email";
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
      return "";
    case "contactPersonContact":
      if (v && !/^\+?\d[\d\s\-]{8,14}$/.test(v)) return "Invalid phone number";
      return "";
    case "contactPersonWhatsapp":
<<<<<<< HEAD
      if (v && !/^\+?91?\d{10}$/.test(v.replace(/\s/g, ""))) return "+91 followed by 10 digits";
=======
      if (v && !/^\+?91?\d{10}$/.test(v.replace(/\s/g, "")))
        return "+91 followed by 10 digits";
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
      return "";
    default:
      return "";
  }
}

<<<<<<< HEAD
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
=======
// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────
function Field({ label, error, touched, hint, children }) {
  const showErr = touched && !!error;
  const showOk  = touched && !error;
  return (
    <div>
      <label style={{ display:"block", marginBottom:6, fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", color:"#9ca3af" }}>
        {label}
      </label>
      <div style={{ position:"relative" }}>
        {children}
        {(showErr || showOk) && (
          <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", display:"flex" }}>
            {showOk  && <CheckCircle  style={{ width:14, height:14, color:"#44a83e" }} />}
            {showErr && <AlertCircle  style={{ width:14, height:14, color:"#ef4444" }} />}
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
          </span>
        )}
      </div>
      {showErr && (
<<<<<<< HEAD
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
=======
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
  if (touched && error)  return { ...base, borderColor:"#f87171", backgroundColor:"#fff5f5" };
  if (touched && !error) return { ...base, borderColor:"#44a83e", backgroundColor:"#f0fdf4" };
  return { ...base, borderColor:"#e2e8f0" };
}

const Section = ({ title }) => (
  <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"#9ca3af", marginBottom:12, paddingBottom:8, borderBottom:"1px solid #f1f5f9", marginTop:0 }}>
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
    {title}
  </p>
);

<<<<<<< HEAD
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
=======
const gridAuto = { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:14 };

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function CustomerForm({ onAdd }) {
  const [form, setForm]       = useState(INIT);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const setField  = (field, raw) => {
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
    const val = field === "gstin" ? raw.toUpperCase() : raw;
    setForm(f => ({ ...f, [field]: val }));
    if (touched[field]) setErrors(e => ({ ...e, [field]: validate(field, val) }));
  };

  const blur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(e => ({ ...e, [field]: validate(field, form[field]) }));
  };

  const inp = (field) => ({
<<<<<<< HEAD
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
=======
    value: form[field],
    onChange: e => setField(field, e.target.value),
    onBlur: () => blur(field),
    style: iStyle(touched[field], errors[field]),
  });

  const sel = (field) => ({
    value: form[field],
    onChange: e => setField(field, e.target.value),
    style: iStyle(touched[field], errors[field]),
  });

  const taStyle = (field) => ({
    ...iStyle(touched[field], errors[field]),
    padding:"8px 12px",
    fontFamily:"inherit",
    resize:"vertical",
  });

  const submit = async () => {
    const ne = {};
    Object.keys(form).forEach(k => (ne[k] = validate(k, form[k])));
    const hasErr = Object.values(ne).some(Boolean);
    if (hasErr) {
      setErrors(ne);
      Object.keys(form).forEach(k => setTouched(t => ({ ...t, [k]: true })));
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const data = await createCustomer(toPayload(form));

      // FIX: merge the API response (snake_case) with form values (camelCase)
      // so that parent components receive a fully-populated camelCase object
      // regardless of what fields the API echoes back.
      const apiRecord = data?.data || data || {};
      const merged = {
        ...apiRecord,
        id:                       apiRecord.id || Date.now(),
        // Always prefer the camelCase form value; fall back to snake_case from API
        code:                     apiRecord.customer_code   || apiRecord.code          || form.customerCode,
        customerCode:             apiRecord.customer_code   || apiRecord.customerCode  || form.customerCode,
        customerName:             apiRecord.customer_name   || apiRecord.customerName  || form.customerName,
        partyName:                apiRecord.party_name      || apiRecord.partyName     || form.partyName,
        companyName:              apiRecord.company_name    || apiRecord.companyName   || form.companyName,
        category:                 apiRecord.category        || form.category,
        type:                     apiRecord.type            || form.type,
        industry:                 apiRecord.industry        || form.industry,
        sector:                   apiRecord.sector          || form.sector,
        // FIX: capitalise status so STATUS_META badge lookup works ("Active"/"Inactive")
        status: (() => {
          const s = apiRecord.status || form.status || "active";
          return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        })(),
        gstin:                    apiRecord.gstin            || form.gstin,
        licenseNumber:            apiRecord.license_number  || apiRecord.licenseNumber || form.licenseNumber,
        website:                  apiRecord.website          || form.website,
        address:                  apiRecord.address          || form.address,
        city:                     apiRecord.city             || form.city,
        state:                    apiRecord.state            || form.state,
        country:                  apiRecord.country          || form.country,
        pincode:                  apiRecord.pincode          || form.pincode,
        contact:                  apiRecord.contact          || form.contact,
        email:                    apiRecord.email            || form.email,
        whatsapp:                 apiRecord.whatsapp         || form.whatsapp,
        contactPersonName:        apiRecord.contact_person_name         || apiRecord.contactPersonName        || form.contactPersonName,
        contactPersonDesignation: apiRecord.contact_person_designation  || apiRecord.contactPersonDesignation || form.contactPersonDesignation,
        contactPersonContact:     apiRecord.contact_person_contact      || apiRecord.contactPersonContact     || form.contactPersonContact,
        contactPersonEmail:       apiRecord.contact_person_email        || apiRecord.contactPersonEmail       || form.contactPersonEmail,
        contactPersonWhatsapp:    apiRecord.contact_person_whatsapp     || apiRecord.contactPersonWhatsapp    || form.contactPersonWhatsapp,
        customerDetails:          apiRecord.customer_details || apiRecord.customerDetails || form.customerDetails,
        createdAt:                apiRecord.created_at || apiRecord.createdAt || new Date().toISOString(),
        updatedAt:                apiRecord.updated_at || apiRecord.updatedAt || new Date().toISOString(),
      };

      onAdd?.(merged);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setForm(INIT);
      setErrors({});
      setTouched({});
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(INIT);
    setErrors({});
    setTouched({});
    setApiError("");
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
  };

  if (success) {
    return (
<<<<<<< HEAD
      <div style={{ padding: 24, backgroundColor: "#f0fdf4", borderRadius: 12, border: "1px solid #86efac", textAlign: "center" }}>
        <CheckCircle style={{ width: 40, height: 40, color: "#44a83e", margin: "0 auto 12px" }} />
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1e7e34" }}>Customer Added Successfully</h3>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#4b7c59" }}>New customer has been registered</p>
=======
      <div style={{ padding:24, backgroundColor:"#f0fdf4", borderRadius:12, border:"1px solid #86efac", textAlign:"center" }}>
        <CheckCircle style={{ width:40, height:40, color:"#44a83e", margin:"0 auto 12px" }} />
        <h3 style={{ margin:0, fontSize:15, fontWeight:600, color:"#1e7e34" }}>Customer Added Successfully</h3>
        <p style={{ margin:"4px 0 0", fontSize:13, color:"#4b7c59" }}>New customer has been registered</p>
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div style={{ padding:24, backgroundColor:"#fff", borderRadius:12, border:"1px solid #e2e8f0", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, paddingBottom:16, borderBottom:"1px solid #f1f5f9" }}>
          <div style={{ width:44, height:44, borderRadius:12, backgroundColor:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <User style={{ width:22, height:22, color:"#44a83e" }} />
          </div>
          <div>
            <h2 style={{ margin:0, fontSize:16, fontWeight:600, color:"#1e293b" }}>Add New Customer</h2>
            <p style={{ margin:"4px 0 0", fontSize:12, color:"#9ca3af" }}>All fields are optional — fill what's available</p>
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 14px", borderRadius:10, border:"1px solid #fecaca", backgroundColor:"#fff5f5", fontSize:13, color:"#dc2626" }}>
            <AlertCircle style={{ width:16, height:16, marginTop:1, flexShrink:0 }} />
            <span>{apiError}</span>
          </div>
        )}

        {/* ── CUSTOMER DETAILS ── */}
        <div>
          <Section title="Customer Details" />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={gridAuto}>
              <Field label="Customer Code" error={errors.customerCode} touched={touched.customerCode} hint="e.g. CUST-001">
                <input placeholder="CUST-001" maxLength={20} {...inp("customerCode")} />
              </Field>
              <Field label="Party Name" error={errors.partyName} touched={touched.partyName}>
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
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
<<<<<<< HEAD
              <Field label="Category" required error={errors.category} touched={touched.category}>
=======
              <Field label="Category" error={errors.category} touched={touched.category}>
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
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
<<<<<<< HEAD
              <Field label="GSTIN" error={errors.gstin} touched={touched.gstin} hint="15-char GST identification">
=======
              <Field label="GSTIN" error={errors.gstin} touched={touched.gstin} hint="15-char GST ID">
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
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
<<<<<<< HEAD
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
=======
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
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
          </div>
        </div>

        {/* ── ADDRESS ── */}
        <div>
          <Section title="Address" />
<<<<<<< HEAD
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Address" error={errors.address} touched={touched.address}>
              <textarea placeholder="Full street / plot address..." maxLength={250} rows={2}
                value={form.address} onChange={e => set("address", e.target.value)} onBlur={() => blur("address")}
                style={taStyle("address")} />
=======
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Field label="Address" error={errors.address} touched={touched.address}>
              <textarea
                placeholder="Full street / plot address..."
                maxLength={250}
                rows={2}
                value={form.address}
                onChange={e => setField("address", e.target.value)}
                onBlur={() => blur("address")}
                style={taStyle("address")}
              />
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
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
<<<<<<< HEAD
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
=======
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

        {/* ── CONTACT PERSON ── */}
        <div>
          <Section title="Contact Person Details" />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
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
<<<<<<< HEAD
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
=======
          <Field label="Customer Details" error={errors.customerDetails} touched={touched.customerDetails}>
            <textarea
              placeholder="Any additional details about this customer..."
              maxLength={500}
              rows={2}
              value={form.customerDetails}
              onChange={e => setField("customerDetails", e.target.value)}
              onBlur={() => blur("customerDetails")}
              style={taStyle("customerDetails")}
            />
          </Field>
        </div>

        {/* ── ACTIONS ── */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:10, paddingTop:8, borderTop:"1px solid #f1f5f9" }}>
          <button
            onClick={reset}
            disabled={loading}
            style={{ borderRadius:10, border:"1px solid #e2e8f0", padding:"9px 20px", fontSize:13, fontWeight:500, color:"#475569", backgroundColor:"#fff", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
          >
            Reset
          </button>
          <button
            onClick={submit}
            disabled={loading}
            style={{ borderRadius:10, padding:"9px 24px", fontSize:13, fontWeight:600, color:"#fff", backgroundColor:"#44a83e", border:"none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1, display:"flex", alignItems:"center", gap:8 }}
          >
            {loading
              ? <><Loader2 style={{ width:15, height:15, animation:"spin 1s linear infinite" }} />Saving…</>
              : "Save Customer"
            }
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
>>>>>>> a2cd292a812604beeab5ac95eb7d7eaf46166a01
    </div>
  );
}