import React from 'react';
import './ProfileSkeleton.css';

export default function ProfileSkeleton() {
  return (
    <div className="skeleton-wrapper">
      {/* Navbar Skeleton */}
      <nav className="skeleton-nav">
        <div className="skeleton skeleton-brand"></div>
        <div className="skeleton-links">
          <div className="skeleton skeleton-link"></div>
          <div className="skeleton skeleton-link"></div>
          <div className="skeleton skeleton-link"></div>
          <div className="skeleton skeleton-link"></div>
        </div>
      </nav>

      {/* Hero Skeleton */}
      <section className="skeleton-hero">
        <div className="skeleton skeleton-tagline"></div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-desc"></div>
        <div className="skeleton skeleton-desc" style={{ width: '70%' }}></div>
        <div className="skeleton skeleton-btn"></div>
      </section>

      {/* About Section Skeleton */}
      <section className="skeleton-section">
        <div className="skeleton-grid">
          <div className="skeleton-about-text">
            <div className="skeleton" style={{ width: '100px', height: '14px' }}></div>
            <div className="skeleton" style={{ width: '80%', height: '32px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '16px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '16px' }}></div>
            <div className="skeleton" style={{ width: '90%', height: '16px' }}></div>
          </div>
          <div className="skeleton skeleton-img-box"></div>
        </div>
      </section>

      {/* Collections Section Skeleton */}
      <section className="skeleton-section" style={{ background: '#fafafa' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="skeleton" style={{ width: '120px', height: '14px', marginBottom: '16px' }}></div>
          <div className="skeleton" style={{ width: '200px', height: '32px' }}></div>
        </div>
        <div className="skeleton-collections-grid">
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
        </div>
      </section>
    </div>
  );
}
