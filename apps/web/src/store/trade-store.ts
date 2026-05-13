import { create } from 'zustand';

interface TradeState {
  selectedAsset: string | null;
  tradeType: 'BUY' | 'SELL';
  amount: number;
  stopLoss: number | null;
  takeProfit: number | null;
  duration: number;
  isDemo: boolean;
  setSelectedAsset: (asset: string | null) => void;
  setTradeType: (type: 'BUY' | 'SELL') => void;
  setAmount: (amount: number) => void;
  setStopLoss: (sl: number | null) => void;
  setTakeProfit: (tp: number | null) => void;
  setDuration: (duration: number) => void;
  setIsDemo: (isDemo: boolean) => void;
  reset: () => void;
}

const initialState = {
  selectedAsset: null,
  tradeType: 'BUY' as const,
  amount: 100,
  stopLoss: null,
  takeProfit: null,
  duration: 60,
  isDemo: false,
};

export const useTradeStore = create<TradeState>()((set) => ({
  ...initialState,
  setSelectedAsset: (selectedAsset) => set({ selectedAsset }),
  setTradeType: (tradeType) => set({ tradeType }),
  setAmount: (amount) => set({ amount }),
  setStopLoss: (stopLoss) => set({ stopLoss }),
  setTakeProfit: (takeProfit) => set({ takeProfit }),
  setDuration: (duration) => set({ duration }),
  setIsDemo: (isDemo) => set({ isDemo }),
  reset: () => set(initialState),
}));
