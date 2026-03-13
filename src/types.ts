export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volume: string;
  high: number;
  low: number;
}

export interface Trade {
  id: string;
  price: number;
  amount: number;
  time: string;
  side: 'buy' | 'sell';
}

export interface BotSettings {
  maxTradeAmount: number;
  takeProfit: number;
  stopLoss: number;
  dailyStopLoss: number;
  isActive: boolean;
  isVoiceEnabled: boolean;
  selectedAssets: string[];
}

export interface BotLog {
  id: string;
  timestamp: string;
  action: 'buy' | 'sell' | 'hold' | 'info';
  message: string;
  symbol: string;
  price?: number;
}

