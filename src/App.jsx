// ============================================================
// File: client/src/App.jsx
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login          from './pages/auth/Login';
import Register       from './pages/auth/Register';
import Dashboard      from './pages/Dashboard';
import ProductIndex   from './pages/products/ProductIndex';
import ProductCreate  from './pages/products/ProductCreate';
import ProductEdit    from './pages/products/ProductEdit';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect root ke login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth routes (publik) */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/products" element={
            <PrivateRoute><ProductIndex /></PrivateRoute>
          } />
          <Route path="/products/create" element={
            <PrivateRoute><ProductCreate /></PrivateRoute>
          } />
          <Route path="/products/:id/edit" element={
            <PrivateRoute><ProductEdit /></PrivateRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <h2>404 – Halaman Tidak Ditemukan</h2>
              <a href="/dashboard">Kembali ke Dashboard</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
