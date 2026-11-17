'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { HeartIcon, StarIcon, BagIcon } from './Icons';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Use first variant if exists, or none
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    addToCart(product, 1, defaultVariant);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="product-card">
      <Link href={`/product/${product.id}`} className="product-card-link">
        {/* Card Image Wrapper */}
        <div className="product-card-media">
          <img
            src={product.image}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
          />

          {/* Badges */}
          <div className="product-badges">
            {product.bestseller && <span className="badge badge-bestseller">Best Seller</span>}
            {product.featured && <span className="badge badge-featured">Tour Choice</span>}
            {discountPercent > 0 && <span className="badge badge-discount">{discountPercent}% OFF</span>}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`wishlist-toggle-btn ${inWishlist ? 'active' : ''}`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <HeartIcon size={18} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Card Details */}
        <div className="product-card-content">
          <div className="product-card-brand">{product.brand}</div>
          <h3 className="product-card-title">{product.name}</h3>

          {/* Rating */}
          <div className="product-card-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  size={13}
                  className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}
                />
              ))}
            </div>
            <span className="rating-score">{product.rating}</span>
            <span className="rating-count">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="product-card-pricing">
            <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
            {product.mrp > product.price && (
              <span className="mrp-price">₹{product.mrp.toLocaleString('en-IN')}</span>
            )}
          </div>

          {/* Stock Tag */}
          <div className="stock-info">
            {product.stock > 10 ? (
              <span className="in-stock">In Stock (White-Glove Fleet Ready)</span>
            ) : product.stock > 0 ? (
              <span className="low-stock">Only {product.stock} units remaining</span>
            ) : (
              <span className="out-of-stock">Sold Out</span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Add Button */}
      <div className="product-card-actions">
        <button
          onClick={handleQuickAdd}
          disabled={product.stock <= 0}
          className="btn btn-outline btn-block btn-sm"
        >
          <BagIcon size={14} />
          <span>{product.variants && product.variants.length > 1 ? 'Quick Add (Default)' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};
