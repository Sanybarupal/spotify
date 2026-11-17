'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { ArrowRightIcon, TruckIcon, ShieldCheckIcon, StarIcon, CheckCircleIcon } from '../components/Icons';

export default function Home() {
  const { products, setSelectedCategory } = useStore();

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const bestsellerProducts = products.filter((p) => p.bestseller).slice(0, 4);

  const categories = [
    {
      id: 'balls',
      title: 'Tour Golf Balls',
      count: '3 Tour Series',
      image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'apparel',
      title: 'Performance Apparel',
      count: 'Polos, Chinos & Caps',
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'footwear',
      title: 'Waterproof Footwear',
      count: 'Carbon & Tour Cleats',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'bags',
      title: 'Luxury Golf Bags',
      count: '14-Way Stand & Cart',
      image: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'accessories',
      title: 'Tour Accessories',
      count: 'Bushnell, Gloves & Tees',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Banner */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=2000&q=85")',
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">MADE FOR YOUR NEXT ROUND</span>
            <h1 className="hero-title">
              Find your <br />
              <em>fairway.</em>
            </h1>
            <p className="hero-text">
              Championship golf balls, engineered performance apparel, handcrafted bags, and tour-proven footwear. Delivered with white-glove precision to your doorstep or home club.
            </p>
            <div className="hero-cta-group">
              <Link href="/shop" className="btn btn-primary btn-lg">
                <span>Explore Tour Collection</span>
                <ArrowRightIcon size={18} />
              </Link>
              <Link href="/shop?cat=balls" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
                Shop Pro V1 Balls
              </Link>
            </div>

            <div className="hero-fleet-badge">
              <TruckIcon size={18} />
              <span>
                <strong>White-Glove Own-Delivery</strong> • Same-day &amp; scheduled delivery across Delhi NCR &amp; Bengaluru
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="section">
        <div className="section-header">
          <div>
            <span className="section-subtitle">The Disciplines</span>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <Link href="/shop" className="section-link">
            <span>View All Categories</span>
            <ArrowRightIcon size={16} />
          </Link>
        </div>

        <div className="category-cards-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?cat=${cat.id}`}
              onClick={() => setSelectedCategory(cat.id as any)}
              className="category-card"
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              <div className="category-card-overlay"></div>
              <div className="category-card-info">
                <h3 className="category-card-title">{cat.title}</h3>
                <span className="category-card-count">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / Tour Choice Products */}
      <section className="section" style={{ background: '#f2f1ea', maxWidth: '100%' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          <div className="section-header">
            <div>
              <span className="section-subtitle">Championship Caliber</span>
              <h2 className="section-title">Tour Choice Essentials</h2>
            </div>
            <Link href="/shop" className="section-link">
              <span>View Full Lineup</span>
              <ArrowRightIcon size={16} />
            </Link>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* White-Glove Own-Delivery Highlight Banner */}
      <section className="section">
        <div
          style={{
            background: 'var(--green)',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '48px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--accent-gold)' }}>
              OUR SIGNATURE COMMITMENT
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, margin: '12px 0 16px', lineHeight: 1.15 }}>
              Single-Vendor Excellence. <br />
              <em>Our Own Delivery Fleet.</em>
            </h2>
            <p style={{ color: '#d1e3d9', fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
              Unlike generic marketplaces, every order is stored in our climate-controlled hubs, hand-packed by golf specialists, and brought directly to your residence or club locker room by our dedicated in-house delivery executives.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                <CheckCircleIcon size={18} style={{ color: 'var(--accent-gold)' }} />
                <span>Zero third-party courier mishandling of sensitive carbon shafts &amp; bags</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                <CheckCircleIcon size={18} style={{ color: 'var(--accent-gold)' }} />
                <span>On-spot trial &amp; size verification for golf footwear &amp; apparel</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                <CheckCircleIcon size={18} style={{ color: 'var(--accent-gold)' }} />
                <span>Complimentary white-glove service on all orders above ₹4,999</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '32px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <h3 style={{ fontSize: 20, marginBottom: 16, color: '#ffffff' }}>Delivery Operations Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 12, background: 'rgba(0, 0, 0, 0.2)', borderRadius: 6 }}>
                <strong style={{ display: 'block', fontSize: 14 }}>Delhi NCR Service Zone</strong>
                <span style={{ fontSize: 13, color: '#a7c2b3' }}>
                  DLF Phase 1-5, Golf Course Ext., Vasant Kunj, Chanakyapuri — <strong>Same Day Dispatch Active</strong>
                </span>
              </div>
              <div style={{ padding: 12, background: 'rgba(0, 0, 0, 0.2)', borderRadius: 6 }}>
                <strong style={{ display: 'block', fontSize: 14 }}>Bengaluru Service Zone</strong>
                <span style={{ fontSize: 13, color: '#a7c2b3' }}>
                  Indiranagar, Embassy GolfLinks, KGA, Sadashivanagar — <strong>Next Morning Delivery</strong>
                </span>
              </div>
              <Link href="/about" className="btn btn-gold btn-block" style={{ marginTop: 8 }}>
                Learn About Our Delivery Fleet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section">
        <div className="section-header">
          <div>
            <span className="section-subtitle">India&apos;s Favorites</span>
            <h2 className="section-title">Most Popular Gear</h2>
          </div>
          <Link href="/shop" className="section-link">
            <span>Shop All Equipment</span>
            <ArrowRightIcon size={16} />
          </Link>
        </div>

        <div className="products-grid">
          {bestsellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Member Testimonials */}
      <section className="section" style={{ background: '#ffffff', maxWidth: '100%' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-subtitle">Player Feedback</span>
            <h2 className="section-title">Played Across India&apos;s Finest Greens</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            <div style={{ padding: 28, background: 'var(--paper)', borderRadius: 8, border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', color: 'var(--accent-gold)', marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <StarIcon key={i} size={16} fill="currentColor" />)}
              </div>
              <p style={{ fontStyle: 'italic', fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
                &ldquo;Ordering Titleist Pro V1 dozens with same-day white glove delivery directly to DLF Golf Course changed the game for me. Flawless packaging and authentic balls.&rdquo;
              </p>
              <strong>Rajeev Kapur</strong>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>Member, DLF Golf &amp; Country Club</span>
            </div>

            <div style={{ padding: 28, background: 'var(--paper)', borderRadius: 8, border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', color: 'var(--accent-gold)', marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <StarIcon key={i} size={16} fill="currentColor" />)}
              </div>
              <p style={{ fontStyle: 'italic', fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
                &ldquo;The Vessel Player IV Pro bag arrived in pristine condition. The delivery driver even checked the zippers with me and handed over the warranty card personally.&rdquo;
              </p>
              <strong>Arjun Singhal</strong>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>Handicap 4, Delhi Golf Club</span>
            </div>

            <div style={{ padding: 28, background: 'var(--paper)', borderRadius: 8, border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', color: 'var(--accent-gold)', marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <StarIcon key={i} size={16} fill="currentColor" />)}
              </div>
              <p style={{ fontStyle: 'italic', fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
                &ldquo;The Fairway Tour Polos handle the sultry afternoon rounds at KGA Bengaluru effortlessly. Exceptional drape, zero cling, and true to Indian sizing.&rdquo;
              </p>
              <strong>Dr. Siddharth Rao</strong>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>Member, KGA Bengaluru</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section" style={{ textAlign: 'center', maxWidth: 800 }}>
        <span className="section-subtitle">THE 19TH HOLE CLUB</span>
        <h2 className="section-title" style={{ marginBottom: 16 }}>Join the Clubhouse</h2>
        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 28 }}>
          Receive private access to limited-edition tour drops, fitting clinic invitations, and take <strong>10% off</strong> your first order with code <strong>GOLF10</strong>.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Welcome to The Fairway Club! Use code GOLF10 at checkout.');
          }}
          style={{ display: 'flex', gap: 10, maxWidth: 480, margin: '0 auto' }}
        >
          <input
            type="email"
            required
            placeholder="Enter your email address"
            style={{
              flex: 1,
              padding: '14px 18px',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              outline: 'none',
            }}
          />
          <button type="submit" className="btn btn-primary">
            Join Club
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
}
