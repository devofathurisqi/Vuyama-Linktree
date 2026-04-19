import { useState, useEffect } from 'react';
import { Trash2, Edit2, Check, X, ShieldAlert, PlusCircle, LogOut } from 'lucide-react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');

  useEffect(() => {
    // Check session demo
    const session = localStorage.getItem('vuyama_admin');
    if (session === 'true') setIsLoggedIn(true);

    if (isLoggedIn) fetchLinks();
  }, [isLoggedIn]);

  const fetchLinks = () => {
    fetch('/api/links')
      .then(res => res.json())
      .then(data => setLinks(data))
      .catch(err => console.error(err));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === import.meta.env.VITE_ADMIN_USER && password === import.meta.env.VITE_ADMIN_PASS) {
      localStorage.setItem('vuyama_admin', 'true');
      setIsLoggedIn(true);
    } else {
      alert('Kredensial salah!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vuyama_admin');
    setIsLoggedIn(false);
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url, isActive: true })
      });
      if (res.ok) {
        setTitle('');
        setUrl('');
        fetchLinks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus tautan ini?')) return;
    try {
      await fetch(`/api/links/${id}`, { method: 'DELETE' });
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (link) => {
    try {
      await fetch(`/api/links/${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...link, isActive: !link.isActive })
      });
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (link) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  const saveEdit = async (link) => {
    try {
      await fetch(`/api/links/${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...link, title: editTitle, url: editUrl })
      });
      setEditingId(null);
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ maxWidth: '400px', marginTop: '10vh' }}>
        <div className="admin-card text-center">
          <ShieldAlert size={48} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
          <h2 className="title">Admin Login</h2>
          <p className="subtitle">Masuk untuk mengelola tautan Vuyama</p>

          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-header">
        <div>
          <h1 className="title">Dashboard Vuyama</h1>
          <p className="subtitle" style={{ marginBottom: 0 }}>Kelola tautan publik Anda di sini.</p>
        </div>
        <button className="btn" onClick={handleLogout} style={{ background: '#f1f2f6', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={16} /> Keluar
        </button>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: '16px' }}>Tambah Tautan Baru</h3>
        <form onSubmit={handleAddLink} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Judul (ex: Shopee Vuyama)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input
              type="url"
              className="form-control"
              placeholder="https://..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <PlusCircle size={18} /> Tambah
          </button>
        </form>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px' }}>Daftar Tautan ({links.length})</h3>
        {links.length === 0 ? (
          <p className="text-muted">Belum ada tautan ditambahkan.</p>
        ) : (
          links.map(link => (
            <div key={link.id} className="link-list-item">
              {editingId === link.id ? (
                <div style={{ display: 'flex', gap: '10px', flex: 1, marginRight: '16px' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                  />
                  <input
                    type="url"
                    className="form-control"
                    value={editUrl}
                    onChange={e => setEditUrl(e.target.value)}
                  />
                </div>
              ) : (
                <div className="link-info">
                  <span className="link-title">{link.title}</span>
                  <span className="link-url">{link.url}</span>
                  <div style={{ marginTop: '6px' }}>
                    <span
                      className={`badge ${link.isActive ? 'active' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleToggleActive(link)}
                    >
                      {link.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>
              )}

              <div className="link-actions">
                {editingId === link.id ? (
                  <>
                    <button className="btn-icon" onClick={() => saveEdit(link)} title="Simpan">
                      <Check size={18} color="#10b981" />
                    </button>
                    <button className="btn-icon" onClick={() => setEditingId(null)} title="Batal">
                      <X size={18} color="#ff4757" />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-icon" onClick={() => startEdit(link)} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="btn-icon" onClick={() => handleDelete(link.id)} title="Hapus">
                      <Trash2 size={18} color="#ff4757" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <a href="/" target="_blank" className="btn" style={{ background: 'var(--accent-color)' }}>
          Lihat Halaman Publik
        </a>
      </div>
    </div>
  );
}
