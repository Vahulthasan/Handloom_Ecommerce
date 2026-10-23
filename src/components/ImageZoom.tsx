'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageZoomProps {
  images: string[];
  productName: string;
}

export default function ImageZoom({ images, productName }: ImageZoomProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '/images/round-shade.jpg');
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
      {/* Vertical Thumbnails (Amazon Style) */}
      <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto scrollbar-none flex-shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onMouseEnter={() => setSelectedImage(img)}
            onClick={() => setSelectedImage(img)}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all ${
              selectedImage === img
                ? 'border-[#c68a24] shadow-md ring-2 ring-[#c68a24]/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
            }`}
            aria-label={`View photo angle ${idx + 1}`}
          >
            <Image
              src={img}
              alt={`${productName} view ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Preview Container with Interactive Lens Zoom */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        className="relative flex-1 aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121c17] cursor-crosshair shadow-sm"
      >
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          className={`object-contain transition-transform duration-100 ease-out ${
            isZooming ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* High-Resolution Zoom Lens Display */}
        {isZooming && (
          <div
            className="absolute inset-0 bg-no-repeat pointer-events-none"
            style={{
              backgroundImage: `url(${selectedImage})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: '220%',
            }}
          />
        )}

        {/* Amazon-style hover helper hint */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded pointer-events-none">
          Roll over image to zoom in
        </div>
      </div>
    </div>
  );
}
