import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Triangle, ChevronDown, Send } from 'lucide-react';
import './ChatComposer.css';

interface ChatComposerProps {
  onSend: (message: string) => void;
  initialValue?: string;
  onAddContextClick: () => void;
  contextEnabled: boolean;
  onContextEnabledChange: (enabled: boolean) => void;
  isTyping?: boolean;
  onTextChange?: (text: string) => void;
  suggestion?: {
    text: string;
    actionText: string;
    onAction: () => void;
  } | null;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ 
  onSend, 
  initialValue = '',
  onAddContextClick,
  contextEnabled,
  onContextEnabledChange,
  isTyping = false,
  onTextChange,
  suggestion
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
      e.preventDefault();
      handleSend();
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
      {suggestion && (
        <div className="model-suggestion-banner fade-in">
          <span className="suggestion-text">{suggestion.text}</span>
          <button className="suggestion-action" onClick={suggestion.onAction}>
            {suggestion.actionText}
          </button>
        </div>
      )}
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
            <button className="icon-btn-small">
              <Paperclip size={18} />
            </button>
            <button className="context-btn" onClick={onAddContextClick} disabled={isTyping}>
              <Triangle size={14} />
              <span>Add context</span>
              <ChevronDown size={14} />
            </button>
          </div>
          
          <div className="actions-right">
            <button className="send-btn" onClick={handleSend} disabled={isTyping || !input.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="composer-footer">
        <label className="checkbox-wrapper">
          <input 
            type="checkbox" 
            checked={contextEnabled}
            onChange={(e) => onContextEnabledChange(e.target.checked)}
          />
          <span>Use my engineering context (notes, subjects, etc.)</span>
        </label>
        <span className="hint-text">Press Enter to send</span>
      </div>
    </div>
  );
};
