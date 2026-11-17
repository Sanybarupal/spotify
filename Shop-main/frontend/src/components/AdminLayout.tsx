'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '../context/StoreContext';
import {
  PackageIcon,
  TruckIcon,
  SettingsIcon,
  UserIcon,
  ArrowRightIcon,
} from './Icons';
import { UserRole } from '../types';

export const AdminLayout: React.FC<{ children: React.ReactNode; title: string }> = ({
  children,
  title,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, setCurrentRole, orders, products, tickets, isDbConnected } = useStore();

  const pendingOrders = orders.filter((o) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Processing').length;
  const activeDeliveries = orders.filter((o) => o.orderStatus === 'Out for Delivery').length;
  const openTickets = tickets.filter((t) => t.status === 'Open').length;

  const navLinks = [
    { href: '/admin', label: 'Dashboard Overview', icon: <SettingsIcon size={18} /> },
    { href: '/admin/orders', label: 'Orders & Fulfillment', icon: <PackageIcon size={18} />, badge: pendingOrders },
    { href: '/admin/delivery', label: 'Own-Delivery Fleet', icon: <TruckIcon size={18} />, badge: activeDeliveries },
    { href: '/admin/products', label: 'Catalog & Stock', icon: <PackageIcon size={18} />, count: products.length },
    { href: '/admin/coupons', label: 'Coupons & Promos', icon: <span style={{ fontSize: 16 }}>🎟️</span> },
    { href: '/admin/support', label: 'Support Desk', icon: <span style={{ fontSize: 16 }}>🎧</span>, badge: openTickets },
    { href: '/seller', label: 'Vendor / Seller Hub', icon: <span style={{ fontSize: 16 }}>⛳</span> },
  ];

  return (
    <div className="admin-shell">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link href="/admin" className="admin-brand-link">
            <span className="brand-badge">STAFF &amp; OPERATIONS</span>
            <h2>PAR &amp; FAIRWAY</h2>
            <span className="sub">Commerce &amp; Fleet Operations</span>
          </Link>
          {isDbConnected && (
            <div style={{ marginTop: 8, fontSize: 11, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
              <span>MySQL Database Connected</span>
            </div>
          )}
        </div>

        {/* Role switcher inside admin */}
        <div className="admin-role-box">
          <label>Operating Role:</label>
          <select
            value={currentRole}
            onChange={(e) => {
              const newRole = e.target.value as UserRole;
              setCurrentRole(newRole);
              if (newRole === 'seller') router.push('/seller');
              else if (newRole === 'admin') router.push('/admin');
              else if (newRole === 'order_manager') router.push('/admin/orders');
              else if (newRole === 'delivery_staff') router.push('/admin/delivery');
              else if (newRole === 'customer') router.push('/shop');
            }}
            className="admin-role-select"
          >
            <option value="admin">⚙️ Super Admin (Full Access)</option>
            <option value="order_manager">📋 Order &amp; Stock Manager</option>
            <option value="seller">⛳ Verified Seller / Pro Shop</option>
            <option value="delivery_staff">🚚 Delivery Fleet Staff</option>
            <option value="customer">👤 Customer Storefront</option>
          </select>
        </div>

        {/* Navigation list */}
        <nav className="admin-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="admin-nav-item-left">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.badge ? (
                  <span className="admin-nav-badge warning">{link.badge}</span>
                ) : link.count ? (
                  <span className="admin-nav-badge neutral">{link.count}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Back to storefront link */}
        <div className="admin-sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link href="/seller" className="btn btn-secondary btn-block btn-sm">
            <span>⛳ Seller Dashboard</span>
          </Link>
          <Link href="/" className="btn btn-outline btn-block btn-sm">
            <span>Customer Storefront</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="admin-title-area">
            <h1>{title}</h1>
            <p className="admin-today-date">
              📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="admin-topbar-actions">
            <div className="admin-user-pill">
              <UserIcon size={16} />
              <span>Signed in as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong></span>
            </div>
            <Link href="/shop" className="btn btn-secondary btn-sm" target="_blank">
              Preview Store ↗
            </Link>
          </div>
        </header>

        {/* Admin Page Content */}
        <main className="admin-content-body">{children}</main>
      </div>
    </div>
  );
};
