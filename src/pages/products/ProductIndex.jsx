// ============================================================
// File: client/src/pages/products/ProductIndex.jsx
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/api';
import Layout from '../../components/Layout';

export default function ProductIndex() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [deleting, setDeleting] = useState(null); // id produk yang sedang dihapus

  const fetchProducts = () => {
    setLoading(true);
    productService.getAll()
      .then(data => setProducts(data.products || []))
      .catch(err  => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus produk "${name}"?`)) return;
    setDeleting(id);
    try {
      await productService.destroy(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  return (
    <Layout>
      <div className="page-header">
        <h1>Daftar Produk</h1>
        <Link to="/products/create" className="btn btn-primary">+ Tambah Produk</Link>
      </div>

      {error   && <div className="alert alert-error">{error}</div>}
      {loading && <div className="loading">Memuat produk...</div>}

      {!loading && products.length === 0 && (
        <div className="empty-state">
          <p>Belum ada produk. <Link to="/products/create">Tambah sekarang</Link></p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Gambar</th>
                <th>Nama</th>
                <th>Deskripsi</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Pemilik</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>

                  {/* Thumbnail gambar produk */}
                  <td>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-thumbnail"
                        loading="lazy"
                      />
                    ) : (
                      <div className="product-thumbnail-placeholder">
                        🖼️
                      </div>
                    )}
                  </td>

                  <td><strong>{product.name}</strong></td>
                  <td className="text-muted">{product.description || '-'}</td>
                  <td>{formatRupiah(product.price)}</td>
                  <td>
                    <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>{product.owner_name || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/products/${product.id}/edit`} className="btn btn-sm btn-warning">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="btn btn-sm btn-danger"
                        disabled={deleting === product.id}
                      >
                        {deleting === product.id ? '...' : 'Hapus'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
