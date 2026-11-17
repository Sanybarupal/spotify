'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ProductCard } from '../../components/ProductCard';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { FilterIcon, CloseIcon } from '../../components/Icons';

function ShopContent() {
  const searchParams = useSearchParams();
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();

  const urlCategory = searchParams.get('cat') as Category | null;
  const urlQuery = searchParams.get('q');

  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Active category determination
  const activeCategory = urlCategory || selectedCategory;

  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return list;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }
      // Search query
      const query = (urlQuery || searchQuery).toLowerCase();
      if (
        query &&
        !p.name.toLowerCase().includes(query) &&
        !p.brand.toLowerCase().includes(query) &&
        !p.description.toLowerCase().includes(query)
      ) {
        return false;
      }
      // Brand filter
      if (brandFilter !== 'all' && p.brand !== brandFilter) {
        return false;
      }
      // Stock filter
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      // Price range
      if (priceRange === 'under-2k' && p.price >= 2000) return false;
      if (priceRange === '2k-5k' && (p.price < 2000 || p.price > 5000)) return false;
      if (priceRange === '5k-15k' && (p.price < 5000 || p.price > 15000)) return false;
      if (priceRange === 'above-15k' && p.price <= 15000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, activeCategory, urlQuery, searchQuery, brandFilter, inStockOnly, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setBrandFilter('all');
    setPriceRange('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Header Banner */}
      <div style={{ background: '#0e1c14', color: '#ffffff', padding: '48px 24px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--accent-gold)' }}>
            CHAMPIONSHIP CATALOG
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 40, marginTop: 8, fontWeight: 400 }}>
            {activeCategory === 'all'
              ? 'Complete Golf Collection'
              : activeCategory === 'balls'
              ? 'Championship Golf Balls'
              : activeCategory === 'apparel'
              ? 'Tour Performance Apparel'
              : activeCategory === 'footwear'
              ? 'Waterproof Golf Footwear'
              : activeCategory === 'bags'
              ? 'Luxury Golf Bags'
              : 'Precision Tour Accessories'}
          </h1>
          <p style={{ color: '#a7c2b3', fontSize: 15, marginTop: 8, maxWidth: 600 }}>
            Direct authorized single-vendor inventory. Hand-inspected and dispatched via our own white-glove fleet.
          </p>
        </div>
      </div>

      {/* Main Catalog View */}
      <main style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '40px 24px', flex: 1 }}>
        {/* Filter bar top */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 32,
            paddingBottom: 20,
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              Showing {filteredProducts.length} Products
            </span>
            {activeCategory !== 'all' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  background: 'var(--green-light)',
                  color: 'var(--green)',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Category: {activeCategory.toUpperCase()}
                <button onClick={() => setSelectedCategory('all')}>
                  <CloseIcon size={12} />
                </button>
              </span>
            )}
            {(urlQuery || searchQuery) && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  background: 'var(--accent-gold-light)',
                  color: '#795e1e',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Search: &quot;{urlQuery || searchQuery}&quot;
                <button onClick={() => setSearchQuery('')}>
                  <CloseIcon size={12} />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'underline' }}
            >
              Reset All
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid var(--line)',
                borderRadius: 4,
                background: '#ffffff',
                fontWeight: 600,
                outline: 'none',
              }}
            >
              <option value="featured">Featured / Tour Choice</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 36, alignItems: 'start' }}>
          {/* Sidebar Filters */}
          <aside
            style={{
              background: '#ffffff',
              padding: 24,
              borderRadius: 8,
              border: '1px solid var(--line)',
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FilterIcon size={16} />
              <span>Filters</span>
            </h3>

            {/* Category selection */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                Category
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { id: 'all', label: 'All Categories' },
                  { id: 'balls', label: 'Golf Balls' },
                  { id: 'apparel', label: 'Apparel' },
                  { id: 'footwear', label: 'Footwear' },
                  { id: 'bags', label: 'Golf Bags' },
                  { id: 'accessories', label: 'Accessories' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    style={{
                      textAlign: 'left',
                      fontSize: 13,
                      fontWeight: activeCategory === cat.id ? 700 : 500,
                      color: activeCategory === cat.id ? 'var(--green)' : 'var(--ink)',
                      padding: '4px 0',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div style={{ marginBottom: 24, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                Price Range
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-2k', label: 'Under ₹2,000' },
                  { id: '2k-5k', label: '₹2,000 to ₹5,000' },
                  { id: '5k-15k', label: '₹5,000 to ₹15,000' },
                  { id: 'above-15k', label: 'Above ₹15,000' },
                ].map((p) => (
                  <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === p.id}
                      onChange={() => setPriceRange(p.id)}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div style={{ marginBottom: 24, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                Brand
              </label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  border: '1px solid var(--line)',
                  borderRadius: 4,
                  fontSize: 13,
                }}
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* In stock only */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>Fleet Ready (In Stock Only)</span>
              </label>
            </div>
          </aside>

          {/* Product Grid */}
          <div>
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  background: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                }}
              >
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>No products match your criteria</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
                  Try resetting your category or price filters to see all championship equipment.
                </p>
                <button onClick={resetFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
