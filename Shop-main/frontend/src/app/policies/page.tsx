'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function PoliciesPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f7f6f0' }}>
      <Navbar />

      <div style={{ background: '#0e1c14', color: '#ffffff', padding: '50px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--accent-gold)' }}>
          TRANSPARENT COMMERCE
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, marginTop: 8, marginBottom: 10 }}>
          Operating Policies &amp; Guarantees
        </h1>
        <p style={{ color: '#a7c2b3', fontSize: 15, maxWidth: 540, margin: '0 auto' }}>
          Details regarding our single-vendor delivery model, warranty verification, and hassle-free return guidelines.
        </p>
      </div>

      <main style={{ maxWidth: 900, margin: '0 auto', width: '100%', padding: '50px 24px', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Section 1 */}
          <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, marginBottom: 12, color: 'var(--green)' }}>
              1. White-Glove Own-Delivery Fleet Terms
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)' }}>
              Par &amp; Fairway operates its own internal delivery personnel and specialized climate-managed electric fleet vehicles.
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--muted)' }}>
              <li><strong>Delhi NCR Service Radius:</strong> Includes Gurugram, DLF Phases 1-5, Chanakyapuri, Vasant Vihar, Greater Kailash, Noida Sectors 1-62, and Faridabad golf estates. Orders confirmed before 1:00 PM are dispatched same-day.</li>
              <li><strong>Bengaluru Service Radius:</strong> Includes Domlur, Indiranagar, Sadashivanagar, Embassy GolfLinks, and Whitefield. Next-morning delivery schedule.</li>
              <li><strong>Club Drops:</strong> If designated in delivery instructions, our staff can hand over your shipment directly to the Caddy Master or Pro Shop concierge at recognized golf courses.</li>
              <li><strong>Charges:</strong> Deliveries on all orders with cart value of ₹4,999 or higher are 100% complimentary. Orders below ₹4,999 carry a flat fleet charge of ₹250.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, marginBottom: 12, color: 'var(--green)' }}>
              2. Returns, Refunds &amp; On-Spot Fit Exchanges
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)' }}>
              We understand that fit and confidence in your equipment are paramount.
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--muted)' }}>
              <li><strong>7-Day Return Window:</strong> Golf clubs, balls, bags, and rangefinders can be returned within 7 calendar days of delivery, provided clubs remain unhit with original factory shrink wrap intact.</li>
              <li><strong>On-Spot Footwear &amp; Apparel Fitting:</strong> For Delhi NCR and Bengaluru deliveries, our uniformed driver will wait up to 10 minutes while you try on your FootJoy shoes or apparel. If the size is incorrect, an exchange request is logged immediately.</li>
              <li><strong>Refund Processing:</strong> Refunds are credited back to the original payment source (UPI / Card / NetBanking) within 48 hours of warehouse inspection. For COD orders, a direct NEFT/IMPS transfer is executed to your verified bank account.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, marginBottom: 12, color: 'var(--green)' }}>
              3. 100% Authenticity &amp; Manufacturer Warranty
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)' }}>
              Every product carries official manufacturer warranty recognized across India and globally:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--muted)' }}>
              <li><strong>Bushnell Laser Rangefinders:</strong> 2-Year official domestic replacement warranty against sensor and optics defects.</li>
              <li><strong>FootJoy &amp; Ecco Footwear:</strong> 1 to 2-Year 100% waterproof manufacturer guarantee.</li>
              <li><strong>Titleist, TaylorMade &amp; Callaway Gear:</strong> Full serialized registration cards provided with every purchase.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
