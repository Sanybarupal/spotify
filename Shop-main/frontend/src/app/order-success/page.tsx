'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useStore } from '../../context/StoreContext';
import {
  CheckCircleIcon,
  TruckIcon,
  PackageIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '../../components/Icons';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { orders } = useStore();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, padding: 40, textAlign: 'center' }}>
          <h2>No Order Found</h2>
          <Link href="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>
            Browse Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const steps = [
    { title: 'Order Placed', desc: 'Payment verified & order recorded' },
    { title: 'Processing', desc: 'Item allocated at Hub' },
    { title: 'Packed', desc: 'Sealed in tour packaging' },
    { title: 'Out for Delivery', desc: 'On vehicle with delivery fleet' },
    { title: 'Delivered', desc: 'Handed over with verification' },
  ];

  const getStepStatus = (stepTitle: string) => {
    const statusOrder = ['Order Placed', 'Processing', 'Packed', 'Out for Delivery', 'Delivered'];
    const currentIdx = statusOrder.indexOf(order.orderStatus);
    const stepIdx = statusOrder.indexOf(stepTitle);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f7f6f0' }}>
      <Navbar />

      <main style={{ maxWidth: 1000, margin: '0 auto', width: '100%', padding: '40px 24px', flex: 1 }}>
        {/* Banner */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 8,
            border: '1px solid var(--line)',
            padding: 32,
            textAlign: 'center',
            marginBottom: 32,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircleIcon size={36} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
            CONFIRMATION &amp; TRACKING
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, margin: '8px 0 12px' }}>
            Thank You, {order.customerName}!
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 540, margin: '0 auto 20px' }}>
            Your order <strong>#{order.orderNumber}</strong> has been confirmed. Our own climate-controlled delivery fleet is preparing your equipment.
          </p>
          <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary btn-sm"
            >
              📄 Print Invoice
            </button>
            <Link href={`/track?orderId=${order.orderNumber}`} className="btn btn-outline btn-sm">
              <TruckIcon size={16} />
              <span>Public Tracking Page</span>
            </Link>
            <Link href="/admin/orders" className="btn btn-primary btn-sm">
              View in Admin Panel →
            </Link>
          </div>
        </div>

        {/* Live Order Status Visual Tracker */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 8,
            border: '1px solid var(--line)',
            padding: 32,
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Live Dispatch &amp; Delivery Progress</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Current Stage: <strong>{order.orderStatus}</strong></p>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: 20,
                background: order.orderStatus === 'Delivered' ? '#dcfce7' : '#dbeafe',
                color: order.orderStatus === 'Delivered' ? '#166534' : '#1e40af',
              }}
            >
              {order.orderStatus.toUpperCase()}
            </span>
          </div>

          {/* Stepper bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, position: 'relative' }}>
            {steps.map((st, i) => {
              const state = getStepStatus(st.title);
              const isComp = state === 'completed';
              const isCurr = state === 'current';

              return (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      margin: '0 auto 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 14,
                      background: isComp ? 'var(--green)' : isCurr ? 'var(--accent-gold)' : '#e5e7eb',
                      color: isComp || isCurr ? '#ffffff' : '#9ca3af',
                      boxShadow: isCurr ? '0 0 0 4px rgba(194, 155, 56, 0.2)' : 'none',
                    }}
                  >
                    {isComp ? '✓' : i + 1}
                  </div>
                  <strong style={{ display: 'block', fontSize: 12, color: isCurr ? 'var(--green)' : 'var(--ink)' }}>
                    {st.title}
                  </strong>
                  <span style={{ fontSize: 10, color: 'var(--muted)', display: 'block', marginTop: 2 }}>
                    {st.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Own-Delivery Assignment Box */}
        <div
          style={{
            background: 'var(--green-light)',
            border: '1px solid rgba(26, 77, 54, 0.2)',
            borderRadius: 8,
            padding: 24,
            marginBottom: 32,
            display: 'flex',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--green)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TruckIcon size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--green)', textTransform: 'uppercase' }}>
              DEDICATED OWN-DELIVERY FLEET
            </span>
            <h4 style={{ fontSize: 16, margin: '2px 0 4px' }}>
              {order.deliveryAssignment
                ? `Delivery Executive: ${order.deliveryAssignment.driverName}`
                : 'Fleet Assignment in Progress (Gurugram / Delhi NCR Hub)'}
            </h4>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
              {order.deliveryAssignment
                ? `Vehicle: ${order.deliveryAssignment.vehicleNo} • Contact: ${order.deliveryAssignment.driverPhone} • Slot: ${order.deliveryAssignment.estimatedTime || 'Scheduled'}`
                : 'An internal fleet driver will be designated once item packaging is completed. Hand-inspected handover guaranteed.'}
            </p>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Order Receipt Breakdown</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, paddingBottom: 20, borderBottom: '1px solid var(--line)', marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Delivery Address:
              </span>
              <p style={{ fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
                <strong>{order.customerName}</strong> ({order.customerPhone})<br />
                {order.shippingAddress.addressLine}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
            <div>
              <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Payment Method &amp; Status:
              </span>
              <p style={{ fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
                Method: <strong>{order.paymentMethod}</strong><br />
                Payment Status: <span style={{ color: order.paymentStatus === 'Paid' ? '#2e7d32' : '#d97706', fontWeight: 700 }}>{order.paymentStatus}</span><br />
                Order Date: {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Purchased Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {order.items.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={it.product.image} alt={it.product.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4 }} />
                  <div>
                    <strong>{it.product.name}</strong>
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>
                      Qty: {it.quantity} {it.selectedVariant ? `(${it.selectedVariant.name})` : ''}
                    </span>
                  </div>
                </div>
                <span style={{ fontWeight: 700 }}>
                  ₹{((it.product.price + (it.selectedVariant?.priceModifier || 0)) * it.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2e7d32' }}>
                <span>Coupon Discount</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>White-Glove Fleet Delivery</span>
              <span>{order.shipping === 0 ? <strong style={{ color: 'var(--green)' }}>FREE</strong> : `₹${order.shipping}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>GST (18% inclusive)</span>
              <span>₹{order.gst.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 12, fontSize: 18, fontWeight: 800 }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--green)' }}>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
