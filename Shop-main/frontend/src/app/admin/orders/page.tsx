'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminLayout } from '../../../components/AdminLayout';
import { useStore } from '../../../context/StoreContext';
import { OrderStatus, DeliveryAssignment } from '../../../types';
import { TruckIcon, PackageIcon } from '../../../components/Icons';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const selectedOrderId = searchParams.get('orderId');
  const { orders, updateOrderStatus, deliveryFleet } = useStore();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState(
    orders.find((o) => o.id === selectedOrderId) || orders[0] || null
  );

  const [selectedDriverId, setSelectedDriverId] = useState(deliveryFleet[0].id);
  const [statusNote, setStatusNote] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.orderStatus === filterStatus;
  });

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!activeOrder) return;

    let assignment: DeliveryAssignment | undefined = activeOrder.deliveryAssignment;

    // If dispatching out for delivery and no assignment yet, assign chosen fleet driver
    if (newStatus === 'Out for Delivery' && !assignment) {
      const driver = deliveryFleet.find((d) => d.id === selectedDriverId) || deliveryFleet[0];
      assignment = {
        driverName: driver.name,
        driverPhone: driver.phone,
        vehicleNo: driver.vehicle,
        estimatedTime: 'Today by 6:00 PM',
        deliveryNotes: 'In-house white-glove handover to customer residence.',
      };
    }

    updateOrderStatus(activeOrder.id, newStatus, statusNote || undefined, assignment);
    setStatusNote('');

    // Update active view
    const updated = orders.find((o) => o.id === activeOrder.id);
    if (updated) setActiveOrder({ ...updated, orderStatus: newStatus });
  };

  const handleAssignDriver = () => {
    if (!activeOrder) return;
    const driver = deliveryFleet.find((d) => d.id === selectedDriverId) || deliveryFleet[0];
    const assignment: DeliveryAssignment = {
      driverName: driver.name,
      driverPhone: driver.phone,
      vehicleNo: driver.vehicle,
      estimatedTime: 'Scheduled via Hub Operations',
      deliveryNotes: 'Assigned by Order Operations Manager.',
    };
    updateOrderStatus(activeOrder.id, activeOrder.orderStatus, `Assigned to ${driver.name}`, assignment);
  };

  return (
    <AdminLayout title="Orders &amp; White-Glove Fulfillment Operations">
      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        {[
          { id: 'all', label: `All Orders (${orders.length})` },
          { id: 'Order Placed', label: 'Order Placed' },
          { id: 'Processing', label: 'Processing' },
          { id: 'Packed', label: 'Packed' },
          { id: 'Out for Delivery', label: 'Out for Delivery' },
          { id: 'Delivered', label: 'Delivered' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: filterStatus === tab.id ? 'var(--green)' : '#ffffff',
              color: filterStatus === tab.id ? '#ffffff' : 'var(--ink)',
              border: '1px solid var(--line)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 460px', gap: 28, alignItems: 'start' }}>
        {/* Orders Table */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>
                      No orders found matching status &quot;{filterStatus}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      style={{
                        background: activeOrder?.id === ord.id ? 'var(--green-light)' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => setActiveOrder(ord)}
                    >
                      <td>
                        <strong>#{ord.orderNumber}</strong>
                        <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                          {new Date(ord.date).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <strong>{ord.customerName}</strong>
                        <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                          {ord.customerPhone}
                        </span>
                      </td>
                      <td>{ord.shippingAddress.city}</td>
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveOrder(ord);
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Detailed Drawer */}
        {activeOrder && (
          <div className="admin-card" style={{ border: '2px solid var(--green)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: 16, marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  MANAGING ORDER
                </span>
                <h3 style={{ fontSize: 20, margin: '2px 0 0' }}>#{activeOrder.orderNumber}</h3>
              </div>
              <span
                className={`status-pill ${
                  activeOrder.orderStatus === 'Delivered'
                    ? 'status-delivered'
                    : activeOrder.orderStatus === 'Out for Delivery'
                    ? 'status-out-for-delivery'
                    : 'status-placed'
                }`}
              >
                {activeOrder.orderStatus}
              </span>
            </div>

            {/* Quick Status Workflow Action Buttons */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                Update Order Status:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  onClick={() => handleStatusChange('Processing')}
                  disabled={activeOrder.orderStatus === 'Processing'}
                  className="btn btn-outline btn-sm"
                >
                  Mark Processing
                </button>
                <button
                  onClick={() => handleStatusChange('Packed')}
                  disabled={activeOrder.orderStatus === 'Packed'}
                  className="btn btn-outline btn-sm"
                >
                  Mark Packed
                </button>
                <button
                  onClick={() => handleStatusChange('Out for Delivery')}
                  disabled={activeOrder.orderStatus === 'Out for Delivery'}
                  className="btn btn-outline btn-sm"
                >
                  Dispatch to Fleet
                </button>
                <button
                  onClick={() => handleStatusChange('Delivered')}
                  disabled={activeOrder.orderStatus === 'Delivered'}
                  className="btn btn-primary btn-sm"
                >
                  Mark Delivered
                </button>
              </div>

              <div style={{ marginTop: 10 }}>
                <input
                  type="text"
                  placeholder="Audit note (e.g. Serial tag #TIT-901 checked)"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', fontSize: 12, border: '1px solid var(--line)', borderRadius: 4 }}
                />
              </div>
            </div>

            {/* Own-Delivery Assignment Section */}
            <div style={{ background: 'var(--paper-subtle)', padding: 16, borderRadius: 6, marginBottom: 20 }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 8, color: 'var(--green)' }}>
                <TruckIcon size={16} />
                <span>Assign Internal Delivery Driver:</span>
              </strong>
              {activeOrder.deliveryAssignment ? (
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                  Driver: <strong>{activeOrder.deliveryAssignment.driverName}</strong><br />
                  Vehicle: {activeOrder.deliveryAssignment.vehicleNo}<br />
                  Contact: {activeOrder.deliveryAssignment.driverPhone}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    style={{ flex: 1, padding: 6, fontSize: 12, border: '1px solid var(--line)', borderRadius: 4 }}
                  >
                    {deliveryFleet.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.zone})
                      </option>
                    ))}
                  </select>
                  <button onClick={handleAssignDriver} className="btn btn-primary btn-sm">
                    Assign
                  </button>
                </div>
              )}
            </div>

            {/* Customer & Address Details */}
            <div style={{ fontSize: 13, lineHeight: 1.6, borderBottom: '1px solid var(--line)', paddingBottom: 16, marginBottom: 16 }}>
              <strong style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', color: 'var(--muted)' }}>
                Customer &amp; Address:
              </strong>
              <div>{activeOrder.customerName} • {activeOrder.customerPhone}</div>
              <div>{activeOrder.shippingAddress.addressLine}</div>
              <div>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}</div>
            </div>

            {/* Items */}
            <div>
              <strong style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
                Items Ordered:
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{it.quantity} × {it.product.name} {it.selectedVariant ? `(${it.selectedVariant.name})` : ''}</span>
                    <strong>₹{((it.product.price + (it.selectedVariant?.priceModifier || 0)) * it.quantity).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 8, fontSize: 15, fontWeight: 700 }}>
                  <span>Total Amount</span>
                  <span>₹{activeOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading orders...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
