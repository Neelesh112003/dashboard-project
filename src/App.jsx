import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import Layout from "./components/Layout";
import Overview from "./components/Overview";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import NotFound from "./components/pages/NotFound";

export default function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SidebarProvider>
  );
}