import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './Profile.css';
import ProfileSkeleton from '../components/Skeleton/ProfileSkeleton';

// Importing assets dynamically for Carousels
const armaniImages = Object.values(import.meta.glob('../assets/profile_assets/series_instagram_product/armani_velvet_series/*.{png,jpg,jpeg}', { eager: true }));
const iliyaImages = Object.values(import.meta.glob('../assets/profile_assets/series_instagram_product/iliya_series/*.{png,jpg,jpeg}', { eager: true }));
const laikaImages = Object.values(import.meta.glob('../assets/profile_assets/series_instagram_product/laika_series/*.{png,jpg,jpeg}', { eager: true }));
const rayonImages = Object.values(import.meta.glob('../assets/profile_assets/series_instagram_product/rayon_viscose_series/*.{png,jpg,jpeg}', { eager: true }));

// Dynamically import all hero videos
const defaultHeroVideos = Object.values(import.meta.glob('../assets/profile_assets/series_instagram_models/Videos/*.{mov,mp4,webm}', { eager: true })).map(v => v.default || v);

import aboutImage from '../assets/profile_assets/series_instagram_models/Photos/Model5.png';

import lookbook1 from '../assets/profile_assets/series_instagram_models/Photos/Model1.png';
import lookbook2 from '../assets/profile_assets/series_instagram_models/Photos/Model2.png';
import lookbook3 from '../assets/profile_assets/series_instagram_models/Photos/Model3.png';
import lookbook4 from '../assets/profile_assets/series_instagram_models/Photos/Model4.png';
import lookbook5 from '../assets/profile_assets/series_instagram_models/Photos/Model5.png';

export default function CompanyProfilePage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);

  // Loading Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5s for a premium feel
    return () => clearTimeout(timer);
  }, []);

  // Scroll detection & Intersection Observer for Reveal Animations
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Auto pause audio if user scrolls way past the Hero section
      if (window.scrollY > 800 && isAudioPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Setup intersection observer for elements revealing from side
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.reveal-left, .reveal-right');
    hiddenElements.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [isAudioPlaying, isLoading]);

  // Video Carousel Timer
  useEffect(() => {
    if (defaultHeroVideos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentVideoIdx((prev) => (prev + 1) % defaultHeroVideos.length);
    }, 6000); // changes every 6 seconds
    return () => clearInterval(interval);
  }, []);

  // const toggleAudio = () => {
  //   if (audioRef.current) {
  //     if (isAudioPlaying) {
  //       audioRef.current.pause();
  //     } else {
  //       audioRef.current.play().catch(e => console.error("Audio playback failed", e));
  //     }
  //     setIsAudioPlaying(!isAudioPlaying);
  //   }
  // };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false); // Close mobile menu when navigating
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="profile-container fade-in">
      {/* Navbar Session */}
      <nav className={`profile-nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className="nav-brand">
          VUYAMA
        </a>

        {/* Desktop Menu */}
        <div className="nav-links">
          <span className="nav-link" onClick={() => scrollToSection('about')}>Our Story</span>
          <span className="nav-link" onClick={() => scrollToSection('collections')}>Collections</span>
          <span className="nav-link" onClick={() => scrollToSection('lookbook')}>Lookbook</span>
          <span className="nav-link" onClick={() => scrollToSection('reseller')}>Partnership</span>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="mobile-menu-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div className="mobile-nav-backdrop">
          <div className="mobile-nav-content">
            <span className="mobile-nav-link" onClick={() => scrollToSection('about')}>Our Story</span>
            <span className="mobile-nav-link" onClick={() => scrollToSection('collections')}>Collections</span>
            <span className="mobile-nav-link" onClick={() => scrollToSection('lookbook')}>Lookbook</span>
            <span className="mobile-nav-link" onClick={() => scrollToSection('reseller')}>Partnership</span>
          </div>
        </div>
      )}

      {/* Hero Session */}
      <section id="hero" className="hero-section">
        {/* Abstract external elegant audio source */}
        {/* <audio
          ref={audioRef}
          loop
          src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbfadf.mp3"
        /> */}

        {defaultHeroVideos.map((vid, idx) => (
          <video
            key={idx}
            className={`hero-video ${idx === currentVideoIdx ? 'active' : ''}`}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={vid} type="video/mp4" />
          </video>
        ))}

        <div className="hero-overlay"></div>
        <div className="hero-content reveal-left">
          <p className="hero-tagline">Exquisite Elegance</p>
          <h1 className="hero-title">Grace. Confidence. You.</h1>
          <p className="hero-desc">Redefining modern modesty with premium curated Mukena and Hijab collections for the sophisticated woman.</p>
          <div className="hero-actions">
            <button onClick={() => scrollToSection('collections')} className="btn-primary">
              Discover Collections
            </button>
            {/* <button onClick={toggleAudio} className="btn-outline-gold" style={{ marginLeft: '12px' }}>
              {isAudioPlaying ? 'Mute Music' : 'Play Music ♫'}
            </button> */}
          </div>
        </div>
      </section>

      {/* About/Brand Story Session */}
      <section id="about" className="section collections-bg">
        <div className="about-grid">
          <div className="about-text reveal-left">
            <div className="section-subtitle">Our Heritage</div>
            <h3>Crafting the Modern Modesty</h3>
            <p>
              At Vuyama, we believe that modesty should never compromise style. Founded with a vision to empower modern women, our collections merge traditional grace with contemporary aesthetics.
            </p>
            <p>
              Every thread, every stitch is a testament to our commitment to premium quality. From our meticulously crafted Armani Velvet Mukenas to our effortlessly chic Viscose Hijabs, we deliver comfort wrapped in absolute elegance.
            </p>
            <p style={{ marginTop: '20px', fontWeight: '600' }}>
              Welcome to the new era of modest fashion.
            </p>
          </div>
          <div className="about-image-wrapper reveal-right delay-200">
            <img src={aboutImage} alt="Vuyama Model Elegance" />
          </div>
        </div>
      </section>

      {/* Collections Session */}
      <section id="collections" className="section">
        <div className="section-header reveal-left">
          <div className="section-subtitle">Exquisite Series</div>
          <h2 className="section-title">The Masterpieces</h2>
        </div>

        <div className="collections-grid">
          <CollectionCarousel
            images={armaniImages}
            title="Armani Velvet"
            desc="The epitome of luxurious comfort."
            delayClass="reveal-left"
          />

          <CollectionCarousel
            images={iliyaImages}
            title="Iliya Series"
            desc="Elegance in everyday serenity."
            delayClass="reveal-right"
          />

          <CollectionCarousel
            images={laikaImages}
            title="Laika Series"
            desc="Sophisticated and timeless charm."
            delayClass="reveal-left"
          />

          <CollectionCarousel
            images={rayonImages}
            title="Rayon Viscose"
            desc="Lightweight fluidity for the modern muse."
            delayClass="reveal-right"
          />
        </div>
      </section>

      {/* Reseller Partnership Session */}
      <section id="reseller" className="reseller-section">
        <div className="reseller-content reveal-left">
          <div className="section-subtitle" style={{ color: 'var(--accent-color, #d4af37)', opacity: 1 }}>B2B Partnership</div>
          <h2 style={{ fontSize: '3rem', margin: '20px 0' }}>Join Our Success Story</h2>
          <div className="stat-number">
            <Counter target={50000} />+
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '30px', color: '#1a1a1a' }}>Active Resellers Nationwide</h3>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', opacity: 0.8, lineHeight: 1.6, color: '#444' }}>
            Empower your entrepreneurial journey by becoming an official Vuyama partner. Experience remarkable growth with our highly sought-after premium collections.
          </p>

          <div style={{ marginTop: '40px', padding: '24px', backgroundColor: 'rgba(212, 175, 55, 0.08)', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: 'var(--accent-color)' }}>
              Ready to start?
            </p>
            <p style={{ fontSize: '0.95rem', marginBottom: '24px', opacity: 0.8 }}>
              Click the button below to return to our Linktree Hub, then click our WhatsApp link to chat with the Admin team to register.
            </p>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="btn-reseller" style={{ marginTop: 0 }}>
              Go to Linktree & Chat Admin <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Lookbook Gallery Session */}
      <section id="lookbook" className="section">
        <div className="section-header reveal-right">
          <div className="section-subtitle">Visual Diary</div>
          <h2 className="section-title">The Lookbook</h2>
        </div>
        <div className="gallery-masonry reveal-left delay-200">
          <div className="gallery-item"><img src={lookbook1} alt="Vuyama Look 1" loading="lazy" /></div>
          <div className="gallery-item"><img src={lookbook3} alt="Vuyama Look 3" loading="lazy" /></div>
          <div className="gallery-item"><img src={lookbook2} alt="Vuyama Look 2" loading="lazy" /></div>
          <div className="gallery-item"><img src={lookbook4} alt="Vuyama Look 4" loading="lazy" /></div>
          <div className="gallery-item"><img src={lookbook5} alt="Vuyama Look 5" loading="lazy" /></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="profile-footer">
        <p>
          &copy; {new Date().getFullYear()} Vuyama ID. All Rights Reserved. <br /><br />
          <span style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => navigate('/')}>Return to Linktree Hub</span>
        </p>
      </footer>
    </div>
  );
}

function Counter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [started, target, duration]);

  return <span ref={elementRef}>{count.toLocaleString()}</span>;
}

// Subcomponent for the Collection Carousel
function CollectionCarousel({ images, title, desc, delayClass }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className={`collection-card ${delayClass}`}>
      <div 
        className="images-slider" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img 
            key={idx} 
            src={img.default || img} 
            alt={`${title} - ${idx}`} 
            loading="lazy" 
          />
        ))}
      </div>

      {images.length > 1 && (
        <div className="carousel-controls">
          <button onClick={prevSlide} className="carousel-btn"><ChevronLeft size={24} /></button>
          <button onClick={nextSlide} className="carousel-btn"><ChevronRight size={24} /></button>
        </div>
      )}

      <div className="collection-overlay">
        <h3 className="collection-name">{title}</h3>
        <p>{desc}</p>

        {images.length > 1 && (
          <div className="carousel-dots">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
