import { supabase, getCurrentUserId } from '../lib/supabase';
import type { Conversation } from '../components/Sidebar';
import type { ChatMessage } from './nvidiaService';

export const fetchConversations = async (): Promise<Conversation[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
  return data as Conversation[];
};

export const fetchMessages = async (conversationId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data as ChatMessage[];
};

export const createConversation = async (title: string, modelId: string): Promise<string | null> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('conversations')
    .insert([{ user_id: userId, title, model_id: modelId }])
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
  return data.id;
};

export const saveMessage = async (conversationId: string, role: string, content: string) => {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from('messages')
    .insert([{ 
      conversation_id: conversationId, 
      user_id: userId, 
      role, 
      content 
    }]);

  if (error) {
    console.error('Error saving message:', error);
  }
};

export const deleteAllConversations = async () => {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error deleting conversations:', error);
    throw error;
  }
};
