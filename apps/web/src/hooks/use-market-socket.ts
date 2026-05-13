'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useMarketStore } from '@/store/market-store';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function useMarketSocket() {
  const socketRef = useRef<Socket | null>(null);
  const setPrices = useMarketStore((s) => s.setPrices);
  const updatePrice = useMarketStore((s) => s.updatePrice);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      console.log('[MarketSocket] Connected:', socket.id);
    });

    socket.on('prices', (data: Record<string, number>) => {
      setPrices(data);
    });

    socket.on('price-update', (data: Record<string, number>) => {
      setPrices(data);
    });

    socket.on('price-change', (data: { symbol: string; price: number }) => {
      updatePrice(data.symbol, data.price);
    });

    socket.on('disconnect', (reason) => {
      console.log('[MarketSocket] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('[MarketSocket] Connection error:', err.message);
    });

    socketRef.current = socket;
  }, [setPrices, updatePrice]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { connect, disconnect };
}
