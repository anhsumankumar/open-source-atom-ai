import React, { useState, useRef, useEffect } from 'react';
import { Triangle, ChevronDown, Send, Square } from 'lucide-react';
import './ChatComposer.css';

interface ChatComposerProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  initialValue?: string;
  onAddContextClick: () => void;
  contextEnabled: boolean;
  onContextEnabledChange: (enabled: boolean) => void;
  isTyping?: boolean;
  onTextChange?: (text: string) => void;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ 
  onSend, 
  initialValue = '',
  onAddContextClick,
  contextEnabled,
  onContextEnabledChange,
  isTyping = false,
  onStop,
  onTextChange
}) => {
  const [input, setInput] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const isMobile = window.innerWidth <= 768;
      if (!isMobile) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className="composer-container fade-in">
      <div className="composer-box">
        <textarea
          ref={textareaRef}
          className="composer-input"
          placeholder="Ask ATOM anything..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (onTextChange) onTextChange(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        
        <div className="composer-actions">
          <div className="actions-left">
            <button className="context-btn" onClick={onAddContextClick} disabled={isTyping}>
              <Triangle size={14} />
              <span>Add context</span>
              <ChevronDown size={14} />
            </button>
          </div>
          
          <div className="actions-right">
            {isTyping ? (
              <button className="send-btn stop-btn" onClick={onStop}>
                <Square size={14} fill="currentColor" />
              </button>
            ) : (
              <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
                <Send size={18} />
              </button>
            )}
          </div>
        </div>
        <div className="composer-footer">
          <label className="checkbox-wrapper">
            <input 
              type="checkbox" 
              checked={contextEnabled}
              onChange={(e) => onContextEnabledChange(e.target.checked)}
            />
            <span>Use my engineering context</span>
          </label>
          <span className="hint-text">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};
