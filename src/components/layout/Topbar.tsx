import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, Menu, Monitor, ChevronDown, Check, Zap, Eye, Code2, BrainCircuit, Box, Sparkles, LogOut } from 'lucide-react';
import { userProfile } from '../../data/mockData';
import { availableModels } from '../../data/models';
import { ThemeRope } from './ThemeRope';
import { supabase } from '../../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import './Topbar.css';

interface TopbarProps {
  session?: Session;
  toggleSidebar: () => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  isDarkTheme?: boolean;
  toggleTheme?: () => void;
  onOpenContextManager?: () => void;
  onOpenPrivacyModal?: () => void;
  onOpenAboutModal?: () => void;
  isSidebarOpen?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ session, toggleSidebar, selectedModel, onModelChange, isDarkTheme, toggleTheme, onOpenContextManager, onOpenPrivacyModal, onOpenAboutModal, isSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeCategory] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsDropdownOpen(false);
  };

  // Categories feature is temporarily removed from UI, but filtering logic remains for future use

  const filteredModels = availableModels.filter(m =>
    activeCategory === 'All' ? true : m.category.includes(activeCategory as any)
  );

  const currentModel = availableModels.find(m => m.id === selectedModel) || availableModels[0];

  const renderBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'Recommended': return <Sparkles size={12} />;
      case 'Fast': return <Zap size={12} />;
      case 'Vision': return <Eye size={12} />;
      case 'Coding': return <Code2 size={12} />;
      case 'Advanced': return <BrainCircuit size={12} />;
      case '1M Context': return <Box size={12} />;
      case 'Lightweight': return <Zap size={12} />;
      default: return null;
    }
  };
  return (
    <header className="topbar">
      <button 
        className="icon-btn sidebar-toggle-btn mobile-only" 
        onClick={toggleSidebar}
        style={{ visibility: isSidebarOpen ? 'hidden' : 'visible' }}
      >
        <Menu size={24} color="var(--text-primary)" />
      </button>
      <div className="search-container desktop-only">
        <Search size={18} color="var(--text-secondary)" />
        <input
          type="text"
          className="search-input"
          placeholder="Search notes, subjects, or ask anything..."
        />
        <span className="search-shortcut">Ctrl + K</span>
      </div>

      <div className="topbar-right">
        <div className="model-selector-wrapper" ref={dropdownRef}>
          <button
            className="model-selector-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Monitor size={16} color="var(--text-secondary)" />
            <span className="current-model-name">{currentModel?.name || 'Select Model'}</span>
            <ChevronDown size={14} color="var(--text-secondary)" />
          </button>

          {isDropdownOpen && (
            <div 
              className="model-dropdown"
              style={{ backgroundColor: isDarkTheme ? '#1a1816' : '#faf3eb', opacity: 1, zIndex: 999999 }}
            >
              <div className="model-options-list">
                {filteredModels.map(m => (
                  <button
                    key={m.id}
                    className={`model-option ${m.id === selectedModel ? 'selected' : ''}`}
                    onClick={() => handleModelSelect(m.id)}
                  >
                    <div className="model-option-main">
                      <div className="model-option-header">
                        <span className="model-name">{m.name}</span>
                        {m.badge && (
                          <span className={`model-badge badge-${m.badge.replace(/\s+/g, '-').toLowerCase()}`}>
                            {renderBadgeIcon(m.badge)} {m.badge}
                          </span>
                        )}
                      </div>
                      <div className="model-provider-cap">
                        <span className="model-provider">{m.provider}</span>
                        <span className="dot-separator">•</span>
                        <span className="model-desc">{m.description}</span>
                      </div>
                    </div>
                    {m.id === selectedModel && <Check size={16} className="check-icon" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {toggleTheme && (
          <div className="theme-rope-container" style={{ position: 'relative', width: '24px', height: '36px' }}>
            <ThemeRope toggleTheme={toggleTheme} />
          </div>
        )}

        <div className="settings-wrapper" ref={settingsRef} style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            <Settings size={20} />
          </button>
          
          {isSettingsOpen && (
            <div className="settings-dropdown fade-in" style={{ 
              position: 'absolute', top: '100%', right: 0, marginTop: '12px',
              backgroundColor: isDarkTheme ? '#1a1816' : '#ffffff',
              border: '1px solid var(--border-color)', borderRadius: '12px',
              padding: '8px', minWidth: '220px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              zIndex: 1000
            }}>
              <div style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Engineering Settings
              </div>
              
              <button style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = isDarkTheme ? '#2a2724' : '#f5f5f5'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => { setIsSettingsOpen(false); if (onOpenContextManager) onOpenContextManager(); }}>
                <Sparkles size={16} /> Custom Instructions
              </button>
              
              <button style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = isDarkTheme ? '#2a2724' : '#f5f5f5'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => { setIsSettingsOpen(false); if (onOpenPrivacyModal) onOpenPrivacyModal(); }}>
                <Box size={16} /> Data & Privacy
              </button>

              <div style={{ margin: '4px 0', borderTop: '1px solid var(--border-color)' }}></div>
              
              <button style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = isDarkTheme ? '#2a2724' : '#f5f5f5'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => { setIsSettingsOpen(false); if (onOpenAboutModal) onOpenAboutModal(); }}>
                <Sparkles size={16} /> About ATOM
              </button>
            </div>
          )}
        </div>

        <button className="icon-btn" onClick={() => supabase.auth.signOut()} title="Sign Out">
          <LogOut size={18} />
        </button>

        <div className="top-avatar">
          {session?.user?.user_metadata?.avatar_url ? (
            <img src={session.user.user_metadata.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            session?.user?.user_metadata?.full_name?.charAt(0) || userProfile.avatar
          )}
        </div>
      </div>
    </header>
  );
};
