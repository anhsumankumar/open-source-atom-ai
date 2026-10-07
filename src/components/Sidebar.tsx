import React, { useRef, useEffect } from 'react';
import { Code, BookOpen, Plus, Info, MessageSquare } from 'lucide-react';
import { userProfile } from '../data/mockData';
import type { Session } from '@supabase/supabase-js';
import './Sidebar.css';

export interface Conversation {
  id: string;
  title: string;
  model_id: string;
}

interface SidebarProps {
  session?: Session;
  isOpen: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onOpenAboutModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  session,
  isOpen, 
  conversations, 
  activeConversationId, 
  onNewChat, 
  onSelectConversation,
  onOpenAboutModal
}) => {
  const isResizing = useRef(false);

  const startResizing = () => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing.current) {
      let newWidth = e.clientX;
      if (newWidth < 200) newWidth = 200; // min width
      if (newWidth > 600) newWidth = 600; // max width
      document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
    }
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
  };

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, []);

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
        <button className="mode-btn" onClick={() => alert("Developer Mode coming soon! 🛠️")}>
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
          <div className="avatar">
            {session?.user?.user_metadata?.avatar_url ? (
              <img src={session.user.user_metadata.avatar_url} alt="User Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              session?.user?.user_metadata?.full_name?.charAt(0) || userProfile.avatar
            )}
          </div>
          <div className="user-details">
            <span className="user-name">{session?.user?.user_metadata?.full_name || userProfile.name}</span>
          </div>
        </div>
        <button className="icon-btn" onClick={onOpenAboutModal} title="About ATOM">
          <Info size={18} className="recent-icon" />
        </button>
      </div>

      <div className="sidebar-resizer" onMouseDown={startResizing} />
    </aside>
  );
};
