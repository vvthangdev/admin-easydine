import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Features/Login/Login";
import HomePage from "./Features/HomePage/HomePage";
import Overview from "./Features/Admin/pages/Overview";
import Register from "./Features/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Profile from "./Features/Profile/profile";
import AdminLayout from "./Features/Admin/layouts/AdminLayout";
import BanKhongPhaiLaAdmin from "./Features/BanKhongPhaiLaAdmin/BanKhongPhaiLaAdmin";
import TableManagement from "./Features/TableManagement/TableManagements";
import ItemManagements from "./Features/ItemManagement/ItemManagements";
import UserManagement from "./Features/User/UserManagement";
import Header from "../src/components/HomePage/Header";
import OrderManagements from "./Features/OrderManagement/OrderManagement";
import ContactManagement from "./Features/Admin/pages/ContactManagement";

const AppRoutes = () => {
  const navLinks = [{ path: "/", label: "Trang chủ" }];
  return (
    <AuthProvider>
      <Router>
        <Header logo="/Assets/Header/logo1.png" navLinks={navLinks} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<BanKhongPhaiLaAdmin />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="tables" element={<TableManagement />} />
            <Route path="menu" element={<ItemManagements />} />
            <Route path="orders" element={<OrderManagements />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="contacts" element={<ContactManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;