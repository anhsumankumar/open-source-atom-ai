import { atomEngineeringSystemPrompt } from '../prompts/atomEngineeringSystemPrompt';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  reasoning?: string;
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    }
  }>;
}

export const buildEngineeringContext = (contextText: string, enabled: boolean): ChatMessage | null => {
  if (!enabled || !contextText || contextText.trim() === '') {
    return null;
  }
  
  return {
    role: 'system',
    content: `[ENGINEERING CONTEXT]\nThe following is the user's specific engineering context. Use this to adapt your answers to their level, branch, and syllabus where relevant:\n\n${contextText.trim()}`
  };
};

export const determineAutoModel = (messages: ChatMessage[], contextText: string): string => {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content.toLowerCase() || '';
  
  // 1. Extremely long context
  if (contextText.length > 50000 || lastUserMessage.length > 50000) {
    return "nvidia/nemotron-3-super-120b-a12b";
  }

  // 2. Complex reasoning
  if (
    lastUserMessage.includes('derive') || 
    lastUserMessage.includes('prove') || 
    lastUserMessage.includes('complex analysis') || 
    lastUserMessage.includes('advanced')
  ) {
    return "nvidia/nemotron-3-ultra-550b-a55b";
  }

  // 3. Coding tasks
  if (
    lastUserMessage.includes('code') || 
    lastUserMessage.includes('function') || 
    lastUserMessage.includes('bug') || 
    lastUserMessage.includes('script')
  ) {
    return "nvidia/nemotron-3-super-120b-a12b";
  }

  // 4. Fast simple math or quick questions
  if (
    lastUserMessage.includes('calculate') || 
    (lastUserMessage.length < 50) ||
    lastUserMessage.includes('fast')
  ) {
    return "nvidia/nemotron-3.5-lightning-30b-a3b";
  }

  // Fallback to Engineering Default
  return "nvidia/nemotron-3-super-120b-a12b";
};

export const sendChatMessage = async (
  messages: ChatMessage[], 
  modelId: string,
  engineeringContext: { text: string; enabled: boolean },
  onChunk?: (chunkInfo: { content: string, reasoning: string }) => void
): Promise<{ content: string, reasoning: string }> => {
  
  // 1. Construct the payload array
  const payloadMessages: ChatMessage[] = [];
  
  // Base system prompt
  payloadMessages.push({
    role: 'system',
    content: atomEngineeringSystemPrompt
  });
  
  // Optional Engineering Context
  const contextMsg = buildEngineeringContext(engineeringContext.text, engineeringContext.enabled);
  if (contextMsg) {
    payloadMessages.push(contextMsg);
  }
  
  // Add the actual conversation history
  payloadMessages.push(...messages);

  try {
    // Resolve ATOM Auto
    const resolvedModelId = modelId === 'atom-auto' 
      ? determineAutoModel(messages, engineeringContext.enabled ? engineeringContext.text : '') 
      : modelId;

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: resolvedModelId,
        messages: payloadMessages
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    if (!response.body) {
      const data: ChatResponse = await response.json();
      return { content: data.choices?.[0]?.message?.content || '', reasoning: '' };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullResponse = '';
    let fullReasoning = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // keep incomplete line
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            if (parsed.choices && parsed.choices[0]?.delta) {
              const deltaContent = parsed.choices[0].delta.content || '';
              const reasoningContent = parsed.choices[0].delta.reasoning_content || '';
              
              if (deltaContent || reasoningContent) {
                fullResponse += deltaContent;
                fullReasoning += reasoningContent;
                if (onChunk) {
                  onChunk({ content: fullResponse, reasoning: fullReasoning });
                }
              }
            }
          } catch (e) {
            // ignore partial JSON parse errors
          }
        }
      }
    }

    // Stream finished, append a visual indicator
    if (fullResponse.trim().length > 0) {
      fullResponse += "\n\n— ATOM ✨";
      if (onChunk) {
        onChunk({ content: fullResponse, reasoning: fullReasoning });
      }
    }

    return { content: fullResponse, reasoning: fullReasoning };
  } catch (error) {
    console.error('NVIDIA Service Error:', error);
    throw error;
  }
};
