import { create } from 'zustand';

interface MarketState {
  prices: Record<string, number>;
  lastUpdate: number;
  setPrices: (prices: Record<string, number>) => void;
  updatePrice: (symbol: string, price: number) => void;
}

export const useMarketStore = create<MarketState>()((set) => ({
  prices: {},
  lastUpdate: Date.now(),
  setPrices: (prices) => set({ prices, lastUpdate: Date.now() }),
  updatePrice: (symbol, price) =>
    set((state) => ({
      prices: { ...state.prices, [symbol]: price },
      lastUpdate: Date.now(),
    })),
}));
