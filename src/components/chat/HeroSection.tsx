import React from 'react';
import { Smile } from 'lucide-react';
import './HeroSection.css';

export const HeroSection: React.FC = () => {
  return (
    <div className="hero-section">
      <div className="slide-up-fade">
        <h1 className="hero-main-title">Hello!</h1>
      </div>
      
      <div className="hero-subtitle slide-up-fade delay-100">
        <span className="im-text">I'm</span>
        <span className="atom-text">ATOM</span>
      </div>
      
      <div className="highlighted-text slide-up-fade delay-200">
        Your Engineering Study Companion
      </div>
      
      <div className="actions-text slide-up-fade delay-300">
        Ask · Learn · Solve · Explore
      </div>

      {/* Decorative Elements */}
      <svg className="doodle doodle-atom float-animation delay-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)"/>
      </svg>
      
      <div className="doodle doodle-text-blue float-animation delay-400">
        Same<br/>
        Curiosity<br/>
        Bigger<br/>
        <span style={{ textDecoration: 'underline' }}>Possibilities</span>
      </div>

      <div className="doodle doodle-text-black float-animation delay-500">
        "Good<br/>
        Engineers<br/>
        Build<br/>
        a Better<br/>
        <span className="tomorrow-highlight" style={{ whiteSpace: 'nowrap' }}>
          Tomorrow"
          <span style={{ position: 'absolute', top: '0px', right: '-34px', transform: 'rotate(5deg)', color: '#F5BE18' }}><Smile size={24} strokeWidth={2.5} /></span>
        </span>
      </div>
    </div>
  );
};
