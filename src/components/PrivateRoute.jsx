// ============================================================
// File: client/src/components/PrivateRoute.jsx
// Redirect ke /login jika user belum login
// ============================================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Memuat...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}
