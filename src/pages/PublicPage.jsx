import { useState, useEffect } from 'react';
import { ExternalLink, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import WelcomePopup from '../components/Popup/WelcomePopup';

export default function PublicPage() {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(true);
  const [popupConfig, setPopupConfig] = useState(null);

  // Anti-Scam verification states
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null); // 'official_admin', 'official_bank', 'scam'
  const [verifiedName, setVerifiedName] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    const input = verifyInput.replace(/\D/g, '').trim(); // Remove non-digits
    if (!input) {
      setVerifyResult(null);
      return;
    }

    const defaultCS = [
      { name: "CS Putri", number: "085882450652" },
      { name: "CS Renita", number: "085339095119" },
      { name: "CS Alya", number: "082113294501" },
      { name: "Vumin - AI Bot assistant", number: "085694060878" }
    ];

    const defaultBanks = [
      { bankName: "BCA", accountNumber: "167-160453-4", holderName: "Pramesthy Kaulaswara Annur" },
      { bankName: "BRI", accountNumber: "2221-01010648-50-1", holderName: "Pramesthy Kaulaswara Annur" }
    ];

    const admins = popupConfig?.admins || defaultCS;
    const banks = popupConfig?.bankAccounts || defaultBanks;

    // Check official admins
    const matchedAdmin = admins.find(admin => {
      const cleanAdminNum = admin.number.replace(/\D/g, '');
      const cleanInput = input.startsWith('0') ? '62' + input.substring(1) : input;
      const cleanAdmin = cleanAdminNum.startsWith('0') ? '62' + cleanAdminNum.substring(1) : cleanAdminNum;
      return cleanInput === cleanAdmin;
    });

    if (matchedAdmin) {
      setVerifyResult('official_admin');
      setVerifiedName(matchedAdmin.name);
      return;
    }

    // Check official bank accounts
    const matchedBank = banks.find(bank => {
      const cleanBankNum = bank.accountNumber.replace(/\D/g, '');
      return input === cleanBankNum;
    });

    if (matchedBank) {
      setVerifyResult('official_bank');
      setVerifiedName(`${matchedBank.bankName} - a/n ${matchedBank.holderName}`);
      return;
    }

    setVerifyResult('scam');
  };

  useEffect(() => {
    // Dynamically set page title to match VUYAMA branding
    document.title = "VUYAMA";

    async function fetchData() {
      try {
        // Fetch active links
        const { data: linksData, error: linksError } = await supabase
          .from('links')
          .select('*')
          .eq('isActive', true)
          .order('orderIndex', { ascending: true })
          .order('id', { ascending: false });

        if (linksError) throw linksError;
        // Filter out any potential settings row from normal links list
        setLinks((linksData || []).filter(link => link.title !== '__popup_settings__'));

        // Fetch welcome popup settings
        const { data: popupData, error: popupError } = await supabase
          .from('links')
          .select('*')
          .eq('title', '__popup_settings__')
          .maybeSingle();

        if (popupData && popupData.url) {
          try {
            const config = JSON.parse(popupData.url);
            setPopupConfig(config);
          } catch (e) {
            console.error('Error parsing popup settings JSON:', e);
          }
        }
      } catch (err) {
        console.error('Error fetching links or popup config:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container">
      <WelcomePopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        config={popupConfig}
      />
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <img
          src="/vuyama-profile.svg"
          alt="VUYAMA"
          className="profile-img"
        />
        <h1 className="title" style={{ letterSpacing: '4px', textTransform: 'uppercase', fontWeight: '700', marginTop: '15px' }}>
          VUYAMA
        </h1>
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

      {/* Anti-Scam Verification Tool */}
      <div className="link-card" style={{ 
        flexDirection: 'column', 
        alignItems: 'stretch', 
        justifyContent: 'center', 
        cursor: 'default',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid var(--border-color)',
        padding: '24px',
        marginTop: '32px'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'none'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
      >
        <h4 style={{ 
          fontSize: '0.9rem', 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          textAlign: 'center',
          marginBottom: '10px',
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          🛡️ Verifikasi Admin & Rekening Resmi
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '16px', lineHeight: 1.4 }}>
          Hindari penipuan. Masukkan nomor WhatsApp admin (e.g. 0856...) atau nomor rekening bank untuk memeriksa keasliannya.
        </p>

        <form onSubmit={handleVerify} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Masukkan nomor WA atau rekening..."
            value={verifyInput}
            onChange={e => {
              setVerifyInput(e.target.value);
              setVerifyResult(null);
            }}
            style={{ fontSize: '0.85rem', padding: '10px 14px' }}
            required
          />
          <button type="submit" className="btn" style={{ fontSize: '0.8rem', padding: '10px 16px', whiteSpace: 'nowrap' }}>
            Periksa
          </button>
        </form>

        {verifyResult && (
          <div style={{ 
            marginTop: '16px', 
            fontSize: '0.8rem', 
            textAlign: 'center',
            fontWeight: '600',
            border: '1px solid transparent'
          }}>
            {verifyResult === 'official_admin' && (
              <div style={{ color: '#10b981', background: '#e3fcef', border: '1px solid #a7f3d0', padding: '10px', borderRadius: '8px' }}>
                🟢 CS Resmi Terdaftar: {verifiedName}
              </div>
            )}
            {verifyResult === 'official_bank' && (
              <div style={{ color: '#10b981', background: '#e3fcef', border: '1px solid #a7f3d0', padding: '10px', borderRadius: '8px' }}>
                🟢 Rekening Resmi VUYAMA: {verifiedName}
              </div>
            )}
            {verifyResult === 'scam' && (
              <div style={{ color: '#ef4444', background: '#fee2e2', border: '1px solid #fca5a5', padding: '10px', borderRadius: '8px' }}>
                🚨 WASPADA PENIPUAN! Rekening/Nomor tidak terdaftar sebagai perwakilan resmi VUYAMA.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-center" style={{ marginTop: '50px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>Beware of scammers</p>
        <p style={{ marginTop: '10px' }}>Powered by VUYAMA IT</p>
        <a href="/admin" title="Admin Login" style={{ display: 'inline-block', marginTop: '12px', color: 'var(--text-muted)', opacity: 0.3, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 0.8} onMouseLeave={e => e.currentTarget.style.opacity = 0.3}>
          <Lock size={16} />
        </a>
      </div>
    </div>
  );
}

