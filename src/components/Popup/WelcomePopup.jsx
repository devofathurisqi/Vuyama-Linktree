import { X } from 'lucide-react';
import './WelcomePopup.css';

export default function WelcomePopup({ open, onClose, config }) {
    if (!open) return null;

    const defaultConfig = {
        title: "Welcome to VUYAMA",
        description: "Waspada Penipuan!! Harap Hubungi Admin Resmi Berikut:",
        admins: [
            { name: "CS Putri", number: "0858-8245-0652" },
            { name: "CS Renita", number: "0853-3909-5119" },
            { name: "CS Alya", number: "0821-1329-450" },
            { name: "Vumin - AI Bot assistant", number: "0856-9406-0878" }
        ]
    };

    const finalConfig = {
        title: config?.title || defaultConfig.title,
        description: config?.description || defaultConfig.description,
        admins: config?.admins && config.admins.length > 0 ? config.admins : defaultConfig.admins,
        bankAccounts: config?.bankAccounts && config.bankAccounts.length > 0 ? config.bankAccounts : [
            { bankName: "BCA", accountNumber: "167-160453-4", holderName: "Pramesthy Kaulaswara Annur" },
            { bankName: "BRI", accountNumber: "2221-01010648-50-1", holderName: "Pramesthy Kaulaswara Annur" }
        ]
    };

    function formatWhatsAppNumber(phone) {
        if (!phone) return "";
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.substring(1);
        }
        return cleaned;
    }

    const message = encodeURIComponent(
        "Halo ka! syarat jadi reseller apa saja ya?"
    );

    return (
        <div className="popup-overlay">
            <div className="popup-card">

                {/* CLOSE BUTTON */}
                <button
                    className="popup-close"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                {/* CONTENT */}
                <div className="popup-content">

                    <h2 className="popup-title">
                        {finalConfig.title}
                    </h2>

                    <p className="popup-description">
                        {finalConfig.description}
                    </p>

                    <div className="popup-admin-list">
                        {finalConfig.admins.map((admin, idx) => {
                            const cleanNumber = formatWhatsAppNumber(admin.number);
                            return (
                                <a
                                    key={idx}
                                    href={`https://wa.me/${cleanNumber}?text=${message}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="popup-admin-card"
                                >
                                    <div>
                                        <p className="popup-admin-name">{admin.name}</p>
                                        <p className="popup-admin-number">{admin.number}</p>
                                    </div>

                                    <span className="popup-admin-action">
                                        Chat →
                                    </span>
                                </a>
                            );
                        })}
                    </div>

                    {finalConfig.bankAccounts && finalConfig.bankAccounts.length > 0 && (
                        <div className="popup-bank-section" style={{ marginTop: '20px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '15px', marginBottom: '20px' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-color)', letterSpacing: '0.5px', marginBottom: '8px', textAlign: 'left' }}>
                                Rekening Pembayaran Resmi VUYAMA:
                            </p>
                            {finalConfig.bankAccounts.map((bank, idx) => (
                                <div key={idx} style={{ 
                                    background: 'rgba(0, 0, 0, 0.02)', 
                                    padding: '10px 14px', 
                                    borderRadius: '12px', 
                                    fontSize: '0.85rem',
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: '6px',
                                    border: '1px solid rgba(0,0,0,0.03)'
                                }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{bank.bankName}</span>
                                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>a/n {bank.holderName}</p>
                                    </div>
                                    <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--text-main)', fontSize: '0.85rem' }}>{bank.accountNumber}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        className="popup-button"
                        onClick={onClose}
                    >
                        Continue
                    </button>

                </div>
            </div>
        </div>
    );
}