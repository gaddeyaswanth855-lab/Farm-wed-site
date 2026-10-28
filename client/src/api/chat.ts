import { api } from './client';
import { ChatMessage } from '../types';

export async function sendChatMessageApi(payload: {
  messageText: string;
  currentPlotId?: string;
}): Promise<ChatMessage> {
  return api.post<ChatMessage>('/chat/message', payload);
}

export async function fetchChatHistoryApi(): Promise<ChatMessage[]> {
  return api.get<ChatMessage[]>('/chat/history');
}
