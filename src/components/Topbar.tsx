import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, Moon, Sun, Monitor, ChevronDown, Check, Zap, Eye, Code2, BrainCircuit, Box, Sparkles } from 'lucide-react';
import { userProfile } from '../data/mockData';
import { availableModels } from '../data/models';
import { ThemeRope } from './ThemeRope';
import './Topbar.css';

interface TopbarProps {
  toggleSidebar: () => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  isDarkTheme?: boolean;
  toggleTheme?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ toggleSidebar, selectedModel, onModelChange, isDarkTheme, toggleTheme }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsDropdownOpen(false);
  };

  const categories = ['All', 'Engineering', 'Reasoning', 'Coding', 'Multimodal', 'Long Context', 'Fast', 'Agentic'];

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
      <button className="icon-btn sidebar-toggle-btn" onClick={toggleSidebar} style={{ display: 'none' }}>
        <Settings size={20} /> {/* Placeholder for hamburger */}
      </button>
      <div className="search-container">
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

        {toggleTheme && <ThemeRope isDarkTheme={!!isDarkTheme} toggleTheme={toggleTheme} />}

        <button className="icon-btn">
          <Settings size={20} />
        </button>

        <div className="top-avatar">
          {userProfile.avatar}
        </div>
      </div>
    </header>
  );
};
