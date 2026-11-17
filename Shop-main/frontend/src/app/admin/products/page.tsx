'use client';

import React, { useState } from 'react';
import { AdminLayout } from '../../../components/AdminLayout';
import { useStore } from '../../../context/StoreContext';
import { Category, Product } from '../../../types';
import { PlusIcon, TrashIcon, EditIcon, PackageIcon } from '../../../components/Icons';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New product form
  const [formData, setFormData] = useState({
    name: '',
    category: 'balls' as Category,
    brand: '',
    price: 4999,
    mrp: 5999,
    sku: '',
    stock: 25,
    description: '',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80',
    featured: false,
    bestseller: false,
  });

  const filteredProducts = products.filter((p) => {
    if (selectedCat !== 'all' && p.category !== selectedCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleStockAdjust = (id: string, delta: number) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const nextStock = Math.max(0, prod.stock + delta);
    updateProduct(id, { stock: nextStock });
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.sku) return;

    addProduct({
      name: formData.name,
      category: formData.category,
      brand: formData.brand,
      price: Number(formData.price),
      mrp: Number(formData.mrp),
      sku: formData.sku.toUpperCase(),
      stock: Number(formData.stock),
      rating: 4.8,
      reviewCount: 1,
      featured: formData.featured,
      bestseller: formData.bestseller,
      image: formData.image,
      gallery: [formData.image],
      description: formData.description || 'Championship tour-grade equipment.',
      specs: {
        'Category': formData.category.toUpperCase(),
        'Inspection': '100% Genuine Tour Spec',
      },
      variants: [
        { id: 'v-def-' + Date.now(), name: 'Standard Edition', sku: formData.sku, stock: Number(formData.stock) },
      ],
    });

    setIsModalOpen(false);
    setFormData({
      name: '',
      category: 'balls',
      brand: '',
      price: 4999,
      mrp: 5999,
      sku: '',
      stock: 25,
      description: '',
      image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80',
      featured: false,
      bestseller: false,
    });
  };

  return (
    <AdminLayout title="Catalog &amp; Inventory Management">
      {/* Top Bar with Search & Add Product */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1, maxWidth: 600 }}>
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4, background: '#ffffff' }}
          />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4, background: '#ffffff', fontWeight: 600 }}
          >
            <option value="all">All Categories</option>
            <option value="balls">Golf Balls</option>
            <option value="apparel">Apparel</option>
            <option value="footwear">Footwear</option>
            <option value="bags">Bags</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <PlusIcon size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Catalog Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Price (INR)</th>
                <th>Stock Units</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4 }} />
                      <div>
                        <strong>{p.name}</strong>
                        <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                          {p.brand} {p.bestseller && '• Best Seller'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>
                      {p.category}
                    </span>
                  </td>
                  <td>
                    <code>{p.sku}</code>
                  </td>
                  <td>
                    <strong>₹{p.price.toLocaleString('en-IN')}</strong>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', textDecoration: 'line-through' }}>
                      ₹{p.mrp.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => handleStockAdjust(p.id, -1)}
                        style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid var(--line)', background: '#ffffff', fontWeight: 700 }}
                      >
                        -
                      </button>
                      <strong style={{ minWidth: 24, textAlign: 'center', color: p.stock <= 5 ? '#dc2626' : 'var(--ink)' }}>
                        {p.stock}
                      </strong>
                      <button
                        onClick={() => handleStockAdjust(p.id, 1)}
                        style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid var(--line)', background: '#ffffff', fontWeight: 700 }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 12,
                        background: p.stock > 0 ? '#dcfce7' : '#fee2e2',
                        color: p.stock > 0 ? '#166534' : '#991b1b',
                      }}
                    >
                      {p.stock > 0 ? 'ACTIVE' : 'OUT OF STOCK'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${p.name}" from catalog?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      style={{ color: '#d32f2f', padding: 6 }}
                      title="Delete Product"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="cart-drawer-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: 8,
              maxWidth: 600,
              width: '100%',
              margin: 'auto',
              padding: 32,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>Add New Equipment to Catalog</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ fontSize: 20 }}>✕</button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Srixon Z-Star Diamond Golf Balls"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Brand *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Srixon / Titleist"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4, background: '#ffffff' }}
                  >
                    <option value="balls">Golf Balls</option>
                    <option value="apparel">Apparel</option>
                    <option value="footwear">Footwear</option>
                    <option value="bags">Bags</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>SKU Code *</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g. SRX-ZSTAR-DMD"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tour specifications and player advantages..."
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Mark as Tour Choice</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save to Inventory
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
