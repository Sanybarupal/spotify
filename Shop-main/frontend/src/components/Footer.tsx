'use client';

import React from 'react';
import Link from 'next/link';
import { TruckIcon, ShieldCheckIcon, PackageIcon } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      {/* Value Proposition Highlights */}
      <div className="footer-usp-bar">
        <div className="footer-container usp-grid">
          <div className="usp-item">
            <TruckIcon size={24} className="usp-icon" />
            <div>
              <h4>White-Glove Own-Delivery</h4>
              <p>Hand-delivered by our uniformed fleet in Gurugram, Delhi &amp; Bengaluru.</p>
            </div>
          </div>
          <div className="usp-item">
            <ShieldCheckIcon size={24} className="usp-icon" />
            <div>
              <h4>100% Authentic Guarantee</h4>
              <p>Direct authorized distributor inventory with factory serial verification.</p>
            </div>
          </div>
          <div className="usp-item">
            <PackageIcon size={24} className="usp-icon" />
            <div>
              <h4>Hassle-Free Returns</h4>
              <p>7-day return window on unhit equipment &amp; unworn apparel.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main">
        <div className="footer-container footer-links-grid">
          {/* Brand Col */}
          <div className="footer-col brand-col">
            <h3 className="footer-brand-title">PAR &amp; FAIRWAY</h3>
            <p className="footer-desc">
              India&apos;s premier destination for championship-tier golf equipment, apparel, footwear, and tour accessories.
            </p>
            <div className="hub-locations">
              <span className="hub-tag">📍 Gurugram Fulfillment Hub</span>
              <span className="hub-tag">📍 Bengaluru Links Depot</span>
            </div>
          </div>

          {/* Catalog Col */}
          <div className="footer-col">
            <h4>Equipment &amp; Gear</h4>
            <ul>
              <li><Link href="/shop?cat=balls">Tour Golf Balls</Link></li>
              <li><Link href="/shop?cat=apparel">Performance Apparel</Link></li>
              <li><Link href="/shop?cat=footwear">Waterproof Footwear</Link></li>
              <li><Link href="/shop?cat=bags">Luxury Stand &amp; Cart Bags</Link></li>
              <li><Link href="/shop?cat=accessories">Rangefinders &amp; Accessories</Link></li>
              <li><Link href="/shop">View Full Catalog</Link></li>
            </ul>
          </div>

          {/* Customer Care Col */}
          <div className="footer-col">
            <h4>Customer Concierge</h4>
            <ul>
              <li><Link href="/track">Track Your Live Order</Link></li>
              <li><Link href="/account">My Account &amp; Orders</Link></li>
              <li><Link href="/contact">Support &amp; Club Fitting</Link></li>
              <li><Link href="/policies">White-Glove Delivery Policy</Link></li>
              <li><Link href="/policies">Returns &amp; Refund Policy</Link></li>
              <li><Link href="/seller" style={{ color: '#d4af37', fontWeight: 600 }}>⛳ Become a Seller</Link></li>
            </ul>
          </div>

          {/* Staff & Operations */}
          <div className="footer-col">
            <h4>Partner &amp; Operations</h4>
            <ul>
              <li><Link href="/seller">Seller Central Portal</Link></li>
              <li><Link href="/admin">Admin Dashboard</Link></li>
              <li><Link href="/admin/orders">Order Fulfillment</Link></li>
              <li><Link href="/admin/products">Catalog &amp; Stock</Link></li>
              <li><Link href="/admin/delivery">Own-Delivery Fleet</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Indian Payment Gateways */}
      <div className="footer-bottom">
        <div className="footer-container footer-bottom-inner">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Par &amp; Fairway Golf Commerce India Private Limited. All rights reserved. GST Registered.
          </p>
          <div className="payment-badges">
            <span className="pay-chip">UPI (GPay, PhonePe, Paytm)</span>
            <span className="pay-chip">Visa &amp; MasterCard</span>
            <span className="pay-chip">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
