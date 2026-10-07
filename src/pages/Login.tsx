import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, Globe } from 'lucide-react';
import { HeroSection } from '../components/chat/HeroSection';
import { TermsModal } from '../components/modals/TermsModal';
import './Login.css';

export const Login: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'terms' | 'privacy'>('terms');

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in with Google');
    }
  };

  return (
    <div className="login-container">
      
      {/* Floating Background Words */}
      <div className="floating-bg-words">
        <span className="float-word word-1">Algorithms</span>
        <span className="float-word word-2">Thermodynamics</span>
        <span className="float-word word-3">Machine Learning</span>
        <span className="float-word word-4">Data Structures</span>
        <span className="float-word word-5">Quantum Physics</span>
        <span className="float-word word-6">Robotics</span>
        <span className="float-word word-7">Calculus</span>
        <span className="float-word word-8">Fluid Mechanics</span>
        <span className="float-word word-9">Neural Networks</span>
        <span className="float-word word-10">Aerodynamics</span>
        <span className="float-word word-11">Cryptography</span>
        <span className="float-word word-12">Linear Algebra</span>
        <span className="float-word word-13">System Design</span>
        <span className="float-word word-14">Electromagnetics</span>
        <span className="float-word word-15">Kinetics</span>
        <span className="float-word word-16">Deep Learning</span>
        <span className="float-word word-17">Mathematics</span>
        <span className="float-word word-18">Innovation</span>
      </div>

      <div className="login-content fade-in">
        <HeroSection />
        
        <div className="login-action-area slide-up-fade delay-500">
          <hr className="login-divider" />
          <p className="login-prompt-text">Sign In To Start Your Engineering Journey 🚀</p>
          <button className="google-login-btn" onClick={handleGoogleLogin}>
            <svg className="google-icon" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <p className="login-terms-text">
            By continuing, you agree to our<br/>
            <a href="#" onClick={(e) => { e.preventDefault(); setModalType('terms'); setModalOpen(true); }}>Terms of Service</a> and <a href="#" onClick={(e) => { e.preventDefault(); setModalType('privacy'); setModalOpen(true); }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
      
      <div className="login-footer">
        <p>
          Designed & Built with <Heart size={14} color="#ef4444" fill="#ef4444" style={{ margin: '0 4px' }} /> by <span>Anshuman Kumar</span>
        </p>
        <div className="login-socials">
          <a href="https://github.com/anhsumankumar" target="_blank" rel="noreferrer" className="social-link" title="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </a>
          <a href="https://anshumansprotfolio.netlify.app/" target="_blank" rel="noreferrer" className="social-link" title="Portfolio">
            <Globe size={18} />
          </a>
          <a href="https://www.instagram.com/anshumankumar0007/" target="_blank" rel="noreferrer" className="social-link" title="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </div>

      <TermsModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        type={modalType} 
      />
    </div>
  );
};
