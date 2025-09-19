'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ProductPrice from './product-price';

interface AnimatedPriceProps {
  value: number;
  className?: string;
}

export default function AnimatedPrice({ value, className }: AnimatedPriceProps) {
  const priceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priceRef.current) {
      // Initial state
      gsap.set(priceRef.current, {
        scale: 0.8,
        opacity: 0,
        rotationY: -180
      });

      // Animation timeline
      const tl = gsap.timeline();
      
      tl.to(priceRef.current, {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      })
      .to(priceRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(priceRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });

      // Hover animations
      const handleMouseEnter = () => {
        gsap.to(priceRef.current, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(priceRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const element = priceRef.current;
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <div
      ref={priceRef}
      className={`inline-flex items-center bg-gradient-to-r from-green-50 via-green-100 to-green-200 text-green-700 px-4 py-2 rounded-full shadow-lg border-2 border-green-200 cursor-pointer transform transition-all duration-300 hover:shadow-xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7, #bbf7d0)',
        boxShadow: '0 4px 15px rgba(34, 197, 94, 0.2)'
      }}
    >
      <ProductPrice
        value={value}
        className="text-green-700 font-bold drop-shadow-sm"
      />
    </div>
  );
}