'use client';

import React, { useState } from 'react';
import { AdminLayout } from '../../../components/AdminLayout';
import { useStore } from '../../../context/StoreContext';
import { TruckIcon, CheckCircleIcon } from '../../../components/Icons';

export default function AdminDeliveryFleetPage() {
  const { orders, deliveryFleet, updateOrderStatus, showToast } = useStore();

  const [selectedDriverId, setSelectedDriverId] = useState(deliveryFleet[0].id);
  const currentDriver = deliveryFleet.find((d) => d.id === selectedDriverId) || deliveryFleet[0];

  // Find orders assigned to this driver or active in their zone
  const assignedOrders = orders.filter((o) => {
    if (o.deliveryAssignment?.driverName === currentDriver.name) return true;
    // Or if in out for delivery and matching zone
    return o.orderStatus === 'Out for Delivery';
  });

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, 'Delivered', `Handed over by ${currentDriver.name}. Customer signature verified.`);
    showToast(`Order marked as Delivered by ${currentDriver.name}!`);
  };

  const handleDispatch = (orderId: string) => {
    updateOrderStatus(orderId, 'Out for Delivery', `Loaded on ${currentDriver.vehicle}.`);
  };

  return (
    <AdminLayout title="Own-Delivery Fleet Executive Portal">
      {/* Fleet Executive Switcher */}
      <div style={{ background: '#ffffff', padding: 24, borderRadius: 8, border: '1px solid var(--line)', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
            OPERATING EXECUTIVE
          </span>
          <h3 style={{ fontSize: 20, margin: '2px 0 0' }}>{currentDriver.name}</h3>
          <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
            {currentDriver.vehicle} • {currentDriver.zone}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>Switch Active Driver:</label>
          <select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid var(--line)', background: '#ffffff', fontWeight: 600 }}
          >
            {deliveryFleet.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.zone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Driver's Assigned Route for Today */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>
          Assigned Deliveries for Today ({assignedOrders.length})
        </h3>

        {assignedOrders.length === 0 ? (
          <div style={{ background: '#ffffff', padding: 48, textAlign: 'center', borderRadius: 8, border: '1px solid var(--line)' }}>
            <TruckIcon size={44} style={{ color: 'var(--muted)', margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: 16, marginBottom: 6 }}>All Deliveries Completed</h4>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>
              No pending deliveries currently assigned to {currentDriver.name}.
            </p>
          </div>
        ) : (
          assignedOrders.map((ord) => (
            <div
              key={ord.id}
              style={{
                background: '#ffffff',
                borderRadius: 8,
                border: ord.orderStatus === 'Delivered' ? '1px solid #86efac' : '2px solid var(--green)',
                padding: 24,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid var(--line)', paddingBottom: 16, marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    ORDER REF
                  </span>
                  <h4 style={{ fontSize: 18, margin: '2px 0' }}>#{ord.orderNumber}</h4>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                    Payment: <strong>{ord.paymentMethod} ({ord.paymentStatus})</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: 20,
                      background: ord.orderStatus === 'Delivered' ? '#dcfce7' : '#dbeafe',
                      color: ord.orderStatus === 'Delivered' ? '#166534' : '#1e40af',
                    }}
                  >
                    {ord.orderStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Destination & Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20, fontSize: 14 }}>
                <div>
                  <strong style={{ display: 'block', color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase' }}>
                    Customer &amp; Drop Location:
                  </strong>
                  <p style={{ margin: '4px 0 0', lineHeight: 1.5 }}>
                    <strong>{ord.customerName}</strong><br />
                    {ord.shippingAddress.addressLine}<br />
                    {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pincode}
                  </p>
                </div>

                <div>
                  <strong style={{ display: 'block', color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase' }}>
                    Direct Driver Call Shortcut:
                  </strong>
                  <div style={{ marginTop: 6 }}>
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--green)', borderColor: 'var(--green)' }}
                    >
                      📞 Call {ord.customerPhone}
                    </a>
                  </div>
                  <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                    Slot: {ord.deliveryAssignment?.estimatedTime || 'Standard Morning'}
                  </span>
                </div>
              </div>

              {/* Items checklist */}
              <div style={{ background: '#f8faf9', padding: 14, borderRadius: 6, marginBottom: 20, fontSize: 13 }}>
                <strong style={{ display: 'block', marginBottom: 6, color: 'var(--ink)' }}>
                  Equipment to Hand Over:
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {ord.items.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>✓ {it.quantity} × {it.product.name} {it.selectedVariant ? `(${it.selectedVariant.name})` : ''}</span>
                      <strong style={{ color: 'var(--muted)' }}>SKU: {it.product.sku}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver Actions */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                {ord.orderStatus !== 'Out for Delivery' && ord.orderStatus !== 'Delivered' && (
                  <button
                    onClick={() => handleDispatch(ord.id)}
                    className="btn btn-secondary btn-sm"
                  >
                    Start Route / Out for Delivery
                  </button>
                )}

                {ord.orderStatus !== 'Delivered' && (
                  <button
                    onClick={() => handleMarkDelivered(ord.id)}
                    className="btn btn-primary"
                  >
                    <CheckCircleIcon size={16} />
                    <span>Confirm Handover &amp; Mark Delivered</span>
                  </button>
                )}

                {ord.orderStatus === 'Delivered' && (
                  <span style={{ fontSize: 13, color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircleIcon size={16} />
                    <span>Completed &amp; Signed Off</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
