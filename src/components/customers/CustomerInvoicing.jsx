import { CheckCircle, X, Download, Printer } from "lucide-react";

// ─── REUSABLE ROW ───────────────────────────────────────────────────────────
const Row = ({ label, value, mono }) => {
  if (!value && value !== 0) return null;
  return (
    <div>
      <p style={{ margin:0, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:"#94a3b8", marginBottom:2 }}>
        {label}
      </p>
      <p style={{
        margin:0, fontSize:13, color:"#334155", fontWeight:500,
        fontFamily: mono ? "monospace" : "inherit",
        background: mono ? "#f1f5f9" : "transparent",
        display:    mono ? "inline-block" : "block",
        padding:    mono ? "1px 7px" : 0,
        borderRadius: mono ? 5 : 0,
      }}>
        {value}
      </p>
    </div>
  );
};

// ─── SECTION ────────────────────────────────────────────────────────────────
function Section({ title, children }) {
  const hasContent = Array.isArray(children)
    ? children.some(Boolean)
    : Boolean(children);
  if (!hasContent) return null;

  return (
    <>
      <p style={{ margin:"0 0 10px", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"#9ca3af", paddingBottom:6, borderBottom:"1px solid #f1f5f9" }}>
        {title}
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:"10px 20px", marginBottom:18 }}>
        {children}
      </div>
    </>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function CustomerInvoicing({ customer, onClose }) {
  const c = customer;

  // FIX: normalise status capitalisation so it always displays correctly
  // regardless of whether the API returned "active" or "Active"
  const displayStatus = c.status
    ? c.status.charAt(0).toUpperCase() + c.status.slice(1).toLowerCase()
    : "Active";

  const createdAt = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const registrationNo = `REG-${String(c.id || Date.now()).slice(-6)}`;

  // ── PRINT ────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const printContent = document.getElementById("customer-invoice-print");
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Customer Registration — ${c.code || c.customerCode}</title>
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family:'Segoe UI', Arial, sans-serif; padding:32px; color:#1e293b; }
            .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #44a83e; padding-bottom:20px; margin-bottom:24px; }
            .brand  { font-size:22px; font-weight:800; color:#1e293b; }
            .brand span { color:#44a83e; }
            .meta { display:flex; gap:32px; background:#f8fafc; border-radius:10px; padding:16px 20px; margin-bottom:24px; flex-wrap:wrap; }
            .meta-item { display:flex; flex-direction:column; gap:2px; }
            .meta-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#9ca3af; }
            .meta-value { font-size:13px; font-weight:600; color:#1e293b; }
            .section-title { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#9ca3af; padding-bottom:8px; border-bottom:1px solid #f1f5f9; margin-bottom:12px; margin-top:20px; }
            .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px 20px; }
            .field-label { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#94a3b8; margin-bottom:2px; }
            .field-value { font-size:13px; color:#334155; font-weight:500; }
            .footer { margin-top:32px; padding-top:16px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; font-size:11px; color:#94a3b8; }
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

  // ── SAVE TXT ─────────────────────────────────────────────────────────────
  const handleSave = () => {
    const lines = [
      "CUSTOMER REGISTRATION CARD",
      "═══════════════════════════════════════",
      `Registration No : ${registrationNo}`,
      `Date            : ${createdAt}`,
      `Status          : ${displayStatus}`,
      "",
      "── CUSTOMER DETAILS ──────────────────",
      `Customer Code   : ${c.code || c.customerCode || "—"}`,
      `Party Name      : ${c.partyName      || "—"}`,
      `Customer Name   : ${c.customerName   || "—"}`,
      `Company Name    : ${c.companyName    || "—"}`,
      `Category        : ${c.category       || "—"}`,
      `Type            : ${c.type           || "—"}`,
      `GSTIN           : ${c.gstin          || "—"}`,
      `License No      : ${c.licenseNumber  || "—"}`,
      `Website         : ${c.website        || "—"}`,
      "",
      "── ADDRESS ───────────────────────────",
      `Address         : ${c.address        || "—"}`,
      `City            : ${c.city           || "—"}`,
      `State           : ${c.state          || "—"}`,
      `Pincode         : ${c.pincode        || "—"}`,
      `Country         : ${c.country        || "—"}`,
      "",
      "── CONTACT ───────────────────────────",
      `Contact         : ${c.contact        || "—"}`,
      `Email           : ${c.email          || "—"}`,
      `WhatsApp        : ${c.whatsapp       || "—"}`,
      "",
      "── CONTACT PERSON ────────────────────",
      `Name            : ${c.contactPersonName        || "—"}`,
      `Designation     : ${c.contactPersonDesignation || "—"}`,
      `Contact         : ${c.contactPersonContact     || "—"}`,
      `Email           : ${c.contactPersonEmail       || "—"}`,
      "",
      "── CLASSIFICATION ────────────────────",
      `Industry        : ${c.industry       || "—"}`,
      `Sector          : ${c.sector         || "—"}`,
      "",
      "── ADDITIONAL ────────────────────────",
      `Details         : ${c.customerDetails || "—"}`,
      "",
      "═══════════════════════════════════════",
      "Generated by Customer Management System",
    ];
    const blob = new Blob([lines.join("\n")], { type:"text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `customer-${c.code || c.customerCode || "registration"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backgroundColor:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)" }}
      onClick={onClose}
    >
      <div
        style={{ width:"100%", maxWidth:680, maxHeight:"92vh", borderRadius:16, overflow:"hidden", boxShadow:"0 24px 64px rgba(0,0,0,0.35)", display:"flex", flexDirection:"column", backgroundColor:"#fff" }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── TOP BAR ── */}
        <div style={{ padding:"16px 24px", backgroundColor:"#44a83e", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <CheckCircle style={{ width:22, height:22, color:"#fff" }} />
            <div>
              <p style={{ margin:0, fontSize:15, fontWeight:700, color:"#fff" }}>Customer Registered Successfully</p>
              <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.7)" }}>Registration card ready — save or print</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width:32, height:32, border:"none", background:"rgba(255,255,255,0.15)", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}
          >
            <X style={{ width:16, height:16 }} />
          </button>
        </div>

        {/* ── BODY ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
          <div id="customer-invoice-print">

            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", paddingBottom:16, borderBottom:"2px solid #f1f5f9", marginBottom:16 }}>
              <div>
                <p style={{ margin:0, fontSize:20, fontWeight:800, color:"#1e293b" }}>
                  Customer<span style={{ color:"#44a83e" }}>Card</span>
                </p>
                <p style={{ margin:"2px 0 0", fontSize:11, color:"#94a3b8" }}>Customer Registration Document</p>
              </div>
              <span style={{ backgroundColor:"#f0fdf4", border:"1px solid #86efac", borderRadius:8, padding:"4px 12px", fontSize:11, fontWeight:700, color:"#1e7e34" }}>
                ✓ Registered
              </span>
            </div>

            {/* Meta strip */}
            <div style={{ display:"flex", gap:24, flexWrap:"wrap", backgroundColor:"#f8fafc", borderRadius:10, padding:"12px 16px", marginBottom:20 }}>
              {[
                { label:"Registration No", value: registrationNo                    },
                { label:"Customer Code",   value: c.code || c.customerCode || "—"  },
                { label:"Date",            value: createdAt                         },
                { label:"Status",          value: displayStatus                     },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ margin:0, fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"#9ca3af" }}>{item.label}</p>
                  <p style={{ margin:"2px 0 0", fontSize:12, fontWeight:600, color:"#1e293b" }}>{item.value || "—"}</p>
                </div>
              ))}
            </div>

            {/* Customer Details */}
            <Section title="Customer Details">
              <Row label="Party Name"      value={c.partyName}     />
              <Row label="Customer Name"   value={c.customerName}  />
              <Row label="Company Name"    value={c.companyName}   />
              <Row label="Category"        value={c.category}      />
              <Row label="Type"            value={c.type}          />
              <Row label="GSTIN"           value={c.gstin}    mono />
              <Row label="License Number"  value={c.licenseNumber} />
              <Row label="Website"         value={c.website}       />
            </Section>

            {/* Address */}
            <Section title="Address">
              <Row label="Address" value={c.address}       />
              <Row label="City"    value={c.city}          />
              <Row label="State"   value={c.state}         />
              <Row label="Pincode" value={c.pincode}  mono />
              <Row label="Country" value={c.country}       />
            </Section>

            {/* Contact */}
            <Section title="Contact">
              <Row label="Contact Number" value={c.contact}  />
              <Row label="Email"          value={c.email}    />
              <Row label="WhatsApp"       value={c.whatsapp} />
            </Section>

            {/* Contact Person */}
            <Section title="Contact Person">
              <Row label="Name"        value={c.contactPersonName}        />
              <Row label="Designation" value={c.contactPersonDesignation} />
              <Row label="Contact"     value={c.contactPersonContact}     />
              <Row label="Email"       value={c.contactPersonEmail}       />
              <Row label="WhatsApp"    value={c.contactPersonWhatsapp}    />
            </Section>

            {/* Classification */}
            <Section title="Classification">
              <Row label="Industry" value={c.industry} />
              <Row label="Sector"   value={c.sector}   />
            </Section>

            {/* Additional */}
            <Section title="Additional Details">
              <Row label="Details" value={c.customerDetails} />
            </Section>

            {/* Footer */}
            <div style={{ marginTop:20, paddingTop:12, borderTop:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <p style={{ margin:0, fontSize:10, color:"#cbd5e1" }}>Generated by Customer Management System</p>
              <p style={{ margin:0, fontSize:10, color:"#cbd5e1" }}>{new Date().toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ padding:"14px 24px", borderTop:"1px solid #f1f5f9", display:"flex", justifyContent:"flex-end", gap:10, flexShrink:0, backgroundColor:"#fafafa" }}>
          <button
            onClick={onClose}
            style={{ padding:"9px 20px", borderRadius:10, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:500, color:"#475569", cursor:"pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"9px 20px", borderRadius:10, border:"1px solid #bae6fd", background:"#f0f9ff", fontSize:13, fontWeight:600, color:"#0369a1", cursor:"pointer" }}
          >
            <Download style={{ width:15, height:15 }} /> Save
          </button>
          <button
            onClick={handlePrint}
            style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"9px 20px", borderRadius:10, border:"none", background:"#44a83e", fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer" }}
          >
            <Printer style={{ width:15, height:15 }} /> Print
          </button>
        </div>
      </div>
    </div>
  );
}