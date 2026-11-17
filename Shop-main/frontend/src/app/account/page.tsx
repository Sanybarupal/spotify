'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useStore } from '../../context/StoreContext';
import {
  UserIcon,
  PackageIcon,
  HeartIcon,
  TruckIcon,
  TrashIcon,
  BagIcon,
} from '../../components/Icons';

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>(
    initialTab as any
  );

  const { orders, wishlist, toggleWishlist, addToCart, currentUser, loginUser, logoutUser, updateUserProfile } = useStore();

  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editAddress, setEditAddress] = useState(currentUser.addressLine || '');
  const [editCity, setEditCity] = useState(currentUser.city || '');
  const [editState, setEditState] = useState(currentUser.state || '');
  const [editPincode, setEditPincode] = useState(currentUser.pincode || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      email: editEmail,
      phone: editPhone,
      addressLine: editAddress,
      city: editCity,
      state: editState,
      pincode: editPincode,
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f7f6f0' }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 24px', flex: 1 }}>
        {/* User Hero Banner */}
        <div
          style={{
            background: 'var(--green)',
            color: '#ffffff',
            borderRadius: 8,
            padding: 32,
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
              }}
            >
              🏌️
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                {currentUser.isLoggedIn ? 'REGISTERED CUSTOMER' : 'GUEST SHOPPER'}
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, margin: '2px 0 4px' }}>
                {currentUser.isLoggedIn ? currentUser.name : 'Welcome to Par & Fairway'}
              </h2>
              <span style={{ fontSize: 13, color: '#c4d8ce' }}>
                {currentUser.isLoggedIn
                  ? `${currentUser.email || 'Verified Account'} • Role: ${currentUser.role}`
                  : 'Sign in to access your saved orders, delivery addresses, and wishlist'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {currentUser.isLoggedIn ? (
              <button
                onClick={() => logoutUser()}
                className="btn btn-outline btn-sm"
                style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => loginUser({ name: 'Balram Nokhwal', email: 'buyer@golfcommerce.in', phone: '9876543210' })}
                className="btn btn-gold btn-sm"
              >
                Quick Sign In
              </button>
            )}
            <Link href="/shop" className="btn btn-gold btn-sm">
              Explore Store
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', gap: 32, marginBottom: 32, overflowX: 'auto' }}>
          {[
            { id: 'orders', label: `My Orders (${orders.length})`, icon: <PackageIcon size={16} /> },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})`, icon: <HeartIcon size={16} /> },
            { id: 'addresses', label: 'Delivery Destinations', icon: <TruckIcon size={16} /> },
            { id: 'profile', label: 'Account Settings', icon: <UserIcon size={16} /> },
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
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {orders.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)' }}>
                <p style={{ color: 'var(--muted)', marginBottom: 16 }}>No previous orders found.</p>
                <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid var(--line)', paddingBottom: 16, marginBottom: 16 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>ORDER REF</span>
                      <strong style={{ fontSize: 16, display: 'block' }}>#{ord.orderNumber}</strong>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                        Placed on {new Date(ord.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                      <Link href={`/track?orderId=${ord.orderNumber}`} className="btn btn-outline btn-sm">
                        <TruckIcon size={14} />
                        <span>Live Track</span>
                      </Link>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                    {ord.items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <img src={it.product.image} alt={it.product.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4 }} />
                          <div>
                            <strong>{it.product.name}</strong>
                            <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>
                              Quantity: {it.quantity} {it.selectedVariant ? `• ${it.selectedVariant.name}` : ''}
                            </span>
                          </div>
                        </div>
                        <span style={{ fontWeight: 700 }}>
                          ₹{((it.product.price + (it.selectedVariant?.priceModifier || 0)) * it.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer details */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f1eb', paddingTop: 14, fontSize: 13 }}>
                    <div>
                      {ord.deliveryAssignment && (
                        <span style={{ color: 'var(--green)', fontWeight: 600 }}>
                          🚚 Driver: {ord.deliveryAssignment.driverName} ({ord.deliveryAssignment.vehicleNo})
                        </span>
                      )}
                    </div>
                    <div>
                      <span style={{ color: 'var(--muted)' }}>Total Amount: </span>
                      <strong style={{ fontSize: 16, color: 'var(--ink)' }}>₹{ord.total.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)' }}>
                <HeartIcon size={44} style={{ color: 'var(--muted)', margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>Your wishlist is empty</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
                  Save golf gear to track stock and delivery slots.
                </p>
                <Link href="/shop" className="btn btn-primary">Explore Products</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                {wishlist.map((prod) => (
                  <div key={prod.id} style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 16 }}>
                    <img src={prod.image} alt={prod.name} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 4, marginBottom: 12 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>{prod.brand}</span>
                    <h4 style={{ fontSize: 15, margin: '4px 0 8px' }}>
                      <Link href={`/product/${prod.id}`}>{prod.name}</Link>
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ fontSize: 18, fontWeight: 700 }}>₹{prod.price.toLocaleString('en-IN')}</span>
                      <button onClick={() => toggleWishlist(prod)} style={{ color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <TrashIcon size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => addToCart(prod, 1, prod.variants?.[0])}
                      className="btn btn-outline btn-block btn-sm"
                    >
                      <BagIcon size={14} />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: '#ffffff', borderRadius: 8, border: '2px solid var(--green)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--green-light)', color: 'var(--green)', padding: '2px 8px', borderRadius: 4 }}>
                  SAVED DESTINATION
                </span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Fulfillment Zone</span>
              </div>
              <h4 style={{ fontSize: 16, margin: '0 0 6px' }}>{currentUser.addressLine || 'Address on File'}</h4>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                {currentUser.city ? `${currentUser.city}, ${currentUser.state || ''} - ${currentUser.pincode || ''}` : 'No saved city/pincode yet'}<br />
                Phone: {currentUser.phone || 'Not provided'}
              </p>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 32, maxWidth: 640 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Customer Profile &amp; Preferences</h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter full name"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Enter email address"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>Mobile Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="10-digit phone number"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>Delivery Address</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="House / Flat / Street / Club"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder="City"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>State</label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    placeholder="State"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>Pincode</label>
                  <input
                    type="text"
                    value={editPincode}
                    onChange={(e) => setEditPincode(e.target.value)}
                    placeholder="Pincode"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
                Save Profile
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading account details...</div>}>
      <AccountContent />
    </Suspense>
  );
}
