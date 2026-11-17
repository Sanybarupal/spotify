'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useStore } from '../../context/StoreContext';
import { CheckCircleIcon, ArrowRightIcon } from '../../components/Icons';

export default function ContactPage() {
  const { submitTicket } = useStore();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    subject: '',
    category: 'Product Fitting' as const,
    message: '',
    orderId: '',
  });

  const [submittedTicket, setSubmittedTicket] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email || !formData.message) return;

    const tkt = submitTicket({
      customerName: formData.customerName,
      email: formData.email,
      subject: formData.subject || 'General Inquiry',
      category: formData.category,
      message: formData.message,
      orderId: formData.orderId || undefined,
    });

    setSubmittedTicket(tkt);
    setFormData({
      customerName: '',
      email: '',
      subject: '',
      category: 'Product Fitting',
      message: '',
      orderId: '',
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f7f6f0' }}>
      <Navbar />

      <div style={{ background: '#0e1c14', color: '#ffffff', padding: '50px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--accent-gold)' }}>
          CONCIERGE &amp; FITTING DESK
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 38, marginTop: 8, marginBottom: 12 }}>
          How May We Assist Your Round?
        </h1>
        <p style={{ color: '#a7c2b3', fontSize: 15, maxWidth: 540, margin: '0 auto' }}>
          Have inquiries regarding club fitting, White-Glove delivery times, or bulk corporate tournament orders? Connect with our specialists.
        </p>
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '50px 24px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'start' }}>
          {/* Ticket Submission Form */}
          <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Submit a Concierge Request</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>
              Our PGA-certified equipment specialist will respond within 2 hours.
            </p>

            {submittedTicket ? (
              <div style={{ padding: 24, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, textAlign: 'center' }}>
                <CheckCircleIcon size={40} style={{ color: '#16a34a', margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: 18, color: '#166534', marginBottom: 4 }}>Ticket Created: #{submittedTicket.ticketNumber}</h4>
                <p style={{ fontSize: 14, color: '#166534', marginBottom: 16 }}>
                  Your inquiry has been submitted and queued on the staff support desk.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button onClick={() => setSubmittedTicket(null)} className="btn btn-outline btn-sm">
                    Submit Another Query
                  </button>
                  <Link href="/admin/support" className="btn btn-primary btn-sm">
                    View in Admin Desk →
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Vikramaditya Sharma"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. vikram@dlfcity.in"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Inquiry Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, background: '#ffffff' }}
                    >
                      <option>Product Fitting</option>
                      <option>Order Query</option>
                      <option>Delivery Issue</option>
                      <option>Return/Refund</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Order Number (If Any)</label>
                    <input
                      type="text"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      placeholder="e.g. PGF-2026-9812"
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Footwear sizing recommendation for wide feet"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Detailed Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Explain your requirements or query in detail..."
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 8 }}>
                  <span>Submit Ticket</span>
                  <ArrowRightIcon size={16} />
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Operations Hubs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 28 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Direct Concierge Lines</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>
                <div>
                  <strong style={{ display: 'block', color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Phone &amp; WhatsApp:</strong>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>+91 124 492 8800 / +91 98112 00099</span>
                  <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>Monday to Sunday, 7:00 AM - 9:00 PM IST</span>
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>Official Email:</strong>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>concierge@parfairway.in</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 28 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Fulfillment &amp; Fleet Hubs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14 }}>
                <div>
                  <strong style={{ display: 'block', color: 'var(--green)' }}>📍 Gurugram Tour Hub (Delhi NCR)</strong>
                  <p style={{ margin: '4px 0 0', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Plot 48, Sector 43, Near Golf Course Road, Gurugram, Haryana - 122002.<br />
                    <em>Dispatches Same-Day Uniformed Fleet.</em>
                  </p>
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--green)' }}>📍 Bengaluru Links Hub (Karnataka)</strong>
                  <p style={{ margin: '4px 0 0', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Embassy GolfLinks Business Park, Domlur, Bengaluru, Karnataka - 560071.<br />
                    <em>Next-Morning KGA &amp; City Handover.</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
