// ============================================================
// File: client/src/services/api.js
// Wrapper fetch ke Express REST API
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'https://expressreact-3ph8.onrender.com/';

/**
 * Helper fetch dengan default options (credentials: include agar cookie terkirim)
 * Jika body adalah FormData, jangan set Content-Type agar browser atur boundary-nya sendiri
 */
async function apiFetch(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      // Jangan set Content-Type untuk FormData — browser akan set dengan boundary
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    credentials: 'include',   // kirim cookie httpOnly ke server
    ...options
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }

  return data;
}

// ── Auth ─────────────────────────────────────────────────────

export const authService = {
  login:    (body) => apiFetch('/api/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  logout:   ()     => apiFetch('/api/auth/logout',   { method: 'POST' }),
  me:       ()     => apiFetch('/api/auth/me'),
};

// ── Products ──────────────────────────────────────────────────

export const productService = {
  getAll:  ()         => apiFetch('/api/products'),
  getOne:  (id)       => apiFetch(`/api/products/${id}`),

  /**
   * Buat produk baru - menerima FormData (untuk upload image) atau plain object
   */
  create: (body) => {
    const formData = body instanceof FormData ? body : objToFormData(body);
    return apiFetch('/api/products', { method: 'POST', body: formData });
  },

  /**
   * Update produk - menerima FormData (untuk upload image) atau plain object
   */
  update: (id, body) => {
    const formData = body instanceof FormData ? body : objToFormData(body);
    return apiFetch(`/api/products/${id}`, { method: 'PUT', body: formData });
  },

  destroy: (id) => apiFetch(`/api/products/${id}`, { method: 'DELETE' }),
};

/**
 * Konversi plain object ke FormData
 * Nilai null/undefined dilewati
 */
function objToFormData(obj) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      fd.append(key, value);
    }
  }
  return fd;
}
