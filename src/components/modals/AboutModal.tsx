import React from 'react';
import { X, Info, Globe, Heart } from 'lucide-react';
import './ContextManager.css'; // Reusing the modal CSS

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal-content scale-in" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(26, 115, 232, 0.1)', borderRadius: '8px', color: '#1a73e8' }}>
              <Info size={20} />
            </div>
            <h2>About ATOM</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ textAlign: 'center', paddingTop: '12px' }}>
            <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '80px', height: '80px', borderRadius: '24px', background: 'var(--card-blue)', color: 'var(--primary-accent)', marginBottom: '16px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '40px', height: '40px' }}>
                <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4" fill="transparent" />
                <circle cx="6" cy="6" r="2" fill="currentColor"/>
                <circle cx="18" cy="18" r="2" fill="currentColor"/>
                <circle cx="18" cy="6" r="2" fill="currentColor"/>
                <path d="M6 6L12 12M18 6L12 12M18 18L12 12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
              ATOM v2.0
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 12px 0', textAlign: 'center' }}>
              <strong>ATOM</strong> is an advanced, ultra-premium AI companion designed specifically for engineers. It leverages cutting-edge reasoning and deep engineering context to help you build, debug, and learn with ultimate productivity.
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, textAlign: 'center', opacity: 0.9 }}>
              <em>ATOM ek next-generation AI assistant hai jo specifically engineers aur developers ke liye banaya gaya hai. Chahe complex code debug karna ho ya naye concepts sikhna, ATOM hamesha aapke deep engineering context ke saath ready hai!</em>
            </p>
          </div>

          <div style={{ 
            background: 'var(--bg-color)', 
            padding: '20px', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Designed & Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> by
            </p>
            <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Anshuman Kumar
            </h4>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <a href="https://github.com/anhsumankumar" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--text-primary)', color: 'var(--bg-color)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </a>
              <a href="https://anshumansprotfolio.netlify.app/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-accent)', color: 'white', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <Globe size={20} />
              </a>
              <a href="https://www.instagram.com/anshumankumar0007/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
