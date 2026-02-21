'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HERO_IMAGES } from '@/lib/constants/games';

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
        setIsTransitioning(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="relative w-full h-[520px] md:h-[600px] overflow-hidden rounded-2xl neo border border-[var(--border-dim)]">
      {/* Background Images */}
      {HERO_IMAGES.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Multi-layer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--void)]/95 via-[var(--void)]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)]/80 via-transparent to-transparent" />
          {/* Scanline overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.08) 2px, rgba(0,240,255,0.08) 4px)',
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6 md:px-10">
          <div className={`max-w-2xl transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {/* Terminal tag */}
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full neo-sm border border-[rgba(0,240,255,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse" />
              <span className="terminal-label text-[0.65rem]">CANLI // AKTIF</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-[var(--text-primary)] mb-5 leading-[1.1]">
              <span className="text-gradient text-glitch">
                {HERO_IMAGES[currentSlide].title}
              </span>
            </h1>

            <p className="text-base md:text-lg text-[var(--text-secondary)] mb-8 max-w-lg leading-relaxed">
              {HERO_IMAGES[currentSlide].subtitle}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/search" className="btn btn-filled btn-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Urunleri Kesfet
              </Link>
              <Link href="/categories" className="btn btn-secondary btn-lg">
                Kategoriler
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[var(--neon-cyan)] w-8 shadow-[0_0_8px_rgba(0,240,255,0.5)]'
                : 'bg-[var(--text-ghost)] w-4 hover:bg-[var(--text-tertiary)]'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg neo-sm flex items-center justify-center border border-[var(--border-subtle)] hover:border-[var(--neon-cyan)] hover:shadow-[var(--glow-cyan-sm)] transition-all"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % HERO_IMAGES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg neo-sm flex items-center justify-center border border-[var(--border-subtle)] hover:border-[var(--neon-cyan)] hover:shadow-[var(--glow-cyan-sm)] transition-all"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* HUD corners */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[var(--neon-cyan)] opacity-30" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[var(--neon-cyan)] opacity-30" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[var(--neon-cyan)] opacity-30" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[var(--neon-cyan)] opacity-30" />
    </div>
  );
}
