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
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/manage-departments" element={<ManageDepartment />} />
          <Route path="/manage-team" element={<ManageTeam />} />
          <Route path="/godowns" element={<ManageGodown />} />
          <Route path="/inventory-management" element={<ManageInventory />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SidebarProvider>
  );
}