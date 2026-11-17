'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../context/StoreContext';
import {
  BagIcon,
  HeartIcon,
  SearchIcon,
  UserIcon,
  TruckIcon,
  CloseIcon,
} from './Icons';
import { Category } from '../types';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    wishlist,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    currentUser,
    loginUser,
    logoutUser,
  } = useStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      router.push(`/shop?q=${encodeURIComponent(localSearch.trim())}`);
    }
  };

  const handleCategoryClick = (cat: Category | 'all') => {
    setSelectedCategory(cat);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 1000, background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      {/* Main Navigation Bar (Clean Amazon/Flipkart Header) */}
      <div className="main-navbar" style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1280, margin: '0 auto', padding: '0 24px', gap: 24 }}>
          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <CloseIcon size={22} /> : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>

          {/* Wordmark Brand Logo */}
          <Link href="/" className="brand-wordmark" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
            <span className="brand-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 800, letterSpacing: '0.08em', color: 'var(--ink)' }}>
              PAR &amp; FAIRWAY
            </span>
            <span className="brand-sub" style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--green)', textTransform: 'uppercase', fontWeight: 700 }}>
              LUXURY GOLF INDIA
            </span>
          </Link>

          {/* Amazon/Flipkart Search Bar */}
          <form onSubmit={handleSearchSubmit} className="nav-search-form" style={{ flex: 1, maxWidth: 540 }}>
            <div className="search-input-wrapper" style={{ position: 'relative', width: '100%' }}>
              <SearchIcon size={16} className="search-icon" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                type="text"
                placeholder="Search Titleist balls, FootJoy shoes, tour apparel, stand bags..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="search-field"
                style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 6, border: '1px solid var(--line)', background: '#f7f6f0', fontSize: 13 }}
              />
            </div>
          </form>

          {/* Right Action Icons & Amazon/Flipkart Profile Dropdown */}
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

              <TruckIcon size={20} />
              <span className="action-label" style={{ display: 'inline' }}>Track</span>
            </Link>

            <Link href="/account?tab=wishlist" className="nav-action-link" title="Saved Wishlist" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
              <div className="badge-wrapper" style={{ position: 'relative', display: 'flex' }}>
                <HeartIcon size={20} />
                {wishlistCount > 0 && (
                  <span style={{ position: 'absolute', top: -8, right: -10, background: '#d32f2f', color: '#fff', fontSize: 10, padding: '1px 5px', borderRadius: 10, fontWeight: 700 }}>
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="action-label">Wishlist</span>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="nav-action-link cart-btn"
              title="Shopping Cart"
              aria-label="Open Shopping Cart"
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
            >
              <div className="badge-wrapper" style={{ position: 'relative', display: 'flex' }}>
                <BagIcon size={20} />
                {cartCount > 0 && (
                  <span style={{ position: 'absolute', top: -8, right: -10, background: 'var(--green)', color: '#fff', fontSize: 10, padding: '1px 5px', borderRadius: 10, fontWeight: 700 }}>
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="action-label">Cart</span>
            </button>

            {/* Amazon / Flipkart Style Profile Dropdown Menu */}
            <div ref={profileMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--line)',
                  background: isProfileMenuOpen ? '#f3f4f6' : '#ffffff',
                  color: 'var(--ink)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
                aria-expanded={isProfileMenuOpen}
              >
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserIcon size={15} />
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <span style={{ display: 'block', fontSize: 10, color: 'var(--muted)', fontWeight: 500 }}>
                    {currentUser.isLoggedIn ? 'Hello,' : 'Account &'}
                  </span>
                  <span>{currentUser.isLoggedIn ? currentUser.name.split(' ')[0] : 'Sign In ▾'}</span>
                </div>
              </button>

              {/* Dropdown Floating Modal */}
              {isProfileMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    width: 290,
                    background: '#ffffff',
                    borderRadius: 8,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid var(--line)',
                    padding: '16px 0',
                    zIndex: 2000,
                  }}
                >
                  {/* User Header / Sign In Banner */}
                  <div style={{ padding: '0 18px 14px', borderBottom: '1px solid var(--line)' }}>
                    {currentUser.isLoggedIn ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: 14, display: 'block' }}>{currentUser.name}</strong>
                          <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'capitalize' }}>
                            Role: {currentUser.role.replace('_', ' ')}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            logoutUser();
                            setIsProfileMenuOpen(false);
                          }}
                          style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            loginUser({ name: 'Balram Nokhwal', email: 'buyer@golfcommerce.in', role: 'customer' });
                            setIsProfileMenuOpen(false);
                          }}
                          className="btn btn-primary btn-block btn-sm"
                          style={{ marginBottom: 6 }}
                        >
                          Sign In as Customer
                        </button>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                          New customer? Start shopping
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Buyer Section */}
                  <div style={{ padding: '8px 0' }}>
                    <span style={{ padding: '4px 18px', display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Customer Account
                    </span>
                    <Link
                      href="/account?tab=orders"
                      onClick={() => setIsProfileMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', fontSize: 13, color: 'var(--ink)', textDecoration: 'none' }}
                      className="profile-menu-item"
                    >
                      📦 <span>Your Orders &amp; Invoices</span>
                    </Link>
                    <Link
                      href="/account?tab=wishlist"
                      onClick={() => setIsProfileMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', fontSize: 13, color: 'var(--ink)', textDecoration: 'none' }}
                      className="profile-menu-item"
                    >
                      ❤️ <span>Your Saved Wishlist</span>
                    </Link>
                    <Link
                      href="/account?tab=profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', fontSize: 13, color: 'var(--ink)', textDecoration: 'none' }}
                      className="profile-menu-item"
                    >
                      👤 <span>Account Settings &amp; Addresses</span>
                    </Link>
                  </div>

                  {/* Seller Hub Section (Amazon/Flipkart style) */}
                  <div style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>
                    <span style={{ padding: '4px 18px', display: 'block', fontSize: 11, fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Selling on Fairway
                    </span>
                    <Link
                      href="/seller"
                      onClick={() => {
                        loginUser({ name: 'Apex Pro Golf Shop', email: 'seller@golfcommerce.in', role: 'seller' });
                        setIsProfileMenuOpen(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', fontSize: 13, color: '#b45309', fontWeight: 600, textDecoration: 'none' }}
                      className="profile-menu-item"
                    >
                      ⛳ <span>Seller Central &amp; Catalog</span>
                    </Link>
                  </div>

                  {/* Staff & Internal Management */}
                  <div style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>
                    <span style={{ padding: '4px 18px', display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Operations &amp; Admin
                    </span>
                    <Link
                      href="/admin/orders"
                      onClick={() => {
                        loginUser({ name: 'Rajesh Verma', email: 'manager@golfcommerce.in', role: 'order_manager' });
                        setIsProfileMenuOpen(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', fontSize: 13, color: 'var(--ink)', textDecoration: 'none' }}
                      className="profile-menu-item"
                    >
                      📋 <span>Order Fulfillment Desk</span>
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => {
                        loginUser({ name: 'Admin Manager', email: 'admin@golfcommerce.in', role: 'admin' });
                        setIsProfileMenuOpen(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', fontSize: 13, color: 'var(--ink)', textDecoration: 'none' }}
                      className="profile-menu-item"
                    >
                      ⚙️ <span>Admin Management Suite</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Category Navigation Bar */}
        <nav className={`category-nav-bar ${isMobileMenuOpen ? 'open' : ''}`} style={{ background: '#f7f6f0', borderTop: '1px solid var(--line)' }}>
          <div className="nav-container categories-container" style={{ display: 'flex', alignItems: 'center', gap: 24, maxWidth: 1280, margin: '0 auto', padding: '10px 24px', overflowX: 'auto' }}>
            <Link
              href="/shop"
              onClick={() => handleCategoryClick('all')}
              className="cat-link"
              style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              All Categories
            </Link>
            <Link
              href="/shop?cat=balls"
              onClick={() => handleCategoryClick('balls')}
              className="cat-link"
              style={{ fontSize: 13, color: 'var(--ink)', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Golf Balls
            </Link>
            <Link
              href="/shop?cat=apparel"
              onClick={() => handleCategoryClick('apparel')}
              className="cat-link"
              style={{ fontSize: 13, color: 'var(--ink)', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Apparel
            </Link>
            <Link
              href="/shop?cat=footwear"
              onClick={() => handleCategoryClick('footwear')}
              className="cat-link"
              style={{ fontSize: 13, color: 'var(--ink)', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Footwear
            </Link>
            <Link
              href="/shop?cat=bags"
              onClick={() => handleCategoryClick('bags')}
              className="cat-link"
              style={{ fontSize: 13, color: 'var(--ink)', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Bags
            </Link>
            <Link
              href="/shop?cat=accessories"
              onClick={() => handleCategoryClick('accessories')}
              className="cat-link"
              style={{ fontSize: 13, color: 'var(--ink)', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Accessories
            </Link>
            <Link href="/about" className="cat-link-accent" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
              About
            </Link>
            <Link href="/contact" className="cat-link-accent" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Support &amp; Concierge
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
