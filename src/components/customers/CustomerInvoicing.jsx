import { CheckCircle, X, Download, Printer } from "lucide-react";

export default function CustomerInvoicing({ customer, onClose }) {
  const createdAt = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const registrationNo = `REG-${Date.now().toString().slice(-6)}`;

  // ── PRINT ─────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const printContent = document.getElementById("customer-invoice-print");

    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Customer Registration — ${customer.code}</title>
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }

            body{
              font-family:'Segoe UI', Arial, sans-serif;
              padding:32px;
              color:#1e293b;
            }

            .header{
              display:flex;
              justify-content:space-between;
              align-items:flex-start;
              border-bottom:3px solid #44a83e;
              padding-bottom:20px;
              margin-bottom:24px;
            }

            .brand{
              font-size:22px;
              font-weight:800;
              color:#1e293b;
            }

            .brand span{
              color:#44a83e;
            }

            .meta{
              display:flex;
              gap:32px;
              background:#f8fafc;
              border-radius:10px;
              padding:16px 20px;
              margin-bottom:24px;
              flex-wrap:wrap;
            }

            .meta-item{
              display:flex;
              flex-direction:column;
              gap:2px;
            }

            .meta-label{
              font-size:10px;
              font-weight:700;
              text-transform:uppercase;
              letter-spacing:0.06em;
              color:#9ca3af;
            }

            .meta-value{
              font-size:13px;
              font-weight:600;
              color:#1e293b;
            }

            .section-title{
              font-size:10px;
              font-weight:700;
              text-transform:uppercase;
              letter-spacing:0.08em;
              color:#9ca3af;
              padding-bottom:8px;
              border-bottom:1px solid #f1f5f9;
              margin-bottom:12px;
              margin-top:20px;
            }

            .grid{
              display:grid;
              grid-template-columns:repeat(3,1fr);
              gap:12px 20px;
            }

            .field-label{
              font-size:10px;
              font-weight:600;
              text-transform:uppercase;
              letter-spacing:0.05em;
              color:#94a3b8;
              margin-bottom:2px;
            }

            .field-value{
              font-size:13px;
              color:#334155;
              font-weight:500;
            }

            .footer{
              margin-top:32px;
              padding-top:16px;
              border-top:1px solid #e2e8f0;
              display:flex;
              justify-content:space-between;
              font-size:11px;
              color:#94a3b8;
            }
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

  // ── SAVE TXT ──────────────────────────────────────────────────────────
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

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `customer-${customer.code || "registration"}.txt`;

    a.click();

    URL.revokeObjectURL(url);
  };

  // ── REUSABLE ROW ──────────────────────────────────────────────────────
  const Row = ({ label, value, mono }) => {
    if (!value) return null;

    return (
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#94a3b8",
            marginBottom: 2,
          }}
        >
          {label}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "#334155",
            fontWeight: 500,
            fontFamily: mono ? "monospace" : "inherit",
            background: mono ? "#f1f5f9" : "transparent",
            display: mono ? "inline-block" : "block",
            padding: mono ? "1px 7px" : 0,
            borderRadius: mono ? 5 : 0,
          }}
        >
          {value}
        </p>
      </div>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          maxHeight: "92vh",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── TOP BAR ───────────────────────────── */}
        <div
          style={{
            padding: "16px 24px",
            backgroundColor: "#44a83e",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle
              style={{
                width: 22,
                height: 22,
                color: "#fff",
              }}
            />

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                Customer Registered Successfully
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Registration card ready — save or print
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              border: "none",
              background: "rgba(255,255,255,0.15)",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* ── BODY ───────────────────────────── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
          }}
        >
          <div id="customer-invoice-print">

            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingBottom: 16,
                borderBottom: "2px solid #f1f5f9",
                marginBottom: 16,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#1e293b",
                  }}
                >
                  Customer
                  <span style={{ color: "#44a83e" }}>Card</span>
                </p>

                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 11,
                    color: "#94a3b8",
                  }}
                >
                  Customer Registration Document
                </p>
              </div>

              <span
                style={{
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #86efac",
                  borderRadius: 8,
                  padding: "4px 12px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#1e7e34",
                }}
              >
                ✓ Registered
              </span>
            </div>

            {/* META */}
            <div
              style={{
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                backgroundColor: "#f8fafc",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 20,
              }}
            >
              {[
                {
                  label: "Registration No",
                  value: registrationNo,
                },
                {
                  label: "Customer Code",
                  value: customer.code,
                },
                {
                  label: "Date",
                  value: createdAt,
                },
                {
                  label: "Status",
                  value: customer.status || "Active",
                },
              ].map((item) => (
                <div key={item.label}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 9,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#9ca3af",
                    }}
                  >
                    {item.label}
                  </p>

                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* DETAILS */}
            <Section title="Customer Details">
              <Row label="Party Name" value={customer.partyName} />
              <Row label="Company Name" value={customer.companyName} />
              <Row label="Customer Name" value={customer.customerName} />
              <Row label="Category" value={customer.category} />
              <Row label="Type" value={customer.type} />
              <Row label="GSTIN" value={customer.gstin} mono />
              <Row label="License Number" value={customer.licenseNumber} />
              <Row label="Website" value={customer.website} />
            </Section>

            <Section title="Address">
              <Row label="Address" value={customer.address} />
              <Row label="City" value={customer.city} />
              <Row label="State" value={customer.state} />
              <Row label="Pincode" value={customer.pincode} mono />
              <Row label="Country" value={customer.country} />
            </Section>

            <Section title="Contact">
              <Row label="Contact Number" value={customer.contact} />
              <Row label="Email" value={customer.email} />
              <Row label="WhatsApp" value={customer.whatsapp} />
            </Section>

            <Section title="Contact Person">
              <Row label="Name" value={customer.contactPersonName} />
              <Row
                label="Designation"
                value={customer.contactPersonDesignation}
              />
              <Row
                label="Contact"
                value={customer.contactPersonContact}
              />
              <Row
                label="Email"
                value={customer.contactPersonEmail}
              />
            </Section>

            <Section title="Classification">
              <Row label="Industry" value={customer.industry} />
              <Row label="Sector" value={customer.sector} />
            </Section>

          </div>
        </div>

        {/* ── FOOTER ───────────────────────────── */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            backgroundColor: "#fafafa",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "#fff",
              fontSize: 13,
              fontWeight: 500,
              color: "#475569",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 20px",
              borderRadius: 10,
              border: "1px solid #bae6fd",
              background: "#f0f9ff",
              fontSize: 13,
              fontWeight: 600,
              color: "#0369a1",
              cursor: "pointer",
            }}
          >
            <Download style={{ width: 15, height: 15 }} />
            Save
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 20px",
              borderRadius: 10,
              border: "none",
              background: "#44a83e",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <Printer style={{ width: 15, height: 15 }} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SECTION COMPONENT ─────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <>
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#9ca3af",
          paddingBottom: 6,
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        {title}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "10px 20px",
          marginBottom: 18,
        }}
      >
        {children}
      </div>
    </>
  );
}