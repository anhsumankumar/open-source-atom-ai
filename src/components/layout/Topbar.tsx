import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, Settings, Menu, Monitor, ChevronDown, Check, Zap, Eye, Code2, 
  BrainCircuit, Box, Sparkles, LogOut, X, Send, BookOpen, MessageSquare 
} from 'lucide-react';
import { userProfile } from '../../data/mockData';
import { availableModels } from '../../data/models';
import { searchableSyllabus } from '../../data/syllabusSearchData';
import type { Conversation } from './Sidebar';
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
  conversations?: Conversation[];
  onSelectConversation?: (id: string) => void;
  onSearchAsk?: (query: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ 
  session, 
  toggleSidebar, 
  selectedModel, 
  onModelChange, 
  isDarkTheme, 
  toggleTheme, 
  onOpenContextManager, 
  onOpenPrivacyModal, 
  onOpenAboutModal, 
  isSidebarOpen,
  conversations = [],
  onSelectConversation,
  onSearchAsk
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeCategory] = useState<string>('All');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcut: Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsDropdownOpen(false);
  };

  const filteredModels = availableModels.filter(m =>
    activeCategory === 'All' ? true : m.category.includes(activeCategory as any)
  );

  const currentModel = availableModels.find(m => m.id === selectedModel) || availableModels[0];

  // Search filtering logic
  const cleanTerm = searchTerm.trim().toLowerCase();

  const filteredSyllabus = useMemo(() => {
    if (!cleanTerm) {
      // Default to subjects list
      return searchableSyllabus.filter(item => item.category === 'Subject');
    }
    return searchableSyllabus.filter(item => 
      item.title.toLowerCase().includes(cleanTerm) || 
      item.subject.toLowerCase().includes(cleanTerm)
    ).slice(0, 5);
  }, [cleanTerm]);

  const filteredConversations = useMemo(() => {
    if (!conversations || conversations.length === 0) return [];
    if (!cleanTerm) {
      return conversations.slice(0, 3);
    }
    return conversations.filter(c => 
      c.title.toLowerCase().includes(cleanTerm)
    ).slice(0, 4);
  }, [conversations, cleanTerm]);

  const handleSearchSubmit = (textToAsk?: string) => {
    const query = textToAsk || searchTerm.trim();
    if (!query) return;
    if (onSearchAsk) {
      onSearchAsk(query);
    }
    setSearchTerm('');
    setIsSearchOpen(false);
    searchInputRef.current?.blur();
  };

  const handleSelectTopic = (query: string) => {
    if (onSearchAsk) {
      onSearchAsk(query);
    }
    setSearchTerm('');
    setIsSearchOpen(false);
    searchInputRef.current?.blur();
  };

  const handleSelectChat = (id: string) => {
    if (onSelectConversation) {
      onSelectConversation(id);
    }
    setSearchTerm('');
    setIsSearchOpen(false);
    searchInputRef.current?.blur();
  };

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

      {/* Fully Functional Search Bar */}
      <div className="search-container desktop-only" ref={searchContainerRef}>
        <Search size={18} color="var(--text-secondary)" className="search-icon" />
        <input
          ref={searchInputRef}
          type="text"
          className="search-input"
          placeholder="Search notes, subjects, or ask anything..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearchSubmit();
            }
          }}
        />
        {searchTerm && (
          <button 
            type="button" 
            className="search-clear-btn" 
            onClick={() => {
              setSearchTerm('');
              searchInputRef.current?.focus();
            }}
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
        <span className="search-shortcut">Ctrl + K</span>

        {/* Live Search Results Dropdown */}
        {isSearchOpen && (
          <div className="search-dropdown">
            {searchTerm.trim() && (
              <button 
                type="button"
                className="search-item search-item-ask"
                onClick={() => handleSearchSubmit()}
              >
                <div className="search-item-icon">
                  <Send size={15} color="var(--primary-accent)" />
                </div>
                <div className="search-item-content">
                  <div className="search-item-title">Ask ATOM: "{searchTerm.trim()}"</div>
                  <div className="search-item-sub">Press Enter to ask immediately 🚀</div>
                </div>
              </button>
            )}

            {filteredSyllabus.length > 0 && (
              <div className="search-section">
                <div className="search-section-header">
                  <BookOpen size={12} />
                  <span>{searchTerm.trim() ? "Syllabus & Subjects" : "Semester-V Subjects"}</span>
                </div>
                {filteredSyllabus.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="search-item"
                    onClick={() => handleSelectTopic(item.query)}
                  >
                    <div className="search-item-icon">
                      <BookOpen size={15} />
                    </div>
                    <div className="search-item-content">
                      <div className="search-item-title">{item.title}</div>
                      <div className="search-item-sub">{item.subject}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {filteredConversations.length > 0 && (
              <div className="search-section">
                <div className="search-section-header">
                  <MessageSquare size={12} />
                  <span>{searchTerm.trim() ? "Matching Chats" : "Recent Chats"}</span>
                </div>
                {filteredConversations.map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    className="search-item"
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    <div className="search-item-icon">
                      <MessageSquare size={15} />
                    </div>
                    <div className="search-item-content">
                      <div className="search-item-title">{chat.title}</div>
                      <div className="search-item-sub">Open conversation</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {filteredSyllabus.length === 0 && filteredConversations.length === 0 && !searchTerm.trim() && (
              <div className="search-empty-state">
                <span>Type to search Semester-V subjects, syllabus topics, or notes.</span>
              </div>
            )}
          </div>
        )}
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
