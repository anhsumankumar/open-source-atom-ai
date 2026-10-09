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
import { fetchConversations, fetchMessages, createConversation, saveMessage, deleteAllConversations } from '../services/chatService';
import type { DBMessage } from '../services/chatService';
import type { ChatMessage } from '../services/nvidiaService';
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
  const [allMessages, setAllMessages] = useState<DBMessage[]>([]);
  const [activeLeafId, setActiveLeafId] = useState<string | null>(null);
  
  const messages = React.useMemo(() => {
    const branch: DBMessage[] = [];
    let curr = allMessages.find(m => m.id === activeLeafId);
    while (curr) {
      branch.unshift(curr);
      curr = allMessages.find(m => m.id === curr.parent_id);
    }
    return branch;
  }, [allMessages, activeLeafId]);

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
  
  // AI Settings State
  const [deepThinkingEnabled, setDeepThinkingEnabled] = useState(false);
  
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
    // Use a very small threshold so the user can easily "escape" the auto-scroll by scrolling up slightly.
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 20;
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
    setAllMessages([]);
    setActiveLeafId(null);
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
    setAllMessages([]); // clear immediately for visual feedback
    setActiveLeafId(null);
    const chatHistory = await fetchMessages(id);
    setAllMessages(chatHistory);
    if (chatHistory.length > 0) {
      setActiveLeafId(chatHistory[chatHistory.length - 1].id);
    }
  };

  const handleComposerTextChange = () => {
    // Model suggestion logic removed as per user request
  };

  const generateAiResponse = async (currentConvId: string, userMsgId: string, baseMessages: ChatMessage[]) => {
    const aiMsgId = crypto.randomUUID();
    const emptyAiMsg: DBMessage = { id: aiMsgId, parent_id: userMsgId, role: 'assistant', content: '' };
    
    setAllMessages(prev => [...prev, emptyAiMsg]);
    setActiveLeafId(aiMsgId);
    
    setIsTyping(true);
    setIsWaitingForFirstChunk(true);
    shouldAutoScroll.current = true;
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      let isFinished = false;
      let currentMessagesForApi = [...baseMessages];
      let cumulativeResponse = '';
      let cumulativeReasoning = '';
      let continuationCount = 0;
      let finalCleanResponse = '';
      const MAX_CONTINUATIONS = 3;
      
      while (!isFinished && !abortControllerRef.current?.signal.aborted && continuationCount <= MAX_CONTINUATIONS) {
        const finalResult = await sendChatMessage(
          currentMessagesForApi, 
          selectedModel,
          { text: engineeringContext, enabled: contextEnabled, deepThinking: deepThinkingEnabled },
          (chunkInfo) => {
            setIsWaitingForFirstChunk(false); 
            setAllMessages(prev => prev.map(m => {
              if (m.id === aiMsgId) {
                const totalContent = cumulativeResponse + chunkInfo.content;
                const totalReasoning = cumulativeReasoning + chunkInfo.reasoning;
                const cleanContent = totalContent.replace(/<UPDATE_MEMORY>[\s\S]*?(?:<\/UPDATE_MEMORY>|$)/g, '');
                return { ...m, content: cleanContent, reasoning: totalReasoning };
              }
              return m;
            }));
          },
          abortControllerRef.current.signal
        );
        
        cumulativeResponse += finalResult.content;
        cumulativeReasoning += finalResult.reasoning;
        
        if (finalResult.finishReason === 'length') {
          continuationCount++;
          // Prepare for the next loop
          currentMessagesForApi = [
             ...currentMessagesForApi,
             { role: 'assistant', content: finalResult.content },
             { role: 'user', content: 'Your previous response was cut off because it reached the maximum length limit. Please provide ONLY the remaining part of your response. Start exactly from the very next word/character where you left off. DO NOT repeat any of the code or text you have already written above.' }
          ];
        } else {
          isFinished = true;
        }
      }
      
      let cleanResponse = cumulativeResponse;
      const memoryMatches = cumulativeResponse.match(/<UPDATE_MEMORY>([\s\S]*?)<\/UPDATE_MEMORY>/g);
      
      if (memoryMatches) {
        cleanResponse = cumulativeResponse.replace(/<UPDATE_MEMORY>[\s\S]*?(?:<\/UPDATE_MEMORY>|$)/g, '').trim();
        const newFacts = memoryMatches.map(m => m.replace(/<\/?UPDATE_MEMORY>/g, '').trim()).join('\n');
        if (newFacts) {
          const updatedContext = engineeringContext 
            ? `${engineeringContext}\n\n[Added by ATOM]\n${newFacts}`
            : `[Added by ATOM]\n${newFacts}`;
          handleSaveContext(updatedContext);
        }
      }
      
      if (currentConvId) {
        saveMessage(currentConvId, 'assistant', cleanResponse, userMsgId, aiMsgId);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('User stopped the generation.');
        return;
      }
      console.error(error);
      setAllMessages(prev => prev.map(m => {
        if (m.id === aiMsgId && m.content === '') {
          return { ...m, content: `**Error**: ${error.message}` };
        }
        return m;
      }));
    } finally {
      abortControllerRef.current = null;
      setIsTyping(false);
      setIsWaitingForFirstChunk(false);
    }
  };

  const handleSendMessage = async (text: string, parentId: string | null = activeLeafId) => {
    const userMsgId = crypto.randomUUID();
    const newUserMsg: DBMessage = { id: userMsgId, parent_id: parentId, role: 'user', content: text };
    
    setAllMessages(prev => [...prev, newUserMsg]);
    setActiveLeafId(userMsgId);
    shouldAutoScroll.current = true;
    
    let currentConvId = activeConversationId;
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
      saveMessage(currentConvId, 'user', text, parentId, userMsgId);
    }

    const messagesForApi = [...messages, newUserMsg];
    await generateAiResponse(currentConvId!, userMsgId, messagesForApi);
  };

  const handleStopMessage = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleEditMessage = async (msgId: string, newContent: string) => {
    const msg = allMessages.find(m => m.id === msgId);
    if (msg) {
      handleSendMessage(newContent, msg.parent_id);
    }
  };

  const handleRegenerateMessage = async (msgId: string) => {
    const msg = allMessages.find(m => m.id === msgId);
    if (msg && msg.role === 'user' && activeConversationId) {
      // Find the message path up to this user message
      const branch: DBMessage[] = [];
      let curr: DBMessage | undefined = msg;
      while (curr) {
        branch.unshift(curr);
        curr = allMessages.find(m => m.id === curr?.parent_id);
      }
      await generateAiResponse(activeConversationId, msg.id, branch);
    }
  };

  const handleSaveContext = async (newContext: string) => {
    // Phase 7: Save to Supabase (also save to localStorage for immediate persist)
    setEngineeringContext(newContext);
    localStorage.setItem('atom_engineering_context', newContext);
    return Promise.resolve();
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('atom_engineering_context');
    if (saved) {
      setEngineeringContext(saved);
    }
  }, []);

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
              {messages.map((msg) => {
                const siblings = allMessages.filter(m => m.parent_id === msg.parent_id);
                const currentIndex = siblings.findIndex(m => m.id === msg.id);
                
                const handleNextBranch = () => {
                  if (currentIndex < siblings.length - 1) {
                    const nextSiblingId = siblings[currentIndex + 1].id;
                    // Find the deepest leaf in this new branch
                    let deepestLeaf = nextSiblingId;
                    let currentSearch = nextSiblingId;
                    while (true) {
                      const child = allMessages.find(m => m.parent_id === currentSearch);
                      if (child) {
                        currentSearch = child.id;
                        deepestLeaf = child.id;
                      } else {
                        break;
                      }
                    }
                    setActiveLeafId(deepestLeaf);
                  }
                };

                const handlePrevBranch = () => {
                  if (currentIndex > 0) {
                    const prevSiblingId = siblings[currentIndex - 1].id;
                    let deepestLeaf = prevSiblingId;
                    let currentSearch = prevSiblingId;
                    while (true) {
                      const child = allMessages.find(m => m.parent_id === currentSearch);
                      if (child) {
                        currentSearch = child.id;
                        deepestLeaf = child.id;
                      } else {
                        break;
                      }
                    }
                    setActiveLeafId(deepestLeaf);
                  }
                };

                return (
                  <ChatRenderer 
                    key={msg.id} 
                    content={msg.content} 
                    isUser={msg.role === 'user'} 
                    reasoning={msg.reasoning}
                    siblingCount={siblings.length}
                    currentIndex={currentIndex}
                    onNextBranch={handleNextBranch}
                    onPrevBranch={handlePrevBranch}
                    onEdit={msg.role === 'user' ? (newContent) => handleEditMessage(msg.id, newContent) : undefined}
                    onRegenerate={msg.role === 'user' && !isTyping ? () => handleRegenerateMessage(msg.id) : undefined}
                  />
                );
              })}
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
              deepThinkingEnabled={deepThinkingEnabled}
              onDeepThinkingChange={setDeepThinkingEnabled}
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
