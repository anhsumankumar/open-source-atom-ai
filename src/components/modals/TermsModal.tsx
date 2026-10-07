import React from 'react';
import { X, Shield } from 'lucide-react';
import './ContextManager.css'; // Reusing the shared modal CSS

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay fade-in" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-content scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(245, 190, 24, 0.1)', borderRadius: '8px', color: '#F5BE18' }}>
              <Shield size={20} />
            </div>
            <h2>{type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px', paddingTop: '16px' }}>
          {type === 'terms' ? (
            <>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>1. Introduction</h3>
              <p>Welcome to ATOM. By using our engineering AI companion, you agree to these Terms of Service. ATOM is designed to assist engineers, developers, and students with complex problem-solving, code generation, and study planning.</p>
              
              <h3 style={{ color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>2. Use of Service</h3>
              <p>You agree to use ATOM for educational and professional engineering purposes. You must not use the AI to generate malicious code, violate intellectual property rights, or engage in any unlawful activities.</p>
              
              <h3 style={{ color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>3. Disclaimer</h3>
              <p>While ATOM uses advanced reasoning to provide accurate engineering context, AI-generated content can occasionally contain errors. You are responsible for verifying any code, calculations, or architectural advice before deploying it in production environments.</p>

              <h3 style={{ color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>4. Account & Access</h3>
              <p>Access to ATOM requires a Google account for authentication. We reserve the right to suspend or terminate access if we detect abusive behavior or violation of these terms.</p>
            </>
          ) : (
            <>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>1. Data Collection</h3>
              <p>We collect basic profile information (such as your name and email) via Google OAuth to authenticate your session. We also securely store your chat history and engineering context so ATOM can provide personalized assistance across sessions.</p>
              
              <h3 style={{ color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>2. How We Use Your Data</h3>
              <p>Your chat transcripts and custom context are used exclusively to improve your personal experience. We do not sell your personal data to third parties, nor do we use your private engineering data to train public AI models.</p>
              
              <h3 style={{ color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>3. Data Privacy & Security</h3>
              <p>Your data is encrypted and securely stored using modern backend architecture (Supabase). You maintain full ownership of your prompts and generated code.</p>

              <h3 style={{ color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px' }}>4. Data Deletion</h3>
              <p>You have the right to be forgotten. You can delete your entire chat history and engineering context at any time using the "Data & Privacy" settings inside the app.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
