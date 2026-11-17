'use client';

import React, { useState } from 'react';
import { AdminLayout } from '../../../components/AdminLayout';
import { useStore } from '../../../context/StoreContext';
import { SupportTicket } from '../../../types';
import { CheckCircleIcon } from '../../../components/Icons';

export default function AdminSupportPage() {
  const { tickets, updateTicketStatus, showToast } = useStore();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [replyText, setReplyText] = useState('');

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    updateTicketStatus(selectedTicket.id, 'Resolved');
    showToast(`Reply dispatched to ${selectedTicket.email}. Ticket marked as Resolved.`);
    setReplyText('');
  };

  return (
    <AdminLayout title="Customer Concierge &amp; Support Desk">
      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {['all', 'Open', 'In Progress', 'Resolved'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: filterStatus === st ? 'var(--green)' : '#ffffff',
              color: filterStatus === st ? '#ffffff' : 'var(--ink)',
              border: '1px solid var(--line)',
            }}
          >
            {st === 'all' ? `All Inquiries (${tickets.length})` : st}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: 28, alignItems: 'start' }}>
        {/* Tickets List */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Customer</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    style={{
                      background: selectedTicket?.id === t.id ? 'var(--green-light)' : 'transparent',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedTicket(t)}
                  >
                    <td>
                      <strong>#{t.ticketNumber}</strong>
                      <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                        {t.createdAt}
                      </span>
                    </td>
                    <td>
                      <strong>{t.customerName}</strong>
                      <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>
                        {t.email}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 6px', background: '#e0f2fe', color: '#0369a1', borderRadius: 4 }}>
                        {t.category}
                      </span>
                    </td>
                    <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.subject}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 12,
                          background: t.status === 'Resolved' ? '#dcfce7' : t.status === 'In Progress' ? '#fef3c7' : '#fee2e2',
                          color: t.status === 'Resolved' ? '#166534' : t.status === 'In Progress' ? '#92400e' : '#991b1b',
                        }}
                      >
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(t);
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Ticket Conversation & Resolution */}
        {selectedTicket && (
          <div className="admin-card" style={{ border: '2px solid var(--green)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: 16, marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  TICKET #{selectedTicket.ticketNumber}
                </span>
                <h3 style={{ fontSize: 18, margin: '2px 0 0' }}>{selectedTicket.subject}</h3>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 12,
                  background: selectedTicket.status === 'Resolved' ? '#dcfce7' : '#fef3c7',
                  color: selectedTicket.status === 'Resolved' ? '#166534' : '#92400e',
                }}
              >
                {selectedTicket.status}
              </span>
            </div>

            {/* Customer Details */}
            <div style={{ background: 'var(--paper-subtle)', padding: 14, borderRadius: 6, marginBottom: 16, fontSize: 13, lineHeight: 1.5 }}>
              <div>From: <strong>{selectedTicket.customerName}</strong> ({selectedTicket.email})</div>
              <div>Category: <strong>{selectedTicket.category}</strong></div>
              {selectedTicket.orderId && (
                <div>Related Order: <strong style={{ color: 'var(--green)' }}>#{selectedTicket.orderId}</strong></div>
              )}
            </div>

            {/* Customer Query */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Customer Inquiry:
              </label>
              <div style={{ padding: 14, background: '#ffffff', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14, lineHeight: 1.6 }}>
                {selectedTicket.message}
              </div>
            </div>

            {/* Reply and status update form */}
            <form onSubmit={handleSendReply}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Specialist Reply &amp; Advice:
              </label>
              <textarea
                rows={4}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to the player..."
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginBottom: 12 }}
              />

              <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => updateTicketStatus(selectedTicket.id, 'In Progress')}
                    className="btn btn-secondary btn-sm"
                  >
                    Set In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => updateTicketStatus(selectedTicket.id, 'Resolved')}
                    className="btn btn-outline btn-sm"
                  >
                    Mark Resolved
                  </button>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  Send &amp; Resolve
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
