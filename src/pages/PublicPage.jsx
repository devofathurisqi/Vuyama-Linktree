import { useState, useEffect } from 'react';
import { ExternalLink, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';


export default function PublicPage() {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .eq('isActive', true)
          .order('orderIndex', { ascending: true })
          .order('id', { ascending: false });

        if (error) throw error;
        setLinks(data || []);
      } catch (err) {
        console.error('Error fetching links:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLinks();
  }, []);

  return (
    <div className="container">
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <img
          src="/vuyama-profile.svg"
          alt="Vuyama"
          className="profile-img"
        />
        <h1 className="title">Vuyama ID</h1>
        <p className="subtitle">
          Curated Mukena & Hijab for the Modern Woman<br />
          <span className="brand-gold">Grace. Confidence. You.</span>
        </p>

        <button 
          onClick={() => navigate('/profile')} 
          style={{
            background: 'var(--text-main)',
            color: 'var(--accent-color)',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '30px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '10px',
            marginBottom: '20px',
            transition: 'all 0.3s',
            boxShadow: 'var(--shadow-sm)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          Discover Our Story ✨
        </button>
      </div>

      <div className="links-container">
        {loading ? (
          <p className="text-center" style={{ color: 'var(--text-muted)' }}>Memuat tautan...</p>
        ) : links.length > 0 ? (
          links.map(link => (
            <a
              key={link.id}
              href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-card"
            >
              <span>{link.title}</span>
              <ExternalLink size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '20px', opacity: 0.5 }} />
            </a>
          ))
        ) : (
          <p className="text-center" style={{ color: 'var(--text-muted)' }}>Belum ada tautan yang tersedia.</p>
        )}
      </div>

      <div className="text-center" style={{ marginTop: '50px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>Powered by Vuyama IT</p>
        <a href="/admin" title="Admin Login" style={{ display: 'inline-block', marginTop: '12px', color: 'var(--text-muted)', opacity: 0.3, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 0.8} onMouseLeave={e => e.currentTarget.style.opacity = 0.3}>
          <Lock size={16} />
        </a>
      </div>
    </div>
  );
}
