import { useState } from "react";
import InvoiceSearch from "../Purchases/InvoiceSearch";
import InvoiceForm from "../Purchases/InvoiceForm";
import InvoiceList from "../Purchases/InvoiceList";

export default function Purchases() {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedPO, setSelectedPO] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: 24 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#30333e", marginBottom: 6 }}>
            Purchases
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "#3a3c44" }}>
            Create and manage supplier invoices linked to purchase orders
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "2px solid #e2e8f0" }}>
          {[
            { key: "create", label: "Create Invoice" },
            { key: "list",   label: "View Invoices"  },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "12px 24px",
                marginBottom: -2,
                backgroundColor: "transparent",
                color: activeTab === tab.key ? "#44a83e" : "#888",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                borderBottom: activeTab === tab.key ? "2px solid #44a83e" : "2px solid transparent",
                transition: "all 0.2s",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "create" && (
          <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            {!selectedPO ? (
              <InvoiceSearch onSelectPO={setSelectedPO} />
            ) : (
              <InvoiceForm
                sourcePO={selectedPO}
                onBack={() => setSelectedPO(null)}
                onSubmit={(data) => {
                  setInvoiceData(data);
                  setActiveTab("list");
                  setSelectedPO(null);
                }}
              />
            )}
          </div>
        )}

        {activeTab === "list" && <InvoiceList invoiceData={invoiceData} />}
      </div>
    </div>
  );
}