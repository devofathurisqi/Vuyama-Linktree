import { X } from 'lucide-react';
import './WelcomePopup.css';

export default function WelcomePopup({ open, onClose }) {
    if (!open) return null;

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
                        Welcome to Vuyama
                    </h2>

                    <p className="popup-description">
                        Waspada Penipuan!! Harap Hubungi Admin Resmi Berikut:
                    </p>

                    <div className="popup-admin-list">

                        <a
                            href={`https://wa.me/6285882450652?text=${message}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="popup-admin-card"
                        >
                            <div>
                                <p className="popup-admin-name">CS Putri</p>
                                <p className="popup-admin-number">0858-8245-0652</p>
                            </div>

                            <span className="popup-admin-action">
                                Chat →
                            </span>
                        </a>

                        <a
                            href={`https://wa.me/6285339095119?text=${message}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="popup-admin-card"
                        >
                            <div>
                                <p className="popup-admin-name">CS Renita</p>
                                <p className="popup-admin-number">0853-3909-5119</p>
                            </div>

                            <span className="popup-admin-action">
                                Chat →
                            </span>
                        </a>

                        <a
                            href={`https://wa.me/6282113294501?text=${message}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="popup-admin-card"
                        >
                            <div>
                                <p className="popup-admin-name">CS Alya</p>
                                <p className="popup-admin-number">0821-1329-4501</p>
                            </div>

                            <span className="popup-admin-action">
                                Chat →
                            </span>
                        </a>

                    </div>

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
