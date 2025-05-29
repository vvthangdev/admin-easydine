import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import HomePage from "./pages/HomePage/HomePage";
import Overview from "./pages/Admin/pages/Overview";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Profile from "./pages/Profile/profile";
import AdminLayout from "./pages/Admin/layouts/AdminLayout";
import BanKhongPhaiLaAdmin from "./pages/BanKhongPhaiLaAdmin/BanKhongPhaiLaAdmin";
import MergeOrderModalViewModel from "./pages/TableManagement/TableManagementView";
import ItemManagements from "./pages/ItemManagement/ItemManagements";
import UserVoucherManagement from "./pages/User/UserVoucherManagement";
import Header from "../src/components/HomePage/Header";
import OrderManagements from "./pages/OrderManagement/OrderManagement";
import ContactManagement from "./pages/Admin/pages/ContactManagement";
import PaymentSuccess from "./pages/OrderFormModal/PaymentSuccess";
import PaymentFailed from "./pages/OrderFormModal/PaymentFailed";

const AppRoutes = () => {
  const navLinks = [
    { path: "/", label: "Trang chủ" },
  ];

  return (
    <>
      <Header logo="/Assets/Header/logo1.png" navLinks={navLinks} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<BanKhongPhaiLaAdmin />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
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
          <Route path="tables" element={<MergeOrderModalViewModel />} />
          <Route path="items" element={<ItemManagements />} />
          <Route path="orders" element={<OrderManagements />} />
          <Route path="users" element={<UserVoucherManagement />} />
          <Route path="contacts" element={<ContactManagement />} />
          <Route path="payment" element={<ContactManagement />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;