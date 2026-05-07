import { useState } from "react";
import POSearch from "../Purchase_Order/POSearch";
import POForm   from "../Purchase_Order/POForm";
import POList   from "../Purchase_Order/POList";
import POInvoice from "../Purchase_Order/POInvoice";

export default function SupplierPO() {
  const [activeTab,        setActiveTab]        = useState("create");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [poList,           setPoList]           = useState([]);
  const [invoicePO,        setInvoicePO]        = useState(null); // shows after creation

  const handlePOSubmit = (data) => {
    const newPO = { id: Date.now(), ...data, status: "Pending" };
    setPoList(prev => [newPO, ...prev]);
    setSelectedSupplier(null);
    setInvoicePO(newPO);          // ← open invoice immediately
    // tab switch happens when user closes the invoice (or they can close and browse freely)
  };

  const handleInvoiceClose = () => {
    setInvoicePO(null);
    setActiveTab("list");         // ← go to list after closing invoice
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: 24 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
            Purchase Orders
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
            Create and manage purchase orders for suppliers
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "2px solid #e2e8f0" }}>
          {[
            { key: "create", label: "Create PO" },
            { key: "list",   label: `View POs${poList.length ? ` (${poList.length})` : ""}` },
          ].map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedSupplier(null); }}
              style={{
                padding: "12px 24px",
                marginBottom: -2,
                backgroundColor: "transparent",
                color: activeTab === tab.key ? "#44a83e" : "#64748b",
                fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                border: "none",
                borderBottom: activeTab === tab.key ? "2px solid #44a83e" : "2px solid transparent",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "create" && (
          <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            {!selectedSupplier ? (
              <POSearch onSelectSupplier={setSelectedSupplier} />
            ) : (
              <POForm
                supplier={selectedSupplier}
                onBack={() => setSelectedSupplier(null)}
                onSubmit={handlePOSubmit}
              />
            )}
          </div>
        )}

        {activeTab === "list" && (
          <POList
            poList={poList}
            setPoList={setPoList}
          />
        )}
      </div>

      {/* Invoice modal — shown immediately after PO creation */}
      {invoicePO && (
        <POInvoice po={invoicePO} onClose={handleInvoiceClose} />
      )}
    </div>
  );
}