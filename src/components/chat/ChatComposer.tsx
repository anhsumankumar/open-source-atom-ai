import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Triangle, ChevronDown, Send, Square, Mic, MicOff } from 'lucide-react';
import './ChatComposer.css';

// Declare SpeechRecognition for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

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
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false; // More stable on desktop/mobile
      recognition.lang = 'hi-IN'; // Fallback to English later if needed, but Hindi/English mixed works best with hi-IN or en-IN

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;
            setInput(prev => prev + transcript + ' ');
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

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
            {recognitionRef.current && (
              <button 
                className={`icon-btn-small mic-btn ${isListening ? 'listening' : ''}`} 
                onClick={toggleListening}
                disabled={isTyping}
                title="Voice Input"
              >
                {isListening ? <MicOff size={18} color="var(--primary-accent)" /> : <Mic size={18} />}
              </button>
            )}
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
