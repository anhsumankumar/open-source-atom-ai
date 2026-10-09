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
  engineeringContext: { text: string; enabled: boolean; deepThinking?: boolean },
  onChunk?: (chunkInfo: { content: string, reasoning: string }) => void,
  signal?: AbortSignal
): Promise<{ content: string, reasoning: string, finishReason?: string }> => {
  
  // 1. Construct the payload array
  const payloadMessages: ChatMessage[] = [];
  
  // Base system prompt
  let finalSystemPrompt = atomEngineeringSystemPrompt;
  
  if (engineeringContext.deepThinking) {
    finalSystemPrompt += `\n\n[DEEP THINKING MODE ENABLED]\nCRITICAL INSTRUCTION: You are in Deep Thinking Mode. You must exhaustively analyze the problem. Think step-by-step in extreme detail. Generate maximum context, explore edge cases, provide mathematical proofs or deep architectural breakdowns if applicable, and leave no stone unturned. Your output should be comprehensive and jaw-droppingly detailed. Do not abbreviate or summarize; expand on everything. IMPORTANT: When providing code, group it logically into large, well-structured markdown code blocks (e.g. \`\`\`python). DO NOT create separate code blocks for every single line or filename. Use inline backticks (\`) for single words or filenames, not full code blocks.`;
  }
  
  payloadMessages.push({
    role: 'system',
    content: finalSystemPrompt
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
      signal,
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
    let finishReason = '';
    
    let lastUpdateTime = 0;
    const THROTTLE_MS = 250; // Update UI at most every 250ms (4 FPS)

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
            if (parsed.choices && parsed.choices.length > 0) {
              const choice = parsed.choices[0];
              
              if (choice.finish_reason) {
                finishReason = choice.finish_reason;
              }
              
              if (choice.delta) {
                const deltaContent = choice.delta.content || '';
                const reasoningContent = choice.delta.reasoning_content || '';
                
                if (deltaContent || reasoningContent) {
                  fullResponse += deltaContent;
                  fullReasoning += reasoningContent;
                  
                  if (onChunk) {
                    const now = Date.now();
                    if (now - lastUpdateTime > THROTTLE_MS) {
                      onChunk({ content: fullResponse, reasoning: fullReasoning });
                      lastUpdateTime = now;
                    }
                  }
                }
              }
            }
          } catch (e) {
            // ignore partial JSON parse errors
          }
        }
      }
    }

    // Ensure final chunk is always sent
    if (onChunk) {
      onChunk({ content: fullResponse, reasoning: fullReasoning });
    }

    return { content: fullResponse, reasoning: fullReasoning, finishReason };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Chat request aborted by user');
      throw error;
    }
    console.error('NVIDIA Service Error:', error);
    throw error;
  }
};
