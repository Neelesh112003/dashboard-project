import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import Layout from "./components/Layout";
import Overview from "./components/Overview";
import Login from "./components/Login";
import Register from "./components/auth/Register";
import NotFound from "./components/pages/NotFound";
import ManageAdmins from "./components/ManageAdmin";
import PurchaseOrders from "./components/PurchaseOrders";
import ProductList from "./components/ProductList";
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





export default function App() {
  return (
    <SidebarProvider>
      <Routes>
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
          <Route path="/gate-entry/stock-allocation" element={<StockAllocation />} />
          <Route path="/gate-entry/quality-control" element={<GateQC />} />


          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/product-list" element={<ProductList />} />
          
          
          <Route path="/godowns" element={<ManageGodown />} />
          <Route path="/inventory-management" element={<ManageInventory />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SidebarProvider>
  );
}