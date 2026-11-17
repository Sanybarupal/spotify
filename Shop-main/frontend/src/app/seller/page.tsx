'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useStore } from '../../context/StoreContext';
import {
  PackageIcon,
  TruckIcon,
  SettingsIcon,
  ArrowRightIcon,
  TrashIcon,
} from '../../components/Icons';
import { Category, Product } from '../../types';

export default function SellerPanelPage() {
  const { products, addProduct, updateProduct, deleteProduct, orders, refreshFromDb } = useStore();
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'profile'>('catalog');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(10);

  // New Product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'balls' as Category,
    brand: 'Par & Fairway',
    price: 4999,
    mrp: 5999,
    sku: '',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80',
    description: '',
    variantType: 'pack',
  });

  // Calculate seller metrics
  const totalSellerProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const sellerOrders = orders;
  const grossSales = orders.reduce((acc, o) => acc + (o.paymentStatus === 'Paid' ? o.total : 0), 0);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    await addProduct({
      name: newProduct.name,
      category: newProduct.category,
      brand: newProduct.brand,
      price: Number(newProduct.price),
      mrp: Number(newProduct.mrp),
      sku: newProduct.sku || `PF-PRO-${Date.now().toString().slice(-4)}`,
      stock: Number(newProduct.stock),
      rating: 5.0,
      reviewCount: 1,
      image: newProduct.image,
      gallery: [newProduct.image],
      description: newProduct.description || 'Premium tour-tested golf equipment directly from authorized verified seller.',
      specs: { 'Origin': 'Verified Pro Shop', 'Condition': 'Brand New in Box' },
      variantType: newProduct.variantType as any,
    });

    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      category: 'balls',
      brand: 'Par & Fairway',
      price: 4999,
      mrp: 5999,
      sku: '',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80',
      description: '',
      variantType: 'pack',
    });
  };

  const handleUpdateStock = async (prodId: string) => {
    await updateProduct(prodId, { stock: newStockVal });
    setEditingStockId(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f7f6f0' }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 24px', flex: 1 }}>
        {/* Seller Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1b382b 0%, #0d1e16 100%)',
            color: '#ffffff',
            borderRadius: 8,
            padding: 32,
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
            border: '1px solid rgba(212, 175, 55, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
              }}
            >
              ⛳
            </div>
            <div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: 'var(--accent-gold)',
                  textTransform: 'uppercase',
                }}
              >
                VERIFIED VENDOR &amp; SELLER PORTAL
              </span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, margin: '2px 0 4px' }}>
                Apex Pro Golf India
              </h1>
              <span style={{ fontSize: 13, color: '#c4d8ce' }}>
                Authorized Partner ID: #VEND-2026-DEL • Live MySQL Sync Active • Delhi NCR Hub
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-gold btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>+ List New Product</span>
            </button>
            <button
              onClick={() => refreshFromDb()}
              className="btn btn-secondary btn-sm"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
            >
              🔄 Refresh MySQL Data
            </button>
          </div>
        </div>

        {/* Seller KPI Cards */}
        <div className="kpi-grid" style={{ marginBottom: 32 }}>
          <div className="kpi-card">
            <span className="kpi-title">Gross Sales Revenue</span>
            <span className="kpi-value">₹{grossSales.toLocaleString('en-IN')}</span>
            <span className="kpi-footer">✓ From {orders.length} Store Orders</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Listed Golf Gear</span>
            <span className="kpi-value" style={{ color: 'var(--green)' }}>
              {totalSellerProducts} SKUs
            </span>
            <span className="kpi-footer">Live across all categories</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Total Warehouse Stock</span>
            <span className="kpi-value">{totalStock} units</span>
            <span className="kpi-footer">Across verified fulfillment hubs</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-title">Order Shipments</span>
            <span className="kpi-value" style={{ color: '#d97706' }}>
              {sellerOrders.length}
            </span>
            <span className="kpi-footer">White-Glove Fleet Dispatched</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', gap: 32, marginBottom: 28 }}>
          {[
            { id: 'catalog', label: `My Golf Catalog (${totalSellerProducts})`, icon: <PackageIcon size={16} /> },
            { id: 'orders', label: `Sales & Customer Orders (${sellerOrders.length})`, icon: <TruckIcon size={16} /> },
            { id: 'profile', label: 'Vendor Settings & Payouts', icon: <SettingsIcon size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 0',
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--green)' : 'var(--muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--green)' : '2px solid transparent',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Catalog & Stock Management */}
        {activeTab === 'catalog' && (
          <div className="admin-card">
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="admin-card-title">Live Product Catalog &amp; Real-time Stock</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                  Manage stock levels and add golf balls, apparel, footwear, bags, and accessories to store.
                </p>
              </div>
              <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary btn-sm">
                + Add Golf Gear
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Selling Price</th>
                    <th>MRP</th>
                    <th>Warehouse Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {prod.image && (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--line)' }}
                            />
                          )}
                          <div>
                            <strong>{prod.name}</strong>
                            <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                              SKU: {prod.sku}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ textTransform: 'capitalize', fontSize: 13 }}>{prod.category}</span>
                      </td>
                      <td>
                        <strong>{prod.brand}</strong>
                      </td>
                      <td>
                        <strong>₹{prod.price.toLocaleString('en-IN')}</strong>
                      </td>
                      <td style={{ color: 'var(--muted)', textDecoration: 'line-through', fontSize: 12 }}>
                        ₹{prod.mrp.toLocaleString('en-IN')}
                      </td>
                      <td>
                        {editingStockId === prod.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input
                              type="number"
                              value={newStockVal}
                              onChange={(e) => setNewStockVal(Number(e.target.value))}
                              style={{ width: 70, padding: '4px 8px', fontSize: 13, border: '1px solid var(--green)', borderRadius: 4 }}
                            />
                            <button
                              onClick={() => handleUpdateStock(prod.id)}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '4px 8px', fontSize: 11 }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '4px 8px', fontSize: 11 }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                              style={{
                                fontWeight: 700,
                                color: prod.stock <= 10 ? '#dc2626' : 'var(--green)',
                              }}
                            >
                              {prod.stock} units
                            </span>
                            <button
                              onClick={() => {
                                setEditingStockId(prod.id);
                                setNewStockVal(prod.stock);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--green)',
                                cursor: 'pointer',
                                fontSize: 12,
                                textDecoration: 'underline',
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-success">Active</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link href={`/product/${prod.id}`} className="btn btn-outline btn-sm" style={{ padding: '4px 8px', fontSize: 11 }}>
                            View
                          </Link>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '4px 8px', fontSize: 11 }}
                            title="Delete product"
                          >
                            <TrashIcon size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Sales & Orders */}
        {activeTab === 'orders' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Customer Orders (Dispatched via Fairway EV Fleet)</h3>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Customer Name</th>
                    <th>Destination</th>
                    <th>Items</th>
                    <th>Total Value</th>
                    <th>Payment</th>
                    <th>Delivery Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td>
                        <strong>#{ord.orderNumber}</strong>
                        <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td>
                        <strong>{ord.customerName}</strong>
                      </td>
                      <td>
                        {ord.shippingAddress.city}, {ord.shippingAddress.state}
                      </td>
                      <td>
                        {ord.items.length} items
                      </td>
                      <td>
                        <strong>₹{ord.total.toLocaleString('en-IN')}</strong>
                      </td>
                      <td>
                        <span className={`badge ${ord.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            ord.orderStatus === 'Delivered'
                              ? 'badge-success'
                              : ord.orderStatus === 'Out for Delivery'
                              ? 'badge-warning'
                              : 'badge-neutral'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Vendor Settings */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: 16 }}>Authorized Pro Shop Credentials</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                <div><strong>Business Name:</strong> Apex Pro Golf India Pvt. Ltd.</div>
                <div><strong>GSTIN Registration:</strong> 07AAACA1234F1Z8</div>
                <div><strong>Fulfillment Warehouse:</strong> Sector 32, Gurugram, Haryana</div>
                <div><strong>Delivery Fleet:</strong> Par & Fairway Climate-Controlled EV Vans</div>
                <div><strong>Account Manager:</strong> Vikramaditya Sharma (PGA India Certified)</div>
              </div>
            </div>

            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: 16 }}>Payout &amp; Settlement Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                <div><strong>Settlement Frequency:</strong> T+2 Days Direct Bank Transfer</div>
                <div><strong>Linked Bank:</strong> HDFC Bank - Golf Course Road Branch</div>
                <div><strong>Account:</strong> ************4891</div>
                <div><strong>Commission Rate:</strong> 0% (Direct Vendor Contract)</div>
                <div style={{ marginTop: 8 }}>
                  <span className="badge badge-success">✓ Verified Active Bank Account</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 20,
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: 8,
                maxWidth: 600,
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: 32,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 22 }}>
                  List New Golf Gear
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. TaylorMade Stealth 2 Plus Driver"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                    >
                      <option value="balls">Golf Balls</option>
                      <option value="apparel">Apparel</option>
                      <option value="footwear">Footwear</option>
                      <option value="bags">Bags</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      placeholder="e.g. Titleist, TaylorMade"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      Selling Price (INR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      MRP (INR)
                    </label>
                    <input
                      type="number"
                      value={newProduct.mrp}
                      onChange={(e) => setNewProduct({ ...newProduct, mrp: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      Custom SKU (Optional)
                    </label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      placeholder="e.g. TM-ST2-PLUS"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    Product Image URL
                  </label>
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter technical details and tour features..."
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Publish to MySQL Store
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
