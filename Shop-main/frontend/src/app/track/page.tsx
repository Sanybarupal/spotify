'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useStore } from '../../context/StoreContext';
import {
  TruckIcon,
  SearchIcon,
  CheckCircleIcon,
  PackageIcon,
  ArrowRightIcon,
} from '../../components/Icons';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';
  const { orders } = useStore();

  const [searchVal, setSearchVal] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState(
    orders.find((o) => o.orderNumber.toLowerCase() === initialOrderId.toLowerCase()) || null
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const term = searchVal.trim().toLowerCase();
    if (!term) return;

    const found = orders.find(
      (o) => o.orderNumber.toLowerCase() === term || o.id.toLowerCase() === term || o.customerPhone.includes(term)
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setErrorMsg(`No active delivery found matching "${searchVal}". Please check your order reference number.`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f7f6f0' }}>
      <Navbar />

      <main style={{ maxWidth: 900, margin: '0 auto', width: '100%', padding: '40px 24px', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
            WHITE-GLOVE DISPATCH TRACKER
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, marginTop: 8, marginBottom: 12 }}>
            Track Your Golf Gear Delivery
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 540, margin: '0 auto' }}>
            Enter your order reference code (e.g. <strong>PGF-2026-9812</strong>) to view real-time fleet location and status updates.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleTrack}
          style={{
            display: 'flex',
            gap: 10,
            background: '#ffffff',
            padding: 8,
            borderRadius: 8,
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 36,
          }}
        >
          <input
            type="text"
            required
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Enter Order Number (e.g. PGF-2026-9812)"
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              outline: 'none',
              fontSize: 15,
            }}
          />
          <button type="submit" className="btn btn-primary btn-lg">
            <SearchIcon size={18} />
            <span>Track Order</span>
          </button>
        </form>

        {errorMsg && (
          <div style={{ padding: 16, background: '#fee2e2', color: '#991b1b', borderRadius: 8, marginBottom: 28, fontSize: 14 }}>
            {errorMsg}
          </div>
        )}

        {/* Track Results */}
        {searchedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header info */}
            <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid var(--line)', paddingBottom: 16, marginBottom: 20 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>ORDER REF</span>
                  <h3 style={{ fontSize: 20, margin: '2px 0 0' }}>#{searchedOrder.orderNumber}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontWeight: 700,
                      fontSize: 12,
                      background: searchedOrder.orderStatus === 'Delivered' ? '#dcfce7' : '#dbeafe',
                      color: searchedOrder.orderStatus === 'Delivered' ? '#166534' : '#1e40af',
                    }}
                  >
                    {searchedOrder.orderStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Delivery Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 14 }}>
                <div>
                  <strong style={{ display: 'block', color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase' }}>
                    Recipient &amp; Destination:
                  </strong>
                  <p style={{ marginTop: 4, lineHeight: 1.5 }}>
                    {searchedOrder.customerName} ({searchedOrder.customerPhone})<br />
                    {searchedOrder.shippingAddress.addressLine}<br />
                    {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state} - {searchedOrder.shippingAddress.pincode}
                  </p>
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase' }}>
                    Own-Delivery Fleet Assignment:
                  </strong>
                  <p style={{ marginTop: 4, lineHeight: 1.5 }}>
                    {searchedOrder.deliveryAssignment ? (
                      <>
                        Driver: <strong>{searchedOrder.deliveryAssignment.driverName}</strong><br />
                        Vehicle: {searchedOrder.deliveryAssignment.vehicleNo}<br />
                        Driver Contact: <a href={`tel:${searchedOrder.deliveryAssignment.driverPhone}`} style={{ color: 'var(--green)', fontWeight: 600 }}>{searchedOrder.deliveryAssignment.driverPhone}</a>
                      </>
                    ) : (
                      <span style={{ color: 'var(--muted)' }}>Fleet vehicle allocation in progress at hub</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 28 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Event Milestone History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {searchedOrder.timeline.map((event, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--green)', marginTop: 4, flexShrink: 0 }}></div>
                    <div style={{ flex: 1, borderBottom: '1px solid #f1f1eb', paddingBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: 14 }}>{event.status}</strong>
                        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{event.timestamp}</span>
                      </div>
                      {event.note && (
                        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{event.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Equipment in this Shipment</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {searchedOrder.items.map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span>{it.quantity} × {it.product.name} {it.selectedVariant ? `(${it.selectedVariant.name})` : ''}</span>
                    <strong>₹{((it.product.price + (it.selectedVariant?.priceModifier || 0)) * it.quantity).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
