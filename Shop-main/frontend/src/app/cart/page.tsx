'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useStore } from '../../context/StoreContext';
import {
  BagIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ArrowRightIcon,
  TruckIcon,
  ShieldCheckIcon,
} from '../../components/Icons';

export default function CartPage() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponCode('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '40px 24px', flex: 1 }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 400, marginBottom: 8 }}>
          Shopping Cart
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>
          Championship gear inspected and packed for White-Glove delivery.
        </p>

        {cart.length === 0 ? (
          <div
            style={{
              padding: '80px 24px',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: 8,
              border: '1px solid var(--line)',
            }}
          >
            <BagIcon size={56} style={{ color: 'var(--muted)', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: 22, marginBottom: 8 }}>Your bag is currently empty</h2>
            <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
              Explore our tour-proven golf balls, apparel, footwear, and bespoke bags.
            </p>
            <Link href="/shop" className="btn btn-primary btn-lg">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
            {/* Items Column */}
            <div>
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '3fr 1fr 1fr 1fr',
                    padding: '16px 24px',
                    background: '#f8f9f8',
                    borderBottom: '1px solid var(--line)',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                  }}
                >
                  <span>Product</span>
                  <span style={{ textAlign: 'center' }}>Price</span>
                  <span style={{ textAlign: 'center' }}>Quantity</span>
                  <span style={{ textAlign: 'right' }}>Total</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {cart.map((item, idx) => {
                    const itemPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
                    return (
                      <div
                        key={`${item.product.id}-${item.selectedVariant?.id || idx}`}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '3fr 1fr 1fr 1fr',
                          alignItems: 'center',
                          padding: '24px',
                          borderBottom: '1px solid var(--line)',
                        }}
                      >
                        {/* Product info */}
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                          />
                          <div>
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>
                              {item.product.brand}
                            </span>
                            <h4 style={{ fontSize: 15, margin: '2px 0 4px', fontWeight: 600 }}>
                              <Link href={`/product/${item.product.id}`}>{item.product.name}</Link>
                            </h4>
                            {item.selectedVariant && (
                              <span style={{ fontSize: 12, color: 'var(--muted)', display: 'block' }}>
                                Option: {item.selectedVariant.name}
                              </span>
                            )}
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                              style={{
                                color: '#d32f2f',
                                fontSize: 12,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                marginTop: 6,
                              }}
                            >
                              <TrashIcon size={12} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 600 }}>
                          ₹{itemPrice.toLocaleString('en-IN')}
                        </div>

                        {/* Quantity */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 4 }}>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedVariant?.id, -1)}
                              style={{ padding: '6px 10px', fontSize: 14 }}
                            >
                              <MinusIcon size={12} />
                            </button>
                            <span style={{ minWidth: 26, textAlign: 'center', fontSize: 13, fontWeight: 700 }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedVariant?.id, 1)}
                              style={{ padding: '6px 10px', fontSize: 14 }}
                            >
                              <PlusIcon size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div style={{ textAlign: 'right', fontSize: 16, fontWeight: 700 }}>
                          ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link href="/shop" style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
                    ← Continue Shopping
                  </Link>
                  <button onClick={clearCart} style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'underline' }}>
                    Clear Entire Bag
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div>
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  padding: 24,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyCoupon} style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                    Promo / Club Voucher:
                  </label>
                  {appliedCoupon ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: '#e8f5e9', borderRadius: 4, fontSize: 13 }}>
                      <span>Applied: <strong>{appliedCoupon.code}</strong></span>
                      <button type="button" onClick={removeCoupon} style={{ color: '#d32f2f', fontWeight: 700 }}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="e.g. GOLF10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid var(--line)',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                        }}
                      />
                      <button type="submit" className="btn btn-primary btn-sm">
                        Apply
                      </button>
                    </div>
                  )}
                  {couponMsg && (
                    <p style={{ fontSize: 12, marginTop: 6, color: couponMsg.isError ? '#d32f2f' : '#2e7d32' }}>
                      {couponMsg.text}
                    </p>
                  )}
                </form>

                {/* Cost lines */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Subtotal</span>
                    <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2e7d32', fontWeight: 600 }}>
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>White-Glove Own-Delivery</span>
                    <span>{cartShipping === 0 ? <strong style={{ color: 'var(--green)' }}>FREE</strong> : `₹${cartShipping}`}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>GST (18% inclusive)</span>
                    <span>₹{Math.round((cartTotal * 0.18) / 1.18).toLocaleString('en-IN')}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--line)',
                      paddingTop: 14,
                      marginTop: 4,
                      fontSize: 20,
                      fontWeight: 800,
                    }}
                  >
                    <span>Total Amount</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn btn-primary btn-block btn-lg"
                  style={{ marginTop: 24 }}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRightIcon size={18} />
                </Link>

                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TruckIcon size={14} />
                    <span>In-House Fleet Delivery across Delhi NCR &amp; Bengaluru</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheckIcon size={14} />
                    <span>Secure UPI, Card, NetBanking &amp; COD accepted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
