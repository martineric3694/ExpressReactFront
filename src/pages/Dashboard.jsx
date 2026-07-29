// ============================================================
// File: client/src/pages/Dashboard.jsx
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/api';
import Layout from '../components/Layout';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats,   setStats]   = useState({ total: 0, totalStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAll()
      .then(data => {
        const products = data.products || [];
        const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
        setStats({ total: products.length, totalStock });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="text-muted">Selamat datang, <strong>{user?.name}</strong>!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-body">
            <span className="stat-label">Total Produk</span>
            <span className="stat-value">
              {loading ? '...' : stats.total}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-body">
            <span className="stat-label">Total Stok</span>
            <span className="stat-value">
              {loading ? '...' : stats.totalStock}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-body">
            <span className="stat-label">Role</span>
            <span className="stat-value">{user?.role || '-'}</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Aksi Cepat</h2>
        <div className="action-grid">
          <Link to="/products" className="action-card">
            <span className="action-icon">📋</span>
            <span>Lihat Produk</span>
          </Link>
          <Link to="/products/create" className="action-card">
            <span className="action-icon">➕</span>
            <span>Tambah Produk</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
