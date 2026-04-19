import { useState, useEffect } from 'react';
import { ExternalLink, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PublicPage() {
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
          Koleksi Exclusive Mukena & Kerudung Elegan.<br />
          <span className="brand-gold">Perhiasan Dunia Adalah Wanita Shalihah.</span>
        </p>
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
        <p>Powered by Devo Fathurisqi</p>
        <a href="/admin" title="Admin Login" style={{ display: 'inline-block', marginTop: '12px', color: 'var(--text-muted)', opacity: 0.3, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 0.8} onMouseLeave={e => e.currentTarget.style.opacity = 0.3}>
          <Lock size={16} />
        </a>
      </div>
    </div>
  );
}
