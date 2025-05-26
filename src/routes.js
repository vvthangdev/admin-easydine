import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Features/Login/Login';
import HomePage from './Features/HomePage/HomePage';
import Overview from './Features/Admin/pages/Overview';
import Register from './Features/Register/Register';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import Profile from './Features/Profile/profile';
import AdminLayout from './Features/Admin/layouts/AdminLayout';
import BanKhongPhaiLaAdmin from './Features/BanKhongPhaiLaAdmin/BanKhongPhaiLaAdmin';
import MergeOrderModalViewModel from './Features/TableManagement/TableManagementView';
import ItemManagements from './Features/ItemManagement/ItemManagements';
import UserVoucherManagement from './Features/User/UserVoucherManagement';
import Header from '../src/components/HomePage/Header';
import OrderManagements from './Features/OrderManagement/OrderManagement';
import ContactManagement from './Features/Admin/pages/ContactManagement';
import PaymentSuccess from './Features/OrderFormModal/PaymentSuccess';
import PaymentFailed from './Features/OrderFormModal/PaymentFailed';
import SocketTestComponent from './SocketTestComponent ';

const AppRoutes = () => {
    const navLinks = [{ path: '/', label: 'Trang chủ' }];
    
    console.log('[AppRoutes.js] Initializing router with navLinks:', navLinks);
    
    return (
            <Router>
                {console.log('[AppRoutes.js] Rendering Header')}
                <Header logo='/Assets/Header/logo1.png' navLinks={navLinks} />
                <Routes>
                    {console.log('[AppRoutes.js] Setting up routes')}
                    <Route path='/' element={<HomePage />} />
                    <Route path='/test' element={<SocketTestComponent />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/unauthorized' element={<BanKhongPhaiLaAdmin />} />
                    <Route path='/payment-success' element={<PaymentSuccess />} />
                    <Route path='/payment-failed' element={<PaymentFailed />} />
                    <Route
                        path='/profile'
                        element={
                            <ProtectedRoute>
                                {console.log('[AppRoutes.js] Rendering Profile route')}
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/admin'
                        element={
                            <ProtectedRoute roles={['ADMIN']}>
                                {console.log('[AppRoutes.js] Rendering Admin route')}
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Overview />} />
                        <Route path='overview' element={<Overview />} />
                        <Route path='tables' element={<MergeOrderModalViewModel />} />
                        <Route path='menu' element={<ItemManagements />} />
                        <Route path='orders' element={<OrderManagements />} />
                        <Route path='users' element={<UserVoucherManagement />} />
                        <Route path='contacts' element={<ContactManagement />} />
                        <Route path='payment' element={<ContactManagement />} />
                    </Route>
                </Routes>
            </Router>
       
    );
};

export default AppRoutes;