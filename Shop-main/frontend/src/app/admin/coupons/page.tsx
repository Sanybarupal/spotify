'use client';

import React, { useState } from 'react';
import { AdminLayout } from '../../../components/AdminLayout';
import { useStore } from '../../../context/StoreContext';
import { PlusIcon, TrashIcon } from '../../../components/Icons';

export default function AdminCouponsPage() {
  const { coupons, showToast, refreshFromDb } = useStore();
  const [localCoupons, setLocalCoupons] = useState(coupons);

  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [discountVal, setDiscountVal] = useState(10);
  const [minOrder, setMinOrder] = useState(3000);
  const [description, setDescription] = useState('');

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const coupon = {
      code: newCode.trim().toUpperCase(),
      discountPercentage: discountType === 'percent' ? Number(discountVal) : undefined,
      discountAmount: discountType === 'flat' ? Number(discountVal) : undefined,
      minOrderValue: Number(minOrder),
      description: description || `${discountVal}${discountType === 'percent' ? '%' : '₹'} off on orders above ₹${minOrder}.`,
    };

    try {
      await fetch('/golf-api/coupons.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon),
      });
      refreshFromDb();
    } catch (err) {
      console.error(err);
    }

    setLocalCoupons([coupon, ...localCoupons]);
    setNewCode('');
    setDescription('');
    showToast(`Promotion code ${coupon.code} activated in MySQL.`);
  };

  const handleDelete = (code: string) => {
    setLocalCoupons(localCoupons.filter((c) => c.code !== code));
    showToast(`Coupon ${code} disabled.`, 'info');
  };

  return (
    <AdminLayout title="Coupons &amp; Member Promotions">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
        {/* Active Promotions Table */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Active Discount Codes ({localCoupons.length})</h3>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Voucher Code</th>
                  <th>Discount Benefit</th>
                  <th>Min Order Spend</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {localCoupons.map((c) => (
                  <tr key={c.code}>
                    <td>
                      <code style={{ fontSize: 13, background: 'var(--green-light)', color: 'var(--green)', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                        {c.code}
                      </code>
                    </td>
                    <td>
                      <strong>
                        {c.discountPercentage ? `${c.discountPercentage}% Instant Off` : `Flat ₹${c.discountAmount} Off`}
                      </strong>
                    </td>
                    <td>₹{c.minOrderValue.toLocaleString('en-IN')}</td>
                    <td style={{ fontSize: 13, color: 'var(--muted)' }}>{c.description}</td>
                    <td>
                      <button onClick={() => handleDelete(c.code)} style={{ color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer' }} title="Disable coupon">
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Coupon Card */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: 20 }}>Issue New Promo Code</h3>
          <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Promo Voucher Code
              </label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. MASTERS20"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4, textTransform: 'uppercase' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Benefit Type
              </label>
              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <input
                    type="radio"
                    name="type"
                    checked={discountType === 'percent'}
                    onChange={() => setDiscountType('percent')}
                  />
                  Percentage (%)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <input
                    type="radio"
                    name="type"
                    checked={discountType === 'flat'}
                    onChange={() => setDiscountType('flat')}
                  />
                  Flat Amount (₹)
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  Discount Value
                </label>
                <input
                  type="number"
                  required
                  value={discountVal}
                  onChange={(e) => setDiscountVal(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  Min Spend (₹)
                </label>
                <input
                  type="number"
                  required
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Customer Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 15% VIP discount for DLF Club Members"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
              Publish Promo to MySQL
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
