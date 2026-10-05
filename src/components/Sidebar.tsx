import React from 'react';
import { Code, BookOpen, Plus, Settings, MessageSquare } from 'lucide-react';
import { userProfile } from '../data/mockData';
import './Sidebar.css';

export interface Conversation {
  id: string;
  title: string;
  model_id: string;
}

interface SidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  conversations, 
  activeConversationId, 
  onNewChat, 
  onSelectConversation 
}) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand">
        <div className="logo-row">
          <div style={{ position: 'relative', width: '32px', height: '32px', marginRight: '4px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" fill="white" />
              <circle cx="6" cy="6" r="2" fill="currentColor"/>
              <circle cx="18" cy="18" r="2" fill="currentColor"/>
              <circle cx="18" cy="6" r="2" fill="currentColor"/>
              <path d="M6 6L12 12M18 6L12 12M18 18L12 12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5"/>
            </svg>
          </div>
          <span className="logo-text">ATOM</span>
        </div>
        <span className="tagline">Think · Learn · Build</span>
      </div>

      <div className="mode-switcher">
        <button className="mode-btn">
          <Code size={18} />
          <span>Developer Mode</span>
        </button>
        <button className="mode-btn active">
          <BookOpen size={18} />
          <span>Engineering Mode</span>
        </button>
      </div>

      <button className="new-chat-btn" onClick={onNewChat}>
        <div className="new-chat-left">
          <Plus size={18} />
          <span>New Chat</span>
        </div>
        <span className="shortcut">Ctrl + N</span>
      </button>

      <div className="recent-chats-header">
        <span className="recent-title">Recent Chats</span>
        <span className="see-all">See all</span>
      </div>

      <div className="recent-list">
        {conversations.length === 0 ? (
          <div className="recent-item" style={{ opacity: 0.5 }}>
            <span style={{ fontSize: '12px' }}>No recent chats</span>
          </div>
        ) : (
          conversations.map((chat) => (
            <div 
              key={chat.id} 
              className={`recent-item ${activeConversationId === chat.id ? 'active' : ''}`}
              onClick={() => onSelectConversation(chat.id)}
            >
              <MessageSquare size={14} className="recent-icon" />
              <span>{chat.title}</span>
            </div>
          ))
        )}
      </div>

      <div className="user-profile">
        <div className="user-info-row">
          <div className="avatar">{userProfile.avatar}</div>
          <div className="user-details">
            <span className="user-name">{userProfile.name}</span>
            <span className="user-plan">{userProfile.plan}</span>
          </div>
        </div>
        <Settings size={18} className="recent-icon" />
      </div>
    </aside>
  );
};
