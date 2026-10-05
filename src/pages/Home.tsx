import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import type { Conversation } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { HeroSection } from '../components/HeroSection';
import { FeatureCards } from '../components/FeatureCards';
import { ChatComposer } from '../components/ChatComposer';
import { ChatRenderer } from '../components/ChatRenderer';
import { ContextManager } from '../components/ContextManager';
import { sendChatMessage } from '../services/nvidiaService';
import type { ChatMessage } from '../services/nvidiaService';
import { DEFAULT_MODEL_ID } from '../data/models';
import './Home.css';

export const Home: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Chat State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [composerInitialValue, setComposerInitialValue] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_ID);
  
  // Theme State
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);
  
  // Suggestion State
  const [suggestion, setSuggestion] = useState<{ text: string; actionText: string; targetModel: string } | null>(null);

  // Context State
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [engineeringContext, setEngineeringContext] = useState('');
  const [contextEnabled, setContextEnabled] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleCardClick = (prompt: string) => {
    setComposerInitialValue(prompt);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
    setComposerInitialValue('');
  };

  const handleSelectConversation = (id: string) => {
    // Phase 7: Fetch from Supabase
    // For now, it just resets since it's mock state
    const conv = conversations.find(c => c.id === id);
    if (conv && conv.model_id) {
      setSelectedModel(conv.model_id);
    }
    setActiveConversationId(id);
    setMessages([]);
  };

  const handleComposerTextChange = (text: string) => {
    if (selectedModel === 'atom-auto') {
      setSuggestion(null);
      return;
    }

    const lower = text.toLowerCase();
    
    // Large context
    if (text.length > 20000 || (lower.includes('entire syllabus') || lower.includes('massive document'))) {
      if (selectedModel !== 'nvidia/nemotron-3-super-120b-a12b') {
        setSuggestion({
          text: "Large context detected — Nemotron 3 Super may be a better fit.",
          actionText: "Use Nemotron 3 Super",
          targetModel: "nvidia/nemotron-3-super-120b-a12b"
        });
        return;
      }
    }

    // Advanced Reasoning
    if (lower.includes('derive') || lower.includes('prove') || lower.includes('complex logic')) {
      if (selectedModel !== 'nvidia/nemotron-3-ultra-550b-a55b') {
        setSuggestion({
          text: "Advanced reasoning model available.",
          actionText: "Use Nemotron 3 Ultra",
          targetModel: "nvidia/nemotron-3-ultra-550b-a55b"
        });
        return;
      }
    }
    
    // Coding
    if (lower.includes('function') || lower.includes('def') || lower.includes('class ') || lower.includes('debug')) {
      if (!selectedModel.includes('glm') && !selectedModel.includes('laguna') && !selectedModel.includes('lightning')) {
        setSuggestion({
          text: "Coding task detected. A specialized coding model may perform better.",
          actionText: "Use GLM-5-3",
          targetModel: "deepseek-ai/deepseek-coder-6.7b-instruct"
        });
        return;
      }
    }

    setSuggestion(null);
  };

  const handleSendMessage = async (text: string) => {
    // Add user message
    const newUserMsg: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setIsTyping(true);
    
    // Create conversation record if first message
    if (!activeConversationId) {
      const newConvId = Date.now().toString();
      setActiveConversationId(newConvId);
      setConversations(prev => [{ id: newConvId, title: text.slice(0, 30) + '...', model_id: selectedModel }, ...prev]);
    }

    try {
      // Append an empty assistant message first to start streaming into it
      const emptyAiMsg: ChatMessage = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, emptyAiMsg]);

      await sendChatMessage(
        newMessages, 
        selectedModel,
        { text: engineeringContext, enabled: contextEnabled },
        (chunkInfo) => {
          // If we receive the first chunk, ATOM is no longer just 'thinking'
          setIsTyping(false); 
          
          // Update the last message (the assistant one) with the accumulated chunks
          setMessages(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg && lastMsg.role === 'assistant') {
              updated[updated.length - 1] = { 
                ...lastMsg, 
                content: chunkInfo.content, 
                reasoning: chunkInfo.reasoning 
              };
            }
            return updated;
          });
        }
      );
    } catch (error: any) {
      console.error(error);
      setMessages(prev => {
        // If it failed, we replace the empty assistant message we created with an error
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content === '') {
           updated[updated.length - 1] = { role: 'assistant', content: `**Error**: ${error.message}` };
           return updated;
        }
        return [...prev, { role: 'assistant', content: `**Error**: ${error.message}` }];
      });
    } finally {
      setIsTyping(false);
      setSuggestion(null); // Clear suggestion after sending
    }
  };

  const handleSaveContext = async (newContext: string) => {
    // Phase 7: Save to Supabase
    setEngineeringContext(newContext);
    return Promise.resolve();
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    
    // Update active conversation's model
    if (activeConversationId) {
      setConversations(prev => prev.map(c => 
        c.id === activeConversationId ? { ...c, model_id: modelId } : c
      ));
    }
  };

  return (
    <div className="layout">
      <Sidebar 
        isOpen={isSidebarOpen} 
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
      
      <main className="main-content">
        <Topbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          isDarkTheme={isDarkTheme}
          toggleTheme={() => setIsDarkTheme(!isDarkTheme)}
        />
        
        <div className="content-scrollable" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="empty-state">
              <HeroSection />
              <FeatureCards onCardClick={handleCardClick} />
            </div>
          ) : (
            <div className="chat-state fade-in">
              {messages.map((msg, idx) => (
                <ChatRenderer key={idx} content={msg.content} isUser={msg.role === 'user'} reasoning={msg.reasoning} />
              ))}
              {isTyping && (
                <div className="message atom-message fade-in">
                  <div className="message-content handwriting-text" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                    ATOM is thinking...
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="composer-wrapper">
            {messages.length === 0 && (
              <div className="motivation-text fade-in">
                " <span className="motivation-highlight">Small Steps Today</span> <span style={{display: 'inline-block', margin: '0 12px'}}>→</span> Big Engineers Tomorrow " <span style={{marginLeft: '8px', fontSize: '1.2em'}}>:)</span>
              </div>
            )}
            <ChatComposer 
              onSend={handleSendMessage} 
              initialValue={composerInitialValue}
              onAddContextClick={() => setIsContextModalOpen(true)}
              contextEnabled={contextEnabled}
              onContextEnabledChange={setContextEnabled}
              isTyping={isTyping}
              onTextChange={handleComposerTextChange}
              suggestion={suggestion ? {
                text: suggestion.text,
                actionText: suggestion.actionText,
                onAction: () => {
                  setSelectedModel(suggestion.targetModel);
                  setSuggestion(null);
                }
              } : null}
            />
          </div>
        </div>
      </main>

      <ContextManager 
        isOpen={isContextModalOpen} 
        onClose={() => setIsContextModalOpen(false)}
        initialContext={engineeringContext}
        onSave={handleSaveContext}
      />
    </div>
  );
};
