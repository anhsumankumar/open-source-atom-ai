import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import type { Conversation } from '../components/layout/Sidebar';
import type { Session } from '@supabase/supabase-js';
import { Topbar } from '../components/layout/Topbar';
import { HeroSection } from '../components/chat/HeroSection';
import { FeatureCards } from '../components/chat/FeatureCards';
import { ChatComposer } from '../components/chat/ChatComposer';
import { ChatRenderer } from '../components/chat/ChatRenderer';
import { ContextManager } from '../components/modals/ContextManager';
import { DataPrivacyModal } from '../components/modals/DataPrivacyModal';
import { AboutModal } from '../components/modals/AboutModal';
import { sendChatMessage } from '../services/nvidiaService';
import type { ChatMessage } from '../services/nvidiaService';
import { fetchConversations, fetchMessages, createConversation, saveMessage, deleteAllConversations } from '../services/chatService';
import { DEFAULT_MODEL_ID } from '../data/models';
import './Home.css';

interface HomeProps {
  session?: Session;
}

export const Home: React.FC<HomeProps> = ({ session }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Chat State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false); // Controls Stop button
  const [isWaitingForFirstChunk, setIsWaitingForFirstChunk] = useState(false); // Controls 'ATOM is thinking...'
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
  // Context State
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [engineeringContext, setEngineeringContext] = useState('');
  const [contextEnabled, setContextEnabled] = useState(true);
  
  // Privacy State
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  
  // About State
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    shouldAutoScroll.current = isNearBottom;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N for New Chat
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setMessages([]);
        setActiveConversationId(null);
        setComposerInitialValue('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      const data = await fetchConversations();
      setConversations(data);
    };
    loadConversations();
  }, []);

  useEffect(() => {
    if (scrollRef.current && messages.length > 0 && shouldAutoScroll.current) {
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

  const handleSelectConversation = async (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv && conv.model_id) {
      setSelectedModel(conv.model_id);
    }
    setActiveConversationId(id);
    
    // Fetch messages from Supabase
    setMessages([]); // clear immediately for visual feedback
    const chatHistory = await fetchMessages(id);
    setMessages(chatHistory);
  };

  const handleComposerTextChange = () => {
    // Model suggestion logic removed as per user request
  };

  const handleSendMessage = async (text: string) => {
    // Add user message locally
    const newUserMsg: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setIsTyping(true);
    setIsWaitingForFirstChunk(true);
    shouldAutoScroll.current = true; // Force auto-scroll on new message
    
    let currentConvId = activeConversationId;
    // Create conversation record if first message
    if (!currentConvId) {
      const title = text.slice(0, 30) + '...';
      const newConvId = await createConversation(title, selectedModel);
      if (newConvId) {
        currentConvId = newConvId;
        setActiveConversationId(newConvId);
        setConversations(prev => [{ id: newConvId, title, model_id: selectedModel }, ...prev]);
      }
    }

    if (currentConvId) {
      // Save user message to Supabase
      saveMessage(currentConvId, 'user', text);
    }

    try {
      // Append an empty assistant message first to start streaming into it
      const emptyAiMsg: ChatMessage = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, emptyAiMsg]);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      await sendChatMessage(
        newMessages, 
        selectedModel,
        { text: engineeringContext, enabled: contextEnabled },
        (chunkInfo) => {
          setIsWaitingForFirstChunk(false); 
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
        },
        abortController.signal
      );
      
      // Save final AI response to Supabase
      if (currentConvId) {
        // Need to grab the final message state from the current messages array isn't easy 
        // since state updates are asynchronous, but we can do it by using a state functional update trick,
        // or just by having sendChatMessage return the full final text, but our sendChatMessage doesn't return it.
        // We can just rely on a setTimeout or another effect, but the easiest way is to use a callback hook 
        // or just wait a tick. Actually, we can just save it after the promise resolves by looking at the last message.
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('User stopped the generation.');
        return; // Exit early, the partial message is already in state
      }
      
      console.error(error);
      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content === '') {
           updated[updated.length - 1] = { role: 'assistant', content: `**Error**: ${error.message}` };
           return updated;
        }
        return [...prev, { role: 'assistant', content: `**Error**: ${error.message}` }];
      });
    } finally {
      abortControllerRef.current = null;
      setIsTyping(false);
      setIsWaitingForFirstChunk(false);
      
      // Save final AI response to Supabase after a short delay so React state is fully updated
      if (currentConvId) {
         setTimeout(() => {
           setMessages(currentMessages => {
              const last = currentMessages[currentMessages.length - 1];
              if (last && last.role === 'assistant') {
                 // Save to DB
                 saveMessage(currentConvId!, last.role, last.content);
              }
              return currentMessages;
           });
         }, 500);
      }
    }
  };

  const handleStopMessage = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleSaveContext = async (newContext: string) => {
    // Phase 7: Save to Supabase
    setEngineeringContext(newContext);
    return Promise.resolve();
  };

  const handleClearData = async () => {
    await deleteAllConversations();
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

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  return (
    <div className="layout">
      <div 
        className={`mobile-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => {
          if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
          }
        }}
      />
      <Sidebar 
        session={session}
        isOpen={isSidebarOpen} 
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
      />
      
      <main className="main-content">
        <Topbar 
          session={session}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          isDarkTheme={isDarkTheme}
          toggleTheme={toggleTheme}
          onOpenContextManager={() => setIsContextModalOpen(true)}
          onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
          onOpenAboutModal={() => setIsAboutModalOpen(true)}
        />
        
        <div className="content-scrollable" ref={scrollRef} onScroll={handleScroll}>
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
              {isWaitingForFirstChunk && (
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
              onStop={handleStopMessage}
              initialValue={composerInitialValue}
              onAddContextClick={() => setIsContextModalOpen(true)}
              contextEnabled={contextEnabled}
              onContextEnabledChange={setContextEnabled}
              isTyping={isTyping}
              onTextChange={handleComposerTextChange}
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
      
      <DataPrivacyModal 
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onClearData={handleClearData}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
};
