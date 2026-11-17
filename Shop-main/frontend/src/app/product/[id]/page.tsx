'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { useStore } from '../../../context/StoreContext';
import {
  StarIcon,
  HeartIcon,
  BagIcon,
  TruckIcon,
  ShieldCheckIcon,
  PackageIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '../../../components/Icons';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const {
    getProductById,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
    setIsCartOpen,
  } = useStore();

  const product = getProductById(productId);

  const [selectedImage, setSelectedImage] = useState<string>(product?.image || '');
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'delivery' | 'reviews'>('desc');

  // Review form state
  const [reviewerName, setReviewerName] = useState('');
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState(product?.reviews || []);

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <h2 style={{ fontSize: 28, marginBottom: 16 }}>Product Not Found</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>The equipment you are seeking is either discontinued or out of catalog.</p>
          <Link href="/shop" className="btn btn-primary">
            Return to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const activePrice = product.price + (selectedVariant?.priceModifier || 0);
  const savings = Math.max(0, product.mrp - activePrice);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    const prefix = pincode.substring(0, 2);
    if (['11', '12', '20'].includes(prefix)) {
      setPincodeResult('✓ Delhi NCR Fleet Zone: White-Glove Same-Day Delivery available! Hand-delivered by our uniformed driver.');
    } else if (['56'].includes(prefix)) {
      setPincodeResult('✓ Bengaluru Links Depot Zone: White-Glove Next-Morning Delivery available directly to your club or home.');
    } else {
      setPincodeResult('✓ Express Priority Courier: 2-3 business days standard delivery with tamper-proof packaging.');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    router.push('/checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev = {
      id: 'rev-' + Date.now(),
      userName: reviewerName.trim(),
      rating: ratingScore,
      comment: reviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };

    setLocalReviews([newRev, ...localReviews]);
    setReviewerName('');
    setReviewComment('');
    showToast('Thank you! Your verified player review has been recorded.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Breadcrumbs */}
      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '16px 24px', fontSize: 13, color: 'var(--muted)' }}>
        <Link href="/">Home</Link> &gt; <Link href="/shop">Catalog</Link> &gt; <Link href={`/shop?cat=${product.category}`}>{product.category.toUpperCase()}</Link> &gt; <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{product.name}</span>
      </div>

      <main style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '0 24px 80px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(360px, 1fr)', gap: 50 }}>
          {/* Left Column: Gallery */}
          <div>
            <div
              style={{
                width: '100%',
                paddingTop: '90%',
                position: 'relative',
                background: '#ffffff',
                borderRadius: 8,
                border: '1px solid var(--line)',
                overflow: 'hidden',
                marginBottom: 16,
              }}
            >
              <img
                src={selectedImage || product.image}
                alt={product.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'rgba(255, 255, 255, 0.9)',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: inWishlist ? '#d32f2f' : 'var(--ink)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <HeartIcon size={22} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.gallery && product.gallery.length > 1 && (
              <div style={{ display: 'flex', gap: 12 }}>
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: selectedImage === img ? '2px solid var(--green)' : '1px solid var(--line)',
                      padding: 0,
                    }}
                  >
                    <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees Box */}
            <div
              style={{
                marginTop: 32,
                padding: 24,
                background: 'var(--paper-subtle)',
                borderRadius: 8,
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <TruckIcon size={22} style={{ color: 'var(--green)' }} />
                <div>
                  <strong style={{ fontSize: 14 }}>White-Glove Own-Delivery</strong>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>Climate-controlled transport &amp; on-spot inspection.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <ShieldCheckIcon size={22} style={{ color: 'var(--green)' }} />
                <div>
                  <strong style={{ fontSize: 14 }}>100% Genuine Tour Equipment</strong>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>Direct from manufacturer with verifiable serial numbers.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <PackageIcon size={22} style={{ color: 'var(--green)' }} />
                <div>
                  <strong style={{ fontSize: 14 }}>Complimentary Custom Packaging</strong>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>Shock-absorbent bespoke boxes for woods, irons &amp; bags.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>
              {product.brand} • SKU: {product.sku}
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 400, margin: '8px 0 12px' }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} size={15} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{product.rating}</span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                ({localReviews.length} Verified Reviews)
              </span>
            </div>

            {/* Pricing */}
            <div style={{ padding: '16px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink)' }}>
                  ₹{activePrice.toLocaleString('en-IN')}
                </span>
                {product.mrp > activePrice && (
                  <span style={{ fontSize: 18, color: 'var(--muted)', textDecoration: 'line-through' }}>
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                {savings > 0 && (
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#2e7d32', background: '#e8f5e9', padding: '3px 8px', borderRadius: 4 }}>
                    Save ₹{savings.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                Price inclusive of all taxes (18% GST). White-Glove delivery free on orders above ₹4,999.
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>
                  Select {product.variantType === 'size' ? 'Size' : product.variantType === 'color' ? 'Color' : 'Option'}:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 4,
                        border: selectedVariant?.id === v.id ? '2px solid var(--green)' : '1px solid var(--line)',
                        background: selectedVariant?.id === v.id ? 'var(--green-light)' : '#ffffff',
                        fontWeight: selectedVariant?.id === v.id ? 700 : 500,
                        color: selectedVariant?.id === v.id ? 'var(--green)' : 'var(--ink)',
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and CTA */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700 }}>Quantity:</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 4, background: '#ffffff' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '8px 14px', fontSize: 16 }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ padding: '8px 14px', fontSize: 16 }}
                  >
                    +
                  </button>
                </div>
                <span style={{ fontSize: 13, color: product.stock > 0 ? '#2e7d32' : '#dc2626', fontWeight: 600 }}>
                  {product.stock > 0 ? `✓ ${product.stock} units ready for immediate fleet dispatch` : 'Out of Stock'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="btn btn-secondary btn-lg"
                  style={{ flex: 1 }}
                >
                  <BagIcon size={18} />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                >
                  <span>Buy Now with Own-Delivery</span>
                  <ArrowRightIcon size={18} />
                </button>
              </div>
            </div>

            {/* Pincode Estimator */}
            <div style={{ padding: 20, background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', marginBottom: 32 }}>
              <strong style={{ display: 'block', fontSize: 14, marginBottom: 8 }}>
                Check White-Glove Own-Delivery Schedule:
              </strong>
              <form onSubmit={handlePincodeCheck} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code (e.g. 122002)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid var(--line)',
                    borderRadius: 4,
                  }}
                />
                <button type="submit" className="btn btn-outline btn-sm">
                  Verify
                </button>
              </form>
              {pincodeResult && (
                <p style={{ fontSize: 13, color: pincodeResult.startsWith('✓') ? '#2e7d32' : '#d32f2f', fontWeight: 500 }}>
                  {pincodeResult}
                </p>
              )}
            </div>

            {/* Tabs */}
            <div>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', gap: 24, marginBottom: 20 }}>
                {[
                  { id: 'desc', label: 'Description' },
                  { id: 'specs', label: 'Specifications' },
                  { id: 'delivery', label: 'White-Glove Delivery' },
                  { id: 'reviews', label: `Reviews (${localReviews.length})` },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    style={{
                      padding: '10px 0',
                      fontSize: 14,
                      fontWeight: activeTab === t.id ? 700 : 500,
                      color: activeTab === t.id ? 'var(--green)' : 'var(--muted)',
                      borderBottom: activeTab === t.id ? '2px solid var(--green)' : '2px solid transparent',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === 'desc' && (
                <div style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink)' }}>
                  <p>{product.description}</p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <tbody>
                      {Object.entries(product.specs).map(([key, val], i) => (
                        <tr key={key} style={{ background: i % 2 === 0 ? '#fafbfa' : '#ffffff' }}>
                          <td style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--muted)', width: '40%' }}>{key}</td>
                          <td style={{ padding: '10px 16px', color: 'var(--ink)' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'delivery' && (
                <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink)' }}>
                  <p><strong>Our In-House White-Glove Fleet Policy:</strong></p>
                  <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li>Delhi NCR: Gurugram, DLF Phase 1-5, Chanakyapuri, Vasant Vihar, Noida. Same-day or scheduled time slots available.</li>
                    <li>Bengaluru: Embassy GolfLinks, Indiranagar, Sadashivanagar. Next morning handover.</li>
                    <li>Rest of India: Insured air freight via our priority logistics partner with tamper-evident seal.</li>
                    <li>7-day return policy on equipment in unhit condition. Footwear &amp; apparel can be fitted upon delivery.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  {/* Reviews List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                    {localReviews.length === 0 ? (
                      <p style={{ color: 'var(--muted)', fontSize: 14 }}>No reviews yet. Be the first to review this tour equipment!</p>
                    ) : (
                      localReviews.map((r) => (
                        <div key={r.id} style={{ padding: 16, background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <strong>{r.userName}</strong>
                            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{r.date}</span>
                          </div>
                          <div style={{ display: 'flex', color: 'var(--accent-gold)', marginBottom: 8 }}>
                            {[...Array(5)].map((_, i) => (
                              <StarIcon key={i} size={13} fill={i < r.rating ? 'currentColor' : 'none'} />
                            ))}
                          </div>
                          <p style={{ fontSize: 14, color: 'var(--ink)' }}>{r.comment}</p>
                          {r.verifiedPurchase && (
                            <span style={{ display: 'inline-block', fontSize: 11, color: '#2e7d32', marginTop: 6 }}>
                              ✓ Verified Fairway Buyer
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <div style={{ padding: 20, background: 'var(--paper-subtle)', borderRadius: 8, border: '1px solid var(--line)' }}>
                    <h4 style={{ fontSize: 16, marginBottom: 12 }}>Write a Player Review</h4>
                    <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Your Name:</label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Vikramaditya S."
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Rating:</label>
                        <select
                          value={ratingScore}
                          onChange={(e) => setRatingScore(Number(e.target.value))}
                          style={{ padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                        >
                          <option value={5}>5 Stars - Tour Excellence</option>
                          <option value={4}>4 Stars - Great Performance</option>
                          <option value={3}>3 Stars - Average</option>
                          <option value={2}>2 Stars - Subpar</option>
                          <option value={1}>1 Star - Dissatisfied</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Your Review / Experience:</label>
                        <textarea
                          rows={3}
                          required
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience on the fairway, feel, distance, or delivery..."
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                        Submit Review
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
