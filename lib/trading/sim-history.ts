// In-memory history for simulator chats/trades (volatile; cleared on server restart)

export interface SimTradingItem {
  id: string;
  symbol: string;
  opeartion: 'Buy' | 'Sell' | 'Hold';
  pricing?: number;
  amount?: number;
  leverage?: number;
  createdAt: string;
}

export interface SimChatItem {
  id: string;
  model: string;
  chat: string;
  reasoning: string;
  userPrompt: string;
  tradings: SimTradingItem[];
  createdAt: string;
  updatedAt: string;
}

const MAX_ITEMS = 50;
const history: SimChatItem[] = [];

export function addSimChat(item: SimChatItem) {
  history.unshift(item);
  if (history.length > MAX_ITEMS) history.pop();
}

export function getSimChats(limit = 20): SimChatItem[] {
  return history.slice(0, limit);
}


