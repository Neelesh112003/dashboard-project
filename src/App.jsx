import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import Layout from "./components/Layout";
import Overview from "./components/Overview";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import NotFound from "./components/pages/NotFound";
import ManageAdmins from "./components/ManageAdmin";
import PurchaseOrders from "./components/PurchaseOrders";
import ProductList from "./components/ProductList";
import ManageTeamAndDepartment from "./components/ManageTeamAndDepartment";

export default function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/manage-admins" element={<ManageAdmins />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/manage-teams-departments" element={<ManageTeamAndDepartment />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SidebarProvider>
  );
}