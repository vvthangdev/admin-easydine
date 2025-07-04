import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import HomePage from "./pages/HomePage/HomePage";
import Overview from "./pages/Admin/pages/OrderOverview";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Profile from "./pages/Profile/profile";
import AdminLayout from "./pages/Admin/layouts/AdminLayout";
import BanKhongPhaiLaAdmin from "./pages/BanKhongPhaiLaAdmin/BanKhongPhaiLaAdmin";
import TableManagementView from "./pages/TableManagement/TableManagementView";
import ItemManagements from "./pages/ItemManagement/ItemManagementsView";
import UserVoucherManagement from "./pages/User/UserVoucherManagement";
import Header from "../src/components/HomePage/Header";
import OrderManagement from "./pages/OrderManagement/OrderManagementsView";
import CancelItemManagement from "./pages/Admin/pages/CancelItemManagement";
import PaymentSuccess from "./pages/OrderFormModal/Payment/PaymentSuccess";
import PaymentFailed from "./pages/OrderFormModal/Payment/PaymentFailed";

const AppRoutes = () => {
  const navLinks = [{ path: "/", label: "Trang chủ" }];

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
          path="/overview"
          element={
            <ProtectedRoute roles={["ADMIN", "STAFF"]}>
              <AdminLayout>
                <Overview />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tables"
          element={
            <ProtectedRoute roles={["ADMIN", "STAFF"]}>
              <AdminLayout>
                <TableManagementView />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute roles={["ADMIN", "STAFF"]}>
              <AdminLayout>
                <OrderManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute roles={["ADMIN", "STAFF"]}>
              <AdminLayout>
                <ItemManagements />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminLayout>
                <UserVoucherManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cancel-items"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminLayout>
                <CancelItemManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
