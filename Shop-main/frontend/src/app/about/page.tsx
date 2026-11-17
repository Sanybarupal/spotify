'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { TruckIcon, ShieldCheckIcon, CheckCircleIcon, ArrowRightIcon } from '../../components/Icons';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Header Banner */}
      <div style={{ background: '#0e1c14', color: '#ffffff', padding: '60px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--accent-gold)' }}>
          THE FAIRWAY STORY
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 44, margin: '12px 0 16px', fontWeight: 400 }}>
          Elevating Golf Commerce Across India
        </h1>
        <p style={{ color: '#a7c2b3', fontSize: 17, maxWidth: 660, margin: '0 auto', lineHeight: 1.6 }}>
          Founded by golfers for golfers. We combined single-vendor authenticity with an internal white-glove delivery fleet to eliminate counterfeit gear and transit damage.
        </p>
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '60px 24px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 80 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--green)', textTransform: 'uppercase' }}>
              SINGLE-VENDOR MODEL
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, margin: '8px 0 20px', lineHeight: 1.2 }}>
              Why We Never Rely On Multi-Seller Marketplaces
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 16 }}>
              In golf equipment, authenticity and condition are non-negotiable. A counterfeit Titleist Pro V1 or a micro-cracked graphite shaft ruins swings and tournaments.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 24 }}>
              By operating as a strict single-vendor platform, 100% of our products are procured directly from authorized tour distributors, stored in our climate-managed Gurugram and Bengaluru hubs, and inspected by PGA-certified associates before packing.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <CheckCircleIcon size={16} style={{ color: 'var(--green)' }} />
                <span>Zero third-party seller listings or refurbished gear</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <CheckCircleIcon size={16} style={{ color: 'var(--green)' }} />
                <span>Serialized factory verification tags on every high-value item</span>
              </div>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800&q=80"
              alt="Golf Course and Bag"
              style={{ width: '100%', borderRadius: 12, boxShadow: 'var(--shadow-lg)' }}
            />
          </div>
        </div>

        {/* Our Own-Delivery Fleet Section */}
        <div style={{ background: 'var(--paper-subtle)', padding: 48, borderRadius: 12, border: '1px solid var(--line)', marginBottom: 80 }}>
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--green)', textTransform: 'uppercase' }}>
              OUR IN-HOUSE FLEET
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 34, margin: '8px 0 16px' }}>
              The White-Glove Own-Delivery Difference
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6 }}>
              We realized that traditional couriers treat luxury golf bags and footwear like standard packages. Our dedicated uniformed fleet ensures custom hand-delivery right up to your doorstep or home club.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            <div style={{ background: '#ffffff', padding: 24, borderRadius: 8, border: '1px solid var(--line)' }}>
              <TruckIcon size={28} style={{ color: 'var(--green)', marginBottom: 12 }} />
              <h4 style={{ fontSize: 17, marginBottom: 8 }}>Climate-Managed EV Vans</h4>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                Protecting club adhesives, urethane covers, and leather goods from extreme Indian summer temperatures.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: 24, borderRadius: 8, border: '1px solid var(--line)' }}>
              <ShieldCheckIcon size={28} style={{ color: 'var(--green)', marginBottom: 12 }} />
              <h4 style={{ fontSize: 17, marginBottom: 8 }}>On-Spot Verification</h4>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                Try your FootJoy shoes or apparel sizing while our executive waits. Instant exchange if size adjustments are needed.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: 24, borderRadius: 8, border: '1px solid var(--line)' }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>⛳</span>
              <h4 style={{ fontSize: 17, marginBottom: 8 }}>Direct Club Drops</h4>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                Drop-offs directly to the Caddy Master or locker room at DLF Golf Club, Delhi Golf Club, Jaypee Greens, or KGA Bengaluru.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginBottom: 16 }}>
            Ready to experience championship golf commerce?
          </h3>
          <Link href="/shop" className="btn btn-primary btn-lg">
            <span>Shop The Collection</span>
            <ArrowRightIcon size={18} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
