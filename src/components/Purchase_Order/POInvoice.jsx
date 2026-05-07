import { createPortal } from "react-dom";
import { FileText, Building2, MapPin, Mail, CreditCard, Download, Printer, X } from "lucide-react";

export default function POInvoice({ po, onClose }) {
  const subtotal = po.subtotal || 0;
  const discount = po.discountAmount || 0;
  const taxable = subtotal - discount;
  const cgst = po.cgst || 0;
  const sgst = po.sgst || 0;
  const igst = po.igst || 0;
  const finalTotal = po.finalTotal || po.total || 0;
  const items = po.items || [];
  const supplier = po.supplier || {};

  /* ── Print ── */
  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head>
      <title>PO Invoice — ${po.poNumber}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Segoe UI',sans-serif;color:#1e293b;padding:40px;background:#fff}
        h1{font-size:32px;font-weight:900;line-height:1}
        .green{color:#44a83e}
        .ref{display:inline-flex;align-items:center;gap:8px;background:#f1f5f9;border-radius:20px;padding:5px 14px;margin-top:10px;font-size:12px}
        .badge{display:inline-block;padding:5px 14px;border-radius:20px;font-size:11px;font-weight:700;background:#fef9c3;color:#92400e}
        .meta p{font-size:13px;margin-bottom:3px}
        .divider{height:2px;background:linear-gradient(90deg,#1e293b,#44a83e,#e2e8f0);margin:28px 0}
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:32px}
        .card{background:#f8fafc;border-radius:10px;padding:18px}
        .card-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#64748b;margin-bottom:12px}
        .supplier-name{font-size:17px;font-weight:800;margin-bottom:4px}
        .supplier-sub{font-size:13px;color:#64748b;margin-bottom:8px}
        .info-row{display:flex;justify-content:space-between;margin-bottom:7px}
        .info-label{font-size:12px;color:#64748b}
        .info-val{font-size:12px;font-weight:600;color:#1e293b}
        .mono{font-family:monospace;background:#e2e8f0;padding:2px 7px;border-radius:4px;font-size:11px}
        table{width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden}
        thead tr{background:#1e293b}
        th{padding:11px 13px;font-size:10px;font-weight:700;text-transform:uppercase;color:#94a3b8;text-align:left;letter-spacing:.05em}
        td{padding:11px 13px;font-size:13px;border-bottom:1px solid #f1f5f9}
        .total-box{display:flex;justify-content:flex-end;margin-top:24px}
        .totals{width:300px}
        .total-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f1f5f9;font-size:13px}
        .grand{display:flex;justify-content:space-between;padding:14px 18px;background:linear-gradient(135deg,#1e293b,#334155);border-radius:10px;margin-top:8px}
        .grand-label{font-size:14px;font-weight:700;color:#fff}
        .grand-val{font-size:16px;font-weight:800;color:#44a83e}
        .footer{margin-top:36px;padding-top:16px;border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;font-size:11px;color:#94a3b8}
      </style>
    </head><body>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px">
        <div>
          <h1>PURCHASE</h1><h1 class="green">ORDER</h1>
          <div class="ref"><span style="color:#64748b">Ref:</span><span style="font-family:monospace;font-weight:700">${po.poNumber}</span></div>
        </div>
        <div style="text-align:right" class="meta">
          <div class="badge">${po.status || "Pending"}</div>
          <p style="margin-top:14px"><strong>Issue Date:</strong> ${po.poDate || "—"}</p>
          <p><strong>Delivery:</strong> ${po.expectedDeliveryDate || "—"}</p>
          <p><strong>PO Code:</strong> ${po.poCode || "—"}</p>
        </div>
      </div>
      <div class="divider"></div>
      <div class="two-col">
        <div class="card">
          <div class="card-title">Supplier Details</div>
          <div class="supplier-name">${supplier.partyName || "—"}</div>
          <div class="supplier-sub">${supplier.companyName || ""}</div>
          ${supplier.address ? `<p style="font-size:12px;color:#64748b;margin-bottom:4px">📍 ${supplier.address}, ${supplier.city} ${supplier.pincode}, ${supplier.country}</p>` : ""}
          ${supplier.email ? `<p style="font-size:12px;color:#64748b">✉ ${supplier.email}</p>` : ""}
        </div>
        <div class="card">
          <div class="card-title">Order Details</div>
          ${[["PO Number", po.poNumber, true], ["PO Code", po.poCode, true], ["GSTIN", supplier.gstin, true], ["Payment Terms", supplier.paymentTerms, false]].filter(([, v]) => v).map(([l, v, m]) => `
            <div class="info-row"><span class="info-label">${l}</span><span class="${m ? "mono" : "info-val"}">${v}</span></div>`).join("")}
        </div>
      </div>
      <table style="margin-bottom:28px">
        <thead><tr><th>#</th><th>Product</th><th>HSN</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody>
          ${items.map((it, i) => {
      const amt = (parseFloat(it.quantity) || 0) * (parseFloat(it.unitPrice) || 0);
      return `<tr><td style="color:#94a3b8;font-weight:600">${i + 1}</td>
              <td><strong>${it.productName || "—"}</strong><br><span style="font-size:11px;color:#64748b;font-family:monospace">${it.poCode || ""}</span></td>
              <td style="font-family:monospace;font-size:12px;color:#64748b">${it.hsn || "—"}</td>
              <td><strong>${it.quantity || 0}</strong></td>
              <td style="color:#64748b">${it.unit || "Pcs"}</td>
              <td>₹ ${Number(it.unitPrice || 0).toFixed(2)}</td>
              <td><strong>₹ ${amt.toFixed(2)}</strong></td></tr>`;
    }).join("")}
        </tbody>
      </table>
      <div class="total-box"><div class="totals">
        ${[
        ["Subtotal", `₹ ${subtotal.toFixed(2)}`, false],
        ["Discount", `-₹ ${discount.toFixed(2)}`, true],
        ["Taxable Amount", `₹ ${taxable.toFixed(2)}`, false],
        ...(cgst > 0 ? [[`CGST (${po.cgstPercent || 0}%)`, `₹ ${cgst.toFixed(2)}`, false]] : []),
        ...(sgst > 0 ? [[`SGST (${po.sgstPercent || 0}%)`, `₹ ${sgst.toFixed(2)}`, false]] : []),
        ...(igst > 0 ? [[`IGST (${po.igstPercent || 0}%)`, `₹ ${igst.toFixed(2)}`, false]] : []),
      ].map(([l, v, red]) => `<div class="total-row"><span>${l}</span><span style="color:${red ? "#ef4444" : "#1e293b"};font-weight:500">${v}</span></div>`).join("")}
        <div class="grand"><span class="grand-label">Total Payable</span><span class="grand-val">₹ ${finalTotal.toFixed(2)}</span></div>
      </div></div>
      <div class="footer">
        <span>Generated on ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
        <span>This is a computer-generated document</span>
      </div>
    </body></html>`);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  /* ── Save as text ── */
  const handleSave = () => {
    const lines = [
      "PURCHASE ORDER",
      "═══════════════════════════════════════════════",
      `PO Number        : ${po.poNumber}`,
      `PO Code          : ${po.poCode || "—"}`,
      `PO Date          : ${po.poDate || "—"}`,
      `Expected Delivery: ${po.expectedDeliveryDate || "—"}`,
      `Status           : ${po.status || "Pending"}`,
      "",
      "── SUPPLIER ────────────────────────────────────",
      `Party Name       : ${supplier.partyName || "—"}`,
      `Company          : ${supplier.companyName || "—"}`,
      `Supplier Code    : ${supplier.code || "—"}`,
      `GSTIN            : ${supplier.gstin || "—"}`,
      `Payment Terms    : ${supplier.paymentTerms || "—"}`,
      `Email            : ${supplier.email || "—"}`,
      `Address          : ${supplier.address || "—"}, ${supplier.city || ""} ${supplier.pincode || ""}, ${supplier.country || ""}`,
      "",
      "── ITEMS ───────────────────────────────────────",
      ...items.map((it, i) => {
        const amt = (parseFloat(it.quantity) || 0) * (parseFloat(it.unitPrice) || 0);
        return `${i + 1}. ${it.productName} [${it.poCode}] | HSN: ${it.hsn} | Qty: ${it.quantity} ${it.unit} @ ₹${it.unitPrice} = ₹${amt.toFixed(2)}`;
      }),
      "",
      "── TOTALS ──────────────────────────────────────",
      `Subtotal         : ₹ ${subtotal.toFixed(2)}`,
      `Discount         : -₹ ${discount.toFixed(2)}`,
      `Taxable Amount   : ₹ ${taxable.toFixed(2)}`,
      ...(cgst > 0 ? [`CGST (${po.cgstPercent || 0}%)   : ₹ ${cgst.toFixed(2)}`] : []),
      ...(sgst > 0 ? [`SGST (${po.sgstPercent || 0}%)   : ₹ ${sgst.toFixed(2)}`] : []),
      ...(igst > 0 ? [`IGST (${po.igstPercent || 0}%)   : ₹ ${igst.toFixed(2)}`] : []),
      `═══════════════════════════════════════════════`,
      `TOTAL PAYABLE    : ₹ ${finalTotal.toFixed(2)}`,
      `═══════════════════════════════════════════════`,
      "",
      `Generated: ${new Date().toLocaleString("en-IN")}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${po.poNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: 820, backgroundColor: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.4)", marginBottom: 8 }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Toolbar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", backgroundColor: "#1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={18} style={{ color: "#94a3b8" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Purchase Order Invoice</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {/* Cancel */}
            <button
              onClick={onClose}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "transparent", color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <X size={13} /> Cancel
            </button>
            {/* Save */}
            <button
              onClick={handleSave}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", backgroundColor: "#0369a1", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#0284c7"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0369a1"}
            >
              <Download size={13} /> Save
            </button>
            {/* Print */}
            <button
              onClick={handlePrint}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", backgroundColor: "#44a83e", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#3a9434"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#44a83e"}
            >
              <Printer size={13} /> Print
            </button>
          </div>
        </div>

        {/* ── Invoice Body ── */}
        <div style={{ padding: "24px 28px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#1e293b", letterSpacing: "-1px", lineHeight: 1 }}>PURCHASE</h1>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#44a83e", letterSpacing: "-1px", lineHeight: 1 }}>ORDER</h1>
              <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, backgroundColor: "#f1f5f9" }}>
                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>Ref:</span>
                <span style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: "#1e293b" }}>{po.poNumber}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{
                display: "inline-block", padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                backgroundColor: po.status === "Completed" ? "#dcfce7" : po.status === "Cancelled" ? "#fee2e2" : "#fef9c3",
                color: po.status === "Completed" ? "#166534" : po.status === "Cancelled" ? "#991b1b" : "#92400e"
              }}>
                {po.status || "Pending"}
              </span>
              <div style={{ marginTop: 16 }}>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>Issue Date</p>
                <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{po.poDate || "—"}</p>
              </div>
              <div style={{ marginTop: 10 }}>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>Expected Delivery</p>
                <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600, color: "#e11d48" }}>{po.expectedDeliveryDate || "—"}</p>
              </div>
              <div style={{ marginTop: 10 }}>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>PO Code</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, fontFamily: "monospace", fontWeight: 600, color: "#1e293b" }}>{po.poCode || "—"}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 2, background: "linear-gradient(90deg,#1e293b 0%,#44a83e 50%,#e2e8f0 100%)", borderRadius: 2, marginBottom: 8 }} />

          {/* Supplier + Order Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 8 }}>
            <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Building2 size={15} style={{ color: "#44a83e" }} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b", letterSpacing: "0.06em" }}>Supplier Details</span>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800, color: "#1e293b" }}>{supplier.partyName || "—"}</p>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "#64748b" }}>{supplier.companyName || ""}</p>
              {supplier.address && (
                <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <MapPin size={12} style={{ color: "#94a3b8", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{supplier.address}, {supplier.city} {supplier.pincode}, {supplier.country}</span>
                </div>
              )}
              {supplier.email && (
                <div style={{ display: "flex", gap: 6 }}>
                  <Mail size={12} style={{ color: "#94a3b8", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: "#64748b" }}>{supplier.email}</span>
                </div>
              )}
            </div>

            <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <CreditCard size={15} style={{ color: "#44a83e" }} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b", letterSpacing: "0.06em" }}>Order Details</span>
              </div>
              {[
                ["PO Number", po.poNumber, true],
                ["PO Code", po.poCode, true],
                ["GSTIN", supplier.gstin, true],
                ["Payment Terms", supplier.paymentTerms, false],
              ].map(([label, val, mono]) => val ? (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
                  <span style={mono ? { fontSize: 11, fontFamily: "monospace", backgroundColor: "#e2e8f0", padding: "2px 8px", borderRadius: 4, color: "#1e293b", fontWeight: 600 } : { fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{val}</span>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Items Table */}
          <div style={{ marginBottom: 18, borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#1e293b" }}>
                  {["#", "Product", "HSN Code", "Qty", "Unit", "Rate", "Amount"].map(h => (
                    <th key={h} style={{
                      padding: "8px 10px", fontSize: 10
                      , fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", textAlign: "left", letterSpacing: "0.06em"
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? items.map((item, i) => {
                  const rowTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                      <td style={{
                        padding: "8px 10px", fontSize: 12
                        , color: "#94a3b8", fontWeight: 600
                      }}>{i + 1}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{item.productName || "—"}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{item.poCode || ""}</p>
                      </td>
                      <td style={{
                        padding: "8px 10px", fontSize: 10
                        , color: "#64748b", fontFamily: "monospace"
                      }}>{item.hsn || "—"}</td>
                      <td style={{
                        padding: "8px 10px", fontSize: 10
                        , fontWeight: 600, color: "#1e293b"
                      }}>{item.quantity || 0}</td>
                      <td style={{
                        padding: "8px 10px", fontSize: 10
                        , color: "#64748b"
                      }}>{item.unit || "Pcs"}</td>
                      <td style={{
                        padding: "8px 10px", fontSize: 10
                        , color: "#1e293b"
                      }}>₹ {Number(item.unitPrice || 0).toFixed(2)}</td>
                      <td style={{
                        padding: "8px 10px", fontSize: 10
                        , fontWeight: 700, color: "#1e293b"
                      }}>₹ {rowTotal.toFixed(2)}</td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No items</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: 260 }}>
              {[
                ["Subtotal", `₹ ${subtotal.toFixed(2)}`, false],
                ["Discount", `-₹ ${discount.toFixed(2)}`, true],
                ["Taxable Amount", `₹ ${taxable.toFixed(2)}`, false],
                cgst > 0 ? [`CGST (${po.cgstPercent || 0}%)`, `₹ ${cgst.toFixed(2)}`, false] : null,
                sgst > 0 ? [`SGST (${po.sgstPercent || 0}%)`, `₹ ${sgst.toFixed(2)}`, false] : null,
                igst > 0 ? [`IGST (${po.igstPercent || 0}%)`, `₹ ${igst.toFixed(2)}`, false] : null,
              ].filter(Boolean).map(([label, val, red]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: red ? "#ef4444" : "#1e293b" }}>{val}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px"  , marginTop: 8, background: "linear-gradient(135deg,#1e293b,#334155)", borderRadius: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Total Payable</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#44a83e" }}>₹ {finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 20, paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Generated on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>This is a computer-generated document</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}