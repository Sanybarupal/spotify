'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';
import { CloseIcon, PlusIcon, MinusIcon, TrashIcon, BagIcon, ArrowRightIcon } from './Icons';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 4999;
  const eligibleAmount = Math.max(0, cartSubtotal - cartDiscount);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - eligibleAmount);
  const progressPercent = Math.min(100, Math.round((eligibleAmount / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponCode('');
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <BagIcon size={20} />
            <span>Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="cart-close-btn"
            aria-label="Close cart drawer"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="free-shipping-bar">
          <div className="shipping-text">
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <strong>₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong>Free White-Glove Own-Delivery</strong>
              </span>
            ) : (
              <span className="free-shipping-unlocked">
                ✓ Unlocked: Free White-Glove Own-Delivery in India
              </span>
            )}
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <BagIcon size={48} className="empty-cart-icon" />
              <h3>Your cart is empty</h3>
              <p>Explore our tour-caliber equipment and apparel to begin your round.</p>
              <Link
                href="/shop"
                onClick={() => setIsCartOpen(false)}
                className="btn btn-primary"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item, idx) => {
                const itemPrice = item.product.price + (item.selectedVariant?.priceModifier || 0);
                return (
                  <div key={`${item.product.id}-${item.selectedVariant?.id || idx}`} className="cart-item">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="cart-item-img"
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-header">
                        <span className="cart-item-brand">{item.product.brand}</span>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                          className="cart-item-remove"
                          title="Remove item"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                      <Link
                        href={`/product/${item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="cart-item-name"
                      >
                        {item.product.name}
                      </Link>
                      {item.selectedVariant && (
                        <div className="cart-item-variant">
                          Variant: <span>{item.selectedVariant.name}</span>
                        </div>
                      )}
                      <div className="cart-item-bottom">
                        <div className="qty-picker">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.selectedVariant?.id, -1)}
                            className="qty-btn"
                          >
                            <MinusIcon size={12} />
                          </button>
                          <span className="qty-number">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.selectedVariant?.id, 1)}
                            className="qty-btn"
                          >
                            <PlusIcon size={12} />
                          </button>
                        </div>
                        <div className="cart-item-price">
                          ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Calculations and Checkout */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo code */}
            <form onSubmit={handleApplyCoupon} className="coupon-form">
              {appliedCoupon ? (
                <div className="applied-coupon-pill">
                  <span>Applied: <strong>{appliedCoupon.code}</strong></span>
                  <button type="button" onClick={removeCoupon} className="remove-coupon-btn">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="coupon-input-group">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError('');
                    }}
                    placeholder="Coupon code (e.g. GOLF10)"
                    className="coupon-input"
                  />
                  <button type="submit" className="coupon-apply-btn">
                    Apply
                  </button>
                </div>
              )}
            </form>
            {couponError && <p className="coupon-error">{couponError}</p>}

            {/* Price breakdown */}
            <div className="cart-summary-breakdown">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="summary-line discount-line">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="summary-line">
                <span>GST (18% included)</span>
                <span>₹{Math.round((cartTotal * 0.18) / 1.18).toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-line">
                <span>White-Glove Own-Delivery</span>
                <span>{cartShipping === 0 ? <strong className="free-badge">FREE</strong> : `₹${cartShipping}`}</span>
              </div>
              <div className="summary-line total-line">
                <span>Total Amount</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="cart-action-buttons">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="btn btn-primary btn-block"
              >
                <span>Proceed to Checkout</span>
                <ArrowRightIcon size={16} />
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="btn btn-secondary btn-block"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
