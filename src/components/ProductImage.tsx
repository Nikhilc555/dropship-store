'use client';

import React, { useState, useEffect } from 'react';

export const DEFAULT_PRODUCT_IMAGE = '/images/default-product.svg';
export const STANDARD_IMAGE_SIZE = 800;

/**
 * Normalizes any product image URL to a standard 800x800 resolution,
 * or returns the default fallback image if empty/missing.
 */
export function normalizeProductImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return DEFAULT_PRODUCT_IMAGE;
  }
  const trimmed = url.trim();

  // Standardize Unsplash URLs to 800x800 crop
  if (trimmed.includes('images.unsplash.com')) {
    const baseUrl = trimmed.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&w=${STANDARD_IMAGE_SIZE}&h=${STANDARD_IMAGE_SIZE}&q=85`;
  }

  return trimmed;
}

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => normalizeProductImageUrl(src));

  useEffect(() => {
    setImgSrc(normalizeProductImageUrl(src));
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt || 'Product image'}
      width={STANDARD_IMAGE_SIZE}
      height={STANDARD_IMAGE_SIZE}
      loading="lazy"
      onError={() => {
        if (imgSrc !== DEFAULT_PRODUCT_IMAGE) {
          setImgSrc(DEFAULT_PRODUCT_IMAGE);
        }
      }}
      className={`object-cover object-center ${className}`}
    />
  );
}

