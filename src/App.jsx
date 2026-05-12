import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import Layout from "./components/Layout";
import Overview from "./components/dashboard/Overview";
import Login from "./components/Login";
import Register from "./components/auth/Register";
import NotFound from "./components/pages/NotFound";
import ManageAdmins from "./components/ManageAdmin";
import PurchaseOrders from "./components/PurchaseOrders";
import ManageDepartment from "./components/ManageDepartment";
import SuperAdminLogin from "./components/SuperAdminLogin";
import ManageTeam from "./components/ManageTeam";
import ManageGodown from "./components/ManageGodown";
import ManageInventory from "./components/ManageInventory";
import SupplierPage from "./components/pages/SupplierPage";
import SupplierPO from "./components/suppliers/SupplierPO";
import Purchases from "./components/suppliers/Purchases";
import GRN from "./components/gate-entry/GRN";
import StockAllocation from "./components/gate-entry/StockAllocation";
import GateQC from "./components/gate-entry/GateQC";
import CustomerForm from "./components/pages/CustomerPage";
import CustomerPage from "./components/pages/CustomerPage";

/* CUSTOMERS */
import CustomersList from "./components/customers/CustomersList";
import CustomerQuotations from "./components/customers/CustomerQuotations";
import CustomerPO from "./components/customers/CustomerPO";
import CustomerInvoicing from "./components/customers/CustomerInvoicing";
import CustomerReturns from "./components/customers/CustomerReturns";
import CustomerSummary from "./components/customers/CustomerSummary";


/* PRODUCTS */
import ProductList from "./components/products/ProductList";
import ProductGroups from "./components/products/ProductGroups";
import HSNGroups from "./components/products/HSNGroups";

/* BOM */
import BOMGroups from "./components/bom/BOMGroups";
import ManageBOM from "./components/bom/ManageBOM";

/* INVENTORY */
import InventoryManage from "./components/inventory/InventoryManage";
import ProductionStock from "./components/inventory/ProductionStock";
import RawStock from "./components/inventory/RawStock";

/* GODOWNS */
import Godowns from "./components/godowns/Godowns";

/* SMT */
import SMTStore from "./components/smt/SMTStore";

/* ASSEMBLY */
import AssemblyManage from "./components/assembly/AssemblyManage";
import AssemblyProduction from "./components/assembly/AssemblyProduction";
import MaterialHistory from "./components/assembly/MaterialHistory";

/* PRODUCTION */
import Production from "./components/production/Production";
import ProductionCalculator from "./components/production/ProductionCalculator";

/* DISPATCH */
import Dispatch from "./components/dispatch/Dispatch";

/* QUALITY */
import QCChecklists from "./components/quality/QCChecklists";
import QCChecklistHistory from "./components/quality/QCChecklistHistory";
import QCChecklistgroups from "./components/quality/QCChecklistgroups";
import ChecklistReceipt from "./components/quality/ChecklistReceipt";

/* LOGS */
import Transactions from "./components/details/Transactions";
import LoginHistory from "./components/details/LoginHistory";
import SoftwareTrail from "./components/details/SoftwareTrail";

/* CASH & BANK */
import CashBook from "./components/transactions/CashBook";
import BankBook from "./components/transactions/BankBook";
import ManageBanks from "./components/transactions/ManageBanks";

export default function App() {
  return (
    <SidebarProvider>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/signup" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Overview />} />

          <Route path="/manage-admin" element={<ManageAdmins />} />
          <Route path="/manage-team" element={<ManageTeam />} />

          <Route path="/manage-departments" element={<ManageDepartment />} />

          <Route path="/customers/list" element={<CustomerPage />} />

          <Route path="/suppliers/list" element={<SupplierPage />} />
          <Route path="/suppliers/purchase-orders" element={<SupplierPO />} />
          <Route path="/suppliers/purchases" element={<Purchases />} />
          <Route path="/suppliers/purchase-orders" element={<SupplierPO />} />

          <Route path="/gate-entry/grn" element={<GRN />} />
          <Route
            path="/gate-entry/stock-allocation"
            element={<StockAllocation />}
          />
          <Route path="/gate-entry/quality-control" element={<GateQC />} />

          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/product-list" element={<ProductList />} />

          <Route path="/godowns" element={<ManageGodown />} />
          <Route path="/inventory-management" element={<ManageInventory />} />

          <Route path="/customers/list" element={<CustomerPage />} />
          <Route
            path="/customers/quotations"
            element={<CustomerQuotations />}
          />
          <Route path="/customers/po" element={<CustomerPO />} />
          <Route path="/customers/invoicing" element={<CustomerInvoicing />} />
          <Route
            path="/customers/returns-inwards"
            element={<CustomerReturns />}
          />
          <Route path="/customers/summary" element={<CustomerSummary />} />

          <Route path="/products/list" element={<ProductList />} />
          <Route path="/products/groups" element={<ProductGroups />} />
          <Route path="/products/hsn-groups" element={<HSNGroups />} />

          <Route path="/bom/groups" element={<BOMGroups />} />
          <Route path="/bom/manage" element={<ManageBOM />} />

          <Route path="/inventory/manage" element={<InventoryManage />} />
          <Route
            path="/inventory/production-stock"
            element={<ProductionStock />}
          />
          <Route path="/inventory/raw-stock" element={<RawStock />} />

          <Route path="/smt-store" element={<SMTStore />} />

          <Route path="/assembly-line/manage" element={<AssemblyManage />} />
          <Route
            path="/assembly-line/production"
            element={<AssemblyProduction />}
          />
          <Route
            path="/assembly-line/material-history"
            element={<MaterialHistory />}
          />

          <Route path="/production" element={<Production />} />
          <Route
            path="/production/calculator"
            element={<ProductionCalculator />}
          />

          <Route path="/quality/checklists" element={<QCChecklists />} />
          <Route path="/quality/history" element={<QCChecklistHistory />} />
          <Route
            path="/quality/checklist-groups"
            element={<QCChecklistgroups />}
          />
          <Route
            path="/quality/checklist-receipt"
            element={<ChecklistReceipt />}
          />

          <Route path="/logs/transactions" element={<Transactions />} />
          <Route path="/logs/login-history" element={<LoginHistory />} />
          <Route path="/logs/software-trail" element={<SoftwareTrail />} />

          <Route path="/dispatch" element={<Dispatch />} />

          <Route path="/transactions/cash-book" element={<CashBook />} />
          <Route path="/transactions/bank-book" element={<BankBook />} />
          <Route path="/transactions/manage-banks" element={<ManageBanks />} />

          <Route path="/transactions/cash-book" element={<CashBook />} />
          <Route path="/transactions/bank-book" element={<BankBook />} />
          <Route path="/transactions/manage-banks" element={<ManageBanks />} />

          <Route path="/dispatch" element={<Dispatch />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </SidebarProvider>
  );
}
