// ============================================================
// File: client/src/pages/products/ProductCreate.jsx
// ============================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/api';
import Layout from '../../components/Layout';

export default function ProductCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: ''
  });
  const [imageFile,    setImageFile]    = useState(null);   // File object
  const [imagePreview, setImagePreview] = useState(null);   // URL preview lokal
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe & ukuran di sisi client
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format gambar tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.');
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 2MB.');
      e.target.value = '';
      return;
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.price) {
      setError('Nama dan harga wajib diisi');
      return;
    }

    setLoading(true);
    try {
      // Kirim sebagai FormData agar bisa membawa file
      const formData = new FormData();
      formData.append('name',        form.name);
      formData.append('description', form.description);
      formData.append('price',       parseFloat(form.price));
      formData.append('stock',       parseInt(form.stock, 10) || 0);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await productService.create(formData);
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Tambah Produk</h1>
        <Link to="/products" className="btn btn-outline">← Kembali</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Nama Produk <span className="required">*</span></label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama produk"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Deskripsi</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Deskripsi produk (opsional)"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Harga (Rp) <span className="required">*</span></label>
              <input
                id="price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="any"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stok</label>
              <input
                id="stock"
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* ── Field Upload Gambar ── */}
          <div className="form-group">
            <label htmlFor="image">Gambar Produk</label>

            {imagePreview ? (
              <div className="image-preview-wrapper">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button type="button" className="btn btn-sm btn-danger" onClick={removeImage}>
                  Hapus Gambar
                </button>
              </div>
            ) : (
              <div className="upload-area">
                <input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="upload-input"
                />
                <label htmlFor="image" className="upload-label">
                  <span className="upload-icon">📷</span>
                  <span>Klik untuk pilih gambar</span>
                  <small>JPG, PNG, WEBP, GIF • Maks. 2MB</small>
                </label>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
            <Link to="/products" className="btn btn-outline">Batal</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
