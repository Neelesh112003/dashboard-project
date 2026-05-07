import { useState, useEffect } from "react";
import { Trash2, Download, Pencil, Eye, X, FileText, Building2, MapPin, Mail, CreditCard, Calendar, Hash } from "lucide-react";
import { createPortal } from "react-dom";
import jsPDF from "jspdf";
import InvoiceForm from "../Purchases/InvoiceForm";

// ── Invoice View Modal ────────────────────────────────────────────────────────
function InvoiceViewModal({ invoice, onClose }) {
  const supplier   = invoice.supplier   || {};
  const items      = invoice.items      || [];
  const subtotal   = invoice.subtotal   || 0;
  const discount   = invoice.discountAmount || 0;
  const taxable    = subtotal - discount;
  const cgst       = invoice.cgst       || 0;
  const sgst       = invoice.sgst       || 0;
  const igst       = invoice.igst       || 0;
  const finalTotal = invoice.finalTotal || invoice.total || 0;

  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${invoice.invoiceNumber}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;color:#30333e;background:#fff}
    .page{max-width:800px;margin:0 auto;padding:40px}
    table{width:100%;border-collapse:collapse}
    th{background:#30333e;color:#fff;padding:10px 14px;font-size:11px;text-transform:uppercase;text-align:left}
    td{padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:13px}
    </style></head><body><div class="page">
    <div style="display:flex;justify-content:space-between;margin-bottom:40px">
      <div>
        <h1 style="font-size:32px;font-weight:900;color:#30333e;letter-spacing:-1px">INVOICE</h1>
        <p style="font-family:monospace;font-size:14px;color:#3a3c44;margin-top:4px">${invoice.invoiceNumber}</p>
        ${invoice.poRef ? `<p style="font-size:12px;color:#44a83e;margin-top:4px">PO Ref: ${invoice.poRef}</p>` : ""}
      </div>
      <div style="text-align:right">
        <p><strong>Invoice Date:</strong> ${invoice.invoiceDate || "-"}</p>
        <p><strong>Due Date:</strong> ${invoice.dueDate || "-"}</p>
        <p><strong>Status:</strong> ${invoice.status || "Unpaid"}</p>
      </div>
    </div>
    <div style="margin-bottom:32px">
      <p style="font-size:11px;color:#3a3c44;text-transform:uppercase;font-weight:600;margin-bottom:8px">Bill To</p>
      <p style="font-size:16px;font-weight:700">${supplier.partyName || "-"}</p>
      <p style="font-size:13px;color:#3a3c44">${supplier.companyName || ""}</p>
      <p style="font-size:13px;color:#3a3c44">${supplier.address || ""}, ${supplier.city || ""} ${supplier.pincode || ""}</p>
      <p style="font-size:13px;color:#3a3c44">GSTIN: ${supplier.gstin || "-"}</p>
    </div>
    <table><thead><tr><th>#</th><th>Product</th><th>HSN</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th></tr></thead>
    <tbody>
    ${items.map((it, i) => `<tr><td>${i+1}</td><td>${it.productName || "-"}<br><span style="font-size:11px;color:#888">${it.poCode||""}</span></td><td>${it.hsn||"-"}</td><td>${it.quantity||0}</td><td>${it.unit||"Pcs"}</td><td>₹${Number(it.unitPrice||0).toFixed(2)}</td><td>₹${(Number(it.quantity||0)*Number(it.unitPrice||0)).toFixed(2)}</td></tr>`).join("")}
    </tbody></table>
    <div style="text-align:right;margin-top:24px">
      <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
      <p>Discount: -₹${discount.toFixed(2)}</p>
      ${cgst>0?`<p>CGST: ₹${cgst.toFixed(2)}</p>`:""}
      ${sgst>0?`<p>SGST: ₹${sgst.toFixed(2)}</p>`:""}
      ${igst>0?`<p>IGST: ₹${igst.toFixed(2)}</p>`:""}
      <p style="font-size:20px;font-weight:800;margin-top:12px;padding-top:12px;border-top:2px solid #30333e">Total: ₹${finalTotal.toFixed(2)}</p>
    </div>
    ${invoice.notes ? `<div style="margin-top:32px;padding:16px;background:#f5f5f5;border-radius:8px"><p style="font-size:11px;color:#3a3c44;text-transform:uppercase;font-weight:600;margin-bottom:6px">Notes</p><p style="font-size:13px">${invoice.notes}</p></div>` : ""}
    <p style="margin-top:40px;font-size:11px;color:#888;text-align:center">This is a computer-generated invoice</p>
    </div></body></html>`);
    win.document.close(); win.print();
  };

  const statusColor = {
    "Paid":    { bg: "#dcfce7", text: "#166534" },
    "Unpaid":  { bg: "#fef9c3", text: "#92400e" },
    "Overdue": { bg: "#fee2e2", text: "#991b1b" },
    "Draft":   { bg: "#f1f5f9", text: "#3a3c44" },
  }[invoice.status || "Unpaid"] || { bg: "#fef9c3", text: "#92400e" };

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}
      onClick={onClose}>
      <div style={{ width: "100%", maxWidth: 860, backgroundColor: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.45)", marginBottom: 24 }}
        onClick={(e) => e.stopPropagation()}>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: "linear-gradient(135deg, #30333e 0%, #3a3c44 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={16} style={{ color: "#44a83e" }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Invoice Viewer</span>
            <span style={{ fontSize: 11, fontFamily: "monospace", backgroundColor: "rgba(255,255,255,0.1)", color: "#86efac", padding: "3px 8px", borderRadius: 4 }}>{invoice.invoiceNumber}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handlePrint}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", backgroundColor: "#44a83e", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              <Download size={13} /> Print / Save PDF
            </button>
            <button onClick={onClose}
              style={{ width: 34, height: 34, borderRadius: 8, border: "none", backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div style={{ padding: "44px 52px" }}>

          {/* Invoice Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 40, fontWeight: 900, color: "#30333e", letterSpacing: "-2px", lineHeight: 1 }}>INVOICE</h1>
              <p style={{ margin: "10px 0 0", fontSize: 13, fontFamily: "monospace", color: "#3a3c44" }}>{invoice.invoiceNumber}</p>
              {invoice.poRef && (
                <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, backgroundColor: "#f0fdf4", border: "1px solid #b9f0b4" }}>
                  <Hash size={11} style={{ color: "#44a83e" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#44a83e" }}>PO Ref: {invoice.poRef}</span>
                </div>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ display: "inline-block", padding: "6px 18px", borderRadius: 20, fontSize: 12, fontWeight: 800, backgroundColor: statusColor.bg, color: statusColor.text }}>
                {invoice.status || "Unpaid"}
              </span>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                {[
                  ["Invoice Date", invoice.invoiceDate],
                  ["Due Date",     invoice.dueDate, true],
                ].map(([label, val, red]) => val ? (
                  <div key={label}>
                    <p style={{ margin: 0, fontSize: 10, color: "#888", textTransform: "uppercase", fontWeight: 700 }}>{label}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: red ? "#dc2626" : "#30333e" }}>{val}</p>
                  </div>
                ) : null)}
              </div>
            </div>
          </div>

          {/* Gradient Rule */}
          <div style={{ height: 3, background: "linear-gradient(90deg, #30333e 0%, #44a83e 60%, #e2e8f0 100%)", borderRadius: 2, marginBottom: 32 }} />

          {/* Supplier + Order Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 32 }}>
            <div style={{ backgroundColor: "#f5f5f5", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Building2 size={14} style={{ color: "#44a83e" }} />
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#3a3c44", letterSpacing: "0.07em" }}>Supplier</span>
              </div>
              <p style={{ margin: "0 0 2px", fontSize: 17, fontWeight: 800, color: "#30333e" }}>{supplier.partyName || "—"}</p>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: "#3a3c44" }}>{supplier.companyName}</p>
              {supplier.address && (
                <div style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                  <MapPin size={12} style={{ color: "#888", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: "#3a3c44", lineHeight: 1.5 }}>{supplier.address}, {supplier.city} {supplier.pincode}, {supplier.country}</span>
                </div>
              )}
              {supplier.email && (
                <div style={{ display: "flex", gap: 6 }}>
                  <Mail size={12} style={{ color: "#888" }} />
                  <span style={{ fontSize: 12, color: "#3a3c44" }}>{supplier.email}</span>
                </div>
              )}
            </div>

            <div style={{ backgroundColor: "#f5f5f5", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <CreditCard size={14} style={{ color: "#44a83e" }} />
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#3a3c44", letterSpacing: "0.07em" }}>Payment Details</span>
              </div>
              {[
                ["GSTIN",          supplier.gstin, true],
                ["Payment Terms",  invoice.paymentTerms || supplier.paymentTerms],
                ["Supplier Code",  supplier.code, true],
              ].filter(([, v]) => v).map(([label, val, mono]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#3a3c44" }}>{label}</span>
                  <span style={mono ? { fontSize: 11, fontFamily: "monospace", backgroundColor: "#e2e8f0", padding: "2px 8px", borderRadius: 4, color: "#30333e", fontWeight: 700 } : { fontSize: 12, fontWeight: 600, color: "#30333e" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Items Table */}
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #30333e, #3a3c44)" }}>
                  {["#", "Product", "HSN", "Qty", "Unit", "Rate", "Amount"].map(h => (
                    <th key={h} style={{ padding: "12px 14px", fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#888", textAlign: "left", letterSpacing: "0.07em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? items.map((item, i) => {
                  const rowTotal = (parseFloat(item.quantity)||0) * (parseFloat(item.unitPrice)||0);
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: i % 2 === 0 ? "#fff" : "#f5f5f5" }}>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "#888", fontWeight: 700 }}>{i+1}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#30333e" }}>{item.productName || "—"}</p>
                        <p style={{ margin: "1px 0 0", fontSize: 10, color: "#888", fontFamily: "monospace" }}>{item.poCode || ""}</p>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 11, color: "#3a3c44", fontFamily: "monospace" }}>{item.hsn || "—"}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 700, color: "#30333e" }}>{item.quantity || 0}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "#3a3c44" }}>{item.unit || "Pcs"}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "#30333e" }}>₹ {Number(item.unitPrice||0).toFixed(2)}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 800, color: "#30333e" }}>₹ {rowTotal.toFixed(2)}</td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#888", fontSize: 13 }}>No items</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
            <div style={{ width: 340 }}>
              {[
                ["Subtotal",       `₹ ${subtotal.toFixed(2)}`,       false],
                ["Discount",       `-₹ ${discount.toFixed(2)}`,      true],
                ["Taxable Amount", `₹ ${taxable.toFixed(2)}`,        false],
                cgst > 0 ? [`CGST (${invoice.cgstPercent||0}%)`, `₹ ${cgst.toFixed(2)}`, false] : null,
                sgst > 0 ? [`SGST (${invoice.sgstPercent||0}%)`, `₹ ${sgst.toFixed(2)}`, false] : null,
                igst > 0 ? [`IGST (${invoice.igstPercent||0}%)`, `₹ ${igst.toFixed(2)}`, false] : null,
              ].filter(Boolean).map(([label, val, red]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 13, color: "#3a3c44" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: red ? "#ef4444" : "#30333e" }}>{val}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", marginTop: 10, background: "linear-gradient(135deg, #30333e, #3a3c44)", borderRadius: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Total Payable</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#44a83e" }}>₹ {finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Mode */}
          {invoice.paymentMode && (
            <div style={{ backgroundColor: "#f5f5f5", borderRadius: 10, padding: 16, marginBottom: 24, border: "1px solid #e2e8f0" }}>
              <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#888", letterSpacing: "0.07em" }}>Payment Mode</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{invoice.paymentMode === "Cash" ? "💵" : invoice.paymentMode === "Credit" ? "💳" : "🏦"}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#30333e" }}>{invoice.paymentMode}</p>
                  {invoice.paymentMode === "Bank" && invoice.bankName && (
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#3a3c44" }}>
                      {invoice.bankName}
                      {invoice.utrRef ? ` · UTR: ${invoice.utrRef}` : ""}
                      {invoice.chequeRef ? ` · Cheque: ${invoice.chequeRef}` : ""}
                    </p>
                  )}
                  {invoice.paymentMode === "Credit" && invoice.paymentTerms && (
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#3a3c44" }}>Terms: {invoice.paymentTerms}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div style={{ backgroundColor: "#f5f5f5", borderRadius: 10, padding: 16, marginBottom: 24, border: "1px solid #e2e8f0" }}>
              <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#888", letterSpacing: "0.07em" }}>Notes</p>
              <p style={{ margin: 0, fontSize: 13, color: "#30333e", lineHeight: 1.6 }}>{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div style={{ paddingTop: 20, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#888" }}>Generated {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#888" }}>This is a computer-generated invoice</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── InvoiceList ───────────────────────────────────────────────────────────────
export default function InvoiceList({ invoiceData }) {
  const [invoiceList, setInvoiceList] = useState([]);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    if (invoiceData) {
      setInvoiceList((prev) => {
        const exists = prev.some(inv => inv.invoiceNumber === invoiceData.invoiceNumber);
        if (exists) return prev;
        return [{ id: Date.now(), ...invoiceData, status: "Unpaid" }, ...prev];
      });
    }
  }, [invoiceData]);

  const handleDelete   = (id) => setInvoiceList(invoiceList.filter(inv => inv.id !== id));
  const handleStatusChange = (id, status) => setInvoiceList(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));

  const handleDownload = (inv) => {
    const doc = new jsPDF();
    doc.setFontSize(20); doc.text("INVOICE", 20, 20);
    doc.setFontSize(12);
    doc.text(`Invoice No: ${inv.invoiceNumber}`, 20, 36);
    doc.text(`PO Ref:     ${inv.poRef || "-"}`, 20, 46);
    doc.text(`Supplier:   ${inv.supplier?.partyName || "-"}`, 20, 56);
    doc.text(`Date:       ${inv.invoiceDate || "-"}`, 20, 66);
    doc.text(`Due Date:   ${inv.dueDate || "-"}`, 20, 76);
    doc.text(`Status:     ${inv.status || "Unpaid"}`, 20, 86);
    doc.text(`CGST:       ₹ ${(inv.cgst || 0).toFixed(2)}`, 20, 98);
    doc.text(`SGST:       ₹ ${(inv.sgst || 0).toFixed(2)}`, 20, 108);
    doc.text(`IGST:       ₹ ${(inv.igst || 0).toFixed(2)}`, 20, 118);
    doc.text(`Total:      ₹ ${Number(inv.finalTotal || inv.total || 0).toFixed(2)}`, 20, 128);
    doc.save(`${inv.invoiceNumber}.pdf`);
  };

  // If editing, show the full InvoiceForm
  if (editingInvoice) {
    return (
      <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <InvoiceForm
          existingInvoice={editingInvoice}
          isEdit={true}
          onBack={() => setEditingInvoice(null)}
          onSubmit={(updatedInvoice) => {
            setInvoiceList(prev => prev.map(inv => inv.id === editingInvoice.id ? { ...inv, ...updatedInvoice, status: inv.status } : inv));
            setEditingInvoice(null);
          }}
        />
      </div>
    );
  }

  const statusColors = {
    "Paid":    { bg: "#dcfce7", text: "#166534" },
    "Unpaid":  { bg: "#fef9c3", text: "#92400e" },
    "Overdue": { bg: "#fee2e2", text: "#991b1b" },
    "Draft":   { bg: "#f1f5f9", text: "#3a3c44" },
  };

  const totalUnpaid = invoiceList.filter(i => i.status === "Unpaid" || i.status === "Overdue").reduce((s, i) => s + Number(i.finalTotal || i.total || 0), 0);
  const totalPaid   = invoiceList.filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.finalTotal || i.total || 0), 0);

  return (
    <div>
      {viewInvoice && <InvoiceViewModal invoice={viewInvoice} onClose={() => setViewInvoice(null)} />}

      {/* Summary Cards */}
      {invoiceList.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
          {[
            { label: "Total Invoices",  value: invoiceList.length,     unit: "invoices",  bg: "#f5f5f5", border: "#e2e8f0", color: "#30333e" },
            { label: "Outstanding",     value: `₹ ${totalUnpaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, unit: "", bg: "#fef9c3", border: "#fde047", color: "#92400e" },
            { label: "Collected",       value: `₹ ${totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,   unit: "", bg: "#dcfce7", border: "#86efac", color: "#166534" },
          ].map(card => (
            <div key={card.label} style={{ backgroundColor: card.bg, border: `1.5px solid ${card.border}`, borderRadius: 12, padding: "16px 20px" }}>
              <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: card.color, opacity: 0.7, letterSpacing: "0.05em" }}>{card.label}</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#30333e" }}>Invoices</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>{invoiceList.length} invoice{invoiceList.length !== 1 ? "s" : ""} total</p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #e2e8f0" }}>
                {["Invoice No.", "PO Ref", "Supplier", "Invoice Date", "Due Date", "Total (₹)", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", fontSize: 10, textAlign: "left", color: "#3a3c44", fontWeight: 800, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoiceList.map((inv) => {
                const sc = statusColors[inv.status] || statusColors["Unpaid"];
                return (
                  <tr key={inv.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>

                    <td style={{ padding: "14px 14px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 12, backgroundColor: "#f0fdf4", color: "#44a83e", padding: "3px 8px", borderRadius: 5, fontWeight: 700 }}>{inv.invoiceNumber}</span>
                    </td>
                    <td style={{ padding: "14px 14px", fontSize: 12, fontFamily: "monospace", color: "#3a3c44" }}>{inv.poRef || "—"}</td>
                    <td style={{ padding: "14px 14px", fontSize: 13, fontWeight: 600, color: "#30333e" }}>{inv.supplier?.partyName || "—"}</td>
                    <td style={{ padding: "14px 14px", fontSize: 13, color: "#3a3c44" }}>{inv.invoiceDate || "—"}</td>
                    <td style={{ padding: "14px 14px", fontSize: 13, color: "#3a3c44" }}>{inv.dueDate || "—"}</td>
                    <td style={{ padding: "14px 14px", fontSize: 13, fontWeight: 800, color: "#30333e" }}>
                      ₹ {Number(inv.finalTotal || inv.total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Editable Status */}
                    <td style={{ padding: "14px 14px" }}>
                      <select value={inv.status || "Unpaid"}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                        style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800, border: "none", backgroundColor: sc.bg, color: sc.text, cursor: "pointer", outline: "none" }}>
                        <option>Unpaid</option>
                        <option>Paid</option>
                        <option>Overdue</option>
                        <option>Draft</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setViewInvoice(inv)} title="View Invoice"
                          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #b9f0b4", background: "#f0fdf4", color: "#44a83e", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <Eye size={13} />
                        </button>
                        <button onClick={() => setEditingInvoice(inv)} title="Edit"
                          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#3a3c44", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDownload(inv)} title="Download PDF"
                          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#3a3c44", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <Download size={13} />
                        </button>
                        <button onClick={() => handleDelete(inv.id)} title="Delete"
                          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #fecaca", background: "#fff5f5", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {invoiceList.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "60px 24px" }}>
                    <FileText size={44} style={{ margin: "0 auto 14px", display: "block", color: "#e2e8f0" }} />
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#30333e", marginBottom: 6 }}>No Invoices Yet</p>
                    <p style={{ margin: 0, fontSize: 13, color: "#888" }}>Create an invoice from the "Create Invoice" tab.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}