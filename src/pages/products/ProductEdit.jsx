// ============================================================
// File: client/src/pages/products/ProductEdit.jsx
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productService } from '../../services/api';
import Layout from '../../components/Layout';

export default function ProductEdit() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: ''
  });
  const [currentImageUrl, setCurrentImageUrl] = useState(null); // gambar yang sudah tersimpan
  const [imageFile,        setImageFile]        = useState(null); // file baru yang dipilih
  const [imagePreview,     setImagePreview]     = useState(null); // preview file baru
  const [error,            setError]            = useState('');
  const [loading,          setLoading]          = useState(true);
  const [saving,           setSaving]           = useState(false);

  // Ambil data produk saat mount
  useEffect(() => {
    productService.getOne(id)
      .then(data => {
        const p = data.product;
        setForm({
          name:        p.name        || '',
          description: p.description || '',
          price:       p.price       || '',
          stock:       p.stock       ?? ''
        });
        setCurrentImageUrl(p.image_url || null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe & ukuran
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

  const removeNewImage = () => {
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

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name',        form.name);
      formData.append('description', form.description);
      formData.append('price',       parseFloat(form.price));
      formData.append('stock',       parseInt(form.stock, 10) || 0);
      // Hanya kirim file baru jika ada yang dipilih
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await productService.update(id, formData);
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Layout>
      <div className="loading">Memuat data produk...</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="page-header">
        <h1>Edit Produk</h1>
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

            {/* Preview gambar baru yang baru dipilih */}
            {imagePreview && (
              <div className="image-preview-wrapper">
                <p className="image-preview-label">Gambar baru:</p>
                <img src={imagePreview} alt="Preview baru" className="image-preview" />
                <button type="button" className="btn btn-sm btn-danger" onClick={removeNewImage}>
                  Batalkan Perubahan Gambar
                </button>
              </div>
            )}

            {/* Gambar yang sudah tersimpan (tampilkan jika tidak ada preview baru) */}
            {!imagePreview && currentImageUrl && (
              <div className="image-preview-wrapper">
                <p className="image-preview-label">Gambar saat ini:</p>
                <img src={currentImageUrl} alt="Gambar produk saat ini" className="image-preview" />
              </div>
            )}

            {/* Area upload gambar baru */}
            {!imagePreview && (
              <div className="upload-area" style={{ marginTop: currentImageUrl ? '0.75rem' : 0 }}>
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
                  <span>{currentImageUrl ? 'Ganti gambar' : 'Klik untuk pilih gambar'}</span>
                  <small>JPG, PNG, WEBP, GIF • Maks. 2MB</small>
                </label>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Update Produk'}
            </button>
            <Link to="/products" className="btn btn-outline">Batal</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
