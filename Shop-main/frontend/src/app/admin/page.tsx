'use client';

import React from 'react';
import Link from 'next/link';
import { AdminLayout } from '../../components/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { TruckIcon, PackageIcon, ArrowRightIcon } from '../../components/Icons';

export default function AdminDashboardPage() {
  const { orders, products, tickets, deliveryFleet } = useStore();

  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const activeDeliveries = orders.filter((o) => o.orderStatus === 'Out for Delivery');
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Processing');
  const lowStockProducts = products.filter((p) => p.stock <= 15);
  const openTickets = tickets.filter((t) => t.status === 'Open');

  return (
    <AdminLayout title="Operations Overview &amp; Control">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-title">Gross Revenue (INR)</span>
          <span className="kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</span>
          <span className="kpi-footer">✓ From {orders.length} Verified Orders</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">Active Fleet Deliveries</span>
          <span className="kpi-value" style={{ color: 'var(--green)' }}>
            {activeDeliveries.length}
          </span>
          <span className="kpi-footer" style={{ color: 'var(--muted)' }}>
            {deliveryFleet.length} In-House EV Vans on Route
          </span>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">Fulfillment Queue</span>
          <span className="kpi-value" style={{ color: pendingOrders.length > 0 ? '#d97706' : 'var(--ink)' }}>
            {pendingOrders.length}
          </span>
          <span className="kpi-footer" style={{ color: '#d97706' }}>
            Awaiting packing &amp; fleet dispatch
          </span>
        </div>

        <div className="kpi-card">
          <span className="kpi-title">Catalog Inventory</span>
          <span className="kpi-value">{products.length}</span>
          <span className="kpi-footer">
            {lowStockProducts.length > 0 ? `${lowStockProducts.length} items low stock` : 'All items well stocked'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28 }}>
        {/* Recent Orders Table */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Recent Customer Orders</h3>
            <Link href="/admin/orders" className="btn btn-secondary btn-sm">
              View All Orders →
            </Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <strong>#{ord.orderNumber}</strong>
                      <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <strong>{ord.customerName}</strong>
                      <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>
                        {ord.shippingAddress.city}
                      </span>
                    </td>
                    <td>
                      {ord.items.length} items
                    </td>
                    <td>
                      <strong>₹{ord.total.toLocaleString('en-IN')}</strong>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          ord.orderStatus === 'Delivered'
                            ? 'status-delivered'
                            : ord.orderStatus === 'Out for Delivery'
                            ? 'status-out-for-delivery'
                            : ord.orderStatus === 'Packed'
                            ? 'status-packed'
                            : 'status-placed'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/orders?orderId=${ord.id}`} className="btn btn-outline btn-sm">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fleet & Low Stock Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Active Fleet Drivers */}
          <div className="admin-card" style={{ marginBottom: 0 }}>
            <div className="admin-card-header">
              <h3 className="admin-card-title">Own-Delivery Fleet</h3>
              <Link href="/admin/delivery" style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                Fleet Desk →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {deliveryFleet.map((drv) => (
                <div key={drv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8faf9', borderRadius: 6, fontSize: 13 }}>
                  <div>
                    <strong>{drv.name}</strong>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                      {drv.vehicle} • {drv.zone}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: '#2e7d32', fontWeight: 700 }}>
                    {drv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Open Tickets Alert */}
          <div className="admin-card" style={{ marginBottom: 0 }}>
            <div className="admin-card-header">
              <h3 className="admin-card-title">Support Queries ({openTickets.length})</h3>
              <Link href="/admin/support" style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                Support Desk →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {openTickets.slice(0, 3).map((t) => (
                <div key={t.id} style={{ padding: 10, background: '#fffbeb', borderRadius: 6, border: '1px solid #fde68a', fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <strong>{t.customerName}</strong>
                    <span style={{ fontSize: 11, color: '#92400e', fontWeight: 600 }}>{t.category}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: '#78350f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.subject}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
