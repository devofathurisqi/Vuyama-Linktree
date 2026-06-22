import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import './Profile.css';
import ProfileSkeleton from '../components/Skeleton/ProfileSkeleton';

// Importing assets dynamically for Carousels
const armaniImages = Object.values(import.meta.glob('../assets/profile_assets/series_instagram_product/armani_velvet_series/*.{png,jpg,jpeg}', { eager: true }));
const iliyaImages = Object.values(import.meta.glob('../assets/profile_assets/series_instagram_product/iliya_series/*.{png,jpg,jpeg}', { eager: true }));
const laikaImages = Object.values(import.meta.glob('../assets/profile_assets/series_instagram_product/laika_series/*.{png,jpg,jpeg}', { eager: true }));
const rayonImages = Object.values(import.meta.glob('../assets/profile_assets/series_instagram_product/rayon_viscose_series/*.{png,jpg,jpeg}', { eager: true }));

import aboutImage from '../assets/profile_assets/series_instagram_models/Photos/Model5.png';

import lookbook1 from '../assets/profile_assets/series_instagram_models/Photos/Model1.png';
import lookbook2 from '../assets/profile_assets/series_instagram_models/Photos/Model2.png';
import lookbook3 from '../assets/profile_assets/series_instagram_models/Photos/Model3.png';
import lookbook4 from '../assets/profile_assets/series_instagram_models/Photos/Model4.png';
import lookbook5 from '../assets/profile_assets/series_instagram_models/Photos/Model5.png';

// Premium Hero Images Array
const heroImages = [lookbook1, lookbook2, lookbook3, lookbook4];

export default function CompanyProfilePage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [preloaderActive, setPreloaderActive] = useState(true);
  
  // Ambient Audio State
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  // Reseller Lead Form States
  const [formStep, setFormStep] = useState(1);
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPackage, setFormPackage] = useState('Agen Resmi');
  const [formWA, setFormWA] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // ROI Calculator States
  const [targetVolume, setTargetVolume] = useState(120);
  const [heroActive, setHeroActive] = useState(false);

  // Loading Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Snappy initial loading
    return () => clearTimeout(timer);
  }, []);

  // Preloader fading timer & Hero animation trigger
  useEffect(() => {
    if (!isLoading) {
      const preloaderTimer = setTimeout(() => {
        setPreloaderActive(false);
      }, 2000); // 2 seconds total preloader feel

      const heroTimer = setTimeout(() => {
        setHeroActive(true);
      }, 2100); // Trigger right after preloader slides up

      return () => {
        clearTimeout(preloaderTimer);
        clearTimeout(heroTimer);
      };
    }
  }, [isLoading]);

  // Scroll detection & Intersection Observer for Reveal Animations
  useEffect(() => {
    document.title = "VUYAMA | Our Narrative";

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Setup intersection observer for elements revealing from side/bottom
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
  }, [isLoading]);

  // Image Carousel Timer for Hero
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Smooth change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Audio Playback Toggle
  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false); // Close mobile menu when navigating
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Form Step Navigation
  const handleFormNext = (e) => {
    e.preventDefault();
    if (formStep < 3) {
      setFormStep(formStep + 1);
    } else {
      setFormSubmitted(true);
    }
  };

  const handleFormBack = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
  };

  const handleRedirectWA = () => {
    const text = encodeURIComponent(
      `Halo VUYAMA! Saya ${formName} dari ${formCity} ingin bergabung kemitraan sebagai [${formPackage}]. Saya telah mengisi form kemitraan di website.`
    );
    window.open(`https://wa.me/6285882450652?text=${text}`, '_blank');
  };

  // Profit Margins Calculator Calculations
  const averagePrice = 250000; // Rp 250,000 average price per Mukena/Hijab item
  let discountRate = 0.35; // 35% for Agen Resmi
  if (formPackage === 'Reseller Starter') discountRate = 0.20;
  if (formPackage === 'Distributor') discountRate = 0.45;

  const calculatedRevenue = targetVolume * averagePrice;
  const calculatedProfit = calculatedRevenue * discountRate;
  const calculatedROI = formPackage === 'Reseller Starter' ? '1 Bulan' : formPackage === 'Agen Resmi' ? '2 Bulan' : '3 Bulan';

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="profile-container fade-in">
      {/* Luxury Preloader */}
      {preloaderActive && (
        <div className={`luxury-preloader ${!isLoading ? 'fade-out' : ''}`}>
          <div className="preloader-logo">VUYAMA</div>
          <div className="preloader-line"></div>
        </div>
      )}

      {/* Hidden Audio Asset */}
      <audio
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbfadf.mp3"
      />

      {/* Navbar Session */}
      <nav className={`profile-nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className="nav-brand">
          VUYAMA
        </a>

        {/* Desktop Menu */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <span className="nav-link" onClick={() => scrollToSection('about')}>Our Narrative</span>
          <span className="nav-link" onClick={() => scrollToSection('pillars')}>Pillars</span>
          <span className="nav-link" onClick={() => scrollToSection('collections')}>Collections</span>
          <span className="nav-link" onClick={() => scrollToSection('reseller')}>Partnership</span>
          <span className="nav-link" onClick={() => scrollToSection('lookbook')}>Lookbook</span>

          {/* Elegant Ambient Audio Controller */}
          <div className="audio-player-nav" onClick={toggleAudio}>
            <div className={`soundwave-visualizer ${audioPlaying ? 'playing' : ''}`}>
              <span className="soundwave-bar"></span>
              <span className="soundwave-bar"></span>
              <span className="soundwave-bar"></span>
              <span className="soundwave-bar"></span>
            </div>
            <span className="audio-label">{audioPlaying ? 'Mute' : 'Play Music'}</span>
          </div>
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
            <span className="mobile-nav-link" onClick={() => { scrollToSection('about'); }}>Our Narrative</span>
            <span className="mobile-nav-link" onClick={() => { scrollToSection('pillars'); }}>Pillars</span>
            <span className="mobile-nav-link" onClick={() => { scrollToSection('collections'); }}>Collections</span>
            <span className="mobile-nav-link" onClick={() => { scrollToSection('reseller'); }}>Partnership</span>
            <span className="mobile-nav-link" onClick={() => { scrollToSection('lookbook'); }}>Lookbook</span>
            
            {/* Mobile Audio controls */}
            <div style={{ marginTop: '20px' }}>
              <button className="btn-primary" onClick={toggleAudio} style={{ padding: '12px 24px', fontSize: '0.75rem' }}>
                {audioPlaying ? 'Mute Music' : 'Play Music ♫'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Session (Split Editorial Cover) */}
      <section id="hero" className="hero-section">
        <div className={`hero-editorial-panel ${heroActive ? 'active' : ''}`}>
          <div className="hero-issue">Issue No. 01 / Fall Autumn</div>
          <h1>
            A Symphony<br />
            of <span>Modesty</span>
          </h1>
          <p className="hero-editorial-desc">
            Redefining contemporary modest fashion with meticulously curated mukenas and hijabs, hand-finished in Bogor, Indonesia.
          </p>
          <div className="hero-quote">
            "True modesty is not about hiding; it is about revealing your grace, confidence, and internal light."
          </div>
          <div className="hero-actions">
            <button onClick={() => scrollToSection('collections')} className="btn-primary">
              Explore Collections <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className={`hero-slideshow-panel ${heroActive ? 'active' : ''}`}>
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`hero-image-bg ${idx === currentImageIdx ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="hero-overlay"></div>
        </div>
      </section>

      {/* About/Brand Story Section */}
      <section id="about" className="section collections-bg">
        <div className="about-grid">
          <div className="about-text reveal-left">
            <div className="section-subtitle">Our Heritage</div>
            <h3>Crafting Modern Elegance</h3>
            <p className="drop-cap">
              At VUYAMA, we believe that modesty and contemporary sophistication should coexist harmoniously. Founded with a clear vision to empower the modern woman, our design house merges classical grace with functional everyday elegance.
            </p>
            <p>
              Every garment we create is a testament to our obsessive attention to detail. We search globally for premium fabrics—luxurious Armani Velvet, soft breathable Rayon Viscose, and light silk voile—ensuring every stitch behaves as fluid poetry.
            </p>
            <p style={{ fontWeight: '500', color: 'var(--accent-gold)' }}>
              Step into a refined era of modest expression.
            </p>
          </div>
          <div className="about-image-wrapper reveal-right delay-200">
            <div className="about-image-frame">
              <img src={aboutImage} alt="VUYAMA Fine Craftsmanship" />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section id="pillars" className="section">
        <div className="section-header reveal-left">
          <div className="section-subtitle">Philosophy</div>
          <h2 className="section-title">The VUYAMA Pillars</h2>
        </div>

        <div className="pillars-grid reveal-left delay-200">
          <div className="pillar-card">
            <div className="pillar-num">I.</div>
            <h4 className="pillar-title">Premium Craftsmanship</h4>
            <p className="pillar-desc">
              Every seam is reinforced, and every drape is calculated. We use high-grade silk-blend velvets and heavy-drape viscose to build garments that stand the test of time.
            </p>
          </div>
          <div className="pillar-card">
            <div className="pillar-num">II.</div>
            <h4 className="pillar-title">Effortless Comfort</h4>
            <p className="pillar-desc">
              Modesty should feel like a second skin. Our fabrics are selected for maximum breathability, lightweight fluid movements, and comfortable wear throughout the active day.
            </p>
          </div>
          <div className="pillar-card">
            <div className="pillar-num">III.</div>
            <h4 className="pillar-title">Empathetic Sisterhood</h4>
            <p className="pillar-desc">
              We empower local and national entrepreneurs. Through our B2B network, we provide marketing kits, generous margins, and a support structure for over 50,000+ active partners.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="section collections-bg">
        <div className="section-header reveal-left">
          <div className="section-subtitle">Exquisite Series</div>
          <h2 className="section-title">The Collections</h2>
        </div>

        <div className="collections-display-area">
          <EditorialCollectionRow
            images={armaniImages}
            title="Armani Velvet"
            desc="The epitome of luxurious indulgence. Crafted from a heavy, silk-infused velvet that catches the light with subtle, sophisticated luster. Ideal for special prayers and moments of quiet elegance."
            specs={{
              fabric: "Armani Silk-Blend Velvet",
              details: "Premium Hand-stitched Gold Lace",
              vibe: "Luxe, Substantial, Majestic",
              macroImg: lookbook1,
              softness: 95,
              thickness: 85,
              elasticity: 60
            }}
            index={0}
          />

          <EditorialCollectionRow
            images={iliyaImages}
            title="Iliya Series"
            desc="Everyday serenity wrapped in minimalist design. Features custom pastel palettes with delicate textures. Lightweight and breezy, keeping you calm and polished throughout your daily routines."
            specs={{
              fabric: "Fine Crinkle Rayon Silk",
              details: "Soft Cotton Interlining, Elastic Waist",
              vibe: "Breezy, Calm, Minimalist",
              macroImg: lookbook3,
              softness: 80,
              thickness: 40,
              elasticity: 50
            }}
            index={1}
          />

          <EditorialCollectionRow
            images={laikaImages}
            title="Laika Series"
            desc="Timeless charm with a focus on delicate floral details and clean, structured cuts. Perfect for the woman who values traditional modest elements reimagined through a clean modern styling lens."
            specs={{
              fabric: "Premium Cotton Voile",
              details: "Micro-scallop Finished Edges",
              vibe: "Timeless, Elegant, Sophisticated",
              macroImg: lookbook2,
              softness: 85,
              thickness: 50,
              elasticity: 30
            }}
            index={2}
          />

          <EditorialCollectionRow
            images={rayonImages}
            title="Rayon Viscose"
            desc="Pure fluid organic comfort. Releasing in earthy tones that flow like water, this series offers the ultimate breathing space, ensuring comfort even in warm climates without compromising on style."
            specs={{
              fabric: "100% Organic Bamboo Viscose",
              details: "Relaxed Fit, Hidden Pockets",
              vibe: "Organic, Fluid, Weightless",
              macroImg: lookbook4,
              softness: 90,
              thickness: 30,
              elasticity: 70
            }}
            index={3}
          />
        </div>
      </section>

      {/* Reseller Partnership Section */}
      <section id="reseller" className="reseller-section">
        <div className="reseller-card-cover reveal-left" style={{ maxWidth: '1100px' }}>
          <div className="reseller-header-tag">B2B Partnership Network</div>
          <div className="stat-number">50,000+</div>
          <h3 className="stat-title">Empowered Partners Nationwide</h3>
          <p className="reseller-narrative" style={{ marginBottom: '10px' }}>
            Become an official VUYAMA partner and join a supportive business ecosystem. We offer premium packaging, exclusive catalogs, and healthy markups to support your path to financial freedom.
          </p>

          {/* Interactive Form & ROI Calculator Grid */}
          <div className="reseller-interactive-grid">
            
            {/* Step-by-Step Inquiry Form */}
            <div className="partnership-form-panel">
              {!formSubmitted ? (
                <form onSubmit={handleFormNext}>
                  <div className="form-step-indicator">
                    <span>Langkah {formStep} dari 3</span>
                    <span>{formStep === 1 ? 'Data Diri' : formStep === 2 ? 'Kemitraan' : 'WhatsApp'}</span>
                  </div>

                  {formStep === 1 && (
                    <div className="fade-in">
                      <div className="form-group-editorial">
                        <label>Nama Lengkap</label>
                        <input
                          type="text"
                          className="form-control-editorial"
                          placeholder="Masukkan nama Anda..."
                          value={formName}
                          onChange={e => setFormName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group-editorial">
                        <label>Kota Domisili</label>
                        <input
                          type="text"
                          className="form-control-editorial"
                          placeholder="Masukkan kota domisili..."
                          value={formCity}
                          onChange={e => setFormCity(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {formStep === 2 && (
                    <div className="fade-in">
                      <div className="form-group-editorial">
                        <label>Pilih Tingkat Kemitraan</label>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
                          Pilih tingkat kemitraan untuk menghitung diskon Anda (hitung ROI di panel kanan).
                        </p>
                        <div className="package-select-grid">
                          <button
                            type="button"
                            className={`package-btn ${formPackage === 'Reseller Starter' ? 'active' : ''}`}
                            onClick={() => setFormPackage('Reseller Starter')}
                          >
                            Reseller (20%)
                          </button>
                          <button
                            type="button"
                            className={`package-btn ${formPackage === 'Agen Resmi' ? 'active' : ''}`}
                            onClick={() => setFormPackage('Agen Resmi')}
                          >
                            Agen (35%)
                          </button>
                          <button
                            type="button"
                            className={`package-btn ${formPackage === 'Distributor' ? 'active' : ''}`}
                            onClick={() => setFormPackage('Distributor')}
                          >
                            Distributor (45%)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {formStep === 3 && (
                    <div className="fade-in">
                      <div className="form-group-editorial">
                        <label>Nomor WhatsApp</label>
                        <input
                          type="tel"
                          className="form-control-editorial"
                          placeholder="Contoh: 0812345678..."
                          value={formWA}
                          onChange={e => setFormWA(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', marginTop: '30px', justifyContent: 'flex-end' }}>
                    {formStep > 1 && (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={handleFormBack}
                        style={{ background: 'transparent', color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
                      >
                        Kembali
                      </button>
                    )}
                    <button type="submit" className="btn-primary">
                      {formStep === 3 ? 'Kirim Pendaftaran' : 'Lanjutkan'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="fade-in text-center" style={{ padding: '20px 0' }}>
                  <div className="benefit-icon-gold" style={{ fontSize: '2.5rem', marginBottom: '15px' }}><Sparkles size={48} style={{ margin: '0 auto' }} /></div>
                  <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', marginBottom: '10px', color: 'var(--text-primary)' }}>Registrasi Berhasil!</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
                    Kualifikasi wilayah Anda disetujui. Silakan klik tombol di bawah untuk terhubung ke nomor WhatsApp CS Prioritas VUYAMA guna aktivasi akun kemitraan Anda.
                  </p>
                  <button className="btn-reseller" onClick={handleRedirectWA}>
                    Hubungi CS Kemitraan <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* ROI Margin Calculator */}
            <div className="roi-calculator-panel">
              <div>
                <h4 className="roi-title">Kalkulator Omzet & ROI</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
                  Sesuaikan slider volume penjualan untuk menghitung laba kotor, laba bersih, dan estimasi balik modal Anda secara instan.
                </p>

                <div className="roi-calc-slider-box">
                  <label>
                    <span>Target Penjualan</span>
                    <span className="gold">{targetVolume} Pcs / Bulan</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    className="editorial-slider"
                    value={targetVolume}
                    onChange={e => setTargetVolume(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="roi-results-container">
                <div className="roi-result-row">
                  <span className="roi-result-label">Tingkat Kemitraan</span>
                  <span className="roi-result-val" style={{ fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>{formPackage}</span>
                </div>
                <div className="roi-result-row">
                  <span className="roi-result-label">Proyeksi Omzet</span>
                  <span className="roi-result-val">Rp {calculatedRevenue.toLocaleString('id-ID')}</span>
                </div>
                <div className="roi-result-row">
                  <span className="roi-result-label">Margin Keuntungan</span>
                  <span className="roi-result-val">{(discountRate * 100)}%</span>
                </div>
                <div className="roi-result-row">
                  <span className="roi-result-label">Estimasi Balik Modal</span>
                  <span className="roi-result-val" style={{ fontSize: '0.95rem', fontWeight: '700' }}>{calculatedROI}</span>
                </div>
                <div className="roi-result-row">
                  <span className="roi-result-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Keuntungan Bersih</span>
                  <span className="roi-result-val highlight">Rp {calculatedProfit.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

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
          <LookbookCard img={lookbook1} title="Classic Modesty" tag="Armani Velvet" />
          <LookbookCard img={lookbook3} title="Serenity Flow" tag="Iliya Series" />
          <LookbookCard img={lookbook2} title="Modern Modesty" tag="Laika Series" />
          <LookbookCard img={lookbook4} title="Fluid Harmony" tag="Rayon Viscose" />
          <LookbookCard img={lookbook5} title="Bogor Heritage" tag="Lookbook Cover" />
        </div>
      </section>

      {/* Footer */}
      <footer className="profile-footer">
        <div className="profile-footer-logo">VUYAMA</div>
        <div className="profile-footer-divider"></div>
        <p>
          &copy; {new Date().getFullYear()} VUYAMA ID. All Rights Reserved. <br /><br />
          <span onClick={() => navigate('/')}>Return to Linktree Hub</span>
        </p>
      </footer>
    </div>
  );
}

// Subcomponent for Lookbook Cards
function LookbookCard({ img, title, tag }) {
  return (
    <div className="gallery-item">
      <div className="gallery-image-wrapper">
        <img src={img} alt={title} loading="lazy" />
      </div>
      <div className="gallery-info-overlay">
        <h4 className="gallery-title">{title}</h4>
        <span className="gallery-tag">{tag}</span>
      </div>
    </div>
  );
}

// Subcomponent for the Editorial Collection Showcase
function EditorialCollectionRow({ images, title, desc, specs, index }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const isReversed = index % 2 === 1;

  return (
    <div className={`editorial-collection-row ${isReversed ? 'reversed' : ''} reveal-left`}>
      {/* Slider Visuals */}
      <div className="collection-image-panel">
        <div 
          className="collection-slide-container" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <img 
              key={idx} 
              className="collection-slide-img"
              src={img.default || img} 
              alt={`${title} - ${idx}`} 
              loading="lazy" 
            />
          ))}
        </div>

        {images.length > 1 && (
          <div className="collection-nav-arrows">
            <button onClick={prevSlide} className="arrow-circle-btn"><ChevronLeft size={18} /></button>
            <button onClick={nextSlide} className="arrow-circle-btn"><ChevronRight size={18} /></button>
          </div>
        )}
      </div>

      {/* Editorial Content */}
      <div className="collection-text-panel">
        <div className="collection-tag">Series {index + 1}</div>
        <h3 className="collection-title">{title}</h3>
        <p className="collection-desc">{desc}</p>

        <div className="collection-specs">
          
          {/* Interactive Fabric Inspector with Hover Tooltip */}
          <div className="spec-item spec-item-interactive">
            <span className="spec-label">Fabric:</span>
            <span className="spec-val" style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: 'var(--accent-gold)', fontWeight: '600' }}>
              {specs.fabric} *
            </span>

            {/* Hover Tooltip Inspector */}
            <div className="fabric-inspector-tooltip">
              <img src={specs.macroImg} alt="Fabric Macro" className="fabric-macro-img" />
              <div className="inspector-title">{specs.fabric} Spec</div>
              <div className="inspector-meters">
                <div className="meter-row">
                  <div className="meter-info">
                    <span>Kelembutan</span>
                    <span>{specs.softness}%</span>
                  </div>
                  <div className="meter-bar-container">
                    <div className="meter-fill" style={{ '--target-width': `${specs.softness}%` }}></div>
                  </div>
                </div>
                <div className="meter-row">
                  <div className="meter-info">
                    <span>Ketebalan</span>
                    <span>{specs.thickness}%</span>
                  </div>
                  <div className="meter-bar-container">
                    <div className="meter-fill" style={{ '--target-width': `${specs.thickness}%` }}></div>
                  </div>
                </div>
                <div className="meter-row">
                  <div className="meter-info">
                    <span>Kelenturan</span>
                    <span>{specs.elasticity}%</span>
                  </div>
                  <div className="meter-bar-container">
                    <div className="meter-fill" style={{ '--target-width': `${specs.elasticity}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="spec-item">
            <span className="spec-label">Details:</span>
            <span className="spec-val">{specs.details}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Character:</span>
            <span className="spec-val">{specs.vibe}</span>
          </div>
        </div>

        {images.length > 1 && (
          <div className="collection-indicator-dots">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`indicator-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
