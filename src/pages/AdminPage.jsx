import { useState, useEffect } from 'react';
import { Trash2, Edit2, Check, X, ShieldAlert, PlusCircle, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

  // Welcome Popup Settings States
  const [popupTitle, setPopupTitle] = useState('Welcome to VUYAMA');
  const [popupDesc, setPopupDesc] = useState('Waspada Penipuan!! Harap Hubungi Admin Resmi Berikut:');
  const [popupAdmins, setPopupAdmins] = useState([
    { name: 'CS Putri', number: '0858-8245-0652' },
    { name: 'CS Renita', number: '0853-3909-5119' },
    { name: 'CS Alya', number: '0821-1329-450' },
    { name: 'Vumin - AI Bot assistant', number: '0856-9406-0878' }
  ]);
  const [popupBankAccounts, setPopupBankAccounts] = useState([
    { bankName: 'BCA', accountNumber: '167-160453-4', holderName: 'Pramesthy Kaulaswara Annur' },
    { bankName: 'BRI', accountNumber: '2221-01010648-50-1', holderName: 'Pramesthy Kaulaswara Annur' }
  ]);
  const [popupRecordId, setPopupRecordId] = useState(null);
  const [isSavingPopup, setIsSavingPopup] = useState(false);

  useEffect(() => {
    // Set dynamic page title
    document.title = "VUYAMA - Admin Dashboard";

    // Check session demo
    const session = localStorage.getItem('vuyama_admin');
    if (session === 'true') setIsLoggedIn(true);

    if (isLoggedIn) {
      fetchLinks();
      fetchPopupSettings();
    }
  }, [isLoggedIn]);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('orderIndex', { ascending: true })
        .order('id', { ascending: false });
      if (error) throw error;
      // Filter out the popup settings special row
      setLinks((data || []).filter(link => link.title !== '__popup_settings__'));
    } catch (err) {
      console.error('Error fetching links:', err);
    }
  };

  const fetchPopupSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('title', '__popup_settings__')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPopupRecordId(data.id);
        if (data.url) {
          try {
            const config = JSON.parse(data.url);
            setPopupTitle(config.title || 'Welcome to VUYAMA');
            setPopupDesc(config.description || 'Waspada Penipuan!! Harap Hubungi Admin Resmi Berikut:');
            setPopupAdmins(config.admins || []);
            setPopupBankAccounts(config.bankAccounts || [
              { bankName: 'BCA', accountNumber: '167-160453-4', holderName: 'Pramesthy Kaulaswara Annur' },
              { bankName: 'BRI', accountNumber: '2221-01010648-50-1', holderName: 'Pramesthy Kaulaswara Annur' }
            ]);
          } catch (e) {
            console.error("Failed to parse existing popup configuration:", e);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching popup settings:', err);
    }
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
      const { error } = await supabase
        .from('links')
        .insert([{ title, url, isActive: true }]);
      if (error) throw error;
      setTitle('');
      setUrl('');
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus tautan ini?')) return;
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (link) => {
    try {
      const { error } = await supabase
        .from('links')
        .update({ isActive: !link.isActive })
        .eq('id', link.id);
      if (error) throw error;
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
      const { error } = await supabase
        .from('links')
        .update({ title: editTitle, url: editUrl })
        .eq('id', link.id);
      if (error) throw error;
      setEditingId(null);
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  };

  // Popup Management Handlers
  const handleAddAdminRow = () => {
    setPopupAdmins([...popupAdmins, { name: '', number: '' }]);
  };

  const handleRemoveAdminRow = (index) => {
    const updated = [...popupAdmins];
    updated.splice(index, 1);
    setPopupAdmins(updated);
  };

  const handleUpdateAdminRow = (index, field, value) => {
    const updated = [...popupAdmins];
    updated[index][field] = value;
    setPopupAdmins(updated);
  };

  const handleAddBankRow = () => {
    setPopupBankAccounts([...popupBankAccounts, { bankName: '', accountNumber: '', holderName: '' }]);
  };

  const handleRemoveBankRow = (index) => {
    const updated = [...popupBankAccounts];
    updated.splice(index, 1);
    setPopupBankAccounts(updated);
  };

  const handleUpdateBankRow = (index, field, value) => {
    const updated = [...popupBankAccounts];
    updated[index][field] = value;
    setPopupBankAccounts(updated);
  };

  const handleSavePopupSettings = async (e) => {
    e.preventDefault();
    setIsSavingPopup(true);
    try {
      const newConfig = {
        title: popupTitle,
        description: popupDesc,
        admins: popupAdmins.filter(admin => admin.name.trim() !== '' && admin.number.trim() !== ''),
        bankAccounts: popupBankAccounts.filter(acc => acc.bankName.trim() !== '' && acc.accountNumber.trim() !== '')
      };

      if (popupRecordId) {
        const { error } = await supabase
          .from('links')
          .update({ url: JSON.stringify(newConfig), isActive: false })
          .eq('id', popupRecordId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('links')
          .insert([{ title: '__popup_settings__', url: JSON.stringify(newConfig), isActive: false, orderIndex: 9999 }])
          .select()
          .single();
        if (error) throw error;
        if (data) setPopupRecordId(data.id);
      }
      alert('Pengaturan popup berhasil disimpan!');
    } catch (err) {
      console.error('Error saving popup settings:', err);
      alert('Gagal menyimpan pengaturan popup: ' + err.message);
    } finally {
      setIsSavingPopup(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ maxWidth: '400px', marginTop: '10vh' }}>
        <div className="admin-card text-center">
          <ShieldAlert size={48} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
          <h2 className="title">Admin Login</h2>
          <p className="subtitle">Masuk untuk mengelola tautan VUYAMA</p>

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
          <h1 className="title" style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>DASHBOARD VUYAMA</h1>
          <p className="subtitle" style={{ marginBottom: 0 }}>Kelola tautan dan pengaturan popup publik Anda di sini.</p>
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
              placeholder="Judul (ex: Shopee VUYAMA)"
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

      {/* Welcome Popup Editor Panel */}
      <div className="admin-card">
        <h3 style={{ marginBottom: '16px' }}>Kelola Welcome Popup</h3>
        <p className="subtitle" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
          Gunakan panel ini untuk mengedit judul, deskripsi, dan daftar admin yang muncul di popup selamat datang.
        </p>
        <form onSubmit={handleSavePopupSettings}>
          <div className="form-group">
            <label>Judul Popup</label>
            <input
              type="text"
              className="form-control"
              value={popupTitle}
              onChange={e => setPopupTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Deskripsi Popup</label>
            <textarea
              className="form-control"
              value={popupDesc}
              onChange={e => setPopupDesc(e.target.value)}
              rows={3}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
              required
            />
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Daftar Kontak Admin (CS)</span>
              <button
                type="button"
                className="btn"
                style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={handleAddAdminRow}
              >
                <PlusCircle size={12} /> Tambah Admin
              </button>
            </label>

            {popupAdmins.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>Belum ada admin ditambahkan. Popup akan menggunakan daftar default.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {popupAdmins.map((admin, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama (contoh: CS Putri)"
                      value={admin.name}
                      onChange={e => handleUpdateAdminRow(idx, 'name', e.target.value)}
                      style={{ flex: 1 }}
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nomor WA (contoh: 0858-8245-0652)"
                      value={admin.number}
                      onChange={e => handleUpdateAdminRow(idx, 'number', e.target.value)}
                      style={{ flex: 1 }}
                      required
                    />
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => handleRemoveAdminRow(idx)}
                      title="Hapus Admin"
                      style={{ padding: '10px' }}
                    >
                      <Trash2 size={16} color="#ff4757" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Daftar Rekening Bank Resmi (Untuk Anti-Scam)</span>
              <button
                type="button"
                className="btn"
                style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={handleAddBankRow}
              >
                <PlusCircle size={12} /> Tambah Rekening
              </button>
            </label>

            {popupBankAccounts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>Belum ada rekening ditambahkan.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {popupBankAccounts.map((acc, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Bank (e.g. BCA)"
                      value={acc.bankName}
                      onChange={e => handleUpdateBankRow(idx, 'bankName', e.target.value)}
                      style={{ width: '100px' }}
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nomor Rekening (e.g. 7725450878)"
                      value={acc.accountNumber}
                      onChange={e => handleUpdateBankRow(idx, 'accountNumber', e.target.value)}
                      style={{ flex: 1.5 }}
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Atas Nama (e.g. VUYAMA OFFICIAL)"
                      value={acc.holderName}
                      onChange={e => handleUpdateBankRow(idx, 'holderName', e.target.value)}
                      style={{ flex: 1.5 }}
                      required
                    />
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => handleRemoveBankRow(idx)}
                      title="Hapus Rekening"
                      style={{ padding: '10px' }}
                    >
                      <Trash2 size={16} color="#ff4757" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn"
            style={{ width: '100%', marginTop: '20px', background: 'var(--accent-color)', color: 'white' }}
            disabled={isSavingPopup}
          >
            {isSavingPopup ? 'Menyimpan...' : 'Simpan Pengaturan Popup'}
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

